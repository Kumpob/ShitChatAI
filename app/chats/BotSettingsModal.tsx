import React from "react";
import { Character } from "./interfaces"; // adjust as needed

interface BotSettingsModalProps {
  showBotSettings: boolean;
  selectedCharacterId: string | null;
  characters: Character[];
  getCurrentCharacter: () => Character | undefined;
  displayCharacterImage: (
    id: string,
    type: "thumbnail" | "fullImage",
  ) => React.ReactNode;
  setShowBotSettings: (v: boolean) => void;
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  handleImageUpload: (characterId: string) => void;
  handleImageDelete: (characterId: string) => void;
  updateCharacterImage: (
    characterId: string,
    type: "thumbnail" | "fullImage",
    value: string,
  ) => void;
}

export const BotSettingsModal = ({
  showBotSettings,
  selectedCharacterId,
  characters,
  getCurrentCharacter,
  displayCharacterImage,
  setShowBotSettings,
  setCharacters,
  handleImageUpload,
  handleImageDelete,
  updateCharacterImage,
}: BotSettingsModalProps) => {
  if (!showBotSettings || !getCurrentCharacter()) return null;

  return (
    <div
      className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowBotSettings(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md max-h-[80vh] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">🤖 Bot Settings</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowBotSettings(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Scrollable Content */}

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">
              Character Images
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Thumbnail Preview */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  {displayCharacterImage(
                    selectedCharacterId || "",
                    "thumbnail",
                  ) || (
                    <span className="text-gray-500 text-sm">No thumbnail</span>
                  )}
                </div>
              </div>

              {/* Full Image Preview */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                  {displayCharacterImage(
                    selectedCharacterId || "",
                    "fullImage",
                  ) || (
                    <span className="text-gray-500 text-sm">No full image</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Thumbnail: ~5KB (200px), Full Image: ~75KB (1200px). Click
              thumbnail to view full image.
            </p>
          </div>
          <div className="space-y-4 w-full flex flex-row justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 w-1/2 text-white text-sm px-3 py-1 rounded m-2"
              onClick={() => handleImageUpload(selectedCharacterId || "")}
            >
              Upload Image
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 w-1/2 text-white text-sm px-3 py-1 rounded m-2"
              onClick={() => handleImageDelete(selectedCharacterId || "")}
            >
              Remove Image
            </button>
          </div>
          <div className="space-y-4 w-full flex flex-col justify-center">
            <p className="text-xs text-gray-500">
              Or use the URL from external sources:
            </p>
            <input
              onChange={(e) => {
                updateCharacterImage(
                  selectedCharacterId || "",
                  "thumbnail",
                  e.target.value,
                );
                updateCharacterImage(
                  selectedCharacterId || "",
                  "fullImage",
                  e.target.value,
                );
              }}
              type="text"
              value={getCurrentCharacter()?.fullImage || ""}
              placeholder="Image URL: https://example.com/image.jpg"
              className="w-full text-sm px-3 py-1 rounded border-1 border-gray-300"
            />
            <p className="text-yellow-800 mb-2 text-xs leading-tight">
              ⚠️ External images may expose your IP to third-party servers
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Character Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={getCurrentCharacter()?.name || ""}
                onChange={(e) => {
                  const updatedCharacters = characters.map((c) =>
                    c.id === selectedCharacterId
                      ? { ...c, name: e.target.value }
                      : c,
                  );
                  setCharacters(updatedCharacters);
                }}
                placeholder="Character name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Alias (Optional)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={getCurrentCharacter()?.alias || ""}
                onChange={(e) => {
                  const updatedCharacters = characters.map((c) =>
                    c.id === selectedCharacterId
                      ? {
                          ...c,
                          alias: e.target.value.trim() || undefined,
                        }
                      : c,
                  );
                  setCharacters(updatedCharacters);
                }}
                placeholder="e.g., Tech Expert, Artist, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Helpful for distinguishing characters with similar names
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Personality
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={getCurrentCharacter()?.personality || ""}
                onChange={(e) => {
                  const updatedCharacters = characters.map((c) =>
                    c.id === selectedCharacterId
                      ? { ...c, personality: e.target.value }
                      : c,
                  );
                  setCharacters(updatedCharacters);
                }}
                placeholder="Describe the character's personality"
                rows={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scenario</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={getCurrentCharacter()?.scenario || ""}
                onChange={(e) => {
                  const updatedCharacters = characters.map((c) =>
                    c.id === selectedCharacterId
                      ? { ...c, scenario: e.target.value }
                      : c,
                  );
                  setCharacters(updatedCharacters);
                }}
                placeholder="Set the scenario"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                First Message for New Chats
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={getCurrentCharacter()?.firstMessage || ""}
                onChange={(e) => {
                  const updatedCharacters = characters.map((c) =>
                    c.id === selectedCharacterId
                      ? { ...c, firstMessage: e.target.value }
                      : c,
                  );
                  setCharacters(updatedCharacters);
                }}
                placeholder="Custom first message for new chats (default: Hello! I'm {{char}}, how can I help you today?)"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will only affect new chats. Existing chats will keep their
                current first message.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              onClick={() => setShowBotSettings(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
              onClick={() => setShowBotSettings(false)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
