import React from 'react'

export interface ContainerProps {
  children: any
}

const Container = (props: ContainerProps) => {
  return <div
    className="container"
  >
    {props.children}
  </div>
}

export default Container