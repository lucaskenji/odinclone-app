import React from 'react';
import LoginForm from './LoginForm';
import Logo from '../../images/logo.svg';

function Homepage(props) {
  return (
    <div>
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
      <footer id="home-footer">
        <div>
          <span>English (US)</span>
          <span>Português (Brasil)</span>
          <hr/>
          <span>App made by Lucas Kenji</span>
          <span>
            <a rel="noopener noreferrer" href="https://github.com/lucaskenji" target="_blank">My Github</a>
          </span>
          <span>
            <a rel="noopener noreferrer" href="https://lucaskenji.github.io" target="_blank">My portfolio</a>
          </span>
          <span>
            <a rel="noopener noreferrer" href="https://www.theodinproject.com/courses/nodejs/lessons/odin-book" target="_blank">
              The Odin Project prompt
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;