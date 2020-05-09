import React from 'react'

export interface WrapperProps {
  children: any
}

const Wrapper = (props: WrapperProps) => {
  return <div
    className="wrapper"
  >
    {props.children}
  </div>
}

export default Wrapper