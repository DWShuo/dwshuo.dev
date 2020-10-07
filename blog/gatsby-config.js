module.exports = {
  pathPrefix: `/blog`,
  plugins: [
    {
      resolve: `gatsby-theme-blog`,
      options: {},
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `[errorcodes@DWS ~]$`,
    author: `David S. Wang`,
    description: `Personal blog for projects and thing of intrest`,
    social: [
      {
        name: `Linkedin`,
        url: `https://github.com/dwshuo`,
      },
      {
        name: `Github`,
        url: `https://github.com/dwshuo`,
      },
    ],
  },
}
