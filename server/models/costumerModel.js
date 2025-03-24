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
        role: {
            type: String,
            required: true,
            default: 'Customer',
        },
        refreshTokens: [
			{
				token: {
					type: String,
					required: true,
				},
				unique: {
					type: String,
				},
			},
		],
    },
    { timestamps: true }
);
export default mongoose.model("Costumer", costumerScheme);
