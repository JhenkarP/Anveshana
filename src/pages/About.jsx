import React from "react";
import { Globe2, Brain, Users } from "lucide-react"; // for icons

function About() {
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col justify-start items-center px-6 py-12 text-white">
      <div className="flex flex-col items-center text-center max-w-5xl w-full animate-fadeIn">
        {/* Logo */}
        <img
          src="/about.png"
          alt="LinguaAI Logo"
          className="rounded-2xl h-40 w-40 md:h-72 md:w-72 mb-6 shadow-[0_0_25px_rgba(56,189,248,0.3)]"
        />

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
          <span className="text-blue-400">About</span>{" "}
          <span className="text-white">LinguaAI</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
          <span className="text-blue-400 font-semibold">LinguaAI</span> is an
          innovative AI-driven platform that breaks language barriers through
          real-time text and voice translation. Designed for travelers,
          professionals, and global communities — making communication natural,
          fast, and intelligent.
        </p>

        {/* Mission Section */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-800 w-full hover:shadow-blue-500/20 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-blue-300 mb-3">
            Our Mission
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Our mission is to connect the world beyond language boundaries —
            through the power of artificial intelligence, emotional expression,
            and speech understanding. We believe communication should be as easy
            as thinking.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-gray-800 w-full mt-10 hover:shadow-blue-500/20 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-950/40 hover:shadow-blue-400 shadow-md transition-all duration-300">
              <Globe2 className="mx-auto text-blue-400 mb-3" size={40} />
              <h3 className="text-lg font-semibold mb-2 text-blue-300">
                Global Reach
              </h3>
              <p className="text-gray-400 text-sm">
                Supporting over <span className="text-blue-400">100+</span>{" "}
                languages to connect people across the globe.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-950/40 hover:shadow-blue-400 shadow-md transition-all duration-300">
              <Brain className="mx-auto text-blue-400 mb-3" size={40} />
              <h3 className="text-lg font-semibold mb-2 text-blue-300">
                AI-Powered
              </h3>
              <p className="text-gray-400 text-sm">
                Leveraging state-of-the-art AI to deliver fast and precise
                translations in real-time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-950/40 hover:shadow-blue-400 shadow-md transition-all duration-300">
              <Users className="mx-auto text-blue-400 mb-3" size={40} />
              <h3 className="text-lg font-semibold mb-2 text-blue-300">
                Community Driven
              </h3>
              <p className="text-gray-400 text-sm">
                Built by language enthusiasts, empowering a world of cultural
                exchange and understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
