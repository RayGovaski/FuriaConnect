import React, { createContext, useState, useContext } from "react";

// Dados iniciais de mensagens para cada chat
const initialChatMessages = {
  "# FURIA News": [
    { from: "FuriaOficial", text: "Novo jogo da FURIA hoje às 19h!" },
    { from: "Sistema", text: "Bem-vindo ao canal de notícias oficiais da FURIA!" },
  ],
  "# Geral": [
    { from: "ModeradorFURIA", text: "Bem-vindos ao canal geral! Por favor, respeitem as regras." },
    { from: "FanFuria22", text: "Alguém vai assistir o próximo jogo?" },
  ],
  "# Valorant": [
    { from: "ValFan123", text: "Alguém viu o último patch do Valorant?" },
    { from: "AceFuria", text: "Acabei de fazer um ace com a Jett!" },
  ],
  "# CS2": [
    { from: "CS2Pro", text: "Estou organizando uma pick-up de CS2, alguém topa?" },
    { from: "AWPer_Master", text: "Alguém tem dicas para treinar com a AWP?" },
  ],
  "# FURIA Fan Clube": [
    { from: "TorcidaFURIA", text: "Que jogo incrível ontem!" },
    { from: "FuriaForever", text: "Já compraram o novo uniforme?" },
  ],
  "# Matchday": [
    { from: "MatchDay_Bot", text: "FURIA vs. Team Liquid hoje às 16h!" },
    { from: "FuriaFan44", text: "Vai ser 2-0 fácil!" },
  ],
  "# Memes": [
    { from: "MemeCreator", text: "Viram o último meme do art?" },
    { from: "FuriaMemer", text: "kkkkkkk muito bom" },
  ],
  "# Campeonatos": [
    { from: "TournamentTracker", text: "Classificação atualizada do Major" },
    { from: "ESL_Fan", text: "FURIA está em 3º no grupo A" },
  ],
  "zBoosterFire_CMP": [
    { from: "zBoosterFire_CMP", text: "Bora um wool wars????" },
    { from: "Você", text: "Nem, to no MCcentral jogando Skywars com a bibi, dps eu entro" },
  ],
  "Davigamer_PVP": [
    { from: "Davigamer_PVP", text: "E aí, vamos jogar hoje?" },
    { from: "Você", text: "Talvez mais tarde, te aviso!" },
  ],
  "zLobi_CMP": [
    { from: "zLobi_CMP", text: "Você viu aquela jogada que eu fiz ontem?" },
    { from: "Você", text: "Sim! Foi incrível!" },
  ]
};

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState("# FURIA News");
  const [chatMessages, setChatMessages] = useState(initialChatMessages);

  const sendMessage = (text) => {
    if (text.trim() !== "") {
      setChatMessages(prevMessages => ({
        ...prevMessages,
        [activeChat]: [...(prevMessages[activeChat] || []), { from: "Você", text }]
      }));
    }
  };

  return (
    <ChatContext.Provider value={{ 
      activeChat, 
      setActiveChat, 
      chatMessages, 
      setChatMessages,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);