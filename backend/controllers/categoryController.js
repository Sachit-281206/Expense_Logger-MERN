const Category=require("../models/category");

exports.createCategory=async (req,res)=>{
    try{
        const {name,description}=req.body;
        if(!name){
            return res.status(400).json({message:"Category name required"});
        }
        const category=await Category.create({name,description,user:req.user.id});
        res.status(201).json(category);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.getALLCategory=async (req,res)=>{
    try{
        const categories=await Category.find({user:req.user.id});
        res.json(categories);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.getCategory=async (req,res)=>{
    try{
        const category=await Category.findOne({_id:req.params.id,user:req.user.id});
        if(!category){
            return res.status(404).json({message:"category not found"})
        }
        res.json(category);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.updateCategory=async (req,res)=>{
    try{
        const {name,description}=req.body;
        const category=await Category.findOneAndUpdate(
            {_id:req.params.id,user:req.user.id},
            {name,description},
            {new:true,runValidators:true}
        );
        if(!category){
            return res.status(404).json({message:"category not found"});
        }
        res.status(200).json(category);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.deleteCategory=async (req,res)=>{
    try{
        const category=await Category.findOneAndDelete({_id:req.params.id,user:req.user.id});
        if(!category){
            return res.status(404).json({message:"category not found"});
        }
        res.status(200).json({message:"category deleted successfully"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};