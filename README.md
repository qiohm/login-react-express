# Express + react front-end - exemple

## login (express)

1. installer les dependencies
1. remplacer `LOCAL_IP` (dans `login`)
1. démarrer le serveur

## login-react (react-app)

1. installer les dependencies
1. créer un component `Dashboard`

```javascript
import React from 'react'

const Dashboard = ({ user }) => {
  return <p>Welcome, {user} 🎉</p>
}

export default Dashboard
```

3. modifier `src/App.js`

```javascript
import React from 'react'
import LoginForm from './components/LoginForm.js'
import Dashboard from './components/Dashboard.js'

function App() {
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Authentification</h1>
      <LoginForm />
      <Dashboard />
      <button type="button" className="btn btn-danger">
        Log out
      </button>
    </div>
  )
}

export default App
```

4. Tous les components ne devraient pas être rendus sur la page en même temps, nous devons aussi passer `username` dans le component `Dashboard`

```javascript
import React, { useState } from 'react'
import LoginForm from './components/LoginForm.js'
import Dashboard from './components/Dashboard.js'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Authentification</h1>
      {!loggedIn && (
        <LoginForm setUsername={setUsername} setLoggedIn={setLoggedIn} />
      )}
      {loggedIn && (
        <>
          <Dashboard user={username} />
          <button className="btn btn-danger" onClick={handleLogoutClick}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}
```

5. Dans `src/components/LoginForm.js`

```javascript
import React from 'react'

const LoginForm = () => {
  const handleFormSubmit = (event) => {
    event.preventDefault()
    fetch('http://192.168.1.70:7777/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        console.log(response)
        return response.json()
      })
      .catch((error) => console.error(error))
  }
  return (
    <form onSubmit={handleFormSubmit} className="mt-4">
      {/* ... */}
    </form>
  )
}
```

## login (express)

1.  ### CORS (Cross Origin Ressource Sharing)

Nous devons ajouter middleware:

```javascript
// login/src/app.js
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
```

2. Nous allons remplacer `res.send(string)` par `res.send(object)` (`res.json(object)` fonctionne aussi)

```javascript
// src/app.js
// avant (x2) res.send('Username or password invalid')
res.send({ valid: false })
// avant res.send(`Welcome to your dashboard ${username}`)
res.send({ valid: true, username })
```

## login-react (react-app)

1. Nous allons completer `handleFormSubmit` dans `src/components/LoginForm.js`

```javascript
//

const handleFormSubmit = (e) => {
  e.preventDefault()
  const username = e.target.elements.username.value
  const password = e.target.elements.password.value
  e.target.reset()
  fetch('http://192.168.1.70:7777/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((data) => {
      if (data.valid) {
        setLoggedIn(true)
        setUsername(data.username)
      } else {
        alert('Your credentials are not valid, try again ;)')
      }
    })
    .catch((error) => console.error(error))
}
```

2. Finallemend dans `src/App.js` nous allons ajouter handler pour le bouton

```javascript
import React, { useState } from 'react'
import LoginForm from './components/LoginForm.js'
import Dashboard from './components/Dashboard'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const handleLogoutClick = () => {
    setUsername('')
    setLoggedIn(false)
  }
  return (
    <div className="container my-4">
      <h1 className="display-3 text-center mb-4">Authentification</h1>
      {/* ... */}
      {loggedIn && (
        <>
          <Dashboard user={username} />
          <button className="btn btn-danger" onClick={handleLogoutClick}>
            Log out
          </button>
        </>
      )}
    </div>
  )
}

export default App
```
