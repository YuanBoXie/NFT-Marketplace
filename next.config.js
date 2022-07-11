module.exports = {
  // reactStrictMode: true,
  reactStrictMode: false,
  images: {
    loader: 'akamai',
    path: '',
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/create-nft': { page: '/create-nft' },
      '/dashboard': { page: '/dashboard' },
      '/my-nfts': { page: '/my-nfts' },
    }
  }
}
