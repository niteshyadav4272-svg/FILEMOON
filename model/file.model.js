const {Schema,model} = require("mongoose") 

const fileSchema = new Schema({
   filename:{
    type:String,
    trim:true,
    lowercase:true,
    require:true
   },
     path:{
    type:String,
    trim:true,
    lowercase:true,
    require:true
   },
   type:{
    type:String,
    trim:true,
    lowercase:true,
    require:true
   },
   size:{
    type:Number,
    required:true
   }
    

},{timestamps:true})

const FileModel = model("file",fileSchema)

module.exports = FileModel
