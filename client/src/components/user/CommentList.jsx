import React, { useState, useEffect} from 'react';
import Comment from './Comment';
import axios from 'axios';
import localStrings from '../../localization';

function CommentList(props) {
  const { postId, renderCount, loggedUserId } = props;
  const [comments, setComments] = useState([]);
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        // Don't load comments if server doesn't return an answer.
      })
  }, [postId, renderCount]);
  
  return (
    <div>
      <h5>{comments.length}&nbsp;
        { comments.length === 1 
          ? localStrings[locale]['posts']['singularComments'] 
          : localStrings[locale]['posts']['pluralComments']}
      </h5>
        {
          comments.map((comment) =>
            <Comment comment={comment} key={comment._id} loggedUserId={loggedUserId} />
          )
        }
    </div>
  );
}

export default CommentList;