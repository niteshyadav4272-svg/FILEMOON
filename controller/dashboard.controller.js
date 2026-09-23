
const fileModel = require("../model/file.model")

const fetchDashboard =async (req,res)=>{
    try{
      const reports = await  fileModel.aggregate([
        {
            $group: {
                _id : "$type",
                total:{$sum:1}

            }
            
        },
        {
             $project:{
                    type:'$_id',
                    total:1,
                    _id:0
                }
        }
       ])
       res.status(200).json(reports)

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports = {
    fetchDashboard
}