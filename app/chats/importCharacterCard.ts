import { importCharacterCardFromPNGFunc } from "./importCharacterCardFromPNG";

interface CharacterCardSetters {
  setNewCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterAlias: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterFirstMessage: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterScenario: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterPersonality: React.Dispatch<React.SetStateAction<string>>;
  setNewCharacterStoryContent: React.Dispatch<React.SetStateAction<string>>;
  setTempCharacterImage: React.Dispatch<
    React.SetStateAction<{ thumbnail?: string; fullImage?: string }>
  >;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const importCharacterCardFunc = (
  event: React.ChangeEvent<HTMLInputElement>,
  setters: CharacterCardSetters,
): void => {
  const {
    setNewCharacterName,
    setNewCharacterAlias,
    setNewCharacterFirstMessage,
    setNewCharacterScenario,
    setNewCharacterPersonality,
    setNewCharacterStoryContent,
    setTempCharacterImage,
    setToastMessage,
  } = setters;

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

        const avatar = characterData.avatar || "";
        if (avatar) {
          setTempCharacterImage({ fullImage: avatar, thumbnail: avatar });
        }
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
    importCharacterCardFromPNGFunc(event, setters); // setters shape is identical
  } else {
    setToastMessage("Unsupported file format");
  }
};
