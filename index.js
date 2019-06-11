const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folderPath = process.argv[2];
console.log(process.argv);

if (!folderPath) throw new Error("Folder path required ");

const size = process.argv[3] || 800;
if (!process.argv[4]) console.log("Useing default size ", size);

console.log("----------Optimizing Start----------");
const optimize = (err, images) => {
	if (err) {
		console.log("Error reading the folder", err);
		return;
	}
	images.map(img => {
		try {
			const imagePath = path.join(folderPath, img);
			var stats = fs.statSync(imagePath);
			const imgSize = parseInt(stats.size / 1000, 10);
			if (imgSize > 60) {
				sharp(imagePath)
					.resize(size, size, {
						fit: "inside"
					})
					.toBuffer()
					.then(buffer => {
						fs.writeFile(imagePath, buffer, err => {
							if (!err) console.log(`${img} => done`);
							else {
								console.log(
									"Error on saving new image",
									err
								);
							}
						});
					})
					.catch(err => {
						console.log(`Error on optimize ${img}`, err);
					});
			}
		} catch (opmzErr) {
			console.log("Error on optimize", opmzErr);
		}
	});
};

fs.readdir(folderPath, optimize);
