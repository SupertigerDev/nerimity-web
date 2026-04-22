import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";

import App from "./pages/App/App";

render(
  () => (
    <Router>
      <Route path="/app" component={App}>
        <Route path="/" />
        <Route path="/:serverId/:channelId" />
      </Route>
    </Router>
  ),
  document.getElementById("root")!,
);
