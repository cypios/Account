import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {SnackbarProvider} from "notistack"
import Home from "./components/Home";
import ConfirmAccount from "./components/Confirm"
import ForgottenPassword from "./components/ForgottenPassword";
import CreatePro from "./components/CreatePro";
import Error from "./components/Error";
import ResetPassword from "./components/ResetPassword"
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <SnackbarProvider maxSnack={1}>
          <div>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/confirm" component={ConfirmAccount} />
              <Route path="/reset/password" component={ResetPassword} />

              <Route path="/reset" component={ForgottenPassword} />
              <Route path="/pro/create" component={CreatePro} />
              <Route component={Error} />
            </Switch>
          </div>
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default App;