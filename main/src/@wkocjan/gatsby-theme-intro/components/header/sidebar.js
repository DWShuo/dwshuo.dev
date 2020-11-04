import React from "react";
import { push as Menu } from "react-burger-menu";

export default props => {
   //console.log("documenttt", document.getElementsByClassName("bm-burger-button")[0])
    return (
        // Pass on our props
        <Menu {...props} id="push" right>
            <a aria-current="page" className="bm-item Header__menu__item menuTitle" style={{ display: 'block' }} 
              tabindex="0" href="/">DWS</a>
            <a className="menu-item Header__menu__item" href="/"> Home </a>

            <a className="menu-item Header__menu__item" href="/blog"> Blog </a>

            <a className="menu-item Header__menu__item" href="https://github.com/DWShuo"> Github </a>
        </Menu>
    );
}
