/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: {
        bodySizeLimit: '6mb', // Set this to at least 6MB
      },
    },
  };
  
  export default nextConfig;
  