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
Always respond in the language used by the user. If the user writes in Hebrew, reply in Hebrew.

When in structured mode, reply like this:

1. General Impression  
- One or two short sentences about your first impression from the business.

2. Insights Overview  
- Quality Insight: ${
        insights?.quality || "⚠️ No customer feedback about quality yet"
    }
- Reliability Insight: ${
        insights?.reliability || "⚠️ No feedback about reliability yet"
    }
- Price Insight: ${insights?.price || "⚠️ No pricing data yet"}

3. Recommendations  
- Suggestion 1  
- Suggestion 2  
- Suggestion 3

4. Closing Question  
- “Would you like to dive deeper into any of these?”

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

    const { systemPrompt, userPrompt } = buildChatAdvisorPrompts(business);
    const sessionId = uuidv4();

    // Optional welcome message for user UI only
    const insights = business.insights || {};
    const welcomeMessage = `
💬 You are now connected with your personal business assistant.

Based on system data, here are your current business insights:

• Quality: ${insights.quality || "Not available"}
• Reliability: ${insights.reliability || "Not available"}
• Price: ${insights.price || "Not available"}
`.trim();

    // Save prompt and initial message in memory
    advisorSessions.set(sessionId, {
        systemPrompt,
        history: [{ role: "user", text: userPrompt }]
    });

    res.status(200).json({
        success: true,
        sessionId,
        welcomeMessage, // to be shown to the user immediately
        insightsUsed: Boolean(business.insights)
    });
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
        ...history.map(({ role, text }) => `${role.toUpperCase()}: ${text}`),
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

    const part = aiResponse.response.candidates?.[0]?.content?.parts?.[0]?.text;
    let reply;
    try {
        const parsed = JSON.parse(part);
        reply = parsed.reply;
    } catch (err) {
        console.error("Failed to parse AI reply:", err, part);
        reply = part || "Sorry, no reply.";
    }

    history.push({ role: "user", text: message });
    history.push({ role: "advisor", text: reply });

    res.status(200).json({
        success: true,
        advisorReply: reply,
        isStructuredStart: history.length <= 4
    });
});

export { initBusinessAdvisor, chatBusinessAdvisor };