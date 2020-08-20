import assert from "assert";

import searchPokemon from "./pokemonSearch";

assert.strictEqual(searchPokemon("Alolan Meowth")?.name, "Meowth-Alola");
assert.strictEqual(
  searchPokemon("Galarian Zen Darmanitan")?.name,
  "Darmanitan-Galar-Zen"
);
assert.strictEqual(searchPokemon("Galarian Mr. Mime")?.name, "Mr. Mime-Galar");
assert.strictEqual(searchPokemon("Farfetch'd")?.name, "Farfetch’d"); // note the fancy quote
assert.strictEqual(searchPokemon("Flabebe")?.name, "Flabébé");
assert.strictEqual(
  searchPokemon("Gigantamax Charizard")?.name,
  "Charizard-Gmax"
);
assert.strictEqual(searchPokemon("Klang")?.name, "Klang");
assert.strictEqual(searchPokemon("Klink")?.name, "Klink");
assert.strictEqual(searchPokemon("Klinklang")?.name, "Klinklang");
assert.strictEqual(searchPokemon("Landorus-T")?.name, "Landorus-Therian");
assert.strictEqual(searchPokemon("Mega Mewtwo X")?.name, "Mewtwo-Mega-X");
assert.strictEqual(searchPokemon("Porygon2")?.name, "Porygon2");
assert.strictEqual(searchPokemon("Porygon-Z")?.name, "Porygon-Z");
assert.strictEqual(searchPokemon("Type: Null")?.name, "Type: Null");
