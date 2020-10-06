import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import path from 'path'

/*Le repertoire public est relatif au repertoire d'où on lance notre commande
node. Donc si on exécute notre application express depuis un repertoire ou le
dossier public est présent il n'y aura pas de problème. Mais si on souhaite
exécuter notre application express depuis un repertoire différent cela posera
problème. Pour cela il faudra que l'on travaille avec des chemins absolus.*/
//We can't use _filename and _dirname directives anymore in esm modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//our user mini-database
const db_user = {
    alice: '123',
    bob: '456',
    charlie: `789`,
}

//middleware for checking if user exists: if inside database their is an own
//property (not inherited from prototype) with the name username by using
//hasOwnProperty() method similar to username in db_user (which returns
//enumerable properties also inherited)
const userChecker = (req, res, next) => {
    const username = req.body.username
    console.log(req.body)
    if (db_user.hasOwnProperty(username)) {
        next()
    } else {
        res.send('Username or password invalid')
    }
}

//middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
    const username = req.body.username
    const password = req.body.password
    if (db_user[username] === password) {
        next()
    } else {
        res.send('Username or password invalid')
    }
}

const IP = '172.18.241.127'
const PORT = 7777

const app = express()

//Configure express to use body-parser as middleware on all routes
//to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }))
//to support JSON-encoded bodies
app.use(bodyParser.json())

//Configure express to use the 2 middlewares for /login route only
app.use('/login', userChecker)
app.use('/login', passwordChecker)

//Create route /login for POST method -> ne système de login simple accessible
//par des requêtes POST sur http://IP:PORT/login
/*We are waiting for a POST request with a body containing json data
{'username':'alice', 'password':'123'} */
app.post('/login', (req, res) => {
    let username = req.body.username
    res.send(`Welcome to your dashboard ${username}`)
})

app.listen(PORT, IP, () => {
    console.log(`listening on ${IP}:${PORT}`)
})
