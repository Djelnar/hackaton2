import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

type Props = {};

const Topbar: React.FC<Props> = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">ME</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
