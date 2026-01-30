# **ShitChatAI**

A lightweight, client-side AI chat app where you can create characters, customize prompts, upload images, manage chats, and talk to AI models via **OpenRouter**.
All data (characters, chats, images, presets) is stored **locally in your browser** — nothing is uploaded.



## 🚀 **Features**

### 👤 **Custom AI Characters**

* Create unlimited characters
* Personality, scenario, and first-message settings
* Optional avatar images (thumbnail + full image)
* Import character cards (JSON or PNG with embedded metadata)

### 💬 **Chat System**

* Each character can have multiple chats
* Rename, delete, or regenerate chats
* Message editing
* Chat history saved locally

### 🔄 **AI Responses**

* Uses **OpenRouter** API with user-provided API key
* Supports streaming responses
* Regenerate responses
* Temperature & max token controls
* Supports custom system prompts

### 🧠 **User Identity & Presets**

* Set username, pronouns, description, and profile image
* Save & load user presets
* Local-only storage

### 🧩 **Image Handling**

* Automatic image compression (WebP/JPEG depending on browser support)
* Full image viewer modal
* PNG metadata extraction (for character imports)

### 💾 **Local Storage Management**

* Auto-save all app data
* “Clear all data” button
* **Storage usage meter** (used / maximum capacity)
* Detects “storage full” and prevents data loss

### 🖥️ **Keyboard Shortcuts**

* `c` – new chat
* `e` – edit last AI message
* `r` – regenerate last response
* `` ` `` – toggle sidebar
* `h` – toggle help
* And many more…

---

## 🔑 **Requirements**

* Any modern browser
* For AI responses: an **OpenRouter API key**
  (you enter it manually — it’s never sent anywhere else)

---

## 🛠️ **Tech Stack**

* **Next.js (App Router)**
* **React**
* **TypeScript**
* **TailwindCSS**
* **OpenRouter API**
* Client-side image processing:

  * Canvas resizing & compression
  * WebP/JPEG fallback logic
* LocalStorage for all persistence

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

## ⚠️ Important Notes

### 🔒 **All data is local**

Nothing is uploaded — not your chats, API key, or images.

### 📱 **Mobile device limitations**

iOS Safari has:

* Lower localStorage limits (≈ 2–3 MB)
  
---

## 📥 Importing Character Cards

Supports:

* `.json` character cards
* `.png` cards with embedded metadata (tEXt chunks)

Imported images are compressed and stored locally.

---

## 🗑️ Clearing Data

Settings → “Clear All Data” resets:

* Characters
* Chats
* User info
* Images
* Presets
* API keys
* Consent flag

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
