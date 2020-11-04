import React from "react"
import "./styles.css";
import SideBar from "./sidebar";

const Header = () => {

  return (
    <div id="page-wrap">
      <SideBar outerContainerId={"___gatsby"} />
      <header className="flex justify-between pl-4 lg:pl-8">
        <span className="inline-flex w-14 h-14 mt-8 font-header font-bold text-xl justify-center items-center text-center text-front border-2 border-solid border-front rounded-full">
         DWS
        </span>
      </header>
    </div>
  )
}

export default Header
