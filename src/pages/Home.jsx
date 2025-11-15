import React from "react";
import { FaGlobe, FaMicrophone, FaComments } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const features = [
  {
    icon: FaGlobe,
    title: "Multi-Language Support",
    description:
      "Translate between 100+ languages instantly with AI-powered accuracy.",
  },
  {
    icon: FaMicrophone,
    title: "Voice Translation",
    description: "Real-time voice translation for seamless conversations.",
  },
  {
    icon: FaComments,
    title: "Global Chat",
    description:
      "Chat with an intelligent global companion and practice any language effortlessly.",
  },
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-800 p-6 rounded-xl  hover:shadow-purple-900 shadow-2xl transform hover:-translate-y-1 transition">
    <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-xl bg-linear-to-br from-purple-600 to-blue-500">
      <Icon className="text-white w-6 h-6" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

function Home() {
  return (
    <div className="bg-gray-950 min-h-screen flex flex-col items-center px-4 py-12 gap-12">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl grid md:grid-cols-2 gap-8 max-w-6xl w-full items-center">
        <div className="flex flex-col justify-center text-white">
          <h2 className="inline-block bg-blue-400 px-3 py-1 w-fit rounded-full text-blue-800 font-semibold mb-4 text-sm md:text-base">
            AI - Powered Translation
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Break Language Barriers with Lingua Bridge
          </h1>
          <p className="text-gray-300 mb-8 text-base sm:text-lg md:text-xl">
            Experience seamless communication across languages with our
            AI-driven translation and conversation tools.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition duration-300 shadow-md w-fit">
            <NavLink to="/translate">Translate Now</NavLink>
          </button>
        </div>

        <div className="flex justify-center items-center">
          <img
            src="/homepage.png"
            alt="Translation Illustration"
            className="w-full max-w-md h-auto rounded-xl shadow-2xl"
          />
        </div>
      </div>

      <div className="text-center max-w-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">
          Powerful Features
        </h1>
        <p className="text-gray-400 text-lg">
          Everything you need for seamless communication across languages
        </p>
      </div>

      <div className="max-w-7xl w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
