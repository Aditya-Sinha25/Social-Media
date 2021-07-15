const express =require('express');
const env =require('./config/environment');
const logger =require('morgan');
const cookieParser =require('cookie-parser');
const cors =require('cors');
const app =express();
require('./config/view-helpers')(app);
const port =8000;
const db =require('./config/mongoose');
const session =require('express-session');
const passport =require('passport');
const passportLocal =require('./config/passport-local-strategy');
const passportJWT =require('./config/passport-jwt-strategy');
const passportGoogle =require('./config/passport-google-oauth2-strategy');
const MongoStore =require('connect-mongo')(session);
const sassMiddleware =require('node-sass-middleware');
const flash =require('connect-flash');
const customMware =require('./config/middleware');

//var whitelist = ['localhost:8000', 'localhost:5000']
//var corsOptions = {
//    origin: function (origin, callback) {
//      if (whitelist.indexOf(origin) !== -1 || !origin) {
//        callback(null, true)
//      } else {
//        callback(new Error('Not allowed by CORS'))
//      }
//    }
//  }
//
// app.use(cors({
//     origin:'*'
// }));

// setup the chat server to be used with socket.io
console.log(env.name);
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path=require('path');


if(env.name=='development'){
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }));
}



app.use(express.urlencoded());
app.use(cookieParser());

console.log(env.asset_path);

app.use(express.static(env.asset_path));



//makes the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));


const expressLayouts =require('express-ejs-layouts');
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name:'Codeial',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup OK');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//check express router
app.use('/',require('./routes'));

app.listen(port ,function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});