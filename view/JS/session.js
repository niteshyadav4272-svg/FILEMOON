// const getSession = ()=>{
//     const session = localStorage.getItem("isLogin")

//     if(!session){
//         location.href = "../index.html"
//         return
//     }

//     if(session !== "true"){
//          location.href = "../index.html"
//          return

//     }
// }

// getSession()


const getSession =async ()=>{
  try{
      const session = localStorage.getItem("authToken")

    if(!session){
        location.href = "../index.html"
        return
    }
    const payload = {
        token : session
    }

   const {data}  =  await  axios.post('http://localhost:8080/signup',payload)
   console.log(data)

  }
  catch(err){
    localStorage.clear()
    location.href = "../index.html"


  }
   

}
