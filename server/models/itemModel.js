import mongoose from 'mongoose';

const ItemSchema = mongoose.Schema(
    {
        business:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business',
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        currency:{
            type: String,
            required: true,
        },
        image:{
            type: String,
        },
        return_date:{
            type: Date,
            default: null,
        },
        duration:{
            type: String,
            default: null,
        },
        temporary:{
            type: Boolean,
            default: false,
        },
    
    },
    { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
