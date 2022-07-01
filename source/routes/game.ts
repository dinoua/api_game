/** source/routes/game.ts */

import express from "express";
import controller from "../controllers/game";

const router = express.Router();

router.post("/game/play", controller.play_level);
router.post("/game/replay", controller.replay_level);
router.post("/game/leave", controller.leave_level);
router.post("/game/lose", controller.leave_level);
router.post("/game/win", controller.win_level);

export = router;
