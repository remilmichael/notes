import CryptoJS from 'crypto-js';

export const ROOT_URL = "http://localhost:8080/api";

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};


export const encrypt = (data, secretKey) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

export const decrypt = (encryptedData, secretKey) => {
    return CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
}
