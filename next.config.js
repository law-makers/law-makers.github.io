// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const config = {
	basePath: "/blog",
	assetPrefix: "/blog",
	output: "export",
	images: {
		unoptimized: true,
	},
};

module.exports = config;
