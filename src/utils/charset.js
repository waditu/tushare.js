/* eslint-disable global-require */
/* eslint-disable import/newline-after-import */
export const charset = enc => res => {
  // if under nodejs environment
  if (typeof module !== undefined && module.exports) {
    const iconv = require('iconv-lite');
    return res.buffer().then(buffer => iconv.decode(buffer, enc));
  }
  return res.blob().then(blob => {
    const reader = new FileReader();
    reader.readAsText(blob, enc);
    return new Promise(
      resolve => {
        reader.onloadend(() => resolve(reader.result));
      }
    );
  });
};
