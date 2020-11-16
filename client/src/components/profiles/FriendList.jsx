import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';

function FriendList(props) {
  const { verifyAuth } = props;
  const { userId } = useParams();
  const [friends, setFriends] = useState([]);
  const [displayedFriends, setDisplayedFriends] = useState([]);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
      .then((response) => {
        setFriends(response.data.friends);
        setDisplayedFriends(response.data.friends);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [userId]);
  
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
          <h2>Friends</h2>
          <div id="friend-list-search">
            <label htmlFor="friend-list-input" className="sr-only">Search for users on friend list</label>
            <div id="friend-list-icon">
              <i className="fas fa-search"></i>
            </div>
            <input className="uses-font" type="text" id="friend-list-input" placeholder="Search" onInput={handleSearch} />
          </div>
        </div>
        
        <div id="friend-list-border">
        {
          displayedFriends.length === 0 && 'Nothing to see here.'
        }
        
        {
          displayedFriends.map((friend) => 
            <div key={friend._id} className="friend-list-unit">
              <Link className="no-underline" to={"/profile/" + friend._id}>
                <img src={friend.photo || noAvatar} alt="The avatar of one of the user's friends." />
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