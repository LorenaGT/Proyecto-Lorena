const express = require('express')
const exphbs = require ('express-handlebars')

const { Card, CardRepository } = require('./models/card')
const { DatabaseService } = require('./services/database')


const app = express()
const hbs = exphbs()
app.use(express.urlencoded({

    extended: true
  
  }))

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
const port = process.env.PORT || 3000

const db = new DatabaseService()

if(!db.exists()) {
    db.init()
}


function isAuthenticated(user, password) {
    return user == 'admin' && password == 'admin'
}

// Las vistas de mi web
// GET PUT POST DELETE - API
// GET cuando pedimos una web

// POST Cuando enviamos un form (Login, Registro)
// Una pagina de login
// Cuando alguien meta user "admin" y password "admin"
// 1. Decirme que estoy autenticado "EXITO"
// 2. Redireccione a una pagina interna
// 3. Si el user password no es admin admin, mostrar "ERROR!"
app.get('/', function(request, response) {
    response.render('index')
})



app.get('/hola', function(request, response) {
    response.send('Hola Lorena')
})

app.get('/dashboard', (request, response) => {
    response.render('dashboard')
})


app.get('/contacto', function(request, response) {
    response.render('contact')

})

// Nueva pagina/about en el menu salga About
//Dentro de esa pagima, un titulo (h1), un parrafo, un input para suscribirse
//Cuando me meto mi email y le dal boton suscrbirir, me sale un mesanej de exito
// en esa pagina de suscrito correctamente
app.get('/about', function (request,response) {
      response.render('about')
})

app.post('/about', (request, response) => {
    response.render('about', {message: 'Te has suscrito!', message_error: false})
})
    

app.get('/login', function(request,response) {
    response.render('login')
})

app.get('/cards', function(request,response) {
    response.render('cards',  {cards: new CardRepository().getCards()})
})

app.post('/cards', (request, response) => {
    const cardName = request.body.name

    const price = request.body.price
    const description = request.body.description
    const newCard = new Card(
    cardName, description, price)

   
    const database = new DatabaseService()
    database.storeOne('cards', newCard) 

    response.redirect('/cards')
})
    
app.post('/login', function (request, response)  {
    const user = request.body.user
    const password = request.body.password



    if (isAuthenticated(user, password)) {
        // TODO Implement dashboard
        response.redirect('/dashboard')
    } else {
        // TODO Mostrar un mensaje en el login en el login.handlebars
        // TODO Meter un estilo tipo Bootstrap
        response.render(
            'login',
            {
               message:'Usuario o password incorrecto',
               message_error: true
            })

    }
})


app.post('/contacto', function(request, response) {
    console.log(request.body.email)
    console.log(request.body.message)
    response.render(
        'contact', 
        {message: 'Mensaje enviado!', message_error: false})

})

app.get('/users/:user', function(request, response) {
    // TODO Hacer una consulta para traerme los datos
    // de este usuario
    response.send(`Usuario ${request.params.user}`)
})

app.listen(port, function() {
     console.log(`Servidor iniciado ${port}`)
})





