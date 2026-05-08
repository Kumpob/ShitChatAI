"use client";

import React, { useState, useEffect, useRef, JSX } from "react";
import { marked } from "marked";
import CustomToast from "./CustomToast";
import { Chat, Character, Message, UserPreset } from "./interfaces";
import Help from "./HelpModal";
import StoryContentModal from "./StoryContentModal";
import ConfirmModal from "./ConfirmModal";
import Link from "next/link";
import ManagePresets from "./managePreset";
import { defaultpromptRPx, defaultpromptx } from "./prompt";
import { estimateLocalStorageMaxSize, getLocalStorageUsage } from "./getsize";
import {
  selectImageFile,
  processImage,
  checkWebPSupport,
  loadImage,
  calculateDimensions,
  optimizeToTargetSize,
  estimateBase64Size,
} from "./imageUtils";

export default function AIChatRoom() {
  // State management
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  // Check consent only on client side
  useEffect(() => {
    const hasConsent = localStorage.getItem("storage-consent") === "true";
    setConsentGiven(hasConsent);
  }, []);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null,
  );
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [userName, setUserName] = useState<string>("You");
  const [userDescription, setUserDescription] = useState<string>("");
  const [userPronouns, setUserPronouns] = useState({
    p1: "he",
    p2: "his",
    p3: "him",
  });
  const [userThumbnail, setUserThumbnail] = useState<string>("");
  const [userFullImage, setUserFullImage] = useState<string>("");
  const [userPresets, setUserPresets] = useState<UserPreset[]>([]);
  // const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
  //   undefined
  // );
  // const [defaultPreset, setDefaultPreset] = useState<UserPreset>({
  //   id: "default",
  //   name: "You",
  //   description: "",
  //   thumbnail: "",
  //   fullImage: "",
  //   p1: "he",
  //   p2: "his",
  //   p3: "him",
  // });
  // const [showPresetList, setShowPresetList] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editWidth, setEditWidth] = useState<string>("100%");

  const [showHelp, setShowHelp] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showNewCharacterModal, setShowNewCharacterModal] =
    useState<boolean>(false);
  const [newCharacterName, setNewCharacterName] = useState<string>("");
  const [newCharacterPersonality, setNewCharacterPersonality] =
    useState<string>("");
  const [newCharacterStoryContent, setNewCharacterStoryContent] =
    useState<string>("");
  const [newCharacterAlias, setNewCharacterAlias] = useState<string>("");
  const [newCharacterScenario, setNewCharacterScenario] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<
    "api" | "user" | "prompt" | "other"
  >("user");
  const [model, setModel] = useState<string>("deepseek/deepseek-v3.2");
  const [endpointUrl, setEndpointUrl] = useState<string>(
    "https://openrouter.ai/api/v1/chat/completions",
  );
  const [apiKey, setApiKey] = useState<string>("");

  const [apiPresets, setApiPresets] = useState<
    {
      id: string;
      name: string;
      model: string;
      endpointUrl: string;
      apiKey: string;
    }[]
  >([]);
  const [selectedApiPresetId, setSelectedApiPresetId] = useState<string>("");
  const [editingApiPresetId, setEditingApiPresetId] = useState<string | null>(
    null,
  );
  const [editApiPresetName, setEditApiPresetName] = useState<string>("");
  const [editApiPresetModel, setEditApiPresetModel] = useState<string>("");
  const [editApiPresetEndpoint, setEditApiPresetEndpoint] =
    useState<string>("");
  const [editApiPresetKey, setEditApiPresetKey] = useState<string>("");

  const [showBotSettings, setShowBotSettings] = useState<boolean>(false);
  const [showStoryModal, setShowStoryModal] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editChatName, setEditChatName] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [validcolor, setValidcolor] = useState("");
  const [validated, setValidated] = useState(false);
  const [importData, setImportData] = useState<string>("");
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null,
  );

  const [temperature, setTemperature] = useState<number>(0.75);
  const [maxTokens, setMaxTokens] = useState<number>(2048);

  const [maxStorageSize, setMaxStorageSize] = useState<string>("");
  const [storageUsed, setStorageUsed] = useState<string>("");

  const [usejpg, setUsejpg] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState("");
  const defaultprompt = defaultpromptx;
  const defaultpromptRP = defaultpromptRPx;
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingEffort, setThinkingEffort] = useState<
    "xhigh" | "high" | "medium" | "low"
  >("low");
  const [showDeleteCharacterModal, setShowDeleteCharacterModal] =
    useState<boolean>(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(
    null,
  );
  const [tempCharacterImage, setTempCharacterImage] = useState<{
    thumbnail?: string;
    fullImage?: string;
  }>({});
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);

  const [showDeleteChatModal, setShowDeleteChatModal] =
    useState<boolean>(false);
  const [chatToDelete, setChatToDelete] = useState<{
    characterId: string;
    chatId: string;
  } | null>(null);
  const [newCharacterFirstMessage, setNewCharacterFirstMessage] =
    useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (scrollContainerRef.current) {
      requestAnimationFrame(() => {
        scrollContainerRef.current!.scrollTop =
          scrollContainerRef.current!.scrollHeight;
      });
    }
  }, [messages]);

  // Handle virtual keyboard on mobile devices
  useEffect(() => {
    const handleFocus = () => {
      if (inputContainerRef.current) {
        setTimeout(() => {
          inputContainerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
      }
    };

    const handleVirtualKeyboardShow = () => {
      if (inputContainerRef.current) {
        inputContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    const textarea = document.getElementById(
      "messageInput",
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener("focus", handleFocus);
      window.addEventListener("resize", handleVirtualKeyboardShow);

      return () => {
        textarea.removeEventListener("focus", handleFocus);
        window.removeEventListener("resize", handleVirtualKeyboardShow);
      };
    }
  }, []);

  const isQuotaExceeded = (e: unknown) => {
    if (!e || typeof e !== "object") return false;
    const err = e as DOMException;
    return (
      err.name === "QuotaExceededError" ||
      err.name === "NS_ERROR_DOM_QUOTA_REACHED"
    );
  };

  // Load data from localStorage
  useEffect(() => {
    const savedCharacters = localStorage.getItem("chatCharacters");
    const savedUserName = localStorage.getItem("chatUserName");
    const savedUserDescription = localStorage.getItem("chatUserDescription");
    const savedUserPronouns = localStorage.getItem("chatUserPronouns");
    const savedModel = localStorage.getItem("chatModel");
    const savedEndpointUrl = localStorage.getItem("chatEndpointUrl");
    const savedApiKey = localStorage.getItem("chatApiKey");
    const savedApiPresets = localStorage.getItem("chatApiPresets");

    const savedvalidated = localStorage.getItem("chatValidated");
    const savedSystemPrompt = localStorage.getItem("chatSystemPrompt");
    const savedshowthinking = localStorage.getItem("chatShowThinking");
    const savedThinkingEffort = localStorage.getItem("chatThinkingEffort");

    const savedTemperature = localStorage.getItem("chatTemperature");
    const savedMaxTokens = localStorage.getItem("chatMaxTokens");
    const userThumbnail = localStorage.getItem("chatUserThumbnail");
    const userFullImage = localStorage.getItem("chatUserFullImage");
    const savedUserPresets = localStorage.getItem("chatUserPresets");

    if (savedCharacters) {
      const parsedCharacters = JSON.parse(savedCharacters);
      setCharacters(parsedCharacters);

      // Select first character and chat if available
      if (parsedCharacters.length > 0) {
        let foundSaved = false;
        const lastActiveChat = localStorage.getItem("lastActiveChat");

        if (lastActiveChat) {
          try {
            const { characterId, chatId } = JSON.parse(lastActiveChat);
            const savedChar = parsedCharacters.find(
              (c: Character) => c.id === characterId,
            );
            if (savedChar) {
              const savedChat = savedChar.chats.find(
                (c: Chat) => c.id === chatId,
              );
              if (savedChat) {
                setSelectedCharacterId(characterId);
                setSelectedChatId(chatId);
                setMessages(savedChat.messages);
                foundSaved = true;
              }
            }
          } catch (e) {
            console.error("Error parsing lastActiveChat", e);
          }
        }

        if (!foundSaved) {
          setSelectedCharacterId(parsedCharacters[0].id);
          if (parsedCharacters[0].chats.length > 0) {
            setSelectedChatId(parsedCharacters[0].chats[0].id);
            setMessages(parsedCharacters[0].chats[0].messages);
          }
        }
      }
    } else {
      // Create default character and chat if none exist
      const defaultCharacter: Character = {
        id: "default",
        name: "AI",
        personality: "",
        scenario: "",
        firstMessage: "Hello {{user}}! I'm {{char}}, how can I help you today?",
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

    if (savedUserName) setUserName(savedUserName);
    if (savedUserDescription) setUserDescription(savedUserDescription);
    if (savedUserPronouns) setUserPronouns(JSON.parse(savedUserPronouns));
    if (savedModel) setModel(savedModel);
    if (savedEndpointUrl) setEndpointUrl(savedEndpointUrl);
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedApiPresets) setApiPresets(JSON.parse(savedApiPresets));

    if (savedvalidated) setValidated(JSON.parse(savedvalidated));
    if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);
    if (savedshowthinking) setShowThinking(savedshowthinking === "true");
    if (savedThinkingEffort)
      setThinkingEffort(
        savedThinkingEffort as "xhigh" | "high" | "medium" | "low",
      );

    if (savedTemperature) setTemperature(parseFloat(savedTemperature));
    if (savedMaxTokens) setMaxTokens(parseInt(savedMaxTokens));
    if (userThumbnail) setUserThumbnail(userThumbnail);
    if (userFullImage) setUserFullImage(userFullImage);
    if (savedUserPresets) setUserPresets(JSON.parse(savedUserPresets));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("chatCharacters", JSON.stringify(characters));
      localStorage.setItem("chatUserName", userName);
      localStorage.setItem("chatUserDescription", userDescription);
      localStorage.setItem("chatUserPronouns", JSON.stringify(userPronouns));
      localStorage.setItem("chatModel", model);
      localStorage.setItem("chatEndpointUrl", endpointUrl);
      localStorage.setItem("chatApiKey", apiKey);
      localStorage.setItem("chatApiPresets", JSON.stringify(apiPresets));

      localStorage.setItem("chatValidated", JSON.stringify(validated));
      localStorage.setItem("chatSystemPrompt", systemPrompt);
      localStorage.setItem("chatShowThinking", showThinking.toString());
      localStorage.setItem("chatThinkingEffort", thinkingEffort);

      localStorage.setItem("chatTemperature", temperature.toString());
      localStorage.setItem("chatMaxTokens", maxTokens.toString());
      localStorage.setItem("chatUserThumbnail", userThumbnail);
      localStorage.setItem("chatUserFullImage", userFullImage);
      localStorage.setItem("chatUserPresets", JSON.stringify(userPresets));

      if (selectedCharacterId && selectedChatId) {
        localStorage.setItem(
          "lastActiveChat",
          JSON.stringify({
            characterId: selectedCharacterId,
            chatId: selectedChatId,
          }),
        );
      }

      setStorageUsed(getLocalStorageUsage());
    } catch (e) {
      if (isQuotaExceeded(e)) {
        console.error("LocalStorage quota exceeded", e);
        alert(
          "Storage is full on this device. This action will not be saved. Please try removing the image.",
        );

        // Optionally: stop trying to save images after this
      } else {
        console.error("Unexpected localStorage error", e);
        alert("Unexpected storage error: " + (e as any).name);
      }
    }
  }, [
    characters,
    userName,
    userDescription,
    userPronouns,
    model,
    endpointUrl,
    apiKey,
    validated,
    systemPrompt,
    showThinking,
    temperature,
    maxTokens,
    userThumbnail,
    userFullImage,
    userPresets,
  ]);

  useEffect(() => {
    // This runs only on the client
    if (typeof window !== "undefined") {
      setStorageUsed(getLocalStorageUsage());
    }
  }, []);

  // Update messages when chat changes
  useEffect(() => {
    if (selectedCharacterId && selectedChatId) {
      const character = characters.find((c) => c.id === selectedCharacterId);
      const chat = character?.chats.find((c) => c.id === selectedChatId);
      if (chat) {
        setMessages(chat.messages);
      }
    }
  }, [selectedCharacterId, selectedChatId, characters]);

  // Auto-resize textarea when editing
  useEffect(() => {
    if (editingIndex !== null && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      const charCount = editText.length;
      let width = "100%";

      if (charCount < 50) width = "16rem";
      else if (charCount < 100) width = "20rem";
      else if (charCount < 200) width = "24rem";
      else width = "28rem";

      setEditWidth(width);
    }
  }, [editText, editingIndex]);

  // Get current character and chat
  const getCurrentCharacter = () =>
    characters.find((c) => c.id === selectedCharacterId);
  const getCurrentChat = () => {
    const character = getCurrentCharacter();
    return character?.chats.find((c) => c.id === selectedChatId);
  };

  const createNewChat = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    const firstMessage =
      character.firstMessage ||
      `Hello ${userName}! I'm ${character.name}, how can I help you today?`;

    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${character.chats.length + 1}`,
      messages: [
        {
          sender: "ai",
          text: firstMessage,
        },
      ],
      lastActive: Date.now(),
    };

    const updatedCharacters = characters.map((c) =>
      c.id === characterId ? { ...c, chats: [...c.chats, newChat] } : c,
    );

    setCharacters(updatedCharacters);
    setSelectedCharacterId(characterId);
    setSelectedChatId(newChat.id);
    setMessages(newChat.messages);
  };

  const branchChat = (messageIndex: number) => {
    const character = getCurrentCharacter();
    const currentChat = getCurrentChat();
    if (!character || !currentChat) return;

    // Get messages up to the click point
    const branchedMessages = messages.slice(0, messageIndex + 1);

    // Determine new title
    const baseTitle = `branch: ${currentChat.title}`;
    let newTitle = `${baseTitle} (1)`;
    let counter = 1;

    // Check for existing duplicates
    const regex = new RegExp(
      `^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\((\\d+)\\)$`,
    );

    // Find the highest number used so far
    character.chats.forEach((c) => {
      const match = c.title.match(regex);
      if (match) {
        const num = parseInt(match[1]);
        if (num >= counter) {
          counter = num + 1;
        }
      }
    });

    // If "branch: Original Name (1)" doesn't exist yet, we can simple check if the base title itself exists?
    // The requirement says "branch: [that room name] (number duplicate)"
    // Let's stick to the counter logic.
    newTitle = `${baseTitle} (${counter})`;

    const newChat: Chat = {
      id: Date.now().toString(),
      title: newTitle,
      messages: JSON.parse(JSON.stringify(branchedMessages)), // Deep copy
      lastActive: Date.now(),
    };

    const updatedCharacters = characters.map((c) =>
      c.id === character.id ? { ...c, chats: [...c.chats, newChat] } : c,
    );

    setCharacters(updatedCharacters);
    setSelectedChatId(newChat.id);
    setMessages(newChat.messages);
    setToastMessage("Chat branched successfully!");
  };

  const handleBotSettingsClick = (characterId: string) => {
    setSelectedCharacterId(characterId);
    const character = characters.find((c) => c.id === characterId);
    if (character && character.chats.length > 0) {
      setSelectedChatId(character.chats[0].id);
      setMessages(character.chats[0].messages);
    }
    setShowBotSettings(true);
  };

  const handleStoryInfoClick = (characterId: string) => {
    setSelectedCharacterId(characterId);
    const character = characters.find((c) => c.id === characterId);
    if (
      character &&
      character.chats.length > 0 &&
      selectedCharacterId !== characterId
    ) {
      setSelectedChatId(character.chats[0].id);
      setMessages(character.chats[0].messages);
    }
    setShowStoryModal(true);
  };

  const startEditing = (index: number, text: string) => {
    setEditingIndex(index);
    setEditText(text);

    const charCount = text.length;
    let width = "100%";
    if (charCount < 50) width = "16rem";
    else if (charCount < 100) width = "20rem";
    else if (charCount < 200) width = "24rem";
    else width = "28rem";

    setEditWidth(width);
  };

  const saveEdit = () => {
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

  const handleUserImageUpload = async (): Promise<void> => {
    try {
      const file = await selectImageFile();
      if (!file) return;

      const thumbnailBase64 = await processImage(file, 5, 200, (isWebP) =>
        setUsejpg(!isWebP),
      );
      updateUserImage("thumbnail", thumbnailBase64);
      const fullImageBase64 = await processImage(file, 75, 1200, (isWebP) =>
        setUsejpg(!isWebP),
      );
      updateUserImage("fullImage", fullImageBase64);

      setToastMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      setToastMessage("Error uploading image");
    }
  };

  const updateUserImage = (
    imageType: "thumbnail" | "fullImage",
    base64Data: string,
  ): void => {
    if (imageType === "thumbnail") {
      setUserThumbnail(base64Data);
    } else {
      setUserFullImage(base64Data);
    }
  };

  // Add these helper functions to your component

  /**
   * Main function to handle image upload and processing
   */
  const handleImageUpload = async (characterId: string): Promise<void> => {
    try {
      const file = await selectImageFile();
      if (!file) return;

      const thumbnailBase64 = await processImage(file, 5, 200, (isWebP) =>
        setUsejpg(!isWebP),
      );
      updateCharacterImage(characterId, "thumbnail", thumbnailBase64);
      const fullImageBase64 = await processImage(file, 75, 1200, (isWebP) =>
        setUsejpg(!isWebP),
      );
      updateCharacterImage(characterId, "fullImage", fullImageBase64);

      setToastMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      setToastMessage("Error uploading image");
    }
  };

  const handleImageDelete = (characterId: string): void => {
    updateCharacterImage(characterId, "thumbnail", "");
    updateCharacterImage(characterId, "fullImage", "");
  };

  const handleImageUploadForNewCharacter = async (): Promise<void> => {
    try {
      const file = await selectImageFile();
      if (!file) return;

      const imageBase64Thumb = await processImage(file, 5, 200, (isWebP) =>
        setUsejpg(!isWebP),
      );
      const imageBase64Full = await processImage(file, 75, 1200, (isWebP) =>
        setUsejpg(!isWebP),
      );

      setTempCharacterImage((prev) => ({
        ...prev,
        ["thumbnail"]: imageBase64Thumb,
        ["fullImage"]: imageBase64Full,
      }));

      setToastMessage(`Image uploaded successfully!`);
    } catch (error) {
      console.error("Error processing image:", error);
      setToastMessage("Error uploading image");
    }
  };

  const handleImageDeleteForNewCharacter = (): void => {
    setTempCharacterImage((prev) => ({
      ...prev,
      ["thumbnail"]: "",
      ["fullImage"]: "",
    }));
  };

  /**
   * Update character with new image
   */
  const updateCharacterImage = (
    characterId: string,
    imageType: "thumbnail" | "fullImage",
    base64Data: string,
  ): void => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === characterId
          ? { ...character, [imageType]: base64Data }
          : character,
      ),
    );
  };

  /**
   * Display character image
   */
  const displayCharacterImage = (
    characterId: string,
    type: "thumbnail" | "fullImage" = "thumbnail",
  ): JSX.Element | null => {
    const character = characters.find((c) => c.id === characterId);
    if (!character || !character[type]) return null;

    return (
      <img
        src={character[type]}
        alt={character.name}
        className="w-full h-full object-cover rounded-lg"
        onClick={() => type === "thumbnail" && showFullImage(characterId)}
      />
    );
  };

  const displayUserImage = (
    type: "thumbnail" | "fullImage" = "thumbnail",
  ): JSX.Element | null => {
    return (
      <img
        src={type === "thumbnail" ? userThumbnail : userFullImage}
        alt={userName}
        className="w-full h-full object-cover rounded-lg"
        onClick={() => type === "thumbnail" && showFullImage(userFullImage)}
      />
    );
  };

  /**
   * Show full image in modal
   */
  const showFullImage = (characterId: string): void => {
    const character = characters.find((c) => c.id === characterId);
    if (!character || !character.fullImage) return;

    // You can implement a modal here to show the full image
    // For simplicity, we'll just use a basic alert with the image
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = character.fullImage;
    img.alt = character.name;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "12px";

    modal.appendChild(img);
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
  };

  const ShowUserFullPic = (): void => {
    // You can implement a modal here to show the full image
    // For simplicity, we'll just use a basic alert with the image
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = userFullImage;
    img.alt = userName;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.objectFit = "contain";
    img.style.borderRadius = "12px";

    modal.appendChild(img);
    modal.onclick = () => document.body.removeChild(modal);
    document.body.appendChild(modal);
  };

  const importCharacterCardFromPNG = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes("png")) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) return;

        // Extract metadata from PNG
        const textDecoder = new TextDecoder("utf-8");
        const latin1Decoder = new TextDecoder("latin1"); // For text content
        const dataView = new DataView(arrayBuffer);

        // PNG signature check (first 8 bytes)
        const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
        for (let i = 0; i < 8; i++) {
          if (dataView.getUint8(i) !== pngSignature[i]) {
            throw new Error("Not a valid PNG file");
          }
        }

        // Look for tEXt chunks that contain character data
        let offset = 8;
        let characterData: any = null;

        while (offset < dataView.byteLength) {
          const length = dataView.getUint32(offset);
          offset += 4;

          const chunkType = textDecoder.decode(
            new Uint8Array(arrayBuffer, offset, 4),
          );
          offset += 4;

          if (chunkType === "tEXt") {
            const keywordData = new Uint8Array(arrayBuffer, offset, 80); // Read first 80 bytes for keyword
            let keywordEnd = 0;
            while (
              keywordEnd < keywordData.length &&
              keywordData[keywordEnd] !== 0
            ) {
              keywordEnd++;
            }

            const keyword = textDecoder.decode(
              keywordData.slice(0, keywordEnd),
            );

            if (
              keyword === "chara" ||
              keyword === "character" ||
              keyword === "prompt"
            ) {
              const dataStart = offset + keywordEnd + 1; // +1 for null separator
              const textData = new Uint8Array(
                arrayBuffer,
                dataStart,
                length - keywordEnd - 1,
              );
              const textContent = latin1Decoder.decode(textData); // Use Latin1 for text content

              try {
                // First try to decode as base64
                const decoded = atob(textContent);
                // Convert the base64-decoded string to proper UTF-8
                const utf8Bytes = new Uint8Array(decoded.length);
                for (let i = 0; i < decoded.length; i++) {
                  utf8Bytes[i] = decoded.charCodeAt(i);
                }
                const utf8Decoder = new TextDecoder("utf-8");
                const utf8String = utf8Decoder.decode(utf8Bytes);
                characterData = JSON.parse(utf8String);
                break;
              } catch (base64Error) {
                // If base64 fails, try parsing directly
                try {
                  characterData = JSON.parse(textContent);
                  break;
                } catch (parseError) {
                  console.log("Could not parse character data:", parseError);
                }
              }
            }
          }

          offset += length + 4; // Skip data and CRC
        }

        if (characterData) {
          // Extract data with fallbacks (different formats)
          console.log("Character data:", characterData);
          const name =
            characterData.name ||
            characterData.data?.name ||
            "Imported Character";
          const firstMessage =
            characterData.first_mes ||
            characterData.firstMessage ||
            characterData.data?.first_mes ||
            "";
          const scenario =
            characterData.scenario || characterData.data?.scenario || "";

          // Combine description and personality
          const description =
            characterData.description || characterData.data?.description || "";
          const personality =
            characterData.personality || characterData.data?.personality || "";

          let combinedPersonality = "";
          let storyContent = "";

          // Check for HTML content in personality
          if (
            personality.trim().startsWith("<") ||
            personality.includes("<p") ||
            personality.includes("<div")
          ) {
            storyContent = personality;
            // If personality is just HTML, leave combinedPersonality empty (or just description)
            combinedPersonality = description;
          } else {
            combinedPersonality = [description, personality]
              .filter((text) => text.trim())
              .join("\n\n")
              .trim();
          }

          // Fill the form fields with imported data
          setNewCharacterName(name);
          setNewCharacterAlias("");
          setNewCharacterFirstMessage(firstMessage);
          setNewCharacterScenario(scenario);
          setNewCharacterPersonality(combinedPersonality);
          setNewCharacterStoryContent(storyContent);

          // Also extract the image itself for use as character image
          const img = new Image();
          img.onload = () => {
            // Create a canvas to process the image
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.drawImage(img, 0, 0);

              // Create both thumbnail and full image versions
              Promise.all([
                processImage(file, 5, 200), // Thumbnail
                processImage(file, 75, 1200), // Full image
              ]).then(([thumbnail, fullImage]) => {
                setTempCharacterImage({ thumbnail, fullImage });
              });
            }
          };
          img.src = URL.createObjectURL(file);

          setToastMessage("Character data extracted from PNG!");
        } else {
          // No character data found, just use the image
          const img = new Image();
          img.onload = () => {
            // Create a canvas to process the image
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.drawImage(img, 0, 0);

              // Create both thumbnail and full image versions
              Promise.all([
                processImage(file, 5, 200), // Thumbnail
                processImage(file, 75, 1200), // Full image
              ]).then(([thumbnail, fullImage]) => {
                setTempCharacterImage({ thumbnail, fullImage });
              });
            }
          };
          img.src = URL.createObjectURL(file);

          setToastMessage("PNG imported as image (no character data found)");
        }
      } catch (error) {
        console.error("Error processing PNG file:", error);
        setToastMessage("Error processing PNG file");
      }
    };

    reader.onerror = () => {
      setToastMessage("Error reading file");
    };

    reader.readAsArrayBuffer(file);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
    setToastMessage("Edit cancelled");
    setValidcolor("bg-red-400/50");
  };

  const startEditingChatName = (
    characterId: string,
    chatId: string,
    currentName: string,
  ) => {
    setEditingChatId(chatId);
    setEditChatName(currentName);
    setEditingCharacterId(characterId);
  };

  const switchResponse = (messageIndex: number, responseIndex: number) => {
    const updatedMessages = [...messages];
    const msg = updatedMessages[messageIndex];

    if (
      msg &&
      msg.regeneratedResponses &&
      responseIndex >= 0 &&
      responseIndex < msg.regeneratedResponses.length
    ) {
      msg.text = msg.regeneratedResponses[responseIndex];
      msg.currentResponseIndex = responseIndex;
      setMessages(updatedMessages);
      // Update characters state as well to persist selection
      if (selectedCharacterId && selectedChatId) {
        setCharacters((prevChars) =>
          prevChars.map((c) =>
            c.id === selectedCharacterId
              ? {
                  ...c,
                  chats: c.chats.map((chat) =>
                    chat.id === selectedChatId
                      ? { ...chat, messages: updatedMessages }
                      : chat,
                  ),
                }
              : c,
          ),
        );
      }
    }
  };
  const DeleteAndRegenerateChat = (characterId: string, chatId: string) => {
    // Find the last AI message to regenerate from
    const lastUserMessageIndex = messages
      .map((msg, index) => (msg.sender === "user" ? index : -1))
      .filter((i) => i !== -1)
      .pop();

    if (lastUserMessageIndex !== undefined && lastUserMessageIndex >= 0) {
      regenerateResponse(lastUserMessageIndex);
    }
  };

  // Close modals with ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showSettings) setShowSettings(false);
        if (showNewCharacterModal) setShowNewCharacterModal(false);
        if (showBotSettings) setShowBotSettings(false);
        if (showDeleteCharacterModal) setShowDeleteCharacterModal(false);
        if (showDeleteChatModal) setShowDeleteChatModal(false);
        if (editingChatId) cancelEditChatName();
        if (showHelp) setShowHelp(false);
      }
    };
    const handlegravekey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (event.key === "`" && !isTextAreaOrInput) {
        setIsSidebarOpen(!isSidebarOpen);
      }
    };

    const handleHKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (event.key === "h" && !isTextAreaOrInput) {
        setShowHelp(!showHelp);
      }
    };

    const handleUKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "u" && !isTextAreaOrInput) {
        event.preventDefault();
        setSettingsTab("user");
        setShowSettings(!showSettings);
      }
    };

    const handleAKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "a" && !isTextAreaOrInput) {
        event.preventDefault();
        setSettingsTab("api");
        setShowSettings(!showSettings);
      }
    };

    const handlePKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "p" && !isTextAreaOrInput) {
        event.preventDefault();
        setSettingsTab("prompt");
        setShowSettings(!showSettings);
      }
    };

    const handleNKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "n" && !isTextAreaOrInput) {
        event.preventDefault();
        setShowNewCharacterModal(!showNewCharacterModal);
      }
    };

    const handleCKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "c" &&
        !event.ctrlKey &&
        !isTextAreaOrInput &&
        !event.repeat
      ) {
        event.preventDefault();
        event.stopPropagation();
        createNewChat(getCurrentCharacter()?.id || "");
      }
    };

    const handleDKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "d" &&
        !event.ctrlKey &&
        !isTextAreaOrInput &&
        !event.repeat
      ) {
        event.preventDefault();
        event.stopPropagation();
        setChatToDelete({
          chatId: getCurrentChat()?.id || "",
          characterId: getCurrentCharacter()?.id || "",
        });
        setShowDeleteChatModal(true);
      }
    };

    const handleBKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "b" && !isTextAreaOrInput && !event.ctrlKey) {
        event.preventDefault();
        handleBotSettingsClick(getCurrentCharacter()?.id || "");
      }
    };

    const handleFKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "f" && !isTextAreaOrInput && !event.ctrlKey) {
        event.preventDefault();
        document.getElementById("messageInput")?.focus();
      }
    };

    const handleVKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;
      if (event.key === "v" && !isTextAreaOrInput && !event.ctrlKey) {
        event.preventDefault();
        startEditingChatName(
          getCurrentCharacter()?.id || "",
          getCurrentChat()?.id || "",
          getCurrentChat()?.title || "",
        );
      }
    };

    const handleEKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "e" &&
        !isTextAreaOrInput &&
        messages.length > 0 &&
        !event.ctrlKey
      ) {
        event.preventDefault();

        // Find the latest message that can be edited (not the loading message)
        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];

        // Don't edit if it's a loading message or empty
        if (
          latestMessage.text !== "..." &&
          latestMessage.text !== "(Error fetching response)"
        ) {
          startEditing(latestMessageIndex, latestMessage.text);
        }
      }
    };

    const handleEqKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "=" &&
        !isTextAreaOrInput &&
        messages.length > 0 &&
        !event.ctrlKey
      ) {
        event.preventDefault();

        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];
        if (
          latestMessage.regeneratedResponses &&
          latestMessage.currentResponseIndex !== undefined &&
          latestMessage.currentResponseIndex <
            latestMessage.regeneratedResponses.length - 1
        ) {
          switchResponse(
            latestMessageIndex,
            latestMessage.currentResponseIndex + 1,
          );
        }
      }
    };

    const handleDashKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "-" &&
        !isTextAreaOrInput &&
        messages.length > 0 &&
        !event.ctrlKey
      ) {
        event.preventDefault();

        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];
        if (
          latestMessage.currentResponseIndex !== undefined &&
          latestMessage.currentResponseIndex > 0
        ) {
          switchResponse(
            latestMessageIndex,
            latestMessage.currentResponseIndex - 1,
          );
        }
      }
    };

    const handleArrowKeys = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (isTextAreaOrInput) return; // Don't interfere with text input

      // Character navigation (Left/Right arrows)
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();

        if (characters.length <= 1) return; // Need at least 2 characters

        const currentCharacterIndex = characters.findIndex(
          (c) => c.id === selectedCharacterId,
        );
        let newCharacterIndex;

        if (event.ctrlKey) {
          if (event.key === "ArrowRight") {
            newCharacterIndex = (currentCharacterIndex + 1) % characters.length;
          } else {
            // ArrowLeft
            newCharacterIndex =
              (currentCharacterIndex - 1 + characters.length) %
              characters.length;
          }

          const newCharacter = characters[newCharacterIndex];
          setSelectedCharacterId(newCharacter.id);

          // Select the first chat of the new character
          if (newCharacter.chats.length > 0) {
            setSelectedChatId(newCharacter.chats[0].id);
            setMessages(newCharacter.chats[0].messages);
          } else {
            setSelectedChatId(null);
            setMessages([]);
          }
        }
        return;
      }

      // Chat navigation (Up/Down arrows) - only if a character is selected
      const currentCharacter = getCurrentCharacter();
      if (!currentCharacter || currentCharacter.chats.length <= 1) return;

      const currentChatIndex = currentCharacter.chats.findIndex(
        (chat) => chat.id === selectedChatId,
      );

      if (event.key === "ArrowDown" && event.ctrlKey) {
        event.preventDefault();
        const nextIndex =
          (currentChatIndex + 1) % currentCharacter.chats.length;
        const nextChat = currentCharacter.chats[nextIndex];
        setSelectedChatId(nextChat.id);
        setMessages(nextChat.messages);
      }

      if (event.key === "ArrowUp" && event.ctrlKey) {
        event.preventDefault();
        const prevIndex =
          (currentChatIndex - 1 + currentCharacter.chats.length) %
          currentCharacter.chats.length;
        const prevChat = currentCharacter.chats[prevIndex];
        setSelectedChatId(prevChat.id);
        setMessages(prevChat.messages);
      }
    };

    const handleRKey = (event: KeyboardEvent) => {
      const isTextAreaOrInput =
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLInputElement;

      if (
        event.key === "r" &&
        !isTextAreaOrInput &&
        messages.length > 0 &&
        !event.ctrlKey
      ) {
        event.preventDefault();

        DeleteAndRegenerateChat(
          getCurrentCharacter()?.id || "",
          getCurrentChat()?.id || "",
        );
      }
    };

    document.addEventListener("keydown", handleEscKey);
    document.addEventListener("keydown", handlegravekey);
    document.addEventListener("keydown", handleHKey);
    document.addEventListener("keydown", handleUKey);
    document.addEventListener("keydown", handleAKey);
    document.addEventListener("keydown", handlePKey);
    document.addEventListener("keydown", handleNKey);
    document.addEventListener("keydown", handleCKey);
    document.addEventListener("keydown", handleDKey);
    document.addEventListener("keydown", handleBKey);
    document.addEventListener("keydown", handleEKey);
    document.addEventListener("keydown", handleFKey);
    document.addEventListener("keydown", handleArrowKeys);
    document.addEventListener("keydown", handleVKey);
    document.addEventListener("keydown", handleRKey);
    document.addEventListener("keydown", handleDashKey);
    document.addEventListener("keydown", handleEqKey);
    return () => (
      document.removeEventListener("keydown", handleEscKey),
      document.removeEventListener("keydown", handlegravekey),
      document.removeEventListener("keydown", handleHKey),
      document.removeEventListener("keydown", handleUKey),
      document.removeEventListener("keydown", handleAKey),
      document.removeEventListener("keydown", handlePKey),
      document.removeEventListener("keydown", handleNKey),
      document.removeEventListener("keydown", handleCKey),
      document.removeEventListener("keydown", handleDKey),
      document.removeEventListener("keydown", handleBKey),
      document.removeEventListener("keydown", handleEKey),
      document.removeEventListener("keydown", handleFKey),
      document.removeEventListener("keydown", handleArrowKeys),
      document.removeEventListener("keydown", handleVKey),
      document.removeEventListener("keydown", handleRKey),
      document.removeEventListener("keydown", handleDashKey),
      document.removeEventListener("keydown", handleEqKey)
    );
  }, [
    showSettings,
    showNewCharacterModal,
    showBotSettings,
    showDeleteCharacterModal,
    showDeleteChatModal,
    editingChatId,
    isSidebarOpen,
    showHelp,
    messages,
  ]);

  // Auto-resize message input
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "auto";
      const scrollHeight = messageInputRef.current.scrollHeight;
      messageInputRef.current.style.height = `${Math.min(scrollHeight, 400)}px`;
    }
  }, [input]);

  const deleteCharacter = (characterId: string) => {
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

  const importCharacterCard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "application/json" || file.name.endsWith(".json")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fileContent = e.target?.result as string;
          const cardData = JSON.parse(fileContent);
          const characterData = cardData.data || cardData;

          // Extract data with fallbacks
          const name = characterData.name || "Imported Character";
          const firstMessage =
            characterData.first_mes || characterData.firstMessage || "";
          const scenario = characterData.scenario || "";

          // Combine description and personality (different sites use different fields)
          const description = characterData.description || "";
          const personality = characterData.personality || "";
          let storyContent = "";
          if (personality.trim().startsWith("<p>")) {
            storyContent = personality;
          } else {
            storyContent = "";
          }
          const combinedPersonality = [description, personality]
            .filter((text) => text.trim())
            .join("\n\n")
            .trim();

          // Fill the form fields with imported data
          setNewCharacterName(name);
          setNewCharacterAlias("");
          setNewCharacterFirstMessage(firstMessage);
          setNewCharacterScenario(scenario);
          setNewCharacterPersonality(combinedPersonality);
          setNewCharacterStoryContent(storyContent);

          // Reset file input
          event.target.value = "";
        } catch (error) {
          alert(
            "Invalid JSON file. Please select a valid character card JSON file.",
          );
          console.error("Import error:", error);
          event.target.value = "";
        }
      };

      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        event.target.value = "";
      };

      reader.readAsText(file);
    } else if (file.type.includes("image") || file.name.endsWith(".png")) {
      // Handle PNG files
      importCharacterCardFromPNG(event);
    } else {
      setToastMessage("Unsupported file format");
    }
  };

  // Character and chat management
  const createNewCharacter = () => {
    if (!newCharacterName.trim()) return;

    const firstMessage = newCharacterFirstMessage.trim()
      ? newCharacterFirstMessage
      : `Hello {{user}}! I'm ${newCharacterName}, how can I help you today?`;

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: newCharacterName,
      alias: newCharacterAlias.trim() || undefined,
      personality: newCharacterPersonality,
      scenario: newCharacterScenario,
      storyContent: newCharacterStoryContent,
      firstMessage: firstMessage,
      thumbnail: tempCharacterImage.thumbnail,
      fullImage: tempCharacterImage.fullImage,
      chats: [
        {
          id: Date.now().toString() + "-chat",
          title: "New Chat",
          messages: [{ sender: "ai", text: firstMessage }],
          lastActive: Date.now(),
        },
      ],
    };

    setCharacters([...characters, newCharacter]);
    setSelectedCharacterId(newCharacter.id);
    setSelectedChatId(newCharacter.chats[0].id);
    setMessages(newCharacter.chats[0].messages);
    setNewCharacterName("");
    setNewCharacterAlias("");
    setNewCharacterPersonality("");
    setNewCharacterStoryContent("");
    setNewCharacterScenario("");
    setNewCharacterFirstMessage(""); // Reset first message
    setShowNewCharacterModal(false);
    setTempCharacterImage({ thumbnail: "", fullImage: "" });
  };

  const saveChatName = () => {
    if (editingChatId && editingCharacterId && editChatName.trim()) {
      const updatedCharacters = characters.map((character) =>
        character.id === editingCharacterId
          ? {
              ...character,
              chats: character.chats.map((chat) =>
                chat.id === editingChatId
                  ? { ...chat, title: editChatName.trim() }
                  : chat,
              ),
            }
          : character,
      );

      setCharacters(updatedCharacters);
      setEditingChatId(null);
      setEditingCharacterId(null);
      setEditChatName("");
      setToastMessage("Chat name updated");
      setValidcolor("bg-green-400/50");
    }
  };

  const cancelEditChatName = () => {
    setEditingChatId(null);
    setEditingCharacterId(null);
    setEditChatName("");
    setToastMessage("Edit cancelled");
    setValidcolor("bg-red-400/50");
  };

  function stripMarkdown(text: string): string {
    return text
      .replace(/^>\s?/gm, "") // remove blockquotes
      .replace(/\*\*/g, "") // remove bold
      .replace(/_/g, ""); // remove italics
  }

  function copyToClipboard(text: string): void {
    navigator.clipboard.writeText(stripMarkdown(text));
  }
  const deleteMessage = (index: number) => {
    // Logic simplified, we rely on derived state from messages mostly

    const updatedMessages = messages.slice(0, index);
    setMessages(updatedMessages);

    // Update the chat in characters
    if (selectedCharacterId && selectedChatId) {
      const updatedCharacters = characters.map((character) =>
        character.id === selectedCharacterId
          ? {
              ...character,
              chats: character.chats.map((chat) =>
                chat.id === selectedChatId
                  ? { ...chat, messages: updatedMessages }
                  : chat,
              ),
            }
          : character,
      );
      setCharacters(updatedCharacters);
      setToastMessage("Message deleted");
      setValidcolor("bg-red-400/50");
    }
  };

  const validateApiKey = async (
    apiKey: string,
    endpointUrl: string,
    model: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: "Say 'ok' if this API key works.",
            },
          ],
          max_tokens: 5,
          thinking: { type: "disabled" },
          reasoning: { enabled: false },
        }),
      });

      if (response.status !== 200) {
        console.log("API key validation failed");
        return false;
      }

      const data = await response.json();
      console.log("API validation response:", data.choices?.[0]?.message);
      // Basic sanity check: did we actually get a model response?
      return (
        !!data?.choices?.[0]?.message?.content ||
        !!data?.choices?.[0]?.message?.reasoning_content ||
        !!data?.choices?.[0]?.message?.reasoning
      );
    } catch (error) {
      return false;
    }
  };

  const validateApibutton = async () => {
    setValidating(true);
    const isValid = await validateApiKey(apiKey, endpointUrl, model);
    setToastMessage(isValid ? "API Key is valid" : "API Key is invalid");
    setValidcolor(isValid ? "bg-green-400/50" : "bg-red-200/50");
    setValidated(isValid);
    setValidating(false);
  };

  // You can use this function to validate the API key when needed

  const resetApiSettings = () => {
    setModel("deepseek/deepseek-v3.2");
    setApiKey("");
    setValidated(false);
  };

  const handleAPIRequest = async ({
    character,
    messages,
    userName,
    userPronouns,
    userDescription,
    regen,
    targetMessageIndex,
  }: {
    character: Character;
    messages: Message[];
    userName: string;
    userPronouns: { p1: string; p2: string; p3: string };
    userDescription: string;
    regen: boolean;
    targetMessageIndex?: number;
  }) => {
    try {
      let systemMessage = systemPrompt;
      systemMessage += `\n\nCharacter Name: ${character.name}`;
      if (character.personality.trim())
        systemMessage += `\n\nCharacter Personality: ${character.personality}`;
      if (character.scenario.trim())
        systemMessage += `\n\nScenario: ${character.scenario}`;
      systemMessage += `\n\nUser Name: ${userName}`;
      if (userDescription.trim())
        systemMessage += `\n\nUser Description: ${userDescription}`;
      if (
        userPronouns.p1.trim() ||
        userPronouns.p2.trim() ||
        userPronouns.p3.trim()
      )
        systemMessage += `\n\nUser Pronouns: ${userPronouns.p1}/${userPronouns.p2}/${userPronouns.p3}`;
      systemMessage = systemMessage
        .replace(/\{\{char\}\}/g, character.name)
        .replace(/\{\{user\}\}/g, userName)
        .replace(/\{\{p1\}\}/g, userPronouns.p1)
        .replace(/\{\{p2\}\}/g, userPronouns.p2)
        .replace(/\{\{p3\}\}/g, userPronouns.p3);

      const messagesWithNames = messages.map((m) => {
        const role = m.sender === "user" ? "user" : "assistant";
        let content = m.text;
        content = content.replace(/\{\{user\}\}/g, userName);
        content = content.replace(/\{\{char\}\}/g, character.name);
        content = content.replace(/\{\{p1\}\}/g, userPronouns.p1);
        content = content.replace(/\{\{p2\}\}/g, userPronouns.p2);
        content = content.replace(/\{\{p3\}\}/g, userPronouns.p3);
        return { role, content };
      });
      if (regen) {
        systemMessage += `\n\nRegenerate id differently.`;
      }
      const requestBody: any = {
        model: model,
        messages: [
          { role: "system", content: systemMessage },
          ...messagesWithNames,
        ],
        temperature: temperature,
        //deepseek
        thinking: { type: showThinking ? "enabled" : "disabled" },
        //openrouter
        reasoning: { enabled: showThinking ? true : false },
        stream: true,
      };
      if (showThinking) {
        requestBody.reasoning_effort = thinkingEffort;
        requestBody.reasoning = { enabled: true, effort: thinkingEffort };
      }
      // Only include max_tokens if it's not 0 (use model default)
      if (maxTokens !== 0) {
        requestBody.max_tokens = maxTokens;
      }
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://shit-chat-ai.vercel.app/",
          "X-Title": "Shit Chat AI",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Full error response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${errorText}`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiResponse = "";
      let aiThinking = "";

      // Prepare the message placeholder
      setMessages((prev) => {
        const updated = [...prev];

        if (
          targetMessageIndex !== undefined &&
          targetMessageIndex >= 0 &&
          targetMessageIndex < updated.length
        ) {
          // We are appending to an existing message (regenerating)
          // IMMUTABLE UPDATE: Copy the message and the array
          const targetMsg = { ...updated[targetMessageIndex] };
          const currentResponses = targetMsg.regeneratedResponses
            ? [...targetMsg.regeneratedResponses]
            : targetMsg.text
              ? [targetMsg.text]
              : [];

          // Add a placeholder for the new response
          currentResponses.push("...");

          targetMsg.regeneratedResponses = currentResponses;
          targetMsg.currentResponseIndex = currentResponses.length - 1;
          targetMsg.text = "..."; // Show loading...

          updated[targetMessageIndex] = targetMsg;
          return updated;
        } else if (regen || updated.length === messages.length) {
          // New message (either regen new or normal send)
          // Note: messages passed to this func does NOT include the new user message if normal send?
          // Actually sendMessage adds user message then calls this.
          // If normal send, targetMessageIndex is undefined. We append.

          return [
            ...updated,
            {
              sender: "ai" as const,
              text: "...",
              regeneratedResponses: ["..."],
              currentResponseIndex: 0,
            },
          ];
        }
        return updated;
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() === "" || line.trim() === "data: [DONE]") continue;
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices[0]?.delta;
              console.log("delta:", delta); // <-- add this temporarily

              const content = delta?.content;
              // Most likely fix — add reasoning to the chain:
              const thinking =
                delta?.reasoning_content ??
                delta?.reasoning ??
                delta?.thinking ??
                null;

              if (thinking) {
                aiThinking += thinking;
              }
              if (content || thinking) {
                if (content) aiResponse += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  const targetIdx = targetMessageIndex ?? updated.length - 1;

                  if (targetIdx >= 0 && targetIdx < updated.length) {
                    const msg = { ...updated[targetIdx] };
                    if (content) msg.text = aiResponse;
                    msg.thinking = aiThinking; // <-- add this

                    if (
                      msg.regeneratedResponses &&
                      msg.currentResponseIndex !== undefined
                    ) {
                      const newRegen = [...msg.regeneratedResponses];
                      newRegen[msg.currentResponseIndex] = msg.text;
                      msg.regeneratedResponses = newRegen;
                    } else {
                      msg.regeneratedResponses = [msg.text];
                      msg.currentResponseIndex = 0;
                    }
                    updated[targetIdx] = msg;
                  }

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
                                    messages: updated,
                                    lastActive: Date.now(),
                                  }
                                : chat,
                            ),
                          }
                        : character,
                    );
                    setCharacters(updatedCharacters);
                  }

                  return updated;
                });
              }
            } catch (e) {
              console.error("Error parsing JSON:", e, line);
            }
          }
        }
      }
      console.log("Full AI response:", aiResponse);
      console.log("Full AI thinking:", aiThinking);
    } catch (error) {
      if ((error as any).name === "AbortError") {
        console.log("Request was aborted");
        return; // Don't show error message if user stopped it
      }
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const idx =
          targetMessageIndex !== undefined
            ? targetMessageIndex
            : updated.length - 1;
        if (updated[idx]) {
          updated[idx].text = "(Error fetching response)";
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const regenerateResponse = async (fromIndex: number) => {
    if (fromIndex < 0 || fromIndex >= messages.length || isLoadingRef.current)
      return;

    setIsLoading(true);
    isLoadingRef.current = true;
    setIsLoading(true);
    isLoadingRef.current = true;
    // setShowRegenerate(false); // Deleted
    // setRegenerateFromIndex(null); // Deleted

    const character = getCurrentCharacter();
    if (!character) return;

    const messagesToRegenerate = messages.slice(0, fromIndex + 1);

    // Check if we are regenerating an existing message or creating a new one
    // The "response" message is usually at fromIndex + 1
    let targetMessageIndex: number | undefined = undefined;
    if (
      fromIndex + 1 < messages.length &&
      messages[fromIndex + 1].sender === "ai"
    ) {
      targetMessageIndex = fromIndex + 1;
    }

    try {
      await handleAPIRequest({
        character,
        messages: messagesToRegenerate,
        userName,
        userPronouns,
        userDescription,
        regen: true,
        targetMessageIndex: targetMessageIndex,
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [
          ...prev.slice(0, -1),
          { sender: "ai" as const, text: "(Error fetching response)" },
        ];
        return updated;
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const deleteChat = (characterId: string, chatId: string) => {
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

  const formatText = (text: string): string => {
    const character = getCurrentCharacter();
    const replaced = text
      .replace(/\{\{user\}\}/g, userName)
      .replace(/\{\{char\}\}/g, character?.name || "AI")
      .replace(/\{\{p1\}\}/g, userPronouns.p1)
      .replace(/\{\{p2\}\}/g, userPronouns.p2)
      .replace(/\{\{p3\}\}/g, userPronouns.p3);

    const rawHtml = marked.parse(replaced);
    return typeof rawHtml === "string" ? rawHtml : replaced;
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() || isLoadingRef.current) return;

    const character = getCurrentCharacter();
    if (!character) return;

    const userMessage = input;
    const newMessages = [
      ...messages,
      { sender: "user" as const, text: userMessage },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    isLoadingRef.current = true;

    setMessages((prev) => [...prev, { sender: "ai" as const, text: "..." }]);

    try {
      await handleAPIRequest({
        character,
        messages: newMessages,
        userName,
        userPronouns,
        userDescription,
        regen: false,
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [
          ...prev.slice(0, -1),
          { sender: "ai" as const, text: "(Error fetching response)" },
        ];
        return updated;
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const clearChat = () => {
    const character = getCurrentCharacter();
    if (!character || !selectedChatId) return;
    const firstMessage =
      character.firstMessage ||
      `Hello! I'm ${character.name}, how can I help you today?`;

    const updatedMessages = [
      {
        sender: "ai" as const,
        text: firstMessage,
      },
    ];
    setMessages(updatedMessages);

    const updatedCharacters = characters.map((c) =>
      c.id === selectedCharacterId
        ? {
            ...c,
            chats: c.chats.map((chat) =>
              chat.id === selectedChatId
                ? { ...chat, messages: updatedMessages, lastActive: Date.now() }
                : chat,
            ),
          }
        : c,
    );
    setCharacters(updatedCharacters);
  };

  const resetNames = () => {
    setUserName("You");
    setUserPronouns({ p1: "he", p2: "his", p3: "him" });
  };

  const resetPromptSettings = () => {
    setTemperature(0.75);
    setMaxTokens(2048);
    setSystemPrompt("");
  };

  const saveUserPreset = () => {
    const userPreset: UserPreset = {
      id: Date.now().toString(),
      name: userName,
      description: userDescription,
      thumbnail: userThumbnail,
      fullImage: userFullImage,
      p1: userPronouns.p1,
      p2: userPronouns.p2,
      p3: userPronouns.p3,
    };

    try {
      localStorage.setItem(
        "userPresets",
        JSON.stringify([...userPresets, userPreset]),
      );
      setUserPresets([...userPresets, userPreset]);
    } catch (error) {
      console.error("Error saving user preset:", error);
    }
  };

  const loadUserPreset = (preset: UserPreset) => {
    setUserName(preset.name);
    setUserPronouns({ p1: preset.p1, p2: preset.p2, p3: preset.p3 });
    setUserDescription(preset.description);
    setUserThumbnail(preset.thumbnail);
    setUserFullImage(preset.fullImage);
  };

  // const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const presetId = event.target.value;
  //   setSelectedPresetId(presetId);

  //   if (presetId === defaultPreset.id) {
  //     loadUserPreset(defaultPreset);
  //   } else {
  //     const selectedPreset = userPresets.find(
  //       (preset) => preset.id === presetId
  //     );
  //     if (selectedPreset) {
  //       loadUserPreset(selectedPreset);
  //     }
  //   }
  // };

  const handlePresetDelete = (presetId: string) => {
    const updatedPresets = userPresets.filter(
      (preset) => preset.id !== presetId,
    );
    setUserPresets(updatedPresets);
    localStorage.setItem("userPresets", JSON.stringify(updatedPresets));
  };

  const saveApiPreset = () => {
    const name = prompt("Enter a name for this API preset:");
    if (!name?.trim()) return;
    const newPreset = {
      id: Date.now().toString(),
      name: name.trim(),
      model,
      endpointUrl,
      apiKey,
    };
    setApiPresets((prev) => [...prev, newPreset]);
    setToastMessage("API preset saved!");
    setValidcolor("bg-green-400/50");
  };

  const loadApiPreset = (id: string) => {
    const preset = apiPresets.find((p) => p.id === id);
    if (!preset) return;
    setModel(preset.model);
    setEndpointUrl(preset.endpointUrl);
    setApiKey(preset.apiKey);
    setValidated(false);
    setSelectedApiPresetId(id);
    setToastMessage("API preset loaded!");
    setValidcolor("bg-green-400/50");
  };

  const deleteApiPreset = (id: string) => {
    setApiPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedApiPresetId === id) setSelectedApiPresetId("");
    setToastMessage("API preset deleted");
    setValidcolor("bg-red-400/50");
  };

  const saveEditApiPreset = () => {
    if (!editingApiPresetId || !editApiPresetName.trim()) return;
    setApiPresets((prev) =>
      prev.map((p) =>
        p.id === editingApiPresetId
          ? {
              ...p,
              name: editApiPresetName.trim(),
              model: editApiPresetModel,
              endpointUrl: editApiPresetEndpoint,
              apiKey: editApiPresetKey,
            }
          : p,
      ),
    );
    // Update the active API settings to match
    setModel(editApiPresetModel);
    setEndpointUrl(editApiPresetEndpoint);
    setApiKey(editApiPresetKey);
    setValidated(false);
    setEditingApiPresetId(null);
    setEditApiPresetName("");
    setEditApiPresetModel("");
    setEditApiPresetEndpoint("");
    setEditApiPresetKey("");
    setToastMessage("API preset updated!");
    setValidcolor("bg-green-400/50");
  };

  if (consentGiven === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Consent Required
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            To use ShitchatAI, you need to agree to our data storage practices
            and confirm you're 13 years or older.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            ← Return to Consent Page
          </Link>

          <p className="text-xs text-gray-500 mt-4">
            Can't proceed without agreeing to our terms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-gray-50">
      {toastMessage && (
        <CustomToast
          message={toastMessage}
          color={validcolor ? validcolor : "bg-blue-400/50"}
          onClose={() => (setToastMessage(""), setValidcolor(""))}
        />
      )}
      {/* Sidebar + Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
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

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-0" : "ml-0"
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg text-black hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? "✕" : "☰"}
            </button>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span
                className="cursor-pointer hover:underline hover:text-blue-600 transition-colors"
                onClick={() => setShowStoryModal(true)}
                title="Click to view Story Info"
              >
                {getCurrentCharacter()?.name || "AI"}
              </span>
              {getCurrentCharacter()?.alias && (
                <span className="hidden md:inline text-gray-600 font-normal">
                  ({getCurrentCharacter()?.alias})
                </span>
              )}
              <span className="text-gray-400">|</span>
              <span className="font-normal text-gray-600">
                {getCurrentChat()?.title}
              </span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              onClick={() => setShowHelp(true)}
              title="Help"
            >
              ❓
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              onClick={() => setShowSettings(true)}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && <Help setShowHelp={setShowHelp} />}

        {/* Story Content Modal */}
        {showStoryModal && getCurrentCharacter() && (
          <StoryContentModal
            isOpen={showStoryModal}
            onClose={() => setShowStoryModal(false)}
            character={getCurrentCharacter()!}
            onSave={(characterId, newContent) => {
              const updatedCharacters = characters.map((c) =>
                c.id === characterId ? { ...c, storyContent: newContent } : c,
              );
              setCharacters(updatedCharacters);
            }}
          />
        )}

        {/* New Character Modal */}
        {showNewCharacterModal && (
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
                        instead. JPEG is heavier than WebP. Use WebP if
                        possible.
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
                      ⚠️ External images may expose your IP to third-party
                      servers
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
                      onChange={(e) =>
                        setNewCharacterPersonality(e.target.value)
                      }
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
                      onChange={(e) =>
                        setNewCharacterFirstMessage(e.target.value)
                      }
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
        )}

        {/* Bot Settings Modal */}
        {showBotSettings && getCurrentCharacter() && (
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
                  <h2 className="text-xl font-bold text-gray-800">
                    🤖 Bot Settings
                  </h2>
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
                          <span className="text-gray-500 text-sm">
                            No thumbnail
                          </span>
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
                    <label className="block text-sm font-medium mb-1">
                      Scenario
                    </label>
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
                      This will only affect new chats. Existing chats will keep
                      their current first message.
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
        )}

        {/* Settings Modal */}
        {showSettings && (
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
                  <h2 className="text-xl font-bold text-gray-800">
                    ⚙️ Settings
                  </h2>
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
                          placeholder="e.g. deepseek/deepseek-v3.2"
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
                          The URL of the API endpoint to use for chat
                          completions
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
                          Your API key is stored locally and never sent to any
                          server except your API endpoint when validating or
                          sending messages.
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
                            {endpointUrl ? (
                              <p>{endpointUrl}</p>
                            ) : (
                              "❌ Not configured"
                            )}
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
                            Lower values = more focused/deterministic, Higher
                            values = more creative/random
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
                            onChange={(e) =>
                              setMaxTokens(parseInt(e.target.value))
                            }
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
                              : "approx. " +
                                Math.round(maxTokens / 4) +
                                " words"}
                            )
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Setting this to 0 means that the AI will use the
                            maximum response length supported by the model.
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
                              Only works with reasoning models (e.g.
                              deepseek-v4)
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
                              Only applies when thinking is enabled. Higher
                              effort = more tokens used.
                            </p>
                          </div>
                        )}
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
                              "• Available placeholders: {{char}}, {{user}}, {{p1}}, {{p2}}, {{p3}}"
                            }
                          </p>
                          <p>
                            {
                              "• {{char}} = Character name, {{user}} = Your name"
                            }
                          </p>
                          <p>
                            {
                              "• {{p1}} = Subject pronoun, {{p2}} = Possessive, {{p3}} = Object pronoun"
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
                          You can withdraw your consent and delete all data at
                          any time:
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
                            setMaxStorageSize(
                              await estimateLocalStorageMaxSize(),
                            )
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
                          Thumbnail: ~5KB (200px), Full Image: ~75KB (1200px).
                          Click thumbnail to view full image.
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
                          ⚠️ External images may expose your IP to third-party
                          servers
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
        )}
        {/* Delete Character Warning Modal */}
        {showDeleteCharacterModal && characterToDelete && (
          <ConfirmModal
            title="⚠️ Delete Character"
            message=" Are you sure you want to delete this character? This will also
                delete all chats associated with this character. This action
                cannot be undone."
            onConfirm={() => (
              deleteCharacter(characterToDelete),
              setToastMessage("Character deleted"),
              setValidcolor("bg-red-400/50")
            )}
            onCancel={() => (
              setShowDeleteCharacterModal(false),
              setToastMessage("Character not deleted"),
              setValidcolor("bg-blue-400/50")
            )}
          />
        )}

        {/* Delete Chat Warning Modal */}
        {showDeleteChatModal && chatToDelete && (
          <ConfirmModal
            title="⚠️ Delete Chat"
            message=" Are you sure you want to delete this chat? This action
                cannot be undone."
            onConfirm={() => (
              deleteChat(chatToDelete.characterId, chatToDelete.chatId),
              setToastMessage("Chat deleted"),
              setValidcolor("bg-red-400/50")
            )}
            onCancel={() => (
              setShowDeleteChatModal(false),
              setToastMessage("Chat not deleted"),
              setValidcolor("bg-blue-400/50")
            )}
          />
        )}
        {/* Chat Container */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {/* Chat Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto mb-4 space-y-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-4xl rounded-2xl p-4 shadow-sm transition-all ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {getCurrentCharacter()?.thumbnail || userThumbnail ? (
                    <div className="flex items-center mb-2">
                      {msg.sender === "ai" ? (
                        <>
                          {getCurrentCharacter()?.thumbnail ? (
                            <img
                              src={getCurrentCharacter()?.thumbnail}
                              alt={getCurrentCharacter()?.name}
                              onClick={() =>
                                showFullImage(getCurrentCharacter()?.id || "")
                              }
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            `🤖 `
                          )}
                        </>
                      ) : (
                        <>
                          {userThumbnail ? (
                            <img
                              src={userThumbnail}
                              alt={userFullImage}
                              onClick={() => ShowUserFullPic()}
                              className="w-8 h-8 rounded-full mr-2"
                            />
                          ) : (
                            `👤 `
                          )}
                        </>
                      )}

                      <div className="text-sm font-semibold">
                        {msg.sender === "user"
                          ? userName
                          : getCurrentCharacter()?.name || "AI"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold mb-2 opacity-80">
                      {msg.sender === "user"
                        ? `👤 ${userName}`
                        : `🤖 ${getCurrentCharacter()?.name || "AI"}`}
                    </div>
                  )}

                  {editingIndex === i ? (
                    <div className="space-y-3">
                      <textarea
                        ref={textareaRef}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") cancelEdit();
                        }}
                        rows={4}
                        autoFocus
                        style={{
                          minHeight: "100px",
                          width: editWidth,
                          maxWidth: "100%",
                        }}
                      />
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors flex-1"
                          onClick={saveEdit}
                        >
                          ✅ Save
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors flex-1"
                          onClick={cancelEdit}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {msg.thinking && (
                        <details
                          open={isLoading && i === messages.length - 1}
                          className="mb-2"
                        >
                          <summary className="text-xs cursor-pointer opacity-60 hover:opacity-100 select-none">
                            💭 Thinking...
                          </summary>
                          <div
                            className="mt-2 text-xs opacity-70 border-l-2 border-gray-300 pl-2 whitespace-pre-wrap break-words"
                            dangerouslySetInnerHTML={{
                              __html: formatText(msg.thinking),
                            }}
                          />
                        </details>
                      )}
                      <div
                        className="message-content overflow-x-auto break-words"
                        dangerouslySetInnerHTML={{
                          __html: formatText(msg.text),
                        }}
                      />
                      {msg.sender === "ai" &&
                      i === messages.length - 1 &&
                      isLoadingRef.current ? (
                        <div className="inline-block ml-2 mt-2">
                          <div className="animate-pulse text-xl">...</div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex space-x-2">
                            <button
                              className={`text-xs cursor-pointer ${
                                msg.sender === "user"
                                  ? "text-gray-200 hover:text-gray-300"
                                  : "text-blue-500 hover:text-blue-700"
                              }  transition-colors`}
                              onClick={() => startEditing(i, msg.text)}
                            >
                              ✏️ Edit
                            </button>
                            {msg.sender === "ai" && (
                              <button
                                className="text-xs cursor-pointer disabled:cursor-not-allowed text-green-500 hover:text-green-700 transition-colors disabled:opacity-50"
                                disabled={i == 0 || i != messages.length - 1}
                                onClick={() =>
                                  DeleteAndRegenerateChat(
                                    getCurrentCharacter()?.id || "",
                                    getCurrentChat()?.id || "",
                                  )
                                }
                              >
                                🔄 Regenerate
                              </button>
                            )}
                            {msg.sender === "ai" && (
                              <button
                                className="text-xs cursor-pointer text-indigo-500 hover:text-indigo-700 transition-colors"
                                onClick={() => branchChat(i)}
                                title="Start a new chat from here"
                              >
                                🌿 Branch
                              </button>
                            )}
                            <button
                              className={`text-xs cursor-pointer ${
                                msg.sender === "user"
                                  ? "text-gray-200 hover:text-gray-300"
                                  : "text-blue-500 hover:text-blue-700"
                              }  transition-colors`}
                              onClick={() => copyToClipboard(msg.text)}
                            >
                              📋 Copy
                            </button>
                            <button
                              className="text-xs cursor-pointer disabled:cursor-not-allowed text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              onClick={() => {
                                const confirmed = window.confirm(
                                  "Are you sure you want to delete this message?",
                                );
                                if (confirmed) {
                                  deleteMessage(i);
                                }
                              }}
                              disabled={i === 0 || i === messages.length - 1}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          {msg.sender === "ai" &&
                            msg.regeneratedResponses &&
                            msg.regeneratedResponses.length > 1 && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <button
                                  className="hover:text-gray-700 disabled:opacity-50"
                                  disabled={
                                    (msg.currentResponseIndex || 0) === 0
                                  }
                                  onClick={() =>
                                    switchResponse(
                                      i,
                                      (msg.currentResponseIndex || 0) - 1,
                                    )
                                  }
                                >
                                  ◀
                                </button>
                                <span>
                                  {(msg.currentResponseIndex || 0) + 1}/
                                  {msg.regeneratedResponses.length}
                                </span>
                                <button
                                  className="hover:text-gray-700 disabled:opacity-50"
                                  disabled={
                                    (msg.currentResponseIndex || 0) ===
                                    msg.regeneratedResponses.length - 1
                                  }
                                  onClick={() =>
                                    switchResponse(
                                      i,
                                      (msg.currentResponseIndex || 0) + 1,
                                    )
                                  }
                                >
                                  ▶
                                </button>
                              </div>
                            )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}

            {messages.length > 0 &&
              messages[messages.length - 1].sender === "user" &&
              !isLoadingRef.current && (
                <div className="flex justify-center my-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    onClick={() => regenerateResponse(messages.length - 1)}
                  >
                    🔄 Regenerate Response
                  </button>
                </div>
              )}
          </div>

          {/* Input Area */}
          <div
            ref={inputContainerRef}
            className="bg-white rounded-xl p-3 shadow-lg border border-gray-200"
          >
            <div className="flex space-x-3">
              <textarea
                id="messageInput"
                ref={messageInputRef}
                className="flex-1 border-0 text-black bg-gray-100 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all overflow-y-auto"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="💬 Type your message here..."
                disabled={isLoadingRef.current}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isLoadingRef.current &&
                    apiKey !== "" &&
                    validated
                  ) {
                    e.preventDefault();
                    sendMessage();
                  }
                  if (e.key === "Escape" && !isLoadingRef.current) {
                    e.preventDefault();
                    document.querySelector("textarea")?.blur();
                  }
                }}
              />
              <button
                className={`${
                  isLoadingRef.current
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-5 py-3 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[80px]`}
                onClick={isLoadingRef.current ? stopResponse : sendMessage}
                disabled={
                  (!isLoadingRef.current &&
                    (apiKey === "" || !validated || !input.trim())) ||
                  (isLoadingRef.current && !abortControllerRef.current)
                }
              >
                {isLoadingRef.current ? (
                  <span className="flex items-center gap-2">⏹️ Stop</span>
                ) : (
                  <span className="flex items-center gap-2">📤 Send</span>
                )}
              </button>
            </div>
            {apiKey === "" && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please enter your API key and validate it in the setting to sent
                messages.
              </p>
            )}
            {!validated && apiKey !== "" && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please validate your API key in the setting to send messages.
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press ⏎ Enter to send, ⇧ Shift+⏎ Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
