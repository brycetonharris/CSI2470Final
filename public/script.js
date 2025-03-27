const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const userId = String(Math.floor(Math.random() * 100000))
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

//socket.on('user-connected', userId => {
//    console.log('User connected:', userId)
//})

//socket.on('user-disconnected', userId => {
//    console.log('User disconnected:', userId)
//})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video') 
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}})