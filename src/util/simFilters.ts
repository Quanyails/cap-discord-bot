import { DexTable, Species } from "@pkmn/sim";
import _ from "lodash";

/**
 * If all of these Pokemon properties match on one of a Pokemon's formes,
 * we consider a Pokemon a duplicate of the base forme.
 */
const DUPLICATE_RELEVANT_PROPERTIES: (keyof Species)[] = [
  "abilities",
  "baseStats",
  "types",
];

const NEAR_DUPLICATE_NAMES: Species["name"][] = [
  // Formes of formes have weird logic
  // "Darmanitan-Galar-Zen",
  // Was filtered out in past-gen BSR calculators--could include again
  "Meowstic-F",
  // Only difference is that they can use Pikashunium Z, an old-gen item
  "Pikachu-Original",
  "Pikachu-Hoenn",
  "Pikachu-Sinnoh",
  "Pikachu-Unova",
  "Pikachu-Kalos",
  "Pikachu-Alola",
  "Pikachu-Partner",
  // Abilities have different names but same effect
  "Toxtricity-Low-Key",
  // Prevents excessive weighting
  "Silvally-Bug",
  "Silvally-Dark",
  "Silvally-Dragon",
  "Silvally-Electric",
  "Silvally-Fairy",
  "Silvally-Fighting",
  "Silvally-Fire",
  "Silvally-Flying",
  "Silvally-Ghost",
  "Silvally-Grass",
  "Silvally-Ground",
  "Silvally-Ice",
  "Silvally-Poison",
  "Silvally-Psychic",
  "Silvally-Rock",
  "Silvally-Steel",
  "Silvally-Water",
];

// Mega Crucibelle isn't properly marked as past-gen only.
const OTHER_ILLEGAL_NAMES = ["Crucibelle-Mega"];

export const filterDuplicates = (species: DexTable<Species>) => {
  const filtered = _.uniqWith(Object.values(species), (s1, s2) =>
    _.isEqual(
      _.pick(s1, DUPLICATE_RELEVANT_PROPERTIES),
      _.pick(s2, DUPLICATE_RELEVANT_PROPERTIES)
    )
  ).filter((s) => !NEAR_DUPLICATE_NAMES.includes(s.name));
  return Object.fromEntries(filtered.map((s) => [s.id, s])) as DexTable<
    Species
  >;
};

export const filterIllegal = (species: DexTable<Species>) => {
  const filtered = Object.values(species).filter((s) => {
    if (
      [
        // no tier specified usually refers to in-battle forme changes
        undefined,
        "Illegal",
        "Unreleased",
      ].includes(s.tier)
    ) {
      return false;
    }
    if (s.isNonstandard === "Past") {
      return false;
    }
    if (OTHER_ILLEGAL_NAMES.includes(s.name)) {
      return false;
    }
    return true;
  });
  return Object.fromEntries(filtered.map((s) => [s.id, s])) as DexTable<
    Species
  >;
};
