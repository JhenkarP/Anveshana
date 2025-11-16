import React, { useState, useEffect, useRef } from "react";

// Map of UI language name -> backend NLLB code
const LANGUAGE_OPTIONS = {
  English: "eng_Latn",
  Hindi: "hin_Deva",
  Bengali: "ben_Beng",
  Marathi: "mar_Deva",
  Telugu: "tel_Telu",
  Tamil: "tam_Taml",
  Gujarati: "guj_Gujr",
  Kannada: "kan_Knda",
  Malayalam: "mal_Mlym",
  Punjabi: "pan_Guru",
  Odia: "ory_Orya",
  Urdu: "urd_Arab",
  Assamese: "asm_Beng",
  Bodo: "brx_Deva",
  Dogri: "doi_Deva",
  Konkani: "kok_Deva",
  Maithili: "mai_Deva",
  "Meitei (Manipuri)": "mni_Beng",
  Sanskrit: "san_Deva",
  Santali: "sat_Olck",
  Sindhi: "snd_Arab",
  Kashmiri: "kas_Arab",
  Nepali: "npi_Deva",
  Tulu: "tcy_Knda",
  French: "fra_Latn",
  Spanish: "spa_Latn",
  German: "deu_Latn",
  Portuguese: "por_Latn",
  "Chinese (Simplified)": "zho_Hans",
  Japanese: "jpn_Jpan",
  Korean: "kor_Hang",
  Arabic: "ara_Arab",
};

const WS_URL = "ws://127.0.0.1:8000/ws/chat/global";

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

const GlobalChat = () => {
  const availableLanguages = Object.keys(LANGUAGE_OPTIONS);

  const [userId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().substring(0, 8)
      : "User" + Date.now()
  );

  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "system-1",
      original_text:
        "Welcome! Pick your language in settings to see live translations.",
      display_text:
        "Welcome! Pick your language in settings to see live translations.",
      userId: "System",
      timestamp: new Date(),
      isTranslated: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect / reconnect WebSocket when language or userId changes
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setIsReady(false);

    ws.onopen = () => {
      const tgt_code = LANGUAGE_OPTIONS[defaultLanguage] || "eng_Latn";
      ws.send(
        JSON.stringify({
          user_id: userId,
          tgt_lang: tgt_code,
        })
      );
      setIsReady(true);
      console.log("WS connected as", userId, "->", tgt_code);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // data shape from backend:
        // { id, chat_id, from_user, to_user, original_text, translated_text, src_lang, tgt_lang, created_at }

        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            original_text: data.original_text,
            display_text: data.translated_text,
            userId: data.from_user,
            timestamp: data.created_at ? new Date(data.created_at) : new Date(),
            isTranslated: true,
            src_lang: data.src_lang,
            tgt_lang: data.tgt_lang,
          },
        ]);
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    ws.onclose = () => {
      setIsReady(false);
      console.log("WS closed");
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
    };

    return () => {
      ws.close();
    };
  }, [defaultLanguage, userId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const originalText = newMessage.trim();
    if (!originalText || !wsRef.current || wsRef.current.readyState !== 1)
      return;

    wsRef.current.send(
      JSON.stringify({
        text: originalText,
      })
    );

    setNewMessage("");
  };

  const placeholderText = `Type your message in any language (You will see it in: ${defaultLanguage})...`;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image layer */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Translate.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: "rgba(7, 10, 16, 0.6)" }}
        aria-hidden="true"
      />

      {/* Chat Container */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-xl shadow-2xl shadow-blue-900/50 border border-gray-800 flex flex-col h-[90vh] max-h-[800px] mx-4">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center relative">
          <h1 className="text-2xl font-bold text-blue-400">Global Chat 💬</h1>

          <div className="flex items-center gap-4">
            <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
              Your ID:{" "}
              <span className="font-mono text-white bg-gray-800 px-2 py-1 rounded-md">
                {userId}
              </span>
            </div>

            <button
              onClick={() => setIsSettingsOpen((open) => !open)}
              className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-gray-800 transition"
              aria-label="Chat Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>

          {isSettingsOpen && (
            <div className="absolute top-full right-4 mt-2 p-4 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 w-72">
              <label className="block text-sm font-medium text-white mb-2">
                See all messages translated to:
              </label>
              <select
                value={defaultLanguage}
                onChange={(e) => {
                  setDefaultLanguage(e.target.value);
                  setIsSettingsOpen(false);
                }}
                className="w-full p-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Backend code:{" "}
                <span className="font-mono text-blue-300">
                  {LANGUAGE_OPTIONS[defaultLanguage]}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
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
                  className={`max-w-[80%] sm:max-w-[65%] p-3 rounded-xl shadow-md transition-all ${
                    msg.userId === userId
                      ? "bg-blue-600 text-white rounded-br-none"
                      : msg.userId === "System"
                      ? "bg-gray-700 text-white rounded-xl"
                      : "bg-gray-800 text-white rounded-tl-none"
                  }`}
                >
                  {msg.userId !== userId && msg.userId !== "System" && (
                    <div className="text-xs font-semibold mb-1 truncate text-blue-300">
                      {msg.userId}
                    </div>
                  )}

                  {msg.isTranslated && (
                    <div className="text-[11px] text-blue-200 font-semibold mb-1">
                      Translated to{" "}
                      <span className="italic">{defaultLanguage}</span>
                    </div>
                  )}

                  <p className="text-sm sm:text-base whitespace-pre-wrap">
                    {msg.display_text}
                  </p>

                  {msg.original_text &&
                    msg.original_text !== msg.display_text && (
                      <p className="text-[11px] text-gray-300 mt-1 italic">
                        Original: {msg.original_text}
                      </p>
                    )}

                  <div className="text-right text-[10px] mt-1 opacity-70">
                    {msg.timestamp instanceof Date
                      ? msg.timestamp.toLocaleTimeString()
                      : typeof msg.timestamp === "string"
                      ? new Date(msg.timestamp).toLocaleTimeString()
                      : "..."}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
