import React from 'react';
import axios from 'axios';

function LoginForm(props) {
  const handleLogin = (form) => {
    form.preventDefault();
    
    const email = form.target.email.value;
    const password = form.target.password.value;
    
    axios.post('http://localhost:3030/api/login', { email, password }, { withCredentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  
  return (
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
  );
}

export default LoginForm;