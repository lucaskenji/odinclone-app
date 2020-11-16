import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';

function Comment(props) {
  const { comment } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.comment.likes.length);
  const [finishedAsync, setFinishedAsync] = useState(true);
  
  useEffect(() => {
    const userId = localStorage.getItem('odinbook_id');
    const foundUser = comment.likes.find(user => user.toString() === userId);
    
    foundUser == null ? setIsLiked(false) : setIsLiked(true);
  }, [ comment.likes ]);
  
  const handleLike = async () => {
    setFinishedAsync(false);
    const userId = localStorage.getItem('odinbook_id');
    
    try {
      if (!isLiked) {
        setLikes(likes + 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/like`, { _id: userId });
      } else {
        setLikes(likes - 1);
        await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/${comment.post}/comments/${comment._id}/dislike`, { _id: userId });
      }
    } catch (err) {
      console.log(err);
    }
    
    setIsLiked(!isLiked);
    setFinishedAsync(true);
  }
  
  return (
    <div className="comment">
      <Link className="comment-link" to={"/profile/" + comment.author._id}>
        <img src={comment.author.photo || noAvatar} alt="Commenter's avatar" className="post-avatar" />
      </Link>
      
      <div className="comment-content">
        <Link to={"/profile/" + comment.author._id}>{comment.author.firstName}&nbsp;{comment.author.lastName}</Link>
        <p>{comment.content}</p>
        
        <button className={isLiked ? "btn btn-post uses-font btn-liked" : "btn btn-post uses-font"} disabled={!finishedAsync} onClick={() => handleLike()}>
          <i className="far fa-thumbs-up"></i> Like ({likes})
        </button>
      </div>
    </div>
  );
}

export default Comment;