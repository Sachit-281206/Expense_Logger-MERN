const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/user");


exports.registerUser=async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        //validate all credentials are given.
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        //check if given email already exist.
        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"User already exist"});
        }

        //convert password into hashed password.
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //store the credentials.
        const user=await User.create({name,email,password:hashedPassword});

        //generate jwt.
        const token=jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        //return response.
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    }

    catch(err){
        res.status(500).json({error:err.message});
    }
};

exports.loginUser=async (req,res)=>{
    try{
        const {email,password}=req.body;

        //validate credentials are given.
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        //validate the given email is  already exist.
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        //check given password matches stored password.
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.ststus(400).json({message:"Invalid credentials"});
        }

        //generate jwt .
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        //return response.
        res.json(
            {
                id:user._id,
                name:user.name,
                email:user.email,
                token
            }
        );

    }
    catch(err){
        res.status(500).json({error:err.message});
    }
};

