const jwt = require("jsonwebtoken")

const verfifyToken = async(req,res)=>{
    try{

   const payload   =  await  jwt.verify(req.body.token , process.env.JWT_SECRET)
   res.status(200).json(payload)

    }
    catch(err){
        res.status(401).json({message:"invalid token "})
    }
}

module.exports = {
    verfifyToken
}