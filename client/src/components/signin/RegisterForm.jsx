import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../images/logo.svg';
import { validateName, validateEmail, validatePassword } from './utils/validateRegister';
import localStrings from '../../localization';

function RegisterForm(props) {
  const { verifyAuth } = props;
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);

  const requestRegister = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    setErrorMessage('');
    
    const fields = form.target;
    const birthDate = new Date(fields.birthYear.value, fields.birthMonth.value, fields.birthDay.value);
    
    if (validateName(fields.firstName).valid === false
        || validateName(fields.lastName).valid === false
        || validateEmail(fields.email).valid === false
        || validatePassword(fields.password).valid === false) {
      setFinishedAsync(true);
      return;
    }
    
    const newUser = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      password: fields.password.value,
      birthDate,
      gender: fields.gender.value
    };
        
    axios.post(`${process.env.REACT_APP_API_URL}/api/users`, newUser)
      .then((response) => {
        window.location.href = '/';
        setFinishedAsync(true);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            setErrorMessage(localStrings[locale]['register']['error']['invalidData']);
          } else if (err.response.status === 409) {
            setErrorMessage(localStrings[locale]['register']['error']['emailConflict']);
          }
        } else {
          setErrorMessage(localStrings[locale]['register']['error']['internal']);
        }
        
        setFinishedAsync(true);
      })
  }
  
  const yearOptions = [];
  
  for (let i = (new Date().getFullYear() - 1); i > 1910; i--) {
    yearOptions.push(i);
  }
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (props.state.isLogged) {
    return (<Redirect to="/" />)
  } else {
    return (
      <div id="register-container">
        <Link to="/"><img src={Logo} alt={localStrings[locale]['register']['alt']['logo']} id="register-logo" /></Link>
        
        <form id="register-form" onSubmit={requestRegister}>
        <h1 id="register-title">{localStrings[locale]['register']['header']}</h1>
          
          { errorMessage && <div className="error-message">{errorMessage}</div> }
          
          <label htmlFor="firstName" className="sr-only">{localStrings[locale]['register']['firstName']}</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder={localStrings[locale]['register']['firstName']} 
            name="firstName" 
            id="firstName" 
            onInput={(ev) => validateName(ev.target)}
          />
          
          <label htmlFor="lastName" className="sr-only">{localStrings[locale]['register']['lastName']}</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder={localStrings[locale]['register']['lastName']} 
            name="lastName" 
            id="lastName" 
            onInput={(ev) => validateName(ev.target)} 
          />
          
          <label htmlFor="email" className="sr-only">{localStrings[locale]['register']['email']}</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder={localStrings[locale]['register']['email']} 
            name="email" 
            id="email" 
            onInput={(ev) => validateEmail(ev.target)}
          />
          
          <label htmlFor="password" className="sr-only">{localStrings[locale]['register']['password']}</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="password" 
            placeholder={localStrings[locale]['register']['password']} 
            name="password" 
            id="password" 
            onInput={(ev) => validatePassword(ev.target)} 
          />
                    
          <fieldset id="birthdate-fieldset" className="fieldset-sr-only">
            <legend>{localStrings[locale]['register']['birthDate']}</legend>
            
            <select disabled={!finishedAsync} className="form-select uses-font" name="birthDay" id="birthDay" defaultValue="1">
              <option key="1">1</option>
              {
                [...Array(32).keys()].splice(2).map((day) => <option value={day} key={day}>{day}</option>)
              }
            </select>
            
            <select disabled={!finishedAsync} className="form-select uses-font" name="birthMonth" id="birthMonth" defaultValue="Jan">
              <option value="0" key="Jan">{localStrings[locale]['register']['january']}</option>
              {
                localStrings[locale]['register']['monthNames']
                .map((month, index) => <option value={index+1} key={month}>{month}</option>)
              }
            </select>
            
            <select disabled={!finishedAsync} className="form-select uses-font" name="birthYear" id="birthYear" defaultValue="2020">
              <option value="2020" key="2020">2020</option>
              {
                yearOptions.map((year) => <option value={year} key={year}>{year}</option>)
              }
            </select>            
          </fieldset>
          
          <fieldset className="fieldset-sr-only">
          <legend>{localStrings[locale]['register']['gender']}</legend>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="female" 
                required
              />&nbsp;{localStrings[locale]['register']['female']}
            </label>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="male" 
                required  
              />&nbsp;{localStrings[locale]['register']['male']}
            </label>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="other" 
                required
              />&nbsp;{localStrings[locale]['register']['other']}
            </label>
          </fieldset>
          
          <button disabled={!finishedAsync} className="btn btn-confirm btn-home uses-font" type="submit">
            {localStrings[locale]['register']['createAccount']}
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;