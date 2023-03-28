const app = require("./app");

const PORT = process.env.PORT || "3000";
let server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const closeServer = () => {
  // close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  closeServer();
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  closeServer();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
