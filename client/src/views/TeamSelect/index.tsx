import React, { useContext } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import Chat from './Chat';
import { ApplicationContext } from '../../store';

const TeamSelect = () => {
  const context = useContext(ApplicationContext)
  const players = Object.keys(context.players).reduce((result, id) => {
    result[context.players[id].side].push(context.players[id])
    return result
  }, { LEFT: [], RIGHT: [] })
  const handleReadyClick = () => {
    context.requestPlayerReady(!context.self.ready)
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="team-select">
          <Team side="LEFT">
            {players.LEFT.map(player => <PlayerComponent ready={player.ready} isSelf={player.id === context.self.id} key={player.id} player={player} />)}
          </Team>
          <Chat />
          <Team side="RIGHT">
            {players.RIGHT.map(player => <PlayerComponent ready={player.ready} isSelf={player.id === context.self.id} key={player.id} player={player} />)}
          </Team>
        </div>
        {context.self &&
          <div className="team-select-ready">
            <button className={context.self.ready ? "ready" : ""} onClick={handleReadyClick}>READY</button>
          </div>}
      </Container>
    </Wrapper>
  );
}

const Team = ({ side, children }) => {
  return <div className={"team " + side.toLowerCase()} >
    <div className="team-title">
      {side} Team
    </div>
    {children}
  </div>
}

const PlayerComponent = ({ player, isSelf, ready }) => {
  return <div className={`player ${isSelf ? 'self' : ""} ${ready ? 'ready' : ''}`}>
    <div>
      <img src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/profileicon/25.png" />
    </div>
    <div>{player.name}</div>
  </div>
}

export default TeamSelect;
