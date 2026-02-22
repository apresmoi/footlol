import React from 'react'

export interface HeaderProps {
  children?: any
}

const Header = (props: HeaderProps) => {
  return <div
    className="header"
  >
    {props.children}
  </div>
}

export default Header