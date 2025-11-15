import React, { useState, useRef, useEffect } from "react";
import { HiMicrophone, HiSpeakerWave } from "react-icons/hi2";
import { HiArrowsRightLeft } from "react-icons/hi2";
import api from "../api/axiosinstance"; // axios instance

export default function Conversation() {
  // languages (complete list)
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

  // UI state
  const [lang1, setLang1] = useState("English");
  const [lang2, setLang2] = useState("Spanish");

  // text shown in the UI
  const [transcript1, setTranscript1] = useState("“Hello! How are you?”");
  const [transcript2, setTranscript2] = useState("“¡Hola! ¿Cómo estás?”");

  // recording & upload state
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  // audio element for playing translated audio
  const translatedAudioRef = useRef(null);

  // swap languages & texts
  const swapLanguages = () => {
    setLang1((l) => {
      const tmp = lang2;
      setLang2(l);
      return tmp;
    });
    // swap transcripts for UI consistency
    setTranscript1((t1) => {
      const t2 = transcript2;
      setTranscript2(t1);
      return t2;
    });
  };

  // map some language names to BCP-47 codes for backend or for TTS fallback
  function mapLanguageToBcp47(name) {
    const map = {
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      German: "de-DE",
      Hindi: "hi-IN",
      Kannada: "kn-IN",
      Italian: "it-IT",
      Portuguese: "pt-PT",
      Russian: "ru-RU",
      Japanese: "ja-JP",
      Chinese: "zh-CN",
      Arabic: "ar-SA",
    };
    return map[name] || "en-US";
  }

  // start recording audio from mic
  async function startRecording() {
    setError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone access is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const options = { mimeType: "audio/webm" }; // compatible in many browsers, backend should accept or adapt
      const recorder = new MediaRecorder(stream, options);

      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstart = () => {
        setIsRecording(true);
        setIsUploading(false);
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        // create a blob from chunks
        const blob = new Blob(audioChunksRef.current, {
          type: audioChunksRef.current[0]?.type || "audio/webm",
        });
        // upload the blob
        await uploadAudioBlob(blob);
        // stop tracks
        try {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        } catch {}
        mediaStreamRef.current = null;
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
    } catch (err) {
      console.error("Could not start recording:", err);
      setError("Could not access microphone: " + (err.message || err));
    }
  }

  // stop recording
  function stopRecording() {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      } else {
        setIsRecording(false);
      }
    } catch (err) {
      console.warn("Error stopping recorder:", err);
      setIsRecording(false);
    }
  }

  // upload audio blob to backend and handle response
  async function uploadAudioBlob(blob) {
    setIsUploading(true);
    setError(null);

    const form = new FormData();
    // backend expects fields: from, to, audio (file), maybe audioType
    form.append("from", lang1);
    form.append("to", lang2);
    form.append("audio", blob, "recording.webm"); // change filename/type if needed
    // optionally send bcp47
    form.append("from_bcp47", mapLanguageToBcp47(lang1));
    form.append("to_bcp47", mapLanguageToBcp47(lang2));

    try {
      // post to your backend endpoint (adjust path if different)
      const resp = await api.post("/translate-audio", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000, // allow longer for uploads / processing
      });

      // expected response shape (example):
      // { originalText: "...", translatedText: "...", translatedAudioUrl: "...", translatedAudioBase64: "data:audio/wav;base64,..." }
      const data = resp.data || {};

      // set texts (fallbacks included)
      if (data.originalText) {
        setTranscript1(data.originalText);
      } else if (data.transcription) {
        setTranscript1(data.transcription);
      }

      if (data.translatedText) {
        setTranscript2(data.translatedText);
      }

      // handle translated audio:
      if (data.translatedAudioUrl) {
        // fetch audio blob then set source
        try {
          const audioResp = await api.get(data.translatedAudioUrl, {
            responseType: "blob",
          });
          const audioBlob = audioResp.data;
          const url = URL.createObjectURL(audioBlob);
          playTranslatedAudioUrl(url);
        } catch (err) {
          console.warn("Failed to fetch translatedAudioUrl:", err);
          // fallback to TTS
          speakTextFallback(data.translatedText || transcript2);
        }
      } else if (data.translatedAudioBase64) {
        // some backends return a data URL or raw base64; handle both
        let base = data.translatedAudioBase64;
        if (!base.startsWith("data:audio")) {
          // assume raw base64 -> build a data URL (use webm or wav depending on backend)
          // If you know the MIME type (e.g., audio/wav), replace 'audio/wav' accordingly.
          base = `data:audio/webm;base64,${base}`;
        }
        // convert to blob
        try {
          const res = await fetch(base);
          const audioBlob = await res.blob();
          const url = URL.createObjectURL(audioBlob);
          playTranslatedAudioUrl(url);
        } catch (err) {
          console.warn("Failed to convert base64 audio:", err);
          speakTextFallback(data.translatedText || transcript2);
        }
      } else {
        // no audio returned: fallback to speechSynthesis
        speakTextFallback(data.translatedText || transcript2);
      }
    } catch (err) {
      console.error("Upload / translation error:", err);
      setError(
        (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          "Translation failed"
      );
    } finally {
      setIsUploading(false);
    }
  }

  // play translated audio url in audio element and auto-revoke after ended
  function playTranslatedAudioUrl(url) {
    if (!translatedAudioRef.current) {
      // create an audio element if not present
      const a = new Audio(url);
      a.onended = () => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      };
      a.play().catch((err) => console.warn("Playback failed:", err));
      // no need to keep ref if using temporary audio
      return;
    }
    translatedAudioRef.current.src = url;
    translatedAudioRef.current.onended = () => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    };
    translatedAudioRef.current
      .play()
      .catch((err) => console.warn("Playback failed:", err));
  }

  // fallback: use SpeechSynthesis to speak the translated text
  function speakTextFallback(text) {
    if (!text) return;
    if (!("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis not supported");
      return;
    }
    const utter = new SpeechSynthesisUtterance(stripQuotes(text));
    utter.lang = mapLanguageToBcp47(lang2) || navigator.language || "en-US";

    // try to pick best voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) {
      const pref = utter.lang.split("-")[0].toLowerCase();
      const match = voices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith(pref)
      );
      if (match) utter.voice = match;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  // helper to strip smart quotes
  function stripQuotes(s) {
    return (s || "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  }

  // UI handlers for record button
  async function handleRecordToggle() {
    setError(null);
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  }

  // play button on Speaker 2 (use existing translated audio if loaded, else fallback TTS)
  function handlePlayTranslation() {
    // if audio element has a src, play it
    if (translatedAudioRef.current && translatedAudioRef.current.src) {
      translatedAudioRef.current.play().catch((err) => {
        console.warn("Play failed:", err);
        // fallback
        speakTextFallback(transcript2);
      });
    } else {
      speakTextFallback(transcript2);
    }
  }

  // stop recording helper
  function stopRecording() {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      } else {
        setIsRecording(false);
      }
    } catch (err) {
      console.warn("Error stopping recording:", err);
      setIsRecording(false);
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
        ) {
          mediaRecorderRef.current.stop();
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center px-4 py-10 text-white bg-[url('/coversation.png')] bg-cover bg-center">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-400 mb-2">
        Conversation Mode
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-2xl">
        Real-time voice translation for face-to-face conversations.
      </p>

      {/* Main Card */}
      <div className="bg-gray-900 w-full max-w-5xl rounded-2xl p-8 shadow-lg flex flex-col gap-8">
        {/* Language Selection */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Speaker 1 */}
          <div className="flex flex-col w-full md:w-1/3">
            <label className="text-gray-300 mb-2">Speaker 1</label>
            <select
              value={lang1}
              onChange={(e) => setLang1(e.target.value)}
              className="p-2 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <button
            onClick={swapLanguages}
            className="bg-blue-600 hover:bg-blue-500 transition p-2 rounded-full shadow-md transform hover:rotate-180 duration-300"
            title="Swap Languages"
          >
            <HiArrowsRightLeft size={22} />
          </button>

          {/* Speaker 2 */}
          <div className="flex flex-col w-full md:w-1/3">
            <label className="text-gray-300 mb-2">Speaker 2</label>
            <select
              value={lang2}
              onChange={(e) => setLang2(e.target.value)}
              className="p-2 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Conversation Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Speaker 1 Area */}
          <div className="flex flex-col items-center bg-gray-800 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              {lang1} Speaker
            </h2>
            <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 p-4">
              <div className="whitespace-pre-wrap text-left w-full">
                {transcript1}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleRecordToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <HiMicrophone size={20} />
                {isRecording ? "Stop Recording" : "Record & Translate"}
              </button>

              {/* show uploading / processing state */}
              {isUploading && (
                <div className="text-gray-300 text-sm">
                  Uploading & translating…
                </div>
              )}
            </div>
          </div>

          {/* Speaker 2 Area */}
          <div className="flex flex-col items-center bg-gray-800 rounded-xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-3 text-blue-400">
              {lang2} Speaker
            </h2>
            <div className="w-full h-40 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 p-4">
              <div className="whitespace-pre-wrap text-left w-full">
                {transcript2}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handlePlayTranslation}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-medium transition"
              >
                <HiSpeakerWave size={20} />
                Play Translation
              </button>

              {/* hidden audio element used when we load translated audio blob/URL */}
              <audio ref={translatedAudioRef} style={{ display: "none" }} />
            </div>
          </div>
        </div>

        {/* error display */}
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>
    </div>
  );
}
