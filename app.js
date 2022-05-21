const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const dotenv =require('dotenv').config()
const pug = require('pug');
const path = require('path');
const cors = require("cors");
const app = express()
const port = process.env.PORT||5000;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const signalServer = require('simple-signal-server')(io)
const sockets=require('./others/sockets')

//Require routes 
const AppRoutes = require('./routes/api/v1/AppRoutes')

const ClRoutes = require('./routes/api/v1/ClRoutes')

const CvRoutes = require('./routes/api/v1/CvRoutes')
const ExpRoutes = require('./routes/api/v1/ExpRoutes')
const EduRoutes= require('./routes/api/v1/EduRoutes')
const SkillRoutes = require('./routes/api/v1/SkRoutes')
const UserRoutes = require('./routes/api/v1/UserRoutes')
const ReffRoutes = require('./routes/api/v1/RefRoutes')
const ProjRoutes = require('./routes/api/v1/ProjRoutes')
const OrgRoutes = require('./routes/api/v1/OrgRoutes')
const AwRoutes = require('./routes/api/v1/AwRoutes')
const ContactRoutes = require('./routes/api/v1/ContactRoutes')


const MeetRoutes =require('./routes/api/v1/mn/MeetRoutes')
const SessionRoutes= require('./routes/api/v1/mn/SessionRoutes')



const ValidationRoutes = require('./routes/api/v1/ValidationRoutes')


//cpanel routes 
const CpanelRoutes = require('./routes/cpanel/CpanelRoutes')
const CUsersRoutes = require('./routes/cpanel/CUsersRoutes')


//sockets 

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

app.use('/api/v1/Meet/',MeetRoutes)
app.use('/api/v1/Session/',SessionRoutes)





app.use('/api/v1/Validation',ValidationRoutes)


app.use('/Cpanel',CpanelRoutes)
app.use('/Cpanel/Users',CUsersRoutes)


//Server
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})