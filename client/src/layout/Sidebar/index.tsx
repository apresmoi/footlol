import React from 'react'

export interface SidebarProps {
  children: any
}

const Sidebar = (props: SidebarProps) => {
  return <div
    className="sidebar"
  >
    {props.children}
  </div>
}

export default Sidebar