import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Authtext from "./users/authtext";
import Userslist from "./users/userslist";
import firebase from "./config/base";
import { useAuthState } from "react-firebase-hooks/auth";
import Privatechat from "./interface/privatechat";
import Chatslist from "./users/chatlist";
import Groups from "./groups/groups";
import Newgroup from "./groups/newgroup";
const auth = firebase.auth();

function App() {
  const [user, loading] = useAuthState(auth);
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
        <Route path="/newgroup" exact>
        <Newgroup/>
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
    <main>
      {loading && <div>loading</div>}
      {!loading && route}
    </main>
  );
}

export default App;
