import Link from "next/link"; // adjust to your router
import { Character } from "./interfaces"; // adjust as needed
import React from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  characters: Character[];
  selectedCharacterId: string | null;
  selectedChatId: string | null;
  editingChatId: string | null;
  editChatName: string;
  storageUsed: string;
  maxStorageSize: string | null;
  setShowNewCharacterModal: (v: boolean) => void;
  setSelectedCharacterId: (id: string) => void;
  setSelectedChatId: (id: string) => void;
  setCharacterToDelete: (id: string) => void;
  setShowDeleteCharacterModal: (v: boolean) => void;
  setChatToDelete: (v: { characterId: string; chatId: string }) => void;
  setShowDeleteChatModal: (v: boolean) => void;
  setEditChatName: (v: string) => void;
  setToastMessage: (v: string) => void;
  setValidcolor: (v: string) => void;
  showFullImage: (id: string) => void;
  handleStoryInfoClick: (id: string) => void;
  handleBotSettingsClick: (id: string) => void;
  createNewChat: (characterId: string) => void;
  saveChatName: () => void;
  cancelEditChatName: () => void;
  startEditingChatName: (
    characterId: string,
    chatId: string,
    title: string,
  ) => void;
}

export const Sidebar = ({
  isSidebarOpen,
  characters,
  selectedCharacterId,
  selectedChatId,
  editingChatId,
  editChatName,
  storageUsed,
  maxStorageSize,
  setShowNewCharacterModal,
  setSelectedCharacterId,
  setSelectedChatId,
  setCharacterToDelete,
  setShowDeleteCharacterModal,
  setChatToDelete,
  setShowDeleteChatModal,
  setEditChatName,
  setToastMessage,
  setValidcolor,
  showFullImage,
  handleStoryInfoClick,
  handleBotSettingsClick,
  createNewChat,
  saveChatName,
  cancelEditChatName,
  startEditingChatName,
}: SidebarProps) => {
  return (
    <div
      className={`max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isSidebarOpen
          ? "translate-x-0 w-64 md:w-64"
          : "-translate-x-full w-64 md:w-0 overflow-hidden"
      }`}
    >
      <div className="flex flex-row p-4 border-b border-gray-200">
        <Link
          className="w-1/8 bg-blue-500 hover:bg-blue-600 text-white mr-2 py-2 px-2 rounded-lg flex items-center justify-center gap-2"
          href="/"
        >
          <div className="font-bold">⇦</div>
        </Link>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          onClick={() => setShowNewCharacterModal(true)}
        >
          ➕ New Character
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {characters.map((character) => (
          <div key={character.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {/* Character thumbnail */}
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {character.thumbnail ? (
                  <img
                    src={character.thumbnail}
                    alt={character.name}
                    className="w-full h-full object-cover"
                    onClick={() => showFullImage(character.id)}
                  />
                ) : (
                  <span className="text-gray-500 text-xs">📷</span>
                )}
              </div>

              <h3
                className="font-semibold text-gray-800 truncate cursor-pointer hover:underline hover:text-blue-600 transition-colors flex-1"
                onClick={() => handleStoryInfoClick(character.id)}
                title={
                  character.alias
                    ? `${character.name} (${character.alias}) - Click for Story Info`
                    : `${character.name} - Click for Story Info`
                }
              >
                {character.alias && <>{character.alias} (</>}
                {character.name}
                {character.alias && <>)</>}
              </h3>
              <div className="flex gap-1">
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBotSettingsClick(character.id);
                  }}
                  title="Bot settings"
                >
                  ⚙️
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    createNewChat(character.id);
                    setToastMessage("New chat created");
                    setValidcolor("bg-green-400/50");
                  }}
                  title="New chat"
                >
                  ➕
                </button>
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCharacterToDelete(character.id);
                    setShowDeleteCharacterModal(true);
                  }}
                  title="Delete character"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="space-y-1 ml-2">
              {character.chats.map((chat) => (
                <div
                  key={chat.id}
                  className="text-black grid grid-cols-[1fr_auto] items-center group chat-item"
                >
                  {editingChatId === chat.id ? (
                    <div className="col-span-2 flex items-center gap-1 bg-white rounded border border-gray-300 p-1">
                      <input
                        className="flex-1 min-w-0 border-none outline-none text-sm bg-transparent"
                        value={editChatName}
                        onChange={(e) => setEditChatName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveChatName();
                          if (e.key === "Escape") cancelEditChatName();
                        }}
                        autoFocus
                      />
                      <div className="flex-shrink-0 flex gap-1">
                        <button
                          className="text-green-500 hover:text-green-700 p-1"
                          onClick={saveChatName}
                          title="Save"
                          disabled={!editChatName.trim()}
                        >
                          ✅
                        </button>
                        <button
                          className="text-gray-500 hover:text-gray-700 p-1"
                          onClick={cancelEditChatName}
                          title="Cancel"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        className={`text-left p-2 rounded text-sm truncate ${
                          selectedChatId === chat.id &&
                          selectedCharacterId === character.id
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedCharacterId(character.id);
                          setSelectedChatId(chat.id);
                        }}
                      >
                        {chat.title}
                      </button>
                      <div className="flex md:opacity-50 md:group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-blue-500 hover:text-blue-700 p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingChatName(
                              character.id,
                              chat.id,
                              chat.title,
                            );
                          }}
                          title="Edit chat name"
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatToDelete({
                              characterId: character.id,
                              chatId: chat.id,
                            });
                            setShowDeleteChatModal(true);
                          }}
                          title="Delete chat"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center text-gray-400 flex flex-col gap-2 items-center">
        <Link
          href="https://forms.gle/q7BPmeVXnuoAJvkg7"
          className="text-blue-500 hover:text-blue-600 text-sm underline"
        >
          Found a bug or have a feedback?
        </Link>
        <Link
          href="/privacy"
          className="text-blue-500 hover:text-blue-600 text-sm underline"
        >
          Privacy Policy
        </Link>
        <div className="text-sm">
          storage used: {storageUsed}
          {maxStorageSize && " / " + maxStorageSize}
        </div>
      </div>
    </div>
  );
};
