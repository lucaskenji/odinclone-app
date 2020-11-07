import React, { useState } from 'react';
import axios from 'axios';

function Post(props) {
  const { post } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes);
  
  const handleLike = async () => {
    if (!isLiked) {
      setLikes(likes + 1);
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`);
    } else {
      setLikes(likes - 1);
      await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/dislike`);
    }
    
    setIsLiked(!isLiked);
  }
  
  return (
    <fieldset>
      {post.content}
      <br/>
      by {post.author.firstName}&nbsp;{post.author.lastName}
      <br/><hr/>
      <button onClick={() => handleLike()}>Like</button>
      {likes}
    </fieldset>
  );
}

export default Post;