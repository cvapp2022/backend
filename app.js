const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const dotenv =require('dotenv').config()
const pug = require('pug');
const path = require('path'); 
const app = express()
const port = process.env.PORT||5000;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, 
  {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    extraHeaders: {
      'Access-Control-Allow-Credentials': 'omit'
    }
  },
  allowEIO3: true 
}
);
const signalServer = require('simple-signal-server')(io)


//Require routes 
const AppRoutes = require('./routes/api/v1/AppRoutes')

const ClRoutes = require('./routes/api/v1/ClRoutes')

const CvRoutes = require('./routes/api/v1/cv/CvRoutes')
const ExpRoutes = require('./routes/api/v1/cv/ExpRoutes')
const EduRoutes= require('./routes/api/v1/cv/EduRoutes')
const SkillRoutes = require('./routes/api/v1/cv/SkRoutes')
const UserRoutes = require('./routes/api/v1/UserRoutes')
const ReffRoutes = require('./routes/api/v1/cv/RefRoutes')
const ProjRoutes = require('./routes/api/v1/cv/ProjRoutes')
const OrgRoutes = require('./routes/api/v1/cv/OrgRoutes')
const AwRoutes = require('./routes/api/v1/cv/AwRoutes')
const ContactRoutes = require('./routes/api/v1/cv/ContactRoutes')

//mn
const MnRequestRoutes= require('./routes/api/v1/mn/MnRequestRoutes')
const MnMentorRoutes=require('./routes/api/v1/mn/MentorRoutes')
const MnPorgramRoutes=require('./routes/api/v1/mn/ProgramRoutes')
const MnMeetRoutes=require('./routes/api/v1/mn/MeetRoutes')
const MnSessionRoutes=require('./routes/api/v1/mn/meet/SessionRoutes')

const ValidationRoutes = require('./routes/api/v1/ValidationRoutes')


//cpanel routes 
const CpanelRoutes = require('./routes/cpanel/CpanelRoutes')
const CUsersRoutes = require('./routes/cpanel/CUsersRoutes')
const CMnProgramsRoutes =require('./routes/cpanel/CpMnRoutes/MnProgramRoutes')
const CMnMentorRoutes = require('./routes/cpanel/CpMnRoutes/MnMentorRoutes')
const CTemplateRoutes = require('./routes/cpanel/CTemplateRoutes')

//sockets 
const MessageSocket=require('./sockets/mn/MessageSocket')

const rooms = new Map()
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

signalServer.on('disconnect', (socket) => {
  let memberId = socket.id;
  let roomId = socket.roomId;
  let members = rooms.get(roomId);
  if (members) {
     members.delete(memberId)
  }
  log('left ' + roomId + ' ' + memberId)
})
signalServer.on('request', (request) => {
  request.forward()
  log('requested')
})

function log(message, data) {
  if (true) {
     console.log(message);
     if (data != null) {
        console.log(data);
     }
  }
}

io.on('connection', function(socket){ 

  console.log('socket connectctd')
  MessageSocket.MessageSocket(io,socket)
  //io2.ws(socket)
})

// io.on('connection', function(socket) {
//   console.log('WebSockets connected')

//   socket.on('SEND_MESSAGE', function(data) {
// 		console.log('from send msg ',data);
// 	});

// })
// sockets.discover(signalServer);
// sockets.disconnect(signalServer);
// sockets.request(signalServer);


//Body Parser Initialize
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

//Logger
app.use(morgan('dev'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));


//conect To MongoDB
var mongoDB = process.env.MONGOURL; 
//var mongoDB='mongodb://127.0.0.1/BlaxkCV';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors) 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//Use Routes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});

//require('./others/test')();
app.get('/', function (req, res) {
  var sum = 0;
  rooms.forEach((v, k) => sum = sum + v.size);
  res.send('Lobby server<br/>rooms: ' + rooms.size + '<br/>members: ' + sum);
});
app.use('/api/v1/',AppRoutes)
app.use('/api/v1/Cv',CvRoutes)
app.use('/api/v1/Cl',ClRoutes)
app.use('/api/v1/Exp',ExpRoutes)
app.use('/api/v1/Edu',EduRoutes)
app.use('/api/v1/Skill',SkillRoutes)
app.use('/api/v1/Reff',ReffRoutes)
app.use('/api/v1/Proj',ProjRoutes)
app.use('/api/v1/Org',OrgRoutes)
app.use('/api/v1/Aw',AwRoutes)
app.use('/api/v1/User/',UserRoutes)
app.use('/api/v1/Contact/',ContactRoutes)
app.use('/api/v1/Mn/Request',MnRequestRoutes)
app.use('/api/v1/Mn/Mentor',MnMentorRoutes)
app.use('/api/v1/Mn/Program',MnPorgramRoutes)
app.use('/api/v1/Mn/Meet',MnMeetRoutes)
app.use('/api/v1/Mn/Session',MnSessionRoutes)



app.use('/api/v1/Validation',ValidationRoutes)


app.use('/Cpanel',CpanelRoutes)
app.use('/Cpanel/Users',CUsersRoutes)
app.use('/Cpanel/Mentorship/Programs/',CMnProgramsRoutes)
app.use('/Cpanel/Mentorship/Mentors',CMnMentorRoutes)
app.use('/Cpanel/Templates',CTemplateRoutes)


//Server
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})