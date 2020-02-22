import React, { useCallback } from "react";
import { Paper, TextField, makeStyles, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

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

type Props = {};

const Login: React.FC<Props> = () => {
  const s = us();
  const h = useHistory();

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    e => {
      e.preventDefault();
      h.push("/me");
    },
    [h]
  );

  return (
    <div className={s.wrapper}>
      <Paper className={s.paper}>
        <form onSubmit={handleSubmit}>
          <div className={s.field}>
            <TextField label="Username" type="text" fullWidth />
          </div>
          <div className={s.field}>
            <TextField label="Password" type="password" fullWidth />
          </div>
          <div className={s.field}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              GO
            </Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
