const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (_req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)

        // Store user details on socket
        socket.roomId = roomId
        socket.userId = userId

        // Broadcast to other clients in room
        socket.to(roomId).emit('user-connected', userId)
    })

    socket.on('disconnect', () => {
        if (socket.roomId && socket.userId) {
            socket.to(socket.roomId).emit('user-disconnected', socket.userId)
        }
    })
})






server.listen(3000)
