import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import AuthService from "../services/AuthService";
import "./RegisterPage.css";

const RegisterPage = () => {
  // Basic registration data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Profile data for second step
  const [games, setGames] = useState([]);
  const [gameRoles, setGameRoles] = useState([]);
  const [gameStyle, setGameStyle] = useState("Competitivo");
  const [favoriteStreamer, setFavoriteStreamer] = useState("");
  const [favoriteFuriaPlayer, setFavoriteFuriaPlayer] = useState("");
  const [inspiringPlayer, setInspiringPlayer] = useState("");
  const [steamId, setSteamId] = useState("");
  const [personalityTags, setPersonalityTags] = useState(["", "", ""]);
  const [gameObjectives, setGameObjectives] = useState(["", ""]);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [discord, setDiscord] = useState("");
  
  // Step tracker
  const [currentStep, setCurrentStep] = useState(1);
  
  // Status feedback
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // Validação básica do primeiro passo
      if (!username || !email || !password || !confirmPassword) {
        setError("Por favor, preencha todos os campos.");
        return;
      }
      
      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor, insira um email válido.");
        return;
      }
      
      // Validação de senha
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
      }
      
      // Validação de confirmação de senha
      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }
      
      // Limpa o erro se todas as validações passaram
      setError("");
      // Move para o segundo passo
      setCurrentStep(2);
      
    } else {
      // Complete registration
      setIsLoading(true);
      setError("");
      setSuccess("");
      
      try {
        // Prepara os dados para registro
        const profileData = {
          username,
          email,
          password,
          games: games.filter(game => game.trim() !== ""),
          gameRoles: gameRoles.filter(role => role.trim() !== ""),
          gameStyle,
          favoriteStreamer,
          favoriteFuriaPlayer,
          inspiringPlayer,
          SteamId: steamId, // Mantendo a consistência com o perfil
          personalityTags: personalityTags.filter(tag => tag.trim() !== ""),
          gameObjectives: gameObjectives.filter(obj => obj.trim() !== ""),
          instagram,
          twitter,
          facebook,
          linkedin,
          discord,
          avatar: null // Inicialmente sem avatar
        };
        
        // Chama o serviço de autenticação para registrar
        const result = await AuthService.register(profileData);
        
        if (result.success) {
          setSuccess(result.message);
          
          // Login automático após registro
          const loginResult = await AuthService.login(email, password);
          
          if (loginResult.success) {
            // Redireciona para o perfil após login bem-sucedido
            setTimeout(() => {
              navigate("/profile");
            }, 1500);
          } else {
            // Se o login falhar, ainda redireciona para a página de login
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Ocorreu um erro ao registrar. Tente novamente.");
        console.error("Erro de registro:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTagInputChange = (index, value) => {
    const updatedTags = [...personalityTags];
    updatedTags[index] = value;
    setPersonalityTags(updatedTags);
  };

  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...gameObjectives];
    updatedObjectives[index] = value;
    setGameObjectives(updatedObjectives);
  };

  const addObjectiveField = () => {
    if (gameObjectives.length < 5) {
      setGameObjectives([...gameObjectives, ""]);
    }
  };

  const removeObjectiveField = (index) => {
    if (gameObjectives.length > 1) {
      const updatedObjectives = gameObjectives.filter((_, i) => i !== index);
      setGameObjectives(updatedObjectives);
    }
  };

  const renderInput = (label, type, value, setter, placeholder, required = true) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="register-input"
        required={required}
      />
    </Form.Group>
  );

  const renderFirstStep = () => (
    <Form onSubmit={handleRegister} className="register-form">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {renderInput("Nome de usuário", "text", username, setUsername, "Escolha um nome de usuário")}
      {renderInput("Email", "email", email, setEmail, "Seu email")}
      {renderInput("Senha", "password", password, setPassword, "Crie uma senha")}
      {renderInput("Confirmar Senha", "password", confirmPassword, setConfirmPassword, "Confirme sua senha")}
      
      <div className="button-container">
        <Button 
          type="submit" 
          className="register-button"
          disabled={isLoading}
        >
          Próximo
        </Button>
      </div>
    </Form>
  );

  const renderSecondStep = () => (
    <Form onSubmit={handleRegister} className="register-form">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <h5 className="form-section-title">Jogos e Perfil</h5>
      <Form.Group className="mb-3">
        <Form.Label>Jogos que você joga (separados por vírgula)</Form.Label>
        <Form.Control
          type="text"
          placeholder="CS2, Valorant, League of Legends..."
          value={games.join(", ")}
          onChange={(e) => setGames(e.target.value.split(",").map(game => game.trim()))}
          className="register-input"
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Funções/Posições no jogo (separados por vírgula)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entry Fragger, AWP, Suporte..."
          value={gameRoles.join(", ")}
          onChange={(e) => setGameRoles(e.target.value.split(",").map(role => role.trim()))}
          className="register-input"
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Estilo de Jogo</Form.Label>
        <Form.Select
          value={gameStyle}
          onChange={(e) => setGameStyle(e.target.value)}
          className="register-input"
        >
          <option value="Competitivo">Competitivo</option>
          <option value="Casual">Casual</option>
          <option value="Ranqueado">Ranqueado</option>
          <option value="Modo Diversão">Modo Diversão</option>
          <option value="Mix / Scrim">Mix / Scrim</option>
          <option value="Treinos">Treinos</option>
        </Form.Select>
      </Form.Group>
      
      {/* Uso de containers padronizados para inputs lado a lado */}
      <div className="input-group-container">
        <Form.Group>
          <Form.Label>Steam ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Seu ID Steam"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            className="register-input"
          />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Discord</Form.Label>
          <Form.Control
            type="text"
            placeholder="Usuario#1234"
            value={discord}
            onChange={(e) => setDiscord(e.target.value)}
            className="register-input"
          />
        </Form.Group>
      </div>

      <h5 className="form-section-title">Favoritos</h5>
      <div className="mb-3">
        <Form.Label>Streamer Favorito</Form.Label>
        <Form.Control
          type="text"
          placeholder="Gaules, etc."
          value={favoriteStreamer}
          onChange={(e) => setFavoriteStreamer(e.target.value)}
          className="register-input mb-3"
        />
        
        <Form.Label>Jogador da FURIA</Form.Label>
        <Form.Control
          type="text"
          placeholder="KSCERATO, etc."
          value={favoriteFuriaPlayer}
          onChange={(e) => setFavoriteFuriaPlayer(e.target.value)}
          className="register-input mb-3"
        />
        
        <Form.Label>Jogador Inspiração</Form.Label>
        <Form.Control
          type="text"
          placeholder="s1mple, etc."
          value={inspiringPlayer}
          onChange={(e) => setInspiringPlayer(e.target.value)}
          className="register-input"
        />
      </div>

      <h5 className="form-section-title">Personalidade & Objetivos</h5>
      <Form.Label>Tags de Personalidade (máximo 3)</Form.Label>
      <div className="mb-3">
        {[0, 1, 2].map((index) => (
          <Form.Control
            key={`personality-tag-${index}`}
            type="text"
            placeholder={`Tag ${index + 1} (ex: Tático, Carregador)`}
            value={personalityTags[index] || ''}
            onChange={(e) => handleTagInputChange(index, e.target.value)}
            className="register-input mb-3"
          />
        ))}
      </div>
      
      <Form.Label>Objetivos no Game</Form.Label>
      {gameObjectives.map((objective, index) => (
        <div className="objective-input-container" key={`objective-${index}`}>
          <Form.Control
            type="text"
            placeholder={`Objetivo ${index + 1} (ex: Subir pro Global)`}
            value={objective}
            onChange={(e) => handleObjectiveChange(index, e.target.value)}
            className="register-input"
          />
          {gameObjectives.length > 1 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeObjectiveField(index)}
              className="remove-button"
            >
              X
            </Button>
          )}
        </div>
      ))}
      
      {gameObjectives.length < 5 && (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={addObjectiveField}
          className="add-button mt-2 mb-3"
        >
          + Adicionar Objetivo
        </Button>
      )}

      <h5 className="form-section-title">Redes Sociais (Opcional)</h5>
      <div>
        <Form.Label>Instagram</Form.Label>
        <Form.Control
          type="text"
          placeholder="@seu_usuario"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="register-input mb-3"
        />
        
        <Form.Label>Twitter/X</Form.Label>
        <Form.Control
          type="text"
          placeholder="@seu_usuario"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="register-input mb-3"
        />
        
        <Form.Label>Facebook</Form.Label>
        <Form.Control
          type="text"
          placeholder="seu.usuario"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          className="register-input mb-3"
        />
        
        <Form.Label>LinkedIn</Form.Label>
        <Form.Control
          type="text"
          placeholder="seu-usuario"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="register-input mb-3"
        />
      </div>

      <div className="buttons-container">
        <Button 
          variant="secondary" 
          className="back-button"
          onClick={() => setCurrentStep(1)}
          disabled={isLoading}
        >
          Voltar
        </Button>
        <Button 
          type="submit" 
          className="register-button"
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Concluir Registro"}
        </Button>
      </div>
    </Form>
  );

  return (
    <div className="register-container">
      <NavbarComponent isLoggedIn={false} />
      <Container className="register-content">
        <Row className="justify-content-center">
          <Col md={currentStep === 1 ? 6 : 8}>
            <Card className="register-card">
              <Card.Header as="h4" className="register-header text-center">
                {currentStep === 1 ? "Registrar" : "Complete seu Perfil"}
                <div className="step-indicator">
                  Etapa {currentStep} de 2
                </div>
              </Card.Header>
              <Card.Body>
                {currentStep === 1 ? renderFirstStep() : renderSecondStep()}
              </Card.Body>
              {currentStep === 1 && (
                <Card.Footer className="register-footer">
                  <div>Já tem uma conta?</div>
                  <Link to="/login" className="register-link">
                    Faça login
                  </Link>
                </Card.Footer>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;