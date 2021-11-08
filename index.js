const express = require('express')
const exphbs = require ('express-handlebars')

const app = express()
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
const port = 3000

// Las vistas de mi web
// GET PUT POST DELETE - API
// GET cuando pedimos una web
// POST Cuando enviamos un form (Login, Registro)
app.get('/', function(request, response) {
    response.render('index')
})

app.get('/hola', function(request, response) {
    response.send('Hola Lorena')
})

app.get('/contacto', function(request, response) {
    response.send('contact')

})


app.listen(port, function() {
     console.log('Servidor iniciado')
})
