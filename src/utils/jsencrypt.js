import JSEncrypt from "jsencrypt/bin/jsencrypt.min";

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDT+E7gTmiD6wOTPaTl5sK5LJbK\n" +
  "h+ult/9SGeVddk7TvhDH498vTFYosSWdoIvEtCI2jiPN1saT5u2bK6RBY2H5ZxpG\n" +
  "jbUJiC7inv2ilW8OoTTUqCK1mnv397I8rus8oZZzmdzM/rXDog4XAlWGXfWE2qhE\n" +
  "LDEmMuPVA/lJxUsE1QIDAQAB";

const privateKey =
  "MIICxjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIbY4b2eZu3FMCAggA\n" +
  "MBQGCCqGSIb3DQMHBAic76ElGxOmJgSCAoC4EnJ8bRJWb6+o84N0crEBZkgH86eC\n" +
  "KqqvPcO4RVNLA0awuFLnA8UoVCrd1GPPOCeCrP4ReMRECSVPdXRcSlO75Av+p9J+\n" +
  "3D+/lfldpCJ9p+X9Vd1o+20ZLv4Pr/MwqOr0VOMQmDEWJSUzoJuvxvc5bfyMiz/2\n" +
  "qaw4022Hup+akPRbP1O7W+HS7/SBmoLoVZN7a//psObetKllUMylJzpE2iXd3jQg\n" +
  "v0CItRAI7HTsg8n9KWDI/jZCze3/jN8UpRrFeVzUJuOXhV5TG8AvqxIvHU28DdRu\n" +
  "L2riYNYf02IJlIQBjQPxK2kDfLPxLH4Dvj4E/HHdH6NLaVe6yU5x/aQtCBZUevm2\n" +
  "gM9K5iVCZ2stQnkaokPgaOpvlHqfIsBJ42jPNAVkt7W9tSFUeVKe/oqe/L/vSlfc\n" +
  "r8Ku0DyzYUgJfjShEe3kocQ0bpF6jhdXYBkZ7G8jetQYmSj8r8P+t18NqRhnCcL/\n" +
  "UVKJtpCgU9KSu2R8OjZOC43ziEbB28pwTcSTdZT9RHXeRbT2kDR86E00NjKYCzs6\n" +
  "/hVpHHUedz2tbd5PidH+LlexVc4nEVsQyFtyWAH7/UZ/Q76Y261OeJBWnRNAw9Fv\n" +
  "bccgXhwHRQ4TvoeO74tXoUo3voKh1/1l1gWz56DKqpiPmL/zyHhBGoYyRZXc7pu2\n" +
  "nmPoGQn3viMGPZEhEyrBOaK48rDzeHXd3VGinrhLaMj7rFO9TBpdS3n7jrJQ4kJy\n" +
  "1umj2zUJPoUB+/pUrxOqIxd9UswxSkhmTPUaJU8eup1AKJr7/Ym3zDCyiecRf4j4\n" +
  "XM726azZQXS7nHm1ohwg6Y+/reblPEZu1jkWD1+sAaEyf8hD3R8qzdBu";

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
