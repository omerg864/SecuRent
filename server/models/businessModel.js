import mongoose from "mongoose";

const businessScheme = mongoose.Schema(
    {
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    category:[String],
    role: {
        type: String,
        required: true,
        default: 'Business',
    },
    tokens:[
        {
            token:{
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
    rating:{
        type: Number,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    Image:{
        type: String,
        required: true,
    },
    currency:{
        type: String,
        required: true,
    },
}
);
export default mongoose.model("Business", businessScheme);