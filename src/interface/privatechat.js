import React from 'react'
import {useParams,useHistory,withRouter} from 'react-router-dom'
import './private.css'

function Privatechat(props) {
   
    React.useEffect(()=>{
        console.log(props.location)
    },[])
    const person = useParams().cid.split(' ')
    const history = useHistory();
    return (
       <div className="private-chat">
           <nav className="private-navigation">
               {/* <img src={props.location.privateProps.imageUrl} alt="" className="private-img"/> */}
               <span className="private-name">{person[0]}</span>
               <img src="./arrow.png" alt="go back" onClick={()=>history.goBack()} className="private-arrow"/>
           </nav>
       </div>
    )
}

export default withRouter(Privatechat)
