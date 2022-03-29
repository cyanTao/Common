function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}


function decodeBase64(base64Str) {
  return Buffer.from(base64Str, 'base64').toString();
}