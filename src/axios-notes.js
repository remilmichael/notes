import axios from 'axios';

export const ROOT_URL = 'http://localhost:8080/api';

const instance = axios.create({
    baseURL: ROOT_URL,
});


export default instance;