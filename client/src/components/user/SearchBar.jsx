import React from 'react';
import localStrings from '../../localization';

function SearchBar(props) {
  const locale = localStorage.getItem('localizationCode') === 'en-US' ? 'en-US' : 'pt-BR';
  
  const handleSearch = (form) => {
    form.preventDefault();
    
    if (form.target.searchbar.value.length !== 0) {
      window.location.href = '/search/' + form.target.searchbar.value;
    }
  }
  
  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="search-bar" className="sr-only">{localStrings[locale]['search']['searchTip']}</label>
      <input 
        className="uses-font" 
        type="text" 
        id="search-bar" 
        name="searchbar" 
        placeholder={localStrings[locale]['search']['searchTip']} 
      />
    </form>
  );
}

export default SearchBar;