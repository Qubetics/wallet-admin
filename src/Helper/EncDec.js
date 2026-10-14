import CryptoJS from "crypto-js";


export const encryptData = (data) => {
  let enc = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_DATA_ENCRYPTION_KEY
  ).toString();
  return enc;
};

export const encrypt = (data) => {
  let enc = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.REACT_APP_DATA_ENCRYPTION_KEY
  ).toString();

  let data2 = {
    datastring: enc,
  };
  return data2;
};

export const decrypt = (data) => {
  let dec = CryptoJS.AES.decrypt(
    data,
    process.env.REACT_APP_DATA_ENCRYPTION_KEY
  );
  let decryptedData = JSON.parse(dec.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

export const generateRandomNumber = () => {
  // Generate a random number using CryptoJS
  const randomNumber = CryptoJS.lib.WordArray.random(20).toString(
    CryptoJS.enc.Hex
  );
  return randomNumber;
};


