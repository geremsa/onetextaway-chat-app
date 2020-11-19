import React from "react";
import Header from "../elements/header";
import {Link} from "react-router-dom";
import './status.css'
function Status() {
  return (
    <main className="users-list">
      <Header />
      <section className="users-body">
      <Link to='/newstatus' className="create-group">
       <span>Update a status</span> 
       <img src="/status.svg" alt="plus"/>
      </Link>
      </section>
    </main>
  );
}

export default Status;
