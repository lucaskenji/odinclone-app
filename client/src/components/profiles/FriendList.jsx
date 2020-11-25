import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';
import localStrings from '../../localization';

function FriendList(props) {
  const { verifyAuth } = props;
  const { userId } = useParams();
  const [friends, setFriends] = useState([]);
  const [displayedFriends, setDisplayedFriends] = useState([]);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    return () => {setIsUnmounted(true)};
  }, [verifyAuth, userId])
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((response) => {
        if (!isUnmounted) {
          setFriends(response.data.friends);
          setDisplayedFriends(response.data.friends);
        }
      })
      .catch((err) => {
        // Routes are tested and a connection error would redirect the user
      })
  }, [userId, isUnmounted]);
  
  const handleSearch = (ev) => {
    const query = new RegExp(ev.target.value, 'i');
    const results = [...friends].filter((f) => query.test(f.firstName) || query.test(f.lastName));
    
    setDisplayedFriends(results);
  }
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else {
    return (
      <div id="friend-list">
      
        <div id="friend-list-header">
          <h2>{localStrings[locale]['friendList']['header']}</h2>
          <div id="friend-list-search">
            <label htmlFor="friend-list-input" className="sr-only">
              {localStrings[locale]['friendList']['searchTipAlt']}
            </label>
            <div id="friend-list-icon">
              <i className="fas fa-search"></i>
            </div>
            <input 
              className="uses-font" 
              type="text" 
              id="friend-list-input" 
              placeholder={localStrings[locale]['friendList']['searchTip']} 
              onInput={handleSearch} 
            />
          </div>
        </div>
        
        <div id="friend-list-border">
        {
          displayedFriends.length === 0 && localStrings[locale]['friendList']['noFriends']
        }
        
        {
          displayedFriends.map((friend) => 
            <div key={friend._id} className="friend-list-unit">
              <Link className="no-underline" to={"/profile/" + friend._id}>
                <img src={friend.photo || noAvatar} alt={localStrings[locale]['friendList']['alt']['avatar']} />
              </Link>
              <Link className="no-underline" to={"/profile/" + friend._id}>
                {friend.firstName} {friend.lastName}
              </Link>
            </div>)
        }
        </div>
      </div>
    );
  }
}

export default FriendList;