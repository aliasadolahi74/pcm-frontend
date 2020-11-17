import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./fontawesome/css/all.css";
import AdminPanel from "./components/adminPanel";
import NotFound from "./components/notFound";
import { Route, Redirect, Switch } from "react-router-dom";
import Login from "./components/login";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/admin" component={AdminPanel} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/login" component={Login} />
        <Redirect from="/" exact to="/admin" />
        <Redirect to="/not-found" />
      </Switch>
    </div>
  );
}

export default App;
