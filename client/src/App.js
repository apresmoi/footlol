import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { routes } from './settings'
import { World } from './views'
import { Header } from './layout'
import store from './store'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css';
import "./styles.scss"


function App() {
  return (
    <Provider store={store}>
        <BrowserRouter basename="commandcenter">
          <div className="App">
            <Switch>
              {routes.map((route, index) => <Route exact path={route.route} component={World} />)}
            </Switch>
          </div>
        </BrowserRouter>
    </Provider>
  );
}

export default App;
