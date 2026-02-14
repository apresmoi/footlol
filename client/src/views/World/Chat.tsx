import React, { useContext, useEffect, useRef, useState } from 'react'
import { ApplicationContext } from '../../store'


const Chat = (props) => {
  const context = useContext(ApplicationContext)
  const [message, setMessage] = useState("")
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const history = historyRef.current
    if (!history) return
    history.scrollTop = history.scrollHeight
  }, [context.messages.length])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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

  const handleFocus = () => {
    if (props.disableKeyboardInput) props.disableKeyboardInput()
  }

  const handleInvalid = () => {
    if (props.enableKeyboardInput) props.enableKeyboardInput()
  }

  return <foreignObject y={props.height - 200} width={300} height={200}>
    <div className="game-chat">
      <div className="chat-history" ref={historyRef}>
        {context.messages.map((msg, i) =>
          <ChatMessage key={i} player={{ name: msg.name }} message={msg.message} />
        )}
      </div>
      {context.self &&
        <div className="chat-input">
          <input onFocus={() => handleFocus()}
            onBlur={() => handleInvalid()}
            type="text"
            placeholder="Type message..."
            maxLength={140}
            onKeyDown={handleKeyDown}
            value={message}
            onChange={handleChange}
          />
          <button onClick={() => sendMessage()} >Send</button>
        </div>
      }
    </div>
  </foreignObject>
}

const ChatMessage = ({ player, message }) => {
  return <div className="chat-message">
    <span className="chat-name">{player.name}:</span>
    <span className="chat-body">{message}</span>
  </div>
}


export default Chat
