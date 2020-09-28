const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#inp')
const $messageFormBtn = document.querySelector('#btn')
const $sendLocBtn = document.querySelector('#send-location')

socket.on('message',(message)=>{
    console.log(message)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormBtn.setAttribute('disabled','disable')
    const message = $messageFormInput.value

    socket.emit('sendMessage',message, (error) => {

        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

$sendLocBtn.addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('Your browser does not support geolocation')
    }
    $sendLocBtn.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        const pos = {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }
        socket.emit('sendLocation',pos,()=>{
            $sendLocBtn.removeAttribute('disabled')
            console.log('Location delivered')
        })
    })
})