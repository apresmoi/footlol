import React, { useContext, useEffect } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext, Room } from '../../store';
import { useLocation, useHistory } from 'react-router-dom';

const Rooms = () => {
  const context = useContext(ApplicationContext)
  const history = useHistory()

  const handleClick = () => {
    history.push("/create-room");
  }

  useEffect(() => {
    context.updateRooms()
    const interval = setInterval(() => {
      context.updateRooms()
    }, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleRoomClick = (room: Room) => {
    context.connectSocket(room.id)
    history.push("/game")
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
                    <tr onClick={() => handleRoomClick(room)}>
                      <td>{room.name}</td>
                      <td>({room.players}/10)</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* <button onClick={handleClick}>Create new Room</button> */}
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default Rooms;
