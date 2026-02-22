import React from 'react';
import KeyboardWrapper from './Wrappers/KeyboardWrapper'
import Draw from './Draw'
import Camera, { CameraPosition } from './Camera/Camera';
import Score from './UI/Score';
import { Container, Header, Wrapper } from '../../layout';
import ActionBar from './UI/ActionBar';
import MatchResult from './UI/MatchResult';
import GameChat from './Chat';
import Scoreboard from './UI/Scoreboard';

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
            <Scoreboard />
            <MatchResult />
          </KeyboardWrapper>
        </Camera>
      </Container>
    </Wrapper>
  );
}

export default World;
