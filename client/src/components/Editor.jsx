import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Quill from "quill";
import toolbarOptions from "../assets/contants";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import StatsBar from "./StatsBar";

const Editor = ({ socket, theme, onToggleTheme }) => {
  const [quill, setQuill] = useState(null);
  const [title, setTitle] = useState("Untitled Document");
  const [status, setStatus] = useState("saved");
  const [activeUsers, setActiveUsers] = useState(1);
  const { id } = useParams();

  // Initialize Quill Editor
  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });

    quillServer.disable();
    quillServer.setText("Loading document...");
    setQuill(quillServer);
  }, []);

  // Sync Document Data & Title from Socket
  useEffect(() => {
    if (!quill || !socket) return;

    socket.once("load-document", (document) => {
      if (document) {
        if (document.data) {
          quill.setContents(document.data);
        } else {
          quill.setText("");
        }
        if (document.title) {
          setTitle(document.title);
        }
      }
      quill.enable();
    });

    socket.emit("get-document", id);
  }, [quill, socket, id]);

  // Handle Text Changes & Broadcast
  useEffect(() => {
    if (!socket || !quill) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;
      setStatus("saving");
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  // Listen for Received Changes from other users
  useEffect(() => {
    if (!socket || !quill) return;

    const handleReceive = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleReceive);

    return () => {
      socket.off("receive-changes", handleReceive);
    };
  }, [quill, socket]);

  // Listen for Remote Title Changes
  useEffect(() => {
    if (!socket) return;

    const handleTitleChange = (newTitle) => {
      setTitle(newTitle);
    };

    socket.on("receive-title-change", handleTitleChange);

    return () => {
      socket.off("receive-title-change", handleTitleChange);
    };
  }, [socket]);

  // Listen for Active Users Count
  useEffect(() => {
    if (!socket) return;

    const handleActiveUsers = (count) => {
      setActiveUsers(count || 1);
    };

    socket.on("active-users", handleActiveUsers);

    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket]);

  // Handle Title Update by Current User
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (socket) {
      socket.emit("update-title", newTitle);
    }
  };

  // Periodic Auto-Save
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
      setStatus("saved");
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return (
    <Box className="app-container">
      <Navbar
        title={title}
        onTitleChange={handleTitleChange}
        status={status}
        activeUsers={activeUsers}
        theme={theme}
        onToggleTheme={onToggleTheme}
        quill={quill}
      />

      <Box className="editor-wrapper animate-fade-in">
        <Box className="container" id="container"></Box>
      </Box>

      <StatsBar quill={quill} />
    </Box>
  );
};

export default Editor;
