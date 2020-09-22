import { graphql } from "gatsby"
import { arrayOf, shape, string, object, oneOf } from "prop-types"

export const ProjectType = {
  description: string,
  icon: oneOf(["github", "website"]),
  image: shape({
    childImageSharp: object.isRequired,
  }),
  name: string.isRequired,
  status: string,
  tags: arrayOf(string),
  url: string,
  iconURL: string,
}

export const query = graphql`
  fragment CustomProjectFragment on ProjectsYaml {
    description
    icon
    image {
      childImageSharp {
        fluid(maxWidth: 640, quality: 85) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
    name
    status
    tags
    url
    iconURL
  }
`
