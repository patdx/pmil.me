module.exports = {
  images: {
    domains: ['pmil.me'],
  },

  headers: async () => {
    return [
      {
        source: '/assets/images/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};
