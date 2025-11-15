import React, { useState, useEffect, useRef } from "react";

// Inline SVG for the Settings Icon (Lucide equivalent)
const SettingsIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/**
 * MOCK TRANSLATION FUNCTION:
 * Simulates real-time translation using only client-side logic.
 */
const mockTranslate = (text, targetLang) => {
  switch (targetLang) {
    case "Spanish":
      return `¡Hola! Mensaje traducido: "${text.substring(0, 30)}..."`;
    case "French":
      return `Bonjour! Message traduit: "${text.substring(0, 30)}..."`;
    case "German":
      return `Hallo! Übersetzte Nachricht: "${text.substring(0, 30)}..."`;
    case "Japanese":
      return `こんにちは! 翻訳されたメッセージ: "${text.substring(0, 15)}..."`;
    case "English":
    default:
      return `Hello! Translated message: "${text.substring(0, 30)}..."`;
  }
};

// --- Global Chat Component (Frontend Only) ---
const GlobalChat = () => {
  // Available languages for the selector
  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
  ];

  // 1. Local State Setup
  const [userId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().substring(0, 8)
      : "MockUser"
  );

  // State for translation and UI
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Message Structure: { id, original_text, display_text, userId, timestamp }
  const initialMessages = [
    {
      id: "m1",
      original_text: "Welcome! Select your default language in the settings.",
      display_text: "Welcome! Select your default language in the settings.",
      userId: "System",
      timestamp: new Date(Date.now() - 60000),
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const isReady = true; // Always ready as there are no async operations

  // 2. Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message Function (Frontend Translation and Local State Update)
  const handleSendMessage = (e) => {
    e.preventDefault();
    const originalText = newMessage.trim();
    if (!originalText) return;

    // Perform mock translation immediately
    const translatedText = mockTranslate(originalText, defaultLanguage);

    // Create a new message object
    const newMsg = {
      id: Date.now().toString(),
      original_text: originalText,
      display_text: translatedText, // Use the simulated translation
      userId: userId,
      timestamp: new Date(),
      isTranslated: true, // Always true for this simulation
    };

    // Update local state and clear input
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage("");
  };

  // --- UI Rendering ---
  const placeholderText = `Type your message in any language (Simulated target: ${defaultLanguage})...`;

  return (
    // Wrapper: relative so background layers can be absolutely positioned behind content
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image layer (behind everything) */}
      {/* Put '/global.png' inside your public/ folder so it's served at '/global.png' */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/global.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />

      {/* Dark overlay so text stays readable (adjust opacity if you want lighter/darker) */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: "rgba(7, 10, 16, 0.6)" }}
        aria-hidden="true"
      />

      {/* Main content container (kept your same layout/colors) */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl shadow-blue-900/50 border border-gray-800 flex flex-col h-[90vh] max-h-[800px] mx-4">
        {/* Header and Settings */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-blue-400">
            Global Chat Demo 💬
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
              Your ID:{" "}
              <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded-md">
                {userId}
              </span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-gray-800 transition"
              aria-label="Chat Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Dropdown */}
          {isSettingsOpen && (
            <div className="absolute top-full right-4 mt-2 p-4 bg-gray-700 rounded-lg shadow-xl border border-gray-600 z-10 w-64">
              <label className="block text-sm font-medium text-white mb-2">
                Simulate translation to:
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => {
                  setDefaultLanguage(e.target.value);
                  setIsSettingsOpen(false); // Close after selection
                }}
                className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                *All messages are immediately 'translated' into this format.
              </p>
            </div>
          )}
        </div>

        {/* Message Display Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.userId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[80%] sm:max-w-[65%] p-3 rounded-xl shadow-md transition-all 
                    ${
                      msg.userId === userId
                        ? "bg-blue-600 text-white rounded-br-none"
                        : msg.userId === "System"
                        ? "bg-gray-700 text-white rounded-xl"
                        : "bg-gray-700 text-white rounded-tl-none"
                    }
                  `}
                >
                  {/* User ID and Translation Status */}
                  {msg.userId !== userId && (
                    <div
                      className={`text-xs font-semibold mb-1 truncate text-blue-300`}
                    >
                      {msg.userId}
                    </div>
                  )}
                  {msg.isTranslated && (
                    <div className="text-xs text-blue-200 font-semibold mb-1">
                      Simulated Translation to:{" "}
                      <span className="italic">{defaultLanguage}</span>
                    </div>
                  )}

                  {/* Message Text: Show display_text */}
                  <p className="text-sm sm:text-base whitespace-pre-wrap">
                    {msg.display_text}
                  </p>

                  {/* Timestamp */}
                  <div className="text-right text-xs mt-1 opacity-70">
                    {msg.timestamp instanceof Date
                      ? msg.timestamp.toLocaleTimeString()
                      : "..."}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-800 flex gap-3 bg-transparent"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={placeholderText}
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150"
            disabled={!isReady}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isReady}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-150 shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GlobalChat;
