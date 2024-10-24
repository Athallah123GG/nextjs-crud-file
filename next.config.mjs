/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "fn8uvpzjmyjw0ssr.public.blob.vercel-storage.com"
            },
        ],
    },
};


export default nextConfig;
