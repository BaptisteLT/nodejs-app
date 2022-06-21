const express = require('express');
const session = require('express-session');
const { request } = require('http');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    cookie: { maxAge: 60000 },
    saveUninitialized: true
}))


//Middleware
const logRequest = function(request, response, next){
    console.log(`> ${new Date().toDateString()} + ${request.method} ${request.originalUrl}`);
    next();
};
app.use(logRequest);


app.listen(port,function(){
    console.log(`Serveur Express lancé sur le port : ${port}`)
})

app.get('/', function(request, response) {
    if(!request.session.views)
    {
        request.session.views=0
    }
    request.session.views++;
    
    console.log(request.session.views)
    response.sendFile(path.join(__dirname,'views/index.html'))
});

app.get('/connexion', function(req, res) {
    res.sendFile(path.join(__dirname,'views/connexion.html'));
});
app.post('/connexion', function(req, res) {
    let password = 'prout';
    console.log(req.body.pwd)
    if(req.body.pwd !== password)
    {
        res.redirect('/connexion');
    }

    res.redirect('/');
});

app.use(function(request,response){
    response.status(404).send('Page inexistante')
});

