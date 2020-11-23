import React from 'react';
import Icon from '../../images/favicon.svg';
import SearchBar from './SearchBar';
import NavbarOptions from './NavbarOptions';
import localStrings from '../../localization';

function Navbar(props) {
  const url = window.location.href;
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';

  return (
    <nav className="navbar">
      <a href="/">
        <img src={Icon} id="nav-icon" alt={localStrings[locale]['navbar']['alt']['logo']} />
      </a>
      <SearchBar/>
      <a id="nav-requests-link" 
            className={/requests/.test(url) ? 'no-underline nav-requests-select' : 'no-underline'} 
            href="/requests">
        <div id="nav-requests">
          <i className="fas fa-user-friends"></i>
        </div>
      </a>
      <NavbarOptions loggedUserId={props.loggedUserId}/>
    </nav>
  )
}

export default Navbar;