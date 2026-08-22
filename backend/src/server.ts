// src/server.ts
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` 🧭 GlobeTrotter Backend Server Started  `);
  console.log(` 🚀 Listening on port: ${PORT}           `);
  console.log(` 📍 Health check: http://localhost:${PORT}/health`);
  console.log(`=========================================`);
});
