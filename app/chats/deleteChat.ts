import { Character, Chat, Message } from "./interfaces"; // adjust as needed

interface DeleteChatContext {
  characters: Character[];
  selectedCharacterId: string | null;
  selectedChatId: string | null;
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setShowDeleteChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const deleteChatFunc = (
  characterId: string,
  chatId: string,
  ctx: DeleteChatContext,
): void => {
  const {
    characters,
    selectedCharacterId,
    selectedChatId,
    setCharacters,
    setSelectedChatId,
    setMessages,
    setShowDeleteChatModal,
  } = ctx;

  const updatedCharacters = characters.map((character) =>
    character.id === characterId
      ? {
          ...character,
          chats: character.chats.filter((chat) => chat.id !== chatId),
        }
      : character,
  );

  setCharacters(updatedCharacters);

  // If we deleted the current chat, select the first available chat
  if (selectedCharacterId === characterId && selectedChatId === chatId) {
    const character = updatedCharacters.find((c) => c.id === characterId);
    if (character && character.chats.length > 0) {
      setSelectedChatId(character.chats[0].id);
      setMessages(character.chats[0].messages);
    } else if (character && character.chats.length === 0) {
      // Create a new chat if all chats were deleted
      const firstMessage =
        character.firstMessage ||
        `Hello! I'm ${character.name}, how can I help you today?`;

      const newChat: Chat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [
          {
            sender: "ai",
            text: firstMessage,
          },
        ],
        lastActive: Date.now(),
      };

      const finalCharacters = updatedCharacters.map((c) =>
        c.id === characterId ? { ...c, chats: [newChat] } : c,
      );

      setCharacters(finalCharacters);
      setSelectedChatId(newChat.id);
      setMessages(newChat.messages);
    }
  }
  setShowDeleteChatModal(false);
};
