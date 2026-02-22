import React, { useContext } from 'react';
import { Container, Header, Wrapper } from '../../layout';
import "./styles.scss"
import { ApplicationContext } from '../../store';
import { useNavigate } from 'react-router-dom';

const LANDING_VIDEO_ID = "dGM7MqzeA7s"

const Login = () => {
  const context = useContext(ApplicationContext)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/room-select");
  }

  const handleChange = (e) => {
    context.changeName(e.target.value);
  }

  return (
    <>
      <div className="bgvideo-container">
        <iframe id="video" frameBorder="0" allowFullScreen={true} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube video player" width="640" height="360"
         src={`https://www.youtube.com/embed/${LANDING_VIDEO_ID}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&playlist=${LANDING_VIDEO_ID}`}></iframe>
      </div>
      <Wrapper>
        <Header>
        </Header>
        <Container>
          <div className="login">
            <div className="login-glow login-glow--bl" />
            <div className="login-glow login-glow--tr" />
            <div className="login-card">
              <div className="login-card-border">
                <div className="login-card-inner">
                  <div className="login-logo">
                    <img src="/icon.png" alt="Footlol" />
                  </div>
                  <p className="login-description">
                    Footlol is a real-time multiplayer football arena where
                    champion-style abilities decide every match.
                  </p>
                  <div className="login-form">
                    <div className="login-label">Nickname</div>
                    <input value={context.name} onChange={handleChange} type="text" maxLength={12} />
                    <div className="login-hint">Max 12 characters</div>
                    <button onClick={handleClick}>Join</button>
                  </div>
                  <div className="login-version">{__APP_VERSION__}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </>
  );
}

export default Login;
