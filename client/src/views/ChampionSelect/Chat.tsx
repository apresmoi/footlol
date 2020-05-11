import React from 'react'


const Chat = () => {
  return <div className="chat">
    <div className="chat-history">
      <ChatMessage player={{ name: "Lluvia de verano" }} message="hola" />
    </div>
    <div className="chat-input">
      <input type="text" maxLength={140} />
      <button >Send</button>
    </div>
  </div>
}

const ChatMessage = ({ player, message }) => {
  return <div className="chat-message">
    <span>{player.name}: </span> {message}
  </div>
}


export default Chat