import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppBar, Typography, Toolbar } from "@material-ui/core";
import Login from "./Login";
import Topbar from "./Topbar";
import Cabinet from "./Cabinet";
import { API, User } from "./api";

type Props = {};

const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);
  const [isIn, setIsIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    API.checkSession()
      .then((res: any) => {
        if (res.status === "1") {
          setUser(res);
          setIsIn(true);
        }
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return isIn && user ? (
    <>
      <BrowserRouter>
        <Topbar user={user} />
        <Switch>
          <Route path="*" exact component={() => <Cabinet user={user} />} />
        </Switch>
      </BrowserRouter>
    </>
  ) : (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">DREAMHACK2020</Typography>
        </Toolbar>
      </AppBar>
      <Login setIsIn={setIsIn} setUser={setUser} />
    </>
  );
};

export default App;
