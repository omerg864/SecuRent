import mongoose from "mongoose";

const costumerScheme = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        image: {
            type: String,
        },
        creditCard: {
            type: Object,
        },
        rating: {
            type: Number,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
                device_id:{
                    type: String,
                    required: true,
                },
                name:{
                    type: String,
                    required: true,
                }
            },
        ],
    },
    { timestamps: true }
);
export default mongoose.model("Costumer", costumerScheme);
