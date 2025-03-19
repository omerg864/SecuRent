import mongoose from "mongoose";

const customerScheme = mongoose.Schema(
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
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        Image: {
            type: String,
            required: true,
        },
        creditCard: {
            type: Object,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
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
export default mongoose.model("Customer", customerScheme);
