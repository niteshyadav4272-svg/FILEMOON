const dotenv = require("dotenv")
dotenv.config()

const mongoose  = require("mongoose")
mongoose.connect(process.env.DB)

const express = require("express")
const {v4: uniqueId} = require("uuid")
const cors = require("cors") // cors==1

const multer = require("multer")
const storage = multer.diskStorage({
    destination:(req, file, next)=>{
        next(null,'files/')
    },
    filename: (req, file, next)=>{
    const nameArr  =  file.originalname.split(".")
    const ext =  nameArr.pop()
    //   const name =uniqueId()+"."+ext  // it is a old way to concat 
    const name  = `${uniqueId()}.${ext}`
    next(null,name)
              

        //const name = file.originalname pahle hamne origanl file ka name diya tha
        // const name = uniqueId()  // ab ye unique name dega every time
       
    } 
})
//const upload = multer({dest: 'files'})
const upload = multer({storage: storage})

const { signup, login } = require("./controller/user.controller")
const { createFile, fetchFiles, DeleteFiles, download} = require("./controller/file.controller")
const { fetchDashboard } = require("./controller/dashboard.controller")
const app = express()
app.listen(process.env.PORT || 8080)

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("view"))
app.use(cors({ // cors==2
    origin: 'http://127.0.0.1:5500'
}))

app.post("/signup",signup)
app.post("/login",login)
app.post("/file", upload.single("file"), createFile)
app.get("/file",fetchFiles)
app.delete("/file/:id",DeleteFiles)
app.get('/file/download/:id',download)
app.get("/dashboard",fetchDashboard)
  