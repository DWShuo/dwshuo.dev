import { graphql } from "gatsby"
import React from "react"
import CustomFonts from "@wkocjan/gatsby-theme-intro/src/components/custom-fonts/custom-fonts"
import Footer from "@wkocjan/gatsby-theme-intro/src/components/footer/footer"
import Header from "@wkocjan/gatsby-theme-intro/src/components/header/header"
import MainContent from "@wkocjan/gatsby-theme-intro/src/components/main-content/main-content"
import SEO from "@wkocjan/gatsby-theme-intro/src/components/seo/seo"
import Sidebar from "@wkocjan/gatsby-theme-intro/src/components/sidebar/sidebar"
import StructuredData from "@wkocjan/gatsby-theme-intro/src/components/structured-data/structured-data"
import "@wkocjan/gatsby-theme-intro/src/styles/style.css"

const IndexPage = ({ data }) => {
  const { history, profile, projects, site, social } = data

  return (
    <div className="antialiased bg-back leading-normal font-text text-front">
      <SEO />
      <StructuredData profile={profile} social={social.nodes} />
      <CustomFonts />

      <Header initials={profile.initials} />

      <div className="md:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 flex flex-wrap pt-4 my-8">
        <Sidebar profile={profile} social={social.nodes} />

        <MainContent
          history={history.nodes}
          profile={profile}
          projects={projects.nodes}
        />
      </div>

      <Footer
        name={profile.name}
        showThemeLogo={site.siteMetadata.showThemeLogo}
      />
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        showThemeLogo
      }
    }
    profile: profileYaml {
      ...ProfileFragment
    }
    social: allSocialYaml(filter: { url: { ne: null } }) {
      nodes {
        ...SocialFragment
      }
    }
    history: allWorkHistoryYaml {
      nodes {
        ...CustomWorkHistoryFragment
      }
    }
    projects: allProjectsYaml {
      nodes {
        ...CustomProjectFragment
      }
    }
  }
`
