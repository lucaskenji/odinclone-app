import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';

function Post(props) {
  const { post } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.post.likes.length);
  const [finishedAsync, setFinishedAsync] = useState(true);
  
  useEffect(() => {
    const userId = localStorage.getItem('odinbook_id');
    const foundUser = post.likes.find(user => user.toString() === userId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ post.likes ]);
  
  const handleLike = async () => {
    setFinishedAsync(false);
    const userId = localStorage.getItem('odinbook_id');
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/like`, { _id: userId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${post._id}/dislike`, { _id: userId });
      }
    } catch (err) {
      console.log(err);
    }
    
    setIsLiked(!isLiked);
    setFinishedAsync(true);
  }
  
  return (
    <div className="post">
      <div className="post-info">
        <Link to={"/profile/" + post.author._id}>
          <img src={post.author.photo || noAvatar} className="post-avatar" alt="User avatar" />
        </Link>
        <Link to={"/profile/" + post.author._id}>
          {post.author.firstName}&nbsp;{post.author.lastName}
        </Link>
      </div>
      
      <p className="post-content">
      {post.content}
      </p>
      
      { post.photo 
        && 
        <div className="post-image">
          <img src={post.photo} alt={"Content posted by " + post.author.firstName} />
        </div> }
      
      <hr/>
      
      <div className="post-options">
        <button 
          className={isLiked ? "btn btn-post uses-font btn-liked" : "btn btn-post uses-font"} 
          disabled={!finishedAsync} 
          onClick={() => handleLike()}>
          <i className="far fa-thumbs-up"></i> Like ({likes})
        </button>
        
        <Link className="btn btn-post-comments btn-post" to={"/post/" + post._id}>
          <i className="far fa-comment-dots"></i> Comments
        </Link>
      </div>
    </div>
  );
}

export default Post;