module.exports = {
  siteMetadata: {
    title: 'Patrick Miller',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    'gatsby-plugin-typescript',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
        ],
      },
    },
    // {
    //   resolve: 'gatsby-plugin-seo',
    //   options: {
    //     siteName: 'Patrick Miller',
    //     defaultSiteImage: 'src/data/img/patrick-arashiyama.jpg',
    //     siteUrl: 'https://pmil.me/',
    //   },
    // },
  ],
};
