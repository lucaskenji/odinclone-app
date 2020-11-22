import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

function FullPost(props) {
  const { verifyAuth } = props;
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
        console.log(err);
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
        <Post post={post} />
        <CommentForm postId={postId} triggerRender={triggerRender} />
        <CommentList postId={postId} renderCount={renderCount} />
      </div>
    );
  } else {
    return 'Loading post...'; 
  }
}

export default FullPost;