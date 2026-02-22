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

  const handleRemovePlayer = (id: string) => {
    if (context.self.admin) context.requestKickPlayer(id);
  }

  const handleTransferAdmin = (id: string) => {
    if (context.self.admin) context.requestTransferAdmin(id);
  }

  const handleReturnToLobby = () => {
    context.requestReturnToLobby()
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="cs-glow cs-glow--bl" />
        <div className="cs-glow cs-glow--tr" />
        <div className="champion-select">
          <Team side="LEFT">
            {calculated.LEFT.map(player => <PlayerComponent
              ready={player.ready}
              isSelf={context.self && player.id === context.self.id}
              key={player.id}
              player={player}
              selfAdmin={context.self && context.self.admin}
              isAdmin={player.admin}
              onRemove={handleRemovePlayer}
              onTransferAdmin={handleTransferAdmin}
            />)}
          </Team>
          <div className="pool-column">
            <div className="pool-logo">
              <img src="/icon.png" alt="Footlol" />
            </div>
            <ChampionPool disabledChampions={calculated.disabledChampions} champions={context.champions} onClick={handleChampionSelect} />
          </div>
          <Team side="RIGHT">
            {calculated.RIGHT.map(player => <PlayerComponent
              ready={player.ready}
              isSelf={context.self && player.id === context.self.id}
              key={player.id}
              player={player}
              selfAdmin={context.self && context.self.admin}
              isAdmin={player.admin}
              onRemove={handleRemovePlayer}
              onTransferAdmin={handleTransferAdmin}
            />)}
          </Team>
        </div>
        {context.self &&
          <div className="cs-ready">
            <a className={context.self.ready ? "ready" : ""} onClick={handleReadyClick}>READY</a>
            {context.self.admin && <a className="return-to-lobby" onClick={handleReturnToLobby}>RETURN TO LOBBY</a>}
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

const PlayerComponent = ({ player, isSelf, ready, selfAdmin, isAdmin, onRemove, onTransferAdmin }) => {
  const handleRemovePlayer = () => {
    if (onRemove) onRemove(player.id)
  }
  const handleTransferAdmin = () => {
    if (onTransferAdmin) onTransferAdmin(player.id)
  }
  return <div className={`player ${isSelf ? 'self' : ""} ${ready ? 'ready' : ''}`}>
    <div>
      <img src={player.champion ? `${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${player.champion}.png` : null} />
    </div>
    <div>{player.name}</div>
    {selfAdmin && !isAdmin && !isSelf && <div onClick={handleTransferAdmin} className="player-transfer-admin" data-tooltip="Transfer admin" />}
    {selfAdmin && !isAdmin && <div onClick={handleRemovePlayer} className="player-remove" data-tooltip="Kick player" />}
    {isAdmin && <div className="player-admin" data-tooltip="Room admin" />}
  </div>
}

export default TeamSelect;
