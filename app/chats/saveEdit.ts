import { Character, Message } from "./interfaces"; // adjust as needed

interface SaveEditContext {
  editingIndex: number | null;
  editText: string;
  messages: Message[];
  characters: Character[];
  selectedCharacterId: string | null;
  selectedChatId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setValidcolor: React.Dispatch<React.SetStateAction<string>>;
}

export const saveEditFunc = (ctx: SaveEditContext): void => {
  const {
    editingIndex,
    editText,
    messages,
    characters,
    selectedCharacterId,
    selectedChatId,
    setMessages,
    setCharacters,
    setEditingIndex,
    setEditText,
    setToastMessage,
    setValidcolor,
  } = ctx;

  if (editingIndex !== null) {
    const updatedMessages = [...messages];
    updatedMessages[editingIndex].text = editText;

    // Update regenText in the message itself
    const currentMsg = updatedMessages[editingIndex];
    if (
      currentMsg.sender === "ai" &&
      currentMsg.regeneratedResponses &&
      currentMsg.currentResponseIndex !== undefined &&
      currentMsg.regeneratedResponses.length > currentMsg.currentResponseIndex
    ) {
      const updatedRegen = [...currentMsg.regeneratedResponses];
      updatedRegen[currentMsg.currentResponseIndex] = editText;
      updatedMessages[editingIndex].regeneratedResponses = updatedRegen;
    }

    setMessages(updatedMessages);

    // Update characters state
    if (selectedCharacterId && selectedChatId) {
      const updatedCharacters = characters.map((character) =>
        character.id === selectedCharacterId
          ? {
              ...character,
              chats: character.chats.map((chat) =>
                chat.id === selectedChatId
                  ? {
                      ...chat,
                      messages: updatedMessages,
                      lastActive: Date.now(),
                    }
                  : chat,
              ),
            }
          : character,
      );
      setCharacters(updatedCharacters);
    }

    setEditingIndex(null);
    setEditText("");
    setToastMessage("Message edited successfully!");
    setValidcolor("bg-green-400/50");
  }
};
