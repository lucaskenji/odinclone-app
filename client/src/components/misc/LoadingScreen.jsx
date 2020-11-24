import React from 'react';
import localStrings from '../../localization';

function LoadingScreen(props) {
  const { loading } = props.state;
  const isLoadingHomepage = window.location.href === process.env.REACT_APP_MAIN_URL; 
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  return (
    <div className={loading ? "loading-screen" : "loading-screen loading-screen-fade"}>
      <div>
        <i className="fas fa-spinner loading-spinner"></i>
      </div>
        { isLoadingHomepage ? localStrings[locale]['loading']['mainPage'] : localStrings[locale]['loading']['normal'] }
    </div>
  );
}

export default LoadingScreen;