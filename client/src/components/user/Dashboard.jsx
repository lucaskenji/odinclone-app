import React, { useEffect, useState } from 'react';
import PostBox from './PostBox';
import PostList from './PostList';
import Homepage from '../signin/Homepage';

function Dashboard(props) {
  const { verifyAuth } = props;
  const userId = localStorage.getItem('odinbook_id');
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
        <PostBox handleRender={handleRender} />
        <PostList originPath={"/api/posts/relevant/" + userId} userId={userId} renderCount={renderCount} />
      </div>
    );
  }
}

export default Dashboard;