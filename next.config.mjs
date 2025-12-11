/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh", // <--- ADICIONE ESTA LINHA (O ** aceita qualquer subdomínio)
      },
    ],
  },
}
export default nextConfig
