const socket = io('/')
const userId = String(Math.floor(Math.random() * 100000))

socket.emit('join-room', ROOM_ID, userId)

socket.on('user-connected', userId => {
    console.log('User connected:', userId)
})

socket.on('user-disconnected', userId => {
    console.log('User disconnected:', userId)
})
