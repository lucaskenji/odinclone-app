import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../images/logo.svg';

function RegisterForm(props) {
  const { verifyAuth } = props;
  const [finishedAsync, setFinishedAsync] = useState(true);
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);
  
  const requestRegister = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    
    const fields = form.target;
    const birthDate = new Date(fields.birthYear.value, fields.birthMonth.value, fields.birthDay.value);
    
    const newUser = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      password: fields.password.value,
      birthDate,
      gender: fields.gender.value
    };
        
    axios.post('http://localhost:3030/api/users', newUser)
      .then((response) => {
        console.log(response);
        window.location.href = '/';
        setFinishedAsync(true);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.details);
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
        <Link to="/"><img src={Logo} alt="Odinclone logo" id="register-logo" /></Link>
        
        <form id="register-form" onSubmit={requestRegister}>
          <h1 id="register-title">Register</h1>
          
          <label htmlFor="firstName" className="sr-only">First name</label>
          <input disabled={!finishedAsync} className="form-input uses-font" type="text" placeholder="First name" name="firstName" id="firstName" />
          
          <label htmlFor="lastName" className="sr-only">Last name</label>
          <input disabled={!finishedAsync} className="form-input uses-font" type="text" placeholder="Last name" name="lastName" id="lastName" />
          
          <label htmlFor="email" className="sr-only">Email</label>
          <input disabled={!finishedAsync} className="form-input uses-font" type="email" placeholder="Email" name="email" id="email" />
          
          <label htmlFor="password" className="sr-only">Password</label>
          <input disabled={!finishedAsync} className="form-input uses-font" type="password" placeholder="Password" name="password" id="password" />
                    
          <fieldset id="birthdate-fieldset" className="fieldset-sr-only">
            <legend>Birth date</legend>
            
            <select disabled={!finishedAsync} className="form-select uses-font" name="birthDay" id="birthDay" defaultValue="1">
              <option key="1">1</option>
              {
                [...Array(32).keys()].splice(2).map((day) => <option value={day} key={day}>{day}</option>)
              }
            </select>
            
            <select disabled={!finishedAsync} className="form-select uses-font" name="birthMonth" id="birthMonth" defaultValue="Jan">
              <option value="0" key="Jan">Jan</option>
              {
                ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
          <legend>Gender</legend>
            <label>
              <input disabled={!finishedAsync} type="radio" name="gender" value="female" />&nbsp;Female
            </label>
            <label>
              <input disabled={!finishedAsync} type="radio" name="gender" value="male" />&nbsp;Male
            </label>
            <label>
              <input disabled={!finishedAsync} type="radio" name="gender" value="other" />&nbsp;Other
            </label>
          </fieldset>
          
          <button disabled={!finishedAsync} className="btn btn-confirm btn-home uses-font" type="submit">Create account</button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;