

axios.defaults.baseURL = SERVER

window.onload = () => {
  fetchfiles()
  fetchImage()
}

const getToken = () => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  }
  return options
}


const notify = new Notyf({
  position: {
    x: "center",
    y: "top",
  },
});


const logout = () => {
  localStorage.clear()
  location.href = "/login"

}


const toggleDrawer = () => {
  const drawer = document.getElementById("drawer")
  const rightValue = drawer.style.right
  if (rightValue === '0px') {
    drawer.style.right = '-33.33%'
  }
  else {
    drawer.style.right = '0px'

  }


}

const uploadfile = async (e) => {
  const uploadButton = document.getElementById("upload-btn")
  e.preventDefault()
  try {
    const progress = document.getElementById("progress")
    const form = e.target
    const formdata = new FormData(form)

    // checking file size for uplaoding
    const file = formdata.get("file")
    const size = getsize(file.size)
    if (size > 200) {
      return notify.error("file size too large max size 200mb allowed")
    }


    const options = {
      onUploadProgress: (e) => {

        const loaded = e.loaded
        const total = e.total
        const perecentageValue = Math.floor((loaded * 100) / total)
        progress.style.width = perecentageValue + "%"
        progress.innerHTML = perecentageValue + "%"
      },
      ...getToken()
    }
    uploadButton.disabled = true

    const { data } = await axios.post("/api/file", formdata, options)
    notify.success(`${data.filename} has been uploaded`)
    fetchfiles() // this is a call for live  update in ui 
    progress.style.width = 0
    progress.innerHTML = ""
    form.reset()
    toggleDrawer()

  }
  catch (err) {
    notify.error(err.response ? err.response.data.message : err.message)
  }

  finally {
    uploadButton.disabled = false

  }

}


const getsize = (size) => {

  const kb = size / 1000
  const mb = kb / 1000
  const gb = mb / 1000

  if (gb >= 1) return gb.toFixed(2) + "GB"
  if (mb >= 1) return mb.toFixed(2) + "MB"
  if (kb >= 1) return kb.toFixed(2) + "KB"
  return size + 'B'
}


const fetchfiles = async () => {
  try {

    const { data } = await axios.get("/api/file", getToken())
  
  
    const table = document.getElementById("files-table")

    table.innerHTML = ""
    for (let file of data) {

      const ui = `
          <tr class="text-gray-500  border-b border-gray-100">
                    <td class="py-3 pl-6 capitalize ">${file.filename}</td>
                    <td class="capitalize">${file.type.split('/')[0]}</td>
                     <td>${getsize(file.size)}</td>
                      <td>${moment(file.createdAt).format('DD-MMM-YYYY hh:mm A')}</td>
                      <td>
                        <div class="space-x-3">

                            <button class="  bg-rose-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick ="deletefile('${file._id}',this)">
                                <i class="ri-delete-bin-4-line"></i>
                            </button>

                             <button class="  bg-green-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick = "downloadFile('${file._id}','${file.filename}',this)">
                                <i class="ri-download-line"></i>
                                </button>

                                 <button class="  bg-amber-400 px-2 py-1 text-white hover:bg-rose-600 rounded" onclick = " openModelForShare('${file._id}','${file.filename}')">
                                <i class="ri-share-line"></i>
                            </button>

                            
                        </div>
                      </td>
                </tr>
                `
      table.innerHTML += ui

    }

  }
  catch (err) {
    notify.error(err.response ? err.response.data.message : err.message)

  }
}

// ye above me call huva hai function 
const deletefile = async (id, button) => {
  try {
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
    button.disabled = true

    await axios.delete(`/api/file/${id}`, getToken())
    notify.success("file deleted !")
    fetchfiles()

  }
  catch (err) {

    notify.error(err.response ? err.response.data.message : err.message)


  }
  finally {
    button.innerHTML = ' <i class="ri-delete-bin-4-line"></i>'
    button.disabled = false

  }
}



const downloadFile = async (id, filename, button) => {
  try {
   
    button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'
    button.disabled = true

    const options = {
      responseType: 'blob',
      ...getToken()
    }
    const { data } = await axios.get(`/api/file/download/${id}`, options)
   

    const ext = data.type.split("/").pop()
    const url = URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.${ext}`
    a.click()
    a.remove()

  }
  catch (err) {
  
    if (!err.response) 
      return notify.error(err.message)

  
    const error = await (err.response.data).text()
    const { message } = JSON.parse(error)
    notify.error(message)


  }

  finally {

    button.innerHTML = '<i class="ri-download-line"></i>'
    button.disabled = false
  }


}
const openModelForShare = (id, filename) => {
  new Swal({
    showConfirmButton: false,
    html: `
        <form class="text-left flex flex-col gap-6" onsubmit="shareFile('${id}',event)">
        <h1 class="font-medium text-2xl text-black">Email Id</h1>
        <input class="border border-gray-300 w-full p-3 rounded" placeholder="mail@gmail.com" required name="email" type="email"></input>
        <button class="bg-indigo-400 hover:bg-indigo-600 text-white rounded py-3 px-8 w-fit font-medium " id="send-Button">send</button>
        <div class="flex items-center gap-2">
        <p class="text-gray-500 ">You are Sharing </P>
         <p class="text-green-400"> ${filename} </P>
        </div>
        </form>

        `
  })
}


const shareFile = async (id, e) => {
  const sendButton = document.getElementById("send-Button")
  const form = e.target
  try {
    e.preventDefault()
    sendButton.disabled = true
    sendButton.innerHTML = `
    <i class="fa fa-spinner fa-spin mr-2"></i>
    processing
    `
    const email = form.elements.email.value.trim()
    const payload = {
      email: email,
      fileId: id
    }
    await axios.post("/api/share", payload, getToken())

    notify.success("file send succesfully")
  }
  catch (err) {
    notify.error(err.response ? err.response.data.message : err.response.message)
  }
  finally {
    Swal.close()
    // form.reset()
    // sendButton.disabled = false
    // sendButton.innerHTML = "Send"

  }


}

const uploadImage = () => {
  try {
    const input = document.createElement("input")
    const pic = document.getElementById("pic")
    input.type = 'file'
    input.accept = 'image/*'
    input.click()


    // ye tab executes karega jab image select ho gya ho
    input.onchange = async () => {
      const file = input.files[0]
      const formData = new FormData()
      formData.append('picture', file)

      await axios.post('/api/profile-picture', formData, getToken())
      const url = URL.createObjectURL(file)
      pic.src = url

    }
  }
  catch (err) {
    notify.error(err.response ? err.response.data.message : err.message)
  }

}



const fetchImage = async () => {
  try {
    const options = {
      responseType: 'blob',
      ...getToken()
    }
    const { data } = await axios.get("/api/profile-picture", options)

    const url = URL.createObjectURL(data)
    const pic = document.getElementById("pic")
    pic.src = url



  }
  catch (err) {
    if (!err.response)
      return notify.error(err.message)
    const error = await (err.response.data).text()
    const { message } = JSON.parse(error)

    notify.error(message)
  }

}









