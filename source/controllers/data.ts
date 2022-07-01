/** source/controllers/data.ts */

import fs from "fs";

import Players from "../models/players";

/**
 * Loading players from a file
 * @param filename example: players
 * @returns Players[]
 */
const get_players = async (
  filename: String = "players"
): Promise<Players[]> => {
  let exists: Boolean = fs.existsSync(`${process.cwd()}/data/${filename}.json`);
  let data: Players[] = [];

  if (!exists) {
    try {
      fs.writeFileSync(
        `${process.cwd()}/data/${filename}.json`,
        JSON.stringify([], null, 4)
      );
    } catch (error) {
      console.error(`[data][load_file] [${filename}.json] ${error}`);
    }
  }

  try {
    data = JSON.parse(
      fs.readFileSync(`${process.cwd()}/data/${filename}.json`, "utf-8")
    );
  } catch (error) {
    console.error(`[data][load_file] [${filename}.json] ${error}`);
  }

  console.log(`[data][load_file] File ${filename}.json uploaded successfully.`);

  return data;
};

/**
 * Saving players to a file
 * @param players Players[]
 * @returns Boolean
 */
const save_players = async (players: Players[]) => {
  try {
    fs.writeFileSync(
      `${process.cwd()}/data/players.json`,
      JSON.stringify(players, null, 4)
    );

    return true;
  } catch (error) {
    console.log(`[data][save_players] ${error}`);

    return false;
  }
};

export default {
  get_players,
  save_players,
};
