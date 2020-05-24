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
    <>
      <div className="bgvideo-container">
        <iframe id="video" frameBorder="0" allowFullScreen={true} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        title="YouTube video player" width="640" height="360"
         src="https://www.youtube.com/embed/dGM7MqzeA7s?mute=1&amp;autoplay=1&amp;loop=1&amp;controls=0&amp;showinfo=0&amp;autohide=0&amp;enablejsapi=1&amp;modestbranding=1&amp;playlist=JkAptaaFSrE&amp;vq=hd1080&amp;origin=https%3A%2F%2Fwww.haxball.com&amp;widgetid=1"></iframe>
      </div>
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
    </>
  );
}

export default Login;
