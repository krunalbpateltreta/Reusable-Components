import * as React from 'react';

type Props = {}

export const Header = (props: Props) => {
  return (
    <nav className="nav fixedTop">
      <div className="navHeader">
        <div className="navBrand">
          <div className="brandLogo">
            <span className="m-l-10">Best Practice Solution</span>
          </div>
        </div>
      </div>
      <div className="nav-btn">
        <label htmlFor="nav-check">
          <span />
          <span />
          <span />
        </label>
      </div>
      <div className="navbarCollapse">
        <ul className="navList">
          <li><a href="#">Home</a></li>
          <li><a href="#/screen1">Screen 1</a></li>
          <li><a href="#/screen2">Screen 2</a></li>
        </ul >
      </div>
    </nav >

  );
}

