import React, { useContext, useState } from 'react'
import { ApplicationContext } from '../../store'


const Chat = () => {
  const context = useContext(ApplicationContext)
  const [message, setMessage] = useState("")
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMessage()
    }
  }
  const sendMessage = () => {
    if (message.length) {
      context.requestSendMessage({ message: message })
      setMessage("")
    }
  }
  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  return <div className="chat">
    <div className="chat-history">
      {context.messages.map((msg, i) =>
        <ChatMessage key={i} player={{ name: msg.name }} message={msg.message} />
      )}
    </div>
    <div className="chat-input">
      <input type="text" maxLength={140} onKeyDown={handleKeyDown} value={message} onChange={handleChange} />
      <button onClick={() => sendMessage()} >Send</button>
    </div>
  </div>
}

const ChatMessage = ({ player, message }) => {
  return <div className="chat-message">
    <span>{player.name}: </span> {message}
  </div>
}


export default Chat