import React, { useState, useEffect } from 'react';
import noAvatar from '../../images/no-avatar.png';
import axios from 'axios';
import localStrings from '../../localization';

function NavbarOptions(props)
{
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState({});
  const { loggedUserId } = props;
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    if (loggedUserId) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/users/${loggedUserId}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => {
          //
        });
    }
  }, [loggedUserId]);
  
  const handleToggle = () => {
    setShowOptions(!showOptions);
  }
  
  return (
    <div id="nav-options-container">
      <img 
        id="nav-toggle" 
        src={user.photo || noAvatar} 
        alt={localStrings[locale]['navbar']['alt']['userAvatar']} 
        onClick={handleToggle} 
      />
      <div id="nav-options" className={showOptions ? "nav-visible" : ""}>
        <a className="no-underline" href={"/profile/" + user._id}>
          <div className="nav-options-link">
            <img 
              className="nav-options-img" 
              src={user.photo || noAvatar} 
              alt={localStrings[locale]['navbar']['alt']['userAvatar']} 
            />
            {user.firstName}&nbsp;{user.lastName}
          </div>
        </a>
        
        <hr/>
        
        <a className="no-underline" href={user.isGuest ? "#" : "/settings"}>
          <div className="nav-options-link nav-options-settings">
            <div className="nav-options-icon"><i className="fas fa-cog"></i></div> 
            <span>
              <span>{localStrings[locale]['navbar']['settings']}</span>
              { user.isGuest ? <span className="nav-options-guest">{localStrings[locale]['navbar']['guest']}</span> : ''}
            </span>
          </div>
        </a>
        
        <a className="no-underline" href="/logout">
          <div className="nav-options-link">
            <div className="nav-options-icon"><i className="fas fa-door-open"></i></div> {localStrings[locale]['navbar']['logout']}
          </div>
        </a>
      </div>
    </div>
  );
}

export default NavbarOptions;