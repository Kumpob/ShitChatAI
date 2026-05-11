import { Character, Message } from "./interfaces"; // adjust as needed

interface DeleteCharacterContext {
  characters: Character[];
  selectedCharacterId: string | null;
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  setSelectedCharacterId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setShowDeleteCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export const deleteCharacterFunc = (
  characterId: string,
  ctx: DeleteCharacterContext,
): void => {
  const {
    characters,
    selectedCharacterId,
    setCharacters,
    setSelectedCharacterId,
    setSelectedChatId,
    setMessages,
    setShowDeleteCharacterModal,
    setCharacterToDelete,
  } = ctx;

  if (characters.length <= 1) {
    alert(
      "You cannot delete the last character. At least one character must remain.",
    );
    setShowDeleteCharacterModal(false);
    setCharacterToDelete(null);
    return;
  }

  const updatedCharacters = characters.filter(
    (character) => character.id !== characterId,
  );
  setCharacters(updatedCharacters);

  // If we deleted the current character, select the first available character
  if (selectedCharacterId === characterId) {
    if (updatedCharacters.length > 0) {
      setSelectedCharacterId(updatedCharacters[0].id);
      if (updatedCharacters[0].chats.length > 0) {
        setSelectedChatId(updatedCharacters[0].chats[0].id);
        setMessages(updatedCharacters[0].chats[0].messages);
      } else {
        setSelectedChatId(null);
        setMessages([]);
      }
    } else {
      // Create a default character if all are deleted
      const defaultCharacter: Character = {
        id: "default",
        name: "AI",
        personality: "",
        scenario: "",
        chats: [
          {
            id: "default-chat",
            title: "First Chat",
            messages: [
              {
                sender: "ai",
                text: "Hello {{user}}! I'm {{char}}, how can I help you today?",
              },
            ],
            lastActive: Date.now(),
          },
        ],
      };
      setCharacters([defaultCharacter]);
      setSelectedCharacterId("default");
      setSelectedChatId("default-chat");
      setMessages(defaultCharacter.chats[0].messages);
    }
  }

  setShowDeleteCharacterModal(false);
  setCharacterToDelete(null);
};
