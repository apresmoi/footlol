import React from 'react'


const Chat = () => {
  return <div className="chat">
    <div className="chat-history">
      <ChatMessage player={{ name: "Lluvia de verano" }} message="hola" />
    </div>
    <div className="chat-input">
      <input type="text" maxLength={140} placeholder="Message your team..." />
      <button >Send</button>
    </div>
  </div>
}

const ChatMessage = ({ player, message }) => {
  return <div className="chat-message">
    <span className="chat-name">{player.name}:</span>
    <span className="chat-body">{message}</span>
  </div>
}


export default Chat
