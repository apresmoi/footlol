import React, { useContext } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';
import { useLocation, useHistory } from 'react-router-dom';

const Login = () => {
  const context = useContext(ApplicationContext)
  const history = useHistory()

  const handleClick = () => {
    history.push("/room-select");
  }

  const handleChange = (e) => {
    context.changeName(e.target.value);
  }

  return (
    <Wrapper>
      <Header>
      </Header>
      <Container>
        <div className="login">
          <div className="login-box">
            <h1>FootLol Game</h1>
            <div className="login-content">
              <div>Nickname</div>
              <input value={context.name} onChange={handleChange} type="text" />
              <div></div>
              <button onClick={handleClick}>Join</button>
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  );
}

export default Login;
