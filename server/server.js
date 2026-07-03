const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        await connectDB();

        console.log("[DATABASE] MongoDB Connected");

    } catch (err) {

        console.warn("[DATABASE] MongoDB unavailable.");
        console.warn(err.message);
        console.warn("[SERVER] Starting in demo mode.");

    }

    const server = app.listen(PORT, () => {

        console.log(`====================================`);
        console.log(` Terra Kitchen Server Started`);
        console.log(` Port : ${PORT}`);
        console.log(` Mode : ${process.env.NODE_ENV || "development"}`);
        console.log(`====================================`);

    });

    process.on("SIGTERM", () => {

        console.log("Stopping Server...");

        server.close(() => process.exit(0));

    });

    process.on("SIGINT", () => {

        console.log("Stopping Server...");

        server.close(() => process.exit(0));

    });

}

startServer();