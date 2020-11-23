import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { validateName, validateEmail, validatePassword } from '../signin/utils/validateRegister';

function UserSettings(props) {
  const { verifyAuth } = props;
  const { loggedUserId } = props.state;
  const [finishedAsync, setFinishedAsync] = useState(true);
  const [user, setUser] = useState({});
  const [photoUrl, setPhotoUrl] = useState('');
  const [urlIsValid, setUrlIsValid] = useState(true);
  const [validatedUrl, setValidatedUrl] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);
  
  useEffect(() => {
    if (loggedUserId) {      
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}`)
        .then((response) => {
          const userWithStringData = {...response.data};
          userWithStringData.birthDate = new Date(response.data.birthDate);
          setUser(userWithStringData);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }, [loggedUserId])
  
  
  const requestUpdate = (form) => {
    form.preventDefault();
    setFinishedAsync(false);
    setErrorMessage('');
    
    // Checks validation
    if (!validatedUrl || !urlIsValid) {
      setFinishedAsync(true);
      return;
    }
    
    const fields = form.target;
    const birthDate = new Date(fields.birthYear.value, fields.birthMonth.value, fields.birthDay.value);
    
    if (validateName(fields.firstName).valid === false || validateName(fields.lastName).valid === false) {
      setFinishedAsync(true);
      return;
    }
    
    if (!user.facebookId) {
      if (validateEmail(fields.email).valid === false || validatePassword(fields.password).valid === false) {
        setFinishedAsync(true);
        return;
      }
    }
    
    // Updates
    const updatedUser = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      photo: fields.photoUrl.value,
      birthDate,
      gender: fields.gender.value
    };
    
    if (!user.facebookId) {
      updatedUser.email = fields.email.value;
      updatedUser.password = fields.password.value;
    }
        
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}`, updatedUser)
      .then((response) => {
        console.log(response);
        setFinishedAsync(true);
        window.location.href='/profile/' + loggedUserId;
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 409) {
            setErrorMessage('The email provided is already in use.');
          } else {
            setErrorMessage('Invalid data.');
          }
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
        setFinishedAsync(true);
      })
  }
  
  const handleInputUrl = (input) => {
    setValidatedUrl(false);
    setPhotoUrl(input.target.value);
  }
  
  const handleLoadImage = () => {
    setUrlIsValid(true);
    setValidatedUrl(true);
  }
  
  const handleErrorImage = () => {
    setValidatedUrl(true);
    
    if (photoUrl.length === 0) {
      setUrlIsValid(true);
      return;
    }
    
    setUrlIsValid(false);
  }
  
  // All years available on the birth year <select>
  const yearOptions = [];
  
  for (let i = (new Date().getFullYear()); i > 1910; i--) {
    yearOptions.push(i);
  }
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />)
  } else if (Object.keys(user).length === 0) {
    return 'Loading user data...';
  } else {
    return (
      <div id="update-form-container">
        <form id="update-form" onSubmit={requestUpdate}>
          <h1 id="update-title">Settings</h1>
          
          { errorMessage && <div className="error-message">{errorMessage}</div> }
          
          <label htmlFor="updateFirstName" className="sr-only">First name</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder="First name" 
            name="firstName" 
            id="updateFirstName" 
            defaultValue={user.firstName} 
            onInput={(ev) => validateName(ev.target)}
          />
          
          <label htmlFor="updateLastName" className="sr-only">Last name</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder="Last name" 
            name="lastName" 
            id="updateLastName" 
            defaultValue={user.lastName} 
            onInput={(ev) => validateName(ev.target)} 
          />
          
          {
            user.facebookId ? '' :
            <React.Fragment>
              <label htmlFor="updateEmail" className="sr-only">Email</label>
              <input 
                disabled={!finishedAsync} 
                className="form-input uses-font" 
                type="text" 
                placeholder="Email" 
                name="email" 
                id="updateEmail" 
                defaultValue={user.email} 
                onInput={(ev) => validateEmail(ev.target)}
              />
          
              <label htmlFor="updatePassword" className="sr-only">Password</label>
              <input 
                disabled={!finishedAsync} 
                className="form-input uses-font" 
                type="password" 
                placeholder="Password" 
                name="password" 
                id="updatePassword" 
                onInput={(ev) => validatePassword(ev.target)} 
              />
            </React.Fragment>
          }
          
          <img 
            id="image-preview-form" 
            src={photoUrl} 
            onLoad={handleLoadImage} 
            onError={handleErrorImage} 
            aria-hidden="true" 
            alt="" 
          />
          
          { urlIsValid 
              || 
              <div className="error-msg">
                <i className="fas fa-exclamation-circle"></i> The image URL provided is invalid.
              </div> }
          
          <label htmlFor="updatePhoto" className="sr-only">Avatar URL</label>
          <input 
            disabled={!finishedAsync} 
            className="form-input uses-font" 
            type="text" 
            placeholder="Avatar URL" 
            name="photoUrl" 
            id="updatePhoto" 
            defaultValue={user.photo} 
            onChange={handleInputUrl}
          />
                    
          <fieldset id="update-birthdate-fieldset" className="fieldset-sr-only">
            <legend>Birth date</legend>
            
            <select disabled={!finishedAsync} 
              className="form-select uses-font" 
              name="birthDay" 
              id="updateBirthDay" 
              defaultValue={user.birthDate.getDate()}
            >
              {
                [...Array(32).keys()].splice(1).map((day) => <option value={day} key={day}>{day}</option>)
              }
            </select>
            
            <select 
              disabled={!finishedAsync} 
              className="form-select uses-font" 
              name="birthMonth" 
              id="updateBirthMonth" 
              defaultValue={user.birthDate.getMonth()} 
            >
              {
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                .map((month, index) => <option value={index} key={month}>{month}</option>)
              }
            </select>
            
            <select 
              disabled={!finishedAsync} 
              className="form-select uses-font" 
              name="birthYear" 
              id="updateBirthYear" 
              defaultValue={user.birthDate.getFullYear()} 
            >
              {
                yearOptions.map((year) => <option value={year} key={year}>{year}</option>)
              }
            </select>            
          </fieldset>
          
          <fieldset className="fieldset-sr-only">
          <legend>Gender</legend>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="female" 
                defaultChecked={user.gender === "female"}
                required
              />&nbsp;Female
            </label>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="male" 
                defaultChecked={user.gender === "male"}
                required  
              />&nbsp;Male
            </label>
            <label>
              <input 
                disabled={!finishedAsync} 
                type="radio" 
                name="gender" 
                value="other" 
                defaultChecked={user.gender === "other"}
                required
              />&nbsp;Other
            </label>
          </fieldset>
          
          <button disabled={!finishedAsync} className="btn btn-primary btn-home uses-font" type="submit">Save</button>
        </form>
      </div>
    );
  }
}

export default UserSettings;