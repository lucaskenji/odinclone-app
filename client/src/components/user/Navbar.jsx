import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../images/favicon.svg';
import SearchBar from './SearchBar';
import NavbarOptions from './NavbarOptions';

function Navbar(props) {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={Icon} id="nav-icon" alt="The website's logo" />
      </Link>
      <SearchBar/>
      <NavbarOptions/>
    </nav>
  )
}

export default Navbar;