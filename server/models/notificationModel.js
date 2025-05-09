import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
        type: {
            type: String,
            enum: ['business', 'customer', 'admin'],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
