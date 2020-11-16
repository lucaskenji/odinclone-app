import React from 'react';

function SearchBar(props) {
  const handleSearch = (form) => {
    form.preventDefault();
    
    if (form.target.searchbar.value.length !== 0) {
      window.location.href = '/search/' + form.target.searchbar.value;
    }
  }
  
  return (
    <form onSubmit={handleSearch}>
      <label htmlFor="search-bar" className="sr-only">Search for users</label>
      <input className="uses-font" type="text" id="search-bar" name="searchbar" placeholder="Search for users" />
    </form>
  );
}

export default SearchBar;