import React, { useState, useEffect } from "react";
import { Character } from "./interfaces";

interface StoryContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onSave: (characterId: string, newContent: string) => void;
}

const StoryContentModal: React.FC<StoryContentModalProps> = ({
  isOpen,
  onClose,
  character,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(character.storyContent || "");

  useEffect(() => {
    setContent(character.storyContent || "");
  }, [character.storyContent]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(character.id, content);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 text-black bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl w-full max-w-4xl shadow-xl flex flex-col transition-all duration-300 ${
            // Mobile: almost full screen height, Desktop: max 80vh
            "h-[90vh] md:max-h-[80vh]" 
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            📜 Story Info: {character.name}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl px-2"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isEditing ? (
            <div className="h-full flex flex-col">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Edit HTML Content
              </label>
              <textarea
                className="flex-1 w-full border border-gray-300 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter HTML content..."
              />
              <p className="text-xs text-gray-500 mt-2">
                You can write raw HTML here. Be careful with your tags!
              </p>
            </div>
          ) : (
            <div className="prose max-w-none">
              {content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="story-content-preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 italic py-10">
                  <p>No story content available.</p>
                  <p className="text-sm mt-2">Click edit to add a book cover or description.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white rounded-b-xl">
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                  onClick={() => {
                    setIsEditing(false);
                    setContent(character.storyContent || "");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Content
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryContentModal;
