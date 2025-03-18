import mongoose from 'mongoose';

const transactionScheme = mongoose.Schema(
    {
        transaction_id: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
        },
        costumer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Costumer',
        },
        opened_at: {
            type: Date,
            required: true,
        },
        closed_at: {
            type: Date,
        },
        returned_at: {
            type: Date,
        },
        charged_description: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Transaction', transactionScheme);
