import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginForm(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleLogin = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    setErrorMessage('');
    
    const email = form.target.email.value;
    const password = form.target.password.value;
    
    axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password }, { withCredentials: true })
      .then((response) => {
        localStorage.setItem('csrfToken', response.headers.csrf);
        window.location.href = '/';
      })
      .catch((err) => {
        if (err.response) {
          setErrorMessage('Incorrect username or password.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
        
        setFinishedAsync(true);
      })
  }
    

  return (    
    <div id="login-container">
      { errorMessage && <div className="error-message">{errorMessage}</div> }
      
      <form onSubmit={handleLogin} id="login-form">
        <label htmlFor="emailLogin" className="sr-only">Email:</label>
        <input disabled={!finishedAsync} className="form-input uses-font" type="text" name="email" id="emailLogin" placeholder="Email" />
        <br/>
        
        <label htmlFor="passwordLogin" className="sr-only">Password:</label>
        <input disabled={!finishedAsync} className="form-input uses-font" type="password" name="password" id="passwordLogin" placeholder="Password" />
        <br/>
        <br/>
        
        <button disabled={!finishedAsync} className="btn btn-primary btn-home uses-font" type="submit">Login</button>
      </form>
      <br/>
      <hr/>
      
      <Link className="btn btn-confirm btn-home btn-link" to="/register">
        Create an account
      </Link>
      
      <a className="btn btn-primary btn-home btn-link btn-login-fb" href={process.env.REACT_APP_API_URL + '/api/facebook'}>
        Login with Facebook
      </a>
    </div>
  );
}

export default LoginForm;