import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostList(props) {
  const [postList, setPostList] = useState([]);
  
  useEffect(() => {
    console.log('Use Effect has ran.');
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts`)
      .then((response) => {
        setPostList(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [postList]);
  
  return (
    <div>
      {
        postList.map((post) => 
          <fieldset key={post._id}>
            {post.content}
            <br/>
            by {post.author.firstName}&nbsp;{post.author.lastName}
          </fieldset>) 
      }
    </div>
  );
}

export default PostList;