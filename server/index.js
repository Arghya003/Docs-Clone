import { Server } from "socket.io";

import dotenv from "dotenv";

import Connection from "./database/db.js";

import {
  getDocument,
  updateDocument,
  updateDocumentTitle,
  getAllDocuments,
  deleteDocument,
} from "./controller/document-controller.js";

dotenv.config();

const PORT = process.env.PORT || 9000;

Connection();

const io = new Server(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Helper to broadcast room count
const updateRoomPresence = (documentId) => {
  const room = io.sockets.adapter.rooms.get(documentId);
  const count = room ? room.size : 0;
  io.in(documentId).emit("active-users", count);
};

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("get-all-documents", async () => {
    const docs = await getAllDocuments();
    socket.emit("load-all-documents", docs);
  });

  socket.on("delete-document", async (id) => {
    await deleteDocument(id);
    const docs = await getAllDocuments();
    io.emit("load-all-documents", docs);
  });

  socket.on("get-document", async (documentId) => {
    currentRoom = documentId;
    const document = await getDocument(documentId);
    socket.join(documentId);
    updateRoomPresence(documentId);

    socket.emit("load-document", {
      data: document.data,
      title: document.title,
    });

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("update-title", async (newTitle) => {
      await updateDocumentTitle(documentId, newTitle);
      socket.broadcast.to(documentId).emit("receive-title-change", newTitle);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      updateRoomPresence(currentRoom);
    }
  });
});
