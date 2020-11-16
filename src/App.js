import React from 'react'
import Authtext from './users/authtext'
import Userslist from './users/userslist'
import firebase from "./config/base";
import {useAuthState} from 'react-firebase-hooks/auth'
const auth = firebase.auth();


function App() {
  const [user]=useAuthState(auth);
  return (
    <div>
    {
      user &&
      <Userslist/>
    }
    {
      !user &&
      <Authtext/>
    }
    </div>
  )
}

export default App
