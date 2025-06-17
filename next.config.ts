import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'example.com',       // Exemplo fornecido no JSON
      'localhost',         // Para desenvolvimento local
      'res.cloudinary.com', // Para Cloudinary
      'images.unsplash.com', // Para Unsplash
      'i.imgur.com',       // Para Imgur
      'raw.githubusercontent.com', // GitHub
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
