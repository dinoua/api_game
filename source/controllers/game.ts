/** source/controllers/game.ts */

import { Request, Response, NextFunction } from "express";

import Global from "../global";
import Consts from "../consts";
import Data from "./data";

import State from "./state";
import Stamina from "./stamina";

import Players from "../models/players";

/**
 * Level ID generation
 * @returns Number
 */
const rand_level = () => {
  while (true) {
    let rand = Math.floor(Math.random() * Consts.MAX_LEVEL);

    if (rand != 0) return rand;
  }
};

/**
 * Starting a level [POST][*player_id]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const play_level = async (req: Request, res: Response, next: NextFunction) => {
  console.log("[game][play_level] Starting a level");

  let player_id: String = req.body.player_id;

  try {
    if (player_id !== "" && typeof player_id == "string") {
      const players: Players[] = Global.players;

      const _player = async (player: Players) => {
        if (player.state.type === Consts.STATE.STATE_PLAY)
          return res.status(200).json({
            success: false,
            message: "The player is already in the game",
          });

        if (player.stamina.current <= 0)
          return res.status(200).json({
            success: false,
            message: "No stamina to run the level",
          });

        player.state = State.set_state(Consts.STATE.STATE_PLAY, rand_level());

        if (await Data.save_players(Global.players))
          return res.status(200).json({
            success: true,
            message: "Level started",
            response: player,
          });
        else
          return res.status(200).json({
            success: false,
            message: "Failed to start level",
          });
      };

      return players.forEach(async (player: Players, index: Number) => {
        if (player.player_id === player_id) return await _player(player);

        if (index === players.length - 1)
          return res.status(200).json({
            success: false,
            message: "Player not found",
          });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: player_id is ${typeof player_id}`,
      });
    }
  } catch (error) {
    console.error(`[game][play_level] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Replay level [POST][*player_id]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const replay_level = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("[game][replay_level] Replay level");

  let player_id: String = req.body.player_id;

  try {
    if (player_id !== "" && typeof player_id == "string") {
      const players: Players[] = Global.players;

      const _player = async (player: Players) => {
        if (player.state.type === Consts.STATE.STATE_PLAY) {
          player.state = State.set_state(
            Consts.STATE.STATE_PLAY,
            player.state.levelID
          );
          player.stamina = await Stamina.minus_stamina(player.stamina);

          if (await Data.save_players(Global.players))
            return res.status(200).json({
              success: true,
              message: "Level restarted",
              response: player,
            });
          else
            return res.status(200).json({
              success: false,
              message: "Failed to restart level",
            });
        } else {
          return res.status(200).json({
            success: false,
            message: "The player is in the menu",
          });
        }
      };

      return players.forEach(async (player: Players, index: Number) => {
        if (player.player_id === player_id) return await _player(player);

        if (index === players.length - 1)
          return res.status(200).json({
            success: false,
            message: "Player not found",
          });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: player_id is ${typeof player_id}`,
      });
    }
  } catch (error) {
    console.error(`[game][replay_level] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Level exit [POST][*player_id]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const leave_level = async (req: Request, res: Response, next: NextFunction) => {
  console.log("[game][leave_level] Level exit");

  let player_id: String = req.body.player_id;

  try {
    if (player_id !== "" && typeof player_id == "string") {
      const players: Players[] = Global.players;

      const _player = async (player: Players) => {
        if (player.state.type === Consts.STATE.STATE_PLAY) {
          player.state = State.set_state(Consts.STATE.STATE_MENU);
          player.stamina = await Stamina.minus_stamina(player.stamina);

          if (await Data.save_players(Global.players))
            return res.status(200).json({
              success: true,
              message: "You are out of level",
              response: player,
            });
          else
            return res.status(200).json({
              success: false,
              message: "Failed to exit the level",
            });
        } else {
          return res.status(200).json({
            success: false,
            message: "The player is in the menu",
          });
        }
      };

      return players.forEach(async (player: Players, index: Number) => {
        if (player.player_id === player_id) return await _player(player);

        if (index === players.length - 1)
          return res.status(200).json({
            success: false,
            message: "Player not found",
          });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: player_id is ${typeof player_id}`,
      });
    }
  } catch (error) {
    console.error(`[game][leave_level] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

/**
 * Level win [POST][*player_id, *level_id]
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 */
const win_level = async (req: Request, res: Response, next: NextFunction) => {
  console.log("[game][win_level] Level win");

  let player_id: String = req.body.player_id;
  let level_id: Number = req.body.level_id;

  try {
    if (player_id !== "" && typeof player_id == "string") {
      if (typeof level_id === "string") level_id = parseInt(level_id);

      if (typeof level_id == "number") {
        const players: Players[] = Global.players;

        const _player = async (player: Players) => {
          if (player.state.type === Consts.STATE.STATE_PLAY) {
            if (player.state.levelID === level_id) {
              player.state = State.set_state(Consts.STATE.STATE_MENU);

              if (await Data.save_players(Global.players))
                return res.status(200).json({
                  success: true,
                  message: "You completed the level",
                  response: player,
                });
              else
                return res.status(200).json({
                  success: false,
                  message: "Failed to complete the level",
                });
            } else {
              return res.status(200).json({
                success: false,
                message: "Wrong level",
              });
            }
          } else {
            return res.status(200).json({
              success: false,
              message: "The player is in the menu",
            });
          }
        };

        return players.forEach(async (player: Players, index: Number) => {
          if (player.player_id === player_id) return await _player(player);

          if (index === players.length - 1)
            return res.status(200).json({
              success: false,
              message: "Player not found",
            });
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Request error: level_id is ${typeof level_id}`,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: `Request error: player_id is ${typeof player_id}`,
      });
    }
  } catch (error) {
    console.error(`[game][win_level] ${error}`);

    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export default {
  play_level,
  replay_level,
  leave_level,
  win_level,
};
