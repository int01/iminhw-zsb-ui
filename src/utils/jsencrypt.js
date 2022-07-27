import JSEncrypt from "jsencrypt/bin/jsencrypt.min";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
    "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJvU8sAWn096XtXD1Z3VVvNjsuv8V8Hh\n" +
    "mPa7WZ0d1/yH5jCqRzrD7xMf7WjB4vfKHJvF11tRCwRoLSeYuekPucsCAwEAAQ==";

const privateKey =
    "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAm9TywBafT3pe1cPV\n" +
    "ndVW82Oy6/xXweGY9rtZnR3X/IfmMKpHOsPvEx/taMHi98ocm8XXW1ELBGgtJ5i5\n" +
    "6Q+5ywIDAQABAkAcrj7Xd9JucFlQArEoUYGlXi4qHNGSD5F1p9nAfyOniJobak97\n" +
    "Jn8b4WCUDg+iA+/1pU4Ap/AulDmOZiwkNZtxAiEAzPK25C7vxP59VjhJw2DaT3r3\n" +
    "RWRG42qHFx5kCmTDmy0CIQDCpiZumnPNqiq1otntwTkxe4hTx8wJUzz7UsXYFp5j\n" +
    "1wIget8NDTKip00X4agveQZI/BuxwZWD9nX4dcDPo3eT2iUCIByZRtpHTS5xixbm\n" +
    "13gsRJf1m4EbwOm51iLi9XibUig/AiEAsw5A9Z/8l7iMlYxDH++V8KAk4/L6qlN2\n" +
    "8QXkEHYqcJY=";

// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey); // 设置公钥
    return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPrivateKey(privateKey); // 设置私钥
    return encryptor.decrypt(txt); // 对数据进行解密
}
