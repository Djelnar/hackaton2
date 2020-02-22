import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline, AppBar, Typography, Toolbar } from "@material-ui/core";
import Login from "./Login";
import Topbar from "./Topbar";
import Cabinet from "./Cabinet";

type Props = {};

const App: React.FC<Props> = () => {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route
            path="/login"
            exact
            render={() => (
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6">DREAMHACK2020</Typography>
                </Toolbar>
              </AppBar>
            )}
          />
          <Route component={Topbar} />
        </Switch>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/me" exact component={Cabinet} />
          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
