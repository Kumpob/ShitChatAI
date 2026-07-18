import { Character, Message } from "./interfaces";

export interface APIRequestContext {
  // State values
  systemPrompt: string;
  sendPronouns: boolean;
  model: string;
  temperature: number;
  showThinking: boolean;
  thinkingEffort: string;
  maxTokens: number;
  endpointUrl: string;
  apiKey: string;
  selectedCharacterId: string | null;
  selectedChatId: string | null;
  // Refs
  abortControllerRef: React.RefObject<AbortController | null>;
  isLoadingRef: React.RefObject<boolean>;
  // Setters
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface APIRequestParams {
  character: Character;
  messages: Message[];
  userName: string;
  userPronouns: { p1: string; p2: string; p3: string };
  userDescription: string;
  regen: boolean;
  targetMessageIndex?: number;
}

export const handleAPIRequestFunc = async (
  params: APIRequestParams,
  ctx: APIRequestContext,
): Promise<void> => {
  const {
    character,
    messages,
    userName,
    userPronouns,
    userDescription,
    regen,
    targetMessageIndex,
  } = params;
  const {
    systemPrompt,
    sendPronouns,
    model,
    temperature,
    showThinking,
    thinkingEffort,
    maxTokens,
    endpointUrl,
    apiKey,
    selectedCharacterId,
    selectedChatId,
    abortControllerRef,
    isLoadingRef,
    setMessages,
    setCharacters,
    setIsLoading,
  } = ctx;

  let aiResponse = "";
  let aiThinking = "";
  try {
    // let systemMessage = systemPrompt;
    // systemMessage += `\n\nCharacter Name: ${character.name}`;
    // if (character.personality.trim())
    //   systemMessage += `\n\nCharacter Personality: ${character.personality}`;
    // if (character.scenario.trim())
    //   systemMessage += `\n\nScenario: ${character.scenario}`;
    // systemMessage += `\n\nUser Name: ${userName}`;
    // if (userDescription.trim())
    //   systemMessage += `\n\nUser Description: ${userDescription}`;
    // if (
    //   userPronouns.p1.trim() ||
    //   userPronouns.p2.trim() ||
    //   userPronouns.p3.trim()
    // )
    //   systemMessage += `\n\nUser Pronouns: ${userPronouns.p1}/${userPronouns.p2}/${userPronouns.p3}`;
    let systemMessage = systemPrompt;
    systemMessage += `\n<${character.name}'s Persona>\nName: ${character.name}`;
    if (character.personality.trim())
      systemMessage += `\nDescription: ${character.personality}</${character.name}'s Persona>`;
    if (character.scenario.trim())
      systemMessage += `\n<Scenario>\n${character.scenario}</Scenario>`;
    systemMessage += `\n<${userName}'s Persona>\nName: ${userName}`;
    if (userDescription.trim())
      systemMessage += `\nDescription: ${userDescription}`;
    if (sendPronouns && (
      userPronouns.p1.trim() ||
      userPronouns.p2.trim() ||
      userPronouns.p3.trim()
    ))
      systemMessage += `\nPronouns: ${userPronouns.p1}/${userPronouns.p2}/${userPronouns.p3}`;
    systemMessage += `</${userName}'s Persona}>\n`;
    systemMessage = systemMessage
      .replace(/\{\{char\}\}/g, character.name)
      .replace(/\{char\}/g, character.name)
      .replace(/\{\{user\}\}/g, userName)
      .replace(/\{user\}/g, userName)
      .replace(/\{\{p1\}\}/g, userPronouns.p1)
      .replace(/\{p1\}/g, userPronouns.p1)
      .replace(/\{\{sub\}\}/g, userPronouns.p1)
      .replace(/\{sub\}/g, userPronouns.p1)
      .replace(/\{\{p2\}\}/g, userPronouns.p2)
      .replace(/\{p2\}/g, userPronouns.p2)
      .replace(/\{\{poss\}\}/g, userPronouns.p2)
      .replace(/\{poss\}/g, userPronouns.p2)
      .replace(/\{\{p3\}\}/g, userPronouns.p3)
      .replace(/\{p3\}/g, userPronouns.p3)
      .replace(/\{\{obj\}\}/g, userPronouns.p3)
      .replace(/\{obj\}/g, userPronouns.p3);

    console.log("System Message:", systemMessage);
    // add notes to the last message
    let notes = "";
    if (sendPronouns) {
      notes =
        "\nSYSTEM NOTE: {{user}} uses {{p1}}/{{p2}}/{{p3}} pronouns. Always use these pronouns when referring to {{user}}.";
    }

    const lastUserIndex = messages.findLastIndex((m) => m.sender === "user");
    const messagesAddNotes = messages.map((m, index) => {
      if (index === lastUserIndex) {
        return {
          ...m,
          text: m.text + notes,
        };
      }
      return m;
    });
    const messagesAddSender = messagesAddNotes.map((m) => {
      if (m.sender === "user") {
        return { ...m, text: "{{user}}: " + m.text };
      }
      return m;
    });
    const messagesWithNames = messagesAddSender.map((m) => {
      const role = m.sender === "user" ? "user" : "assistant";
      let content = m.text;
      content = content.replace(/\{\{user\}\}/g, userName);
      content = content.replace(/\{user\}/g, userName);
      content = content.replace(/\{\{char\}\}/g, character.name);
      content = content.replace(/\{char\}/g, character.name);
      content = content.replace(/\{\{p1\}\}/g, userPronouns.p1);
      content = content.replace(/\{p1\}/g, userPronouns.p1);
      content = content.replace(/\{\{sub\}\}/g, userPronouns.p1);
      content = content.replace(/\{sub\}/g, userPronouns.p1);
      content = content.replace(/\{\{p2\}\}/g, userPronouns.p2);
      content = content.replace(/\{p2\}/g, userPronouns.p2);
      content = content.replace(/\{\{poss\}\}/g, userPronouns.p2);
      content = content.replace(/\{poss\}/g, userPronouns.p2);
      content = content.replace(/\{\{p3\}\}/g, userPronouns.p3);
      content = content.replace(/\{p3\}/g, userPronouns.p3);
      content = content.replace(/\{\{obj\}\}/g, userPronouns.p3);
      content = content.replace(/\{obj\}/g, userPronouns.p3);
      return { role, content };
    });
    console.log("Messages with names:", messagesWithNames);
    if (regen) {
      systemMessage += ``;
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
        const currentThinking = targetMsg.regeneratedThinking
          ? [...targetMsg.regeneratedThinking]
          : [""];

        // Add a placeholder for the new response
        currentResponses.push("...");
        currentThinking.push("");

        targetMsg.regeneratedResponses = currentResponses;
        targetMsg.regeneratedThinking = currentThinking;
        targetMsg.currentResponseIndex = currentResponses.length - 1;
        targetMsg.text = "..."; // Show loading...
        targetMsg.thinking = "";

        updated[targetMessageIndex] = targetMsg;
        return updated;
      } else if (regen || updated.length === messages.length) {
        // New message (either regen new or normal send)
        // If normal send, targetMessageIndex is undefined. We append.

        return [
          ...updated,
          {
            sender: "ai" as const,
            text: "...",
            regeneratedResponses: ["..."],
            regeneratedThinking: [""],
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
                  msg.thinking = aiThinking;

                  if (
                    msg.regeneratedResponses &&
                    msg.currentResponseIndex !== undefined
                  ) {
                    const newRegen = [...msg.regeneratedResponses];
                    newRegen[msg.currentResponseIndex] = aiResponse;
                    msg.regeneratedResponses = newRegen;
                  } else {
                    msg.regeneratedResponses = [aiResponse];
                    msg.currentResponseIndex = 0;
                  }
                  if (msg.currentResponseIndex !== undefined) {
                    const newRegenThinking = msg.regeneratedThinking
                      ? [...msg.regeneratedThinking]
                      : Array(msg.regeneratedResponses!.length).fill("");
                    // if showThinking is off, store "" so indexes stay aligned
                    newRegenThinking[msg.currentResponseIndex] = showThinking
                      ? aiThinking
                      : "";
                    msg.regeneratedThinking = newRegenThinking;
                  }

                  updated[targetIdx] = msg;
                }

                return updated;
              });
              // Update characters state
            }
          } catch (e) {
            console.error("Error parsing JSON:", e, line);
          }
        }
      }
    }
    setMessages((prev) => {
      if (selectedCharacterId && selectedChatId) {
        setCharacters((prevChars) =>
          prevChars.map((c) =>
            c.id === selectedCharacterId
              ? {
                  ...c,
                  chats: c.chats.map((chat) =>
                    chat.id === selectedChatId
                      ? { ...chat, messages: prev, lastActive: Date.now() }
                      : chat,
                  ),
                }
              : c,
          ),
        );
      }
      return prev; // don't change messages, just read them
    });
    console.log("Full AI response:", aiResponse);
    console.log("Full AI thinking:", aiThinking);
  } catch (error) {
    if ((error as any).name === "AbortError") {
      setMessages((prev) => {
        const updated = [...prev];
        const idx = targetMessageIndex ?? updated.length - 1;
        if (updated[idx]) {
          const msg = { ...updated[idx] };
          // No response was produced — set response to "" but keep thinking
          if (aiResponse === "") {
            msg.text = "";
            if (
              msg.regeneratedResponses &&
              msg.currentResponseIndex !== undefined
            ) {
              const newRegen = [...msg.regeneratedResponses];
              newRegen[msg.currentResponseIndex] = "";
              msg.regeneratedResponses = newRegen;
            }
          }
          // regeneratedThinking already has whatever was streamed — leave it
          updated[idx] = msg;
        }
        return updated;
      });
      return;
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
