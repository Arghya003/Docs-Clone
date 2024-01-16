import {Server, Socket} from 'socket.io'
const PORT=9000;
const io = new Server(PORT, {
  cors: {
    origin: "http://127.0.0.1:5173/",
    methods:['GET','POST']
  },
});

io.on('connection',socket=>{


    socket.on('get-document',documentId=>{
      const data='';
      socket.join(documentId)
      socket.emit('load-document',data);
      socket.on("send-changes", (delta) => {
        //console.log(delta)
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });
    })
  
    console.log('connected')
   
})