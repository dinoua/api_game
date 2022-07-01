/** source/server.ts */

import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import schedule from "node-schedule";

import Data from "./controllers/data";
import Stamina from "./controllers/stamina";

import Global from "./global";
import Consts from "./consts";

import PlayersRoutes from "./routes/players";
import GameRoutes from "./routes/game";

const router: Express = express();

/** Logging */
router.use(
  morgan(
    "[http][IP: :remote-addr][:method][URL: :url][STATUS: :status] :res[content-length] - :response-time ms"
  )
);
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET POST");
    return res.status(200).json({});
  }

  next();
});

/** Routes */
router.use("/api/", PlayersRoutes);
router.use("/api/", GameRoutes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("Stop before it's too late");
  return res.status(404).json({
    success: false,
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? Consts.SERVER_PORT;
httpServer.listen(PORT, async () => {
  console.log(`[server] The server is running on port ${PORT}`);

  Global.players = await Data.get_players();
  console.log(`[server] Total players: ${Global.players.length}`);

  await Stamina.check_stamina(Global.players);

  schedule.scheduleJob("*/15 * * * * *", async () => {
    await Stamina.check_stamina(Global.players);
  });

  schedule.scheduleJob("*/60 * * * * *", async () => {
    const result = await Data.save_players(Global.players);

    if (result) console.log("[server] Data saved successfully");
    else console.error("[server] Failed to save data");
  });
});

const exitServer = async () => {
  schedule.gracefulShutdown().then(() => process.exit(0));

  const result = await Data.save_players(Global.players);

  if (result) console.log("[server] Data saved successfully");
  else console.error("[server] Failed to save data");
};

process.on("SIGINT", exitServer);
process.on("SIGTERM", exitServer);
