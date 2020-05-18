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

  const handleRemovePlayer = (id: string) => {
    if (context.self.admin) context.requestKickPlayer(id);
  }

  const handleTeamChange = (side: string) => {
    if (context.self.side !== side) context.requestChangeSide(side)
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="team-select">
          <Team side="LEFT"
            onTeamChange={handleTeamChange}
          >
            {players.LEFT.map(player => <PlayerComponent
              key={player.id}
              player={player}
              ready={player.ready}
              isSelf={player.id === context.self.id}
              selfAdmin={context.self && context.self.admin}
              isAdmin={player.admin}
              onRemove={handleRemovePlayer}
            />)}
          </Team>
          <Chat />
          <Team side="RIGHT"
            onTeamChange={handleTeamChange}
          >
            {players.RIGHT.map(player => <PlayerComponent
              key={player.id}
              ready={player.ready}
              isSelf={player.id === context.self.id}
              player={player}
              selfAdmin={context.self && context.self.admin}
              isAdmin={player.admin}
              onRemove={handleRemovePlayer}
            />)}
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

const Team = ({ side, children, onTeamChange }) => {
  const handleClick = () => {
    if (onTeamChange) onTeamChange(side)
  }
  return <div className={"team " + side.toLowerCase()} >
    <div onClick={handleClick} className="team-title">
      {side} Team
    </div>
    {children}
  </div>
}

const PlayerComponent = ({ player, isSelf, ready, selfAdmin, isAdmin, onRemove }) => {
  const handleRemovePlayer = () => {
    if (onRemove) onRemove(player.id)
  }
  return <div className={`player ${isSelf ? 'self' : ""} ${ready ? 'ready' : ''}`}>
    <div>
      <img src={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/profileicon/25.png`} />
    </div>
    <div>{player.name}</div>
    {selfAdmin && !isAdmin && <div onClick={handleRemovePlayer} className="player-remove" />}
    {isAdmin && <div className="player-admin" />}
  </div >
}

export default TeamSelect;
