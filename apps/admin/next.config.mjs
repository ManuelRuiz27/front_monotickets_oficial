/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only transpile the packages that need to be compiled from source.  We
  // intentionally omit utils here because it's plain JS and doesn't require
  // transpilation.
  transpilePackages: ['ui', 'api', 'hooks', 'design-tokens'],
};

export default nextConfig;
