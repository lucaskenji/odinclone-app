import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import localStrings from '../../localization';
import fakeEmail from 'fake-email';

function LoginForm(props) {
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
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
          setErrorMessage(localStrings[locale]['homepage']['error']['badRequest']);
        } else {
          setErrorMessage(localStrings[locale]['homepage']['error']['internal']);
        }
        
        setFinishedAsync(true);
      })
  }
  
  const authenticateGuest = () => {
    setFinishedAsync(false);
    setErrorMessage('');
    
    const birthDate = new Date();
    const emailIdentifier = birthDate.toJSON().replace(/[-:.ZT]/g, '');
    const guestEmail = fakeEmail(emailIdentifier)

    const newUser = {
      firstName: 'Guest',
      lastName: 'account',
      email: guestEmail,
      password: 'guest',
      birthDate,
      gender: 'other',
      isGuest: true
    };
        
    axios.post(`${process.env.REACT_APP_API_URL}/api/users`, newUser)
      .then((registerResponse) => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { email: guestEmail, password: 'guest' }, { withCredentials: true })
          .then((loginResponse) => {
            localStorage.setItem('csrfToken', loginResponse.headers.csrf);
            window.location.href = '/';
          })
          .catch((err) => {
            setErrorMessage(localStrings[locale]['homepage']['error']['internal']);
            setFinishedAsync(true);
          })
      })
      .catch((err) => {
        setErrorMessage(localStrings[locale]['register']['error']['internal']);
        setFinishedAsync(true);
      })
  }

  return (    
    <div id="login-container">
      { errorMessage && <div className="error-message">{errorMessage}</div> }
      
      <form onSubmit={handleLogin} id="login-form">
        <label htmlFor="emailLogin" className="sr-only">{localStrings[locale]['homepage']['emailField']}</label>
        <input 
          disabled={!finishedAsync} 
          className="form-input uses-font" 
          type="text" 
          name="email" 
          id="emailLogin" 
          placeholder={localStrings[locale]['homepage']['emailField']} 
        />
        <br/>
        
        <label htmlFor="passwordLogin" className="sr-only">{localStrings[locale]['homepage']['passwordField']}</label>
        <input 
          disabled={!finishedAsync} 
          className="form-input uses-font" 
          type="password" 
          name="password" 
          id="passwordLogin" 
          placeholder={localStrings[locale]['homepage']['passwordField']} 
        />
        <br/>
        <br/>
        
        <button disabled={!finishedAsync} className="btn btn-primary btn-home uses-font btn-login" type="submit">
          {localStrings[locale]['homepage']['login']}
        </button>
      </form>
      <br/>
        <button disabled={!finishedAsync} onClick={authenticateGuest} className="btn btn-guest uses-font">
          {localStrings[locale]['homepage']['guest']}
        </button>
      <hr/>

      <Link className="btn btn-confirm btn-home btn-link" to="/register">
        {localStrings[locale]['homepage']['createAccount']}
      </Link>
      
      <a className="btn btn-primary btn-home btn-link btn-login-fb" href={process.env.REACT_APP_API_URL + '/api/facebook'}>
        {localStrings[locale]['homepage']['loginWithFb']}
      </a>
    </div>
  );
}

export default LoginForm;