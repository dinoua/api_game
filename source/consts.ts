/** source/consts.ts */

const SERVER_PORT: Number = 6060;

const STATE_MENU: String = "menu";
const STATE_PLAY: String = "play";

const MAX_LEVEL: number = 150;

const MAX_STAMINA: number = 5;
const MINUTES_REPAIR: Number = 1;
const CHECK_STAMINA: Number = 30 * 1000;

export default {
  SERVER_PORT,
  MAX_LEVEL,
  MAX_STAMINA,
  MINUTES_REPAIR,
  CHECK_STAMINA,
  STATE: {
    STATE_MENU,
    STATE_PLAY,
  },
};
