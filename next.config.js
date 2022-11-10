/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
		concurrentFeatures: true,
		serverComponents: true,
	},
	reactStrictMode: true,
	swcMinify: true,
};

module.exports = nextConfig;
