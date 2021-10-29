const qrcode = require('qrcode');

exports.genQRCode = async (key) => {
	const pngBase64 = await qrcode.toDataURL(key);
	return pngBase64;
};
