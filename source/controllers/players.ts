/** source/controllers/players.ts */

import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import Global from "../global";
import Consts from "../consts";
import Data from "./data";

import Players from "../models/players";

/**
 * Getting all players [GET]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
const get_players = async (req: Request, res: Response, next: NextFunction) => {
  console.log("[players][get_players] Getting all players");

  let players: Players[] = Global.players;

  try {
    return res.status(200).json({
      success: true,
      count: players.length,
      response: players,
    });
  } catch (error) {
    console.error(`[players][get_players] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Getting a player by username [POST][*username]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const get_player = async (req: Request, res: Response, next: NextFunction) => {
  console.log("[players][get_player] Getting a player by username");

  const username: String = req.body.username;
  const players: Players[] = Global.players;

  try {
    if (username !== "" && typeof username == "string") {
      if (players.length == 0) {
        return res.status(200).json({
          success: false,
          message: "No players",
        });
      } else {
        return players.forEach((player: Players, index: Number) => {
          if (
            player.username.toLocaleLowerCase() == username.toLocaleLowerCase()
          ) {
            return res.status(200).json({
              success: true,
              response: player,
            });
          }

          if (index === players.length - 1)
            return res.status(200).json({
              success: false,
              message: "Player not found",
            });
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: username is ${typeof username}`,
      });
    }
  } catch (error) {
    console.error(`[players][get_player] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Checking if a player exists in the database [POST][*username, player_name]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const check_player = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(
    "[players][check_player] Checking if a player exists in the database"
  );

  const username: String = req.body.username;

  try {
    if (username !== "" && typeof username == "string") {
      const players: Players[] = Global.players;

      const player_name: String = req.body.player_name
        ? req.body.player_name
        : "Unknown";

      const newPlayer = async () => {
        const player = {
          player_id: uuidv4(),
          player_name: player_name,
          username: username,
          stamina: {
            current: Consts.MAX_STAMINA,
            max: Consts.MAX_STAMINA,
            time_last_add: 0,
          },
          state: {
            type: Consts.STATE.STATE_MENU,
            last_play: 0,
          },
        };

        Global.players.push(player);

        if (await Data.save_players(Global.players))
          return res.status(200).json({
            success: true,
            message: "Player successfully created",
            response: player,
          });
        else
          return res.status(200).json({
            success: false,
            message: "Failed to save player",
          });
      };

      if (players.length == 0) {
        return await newPlayer();
      } else {
        return players.forEach(async (player: Players, index: Number) => {
          if (
            player.username.toLocaleLowerCase() == username.toLocaleLowerCase()
          ) {
            return res.status(200).json({
              success: false,
              message: "Player with the same name already exists",
            });
          }

          if (index === players.length - 1) await newPlayer();
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: username is ${typeof username}`,
      });
    }
  } catch (error) {
    console.error(`[players][get_player] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export default {
  get_players,
  get_player,
  check_player,
};
