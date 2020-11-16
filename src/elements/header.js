import React from "react";

function Header() {
  return (
    <header className="users-top">
      <div className="users-title">
        <span>One</span>
        <img src="./chat.svg" alt="text" />
        <span>away</span>
      </div>
      <nav>
        <a href="#" key="users" className="users-link">
          Users
        </a>
        <a href="#" key="groups" className="users-link">
          Groups
        </a>
        <a href="#" key="chat" className="users-link">
          Status
        </a>
      </nav>
    </header>
  );
}

export default Header;
