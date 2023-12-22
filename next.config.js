/** @type {import("next").NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ['uploadthing.com', 'lh3.googleusercontent.com'],
	},
};

module.exports = nextConfig;
