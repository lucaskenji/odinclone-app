import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/favicon.svg';
import SearchBar from './SearchBar';
import NavbarOptions from './NavbarOptions';

function Navbar(props) {
  const url = window.location.href;

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={Icon} id="nav-icon" alt="The website's logo" />
      </Link>
      <SearchBar/>
      <Link id="nav-requests-link" 
            className={/requests/.test(url) ? 'no-underline nav-requests-select' : 'no-underline'} 
            to="/requests">
        <div id="nav-requests">
          <i className="fas fa-user-friends"></i>
        </div>
      </Link>
      <NavbarOptions loggedUserId={props.loggedUserId}/>
    </nav>
  )
}

export default Navbar;