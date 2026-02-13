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


const getSession = ()=>{
    const session = localStorage.getItem("authToken")

    if(!session){
        location.href = "../index.html"
    }
    if(session !== )
}
