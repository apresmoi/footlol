import React from 'react';
import KeyboardWrapper from './Wrappers/KeyboardWrapper'
import Draw from './Draw'
import ActionsWrapper from './Wrappers/ActionsWrapper';
import Camera, { CameraPosition } from './Camera/Camera';
import Score from './UI/Score';
import { Container, Header, Wrapper } from '../../layout';
import ActionBar from './UI/ActionBar';
import Victory from './UI/Victory';
import Defeat from './UI/Defeat';

const World = () => {
  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <Camera>
          <ActionsWrapper>
            <CameraPosition>
              <Draw />
            </CameraPosition>
            <Score />
            <KeyboardWrapper>
              <ActionBar />
              <Defeat />
              <Victory />
            </KeyboardWrapper>
          </ActionsWrapper>
        </Camera>
      </Container>
    </Wrapper>
  );
}

export default World;
