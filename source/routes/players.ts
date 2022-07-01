/** source/routes/players.ts */

import express from "express";
import controller from "../controllers/players";

const router = express.Router();

router.get("/players", controller.get_players);
router.post("/players/info", controller.get_player);
router.post("/players/check", controller.check_player);

export = router;
