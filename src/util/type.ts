import { TypeName } from "@pkmn/types";
// js-combinatorics uses ES6-style imports, which node only experimentally supports.
// We want to use the types from the library, but we use the commonjs JS instead.
import * as Types from "js-combinatorics/combinatorics";
import {
  CartesianProduct,
  Combination,
  // @ts-ignore
} from "js-combinatorics/commonjs/combinatorics";
import _ from "lodash";

import { getEffectiveness, getTypeChart } from "./sim";

// TODO: prefer generators
const toArray = <T>(
  combinatoric: Types.CartesianProduct<T> | Types.Combination<T>
) => {
  const result: T[][] = [];
  for (let i = 0; i < combinatoric.length; i += 1) {
    const item = combinatoric.nth(i);
    if (item) {
      result.push(item);
    }
  }
  return result;
};

// Out of 18 types, which subset of a given size maximizes type coverage?
// This is a type knapsack problem, which is exponential to solve.
// This problem can be brute-forced, however, given that we have at most 18 types
// and at most ~1000 Pokemon to find effectiveness against.
export const getBestCoverageTypes = ({
  minEffectiveness,
  numTypes,
  targetTypesList,
}: {
  minEffectiveness: number;
  numTypes: number;
  targetTypesList: TypeName[][];
}): {
  damageTypes: TypeName[];
  numCovered: number;
}[] => {
  const typeChart = getTypeChart();

  const damageTypeCombinations = toArray(
    new Combination<TypeName>(
      Object.keys(typeChart) as TypeName[],
      numTypes
    ) as Types.Combination<TypeName>
  );

  const typeProducts = toArray(
    new CartesianProduct<TypeName[]>(
      damageTypeCombinations,
      targetTypesList
    ) as Types.CartesianProduct<TypeName[]>
  );

  const effectivenessProducts = typeProducts.map(
    ([damageTypeCombination, targetTypes]) => {
      const effectivenesses = damageTypeCombination.map((damageType) => {
        const multipliers = targetTypes.map((targetType) => {
          return getEffectiveness({
            damageType,
            targetType,
            type: "attacking",
          });
        });
        return multipliers.reduce((acc, n) => acc * n, 1);
      });
      const bestEffectiveness = Math.max(...effectivenesses);
      return {
        bestEffectiveness,
        damageTypes: damageTypeCombination,
        targetTypes,
      };
    }
  );

  const damageTypeEffectiveness = damageTypeCombinations.map(
    (damageTypeCombination) => {
      const numCovered = effectivenessProducts.filter(
        ({ damageTypes, bestEffectiveness }) => {
          return (
            _.isEqual(damageTypes, damageTypeCombination) &&
            bestEffectiveness >= minEffectiveness
          );
        }
      ).length;

      return {
        damageTypes: damageTypeCombination,
        numCovered,
      };
    }
  );

  const bestEffectiveness = _.maxBy(
    damageTypeEffectiveness,
    ({ numCovered }) => numCovered
  ) ?? {
    damageTypes: [], // unused
    numCovered: 0,
  };

  return damageTypeEffectiveness.filter(
    ({ numCovered }) => numCovered === bestEffectiveness.numCovered
  );
};
