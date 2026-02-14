import React, { useContext, useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ApplicationContextProvider, ApplicationContext } from './store'

// import { World } from './views'
import TeamSelect from './views/TeamSelect';
import ChampionSelect from './views/ChampionSelect';
import Login from './views/Login';

import "./styles.scss"
import Rooms, { CreateRoom } from './views/Rooms';
import { World } from './views';
import { applySeo } from './seo';
import { trackPageView } from './analytics';


function App() {
  return (
    <BrowserRouter basename="">
      <ApplicationContextProvider>
        <RoutedApp />
      </ApplicationContextProvider>
    </BrowserRouter>
  );
}

const RoutedApp = () => {
  const location = useLocation();
  const lastTrackedPath = useRef('');

  useEffect(() => {
    applySeo(location.pathname);

    const fullPath = `${location.pathname}${location.search}`;
    if (lastTrackedPath.current !== fullPath) {
      trackPageView({ path: fullPath, title: document.title });
      lastTrackedPath.current = fullPath;
    }
  }, [location.pathname, location.search]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/room-select" element={<Rooms />} />
        <Route path="/room-create" element={<CreateRoom />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

const Game = () => {
  const state = useContext(ApplicationContext);

  if (!state.name) return <Navigate replace to="/" />;
  if (!state.roomId || (state.stage === 'TEAM_SELECT' && !state.self)) return <Navigate replace to="/room-select" />;

  if (state.stage === 'TEAM_SELECT') return <TeamSelect />;
  if (state.stage === 'CHAMPION_SELECT') return <ChampionSelect />;
  if (state.stage === 'FIELD') return <World />;
  return null;
}

export default App;
