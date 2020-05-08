import React from 'react';
import KeyboardWrapper from './KeyboardWrapper'
import Draw from './Draw'
import ActionsWrapper from './ActionsWrapper';
import Camera, { CameraPosition } from './Camera';

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
