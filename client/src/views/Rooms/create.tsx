import React, { useContext, useState } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';

const CreateRoom = () => {
  const context = useContext(ApplicationContext)
  const [roomName, setRoomName] = useState("")

  const handleClick = () => {
    if (roomName && roomName.length > 5)
      context.createRoom(roomName)
  }

  const handleChange = (e) => {
    setRoomName(e.target.value);
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="rooms">
          <div className="rooms-glow rooms-glow--bl" />
          <div className="rooms-glow rooms-glow--tr" />
          <div className="rooms-card rooms-card--narrow">
            <div className="rooms-card-border">
              <div className="rooms-card-inner">
                <div className="rooms-logo">
                  <img src="/icon.png" alt="Footlol" />
                </div>
                <h1>Create a Room</h1>
                <div className="create-room-form">
                  <div className="create-room-label">Room Name</div>
                  <input value={roomName} onChange={handleChange} type="text" maxLength={30} />
                  <div className="create-room-hint">Minimum 6 characters</div>
                  <button disabled={roomName.length < 6} onClick={handleClick}>Create</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default CreateRoom;
