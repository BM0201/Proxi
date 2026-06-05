/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpila los paquetes compartidos del monorepo.
  transpilePackages: ['@proxi/ui', '@proxi/contracts'],
};

export default nextConfig;
