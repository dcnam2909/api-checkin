const qrcode = require('qrcode');

exports.genQRCode = async (key, name) => {
	const pngBase64 = await qrcode.toDataURL(key);
	return pngBase64;
};
