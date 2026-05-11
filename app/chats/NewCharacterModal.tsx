import React from "react";

interface NewCharacterModalProps {
  showNewCharacterModal: boolean;
  newCharacterName: string;
  newCharacterAlias: string;
  newCharacterPersonality: string;
  newCharacterScenario: string;
  newCharacterFirstMessage: string;
  tempCharacterImage: { thumbnail?: string; fullImage?: string };
  usejpg: boolean;
  setShowNewCharacterModal: (v: boolean) => void;
  setNewCharacterName: (v: string) => void;
  setNewCharacterAlias: (v: string) => void;
  setNewCharacterPersonality: (v: string) => void;
  setNewCharacterScenario: (v: string) => void;
  setNewCharacterFirstMessage: (v: string) => void;
  setTempCharacterImage: React.Dispatch<
    React.SetStateAction<{ thumbnail?: string; fullImage?: string }>
  >;
  importCharacterCard: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageUploadForNewCharacter: () => void;
  handleImageDeleteForNewCharacter: () => void;
  createNewCharacter: () => void;
}

export const NewCharacterModal = ({
  showNewCharacterModal,
  newCharacterName,
  newCharacterAlias,
  newCharacterPersonality,
  newCharacterScenario,
  newCharacterFirstMessage,
  tempCharacterImage,
  usejpg,
  setShowNewCharacterModal,
  setNewCharacterName,
  setNewCharacterAlias,
  setNewCharacterPersonality,
  setNewCharacterScenario,
  setNewCharacterFirstMessage,
  setTempCharacterImage,
  importCharacterCard,
  handleImageUploadForNewCharacter,
  handleImageDeleteForNewCharacter,
  createNewCharacter,
}: NewCharacterModalProps) => {
  if (!showNewCharacterModal) return null;

  return (
    <div
      className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowNewCharacterModal(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md max-h-[80vh] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Create New Character</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Import Section */}
          <div className="mb-6">
            <label className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
              <input
                type="file"
                accept=".json,application/json,.png,image/png"
                onChange={importCharacterCard}
                className="hidden"
                id="character-import"
              />
              📥 Import Character Card
            </label>
            <p className="text-xs text-gray-500 text-center mt-2">
              Select a JSON or Image character card file (.json, .png)
            </p>
          </div>

          <div className="space-y-4">
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Character Images
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Thumbnail Preview */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    {tempCharacterImage.thumbnail ? (
                      <img
                        src={tempCharacterImage.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No thumbnail
                      </span>
                    )}
                  </div>
                </div>

                {/* Full Image Preview */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                    {tempCharacterImage.fullImage ? (
                      <img
                        src={tempCharacterImage.fullImage}
                        alt="Full image preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No full image
                      </span>
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
                onClick={() => handleImageUploadForNewCharacter()}
              >
                Upload Image
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 w-1/2 text-white text-sm px-3 py-1 rounded m-2"
                onClick={() => handleImageDeleteForNewCharacter()}
              >
                Remove Image
              </button>
            </div>
            <div>
              {usejpg && (
                <p className="text-yellow-800 text-xs leading-tight">
                  ⚠️ This web browser does not support WebP. JPEG is used
                  instead. JPEG is heavier than WebP. Use WebP if possible.
                </p>
              )}
            </div>
            <div className="space-y-4 w-full flex flex-col justify-center">
              <p className="text-xs text-gray-500">
                Or use the URL from external sources:
              </p>
              <input
                onChange={(e) => {
                  setTempCharacterImage((prev) => ({
                    ...prev,
                    fullImage: e.target.value,
                    thumbnail: e.target.value,
                  }));
                }}
                type="text"
                value={tempCharacterImage.fullImage || ""}
                placeholder="Image URL: https://example.com/image.jpg"
                className="w-full text-sm px-3 py-1 rounded border-1 border-gray-300"
              />
              <p className="text-yellow-800 text-xs leading-tight">
                ⚠️ External images may expose your IP to third-party servers
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Character Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                placeholder="Enter character name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Alias (Optional)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newCharacterAlias}
                onChange={(e) => setNewCharacterAlias(e.target.value)}
                placeholder="e.g., Tech Expert, Artist, etc."
              />
              <p className="text-xs text-gray-500 mt-1">
                Helpful for distinguishing characters with similar names
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Personality (Optional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newCharacterPersonality}
                onChange={(e) => setNewCharacterPersonality(e.target.value)}
                placeholder="Describe the character's personality"
                rows={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Scenario (Optional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newCharacterScenario}
                onChange={(e) => setNewCharacterScenario(e.target.value)}
                placeholder="Set the initial scenario"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                First Message (Optional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2"
                value={newCharacterFirstMessage}
                onChange={(e) => setNewCharacterFirstMessage(e.target.value)}
                placeholder="Custom first message for new chats (default: Hello! I'm {{char}}, how can I help you today?)"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be the bot's first message in new chats.
              </p>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              onClick={() => setShowNewCharacterModal(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
              onClick={createNewCharacter}
              disabled={!newCharacterName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
