import React, { useContext, useEffect, useState } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Room, RoomStage } from '../../store/types';

const STAGE_LABELS: Record<string, string> = {
  TEAM_SELECT: 'Lobby',
  CHAMPION_SELECT: 'Champ Select',
  FIELD: 'In Game',
  END: 'Finished',
}

const formatTime = (totalSeconds: number): string => {
  const mins = Math.floor(Math.max(0, totalSeconds) / 60)
  const secs = Math.max(0, totalSeconds) % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const useCountdown = (endsAt: number | null | undefined): number | null => {
  const [remaining, setRemaining] = useState<number | null>(() =>
    endsAt ? Math.round((endsAt - Date.now()) / 1000) : null
  )
  useEffect(() => {
    if (!endsAt) { setRemaining(null); return }
    setRemaining(Math.round((endsAt - Date.now()) / 1000))
    const interval = setInterval(() => {
      setRemaining(Math.round((endsAt - Date.now()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [endsAt])
  return remaining
}

const RoomStatus = ({ room }: { room: Room }) => {
  const stage = room.stage || 'TEAM_SELECT'
  const label = STAGE_LABELS[stage] || stage
  const remaining = useCountdown(stage === 'FIELD' ? room.endsAt : null)

  if (stage === 'FIELD' && remaining != null) {
    return <span className={`room-stage stage-${stage.toLowerCase()}`}>
      {label} &middot; {formatTime(remaining)}
    </span>
  }

  if (stage === 'TEAM_SELECT' && room.config?.matchDurationSeconds) {
    return <span className={`room-stage stage-${stage.toLowerCase()}`}>
      {label} &middot; {room.config.matchDurationSeconds / 60} min
    </span>
  }

  return <span className={`room-stage stage-${stage.toLowerCase()}`}>{label}</span>
}

const Rooms = () => {
  const context = useContext(ApplicationContext)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/room-create");
  }

  useEffect(() => {
    context.updateRooms()
    const interval = setInterval(() => {
      context.updateRooms()
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleRoomClick = (room: Room) => {
    context.connectSocket(room.id)
    navigate("/game")
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="rooms">
          <div className="rooms-glow rooms-glow--bl" />
          <div className="rooms-glow rooms-glow--tr" />
          <div className="rooms-card">
            <div className="rooms-card-border">
              <div className="rooms-card-inner">
                <div className="rooms-logo">
                  <img src="/icon.png" alt="Footlol" />
                </div>
                <h1>Select a Room</h1>
                <div className="rooms-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Room name</th>
                        <th>Status</th>
                        <th>Players</th>
                      </tr>
                    </thead>
                    <tbody>
                      {context.rooms.map(room =>
                        <tr key={room.id} onClick={() => handleRoomClick(room)}>
                          <td>{room.name}</td>
                          <td><RoomStatus room={room} /></td>
                          <td>{room.players}/{(room.config?.maxPlayersPerTeam ?? 5) * 2}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <button onClick={handleClick}>Create new Room</button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default Rooms;

export { default as CreateRoom } from './create'
