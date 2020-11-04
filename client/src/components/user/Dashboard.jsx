import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PostBox from './PostBox';
import PostList from './PostList';

function Dashboard(props) {
  const { verifyAuth } = props;
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else {
    return (
      <div>
        <PostBox/>
        <PostList/>
      </div>
    );
  }
}

export default Dashboard;