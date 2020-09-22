import { graphql } from "gatsby"
import { string } from "prop-types"

export const WorkHistoryType = {
  company: string.isRequired,
  period: string,
  position: string,
  url: string,
  description: string,
}

export const query = graphql`
  fragment CustomWorkHistoryFragment on WorkHistoryYaml {
    company
    period
    position
    url
    description
  }
`
