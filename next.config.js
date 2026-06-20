/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg', 'sharp', 'onnxruntime-node'],
  },
};

module.exports = nextConfig;
