import React, { useState, useEffect} from 'react';
import Comment from './Comment';
import axios from 'axios';

function CommentList(props) {
  const { postId, renderCount, loggedUserId } = props;
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [postId, renderCount]);
  
  return (
    <div>
      <h5>{comments.length}&nbsp;comments</h5>
        {
          comments.map((comment) =>
            <Comment comment={comment} key={comment._id} loggedUserId={loggedUserId} />
          )
        }
    </div>
  );
}

export default CommentList;