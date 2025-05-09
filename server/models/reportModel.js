import mongoose from 'mongoose';
import { REPORT_STATUS } from '../utils/constants.js';

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
        status: {
            type: String,
            enum: REPORT_STATUS,
            default: 'open',
        },
        resolution: {
            type: String,
        },
        resolutionDate: {
            type: Date,
        },
        resolutionBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
