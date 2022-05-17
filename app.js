const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const dotenv =require('dotenv').config()
const pug = require('pug');
const path = require('path');
const app = express()
const port = process.env.PORT||5000;


//Require routes 
const AppRoutes = require('./routes/api/v1/AppRoutes')
const CvRoutes = require('./routes/api/v1/CvRoutes')
const ClRoutes = require('./routes/api/v1/ClRoutes')
const ExpRoutes = require('./routes/api/v1/ExpRoutes')
const EduRoutes= require('./routes/api/v1/EduRoutes')
const SkillRoutes = require('./routes/api/v1/SkRoutes')
const UserRoutes = require('./routes/api/v1/UserRoutes')
const ReffRoutes = require('./routes/api/v1/RefRoutes')
const ProjRoutes = require('./routes/api/v1/ProjRoutes')
const OrgRoutes = require('./routes/api/v1/OrgRoutes')
const AwRoutes = require('./routes/api/v1/AwRoutes')
const ContactRoutes = require('./routes/api/v1/ContactRoutes')
const ValidationRoutes = require('./routes/api/v1/ValidationRoutes')


//cpanel routes 
const CpanelRoutes = require('./routes/cpanel/CpanelRoutes')
const CUsersRoutes = require('./routes/cpanel/CUsersRoutes')


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
app.use('/api/v1/Validation',ValidationRoutes)


app.use('/Cpanel',CpanelRoutes)
app.use('/Cpanel/Users',CUsersRoutes)


//Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})