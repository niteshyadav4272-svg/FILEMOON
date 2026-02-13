const notify = new Notyf({
  position: {
    x: "center",
    y: "top",
  },
});

const login = async (e) => {
  try {
    e.preventDefault();

    const form = e.target;
    const elements = form.elements;

    const payload = {
      email: elements.email.value,
      password: elements.password.value,
    };

    console.log(payload);

    const { data } = await axios.post(
      "http://localhost:8080/login",
      payload
    );

    notify.success(data.message);
    // console.log(data)

    localStorage.setItem("authTaken",data.token)
    
   setTimeout(()=>{    
    location.href = "app/dashboard.html"

    },2000)

   

  } 
  catch (err) {
    notify.error(
      err.response ? err.response.data.message : err.message
    );
  }
};

//  const notify =   new Notyf({
//       position:{
//         x:'center',
//         y: 'top'
//       }
//      })

// const login = async (e)=>{
//     try{
//        e.preventDefault()
//         const form = e.target
//         const elements = form.elements

//         const payload = {
//             email : elements.email.value,
//             password: elements.password.value

//         }
//     console.log(payload)
//    const {data}  =   await  axios.post("http://localhost:8080/login",payload)
//    notify.success(data.message)

//    console.log(data)
   
// //    setTimeout(()=>{
// //     location.href = "app/dashboard.html"

// //    },2000)

//     }

//     catch(err){
//         notify.error(err.response ? response.data.message : err.message)
//     }
// }