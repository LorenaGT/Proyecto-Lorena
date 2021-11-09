const express = require('express')
const exphbs = require ('express-handlebars')

const app = express()
app.use(express.urlencoded({

    extended: true
  
  }))

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
const port = process.env.PORT || 3000

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

app.get('/login', function(request,response) {
    response.render('login')
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
            {message:'Usuario o password incorrecto'})
    }
})


app.post('/contacto', function(request, response) {
    console.log(request.body.email)
    console.log(request.body.message)
    response.send('formulario enviado')

})

app.get('/users/:user', function(request, response) {
    // TODO Hacer una consulta para traerme los datos
    // de este usuario
    response.send(`Usuario ${request.params.user}`)
})

app.listen(port, function() {
     console.log(`Servidor iniciado ${port}`)
})





