const path = require('path')
const http = require('http')
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurentUser, userLeave, getRoomUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(path.join(__dirname,'public')));

const botname = 'Chatify'; //Using this name every user get welcomed

// when client connetcts to the server
io.on('connection',socket => {
    socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id,username,room);
    socket.join(user.room)
            
    //When new user enter to the chat 
    socket.emit('message',formatMessage(botname,'Welcome to Chatify!'));
    
    // Brodcast when user connects
    
    socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined the chat`));

    // semd users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
    });


    
    // listner for msg
    socket.on("chatMessage", (msg)=>{
        const user =getCurentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
        
    // when user disconect
    
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`));

            // semd users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    });
        }
    
    });

})
const PORT = 3000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server runnning on port ${PORT}`));

