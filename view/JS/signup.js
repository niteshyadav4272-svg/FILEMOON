 const notify =   new Notyf({
      position:{
        x:'center',
        y: 'top'
      }
     })

const signup =async (e)=>{
    try{
         e.preventDefault()
 const form =    e.target
 const elements = form.elements
  const payload = {
    fullname: elements.fullname.value,
    email:    elements.email.value,
    mobile:   elements.mobile.value,
    password: elements.password.value

  }

    const {data}  = await  axios.post('http://localhost:8080/signup',payload)
    form.reset()
    // console.log(response)
    notify.success(data.message)
    setTimeout(()=>{
      location.href = "index.html"

    },2000)
   

    }

    catch(err){
        // console.log(err.response.data.message)
    
     notify.error(err.response  ? err.response.data.message : err.message)
    }
   
    
}