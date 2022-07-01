/** source/controllers/game.ts */

import Consts from "../consts";

import State from "../models/state";

/**
 * Game state change
 * @param type String
 * @param levelID Number
 * @returns State
 */
const set_state = (
  type: String = Consts.STATE.STATE_MENU,
  levelID: Number = 0
): State => {
  let state: State = {
    type: Consts.STATE.STATE_MENU,
    last_play: 0,
  };

  if (levelID > 0) {
    state = {
      type: type,
      levelID: levelID,
      last_play: (Date.now() / 1000) | 0,
    };
  }

  return state;
};

export default {
  set_state,
};
