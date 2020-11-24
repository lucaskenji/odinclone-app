import React from 'react';
import LoginForm from './LoginForm';
import Logo from '../../images/logo.svg';
import localStrings from '../../localization';

function Homepage(props) {
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  const setLocalization = (localizationCode) => {
    localStorage.setItem('localizationCode', localizationCode);
    window.location.href = "/";
  }
  
  return (
    <div id="asdfgh">
      <div id="home-container">
        <div id="home-aux-container">
          <div id="home-info">
            <img id="home-logo" src={Logo} alt={localStrings[locale]['homepage']['alt']['logo']} />
            <p id="home-description">
              {localStrings[locale]['homepage']['homepageDesc']}
            </p>
          </div>
          <LoginForm/>
        </div>
      </div>
      <footer id="home-footer">
        <div>
          <span className="home-local" onClick={() => setLocalization('en-US')}>English (US)</span>
          <span className="home-local" onClick={() => setLocalization('pt-BR')}>Português (Brasil)</span>
          <hr/>
          <span>{localStrings[locale]['homepage']['credits']}</span>
          <span>
            <a rel="noopener noreferrer" href="https://github.com/lucaskenji" target="_blank">
              {localStrings[locale]['homepage']['githubLink']}
            </a>
          </span>
          <span>
            <a rel="noopener noreferrer" href="https://lucaskenji.github.io" target="_blank">
              {localStrings[locale]['homepage']['portfolioLink']}
            </a>
          </span>
          <span>
            <a rel="noopener noreferrer" href="https://www.theodinproject.com/courses/nodejs/lessons/odin-book" target="_blank">
              {localStrings[locale]['homepage']['odinProjectLink']}
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;