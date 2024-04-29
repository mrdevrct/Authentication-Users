/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/signin",
        destination: "/signin/email-login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
