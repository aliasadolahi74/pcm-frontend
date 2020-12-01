import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./fontawesome/css/all.css";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "./components/login";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
const dir = process.env.REACT_APP_CUSTOM_DIR;

function App() {
  const theme = createMuiTheme({
    typography: {
      fontFamily: ["IRANSans", "Arial"].join(","),
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Switch>
          <Route path={`${dir}/admin`} component={AdminPanel} />
          <Route path={`${dir}/not-found`} component={NotFound} />
          <Route path={`${dir}/login`} component={Login} />
          <Redirect from={`${dir}/`} exact to={`${dir}/login`} />
          <Redirect to={`${dir}/not-found`} />
        </Switch>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
