import React, { useEffect, useState } from "react";
import MessageBox from "../../components/MessageBox/MessageBox";
import axios from "axios";
import UserNavBar from "../../components/UserNavBar/UserNavBar";

export default function MessagePage(props){
  const [conversations,SetConversations] = useState([])
  console.log(conversations)
  useEffect(()=>{
    const getConversation = async ()=>{
      try{
        const response = await axios.get(`/api/conversations/${props.user._id}`)
        SetConversations(response.data)
      }catch(err){
        console.log(err)
      }
    }
    getConversation()
  },[props.user._id])
  return(
    <div className="MessagePage">
      <UserNavBar user={props.user}/>
      {conversations.map((c,i)=><MessageBox key={i} conversation={c} userId={props.user}/>)}
    </div>
  )
}
// {conversations.map((c) => {
//   <MessageBox conversation={c}/>
// })}