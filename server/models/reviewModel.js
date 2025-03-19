import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
    {
        business:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Costumer',
            required: true,
        },
        rating:{
            type: Number,
            required: true,
        },
        content:{
            type: String,
        }
        
    },
    { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
