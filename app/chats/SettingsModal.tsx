import React from "react";
import { UserPreset, ApiPreset } from "./interfaces"; // adjust as needed
import Link from "next/link";
import ManagePresets from "./managePreset";

interface SettingsModalProps {
  // Visibility
  showSettings: boolean;
  settingsTab: "user" | "api" | "prompt" | "other";
  // API tab
  model: string;
  endpointUrl: string;
  apiKey: string;
  validated: boolean;
  validating: boolean;
  apiPresets: ApiPreset[];
  selectedApiPresetId: string;
  editingApiPresetId: string | null;
  editApiPresetName: string;
  editApiPresetModel: string;
  editApiPresetEndpoint: string;
  editApiPresetKey: string;
  // Prompt tab
  temperature: number;
  maxTokens: number;
  showThinking: boolean;
  thinkingEffort: "xhigh" | "high" | "medium" | "low";
  systemPrompt: string;
  sendPronouns: boolean;
  defaultprompt: string;
  defaultpromptRP: string;
  // User tab
  userName: string;
  userDescription: string;
  userPronouns: { p1: string; p2: string; p3: string };
  userThumbnail: string;
  userFullImage: string;
  userPresets: UserPreset[];
  // Storage
  maxStorageSize: string | null;
  // Setters
  setShowSettings: (v: boolean) => void;
  setSettingsTab: (v: "user" | "api" | "prompt" | "other") => void;
  setModel: (v: string) => void;
  setEndpointUrl: (v: string) => void;
  setApiKey: (v: string) => void;
  setValidated: (v: boolean) => void;
  setSelectedApiPresetId: (v: string) => void;
  setEditingApiPresetId: (v: string | null) => void;
  setEditApiPresetName: (v: string) => void;
  setEditApiPresetModel: (v: string) => void;
  setEditApiPresetEndpoint: (v: string) => void;
  setEditApiPresetKey: (v: string) => void;
  setTemperature: (v: number) => void;
  setMaxTokens: (v: number) => void;
  setShowThinking: React.Dispatch<React.SetStateAction<boolean>>;
  setThinkingEffort: React.Dispatch<
    React.SetStateAction<"xhigh" | "high" | "medium" | "low">
  >;
  setMaxStorageSize: React.Dispatch<React.SetStateAction<string>>;
  setSystemPrompt: (v: string) => void;
  setSendPronouns: (v: boolean) => void;
  setUserName: (v: string) => void;
  setUserDescription: (v: string) => void;
  setUserPronouns: (v: { p1: string; p2: string; p3: string }) => void;
  setUserThumbnail: (v: string) => void;
  setUserFullImage: (v: string) => void;
  setUserPresets: React.Dispatch<React.SetStateAction<UserPreset[]>>;
  // Handlers
  validateApibutton: () => void;
  loadApiPreset: (id: string) => void;
  saveApiPreset: () => void;
  deleteApiPreset: (id: string) => void;
  saveEditApiPreset: () => void;
  resetApiSettings: () => void;
  resetPromptSettings: () => void;
  resetNames: () => void;
  clearChat: () => void;
  handleUserImageUpload: () => void;
  displayUserImage: (type: "thumbnail" | "fullImage") => React.ReactNode;
  handlePresetDelete: (id: string) => void;
  loadUserPreset: (preset: UserPreset) => void;
  saveUserPreset: () => void;
  estimateLocalStorageMaxSize: () => Promise<string>;
}

export const SettingsModal = ({
  showSettings,
  settingsTab,
  model,
  endpointUrl,
  apiKey,
  validated,
  validating,
  apiPresets,
  selectedApiPresetId,
  editingApiPresetId,
  editApiPresetName,
  editApiPresetModel,
  editApiPresetEndpoint,
  editApiPresetKey,
  temperature,
  maxTokens,
  showThinking,
  thinkingEffort,
  systemPrompt,
  sendPronouns,
  defaultprompt,
  defaultpromptRP,
  userName,
  userDescription,
  userPronouns,
  userThumbnail,
  userFullImage,
  userPresets,
  maxStorageSize,
  setShowSettings,
  setSettingsTab,
  setModel,
  setEndpointUrl,
  setApiKey,
  setValidated,
  setSelectedApiPresetId,
  setEditingApiPresetId,
  setEditApiPresetName,
  setEditApiPresetModel,
  setEditApiPresetEndpoint,
  setEditApiPresetKey,
  setTemperature,
  setMaxTokens,
  setShowThinking,
  setThinkingEffort,
  setSystemPrompt,
  setSendPronouns,
  setUserName,
  setUserDescription,
  setUserPronouns,
  setUserThumbnail,
  setUserFullImage,
  setUserPresets,
  setMaxStorageSize,
  validateApibutton,
  loadApiPreset,
  saveApiPreset,
  deleteApiPreset,
  saveEditApiPreset,
  resetApiSettings,
  resetPromptSettings,
  resetNames,
  clearChat,
  handleUserImageUpload,
  displayUserImage,
  handlePresetDelete,
  loadUserPreset,
  saveUserPreset,
  estimateLocalStorageMaxSize,
}: SettingsModalProps) => {
  if (!showSettings) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowSettings(false)}
    >
      <div
        className="bg-white text-black rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tabs - Always visible */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">⚙️ Settings</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowSettings(false)}
            >
              &times;
            </button>
          </div>

          {/* Tabs - Always visible */}
          <div className="flex border-b border-gray-200 px-6">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                settingsTab === "user"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSettingsTab("user")}
            >
              👤 User
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                settingsTab === "api"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSettingsTab("api")}
            >
              🔑 API
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                settingsTab === "prompt"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSettingsTab("prompt")}
            >
              📝 Prompt
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                settingsTab === "other"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setSettingsTab("other")}
            >
              🌟 Other
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* API Settings Tab */}
            {settingsTab === "api" && (
              <>
                {/* Preset Dropdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    📦 API Presets
                  </h3>
                  {apiPresets.length === 0 ? (
                    <p className="text-xs text-gray-400">
                      No presets saved yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={selectedApiPresetId}
                        onChange={(e) => loadApiPreset(e.target.value)}
                      >
                        <option value="">— Select a preset —</option>
                        {apiPresets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      {/* Edit / Delete buttons for selected preset */}
                      {selectedApiPresetId && (
                        <div className="flex gap-2">
                          {editingApiPresetId === selectedApiPresetId ? (
                            <div className="space-y-2">
                              <input
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={editApiPresetName}
                                onChange={(e) =>
                                  setEditApiPresetName(e.target.value)
                                }
                                placeholder="Preset name"
                              />
                              <input
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={editApiPresetModel}
                                onChange={(e) =>
                                  setEditApiPresetModel(e.target.value)
                                }
                                placeholder="Model (e.g. deepseek/deepseek-r1)"
                              />
                              <input
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={editApiPresetEndpoint}
                                onChange={(e) =>
                                  setEditApiPresetEndpoint(e.target.value)
                                }
                                placeholder="Endpoint URL"
                              />
                              <input
                                type="password"
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                value={editApiPresetKey}
                                onChange={(e) =>
                                  setEditApiPresetKey(e.target.value)
                                }
                                placeholder="API Key"
                              />
                              <div className="flex gap-2">
                                <button
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                                  onClick={saveEditApiPreset}
                                >
                                  ✅ Save
                                </button>
                                <button
                                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm"
                                  onClick={() => {
                                    setEditingApiPresetId(null);
                                    setEditApiPresetName("");
                                    setEditApiPresetModel("");
                                    setEditApiPresetEndpoint("");
                                    setEditApiPresetKey("");
                                  }}
                                >
                                  ❌ Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg text-sm transition-colors"
                                onClick={() => {
                                  const preset = apiPresets.find(
                                    (p) => p.id === selectedApiPresetId,
                                  );
                                  if (preset) {
                                    setEditingApiPresetId(preset.id);
                                    setEditApiPresetName(preset.name);
                                    setEditApiPresetModel(preset.model);
                                    setEditApiPresetEndpoint(
                                      preset.endpointUrl,
                                    );
                                    setEditApiPresetKey(preset.apiKey);
                                  }
                                }}
                              >
                                ✏️ Edit Preset
                              </button>
                              <button
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm transition-colors"
                                onClick={() =>
                                  deleteApiPreset(selectedApiPresetId)
                                }
                              >
                                🗑️ Delete Preset
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🤖 AI Model
                  </h3>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={model}
                    onChange={(e) => {
                      setModel(e.target.value);
                      setSelectedApiPresetId("");
                    }}
                    placeholder="e.g. deepseek/deepseek-v4-flash"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Choose which AI model to use for responses
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🌐 Endpoint URL
                  </h3>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={endpointUrl}
                    onChange={(e) => {
                      setEndpointUrl(e.target.value);
                      setSelectedApiPresetId("");
                    }}
                    placeholder="e.g. https://openrouter.ai/api/v1/chat/completions"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    The URL of the API endpoint to use for chat completions
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🔑 API Key
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setValidated(false);
                        setSelectedApiPresetId("");
                      }}
                      placeholder="Enter your API key"
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                      onClick={validateApibutton}
                    >
                      {validating ? "Validating..." : "Validate"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your API key is stored locally and never sent to any server
                    except your API endpoint when validating or sending
                    messages.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">API keys:</p>
                  <p className="text-xs text-blue-500 mt-1">
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Get your API key from OpenRouter
                    </a>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Get your API key from OpenAI
                    </a>
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    <a
                      href="https://platform.deepseek.com/api_keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Get your API key from Deepseek
                    </a>
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    ℹ️ API Information
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Current model: {model}</p>
                    <p>
                      • API key:{" "}
                      {validated
                        ? "✓ Validated"
                        : apiKey
                          ? "❌ Not validated"
                          : "❌ Not configured"}
                    </p>
                    <div className="text-xs text-blue-500 mt-1 space-y-1">
                      • Endpoint:
                      {endpointUrl ? <p>{endpointUrl}</p> : "❌ Not configured"}
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  onClick={saveApiPreset}
                >
                  💾 Save Current as Preset
                </button>
                <button
                  className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  onClick={resetApiSettings}
                >
                  🔄 Reset API Settings
                </button>
              </>
            )}

            {settingsTab === "prompt" && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🌡️ Temperature
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>More Focused</span>
                      <span>{temperature.toFixed(2)}</span>
                      <span>More Creative</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Lower values = more focused/deterministic, Higher values =
                      more creative/random
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    📏 Max Tokens
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="4096"
                      step="128"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Short Responses</span>
                      <span>{maxTokens} tokens</span>
                      <span>Long Responses</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Maximum length of AI responses (
                      {maxTokens === 0
                        ? "unlimited"
                        : "approx. " + Math.round(maxTokens / 4) + " words"}
                      )
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Setting this to 0 means that the AI will use the maximum
                      response length supported by the model.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        🧠 Show Thinking
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Only works with reasoning models (e.g. deepseek-v4)
                      </p>
                    </div>
                    <button
                      onClick={() => setShowThinking((prev) => !prev)}
                      className={`px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                        showThinking
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-400 hover:bg-gray-500"
                      }`}
                    >
                      {showThinking ? "ON" : "OFF"}
                    </button>
                  </div>
                  {showThinking && (
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">
                        🧠 Thinking Effort
                      </h3>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={thinkingEffort}
                        onChange={(e) =>
                          setThinkingEffort(
                            e.target.value as typeof thinkingEffort,
                          )
                        }
                        disabled={!showThinking}
                      >
                        <option value="xhigh">X-High</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Only applies when thinking is enabled. Higher effort =
                        more tokens used.
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🧑 Send Pronouns?
                  </h3>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Send your pronouns to the AI.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSendPronouns(!sendPronouns)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        sendPronouns ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      role="switch"
                      aria-checked={sendPronouns}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          sendPronouns ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Turn off if it affects grammar corrections.
                  </p>
                  <p className="text-xs text-gray-600">
                     Will still replace shorthands with pronouns.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    📝 System Prompt
                  </h3>
                  <textarea
                    className="w-full h-48 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Enter the system prompt for the AI..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {
                      "This is the base instruction set for the AI. Use {{char}} for character name and {{user}} for your name."
                    }
                  </p>
                  <div className="text-xs text-blue-500 mt-1 space-y-1">
                    <p>
                      {
                        "• Available placeholders: {{char}}, {{user}}, {{p1}}, {{sub}}, {{p2}}, {{poss}}, {{p3}}, {{obj}}"
                      }
                    </p>
                    <p>{"• {{char}} = Character name, {{user}} = Your name"}</p>
                    <p>
                      {
                        "• {{p1}}, {{sub}} = Subject pronoun, {{p2}}, {{poss}} = Possessive, {{p3}}, {{obj}} = Object pronoun"
                      }
                    </p>
                    <p>
                      {
                        "• Works with 1 or 2 curly braces — {{user}} and {user} both work"
                      }
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setSystemPrompt(defaultprompt)}
                  >
                    🔄 Use Default Assistance Prompt
                  </button>
                  <button
                    className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={() => setSystemPrompt(defaultpromptRP)}
                  >
                    🔄 Use Default Roleplay Prompt
                  </button>
                </div>
                <button
                  className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors mt-4"
                  onClick={resetPromptSettings}
                >
                  🔄 Reset Prompt Settings
                </button>
              </>
            )}

            {settingsTab === "other" && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Privacy Policy
                  </h3>
                  <Link
                    href="/privacy"
                    className="w-full flex justify-center items-center bg-white hover:bg-green-100 text-green-600 hover:text-green-700 border border-green-600 py-2 rounded-lg transition-colors"
                  >
                    View Privacy Policy
                  </Link>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">
                    🗑️ Withdraw Consent
                  </h3>
                  <p className="text-red-700 text-sm mb-3">
                    You can withdraw your consent and delete all data at any
                    time:
                  </p>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Clear All Data & Reset Consent
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    📦 Get Max Storage
                  </h3>
                  <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                    onClick={async () =>
                      setMaxStorageSize(await estimateLocalStorageMaxSize())
                    }
                  >
                    Get Max Storage Size
                  </button>
                </div>
              </>
            )}

            {settingsTab === "user" && (
              <>
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Character Images
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Thumbnail Preview */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                        {userThumbnail === "" ? (
                          <span className="text-gray-500 text-sm">
                            No thumbnail
                          </span>
                        ) : (
                          displayUserImage("thumbnail")
                        )}
                      </div>
                    </div>

                    {/* Full Image Preview */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                        {userFullImage === "" ? (
                          <span className="text-gray-500 text-sm">
                            No full image
                          </span>
                        ) : (
                          displayUserImage("fullImage")
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
                    onClick={() => handleUserImageUpload()}
                  >
                    Upload Image
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 w-1/2 text-white text-sm px-3 py-1 rounded m-2"
                    onClick={() => {
                      setUserThumbnail("");
                      setUserFullImage("");
                    }}
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
                      setUserFullImage(e.target.value);
                      setUserThumbnail(e.target.value);
                    }}
                    type="text"
                    value={userFullImage || ""}
                    placeholder="Image URL: https://example.com/image.jpg"
                    className="w-full text-sm px-3 py-1 rounded border-1 border-gray-300"
                  />
                  <p className="text-yellow-800 text-xs leading-tight">
                    ⚠️ External images may expose your IP to third-party servers
                  </p>
                </div>
                <div className="px-4">
                  {/* Load Presets:
                        <select
                          value={selectedPresetId}
                          onChange={handlePresetChange}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={defaultPreset.id}>Default</option>
                          {userPresets.map((preset) => (
                            <option key={preset.id} value={preset.id}>
                              {preset.name}
                            </option>
                          ))}
                        </select> */}
                  <ManagePresets
                    userPresets={userPresets}
                    setUserPresets={setUserPresets}
                    handlePresetDelete={handlePresetDelete}
                    loadUserPreset={loadUserPreset}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700">
                      👤 Your Name
                    </h3>
                  </div>
                  <input
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    📝 Your Description
                  </h3>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={userDescription}
                    onChange={(e) => setUserDescription(e.target.value)}
                    placeholder="Describe yourself for the AI..."
                    rows={3}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    🗣️ Your Pronouns
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        {"Subject ({{p1}})"}
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={userPronouns.p1}
                        onChange={(e) =>
                          setUserPronouns({
                            ...userPronouns,
                            p1: e.target.value,
                          })
                        }
                        placeholder="he/she/they"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        {"Possessive ({{p2}})"}
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={userPronouns.p2}
                        onChange={(e) =>
                          setUserPronouns({
                            ...userPronouns,
                            p2: e.target.value,
                          })
                        }
                        placeholder="his/her/their"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 font-medium">
                        {"Object ({{p3}})"}
                      </label>
                      <input
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={userPronouns.p3}
                        onChange={(e) =>
                          setUserPronouns({
                            ...userPronouns,
                            p3: e.target.value,
                          })
                        }
                        placeholder="him/her/them"
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={saveUserPreset}
                >
                  Save User Settings
                </button>
                <button
                  className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  onClick={resetNames}
                >
                  🔄 Reset User Settings
                </button>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons - Always visible at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex justify-between gap-3">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 flex-1 justify-center"
              onClick={clearChat}
            >
              🗑️ Clear Chat
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 flex-1 justify-center"
              onClick={() => setShowSettings(false)}
            >
              ✅ Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
