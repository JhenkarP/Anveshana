import { createBrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Translate from "./pages/Translate";
import Layout from "./components/Layout";
import GlobalChat from "./pages/GlobalChat";
import WorldMap from "./pages/WorldMap";
import Conversation from "./pages/Conversation";
import About from "./pages/About";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/globalchat" element={<GlobalChat />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/worldmap" element={<WorldMap />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
