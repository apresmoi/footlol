import React, { useContext, useState } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';
import { useHistory } from 'react-router-dom';

const Login = () => {
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
        <div className="login">
          <div className="login-box">
            <div className="login-content">
              <div>Insert a name for your room (min length 6)</div>
              <input value={roomName} onChange={handleChange} type="text" />
              <div></div>
              <button disabled={roomName.length < 5} onClick={handleClick}>Create</button>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default Login;
