import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'example.com',      
      'localhost',         
      'res.cloudinary.com', 
      'images.unsplash.com', 
      'i.imgur.com',       
      'raw.githubusercontent.com',
      'google.com',        // Adicionando google.com
      'GOOGLE.COM',        // Adicionando versão em maiúsculas
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,     // Permite imagens não otimizadas de qualquer origem
  },
};

export default nextConfig;
