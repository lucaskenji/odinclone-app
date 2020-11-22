import React, { useEffect, useState } from 'react';
import PostBoxContainer from './PostBoxContainer';
import PostList from './PostList';
import Homepage from '../signin/Homepage';

function Dashboard(props) {
  const { verifyAuth } = props;
  const { loggedUserId } = props.state;
  const [renderCount, setRenderCount] = useState(0);
  
  useEffect(() => {
    verifyAuth();
  }, [ verifyAuth ]);
  
  const handleRender = () => {
    setRenderCount(renderCount + 1);
  }
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Homepage />);
  } else {
    return (
      <div id="dashboard">
        <PostBoxContainer handleRender={handleRender} loggedUserId={loggedUserId} />
        <PostList originPath={"/api/posts/relevant/" + loggedUserId} loggedUserId={loggedUserId} renderCount={renderCount} />
      </div>
    );
  }
}

export default Dashboard;