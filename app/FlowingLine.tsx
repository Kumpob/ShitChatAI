"use client";
import { useEffect, useRef, useState } from "react";

const WORD_LIST = [
  // Core AI / Chat
  "AI",
  "Chatbot",
  "Prompt",
  "NPC",
  "GPT",
  "Model",
  "Neural",
  "Agent",
  "Dialogue",
  "Message",
  "Assistant",
  "Persona",
  "Avatar",
  "Simulation",
  "Digital",
  "Synthetic",

  // Storytelling / Roleplay
  "Scenario",
  "Companion",
  "Fantasy",
  "Character",
  "Conversation",
  "Drama",
  "Emotion",
  "Story",
  "Narrative",
  "Plot",
  "Adventure",
  "Quest",
  "Journey",
  "Improv",
  "Scene",
  "Lore",
  "Arc",
  "Roleplay",
  "Campaign",
  "Episode",
  "Worldbuilding",

  // Feelings / Interaction
  "Trust",
  "Empathy",
  "Bond",
  "Friendship",
  "Connection",
  "Imagination",
  "Dream",
  "Memory",
  "Curiosity",
  "Creativity",
  "Expression",
  "Identity",
  "Vibe",
  "Mood",
  "Inspiration",

  // Genres / Vibes
  "Sci-Fi",
  "Cyberpunk",
  "Myth",
  "Legend",
  "Hero",
  "Villain",
  "Romance",
  "Comedy",
  "Mystery",
  "Horror",
  "Thriller",
  "Magic",
  "Spell",
  "Sword",
  "Realm",
  "Universe",
  "Galaxy",
  "Future",
  "Dystopia",
  "Utopia",

  // Misc world flavor
  "Echo",
  "Whisper",
  "Shadow",
  "Light",
  "Flame",
  "Crystal",
  "Mirror",
  "Portal",
  "Dreamscape",
  "Chronicle",
  "Saga",
  "Verse",
  "Dimension",
  "Entity",
  "Oracle",
  "Prophecy",
  "Mythos",
];

function getRandomWord(exclude: string[] = []) {
  let word;
  do {
    word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  } while (exclude.includes(word));
  return word;
}

function getRandomTriggerOffset() {
  return 0.05 + Math.random() * 0.2; // 5% – 30%
}

interface FlowingLineProps {
  direction: "left" | "right";
  delay?: number;
}

interface WordInstance {
  id: number;
  word: string;
  x: number;
  triggerOffset: number; // 👈 unique per word
}

const SPEED = 250; // px per second
let globalId = 0;

export default function FlowingLine({
  direction,
  delay = 0,
}: FlowingLineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState<WordInstance[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    let animationFrame: number;
    let lastTime: number | null = null;

    const containerWidth = containerRef.current?.offsetWidth || 800;

    if (!initialized.current) {
      const baseSpacing = 500; // average distance
      const spacingVariance = 220; // how much to vary ±

      const dir = direction === "left" ? -1 : 1;
      const screenWidth = containerRef.current?.offsetWidth || 800;
      const numWords = Math.ceil(screenWidth / baseSpacing) + 6; // a few extra

      const words: WordInstance[] = [];
      const usedWords: string[] = [];

      let cursor = direction === "left" ? screenWidth : -300;

      for (let i = 0; i < numWords; i++) {
        const word = getRandomWord(usedWords);
        // console.log(word);
        usedWords.push(word);

        // Randomize spacing so words aren’t evenly placed
        const spacing =
          baseSpacing + (Math.random() * spacingVariance - spacingVariance / 2);

        // Place word at current cursor, then move cursor
        const x = cursor;
        cursor += dir * spacing;

        // Apply initial offset for delay
        const adjustedX = x + dir * SPEED * (delay / 1000);

        words.push({
          id: globalId++,
          word,
          x: adjustedX,
          triggerOffset: getRandomTriggerOffset(),
        });
      }

      setWords(words);
      initialized.current = true;
    }

    const animate = (time: number) => {
      if (lastTime == null) {
        lastTime = time;
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setWords((prevWords) => {
        const dir = direction === "left" ? -1 : 1;

        const movedWords = prevWords.map((w) => ({
          ...w,
          x: w.x + dir * SPEED * delta,
        }));

        const lastWord = movedWords[movedWords.length - 1];
        const triggerPoint = containerWidth * lastWord.triggerOffset;

        const shouldAddNewWord =
          direction === "left"
            ? lastWord.x <= containerWidth - triggerPoint
            : lastWord.x >= triggerPoint;

        if (shouldAddNewWord) {
          const existingWords = movedWords.map((w) => w.word);

          // randomize starting position so words don't all enter uniformly
          const randomOffset = 100 + Math.random() * 200; // between 100–300px off-screen

          const newWord: WordInstance = {
            id: globalId++,
            word: getRandomWord(existingWords),
            x:
              direction === "left"
                ? containerWidth + randomOffset
                : -randomOffset,
            triggerOffset: getRandomTriggerOffset(),
          };

          movedWords.push(newWord);
        }

        return movedWords.filter((w) => {
          if (direction === "left") return w.x > -300;
          else return w.x < containerWidth + 300;
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // 👇 Always start immediately
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [direction, delay]);

  return (
    <div ref={containerRef} className="relative w-full h-10 overflow-hidden">
      {words.map(({ id, word, x }) => (
        <span
          key={id}
          className="absolute text-white text-xl font-semibold opacity-20 whitespace-nowrap transition-transform"
          style={{
            transform: `translateX(${x}px)`,
            transition: "none",
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
