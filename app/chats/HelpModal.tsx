import Link from "next/link";

export default function Help({
  setShowHelp,
}: {
  setShowHelp: (value: boolean) => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              ❓ Help & Guide
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowHelp(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Keyboard Shortcuts */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                ⌨️ Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Send Message, Confirm Deletion, and Confirm Edit</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Enter
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>New Line in Input</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Shift + Enter
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Close Modals, Cancel Edit, and Unfocus Input</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    ESC
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Focus Input</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">F</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Toggle Sidebar</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">`</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Edit Latest Message</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">E</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Regenerate Latest Message</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">R</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Open Help</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">H</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Open User Settings</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">U</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Open API Settings</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">A</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Open Prompt Settings</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">P</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Create New Character</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">N</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Start New Chat with Current Character</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">C</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Delete Current Chat</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">D</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Open Current Character Settings</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">B</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Edit Current Chat Name</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">V</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Previous Regenerate</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">-</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Next Regenerate</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">=</kbd>
                </div>

                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Next Chat</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Ctrl + ↓
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Previous Chat</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Ctrl + ↑
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Next Character</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Ctrl + →
                  </kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded">
                  <span>Previous Character</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                    Ctrl + ←
                  </kbd>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3">
                💡 Shortcuts don't work when typing in text fields or inputs!
              </p>
              <p className="text-xs text-blue-600">
                💡 Arrow keys only work when multiple characters/chats exist!
              </p>
            </div>

            {/* Placeholders */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                🔤 Placeholders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <strong className="text-green-600">{`{{user}}`}</strong>
                  <p>Your name (set in User Settings)</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-green-600">{`{{char}}`}</strong>
                  <p>Character's name</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-green-600">{`{{p1}}`}</strong>
                  <p>Your subject pronoun (he/she/they)</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-green-600">{`{{p2}}`}</strong>
                  <p>Your possessive pronoun (his/her/their)</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-green-600">{`{{p3}}`}</strong>
                  <p>Your object pronoun (him/her/them)</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-3">
                💡 Placeholders work in personality, scenario, first messages,
                and system prompts!
              </p>
            </div>

            {/* Features */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                ✨ Features
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Multiple Characters:</strong> Create different AI
                    personas
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Multiple Chats:</strong> Separate conversations per
                    character
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Streaming Responses:</strong> See AI responses in
                    real-time
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Message Editing:</strong> Click ✏️ to edit any
                    message
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Regeneration:</strong> Delete AI messages to
                    regenerate
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Import Characters:</strong> Import from JSON
                    character cards
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    <strong>Custom Prompts:</strong> Full control over AI
                    behavior
                  </span>
                </div>
              </div>
            </div>

            {/* API Information */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                🔌 API Setup
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>1.</strong> Get API key from{" "}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    OpenRouter
                  </a>
                </p>
                <p>
                  <strong>2.</strong> Paste key in API Settings tab
                </p>
                <p>
                  <strong>3.</strong> Click "Validate" to verify
                </p>
                <p>
                  <strong>4.</strong> Choose your preferred AI model
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  💡 The app uses OpenRouter which supports multiple AI models
                  through a single API!
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                💡 Pro Tips
              </h3>
              <div className="space-y-2 text-sm">
                <p>• Use ← and → arrow keys to navigate between characters</p>
                <p>
                  • Use ↑ and ↓ arrow keys to navigate between chats within a
                  character
                </p>
                <p>• Press E to quickly edit your latest message</p>
                <p>• Press R to regenerate the last AI response</p>
                <p>• Press ESC to cancel editing or close modals</p>
                <p>
                  • Use keyboard shortcuts for quick navigation (H for help, U
                  for user settings, etc.)
                </p>
                <p>• Use aliases to distinguish similar character names</p>
                <p>• Import character cards for quick setup</p>
                <p>• Customize system prompts for specific AI behavior</p>
                <p>• Use placeholders to make prompts dynamic</p>
                <p>• Regenerate responses by deleting AI messages</p>
                <p>• Edit messages to fix typos or improve responses</p>
                <p>• Press ` (backtick) to quickly toggle the sidebar</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Privacy Policy
              </h3>
              <Link
                href="/privacy"
                className="w-full flex justify-center items-center bg-white hover:bg-green-100 text-green-600 hover:text-green-700 border border-green-600 py-2 rounded-lg transition-colors"
              >
                View Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
            onClick={() => setShowHelp(false)}
          >
            Got it! 👍
          </button>
        </div>
      </div>
    </div>
  );
}
