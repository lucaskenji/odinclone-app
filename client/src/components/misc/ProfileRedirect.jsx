import React from 'react';
import { useParams, Redirect } from 'react-router-dom';

function ProfileRedirect(props) {
  const { profileId } = useParams();
  return (<Redirect to={"/profile/" + profileId} />)
};

export default ProfileRedirect;