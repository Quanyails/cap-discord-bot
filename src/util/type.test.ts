import assert from "assert";

import { getBestCoverageTypes } from "./type";

const single = getBestCoverageTypes({
  minEffectiveness: 2,
  numTypes: 1,
  targetTypesList: [["Electric"]],
});
assert.strictEqual(single.length, 1);
assert.strictEqual(single[0].numCovered, 1);
assert.deepStrictEqual(single[0].damageTypes, ["Ground"]);

const sharedWeakness = getBestCoverageTypes({
  minEffectiveness: 2,
  numTypes: 1,
  targetTypesList: [["Ground"], ["Dragon"], ["Flying", "Normal"]],
});
assert.strictEqual(sharedWeakness.length, 1);
assert.strictEqual(sharedWeakness[0].numCovered, 3);
assert.deepStrictEqual(sharedWeakness[0].damageTypes, ["Ice"]);

const multipleTypes = getBestCoverageTypes({
  minEffectiveness: 2,
  numTypes: 1,
  targetTypesList: [["Water"]],
});
assert.strictEqual(multipleTypes.length, 2);
assert.strictEqual(multipleTypes[0].numCovered, 1);
assert.deepStrictEqual(multipleTypes[0].damageTypes, ["Electric"]);
assert.strictEqual(multipleTypes[1].numCovered, 1);
assert.deepStrictEqual(multipleTypes[1].damageTypes, ["Grass"]);

const multipleSets = getBestCoverageTypes({
  minEffectiveness: 2,
  numTypes: 2,
  targetTypesList: [["Normal"], ["Ghost", "Dark"]],
});
assert.strictEqual(multipleSets.length, 1);
assert.strictEqual(multipleSets[0].numCovered, 2);
assert.deepStrictEqual(multipleSets[0].damageTypes, ["Fairy", "Fighting"]);
