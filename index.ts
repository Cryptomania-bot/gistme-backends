import app from './src/app.js';
import connectDB from './src/config/database.js';
const PORT = process.env.PORT || 5000;
import {createServer} from 'http';
import { initializeSocket } from "./src/utils/socket.js";


const httpServer = createServer(app);
initializeSocket(httpServer);


connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to connect to the database:', error);
  process.exit(1);

});