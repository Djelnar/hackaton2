import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { User } from "./api";

type Props = {
  user: User;
};

const Topbar: React.FC<Props> = ({ user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{user.login}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
