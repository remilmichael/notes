import axios from 'axios';
import { ROOT_URL } from './utility';

const instance = axios.create({
    baseURL: ROOT_URL,
});


export default instance;