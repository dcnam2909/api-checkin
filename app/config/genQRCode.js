const qrcode = require('qrcode');
const fs = require('fs');

exports.genQRCode = async (key, name) => {
	const pngBase64 = await qrcode.toDataURL(key);
	fs.writeFileSync(
		`./public/images/${name}.png`,
		pngBase64.replace('data:image/png;base64,', ''),
		'base64',
	);
};
