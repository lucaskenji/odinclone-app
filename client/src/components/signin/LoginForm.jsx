import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

function LoginForm(props) {  
  useEffect(() => {
    props.verifyAuth();
  }, []);
  
  const handleLogin = (form) => {
    form.preventDefault();
    
    const email = form.target.email.value;
    const password = form.target.password.value;
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password }, { withCredentials: true })
      .then((response) => {
        window.location.href = '/';
      })
      .catch((err) => {
        console.log(err);
      })
  }
    
  if (props.state.loading) {
    return '';
  } else if (!props.state.isLogged) {
    return (    
      <div>
        <form onSubmit={handleLogin}>
          <label htmlFor="emailLogin" className="sr-only">Email:</label>
          <input type="text" name="email" id="emailLogin" placeholder="Email" />
          <br/>
          
          <label htmlFor="passwordLogin" className="sr-only">Password:</label>
          <input type="password" name="password" id="passwordLogin" placeholder="Password" />
          <br/>
          <br/>
          
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  } else {
    return <Redirect to="/" />
  }
}

export default LoginForm;