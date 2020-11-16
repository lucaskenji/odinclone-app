import React, { useEffect } from 'react';
import PostBox from './PostBox';
import PostList from './PostList';
import Homepage from '../signin/Homepage';

function Dashboard(props) {
  const { verifyAuth } = props;
  const userId = localStorage.getItem('odinbook_id');
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Homepage />);
  } else {
    return (
      <div id="dashboard">
        <PostBox/>
        <PostList originPath={"/api/posts/relevant/" + userId} userId={userId} />
      </div>
    );
  }
}

export default Dashboard;