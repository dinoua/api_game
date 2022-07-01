/** source/models/players.ts */

import State from "./state";
import Stamina from "./stamina";

interface Players {
  player_id: String;
  player_name: String;
  username: String;
  stamina: Stamina;
  state: State;
}

export = Players;
