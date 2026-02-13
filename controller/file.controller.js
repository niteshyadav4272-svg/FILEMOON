const FileModel = require("../model/file.model");
const fs = require("fs")
const path = require("path")

const createFile  = async (req,res)=>{
   try{
    
    const file  = req.file

    const payload  = {
        // filename: `${file.destination}${file.filename}`,
        path :(file.destination+file.filename),
        filename:file.filename,
        type : file.mimetype.split("/")[0],
        size: file.size
        // ye jo information hai ye sub (req.file ) se aya hai 
    }
    //  console.log(req.file) ye file ka pura data de dega jo store huva hai 
 const newFile  =   await  FileModel.create(payload)
 res.status(200).json(newFile)


   }
   catch(err){
    res.status(500).json('kya bhai kya haal hai ')
   }

}

const fetchFiles = async(req,res)=>{
    try{
        //
       const files = await FileModel.findOne()
       res.status(200).json(files)

    }
    catch(err){
        res.status(500).json({message:err.message})
    }

}

const DeleteFiles = async(req,res)=>{
    try{
        const {id}  =  req.params
       const file = await FileModel.findByIdAndDelete(id)
       if(!file) return res.status(404).json({message:"file not found"})
        
        fs.unlinkSync(file.path) 
      

       res.status(200).json(file)

    }
    catch(err){
        res.status(500).json({message:err.message})
    }

}

const download = async(req,res)=>{
    try {
        
        const {id} = req.params
   const file   =  await  FileModel.findById(id)
//    res.status(200).json(file)  isshe pta ki file ka path kisme me hai

 if(!file){
      return   res.status(404).json({message:"file not found"})
       }

       const root  = process.cwd()
     const filePath =   path.join(root,file.path)

//     res.setHeader("Content-Disposition", "attachment; filename= `${file.filename}`");
//   res.setHeader("Content-Type", "image/jpg"); //this is a optional

res.setHeader(
  "Content-Disposition",
  `attachment; filename="${file.filename}"`
);


     res.sendFile(filePath,(err)=>{
        if(err)
            // console.log(err)
        res.status(404).json({message:"file not found"})
     })
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}


module.exports ={
    createFile,fetchFiles,DeleteFiles,download
}