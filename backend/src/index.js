// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import methodOverride from "method-override";
// import path from "path";
// import { fileURLToPath } from "url";

// import apiRoutes from "./API/v1/routes/index.js";
// import db from "./config/db/index.js";
// import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
// import { logRoutes } from "./debugRoutes.js";

// const app = express();
// const port = 8888;

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // CHỈ GIỮ LẠI 1 DÒNG NÀY THÔI – ẢNH SẼ HIỆN NGAY!
// app.use(express.static(path.join(process.cwd(), "public")));
// // =================================================================

// app.use(methodOverride("_method"));
// app.use(cors());

// // Routes
// app.use("/api", apiRoutes);

// // Khởi động server
// const startServer = async () => {
//   try {
//     await db.connect();
//     await fixUserIdIndex();

//     app.listen(port, () => {
//       console.log(`Server chạy tại http://localhost:${port}`);
//       // logRoutes(app);
//     });
//   } catch (error) {
//     console.error("Lỗi khởi động server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// =====================================

// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import methodOverride from "method-override";
// import path from "path";
// import { fileURLToPath } from "url";
// import "./utils/reminderScheduler.js";

// import { startReminderJob } from "./jobs/reminder.js";
// import apiRoutes from "./API/v1/routes/index.js";
// import db from "./config/db/index.js";
// import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
// import { logRoutes } from "./debugRoutes.js";

// const app = express();
// const port = 8888;

// // Middleware
// // // Log request chi tiết (status 200/404/...)
// // app.use(morgan('dev'));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ★★★ ĐÃ CHỮA HOÀN TOÀN: Serve static đúng thư mục & prefix ★★★
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Debug đường dẫn gốc
// // console.log('[DEBUG] __dirname (thư mục chứa file server):', __dirname);

// // Tính đường dẫn chính xác đến public/uploads (vì server ở src/ → phải lên cấp cha)
// const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
// // console.log('[SERVER] Serve /uploads từ thư mục vật lý:', uploadsDir);

// // Serve prefix /uploads từ public/uploads
// app.use('/uploads', express.static(uploadsDir));

// // Log request đến /uploads để debug (bao gồm status code qua morgan)
// app.use((req, res, next) => {
//   if (req.path.startsWith('/uploads/')) {
//     // console.log(`[STATIC REQUEST] ${req.method} ${req.path} - từ ${req.ip}`);
//   }
//   next();
// });

// // =================================================================

// startReminderJob();
// app.use(methodOverride("_method"));
// app.use(cors());

// // Routes
// app.use("/api", apiRoutes);

// // Khởi động server
// const startServer = async () => {
//   try {
//     await db.connect();
//     await fixUserIdIndex();

//     app.listen(port, () => {
//       console.log(`Server chạy tại http://localhost:${port}`);
//       // logRoutes(app); // nếu bạn muốn log routes
//     });
//   } catch (error) {
//     console.error("Lỗi khởi động server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// =================================================================
// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import methodOverride from "method-override";
// import path from "path";
// import { fileURLToPath } from "url";

// // --- IMPORT THÊM THƯ VIỆN HTTP VÀ SOCKET.IO ---
// import { createServer } from "http";
// import { Server } from "socket.io";

// import apiRoutes from "./API/v1/routes/index.js";
// import db from "./config/db/index.js";
// import fixUserIdIndex from "../src/config/fixUserIdIndex.js";
// import { logRoutes } from "./debugRoutes.js";

// const app = express();
// const port = 8888;

// // Khởi chạy các Job quét lịch hẹn
// import { startReminderJob } from "./jobs/reminder.js";
// startReminderJob();

// // --- TẠO HTTP SERVER VÀ KẾT NỐI SOCKET.IO ---
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "*", // Bạn có thể cấu hình chính xác url của React ví dụ: "http://localhost:5173"
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   },
// });

// // Lưu trữ biến io vào biến global của Node.js để có thể gọi từ bất cứ file controller/job nào
// global._io = io;

// // Lắng nghe kết nối từ các client ReactJS
// io.on("connection", (socket) => {
//   console.log(`🔌 Thiết bị kết nối Socket thành công: ${socket.id}`);

//   // Khi Client ReactJS gửi userId lên, chúng ta sẽ đưa user đó vào 1 "phòng" riêng (Room)
//   // để khi cần gửi thông báo, ta chỉ gửi đúng cho user đó mà không bị lộ sang người khác.
//   socket.on("join_room", (userId) => {
//     socket.join(userId);
//     console.log(`👤 User [${userId}] đã tham gia vào phòng thông báo riêng.`);
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ Thiết bị ngắt kết nối: ${socket.id}`);
//   });
// });

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
// app.use('/uploads', express.static(uploadsDir));

// app.use((req, res, next) => {
//   if (req.path.startsWith('/uploads/')) {
//     // console.log(`[STATIC REQUEST] ${req.method} ${req.path}`);
//   }
//   next();
// });

// // =================================================================

// app.use(methodOverride("_method"));
// app.use(cors());

// // Routes
// app.use("/api", apiRoutes);

// // Khởi động server (Thay app.listen bằng httpServer.listen)
// const startServer = async () => {
//   try {
//     await db.connect();
//     await fixUserIdIndex();

//     httpServer.listen(port, () => {
//       console.log(`🚀 Server + Real-time Socket chạy tại http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error("Lỗi khởi động server:", error);
//     process.exit(1);
//   }
// };

// startServer();

// ====================
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import methodOverride from "method-override";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import apiRoutes from "./API/v1/routes/index.js";
import db from "./config/db/index.js";
import fixUserIdIndex from "../src/config/fixUserIdIndex.js";

const app = express();

// CHỮA LỖI 1: Lấy PORT từ Cloud hoặc mặc định 8888
const port = process.env.PORT || 8888;

import { startReminderJob } from "./jobs/reminder.js";
startReminderJob();

const httpServer = createServer(app);

// CHỮA LỖI 3: Bảo mật và linh hoạt đường dẫn Client bằng CLIENT_URL
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

global._io = io;

io.on("connection", (socket) => {
  console.log(`🔌 Thiết bị kết nối Socket thành công: ${socket.id}`);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`👤 User [${userId}] đã tham gia vào phòng thông báo riêng.`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Thiết bị ngắt kết nối: ${socket.id}`);
  });
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Giữ nguyên Morgan để khi deploy lên Cloud xem Log lỗi cho dễ
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CHỮA LỖI 2: Lưu ý thư mục này sẽ mất sạch ảnh nếu không cấu hình Persistent Disk trên Cloud!
const uploadsDir = path.join(__dirname, "..", "public", "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use(methodOverride("_method"));
app.use(cors());

app.use("/api", apiRoutes);

const startServer = async () => {
  try {
    await db.connect();
    await fixUserIdIndex();

    // Lắng nghe qua biến port linh hoạt
    httpServer.listen(port, () => {
      console.log(`🚀 Server chạy production hoàn chỉnh tại port: ${port}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
};

startServer();
