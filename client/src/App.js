import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { ApplicationContextProvider, ApplicationContextConsumer, ApplicationContext } from './store'

// import { World } from './views'
import TeamSelect from './views/TeamSelect';
import ChampionSelect from './views/ChampionSelect';
import Login from './views/Login';

import "./styles.scss"
import Rooms from './views/Rooms';
import { World } from './views';


function App() {
  return (
    <BrowserRouter basename="">
      <ApplicationContextProvider>
        <div className="App">
          <Switch>
            <Route exact path={'/'} component={Login} />
            <Route exact path={'/room-select'} component={Rooms} />
            <Route exact path={'/game'} component={Game} />
          </Switch>
        </div>
      </ApplicationContextProvider>
    </BrowserRouter>
  );
}

const Game = () => {
  return <ApplicationContext.Consumer>
    {(state) => {
      if (!state.name) return <Redirect to={'/'} />
      else if (!state.roomId) return <Redirect to={'/room-select'} />

      if (state.stage === 'TEAM_SELECT') return <TeamSelect />;
      else if (state.stage === 'CHAMPION_SELECT') return <ChampionSelect />;
      else if (state.stage === 'FIELD') return <World />;
      return null
    }}
  </ApplicationContext.Consumer>
}

export default App;
