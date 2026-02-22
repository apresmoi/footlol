import React, { useContext } from 'react'
import { isTouchDevice } from '../../../utils/isTouchDevice'
import { ApplicationContext } from '../../../store'
import Joystick from './Joystick'
import ActionButtons from './ActionButtons'
import './styles.scss'

const MobileControls = () => {
  const { requestDirectionChange, requestKeyPress, self, champions } = useContext(ApplicationContext)

  if (!isTouchDevice) return null

  return (
    <div className="mobile-controls">
      <Joystick onDirectionChange={requestDirectionChange} />
      <ActionButtons onKeyPress={requestKeyPress} self={self} champions={champions} />
    </div>
  )
}

export default MobileControls
