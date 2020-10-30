import axios from 'axios';

const isLogged = () => {
  axios.get('http://localhost:3030/api/islogged')
    .then((response) => {
      return Boolean(response.data.isLogged);
    })
    .catch((err) => {
      console.log(err);
      return false;
    })
}


export default isLogged;