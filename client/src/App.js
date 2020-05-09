import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { routes } from './settings'
import { World } from './views'
import "./styles.scss"

function App() {
  return (
    <BrowserRouter basename="">
      <div className="App">
        <Switch>
          {routes.map((route, index) => <Route exact path={route.route} component={World} />)}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
