import React from 'react'
import './authtext.css'


function Authtext() {
    return (
        <section className="auth-container">
        <div className="auth-top">
        <img src="./chat.svg" alt="Chat" className="conversation"/>
        </div>
        <div className="auth-bottom">
            <div className="auth-text">
                <img src="./google.png" alt="G"/>
                <h5>Continue with Google</h5>
            </div>
        </div>
        </section>
    )
}

export default Authtext
