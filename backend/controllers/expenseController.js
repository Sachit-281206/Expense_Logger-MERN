const Expense=require("../models/expense");

exports.createExpense=async (req,res)=>{
    try{
        const {amount,date,description,category}=req.body;
        if(!amount || !category){
            return res.status(400).json({message:"expense amount and category required"});
        }
        const expense=await Expense.create({amount,date,description,user:req.user.id,category});
        res.status(201).json(expense);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.getAllExpense=async (req,res)=>{
    try{
        const expenses=await Expense.find({user:req.user.id}).populate("category","name");
        res.status(200).json(expenses);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.getExpense=async (req,res)=>{
    try{
        const expense=await Expense.findOne({_id:req.params.id,user:req.user.id}).populate("category","name");
        if(!expense){
            return res.status(404).json({message:"expense not found"});
        }
        res.status(200).json(expense);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.updateExpense=async (req,res)=>{
    try{
        const {amount,date,description,category}=req.body;
        const expense=await Expense.findOneAndUpdate(
            {_id:req.params.id,user:req.user.id},
            {amount,date,description,category},
            {new:true,runValidators:true}
        );
        if(!expense){
            return res.status(404).json({message:"expense not found"});
        }
        res.status(200).json(expense);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

exports.deleteExpense=async (req,res)=>{
    try{
        const expense=await Expense.findOneAndDelete({_id:req.params.id,user:req.user.id});
        if(!expense){
            return res.status(404).json({message:"expense not found"});
        }
        res.status(200).json({message:"expense deleted successfully"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};