import * as CryptoJS from 'crypto-js';

const secret = process.env.RESET_SECRET;

export const generateResetHash = (userId: string) => {
  const timestamp = Date.now();
  const hash = CryptoJS.HmacSHA256(`${userId}-${timestamp}`, secret).toString();
  return { hash, timestamp };
};

export const verifyResetHash = (userId: string, timestamp: string, hash: string) => {
  const currentTimestamp = Date.now();
  const validDuration = 3600000;

  if (currentTimestamp - parseInt(timestamp) > validDuration) {
    return false;
  }

  const expectedHash = CryptoJS.HmacSHA256(`${userId}-${timestamp}`, secret).toString();
  return hash === expectedHash;
};