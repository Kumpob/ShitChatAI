"use client";

import React, { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import CustomToast from "./CustomToast";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface Character {
  id: string;
  name: string;
  alias?: string; // Add alias field
  personality: string;
  scenario: string;
  firstMessage?: string;
  chats: Chat[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastActive: number;
}

export default function AIChatRoom() {
  // State management
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editWidth, setEditWidth] = useState<string>("100%");
  const [regenerateFromIndex, setRegenerateFromIndex] = useState<number | null>(
    null
  );
  const [regenText, setRegenText] = useState<string[]>([]);
  const [CurrentRegenText, setCurrentRegenText] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showRegenerate, setShowRegenerate] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showNewCharacterModal, setShowNewCharacterModal] =
    useState<boolean>(false);
  const [newCharacterName, setNewCharacterName] = useState<string>("");
  const [newCharacterPersonality, setNewCharacterPersonality] =
    useState<string>("");
  const [newCharacterAlias, setNewCharacterAlias] = useState<string>("");
  const [newCharacterScenario, setNewCharacterScenario] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoadingRef = useRef<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<"api" | "user" | "prompt">(
    "user"
  );
  const [model, setModel] = useState<string>("deepseek/deepseek-chat-v3.1");
  const [apiKey, setApiKey] = useState<string>("");
  const [showBotSettings, setShowBotSettings] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editChatName, setEditChatName] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [validcolor, setValidcolor] = useState("");
  const [validated, setValidated] = useState(false);
  const [importData, setImportData] = useState<string>("");
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null
  );

  const [toastMessage, setToastMessage] = useState("");
  const defaultprompt =
    "You are a helpful and intelligent AI assistant. Your role is to support {{user}}s by answering questions, offering guidance, solving problems, and providing useful suggestions. \n\n Be clear, respectful, and {{user}}-friendly. Avoid being overly agreeable, if the {{user}}'s request or input could be improved, kindly point that out and offer constructive suggestions. Always ask if {{p1}}'d like to apply any improvement before proceeding. \n\n Focus on accuracy, clarity, and value. If you're unsure about something, be honest. Your goal is to help the {{user}} achieve the best outcome, not just to confirm {{p2}} ideas. Adapt your tone to the context, and always prioritize being genuinely helpful.";
  const defaultpromptRP =
    "You're a novelist—focus on a story centered on {{char}}. Serve as narrator and world-shaper. Bring the setting, supporting cast, and events to life while keeping {{user}}'s character autonomous. Show {{char}}'s personality, inner thoughts, contradictions, and dilemmas, letting their mindset and actions shape decisions, influence the plot, and create openings for {{user}}'s input. Narration should reflect {{char}}'s perspective, letting their biases, tone, and emotions color descriptions and guide the story's tension. \n\n Supporting characters should be distinct and dynamic, with quirks, goals, flaws, and evolving relationships. Let their loyalties shift and their actions generate meaningful consequences for {{char}}. Introduce conflicts—interpersonal, environmental, social, or situational—that feel balanced, where victories, failures, or compromises are all possible and earned. Allow setbacks and failures that push growth, spark new conflicts, or force adaptation, keeping {{char}}'s choices central. Maintain character continuity and weave in subtle hints or foreshadowing that resurface later. Highlight qualities and contradictions, showing moments when fears, desires, or choices clash with values, including hesitation or reflection. \n\n Ground each scene in place while shaping atmosphere and tone. Engage all five senses—sight, sound, touch, taste, and scent—woven naturally into narration. Begin each response with a concise hook—action, reaction, or dialogue tied to {{user}}'s last input. End scenes with a spark—curiosity, suspense, reflection, or a hint of what's next—that invites {{user}}'s engagement. Keep scenes dynamic by alternating dialogue, action, introspection, and description, prioritizing elements that advance openings and collaboration. Adjust prose rhythm and pacing to match the moment: fast and sharp for conflict, slower and reflective in quieter beats. \n\n Use a third-person limited perspective anchored in {{char}}. Narration may include other characters' observable behavior—gestures, expressions, and speech—while keeping {{char}}'s perception central. Follow {{user}}'s lead for pacing, adjusting story speed according to their input. Make scene shifts smooth, connected to prior events, and able to seed subplots. Offer narrative hooks while leaving space for {{user}}'s choices. \n\n Responses should use multiple paragraphs blending narration, dialogue, physicality, and thought. Dialogue should reflect personality and backstory while feeling natural and textured, with pauses, interruptions, slang, and shifting tone. Keep the narrative immersive and novelistic, with in-character commentary, varied rhythm, and flowing paragraphs. \n\n All verbal-dialogue part of the response should be between double quotes (\"). All characters thoughts should be in backtick (`) and only the non-verbal/action parts of the response should be italicized using asterisk (*). When a word is needed to be emphasize, it should be capitalize only. Italicize Everything other than the verbal and thought part. NEVER use sharp (#). {{char}} will NOT act as, speaking for, or describing the thoughts of {{user}}. \n\n Adapt seamlessly across genres and tones, maintaining character integrity and advancing the story according to {{user}}'s direction.";
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showDeleteCharacterModal, setShowDeleteCharacterModal] =
    useState<boolean>(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(
    null
  );
  const [showDeleteChatModal, setShowDeleteChatModal] =
    useState<boolean>(false);
  const [chatToDelete, setChatToDelete] = useState<{
    characterId: string;
    chatId: string;
  } | null>(null);
  const [newCharacterFirstMessage, setNewCharacterFirstMessage] =
    useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
  if (scrollContainerRef.current) {
    requestAnimationFrame(() => {
      scrollContainerRef.current!.scrollTop = scrollContainerRef.current!.scrollHeight;
    });
  }
}, [messages]);

  // Load data from localStorage
  useEffect(() => {
    const savedCharacters = localStorage.getItem("chatCharacters");
    const savedUserName = localStorage.getItem("chatUserName");
    const savedUserDescription = localStorage.getItem("chatUserDescription");
    const savedUserPronouns = localStorage.getItem("chatUserPronouns");
    const savedModel = localStorage.getItem("chatModel");
    const savedApiKey = localStorage.getItem("chatApiKey");
    const savedvalidated = localStorage.getItem("chatValidated");
    const savedSystemPrompt = localStorage.getItem("chatSystemPrompt");
    const savedRegenText = localStorage.getItem("chatRegenText");
    const savedCurrentRegenText = localStorage.getItem("chatCurrentRegenText");

    if (savedCharacters) {
      const parsedCharacters = JSON.parse(savedCharacters);
      setCharacters(parsedCharacters);

      // Select first character and chat if available
      if (parsedCharacters.length > 0) {
        setSelectedCharacterId(parsedCharacters[0].id);
        if (parsedCharacters[0].chats.length > 0) {
          setSelectedChatId(parsedCharacters[0].chats[0].id);
          setMessages(parsedCharacters[0].chats[0].messages);
        }
      }
    } else {
      // Create default character and chat if none exist
      const defaultCharacter: Character = {
        id: "default",
        name: "AI",
        personality: "",
        scenario: "",
        firstMessage: "Hello! I'm {{char}}, how can I help you today?",
        chats: [
          {
            id: "default-chat",
            title: "First Chat",
            messages: [
              {
                sender: "ai",
                text: "Hello! I'm {{char}}, how can I help you today?",
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
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedvalidated) setValidated(JSON.parse(savedvalidated));
    if (savedSystemPrompt) setSystemPrompt(savedSystemPrompt);
    if (savedRegenText) setRegenText(JSON.parse(savedRegenText));
    if (savedCurrentRegenText)
      setCurrentRegenText(JSON.parse(savedCurrentRegenText));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("chatCharacters", JSON.stringify(characters));
    localStorage.setItem("chatUserName", userName);
    localStorage.setItem("chatUserDescription", userDescription);
    localStorage.setItem("chatUserPronouns", JSON.stringify(userPronouns));
    localStorage.setItem("chatModel", model);
    localStorage.setItem("chatApiKey", apiKey);
    localStorage.setItem("chatValidated", JSON.stringify(validated));
    localStorage.setItem("chatSystemPrompt", systemPrompt);
    localStorage.setItem("chatRegenText", JSON.stringify(regenText));
    localStorage.setItem(
      "chatCurrentRegenText",
      JSON.stringify(CurrentRegenText)
    );
  }, [
    characters,
    userName,
    userDescription,
    userPronouns,
    model,
    apiKey,
    validated,
    systemPrompt,
  ]);

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
      `Hello! I'm ${character.name}, how can I help you today?`;

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
      c.id === characterId ? { ...c, chats: [...c.chats, newChat] } : c
    );

    setCharacters(updatedCharacters);
    setSelectedCharacterId(characterId);
    setSelectedChatId(newChat.id);
    setMessages(newChat.messages);
  };

  const handleBotSettingsClick = (characterId: string) => {
    setSelectedCharacterId(characterId);
    // If this character has chats, select the first one
    const character = characters.find((c) => c.id === characterId);
    if (character && character.chats.length > 0) {
      setSelectedChatId(character.chats[0].id);
      setMessages(character.chats[0].messages);
    }
    setShowBotSettings(!showBotSettings);
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
                    : chat
                ),
              }
            : character
        );
        setCharacters(updatedCharacters);
      }

      setEditingIndex(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const startEditingChatName = (
    characterId: string,
    chatId: string,
    currentName: string
  ) => {
    setEditingChatId(chatId);
    setEditChatName(currentName);
    setEditingCharacterId(characterId);
  };

  const SwitchInResponse = (regenIndex: number, index: number) => {
    setCurrentRegenText(regenIndex);
    const updatedMessages = messages.slice(0, index);
    setMessages(updatedMessages);
    setMessages((prev) => [
      ...prev,
      { sender: "ai" as const, text: regenText[regenIndex] },
    ]);
  };
  const SwitchDeResponse = (regenIndex: number, index: number) => {
    setCurrentRegenText(regenIndex);
    const updatedMessages = messages.slice(0, index);
    setMessages(updatedMessages);
    setMessages((prev) => [
      ...prev,
      { sender: "ai" as const, text: regenText[regenIndex] },
    ]);
  };
  const DeleteAndRegenerateChat = (characterId: string, chatId: string) => {
    // Find the last AI message to regenerate from
    const lastUserMessageIndex = messages
      .map((msg, index) => (msg.sender === "user" ? index : -1))
      .filter((i) => i !== -1)
      .pop();

    if (lastUserMessageIndex !== undefined && lastUserMessageIndex >= 0) {
      // Delete everything after the last user message and regenerate
      if (
        messages.length > 0 &&
        messages[messages.length - 1].sender != "user" &&
        !isLoadingRef.current
      ) {
        deleteMessage(lastUserMessageIndex + 1);
      }
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
          getCurrentChat()?.title || ""
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

        // Find the latest message that can be edited (not the loading message)
        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];
        if (CurrentRegenText<regenText.length-1){
        SwitchInResponse(CurrentRegenText+1, latestMessageIndex);
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

        // Find the latest message that can be edited (not the loading message)
        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];
        if(CurrentRegenText>0){
          SwitchDeResponse(CurrentRegenText-1, latestMessageIndex);
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
          (c) => c.id === selectedCharacterId
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
        (chat) => chat.id === selectedChatId
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
          getCurrentChat()?.id || ""
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

  const deleteCharacter = (characterId: string) => {
    if (characters.length <= 1) {
      alert(
        "You cannot delete the last character. At least one character must remain."
      );
      setShowDeleteCharacterModal(false);
      setCharacterToDelete(null);
      return;
    }

    const updatedCharacters = characters.filter(
      (character) => character.id !== characterId
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
                  text: "Hello! I'm {{char}}, how can I help you today?",
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

        // Reset file input
        event.target.value = "";
      } catch (error) {
        alert(
          "Invalid JSON file. Please select a valid character card JSON file."
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
  };

  // Character and chat management
  const createNewCharacter = () => {
    if (!newCharacterName.trim()) return;

    const firstMessage = newCharacterFirstMessage.trim()
      ? newCharacterFirstMessage
      : `Hello! I'm ${newCharacterName}, how can I help you today?`;

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: newCharacterName,
      alias: newCharacterAlias.trim() || undefined,
      personality: newCharacterPersonality,
      scenario: newCharacterScenario,
      firstMessage: firstMessage, // Store the first message
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
    setNewCharacterScenario("");
    setNewCharacterFirstMessage(""); // Reset first message
    setShowNewCharacterModal(false);
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
                  : chat
              ),
            }
          : character
      );

      setCharacters(updatedCharacters);
      setEditingChatId(null);
      setEditingCharacterId(null);
      setEditChatName("");
    }
  };

  const cancelEditChatName = () => {
    setEditingChatId(null);
    setEditingCharacterId(null);
    setEditChatName("");
  };

  const deleteMessage = (index: number) => {
    if (messages[index].sender === "ai") {
      setShowRegenerate(true);
      setRegenerateFromIndex(index - 1);
    } else {
      setShowRegenerate(false);
      setRegenerateFromIndex(null);
    }

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
                  : chat
              ),
            }
          : character
      );
      setCharacters(updatedCharacters);
    }
  };

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const validateApibutton = async () => {
    setValidating(true);
    const isValid = await validateApiKey(apiKey);
    setToastMessage(isValid ? "API Key is valid" : "API Key is invalid");
    setValidcolor(isValid ? "bg-green-400/50" : "bg-red-200/50");
    setValidated(isValid);
    setValidating(false);
  };

  // You can use this function to validate the API key when needed

  const resetApiSettings = () => {
    setModel("deepseek/deepseek-chat-v3.1");
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
  }: {
    character: Character;
    messages: Message[];
    userName: string;
    userPronouns: { p1: string; p2: string; p3: string };
    userDescription: string;
    regen: boolean;
  }) => {
    try {
      let systemMessage = systemPrompt;
      if (character.personality.trim())
        systemMessage += `\n\nCharacter Personality: ${character.personality}`;
      if (character.scenario.trim())
        systemMessage += `\n\nScenario: ${character.scenario}`;
      if (userDescription.trim())
        systemMessage += `\n\nUser Description: ${userDescription}`;
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
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: systemMessage },
              ...messagesWithNames,
            ],
            stream: true,
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let aiResponse = "";

      if (regen) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai" as const, text: "..." },
        ]);
      }

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
              const content = data.choices[0]?.delta?.content;
              if (content) {
                aiResponse += content;
                setMessages((prev) => {
                  const updated = [
                    ...prev.slice(0, -1),
                    { sender: "ai" as const, text: aiResponse },
                  ];

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
                                : chat
                            ),
                          }
                        : character
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
        if (!regen) {
          setRegenText([aiResponse]);
          setCurrentRegenText(0);
        } else {
          setRegenText([...regenText, aiResponse]);
          setCurrentRegenText(CurrentRegenText + 1);
        }
      }
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

  const regenerateResponse = async (fromIndex: number) => {
    if (fromIndex < 0 || fromIndex >= messages.length || isLoadingRef.current)
      return;

    setIsLoading(true);
    isLoadingRef.current = true;
    setRegenerateFromIndex(null);
    setShowRegenerate(false);

    const character = getCurrentCharacter();
    if (!character) return;

    const messagesToRegenerate = messages.slice(0, fromIndex + 1);

    try {
      await handleAPIRequest({
        character,
        messages: messagesToRegenerate,
        userName,
        userPronouns,
        userDescription,
        regen: true,
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
        : character
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
          c.id === characterId ? { ...c, chats: [newChat] } : c
        );

        setCharacters(finalCharacters);
        setSelectedChatId(newChat.id);
        setMessages(newChat.messages);
      }
    }
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
                : chat
            ),
          }
        : c
    );
    setCharacters(updatedCharacters);
  };

  const resetNames = () => {
    setUserName("You");
    setUserPronouns({ p1: "he", p2: "his", p3: "him" });
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
          <a
            className="w-1/8 bg-blue-500 hover:bg-blue-600 text-white mr-2 py-2 px-2 rounded-lg flex items-center justify-center gap-2"
            href="/"
          >
            <div className="font-bold">⇦</div>
          </a>
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
                <h3 className="font-semibold text-gray-800">
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
                        <div className="flex md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            className="text-blue-500 hover:text-blue-700 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingChatName(
                                character.id,
                                chat.id,
                                chat.title
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
        <div className="p-4 text-center text-gray-400 flex justify-center items-center italic">
          Use it at your own risk.
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
            <h1 className="text-xl font-bold text-gray-800">
              {getCurrentCharacter()?.name || "AI"}{" "}
              {getCurrentCharacter()?.alias && (
                <>({getCurrentCharacter()?.alias})</>
              )}
              : {getCurrentChat()?.title}
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
        {showHelp && (
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
                        <span>
                          Send Message, Confirm Deletion, and Confirm Edit
                        </span>
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
                        <span>
                          Close Modals, Cancel Edit, and Unfocus Input
                        </span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          ESC
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Focus Input</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          F
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Toggle Sidebar</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          `
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Edit Latest Message</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          E
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Regenerate Latest Message</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          R
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Open Help</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          H
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Open User Settings</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          U
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Open API Settings</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          A
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Open Prompt Settings</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          P
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Create New Character</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          N
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Start New Chat with Current Character</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          C
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Delete Current Chat</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          D
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Open Current Character Settings</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          B
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Edit Current Chat Name</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          V
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Previous Regenerate</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          -
                        </kbd>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded">
                        <span>Next Regenerate</span>
                        <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">
                          =
                        </kbd>
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
                      💡 Shortcuts don't work when typing in text fields or
                      inputs!
                    </p>
                    <p className="text-xs text-blue-600">
                      💡 Arrow keys only work when multiple characters/chats
                      exist!
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
                      💡 Placeholders work in personality, scenario, first
                      messages, and system prompts!
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
                          <strong>Multiple Characters:</strong> Create different
                          AI personas
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          <strong>Multiple Chats:</strong> Separate
                          conversations per character
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span>•</span>
                        <span>
                          <strong>Streaming Responses:</strong> See AI responses
                          in real-time
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
                        💡 The app uses OpenRouter which supports multiple AI
                        models through a single API!
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                      💡 Pro Tips
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        • Use ← and → arrow keys to navigate between characters
                      </p>
                      <p>
                        • Use ↑ and ↓ arrow keys to navigate between chats
                        within a character
                      </p>
                      <p>• Press E to quickly edit your latest message</p>
                      <p>• Press R to regenerate the last AI response</p>
                      <p>• Press ESC to cancel editing or close modals</p>
                      <p>
                        • Use keyboard shortcuts for quick navigation (H for
                        help, U for user settings, etc.)
                      </p>
                      <p>
                        • Use aliases to distinguish similar character names
                      </p>
                      <p>• Import character cards for quick setup</p>
                      <p>• Customize system prompts for specific AI behavior</p>
                      <p>• Use placeholders to make prompts dynamic</p>
                      <p>• Regenerate responses by deleting AI messages</p>
                      <p>• Edit messages to fix typos or improve responses</p>
                      <p>• Press ` (backtick) to quickly toggle the sidebar</p>
                    </div>
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
                      accept=".json,application/json"
                      onChange={importCharacterCard}
                      className="hidden"
                      id="character-import"
                    />
                    📥 Import Character Card
                  </label>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Select a JSON character card file (.json)
                  </p>
                </div>

                <div className="space-y-4">
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
                            : c
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
                            : c
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
                            : c
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
                            : c
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
                            : c
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
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* API Settings Tab */}
                  {settingsTab === "api" && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-3">
                          🤖 AI Model
                        </h3>
                        <input
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="e.g. deepseek/deepseek-chat-v3.1"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Choose which AI model to use for responses
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
                            }}
                            placeholder="Enter your OpenRouter API key"
                          />
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                            onClick={validateApibutton}
                          >
                            {validating ? "Validating..." : "Validate"}
                          </button>
                        </div>
                        {toastMessage && (
                          <CustomToast
                            message={toastMessage}
                            color={validcolor}
                            onClose={() => setToastMessage("")}
                          />
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Your API key is stored locally and never sent to any
                          server except OpenRouter
                        </p>
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
                          <p>
                            • Endpoint:
                            https://openrouter.ai/api/v1/chat/completions
                          </p>
                        </div>
                        <h3 className="font-semibold text-gray-700 mt-3">
                          ⚠️ Note
                        </h3>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            Currently, only the OpenRouter endpoint is
                            available. For other APIs like Chutes or Deepseek,
                            you will need to use the{" "}
                            <a
                              href="https://openrouter.ai/settings/integrations"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-blue-500"
                            >
                              BYOK
                            </a>{" "}
                            (Bring Your Own Key) feature within OpenRouter.
                          </p>
                        </div>
                      </div>
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
                    </>
                  )}

                  {settingsTab === "user" && (
                    <>
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
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteCharacterModal(false)}
          >
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600">
                  ⚠️ Delete Character
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowDeleteCharacterModal(false)}
                >
                  &times;
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this character? This will also
                delete all chats associated with this character. This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  onClick={() => setShowDeleteCharacterModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                  onClick={() => deleteCharacter(characterToDelete)}
                  autoFocus
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Chat Warning Modal */}
        {showDeleteChatModal && chatToDelete && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteChatModal(false)}
          >
            <div
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600">
                  ⚠️ Delete Chat
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  onClick={() => setShowDeleteChatModal(false)}
                >
                  &times;
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this chat? This action cannot be
                undone.
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                  onClick={() => setShowDeleteChatModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                  onClick={() => {
                    if (chatToDelete) {
                      deleteChat(chatToDelete.characterId, chatToDelete.chatId);
                      setShowDeleteChatModal(false);
                      setChatToDelete(null);
                    }
                  }}
                  autoFocus
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Chat Container */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {/* Chat Messages */}
          <div ref={scrollContainerRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-2xl p-4 shadow-sm transition-all ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="text-xs font-semibold mb-2 opacity-80">
                    {msg.sender === "user"
                      ? `👤 ${userName}`
                      : `🤖 ${getCurrentCharacter()?.name || "AI"}`}
                  </div>
                  {editingIndex === i ? (
                    <div className="space-y-3">
                      <textarea
                        ref={textareaRef}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 resize-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
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
                      <div
                        className="message-content"
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
                              className={`text-xs ${
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
                                className="text-xs text-green-500 hover:text-red-700 transition-colors"
                                onClick={() =>
                                  DeleteAndRegenerateChat(
                                    getCurrentCharacter()?.id || "",
                                    getCurrentChat()?.id || ""
                                  )
                                }
                              >
                                🔄 Regenerate
                              </button>
                            )}
                            <button
                              className="text-xs text-red-500 hover:text-red-700 transition-colors"
                              onClick={() => deleteMessage(i)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          {i === messages.length - 1 && msg.sender === "ai" && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <button
                                className="hover:text-gray-700 disabled:opacity-50"
                                disabled={CurrentRegenText === 0}
                                onClick={() =>
                                  SwitchDeResponse(CurrentRegenText - 1, i)
                                }
                              >
                                ◀
                              </button>
                              <span>
                                {CurrentRegenText + 1}/{regenText.length}
                              </span>
                              <button
                                className="hover:text-gray-700 disabled:opacity-50"
                                disabled={
                                  CurrentRegenText === regenText.length - 1
                                }
                                onClick={() =>
                                  SwitchInResponse(CurrentRegenText + 1, i)
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
          <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-200">
            <div className="flex space-x-3">
              <textarea
                id="messageInput"
                className="flex-1 border-0 text-black bg-gray-100 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
                    validated &&
                    !showRegenerate
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[80px]"
                onClick={sendMessage}
                disabled={
                  isLoadingRef.current ||
                  apiKey === "" ||
                  !validated ||
                  showRegenerate ||
                  !input.trim()
                }
              >
                {isLoadingRef.current ? (
                  <span className="animate-pulse">⏳</span>
                ) : (
                  <span className="flex items-center gap-2">📤 Send</span>
                )}
              </button>
            </div>
            {apiKey === "" && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please enter your OpenRouter API key and validate it in the
                setting to sent messages.
              </p>
            )}
            {!validated && apiKey !== "" && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please validate your OpenRouter API key in the setting to sent
                messages.
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
