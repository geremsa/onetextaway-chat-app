import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Authtext from './users/authtext'
import Userslist from './users/userslist'
import firebase from "./config/base";
import {useAuthState} from 'react-firebase-hooks/auth'
const auth = firebase.auth();


function App() {
  const [user,loading]=useAuthState(auth);
  if(user) 
  let route =  (
    <Router>
    <Route path='/users'>
    <Userslist/>
    </Route>
    </Router>
    )
  if(!user) let route =  <Authtext/>
  return (
    <main>
    {loading && <div>loading</div> }
      {!loading && route}
    </main>
  )
}

export default App
