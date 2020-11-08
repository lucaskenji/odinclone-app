import React, { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import axios from 'axios';

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
      <div>
        { results.map((result) => 
            <fieldset key={result._id}>
              <Link to={'/profile/' + result._id}>{result.firstName} {result.lastName}</Link>
            </fieldset>)
        }
      </div>
    );
  }
}

export default SearchResults;