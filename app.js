const express = require('express')
const mongoose=require('mongoose')
const sessions=require('express-session')
const MongoStore=require('connect-mongo')
const deviceModel=require('./models/device')
require('dotenv/config')

const apiRoute= require('./routes/apiroute')
const { SSL_OP_NO_TICKET } = require('constants')
const { resolveSoa } = require('dns')

const app=express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);


app.use(express.static(__dirname+'/css'))
app.use(express.static(__dirname+'/js'))
app.use(express.static(__dirname+'/images'))
app.set('view engine', 'ejs')
app.set('socketio', io)

const IN_PROD= process.env.NODE_ENV==='production'
const SESSION_EXPIRE= Number(process.env.SESSION_AGE) * 60 * 60* 1000
app.use(sessions({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret : process.env.SESSION_SECRET,
    store : MongoStore.create({
        mongoUrl : process.env.DB_CONNECTION,
    }),
    cookie:{
        sameSite : true,
        maxAge : SESSION_EXPIRE,
        secure : IN_PROD,
        httpOnly : false
    }
}))
const redirectToLogin= (req,res,next)=>{
    if(!req.session.islogged)
    {
        res.redirect('/login')
    }
    else
    {
        next()
    }
}
app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})
app.use('/api', apiRoute)

app.get('/',redirectToLogin, (req, res)=>{
    res.render('overview', {data: req.session.userDetails})
})
app.get('/device',redirectToLogin,(req,res)=>{
    res.render('device', {data: req.session.userDetails})
})
app.get('/alert',redirectToLogin,(req,res)=>{
    res.render('alert', {data: req.session.userDetails})
})
app.get('/login', (req,res)=>{
    res.render('login')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.get('/account',(req,res)=>{
    res.send('In Progress')
})

io.on('connection',(socket)=>{
    console.log(`Connected as ${socket.id}`)
    socket.on('join-room',(id)=>{
        console.log(`Room : ${id}`)
        socket.join(id)
    })
})
mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})



server.listen(process.env.PORT || 3000 )