import React from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
function Statusview(props) {
  return (
    <div className="status-view-page">
     <button onClick={()=>console.log(props.location.state.statusUrls[0].createdAt.toDate())}>show
        </button>
      {props.location.state.statusUrls.map((p, i) => (
        <section key={i}>
            <img src={p.url} alt="img"/>
            {moment(p.createdAt.toDate()).fromNow()}
        </section>
      ))}
    </div>
  );
}

export default withRouter(Statusview);
