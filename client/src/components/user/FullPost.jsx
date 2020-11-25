import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

function FullPost(props) {
  const { verifyAuth } = props;
  const { loggedUserId } = props.state;
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [renderCount, setRenderCount] = useState(0);
  const [isUnmounted, setIsUnmounted] = useState(false);
  
  useEffect(() => {
    return () => { setIsUnmounted(true) };
  }, [verifyAuth, postId]);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`)
      .then((response) => {
        if (!isUnmounted) {
          setPost(response.data);
        }
      })
      .catch((err) => {
        // Show no post if server doesn't return an answer.
      })
  }, [postId, isUnmounted]);
  
  const triggerRender = () => {
    setRenderCount(renderCount + 1);
  }
  
  if (props.state.loading) {
    return 'Loading auth...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else if (post._id) {
    return (
      <div className="full-post">
        <Post post={post} loggedUserId={loggedUserId}/>
        <CommentForm postId={postId} triggerRender={triggerRender} loggedUserId={loggedUserId} />
        <CommentList postId={postId} renderCount={renderCount} loggedUserId={loggedUserId} />
      </div>
    );
  } else {
    return 'Loading post...'; 
  }
}

export default FullPost;