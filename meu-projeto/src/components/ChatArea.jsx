import React, { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./ChatArea.css";
import { useChat } from "./ChatContext";

const ChatArea = () => {
  const { activeChat, chatMessages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Scroll automático para o fim
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeChat]);

  return (
    <div className="chat-area-container">
      
      <div className="messages-container">
        {chatMessages[activeChat]?.map((msg, idx) => (
          <div key={idx} className={`message-item ${msg.from === "Você" ? "my-message" : ""}`}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
        {/* Ref para scroll automático */}
        <div ref={chatEndRef} />
      </div>

      <Form
        className="message-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Digite sua mensagem..."
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" variant="outline-light" className="send-button">
          Enviar
        </Button>
      </Form>
    </div>
  );
};

export default ChatArea;