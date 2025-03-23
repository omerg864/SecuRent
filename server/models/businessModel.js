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
    },
    category:[String],

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
    },
    bank:{
        type: Object,
    },
    address:{
        type: String,
    },
    image:{
        type: String,
    },
    currency:{
        type: String,
    },
}
);
export default mongoose.model("Business", businessScheme);