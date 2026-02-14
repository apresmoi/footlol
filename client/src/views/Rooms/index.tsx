import React, { useContext, useEffect } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../store/types';

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
          <div className="rooms-box">
            <h1>Select a Room</h1>
            <div className="rooms-list">
              <table>
                <thead>
                  <tr>
                    <th>Room name</th>
                    <th>Players</th>
                  </tr>
                </thead>
                <tbody>
                  {context.rooms.map(room =>
                    <tr key={room.id} onClick={() => handleRoomClick(room)}>
                      <td>{room.name}</td>
                      <td>({room.players}/10)</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button onClick={handleClick}>Create new Room</button>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default Rooms;

export { default as CreateRoom } from './create'
