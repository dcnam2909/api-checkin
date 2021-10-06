const crypto = require('crypto-js');
const qrcode = require('qrcode');
const fs = require('fs');
let jsonA = { firstName: 'John', lastName: 'Doe', expire: '10p' };
jsonA = JSON.stringify(jsonA);
let cryptA = crypto.Rabbit.encrypt(jsonA, 'abcxyz').toString();
console.log(cryptA);
let decryptA = crypto.Rabbit.decrypt(cryptA, 'abcxyz').toString(crypto.enc.Utf8);
console.log(decryptA);

console.time('test');
let base64image = qrcode
	.toDataURL(cryptA)
	.then((url) => url.replace(/^data:image\/png;base64,/, ''))
	.then((base) => {
		fs.writeFile(`../../public/images/test.png`, base, 'base64', function (err) {
			console.log(err);
		});
	});
console.timeEnd('test');
