import React, { useState, useRef, useEffect, useMemo } from "react";
import { HiArrowsRightLeft } from "react-icons/hi2";
import api from "../api/axiosinstance";
import { FaPlay } from "react-icons/fa";
function GridDropdown({ value, onChange, languages, id, label }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search and clear query when closing
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return languages;
    return languages.filter((lang) => lang.toLowerCase().includes(q));
  }, [query, languages]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-gray-300 mb-1 block">{label}</label>

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-[#0d1b2a] text-white px-4 py-3 rounded-lg flex items-center justify-between border border-[#1b263b] hover:border-blue-500 transition focus:outline-none"
      >
        <span className="truncate">{value}</span>
        <span className="opacity-80">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute left-0 mt-2 bg-[#0b1320] border border-[#1b263b] text-white rounded-xl shadow-2xl z-50 p-4 max-h-96 overflow-hidden"
          style={{
            width: "130%",
            minWidth: "340px",
          }}
        >
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-[#0d1b2a] border border-[#1b263b] text-white px-3 py-2 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-2 text-sm opacity-70"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Option List */}
          <div className="overflow-y-auto max-h-72 pr-2">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-gray-400 text-sm">
                No results found
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onChange(lang);
                      setOpen(false);
                    }}
                    className={`w-full px-4 py-3  rounded-lg text-left transition-all border transform
                      ${
                        lang === value
                          ? "bg-[#1b263b] border-blue-500 shadow-[0_0_15px_rgba(0,120,255,0.3)] font-medium"
                          : "bg-[#162238] border-[#1b263b] hover:bg-[#1e2f48] hover:shadow-[0_0_12px_rgba(0,110,255,0.25)]"
                      }`}
                    style={{
                      minWidth: "230px",
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Translate() {
  const [fromLang, setFromLang] = useState("English");
  const [toLang, setToLang] = useState("Spanish");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const languages = [
    "Assamese",
    "Asturian",
    "Awadhi",
    "Aymara",
    "Crimean Tatar",
    "Welsh",
    "Danish",
    "German",
    "French",
    "Friulian",
    "Fulfulde",
    "Dinka (Rek)",
    "Dyula",
    "Dzongkha",
    "Greek",
    "English",
    "Esperanto",
    "Estonian",
    "Basque",
    "Ewe",
    "Faroese",
    "Iranian Persian",
    "Icelandic",
    "Italian",
    "Javanese",
    "Japanese",
    "Kabyle",
    "Kachin | Jinghpo",
    "Kamba",
    "Kannada",
    "Kashmiri (Arabic script)",
    "Kashmiri (Devanagari script)",
    "Georgian",
    "Kanuri (Arabic script)",
    "Kanuri (Latin script)",
    "Kazakh",
    "Kabiye",
    "Thai",
    "Khmer",
    "Kikuyu",
    "South Azerbaijani",
    "North Azerbaijani",
    "Bashkir",
    "Bambara",
    "Balinese",
    "Belarusian",
    "Bemba",
    "Bengali",
    "Bhojpuri",
    "Banjar (Latin script)",
    "Tibetan",
    "Bosnian",
    "Buginese",
    "Bulgarian",
    "Catalan",
    "Cebuano",
    "Czech",
    "Chokwe",
    "Central Kurdish",
    "Fijian",
    "Finnish",
    "Fon",
    "Scottish Gaelic",
    "Irish",
    "Galician",
    "Guarani",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hebrew",
    "Hindi",
    "Chhattisgarhi",
    "Croatian",
    "Hungarian",
    "Armenian",
    "Igbo",
    "Ilocano",
    "Indonesian",
    "Kinyarwanda",
    "Kyrgyz",
    "Kimbundu",
    "Konga",
    "Korean",
    "Kurdish (Kurmanji)",
    "Lao",
    "Latvian (Standard)",
    "Limburgish",
    "Lingala",
    "Lithuanian",
    "Luxembourgish",
    "Malagasy",
    "Malay",
    "Maltese",
    "Maori",
    "Marathi",
    "Mazandarani",
    "Minangkabau",
    "Moldovan",
    "Mongolian",
    "Nahuatl",
    "Nepali",
    "Newar",
    "Norwegian",
    "Occitan",
    "Oromo",
    "Pashto",
    "Pennsylvania German",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Quechua",
    "Romanian",
    "Romansh",
    "Runyankore",
    "Russian",
    "Samoan",
    "Sardinian",
    "Sanskrit",
    "Scots",
    "Serbian",
    "Shona",
    "Sicilian",
    "Sindhi",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Southern Sotho",
    "Spanish",
    "Sundanese",
    "Swahili",
    "Swedish",
    "Swiss German",
    "Tagalog",
    "Tahitian",
    "Tajik",
    "Tamil",
    "Tatar",
    "Telugu",
    "Tigrinya",
    "Tok Pisin",
    "Tokelauan",
    "Turkish",
    "Turkmen",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Venda",
    "Vietnamese",
    "Volapük",
    "Walloon",
    "Wolof",
    "Xhosa",
    "Yiddish",
    "Yoruba",
    "Zulu",
  ].sort();

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  function PostAxios() {
    api
      .post("/translate", {
        from: fromLang,
        to: toLang,
        text: inputText,
      })
      .then((res) => setTranslatedText(res.data.translatedText))
      .catch((err) => console.error(err));
  }
  function PlayAudio() {
    api
      .get("/translate/audio", {
        params: {
          text: translatedText,
          lang: toLang,
        },
        responseType: "blob",
      })
      .then((res) => {
        const audioUrl = URL.createObjectURL(res.data);
        const audio = new Audio(audioUrl);
        audio.play();
      })
      .catch((err) => console.error(err));
  }
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center px-4 py-10 text-white">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">AI Translator</h1>
        <p className="text-gray-400">
          Instantly translate text between multiple languages
        </p>
      </div>

      <div className="bg-gray-900 w-full max-w-5xl rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex flex-col w-full md:w-1/3">
            <GridDropdown
              id="from-lang"
              label="From"
              value={fromLang}
              onChange={setFromLang}
              languages={languages}
            />
          </div>

          <button
            onClick={swapLanguages}
            className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition transform hover:rotate-180 duration-300"
          >
            <HiArrowsRightLeft size={22} />
          </button>

          <div className="flex flex-col w-full md:w-1/3">
            <GridDropdown
              id="to-lang"
              label="To"
              value={toLang}
              onChange={setToLang}
              languages={languages}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <textarea
            rows="8"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="bg-gray-800 text-gray-200 p-4 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            rows="8"
            value={translatedText}
            readOnly
            placeholder="Translation will appear here..."
            className="bg-gray-800 text-gray-400 p-4 rounded-xl resize-none cursor-not-allowed"
          />
        </div>

        <div className="flex justify-center mt-8 gap-3">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
            onClick={PostAxios}
          >
            Translate
          </button>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition duration-300 flex items-center justify-center"
            onClick={PlayAudio}
          >
            <p className="mr-2 font-bold">Translated Audio</p>
            <FaPlay size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
