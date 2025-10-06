/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile only the packages that need compilation.  The utils package
  // remains plain JS and doesn’t require transpilation here.
  transpilePackages: ['ui', 'api', 'design-tokens'],
};

export default nextConfig;
