// const { Server } = require("socket.io");
// const express = require('express');
// const app = express();
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

// const server = require('http').createServer();

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Request-Method', 'GET,POST,OPTIONS');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     return next();
//   })


// let arr = [];
// let playerArray = [];
// const io =  new Server(server);

// io.on('connection',(socket)=>{
//     console.log("User connected");
    // socket.on('find',(e)=>{
    //     console.log(e);
    //     if(e.name!=null){
    //         arr.push(e.name);
    //         if(arr.length>=2){
    //             let player1 = {

    //             }
    //         }
    //     }
    // })
// })




// const port = 8080;
// app.listen(port,(error)=>{
//     // console.log(io);
//     if(error){
//         console.log(error);
//     }else
//         console.log("Socket server listening on port",port);
// });

// // const { Server } = require("socket.io");
// // const server = require('http').createServer();

// // io.on('connection', (socket) => {
// //     console.log("socket id s",socket.id);
// // });

// // const port = 8080;
// // server.listen(port,(error)=>{
// //     if(error){
// //         console.log(error);
// //     }else
// //         console.log("Socket server listening on port",port);
// // });


const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: {
    origin: "https://ping-pong-seven-nu.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
  }
});

arr = [];
Games = new Map();
SocketIdMapWithGame = new Map();

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('find',(e)=>
  {
    console.log(e);
    arr.push({
      userName:e,
      id:socket.id
    });
    socket.join(socket.id);
    if(arr.length>=2)
    {
      let player1 = 
      {
        name:arr[0].userName,
        id:arr[0].id
      }
      let player2 = 
      {
        name:arr[1].userName,
        id:arr[1].id
      }
      let gameName = arr[0].id + arr[1].id;
      let obj=
      {
        gameName: gameName,
        p1:player1,
        p2:player2,
      }
      Games.set(gameName,obj);
      SocketIdMapWithGame.set(arr[0].id,gameName);
      SocketIdMapWithGame.set(arr[1].id,gameName);
      socket.to(arr[0].id).emit("finded",obj);
      // directly send data in sockets
      socket.emit("finded", obj);
      
      arr.splice(0,2);
      console.log("Games playing this time ",Games);
    }
  });

  socket.on("ball",(e)=>{
    // position of ball 
    let obj = Games.get(e.gameName);
    // console.log("inside ball ",e,obj);
    if(obj!=null){
      let x = e.x, y = e.y;
      socket.emit("ball",{x,y});
      x = 800-x;
      if(obj.p1.id==socket.id){
        socket.to(obj.p2.id).emit("ball",{x,y});
      }else{
        socket.to(obj.p1.id).emit("ball",{x,y});
      }
    }else{
      console.log("No game found");
    }
  })

  socket.on("score",(e)=>{
    let obj = Games.get(e.gameName);
    if(obj){
      let x = e.x;
      console.log("score ",x);
      // socket.emit("score",{x,y});
      if(obj.p1.id==socket.id){
        socket.to(obj.p2.id).emit("score",x);
      }else{
        socket.to(obj.p1.id).emit("score",x);
      }
    }else{
      console.log("No game found");
    }
  })

  socket.on("playing",(e)=>{
    let obj = Games.get(e.gameName);
    if(obj){
      if(obj.p1.id==socket.id){
        socket.to(obj.p2.id).emit("playing",e.blocker2Y);
      }else{
        socket.to(obj.p1.id).emit("playing",e.blocker2Y);
      }
    }else{
      console.log("No game found");
    }
  })
  socket.on("disconnect", () => {
    let gameName = SocketIdMapWithGame.get(socket.id);
    // console.log("disconnected initiated in server",gameName);
    let obj = Games.get(gameName);
    if(obj){
      if(obj.p1.id==socket.id){
        socket.to(obj.p2.id).emit("leftAnotherPlayer","Left this socket");
      }else{
        socket.to(obj.p1.id).emit("leftAnotherPlayer","left this socket");
      }
    }else{
      console.log("No game found");
    }
    SocketIdMapWithGame.delete(socket.id);
    Games.delete(gameName);
    socket.rooms.size = 0;
  });
});

const port = 8080;
http.listen(port, () => {
  console.log(`Socket server listening on port ${port}`);
});
