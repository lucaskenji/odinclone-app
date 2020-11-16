import React from 'react';
import LoginForm from './LoginForm';
import Logo from '../../images/logo.svg';

function Homepage(props) {
  return (
    <div id="home-container">
      <div id="home-aux-container">
        <div id="home-info">
          <img id="home-logo" src={Logo} alt="Logo of the website, named Odinclone" />
          <p id="home-description">
            Odinclone is a Facebook clone made for learning purposes.
          </p>
        </div>
        <LoginForm/>
      </div>
    </div>
  );
}

export default Homepage;