import React from 'react';
import KeyboardWrapper from './Wrappers/KeyboardWrapper'
import Draw from './Draw'
import Camera, { CameraPosition } from './Camera/Camera';
import Score from './UI/Score';
import { Container, Header, Wrapper } from '../../layout';
import ActionBar from './UI/ActionBar';
import Victory from './UI/Victory';
import Defeat from './UI/Defeat';
import GameChat from './Chat';

const World = () => {
  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <Camera>
          <CameraPosition>
            <Draw />
          </CameraPosition>
          <Score />
          <KeyboardWrapper>
            <GameChat />
            <ActionBar />
            <Defeat />
            <Victory />
          </KeyboardWrapper>
        </Camera>
      </Container>
    </Wrapper>
  );
}

export default World;
