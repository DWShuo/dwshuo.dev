import React from "react"
import {
  FaBehance,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaGoodreadsG,
  FaInstagram,
  FaLinkedinIn,
  FaProductHunt,
  FaTwitter,
  FaXing,
  FaBlog,
} from "react-icons/fa"
import { SocialType } from "../../types/social"

const SocialIcon = ({ name, ...params }) => {
  const icons = {
    behance: FaBehance,
    dribbble: FaDribbble,
    facebook: FaFacebook,
    github: FaGithub,
    goodreads: FaGoodreadsG,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    producthunt: FaProductHunt,
    twitter: FaTwitter,
    xing: FaXing,
    blog: FaBlog,
  }

  const Icon = icons[name]

  return Icon ? <Icon {...params} /> : null
}

SocialIcon.propTypes = {
  name: SocialType.name,
}

export default SocialIcon
