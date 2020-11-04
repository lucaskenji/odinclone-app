import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostList(props) {
  const [postList, setPostList] = useState([]);
  const [didSearch, setDidSearch] = useState(false);
  
  useEffect(() => {
    if (didSearch) {
      return;
    }
    
    const userId = localStorage.getItem('odinbook_id');
    
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/relevant/${userId}`)
      .then((response) => {
        setPostList(response.data);
        setDidSearch(true);
      })
      .catch((err) => {
        console.log(err);
        setDidSearch(true);
      })
  }, [didSearch]);
  
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