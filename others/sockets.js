

// module.exports.joind=function(socket){

//     // join a new meeting
//     socket.on('joined', async (data) => {
//       let meetingid = JSON.parse(data).meetingid
//       //let username = JSON.parse(data).username
//       //console.log("joined", meetingid)
//       //const new_meet = {
//          //name: username,
//          //meetingid: meetingid,
//          //sessionid: socket.id
//       //}
//       //await Meet.createonemeet(meet)
//       if(meetingid !== null){
//         socket.join(meetingid);
//         // notify everyone of a new user
//         socket.to(`${meetingid}`).emit("joined", `${socket.id}`)
//       }
//     });
 
// },

// module.exports.offerMessage=function(socket){

//     socket.on('offer_message', (data) => {
//       let sessionid = JSON.parse(data).offerto
//       console.log("[OFFER] Send to session id", sessionid)
//       if(data !== null){
//         // notify everyone of a new user
//         io.to(`${sessionid}`).emit("offer_message", `${data}`)
//       }
//     });

// }

// module.exports.answerMessage=function(socket){

//     socket.on('answer_message', (data) => {
//       let sessionid = JSON.parse(data).offerto
//       console.log("[ANSWER] Send to session id", sessionid)
//       if(data !== null){
//         // notify everyone of a new user
//         io.to(`${sessionid}`).emit("answer_message", `${data}`)
//       }
//     });


// }



// module.exports.send=function(socket){
//     // send a message
//     socket.on('send', (data) => {
//       let meetingid = JSON.parse(data).meetingid
//       let sessionid = JSON.parse(data).sessionid
//       if(data !== null){
//         socket.join(meetingid);
//         // notify everyone of a new message
//         socket.to(`${meetingid}`).emit("sendmessage", `${sessionid}`)
//       }
//     });

// }  

// module.exports.disconnect=function(socket){

//     // disconnect
//     socket.on("disconnect", (data) => {
//       if(data !== null){
//         // notify everyone of a user has exited
//         socket.to(`${data}`).emit("exitmeeting",  'someone has exited')
//       }
//     });


// }


module.exports.discover=function(signalServer){

    signalServer.on('discover', (request) => {
        log('discover');
        let memberId = request.socket.id;
        let roomId = request.discoveryData;
        let members = rooms.get(roomId);
        if (!members) {
           members = new Set();
           rooms.set(roomId, members);
        }
        members.add(memberId);
        request.socket.roomId = roomId;
        request.discover({
           peers: Array.from(members)
        });
        log('joined ' + roomId + ' ' + memberId)
     })
}

module.exports.disconnect=function(signalServer){

    signalServer.on('disconnect', (socket) => {
       let memberId = socket.id;
       let roomId = socket.roomId;
       let members = rooms.get(roomId);
       if (members) {
          members.delete(memberId)
       }
       log('left ' + roomId + ' ' + memberId)
    })

}

  
module.exports.request=function(signalServer){

    signalServer.on('request', (request) => {
       request.forward()
       log('requested')
    })

}
 
 
 
  
  

  