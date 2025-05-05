import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Bell, Gear } from 'react-bootstrap-icons';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);  

  useEffect(() => {    
    const storedUser = localStorage.getItem("@user");

    if (storedUser) {
      setIsLoggedIn(true);      
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="main-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/chat" className="navbar-brand d-flex align-items-center">
          <div className="navbar-logo"></div>
        </Navbar.Brand>

        <Nav className="navbar-controls">
          <Nav.Link href="#" className="icon-link">
            <Bell size={18} />
          </Nav.Link>
          <Nav.Link href="#" className="icon-link">
            <Gear size={18} />
          </Nav.Link>

          {isLoggedIn ? (
            <>              
              <Button 
                variant="outline-light" 
                size="sm"
                className="auth-button"
                onClick={() => navigate("/profile")}
              >
                Meu Perfil
              </Button>
            </>
          ) : (
            <Button 
              variant="outline-light" 
              size="sm"
              className="auth-button"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;