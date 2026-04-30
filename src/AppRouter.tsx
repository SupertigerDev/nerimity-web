import { Router, Route } from "@solidjs/router";
import { App } from "./view/app/App.tsx";



export const AppRouter = () => {
  return( 
    <Router>
      <Route path="/app" component={App}>
        <Route path="/" />
        <Route path="/servers/:serverId/:channelId"/>
      </Route>
    </Router>
  )
}