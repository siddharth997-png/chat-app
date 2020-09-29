const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#inp')
const $messageFormBtn = document.querySelector('#btn')
const $sendLocBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message
    }) 
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(location)=>{
    console.log(location)
    let url = Mustache.render(locationTemplate,{
        location
    })
    $messages.insertAdjacentHTML('beforeend',url)
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