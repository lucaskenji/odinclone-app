import React from 'react';
import { Redirect } from 'react-router-dom';

function LocalizeEnglish(props) {
  localStorage.setItem('localizationCode', 'en-US');
  
  return (<Redirect to="/" />);
}

export default LocalizeEnglish;