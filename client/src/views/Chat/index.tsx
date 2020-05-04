import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  const roomName = "room";
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [chat, setSocket] = useState(null)

  const sendMessage = () => chat ? chat.send(JSON.stringify({ 'type': 'request_send_message', 'message': message })) : null
  const onMessage = (e) => {
    const data = JSON.parse(e.data);
    setMessages([...messages, data])
  }
  const onOpen = (e) => {
    console.log(e)
  }

  const onError = (e) => setError('Chat socket closed unexpectedly')

  useEffect(() => {
    const chatSocket = new WebSocket('ws://' + window.location.host.replace('8000', '8080') + '/ws/chat/' + roomName + '/');
    setSocket(chatSocket)
  }, [])

  if (chat) {
    chat.onmessage = onMessage
    chat.onclose = onError
    chat.onopen = onOpen
  }

  return (
    <div className="room">
      {error && <div>{error}</div>}
      <div className="messages">
        {messages.map((row, i) => <div key={i}>{row.name}:{row.message}</div>)}
      </div>
      <input onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => sendMessage()}>Send</button>
    </div>
  );
}

export default Chat;
