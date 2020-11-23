import React from "react";
import {Chatcontext} from './elements/context'
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Authtext from "./users/authtext";
import Userslist from "./users/userslist";
import firebase from "./config/base";
import { useAuthState } from "react-firebase-hooks/auth";
import Privatechat from "./interface/private";
import Chatslist from "./users/chatlist";
import Newgroup from "./groups/newgroup";
import Groups from "./groups/groups";
import Groupchat from "./interface/groupchat";
import Status from "./status/status";
import Newstatus from "./status/newstatus";
import Profileupdate from "./users/profileupdate"
import Statusview from "./status/statusview";
import { Instagram } from 'react-content-loader'
const auth = firebase.auth();

function App() {
  const [user, loading] = useAuthState(auth);
  if(loading){
    return <Instagram/>
  }
  let route;
  if (user)
    route = (
      <Router>
      <Switch>
        <Route path="/" exact>
        <Chatslist/>
        </Route>
        <Route path="/groups" exact>
        <Groups/>
        </Route>
        <Route path="/groupchat/:gid" exact>
        <Groupchat/>
        </Route>
        <Route path="/newgroup" exact>
        <Newgroup/>
        </Route>
        <Route path="/status" exact>
          <Status/>
        </Route>
        <Route path="/viewstatus/:sid" exact>
         <Statusview/>
        </Route>
        <Route path="/newstatus" exact>
          <Newstatus/>
        </Route>
        <Route path="/profileupdate" exact>
          <Profileupdate/>
        </Route>
        <Route path="/users" exact>
          <Userslist />
        </Route>
        <Route exact path="/chat/:cid" >
          <Privatechat/>
        </Route>
        </Switch>
      </Router>
    );
  if (!user) route = <Authtext />;
  return (
    <Chatcontext.Provider value={ {currentUser :user}}>
    <main>
      {loading && <div>loading</div>}
      {!loading && route}
    </main>
    </Chatcontext.Provider>
  );
}

export default App;
