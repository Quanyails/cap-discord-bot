export const BSR_MAX = 256;
export const BSR_MIN = 0;

export const formatAbilities = (
  abilities: Partial<{
    0: string;
    1: string;
    H: string;
    S: string;
  }>
) => {
  return Object.entries(abilities)
    .sort(([k1], [k2]) => k1.charCodeAt(0) - k2.charCodeAt(0))
    .map(([k, ability]) => {
      switch (k) {
        case "0": {
          return ability;
        }
        case "1": {
          return ability;
        }
        case "H": {
          return `${ability} (H)`;
        }
        case "S": {
          return `${ability} (S)`;
        }
        default: {
          throw new Error(`Unknown ability type! ${k}`);
        }
      }
    })
    .join(" / ");
};

export const formatBsr = (n: number) => (Math.ceil(n * 100) / 100).toFixed(2);

export const formatStats = ({
  atk,
  def,
  hp,
  spa,
  spd,
  spe,
}: {
  atk: number;
  def: number;
  hp: number;
  spa: number;
  spd: number;
  spe: number;
}) => {
  return `${hp} HP / ${atk} Atk / ${def} Def / ${spa} SpA / ${spd} SpD / ${spe} Spe`;
};

export const formatSweepinessTankiness = ({
  ps,
  pt,
  ss,
  st,
}: {
  ps: number;
  pt: number;
  ss: number;
  st: number;
}) => {
  const formatCell = (n: number) =>
    formatBsr(n).toString().padStart(6).padEnd(8);
  // prettier-ignore
  return `
\`\`\`
|            | Physical | Special  |
|------------|----------|----------|
| Sweepiness | ${formatCell(ps)} | ${formatCell(ss)} |
| Tankiness  | ${formatCell(pt)} | ${formatCell(st)} |
\`\`\`
`.trim();
};

export const formatTypes = (types: string[]) => {
  return types.join(" / ");
};
