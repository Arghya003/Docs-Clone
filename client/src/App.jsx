import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "./components/Editor";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("docs_clone_theme") || "light";
  });

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:9000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Sync theme attribute to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("docs_clone_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              socket={socket}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
        <Route
          path="/docs/:id"
          element={
            <Editor
              socket={socket}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
