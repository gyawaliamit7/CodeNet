import React, { Fragment, useState } from 'react'

 const Register = () => {
   //initializing useState
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     password: '',
     confirmPassword: ''
   });
   //importing data from formData
   const {name, email ,password, confirmPassword }  = formData;

   //setting the datas for the form 
   const onChange = e => setFormData({
     ...formData, [e.target.name]:e.target.value
   });

   //when the submit button is clicked 
   const onSubmit = e => {
     e.preventDefault();
     if (password !== confirmPassword) {
       console.log('Password donot match');
     }
     else {
       console.log (formData);
     }
   }

    return (
    <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit = {e => onSubmit(e)}>
        <div className="form-group">
          <input type="text" 
               value = {name} onChange = {e=> onChange(e)} className = "input-color" placeholder="Name" name="name" required />
        </div>
        <div className="form-group">
          <input type="email" className = "input-color" 
            value = {email} onChange = {e=> onChange(e)} required
            placeholder="Email Address" name="email" />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            className = "input-color"
            placeholder="Password"
            value = {password} onChange = {e=> onChange(e)}
            name="password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className = "input-color"
            placeholder="Confirm Password"
            value = {confirmPassword} onChange = {e=> onChange(e)}
            name="confirmPassword"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </Fragment>
    )
}

export default Register
