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
    role: {
        type: String,
        required: true,
        default: 'Business',
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
    rating:{
        type: Number,
    },
    address:{
        type: String,
    },
    Image:{
        type: String,
    },
    currency:{
        type: String,
    },
    companyNumber:{
        type: String,
    },
    isCompanyNumberVerified:{
        type: Boolean,
        default: false,
    },
}
);
export default mongoose.model("Business", businessScheme);