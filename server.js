const express = require('express');


const use = require ('./config/models/use')
var jwt = require('jsonwebtoken');
const db = require('./config/db')
const router = express.Router();
const cookies = require("cookie-parser");
const { engine } = require ('express-handlebars');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.use(cookies());
db.connect()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.get('/',function(req, res, next){
    res.sendFile(__dirname + '/public/login.html')
 });

app.get('/chatForm',function(req, res, next){
    res.sendFile(__dirname + '/public/chatForm.html')
 });

 const checklogin = (req, res, next) => {
    try{
        const id = jwt.verify(req.cookies.token, 'mk')
       
        use.findOne({_id:id})
        .then(data=>{ 
            if(data){
                 
                next()
            }
            else{
                res.json('mời bạn đăng nhập')
            }   
        })
        .catch((err)=>
            res.status(500).json('token hong hợp lệ'))
    }catch(err){
        console.log(err.message);
        res.status(500).json("bạn khòng co quyen");
    }
}
const friend = (req, res, next ) =>{
    use.find({})
    .then(data => { data = data.map(data => data.toObject())
        //res.render('index', data)
        req.dataname = data;
        // console.log(data.name)
        io.on('connection',function(socket){
            io.emit('friend', data)
        })

        next()
    })
    .catch(err=>{})
}
app.get('/chat',checklogin, (req, res, next) => {
    const o = req.query;
    res.sendFile(__dirname + '/public/index.html')
 });
app.post('/login',friend ,
        
        (req, res, next)=>{
            
            use.findOne({ name : req.body.name, password : req.body.password })
              
            .then( data => {
                var token = jwt.sign({ _id : data._id }, 'mk');

                const dataname = req.dataname;
                // console.log('dataname', dataname.name)
                // res.render('index', dataname)
                //res.sendFile(__dirname + '/public/index.html')

                io.on('connection',function(socket){
                    socket.emit('jwt', { token})
                }); 
                const name = data.name;
                console.log(name)
                io.on('connection',function(socket){
                    socket.emit('name', name)
                });
                res.render('index', {dataname})
                //console.log('req.data',req.data)              
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json('Lỗi server')
            })

        }
)
app.post('/:id', (req,res,next)=>{

})


app.use(express.static('views'));
io.on('connection',function(socket){
    socket.on('join', function(data){
        console.log(data);
    });
    socket.on('mesChat', data =>{
        console.log({data})
        io.emit('mesChat', data)
    })
    socket.on('join', function (data) {
        console.log(data)
       // socket.join(data.email); 
      });
    
});
server.listen(8000);