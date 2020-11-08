import React, { useState, useEffect} from 'react';
import axios from 'axios';

function CommentList(props) {
  const { postId, renderCount } = props;
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
            <div key={comment._id}>
              {comment.author.firstName}&nbsp;{comment.author.lastName}&nbsp; commented:
              <p>{comment.content}</p>
            </div>
          )
        }
    </div>
  );
}

export default CommentList;