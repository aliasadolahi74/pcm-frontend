import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./fontawesome/css/all.css";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "./components/login";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import jwtDecode from "jwt-decode";
import axios from "./services/httpServices";
import qs from "qs";
const dir = process.env.REACT_APP_CUSTOM_DIR;

function App() {
  const theme = createMuiTheme({
    typography: {
      fontFamily: ["IRANSans", "Arial"].join(","),
    },
  });

  const token = localStorage.getItem("token");
  const now = new Date().getTime();
  let expireTimestamp = 0;
  let routes;
  try {
    const decodedToken = jwtDecode(token);
    expireTimestamp = decodedToken["expire"];
  } catch (e) {}
  if (token !== null && expireTimestamp > now) {
    refreshToken(token);
    routes = (
      <Switch>
        <Route path={`${dir}/admin`} component={AdminPanel} />
        <Route path={`${dir}/not-found`} component={NotFound} />
        <Route path={`${dir}/login`} component={Login} />
        <Redirect from={`${dir}/`} exact to={`${dir}/login`} />
        <Redirect to={`${dir}/not-found`} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path={`${dir}/admin`} component={Login} />
        <Route path={`${dir}/not-found`} component={NotFound} />
        <Route path={`${dir}/login`} component={Login} />
        <Redirect from={`${dir}/`} exact to={`${dir}/login`} />
        <Redirect to={`${dir}/not-found`} />
      </Switch>
    );
  }
  return (
    <MuiThemeProvider theme={theme}>
      <div className='App'>{routes}</div>
    </MuiThemeProvider>
  );
}

async function refreshToken(oldToken) {
  const loginOptions = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify({ token: oldToken }),
    url: `/refresh-token.php`,
  };
  const loginInfo = await axios(loginOptions);
  if (loginInfo.data.status) {
    const token = loginInfo.data.body.token;
    localStorage.removeItem("token");
    localStorage.setItem("token", token);
  }
}

export default App;
