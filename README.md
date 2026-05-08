# **ShitChatAI**

A lightweight, client-side AI chat app where you can create characters, customize prompts, upload images, manage chats, and talk to AI models via **OpenRouter**, **DeepSeek**, **OpenAI**, or any OpenAI-compatible API endpoint.
All data (characters, chats, images, presets) is stored **locally in your browser** — nothing is uploaded to any server.

---

## 🚀 **Features**

### 👤 **Custom AI Characters**

* Create unlimited characters with name, alias, personality, scenario, and first-message settings
* Optional avatar images (thumbnail + full image)
* Import character cards (`.json` or `.png` with embedded metadata)
* Edit character settings at any time via Bot Settings

### 💬 **Chat System**

* Each character can have multiple chats
* Rename, delete, branch, or clear chats
* Message editing (inline, with auto-resize)
* Delete individual messages
* Chat history saved locally and restored on reload

### 🔄 **AI Responses**

* Streaming responses with live display
* Regenerate responses — multiple regenerations stored per message, switchable with ◀ ▶
* Branch chat from any message to explore alternate paths
* Temperature & max token controls
* Custom system prompt with placeholder support (`{{char}}`, `{{user}}`, `{{p1}}`, `{{p2}}`, `{{p3}}`)
* Default assistance and roleplay system prompt presets

### 🧠 **Thinking / Reasoning Support**

* Toggle thinking on/off per session
* Adjustable thinking effort: `X-High`, `High`, `Medium`, `Low`
* Thinking streams live while response is generating, then auto-collapses when complete
* Thinking stored per regeneration — switches alongside responses when cycling with ◀ ▶
* Compatible with OpenRouter reasoning and DeepSeek native thinking API

### 🔑 **API Presets**

* Save multiple API configurations (model, endpoint URL, API key) as named presets
* Load, edit, and delete presets from a dropdown in API settings
* Editing a preset updates all fields including the active session

### 🧩 **User Identity & Presets**

* Set your username, pronouns (subject/possessive/object), description, and profile image
* Save and load multiple user presets
* Pronoun placeholders (`{{p1}}`, `{{p2}}`, `{{p3}}`) work throughout system prompts and character prompts

### 🖼️ **Image Handling**

* Automatic image compression (WebP with JPEG fallback)
* Separate thumbnail (5KB / 200px) and full image (75KB / 1200px) versions
* Full image viewer modal on click
* PNG character card metadata extraction (tEXt chunks)
* External image URL support (with IP exposure warning)

### 💾 **Local Storage Management**

* All data auto-saved on every change
* Storage usage meter (used / maximum capacity)
* "Clear All Data" wipes everything and resets consent
* Quota exceeded detection with user-friendly error

### 🖥️ **Keyboard Shortcuts**

| Key | Action |
|-----|--------|
| `` ` `` | Toggle sidebar |
| `h` | Toggle help |
| `f` | Focus message input |
| `c` | New chat |
| `d` | Delete current chat |
| `r` | Regenerate last response |
| `e` | Edit last message |
| `=` | Next regenerated response |
| `-` | Previous regenerated response |
| `b` | Open bot settings |
| `v` | Rename current chat |
| `n` | New character modal |
| `u` | Open user settings |
| `a` | Open API settings |
| `p` | Open prompt settings |
| `Ctrl + ←/→` | Switch characters |
| `Ctrl + ↑/↓` | Switch chats |
| `Esc` | Close any open modal |

---

## 🔑 **Requirements**

* Any modern browser (Chrome, Firefox, Edge, Safari)
* An API key from a supported provider:
  * [OpenRouter](https://openrouter.ai/keys) — access to 100s of models
  * [OpenAI](https://platform.openai.com/api-keys)
  * [DeepSeek](https://platform.deepseek.com/api_keys)
  * Any OpenAI-compatible endpoint

Your API key is stored locally and only sent to your configured endpoint.

---

## 🛠️ **Tech Stack**

* **Next.js (App Router)**
* **React + TypeScript**
* **TailwindCSS**
* **marked** — Markdown rendering
* **OpenAI-compatible streaming API**
* Client-side image processing (Canvas, WebP/JPEG compression)
* `localStorage` for all persistence

---

## 📦 **Development**

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

---

## ⚠️ **Important Notes**

### 🔒 **All data is local**

Nothing is uploaded — not your chats, API key, characters, or images. Everything lives in your browser's `localStorage`.

### 📱 **Mobile limitations**

iOS Safari has lower localStorage limits (≈ 2–3 MB). Avoid large images if you're on mobile.

### 🧠 **Thinking models**

Thinking/reasoning output only appears with models that support it (e.g. `deepseek/deepseek-r1`, `openai/o3`, etc.). Standard models like `deepseek-v3` will produce no thinking output even with thinking enabled.

---

## 📥 **Importing Character Cards**

Supports:

* `.json` character cards (SillyTavern / TavernAI format)
* `.png` cards with embedded `tEXt` metadata (base64-encoded JSON in `chara` chunk)

Imported images are automatically compressed and stored locally.

---

## 🗑️ **Clearing Data**

Settings → Other → "Clear All Data & Reset Consent" wipes:

* All characters and chats
* User info and presets
* API keys and presets
* Images
* Consent flag (returns to landing page)