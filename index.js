const express = require('express')
const exphbs = require('express-handlebars')
const morgan = require('morgan')

const { CardRepository, Card } = require('./models/card')
const { DatabaseService } = require('./services/database')

const app = express()
const hbs = exphbs()

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', hbs)
app.set('view engine', 'handlebars')
const port = process.env.PORT || 3000

const db = new DatabaseService()

if (!db.exists()) {
    db.init()
}

function isAuthenticated(user, password) {
    // TODO Comprobar en base de datos el usuario
    return user == 'admin' && password == 'admin'
}

function checkValidCardValues(body) {
    return body.name && body.description && body.price
}


// Las vistas de mi web
// GET PUT POST DELETE - API
// GET cuando pedimos una web
app.get('/', function (request, response) {
    response.render('index')
})

// POST Cuando enviamos un form (Login) /login
// Un pagina de login
// Cuando alguien meta user "admin" y password "admin"
// 1. decirme que estoy autenticado "EXITO!"
// 2. redireccione a una pagina interna /dashboard
// 3. si el user password no es admin admin, mostrar "ERROR!"


app.get('/login', (request, response) => {
    response.render('login')
})

app.post('/login', (request, response) => {
    const user = request.body.user
    const password = request.body.password

    if (isAuthenticated(user, password)) {
        response.redirect('/dashboard')
    } else {
        response.render(
            'login',
            {
                message: 'Usuario o password incorrecto',
                message_error: true
            }
        )
    }
})

app.post('/search', (request, response) => {
    // Buscar en cards por nombre
    cards = db.search('cards', 'name', request.body.query)

    // Hacer un render con los cartas elegidas
    response.render('cards', {cards: cards})
})
// Nueva pagina /about, en el menu salga About (/about)
// Dentro de esa pagina, un titulo (h1), un parrafo, un input para suscribirme
// a una newsletter
// Cuando meta mi email y le de al boton de suscribir, me sale un mensaje de exito
// en esa pagina de "suscrito correctamente"
app.get('/about', (request, response) => {
    response.render('about')
})

app.post('/about', (request, response) => {
    response.render('about', { message: 'Te has suscrito!', message_error: false })
})

app.get('/dashboard', (request, response) => {
    response.render('dashboard')
})

app.get('/cards', (request, response) => {
    response.render(
        'cards',
        { cards: CardRepository.getCards() }
    )
})

app.get('/cards', (request, response) => { 
    const query = request.query.text
    let cards

    if (query) {
        cards = db.search('cards', 'name', query)
    } else {
        cards = db.get('cards')
    }

    response.render(
        'cards',
        {
            cards: cards,
            query: query
        }
    )
    
})

app.post('/cards', (request, response) => {
    const cardName = request.body.name
    const description = request.body.description
    const price = request.body.price
    // TODO Comprobar si es vacio y si es asi
    // mostrar un error
    if (!checkValidCardValues(request.body)) {
        response.status(400).render(
            'cards',
            {
                cards: CardRepository.getCards(),
                message: 'Necesitamos que rellenes todos los campos para crear la carta',
                message_error: true
            }
        )
        return
    }

    const newCard = new Card(
        cardName, description, price)

    db.storeOne('cards', newCard)

    response.redirect('/cards')
})

app.get('/delete_card/:id', (request, response) => {
    db.removeOne('cards', request.params.id)
    response.redirect('/cards')
})

app.get('/contacto', function (request, response) {
    response.render('contact')
})

app.post('/contacto', function (request, response) {
    // TODO Enviar mail con sendgrid
    response.render(
        'contact',
        { message: 'Mensaje enviado!', message_error: false }
    )
})

// API para el recurso cards (GET POST PUT/PATCH DELETE)  API Rest JSON
// GET /api/v1/cards  // Listar recurso (cards)
app.get('/api/v1/cards', (request, response) => {
    const cards = CardRepository.getCards()
    response.send(cards)
})

// POST /api/v1/cards      // Crear una carta
app.post('/api/v1/cards', (request, response) => {
    if (!checkValidCardValues(request.body)) {
        response.status(400).send(
            {
                'error': 400,
                'message': 'No has rellenado todos los datos obligatorios: name, price, description'
            }
        )
        return
    }

    const card = new Card(
        request.body.name,
        request.body.description,
        request.body.price)
    db.storeOne('cards', card)

    response.status(201).send(card)
})

// GET /api/v1/cards/:id   // Muestra una carta
app.get('/api/v1/cards/:id', (request, response) => {
    const card = db.findOne('cards', request.params.id)

    if (!card) {
        response.status(404).send(
            { 'error': 404, 'message': 'No existe el recurso 404' }
        )
        return
    }

    response.send(card)
})

// PUT /api/v1/cards/:id       // Editar un elemento
app.put('/api/v1/cards/:id', (request, response) => {
    const card = db.findOne('cards', request.params.id)

    if (!card) {
        response.status(404).send(
            { 'error': 404, 'message': 'No existe el recurso 404' }
        )
        return
    }

    // Solo se puede editar name, price, o description
    // Si me llega uno de estos valores, dejo editar
    // Si no me llega ninguno o me llega cualquier otro
    // devuelvo un 400
    const cardRequest = _.pick(request.body, ['name', 'price', 'description'])

    if (_.isEmpty(cardRequest)) {
        response.status(400).send(
            {
                'error': 400,
                'message': 'No has rellenado alguno de los datos obligatorios: name, price, description'
            }
        )
        return
    }

    const cardEdited = { ...card, ...cardRequest }
    db.updateOne('cards', cardEdited)

    response.send(cardEdited)
})

// DELETE /api/v1/cards/:id    // Eliminar un elemento
app.delete('/api/v1/cards/:id', (request, response) => {

    if (!db.findOne('cards', request.params.id)) {
        response.status(404).send(
            { 'error': 404, 'message': 'No existe el recurso 404' }
        )
        return
    }

    db.removeOne('cards', request.params.id)
    response.status(204).send()
})


app.listen(port, function () {
    console.log(`Servidor iniciado en ${port}`)
})