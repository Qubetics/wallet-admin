import JSEncrypt from "jsencrypt";
const RSAkey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8T9YBBWhdZ8gZBGS7udG
f+VC3h2w4yhVWhL4sI0zHdsAy9AFy8imswZTnCa4hdbKfYe4/S5iPIahI+iQ8NnZ
fMbDsPx+OQ+B25t7KIZNWqiq3jXuUbB3JWr4VUAAorp+8EqIMiPkLzqjvvgJzCkF
JLFD79LUmDoGhV9aaMJaPeDYJzOaHDAY0s9/WRyv4QoUqQCSO8/8vKBdrAYSrfeJ
/YfJnGjugWhI821C5N9hRut7viMfwhM5JYdPamKOczynHHg4HqI/Of6KEItPGJLR
H4bPwfIWg6HmmNP+Mx/elPjg6ndB+6pH517gyEAdFd94lYhU4AuTETpuJNu/O3zq
twIDAQAB
-----END PUBLIC KEY-----`;

// Assuming you're using JSEncrypt for encryption

export const encryption = async (data) => {
  try {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(RSAkey);
    const encStr = encrypt.encrypt(data);
    return encStr;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
