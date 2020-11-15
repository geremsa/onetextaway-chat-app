import React from 'react'
import './userlist.css'

function Userslist() {
    return (
      <main className="users-list">
          <header className="users-top">
              <div className="users-title">
                  <span>One</span>
                  <img src="./chat.svg" alt="text"/>
                  <span>away</span>
              </div>
              <nav>
               <a href="#" key="chat" className="users-link">Chat</a>
               <a href="#" key="groups" className="users-link">Groups</a>
               <a href="#" key="groups" className="users-link">Users</a>
              </nav>
          </header>
          <section className="users-body">
            
          </section>
      </main>
    )
}

export default Userslist
