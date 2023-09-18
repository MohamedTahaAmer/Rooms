/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['uploadthing.com', 'lh3.googleusercontent.com'],
	},
	experimental: {
		serverActions: true,
		// appDir: true,
	},
};

module.exports = nextConfig;
