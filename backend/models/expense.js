const mongoose=require("mongoose");

const expenseSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        amount:{
            type:Number,
            required:true,
            min: [0.01, "Amount must be greater than 0"]
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        },
        description:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model("Expense",expenseSchema);