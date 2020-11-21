import React from "react";
import {NavLink} from 'react-router-dom'
import firebase from "../config/base";
import {useAuthState} from 'react-firebase-hooks/auth'
const auth = firebase.auth();

function Header() {
  const [user]=useAuthState(auth);
  const signOut = () => {
    auth.signOut();
  };
  return (
    <header className="users-top">
      <div className="users-title">
      <section>
        <span>One</span>
        <img src="./chat.svg" alt="text" />
        <span>away</span>
      </section>
     {user && <p className="logout" onClick={signOut}>logout</p>}
      </div>
      <nav>
        <NavLink to='/' activeClassName="link-active" exact key="users" className="users-link">
          Chats
        </NavLink>
        <NavLink to='/groups' activeClassName="link-active" exact key="groups" className="users-link">
          Groups
        </NavLink>
        <NavLink to='/status' activeClassName="link-active" exact key="status" className="users-link">
          Status
        </NavLink>
        <NavLink to='/users' activeClassName="link-active" exact className="users-link">
          Users
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
