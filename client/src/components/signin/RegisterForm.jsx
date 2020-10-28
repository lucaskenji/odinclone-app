import React from 'react';
import axios from 'axios';

function RegisterForm(props) {
  const requestRegister = (form) => {
    form.preventDefault();
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
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data.details);
        }
      })
  }
  
  const yearOptions = [];
  
  for (let i = (new Date().getFullYear() - 1); i > 1910; i--) {
    yearOptions.push(i);
  }
  
  return (
    <form onSubmit={requestRegister}>
      <label htmlFor="firstName" className="sr-only">First name</label>
      <input type="text" placeholder="First name" name="firstName" id="firstName" />
      <br/>
      
      <label htmlFor="lastName" className="sr-only">Last name</label>
      <input type="text" placeholder="Last name" name="lastName" id="lastName" />
      <br/>
      
      <label htmlFor="email" className="sr-only">Email</label>
      <input type="email" placeholder="Email" name="email" id="email" />
      <br/>
      
      <label htmlFor="password" className="sr-only">Password</label>
      <input type="password" placeholder="Password" name="password" id="password" />
      <br/>
      
      <fieldset className="fieldset-sr-only">
        <legend>Birth date</legend>
        
        <label htmlFor="birthDay" className="sr-only"></label>
        <select name="birthDay" id="birthDay" defaultValue="1">
          <option key="1">1</option>
          {
            [...Array(32).keys()].splice(2).map((day) => <option value={day} key={day}>{day}</option>)
          }
        </select>
        
        <select name="birthMonth" id="birthMonth" defaultValue="Jan">
          <option value="0" key="Jan">Jan</option>
          {
            ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            .map((month, index) => <option value={index+1} key={month}>{month}</option>)
          }
        </select>
        
        <select name="birthYear" id="birthYear" defaultValue="2020">
          <option value="2020" key="2020">2020</option>
          {
            yearOptions.map((year) => <option value={year} key={year}>{year}</option>)
          }
        </select>
        
        
      </fieldset>
      
      <fieldset className="fieldset-sr-only">
      <legend>Gender</legend>
        <label>
          <input type="radio" name="gender" value="female" />&nbsp;Female
        </label>
        <label>
          <input type="radio" name="gender" value="male" />&nbsp;Male
        </label>
        <label>
          <input type="radio" name="gender" value="other" />&nbsp;Other
        </label>
      </fieldset>
      
      <button type="submit">Create account</button>
    </form>
  );
}

export default RegisterForm;