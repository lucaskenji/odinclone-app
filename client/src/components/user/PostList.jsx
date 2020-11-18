import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

function PostList(props) {
  const { originPath, userId, renderCount } = props;
  const [postList, setPostList] = useState([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [previousRender, setPreviousRender] = useState(0);
  
  useEffect(() => {
    if (searchedUser === userId && previousRender === renderCount) {
      return;
    }
    
    axios.get(process.env.REACT_APP_API_URL + originPath)
      .then((response) => {
        setPostList(response.data);        
        setSearchedUser(userId);
        setPreviousRender(renderCount);
      })
      .catch((err) => {
        console.log(err);
        setPostList([]);
        setSearchedUser(userId);
        setPreviousRender(renderCount);
      })
  }, [searchedUser, originPath, renderCount, previousRender, userId]);

  if (postList.length === 0 && searchedUser === userId) {
    return (
      <div id="post-list-empty">
        <div className="emote">:(</div>
        Nothing to see here... yet.
      </div>
    );
  }
  
  return (
    <div id="post-list">
      { postList.map((post, index) => <Post post={post} key={post._id} />) }
      
      {
        postList.length === 0 
        ||
        <div id="post-list-message">
          <div className="emote">;)</div>
          That's everything for now.
        </div>
      }
    </div>
  );
}

export default PostList;