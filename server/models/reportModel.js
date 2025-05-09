import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
    {
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        image: {
            type: String,
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
