const {Schema , mongoose, model} = require("mongoose")

const shareSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId, 
        ref: 'User',
        required:true

    },
    receiverEmail:{
        type:String,
        required:true
    },
    file:{
        type:mongoose.Types.ObjectId,
        ref:'file',
        required:true
    }

},{timestamps:true})

const shareModel = model("share",shareSchema)
module.exports = shareModel