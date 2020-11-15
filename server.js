const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const username = require('username-generator')
const model = require('model')

app.use(express.static('./client/build'));

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, "client","build","index.html"));
})

// TODO: put all of these in one object
const reps = {}
const users = {}
const user_motion = {}


function get_num_reps(position, userid) {
    if (position !== user_motion[userid]) {
        if (position === [1, 0, 0]) {
            user_motion[userid] = [0, 0, 1]
            reps[userid] += 0.5
        }
        else if (position === [0, 0, 1]) {
            user_motion[userid] = [1, 0, 0]
            reps[userid] += 0.5
        }
    }

    return Math.floor(reps[userid])
}


app.get('/getReps', function (req, res) {
    // get this from req somehow
    let data = {userid: null, probabilities: null}
    let model_data = model.predict(data.probabilities)
    let num_reps = get_num_reps(model_data, data.userid)
    res.end(num_reps)
})


io.on('connection', socket => {
    //generate username against a socket connection and store it
    const userid=username.generateUsername('-')
    if(!users[userid]){
        users[userid] = socket.id
        reps[userid] = 0
        user_motion[userid] = [1, 0, 0]  // assuming the user starts at bottom
    }
    //send back username
    socket.emit('yourID', userid)
    io.sockets.emit('allUsers', users)
    
    socket.on('disconnect', ()=>{
        delete users[userid]
        delete reps[userid]
        delete user_motion[userid]
    })

    socket.on('callUser', (data)=>{
        io.to(users[data.userToCall]).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on('acceptCall', (data)=>{
        io.to(users[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', (data)=>{
        io.to(users[data.to]).emit('close')
    })

    socket.on('rejected', (data)=>{
        io.to(users[data.to]).emit('rejected')
    })
})

const port = process.env.PORT || 8000

server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})