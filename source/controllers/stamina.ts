/** source/controllers/stamina.ts */

import Consts from "../consts";

import Stamina from "../models/stamina";
import Players from "../models/players";

/**
 * Adding Stamina
 * @param stamina Stamina
 * @param count number
 * @returns Promise<Stamina>
 */
const add_stamina = async (
  stamina: Stamina,
  count: number = 1
): Promise<Stamina> => {
  console.info("[stamina][add_stamina] Adding Stamina");

  try {
    if (stamina.current === stamina.max) {
      stamina.time_last_add = 0;
    } else if (stamina.current >= 0 && stamina.current < stamina.max) {
      stamina.current += count;
      stamina.time_last_add = (Date.now() / 1000) | 0;
    }
  } catch (error) {
    console.error(`[stamina][add_stamina] ${error}`);
  }

  return stamina;
};

/**
 * Stamina drain
 * @param stamina Stamina
 * @returns Promise<Stamina>
 */
const minus_stamina = async (stamina: Stamina): Promise<Stamina> => {
  console.info("[stamina][minus_stamina] Stamina drain");

  try {
    if (stamina.current === stamina.max && stamina.time_last_add === 0) {
      stamina.current -= 1;
      stamina.time_last_add = (Date.now() / 1000) | 0;
    } else if (stamina.current < stamina.max && stamina.current > 0) {
      stamina.current -= 1;
    } else {
      stamina.current = 0;
    }
  } catch (error) {
    console.error(`[stamina][minus_stamina] ${error}`);
  }

  return stamina;
};

/**
 * Reset stamina
 * @param stamina Stamina
 * @returns Promise<Stamina>
 */
const reset_stamina = async (stamina: Stamina): Promise<Stamina> => {
  console.info("[stamina][reset_stamina] Reset stamina");

  try {
    stamina.current = stamina.max;
    stamina.time_last_add = 0;
  } catch (error) {
    console.error(`[stamina][reset_stamina] ${error}`);
  }

  return stamina;
};

const check_stamina = async (players: Players[]) => {
  try {
    return players.forEach(async (player: Players) => {
      if (player.stamina.time_last_add > 0) {
        let current_time = (Date.now() / 1000) | 0;
        let last_add = player.stamina.time_last_add;

        let diff =
          (current_time - <number>last_add) /
          (<number>Consts.MINUTES_REPAIR * 60);
        diff = Math.trunc(diff);

        if (diff > 0) {
          if (player.stamina.current + diff > player.stamina.max)
            player.stamina = await reset_stamina(player.stamina);
          else player.stamina = await add_stamina(player.stamina, diff);
        }
      }
    });
  } catch (error) {
    console.error(`[stamina][check_stamina] ${error}`);
  }
};

export default {
  add_stamina,
  minus_stamina,
  reset_stamina,
  check_stamina,
};
