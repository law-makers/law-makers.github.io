// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const config = {
	basePath: "/blog"
	typescript: {
		ignoreBuildErrors: true,
	},
	output: "export",
};

module.exports = config;
