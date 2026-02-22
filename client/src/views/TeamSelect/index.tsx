import React, { useContext } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import Chat from './Chat';
import { ApplicationContext } from '../../store';
import { RoomConfig } from '../../store/types';

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

  const handleTransferAdmin = (id: string) => {
    if (context.self.admin) context.requestTransferAdmin(id);
  }

  const handleTeamChange = (side: string) => {
    if (context.self.side !== side) context.requestChangeSide(side)
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="ts-glow ts-glow--bl" />
        <div className="ts-glow ts-glow--tr" />
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
              onTransferAdmin={handleTransferAdmin}
            />)}
          </Team>
          <div className="chat-column">
            <div className="chat-logo">
              <img src="/icon.png" alt="Footlol" />
            </div>
            <Chat />
          </div>
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
              onTransferAdmin={handleTransferAdmin}
            />)}
          </Team>
        </div>
        {context.self && <>
          <RoomConfigPanel
            config={context.config}
            isAdmin={context.self.admin}
            onConfigChange={context.requestConfigChange}
          />
          <div className="team-select-ready">
            <a className={context.self.ready ? "ready" : ""} onClick={handleReadyClick}>READY</a>
          </div>
        </>}
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
      <img src={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/profileicon/25.png`} />
    </div>
    <div>{player.name}</div>
    {selfAdmin && !isAdmin && !isSelf && <div onClick={handleTransferAdmin} className="player-transfer-admin" data-tooltip="Transfer admin" />}
    {selfAdmin && !isAdmin && <div onClick={handleRemovePlayer} className="player-remove" data-tooltip="Kick player" />}
    {isAdmin && <div className="player-admin" data-tooltip="Room admin" />}
  </div >
}

const DURATION_OPTIONS = [
  { label: '3 min', value: 180 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
  { label: '15 min', value: 900 },
]

const TEAM_SIZE_OPTIONS = [
  { label: '1v1', value: 1 },
  { label: '2v2', value: 2 },
  { label: '3v3', value: 3 },
  { label: '4v4', value: 4 },
  { label: '5v5', value: 5 },
]

const RoomConfigPanel = ({ config, isAdmin, onConfigChange }: {
  config?: RoomConfig
  isAdmin: boolean
  onConfigChange: (config: Partial<RoomConfig>) => void
}) => {
  if (!config) return null

  return (
    <div className="room-config">
      <div className="config-row">
        <span className="config-label">Duration</span>
        <div className="config-options">
          {DURATION_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`config-btn ${config.matchDurationSeconds === opt.value ? 'active' : ''} ${isAdmin ? 'admin' : ''}`}
              onClick={() => isAdmin && onConfigChange({ matchDurationSeconds: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="config-row">
        <span className="config-label">Team Size</span>
        <div className="config-options">
          {TEAM_SIZE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`config-btn ${config.maxPlayersPerTeam === opt.value ? 'active' : ''} ${isAdmin ? 'admin' : ''}`}
              onClick={() => isAdmin && onConfigChange({ maxPlayersPerTeam: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TeamSelect;
