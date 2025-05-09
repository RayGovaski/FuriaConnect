import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { ChatLeft, People, Flag } from 'react-bootstrap-icons';
import "./Sidebar.css";
import { useChat } from "./ChatContext";

const Sidebar = () => {
  const { activeChat, setActiveChat } = useChat();
  
  const chats = ["# FURIA News", "# Geral", "# Valorant", "# CS2"];
  const torcidaFuria = ["# FURIA Fan Clube", "# Matchday", "# Memes", "# Campeonatos"];  
  
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    (async () => {
      const json = await fetch("http://localhost:3001/users");
      const users = await json.json();     

      setContatos(users);
    })();
  }, [])

  // Função para lidar com a seleção de chat
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
  };
  
  return (
    <div className="sidebar-container">
      {/* Seção de Chats */}
      <div className="sidebar-section-header">
        <ChatLeft className="section-icon" />
        <h5>Chats</h5>
      </div>
      <ListGroup variant="flush" className="sidebar-list">
        {chats.map((chat, idx) => (
          <ListGroup.Item 
            key={idx} 
            action 
            className={`sidebar-item ${activeChat === chat ? 'active' : ''}`}
            onClick={() => handleChatSelect(chat)}
          >
            {chat}
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      {/* Seção de Torcida da FURIA */}
      <div className="sidebar-section-header">
        <Flag className="section-icon" />
        <h5>Torcida da FURIA</h5>
      </div>
      <ListGroup variant="flush" className="sidebar-list">
        {torcidaFuria.map((canal, idx) => (
          <ListGroup.Item 
            key={idx} 
            action 
            className={`sidebar-item ${activeChat === canal ? 'active' : ''}`}
            onClick={() => handleChatSelect(canal)}
          >
            {canal}
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      {/* Seção de Contatos */}
      <div className="sidebar-section-header">
        <People className="section-icon" />
        <h5>Contatos</h5>
      </div>
      <ListGroup variant="flush" className="sidebar-list flex-grow-1">
        {contatos.map((contato, idx) => (
          <ListGroup.Item 
            key={idx} 
            action 
            className={`sidebar-item ${activeChat === contato.name ? 'active' : ''}`}
            onClick={() => handleChatSelect(contato.name)}
          >
            <div className="contact-item">
              <div className="contact-avatar">
                <img src={contato.avatar} alt="" />
              </div>
              {contato.username}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;