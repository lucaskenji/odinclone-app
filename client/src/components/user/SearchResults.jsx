import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';
import noAvatar from '../../images/no-avatar.png';

function SearchResults(props) {
  const { verifyAuth } = props;
  const { query } = useParams();
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/search/${query}`)
      .then((response) => {
        setResults(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [query]);
  
  if (props.state.loading) {
    return 'Loading...';
  } else if (!props.state.isLogged) {
    return (<Redirect to="/" />);
  } else {
    return (
      <div id="search-results">
        <h1>Showing results</h1>
        { results.map((result, index) => 
            <div key={result._id}>
              <div className="search-result">
                <a href={'/profile/' + result._id}>
                  <img src={result.photo || noAvatar} className="result-avatar" alt="An avatar of an user from the search results." />
                </a>
                <div className="result-info">
                  <a href={'/profile/' + result._id}>{result.firstName} {result.lastName}</a>
                </div>
              </div>
              
              { index+1 === results.length || <hr/>}
            </div>)
        }
      </div>
    );
  }
}

export default SearchResults;