const socket=io()

const $messageForm = document.querySelector('#message-form')
const $messageInput=$messageForm.querySelector('input')
const $messageButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send-location')
const messages =document.querySelector('#messages')

//templates
const locationTemplate=document.querySelector('#location-template').innerHTML
const messageTemplate=document.querySelector('#message-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room}=Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll =()=>{
    //Get last message
    const $newMessage = messages.lastElementChild
    //Height of new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin =parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin
    //Visible Height
    const visibleHeight=messages.offsetHeight
    //Height of messages container
    const containerHeight=messages.scrollHeight
    //How far have I scrolled
    const scrollOffset = messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        messages.scrollTop=messages.scrollHeight
    }

}
socket.on('message', (message)=>{
    console.log(message)
    const html =Mustache.render(messageTemplate, {
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (loc)=>{
    console.log(loc)
    const html =Mustache.render(locationTemplate, {
        username:loc.username,
        url:loc.url,
        createdAt:moment(loc.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML=html
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    $messageButton.setAttribute('disabled', 'disabled')
    const message =e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error)=>{
        $messageButton.removeAttribute('disabled')
        $messageInput.value=''
        $messageInput.focus()
        if(error){
            return console.log(error)
        }
        console.log("Message Delivered")
    })
})

$locationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Browser does not support location send')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, (location)=>{
            console.log("Location shared")
        })
        $locationButton.removeAttribute('disabled')
    })
})

socket.emit('join', {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})