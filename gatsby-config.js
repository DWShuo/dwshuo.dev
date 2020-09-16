module.exports = {
  siteMetadata: {
    description: "Personal site",
    locale: "en",
    title: "DWS",
  },
  plugins: [
    {
      resolve: "@wkocjan/gatsby-theme-intro",
      options: {
        showThemeLogo: false,
        theme: "warm-red",
        basePath: "/",
      },
    },

    {
      resolve: `gatsby-theme-blog`,
      options: {
        basePath: `/blog`,
        contentPath: `blog/posts`,
      },
    },
  ],
}
