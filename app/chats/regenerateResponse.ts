import { Character, Message } from "./interfaces"; // adjust as needed
import {
  APIRequestParams,
  handleAPIRequestFunc,
  APIRequestContext,
} from "./handleAPIRequest";

interface RegenerateContext extends APIRequestContext {
  messages: Message[];
  userName: string;
  userPronouns: { p1: string; p2: string; p3: string };
  userDescription: string;
  getCurrentCharacter: () => Character | undefined;
}

export const regenerateResponseFunc = async (
  fromIndex: number,
  ctx: RegenerateContext,
): Promise<void> => {
  const {
    messages,
    userName,
    userPronouns,
    userDescription,
    getCurrentCharacter,
    isLoadingRef,
    setIsLoading,
    setMessages,
  } = ctx;

  if (fromIndex < 0 || fromIndex >= messages.length || isLoadingRef.current)
    return;

  setIsLoading(true);
  isLoadingRef.current = true;

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
    await handleAPIRequestFunc(
      {
        character,
        messages: messagesToRegenerate,
        userName,
        userPronouns,
        userDescription,
        regen: true,
        targetMessageIndex,
      },
      ctx, // APIRequestContext is a subset of RegenerateContext, so it satisfies the type
    );
  } catch (error) {
    console.error("Error:", error);
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "ai" as const, text: "(Error fetching response)" },
    ]);
  } finally {
    setIsLoading(false);
    isLoadingRef.current = false;
  }
};
