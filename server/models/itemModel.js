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
        amount:{
            type: Number,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        currency:{
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
