import React from 'react';
import KeyboardWrapper from './Wrappers/KeyboardWrapper'
import Draw from './Draw'
import ActionsWrapper from './Wrappers/ActionsWrapper';
import Camera, { CameraPosition } from './Camera/Camera';

const World = () => {
  return (
    <Camera>
      <KeyboardWrapper>
        <ActionsWrapper>
          <CameraPosition>
            <Draw />
          </CameraPosition>
        </ActionsWrapper>
      </KeyboardWrapper>
    </Camera>
  );
}

export default World;
