import React from 'react'
import { Link } from 'react-router-dom';


const Landing = () => {
    return (
        <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">We are here to help you Succed!</h1>
          <p className="lead">
            Get help of your courses from other Students.
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
          </div>  

          <div className = "below-container">
              <p className="lead">
                The Project is initiated by CSCI Club of Saint Cloud State University.
              </p>
          </div>

        </div>    
      </div>
    </section>
    )
}

export default Landing
