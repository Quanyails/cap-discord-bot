import { normalizeForUrl } from "./string";

export const getAnalysisUrl = (name: string) => {
  return `https://www.smogon.com/dex/ss/pokemon/${normalizeForUrl(name)}/`;
};

/**
 Also see image normalization code at:
 https://github.com/smogon/pokemon-showdown/blob/33e6783d0493e455396aa1d29adbd630c2d00844/server/chat-plugins/wifi.ts#L126-L193
 https://github.com/smogon/pokemon-showdown/blob/33e6783d0493e455396aa1d29adbd630c2d00844/server/chat-plugins/wifi.ts#L29-L31
*/
export const getImageUrl = (spriteId: string) => {
  return `https://play.pokemonshowdown.com/sprites/ani/${spriteId}.gif`;
};
