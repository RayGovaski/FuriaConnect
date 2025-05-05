import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import AuthService from "../services/AuthService";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Verificar se o usuário já está logado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/profile");
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa mensagens de erro quando o usuário começa a digitar
    setError("");
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Validação básica
      if (!formData.email || !formData.password) {
        setError("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
      
      // Tenta realizar o login
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
        setSuccess(result.message);
        // Redireciona para o perfil após login bem-sucedido
        setTimeout(() => {
          navigate("/profile");
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Ocorreu um erro ao realizar o login. Tente novamente.");
      console.error("Erro de login:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderInput = (label, type, name, placeholder) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        className="login-input"
        required
      />
    </Form.Group>
  );
  
  return (
    <div className="login-container">
      <NavbarComponent isLoggedIn={false} />
      <Container className="login-content">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="login-card">
              <Card.Header as="h4" className="login-header text-center">
                Login
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleLogin} className="login-form">
                  {renderInput("Email", "email", "email", "Seu email")}
                  {renderInput("Senha", "password", "password", "Sua senha")}
                  
                  <div className="button-container">
                    <Button 
                      type="submit" 
                      className="login-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="login-footer">
                <div>Não tem uma conta?</div>
                <Link to="/registrar" className="login-link">
                  Registre-se aqui!
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;