import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavbarComponent from "../components/Navbar";
import ChatArea from "../components/ChatArea";
import { Container, Row, Col, Button } from "react-bootstrap";
import { List, X } from 'react-bootstrap-icons';
import "./ChatPage.css";

const ChatPage = () => {
  // Estado para controlar se o usuário está logado (para simulação)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // Estado para controlar a visibilidade da sidebar em dispositivos móveis
  const [showSidebar, setShowSidebar] = useState(false);
  // Estado para controlar se estamos em viewport mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Detecta mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Se não for mobile, sidebar sempre visível
      if (!mobile) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verifica no carregamento inicial
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="chat-page-container">
      <NavbarComponent isLoggedIn={isLoggedIn} />
      
      {/* Botão hambúrguer que aparece apenas em telas menores que 768px */}
      {isMobile && (
        <div className="hamburger-container">
          <Button 
            variant="outline-light" 
            className="hamburger-button"
            onClick={toggleSidebar}
          >
            {showSidebar ? <X size={20} /> : <List size={20} />}
            <span className="ms-2">{showSidebar ? 'Fechar' : 'Menu'}</span>
          </Button>
        </div>
      )}
      
      {/* Overlay de fundo quando a sidebar está aberta em mobile */}
      {isMobile && showSidebar && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <Container fluid className="main-content">
        <Row className="content-row">
          {/* Sidebar: visível sempre em desktop, controlada por estado em mobile */}
          <Col 
            md={3} 
            className={`sidebar-column ${isMobile ? (showSidebar ? 'sidebar-mobile-visible' : 'sidebar-mobile-hidden') : ''}`}
          >
            <Sidebar />
          </Col>
          
          {/* Área de chat */}
          <Col md={9} className="chat-column">
            <ChatArea />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatPage;