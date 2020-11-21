import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import noAvatar from '../../images/no-avatar.png';
import axios from 'axios';

function NavbarOptions(props)
{
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState({});
  const userId = localStorage.getItem('odinbook_id');
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);
  
  const handleToggle = () => {
    setShowOptions(!showOptions);
  }
  
  return (
    <div id="nav-options-container">
      <img id="nav-toggle" src={user.photo || noAvatar} alt="The avatar of the currently logged user." onClick={handleToggle} />
      <div id="nav-options" className={showOptions ? "nav-visible" : ""}>
        <Link className="no-underline" to={"/profile/" + user._id}>
          <div className="nav-options-link">
            <img className="nav-options-img" src={user.photo || noAvatar} alt="The avatar of the currently logged user." />
            {user.firstName}&nbsp;{user.lastName}
          </div>
        </Link>
        
        <hr/>
        
        <Link className="no-underline" to="/settings">
          <div className="nav-options-link">
            <div className="nav-options-icon"><i className="fas fa-cog"></i></div> Settings
          </div>
        </Link>
        
        <Link className="no-underline" to="/logout">
          <div className="nav-options-link">
            <div className="nav-options-icon"><i className="fas fa-door-open"></i></div> Logout
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NavbarOptions;