import React, { useState, useRef, useEffect } from "react";
import { Container, Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./Navbar";
import './Profile.css';


const Profile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef(null);
  
  // Mock profile data
  const [profileData, setProfileData] = useState(
    {
      "id": "",
      "username": "",
      "email": "",
      "password": "",
      "games": [
        ""
      ],
      "gameRoles": [
        ""
      ],
      "gameStyle": "",
      "favoriteStreamer": "",
      "favoriteFuriaPlayer": "",
      "inspiringPlayer": "",
      "SteamId": "",
      "personalityTags": [
        "",        
      ],
      "gameObjectives": [
        ""
      ],
      "instagram": "",
      "twitter": "",
      "facebook": "",
      "linkedin": "",
      "discord": "",
      "avatar": "",
      "memberSince": ""
    }
  );

  // State for form data in the modal
  const [formData, setFormData] = useState({...profileData});
  
  // Selected image preview
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    (async () => {
      const json = await fetch("http://localhost:3001/users");
      const users = await json.json();
      
      const userJson = localStorage.getItem("@user");
      const userParsed = JSON.parse(userJson);

      const user = users.find(u => u.email == userParsed.email);

      setProfileData(user);
    })();
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle personality tag input changes
  const handleTagInputChange = (index, value) => {
    const updatedTags = [...formData.personalityTags];
    updatedTags[index] = value;
    setFormData({
      ...formData,
      personalityTags: updatedTags
    });
  };

  // Handle game objective input changes
  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...formData.gameObjectives];
    updatedObjectives[index] = value;
    
    // Make sure we have at least 2 objectives
    while (updatedObjectives.length < 2) {
      updatedObjectives.push("");
    }
    
    setFormData({
      ...formData,
      gameObjectives: updatedObjectives
    });
  };

  // Add a new objective field
  const addObjectiveField = () => {
    if (formData.gameObjectives.length < 5) {
      setFormData({
        ...formData,
        gameObjectives: [...formData.gameObjectives, ""]
      });
    }
  };

  // Remove an objective field
  const removeObjectiveField = (index) => {
    if (formData.gameObjectives.length > 1) {
      const updatedObjectives = formData.gameObjectives.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        gameObjectives: updatedObjectives
      });
    }
  };

  // Open modal with current data
  const handleOpenModal = () => {
    setFormData({...profileData});
    setShowEditModal(true);
  };

  // Save changes from modal
  const handleSaveChanges = () => {
    // Filter out empty values
    const filteredTags = formData.personalityTags.filter(tag => tag.trim() !== "");
    const filteredObjectives = formData.gameObjectives.filter(obj => obj.trim() !== "");
    
    setProfileData({
      ...formData,
      personalityTags: filteredTags,
      gameObjectives: filteredObjectives
    });
    
    setShowEditModal(false);
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];            
      
      const reader = new FileReader();
      
      reader.onloadend = () => {
        console.log(reader)
        setImagePreview(reader.result);
        setProfileData({
          ...profileData,
          avatar: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Open photo modal
  const handleOpenPhotoModal = () => {
    setImagePreview(profileData.avatar);
    setShowPhotoModal(true);
  };

  // Save photo changes
  const handleSavePhoto = async () => {
    setProfileData({
      ...profileData,
      avatar: imagePreview
    });

    await fetch(`http://localhost:3001/users/${profileData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    setShowPhotoModal(false);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-container">
      <NavbarComponent isLoggedIn={true} />
      <Container className="profile-content">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="profile-card">
              <Card.Header className="profile-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Perfil do Jogador - FURIA Connect</h3>
                <Button 
                  variant="outline-light" 
                  className="edit-profile-btn"
                  onClick={handleOpenModal}
                >
                  Editar Informações
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <div className="profile-avatar-wrapper">
                      <div className="profile-avatar-container">
                        {profileData.avatar ? (
                          <img src={profileData.avatar} alt="Avatar" className="avatar-image" />
                        ) : (
                          <span className="profile-avatar">🐾</span>
                        )}
                      </div>
                      <button 
                        className="change-photo-button"
                        onClick={handleOpenPhotoModal}
                        aria-label="Alterar foto"
                      >
                        <i className="photo-icon">📷</i>
                      </button>
                    </div>
                    <h4 className="username-display mt-3">{profileData.username}</h4>
                    <div className="member-badge">
                      Membro desde {profileData.memberSince}
                    </div>
                  </Col>
                  
                  <Col md={8}>
                    <div className="profile-section">
                      <h5 className="profile-section-title">Dados Básicos</h5>
                      <div className="profile-data-row">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value">{profileData.email}</span>
                      </div>
                      <div className="profile-data-row">
                        <span className="profile-label">Steam:</span>
                        <span className="profile-value">{profileData.SteamId}</span>
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="profile-section">
                      <h5 className="profile-section-title">Redes Sociais</h5>
                      {(profileData.instagram || profileData.twitter || 
                        profileData.facebook || profileData.linkedin || 
                        profileData.discord) ? (
                        <>
                          {profileData.instagram && (
                            <div className="profile-data-row">
                              <span className="profile-label">Instagram:</span>
                              <span className="profile-value">{profileData.instagram}</span>
                            </div>
                          )}
                          {profileData.twitter && (
                            <div className="profile-data-row">
                              <span className="profile-label">X:</span>
                              <span className="profile-value">{profileData.twitter}</span>
                            </div>
                          )}
                          {profileData.facebook && (
                            <div className="profile-data-row">
                              <span className="profile-label">Facebook:</span>
                              <span className="profile-value">{profileData.facebook}</span>
                            </div>
                          )}
                          {profileData.linkedin && (
                            <div className="profile-data-row">
                              <span className="profile-label">LinkedIn:</span>
                              <span className="profile-value">{profileData.linkedin}</span>
                            </div>
                          )}
                          {profileData.discord && (
                            <div className="profile-data-row">
                              <span className="profile-label">Discord:</span>
                              <span className="profile-value">{profileData.discord}</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="no-social-media">
                          Nenhuma rede social adicionada
                        </div>
                      )}
                    </div>

                    <div className="profile-section">
                      <h5 className="profile-section-title">Perfil de Jogo</h5>
                      <div className="profile-data-row">
                        <span className="profile-label">Jogos:</span>
                        <span className="profile-value">
                          {profileData.games.join(", ")}
                        </span>
                      </div>
                      <div className="profile-data-row">
                        <span className="profile-label">Funções:</span>
                        <span className="profile-value">
                          {profileData.gameRoles.join(", ")}
                        </span>
                      </div>
                      <div className="profile-data-row">
                        <span className="profile-label">Estilo:</span>
                        <span className="profile-value">{profileData.gameStyle}</span>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h5 className="profile-section-title">Favoritos</h5>
                      <div className="profile-data-row">
                        <span className="profile-label">Streamer:</span>
                        <span className="profile-value">{profileData.favoriteStreamer}</span>
                      </div>
                      <div className="profile-data-row">
                        <span className="profile-label">Jogador FURIA:</span>
                        <span className="profile-value">{profileData.favoriteFuriaPlayer}</span>
                      </div>
                      <div className="profile-data-row">
                        <span className="profile-label">Inspiração:</span>
                        <span className="profile-value">{profileData.inspiringPlayer}</span>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h5 className="profile-section-title">Personalidade</h5>
                      <div className="tags-display">
                        {profileData.personalityTags.map((tag, index) => (
                          <span key={index} className="profile-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="profile-section">
                      <h5 className="profile-section-title">Objetivos</h5>
                      <div className="tags-display">
                        {profileData.gameObjectives.map((objective, index) => (
                          <span key={index} className="profile-tag objective-tag">{objective}</span>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="profile-footer">
                <div className="d-flex justify-content-between w-100">
                  <Button variant="primary" onClick={() => navigate("/chat")}>
                    Voltar ao Chat
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    className="logout-btn"
                    onClick={() => {                     
                      localStorage.removeItem("@user");
                      localStorage.removeItem("@authToken")
                      navigate("/login");
                    }}
                  >
                    Deslogar
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Profile Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="lg"
        className="edit-profile-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Informações do Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5 className="modal-section-title">Dados Básicos</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome de usuário</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Steam ID </Form.Label>
                  <Form.Control 
                    type="text" 
                    name="SteamId" 
                    value={formData.SteamId}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Social Media Form Fields */}
            <h5 className="modal-section-title">Redes Sociais</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="instagram" 
                    value={formData.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="@seu_usuario"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>X (Twitter)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="twitter" 
                    value={formData.twitter || ''}
                    onChange={handleInputChange}
                    placeholder="@seu_usuario"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="facebook" 
                    value={formData.facebook || ''}
                    onChange={handleInputChange}
                    placeholder="seu.usuario"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="linkedin" 
                    value={formData.linkedin || ''}
                    onChange={handleInputChange}
                    placeholder="seu-usuario"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Discord</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="discord" 
                    value={formData.discord || ''}
                    onChange={handleInputChange}
                    placeholder="Usuario#1234"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="modal-section-title">Jogos e Perfil</h5>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Jogos que você joga (separados por vírgula)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="gamesInput" 
                    value={formData.games.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData, 
                      games: e.target.value.split(",").map(game => game.trim()).filter(game => game)
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Funções/Posições no jogo (separados por vírgula)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="rolesInput" 
                    value={formData.gameRoles.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData, 
                      gameRoles: e.target.value.split(",").map(role => role.trim()).filter(role => role)
                    })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Estilo de Jogo</Form.Label>
                  <Form.Select 
                    name="gameStyle"
                    value={formData.gameStyle}
                    onChange={handleInputChange}
                  >
                    <option value="Competitivo">Competitivo</option>
                    <option value="Casual">Casual</option>
                    <option value="Ranqueado">Ranqueado</option>
                    <option value="Modo Diversão">Modo Diversão</option>
                    <option value="Mix / Scrim">Mix / Scrim</option>
                    <option value="Treinos">Treinos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="modal-section-title">Favoritos</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Streamer Favorito</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="favoriteStreamer" 
                    value={formData.favoriteStreamer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Jogador Preferido da FURIA</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="favoriteFuriaPlayer" 
                    value={formData.favoriteFuriaPlayer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Jogador que Te Inspira</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="inspiringPlayer" 
                    value={formData.inspiringPlayer}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="modal-section-title">Personalidade & Objetivos</h5>
            <Row>
              {/* Campos individuais para tags de personalidade */}
              <Col md={12}>
                <Form.Label>Tags de Personalidade (máximo 3)</Form.Label>
              </Col>
              {[0, 1, 2].map((index) => (
                <Col md={4} key={`personality-tag-${index}`}>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      type="text" 
                      placeholder={`Tag ${index + 1}`}
                      value={formData.personalityTags[index] || ''}
                      onChange={(e) => handleTagInputChange(index, e.target.value)}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Label>Objetivos no Game</Form.Label>
                {formData.gameObjectives.map((objective, index) => (
                  <div className="d-flex mb-2" key={`objective-${index}`}>
                    <Form.Control 
                      type="text" 
                      placeholder={`Objetivo ${index + 1}`}
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      className="me-2"
                    />
                    {formData.gameObjectives.length > 1 && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => removeObjectiveField(index)}
                      >
                        X
                      </Button>
                    )}
                  </div>
                ))}
                
                {formData.gameObjectives.length < 5 && (
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    onClick={addObjectiveField}
                    className="mt-2"
                  >
                    + Adicionar Objetivo
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Photo Upload Modal */}
      <Modal 
        show={showPhotoModal} 
        onHide={() => setShowPhotoModal(false)} 
        centered
        className="photo-upload-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Alterar Foto de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="photo-preview-container">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="photo-preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="photo-placeholder">
                <span>🖼️</span>
                <p>Selecione uma imagem</p>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="d-none"
          />
          
          <Button 
            variant="outline-primary" 
            onClick={triggerFileInput}
            className="upload-button mt-3"
          >
            Selecionar Imagem
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSavePhoto}
            disabled={!imagePreview}
          >
            Salvar Foto
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;