import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import localStrings from '../../localization';

function PostList(props) {
  const { originPath, loggedUserId, renderCount } = props;
  const [postList, setPostList] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [previousRender, setPreviousRender] = useState(0);
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {    
    if (searchedUser === loggedUserId && previousRender === renderCount) {
      return;
    }
    
    axios.get(process.env.REACT_APP_API_URL + originPath)
      .then((response) => {
        setPostList(response.data);
        setSearchedUser(loggedUserId);
        setPreviousRender(renderCount);
      })
      .catch((err) => {
        setPostList([]);
        setSearchedUser(loggedUserId);
        setPreviousRender(renderCount);
      })
  }, [searchedUser, originPath, renderCount, previousRender, loggedUserId]);

  if (postList.length === 0 && searchedUser === loggedUserId) {
    return (
      <div id="post-list-empty">
        <div className="emote">:(</div>
        {localStrings[locale]['posts']['noPosts']}
      </div>
    );
  }
  
  return (
    <div id="post-list">
      { postList.map((post, index) => <Post loggedUserId={loggedUserId} post={post} key={post._id} />) }
      
      {
        postList.length === 0 
        ||
        <div id="post-list-message">
          <div className="emote">;)</div>
          {localStrings[locale]['posts']['enoughPosts']}
        </div>
      }
    </div>
  );
}

export default PostList;