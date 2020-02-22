import React, { useCallback, useState } from "react";
import { Paper, TextField, makeStyles, Button } from "@material-ui/core";
import { API } from "./api";

const us = makeStyles(theme => ({
  wrapper: {
    display: "flex",
    minHeight: "calc(100vh - 64px)"
  },
  paper: {
    maxWidth: 500,
    padding: theme.spacing(2),
    width: "100%",
    margin: "auto"
  },
  field: {
    marginBottom: theme.spacing(1)
  }
}));

type Props = {
  setIsIn: Function;
  setUser: Function;
};

const Login: React.FC<Props> = ({ setIsIn, setUser }) => {
  const s = us();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    e => {
      e.preventDefault();
      if (login && password) {
        API.login({
          login,
          password
        })
          .then(res => {
            setUser(res);
            setIsIn(true);
          })
          .catch((e: any) => {
            console.log(e);
          });
      }
    },
    [login, password, setIsIn, setUser]
  );

  return (
    <div className={s.wrapper}>
      <Paper className={s.paper}>
        <form onSubmit={handleSubmit}>
          <div className={s.field}>
            <TextField
              value={login}
              onChange={e => setLogin(e.target.value)}
              label="Логин"
              type="text"
              fullWidth
            />
          </div>
          <div className={s.field}>
            <TextField
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Пароль"
              type="password"
              fullWidth
            />
          </div>
          <div className={s.field}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Принять
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
