import React from "react"
import Location from "@wkocjan/gatsby-theme-intro/src/components/sidebar/location"
import ProfileImage from "@wkocjan/gatsby-theme-intro/src/components/sidebar/profile-image"
import { arrayOf, shape, ProfileType, SocialType } from "@wkocjan/gatsby-theme-intro/src/types"
import SocialLinks from "@wkocjan/gatsby-theme-intro/src/components/social-links/social-links"

const Sidebar = ({ profile, social }) => (
  <aside className="w-full lg:w-1/3 lg:border-r border-line lg:px-6 xl:px-12">
    <div className="flex flex-col h-full justify-start">
      <div>
        <h2 className="font-header font-light text-front text-2xl leading-none mb-4">
          {profile.profession}
        </h2>
        <h1 className="font-header font-black text-front text-5xl leading-none break-words mb-6">
          {profile.name}
        </h1>
        {profile.image && (
          <ProfileImage image={profile.image} name={profile.name} />
        )}
        <br />
        {profile.location && (
          <Location
            location={profile.location}
            relocation={profile.relocation}
          />
        )}
      </div>

      <div className="pt-8 pb-12 lg:py-8">
        <h5 className="font-header font-semibold text-front text-lg uppercase mb-1">
          Connect
        </h5>
        
        <h5 className="font-header font-semibold text-front text-sm mb-3">
         Email: dwshuo@gmail.com 
        </h5>

        <SocialLinks social={social} />
      </div>
    </div>
  </aside>
)

Sidebar.propTypes = {
  profile: shape(ProfileType),
  social: arrayOf(shape(SocialType)),
}

export default Sidebar
