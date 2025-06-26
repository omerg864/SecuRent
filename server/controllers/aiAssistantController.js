 import asyncHandler from "express-async-handler";
import Business from "../models/businessModel.js";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

function buildChatAdvisorPrompts(business) {
    const { name, category, insights, reviewSummary, address } = business;

    const systemPrompt = `
        You are a seasoned business advisor who helps small business owners reflect on their current business status, understand customer perception, and get actionable suggestions to improve.

        🔁 Start structured only if it's the user's first message or if they ask for an assessment.
        💬 Switch to free, human-style conversation after the first interaction.
        Always adapt your tone to the user.

        When in structured mode, reply like this:

        1. General Impression  
        - One or two short sentences about your first impression from the business.

        2. Insights Overview  
        - Quality Insight: ${insights?.quality || "No data available"}
        - Reliability Insight: ${insights?.reliability || "No data available"}
        - Price Insight: ${insights?.price || "No data available"}

        3. Recommendations  
        - Suggestion 1  
        - Suggestion 2  
        - Suggestion 3

        4. Closing Question  
        - “Would you like to dive deeper into any of these?”

        Otherwise, just chat naturally and help as needed.
        Always use the same language the user uses.
        Start your first response with an emoji (e.g., 💡 or 👋).
        `.trim();

    const userPrompt = `
        As a business advisor, please analyze the following business:

        📌 Business Name: ${name}
        🏷️ Category: ${category?.join(", ") || "No category listed"}
        📍 Address: ${address || "No address listed"}

        💬 Review Summary: ${reviewSummary || "Not available"}
        💡 Insights:
        - Quality: ${insights?.quality || "Not available"}
        - Reliability: ${insights?.reliability || "Not available"}
        - Price: ${insights?.price || "Not available"}

        What can this business do to improve? Please structure your answer as requested.
        `.trim();

    return { systemPrompt, userPrompt };
}

const advisorSessions = new Map();

const initBusinessAdvisor = asyncHandler(async (req, res) => {
    const { businessId } = req.body;
    if (!businessId) {
        res.status(400);
        throw new Error("Missing businessId");
    }

    const business = await Business.findById(businessId);
    if (!business) {
        res.status(404);
        throw new Error("Business not found");
    }

    const { systemPrompt, userPrompt } = buildChatAdvisorPrompts(business); // returns an object with systemPrompt and userPrompt

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];

    const sessionId = uuidv4();

    advisorSessions.set(sessionId, { messages, history: [] });

    res.status(200).json({ success: true, sessionId });
});

const chatBusinessAdvisor = asyncHandler(async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        res.status(400);
        throw new Error("Missing sessionId or message");
    }

    const session = advisorSessions.get(sessionId);
    if (!session) {
        res.status(404);
        throw new Error("Advisor session not found");
    }

    const { systemPrompt, history } = session;

    const fullPrompt = [
        `SYSTEM: ${systemPrompt}`,
        ...history.map((h, i) => `${i % 2 === 0 ? "USER" : "ADVISOR"}: ${h}`),
        `USER: ${message}`,
        `ADVISOR:`
    ].join("\n");

    const chatModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    reply: { type: SchemaType.STRING }
                }
            }
        }
    });

    const aiResponse = await chatModel.generateContent(fullPrompt);
    const rawText = await aiResponse.response.text();
    const reply =
        aiResponse.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, no reply";

    history.push(message, reply);

    res.status(200).json({ success: true, advisorReply: reply });
});

export { initBusinessAdvisor, chatBusinessAdvisor };
