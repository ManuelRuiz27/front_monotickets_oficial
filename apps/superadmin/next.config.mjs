/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js configuration for the Super Admin application.  We enable
  // React Strict Mode for extra runtime checks and opt into transpiling
  // internal packages so that TypeScript source under packages/ can be
  // imported directly.
  transpilePackages: ['ui', 'api', 'hooks', 'design-tokens', 'utils'],
};

export default nextConfig;
