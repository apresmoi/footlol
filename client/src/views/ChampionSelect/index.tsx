import React, { useContext, useEffect } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import Chat from './Chat';
import { ApplicationContext } from '../../store';
import ChampionPool from './ChampionPool';

const TeamSelect = () => {
  const context = useContext(ApplicationContext)


  useEffect(() => {
    if (!context.champions || context.champions.length === 0) context.updateChampionPool()
  })

  const calculated = Object.keys(context.players).reduce((result, id) => {
    result[context.players[id].side].push(context.players[id])
    result.disabledChampions.push(context.players[id].champion)
    return result
  }, { LEFT: [], RIGHT: [], disabledChampions: [] })

  const handleReadyClick = () => {
    context.requestPlayerReady(!context.self.ready)
  }

  const handleChampionSelect = (champion) => {
    context.requestChampionSelect(champion)
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="champion-select">
          <Team side="LEFT">
            {calculated.LEFT.map(player => <PlayerComponent ready={player.ready} isSelf={context.self && player.id === context.self.id} key={player.id} player={player} />)}
          </Team>
          <ChampionPool disabledChampions={calculated.disabledChampions} champions={context.champions} onClick={handleChampionSelect} />
          <Team side="RIGHT">
            {calculated.RIGHT.map(player => <PlayerComponent ready={player.ready} isSelf={context.self && player.id === context.self.id} key={player.id} player={player} />)}
          </Team>
        </div>
        {context.self &&
          <div className="team-select-ready">
            <a className={context.self.ready ? "ready" : ""} onClick={handleReadyClick}>READY</a>
          </div>}
      </Container>
    </Wrapper>
  );
}

const Team = ({ side, children }) => {
  return <div className={"team " + side.toLowerCase()} >
    <div className="team-title">
      {side === "LEFT" ? "Left" : "Right"} Team
    </div>
    {children}
  </div>
}

const PlayerComponent = ({ player, isSelf, ready }) => {
  return <div className={`player ${isSelf ? 'self' : ""} ${ready ? 'ready' : ''}`}>
    <div>
      <img src={player.champion ? `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${player.champion}.png` : null} />
    </div>
    <div>{player.name}</div>
  </div>
}

export default TeamSelect;
