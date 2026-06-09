import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sjlojbdoihgappqtmads.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zwvpxyngfqmvzvridlwm.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
