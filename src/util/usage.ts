import Axios from "axios";

import { AbilityId, FormatId, ItemId, MoveId, SpeciesName } from "./sim";

export const ELO_CUTOFFS = [0, 1500, 1630, 1760] as const;

export interface SpeciesUsage {
  Moves: Frequency<MoveId | "">;
  // TODO: learn what checks/counters numbers mean
  "Checks and Counters": Record<SpeciesName, [number, number, number]>;
  Abilities: Frequency<AbilityId>;
  // TODO: learn what teammates number means
  Teammates: Record<SpeciesName, number>;
  usage: number;
  Items: Frequency<ItemId | "nothing">;
  "Raw count": number;
  Spreads: Frequency<string>;
  Happiness: Frequency<string>; // stringified number
  // TODO: learn what viability ceiling numbers mean
  "Viability Ceiling": [number, number, number, number];
}

export interface ChaosResponse {
  data: Record<SpeciesName, SpeciesUsage>;
  info: {
    cutoff: number;
    "cutoff deviation": number;
    metagame: FormatId;
    "number of battles": number;
    "team type": null;
  };
}

export type Frequency<T extends keyof never> = Record<T, number>;

interface UrlParams {
  elo: typeof ELO_CUTOFFS[number];
  date: Date;
  format: FormatId;
}

const createCache = <T>() => {
  const cache: Record<string, T> = {};

  const getOrFetch = async (key: string, fetch: () => Promise<T>) => {
    if (!cache[key]) {
      cache[key] = await fetch();
    }
    return cache[key];
  };

  return {
    getOrFetch,
  };
};

const chaosCache = createCache<ChaosResponse>();
const client = Axios.create({});

// Latest usage stats always trail one month behind current month
export const getLatestUsageYearMonth = () => {
  const latest = new Date();
  latest.setMonth(latest.getMonth() - 1);
  return latest;
};

const getUrl = ({ elo, date, format }: UrlParams) => {
  const yearMonth = date.toISOString().slice(0, 7);
  return `https://www.smogon.com/stats/${yearMonth}/chaos/${format}-${elo}.json`;
};

export const getUsage = async ({ elo, date, format }: UrlParams) => {
  const url = getUrl({ elo, date, format });
  return chaosCache.getOrFetch(url, async () => {
    return (await client.get(url)).data as ChaosResponse;
  });
};
