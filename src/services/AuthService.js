// src/services/AuthService.js

// Função utilitária para codificar em Base64
const encodeBase64 = (str) => {
  return window.btoa(str);
};

// Função utilitária para decodificar Base64
const decodeBase64 = (str) => {
  return window.atob(str);
};

const USERS_URL = 'http://localhost:3001/users';
const AUTH_TOKEN_KEY = '@authToken';
const CURRENT_USER_KEY = '@user'

// Funções para gerenciar armazenamento de usuários
const getUsers = async () => {  
  const users = await fetch(USERS_URL);  
  return users ? await users.json() : [];
};

const saveUser = (user) => {
  console.log(user)

  fetch(USERS_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
};

// Classe principal de serviço de autenticação
class AuthService {  
  static async register(userData) {
    try {      
      const users = await getUsers();      
      
      // Verifica se o email já está em uso
      if (users.some(user => user.email === userData.email)) {
        return { success: false, message: 'Email já está em uso.' };
      }
      
      // Verifica se o nome de usuário já está em uso
      if (users.some(user => user.username === userData.username)) {
        return { success: false, message: 'Nome de usuário já está em uso.' };
      }
      
      // Adiciona data de registro
      const now = new Date();

      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      
      const newUser = {
        ...userData,
        memberSince: formattedDate,
        id: Date.now().toString(), // ID único baseado em timestamp
      };
      
      // Adiciona o novo usuário
      saveUser(newUser);
      
      return { success: true, message: 'Usuário registrado com sucesso!', user: newUser };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return { success: false, message: 'Erro ao registrar usuário. Tente novamente.' };
    }
  }
  
  static async login(email, password) {
    try {
      const users = await getUsers();
      console.log("Aqui")
      console.log(users)

      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, message: 'Email ou senha incorretos.' };
      }
      
      // Cria o token Basic Auth (email:senha em Base64)
      const token = encodeBase64(`${email}:${password}`);
      
      // Salva o token no localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Salva usuário atual (sem a senha)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { 
        success: true, 
        message: 'Login realizado com sucesso!',
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return { success: false, message: 'Erro ao realizar login. Tente novamente.' };
    }
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} - Status de autenticação do usuário
   */
  static isAuthenticated() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return !!token;
  }

  /**
   * Obtém o usuário atual
   * @returns {Object|null} - Usuário logado ou null
   */
  static getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Obtém o token de autenticação
   * @returns {string|null} - Token de autenticação
   */
  static getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Realiza o logout do usuário
   */
  static logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    return { success: true, message: 'Logout realizado com sucesso!' };
  }

  /**
   * Cria cabeçalho Authorization para requisições HTTP
   * @returns {Object} - Objeto contendo o cabeçalho de autorização
   */
  static getAuthorizationHeader() {
    const token = this.getAuthToken();
    return token ? { Authorization: `Basic ${token}` } : {};
  }

  /**
   * Atualiza os dados do usuário atual
   * @param {Object} userData - Novos dados do usuário
   * @returns {Object} - Resultado da operação
   */
  static updateUserProfile(userData) {
    try {
      const users = getUsers();
      const currentUser = this.getCurrentUser();
      
      if (!currentUser) {
        return { success: false, message: 'Usuário não está autenticado.' };
      }
      
      // Encontra e atualiza o usuário
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          // Preserva a senha e data de registro
          return { 
            ...userData, 
            id: user.id,
            password: user.password,
            memberSince: user.memberSince
          };
        }
        return user;
      });
      
      // Salva os usuários atualizados
      saveUser(updatedUsers);
      
      // Atualiza o usuário atual no localStorage
      const updatedUser = updatedUsers.find(user => user.id === currentUser.id);
      const { password: _, ...userWithoutPassword } = updatedUser;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { 
        success: true, 
        message: 'Perfil atualizado com sucesso!',
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, message: 'Erro ao atualizar perfil. Tente novamente.' };
    }
  }
}

export default AuthService;