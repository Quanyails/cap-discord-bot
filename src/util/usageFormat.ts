import { Frequency } from "./usage";

const getSortedFrequency = <T extends keyof never>({
  frequency,
  sort,
}: {
  frequency: Frequency<T>;
  sort: "ascending" | "descending";
}) => {
  const tuples: [T, number][] = Object.entries(frequency) as [T, number][];
  return tuples.sort(([, n1], [, n2]) => {
    return sort === "ascending" ? n1 - n2 : n2 - n1;
  });
};

export const formatFrequency = <T extends keyof never>({
  asPercent,
  cutoff,
  frequency,
  sort,
}: {
  asPercent: boolean;
  cutoff?: number;
  frequency: Frequency<T>;
  sort: "ascending" | "descending";
}) => {
  const sorted = getSortedFrequency({
    frequency,
    sort,
  });
  const displayed = sorted.slice(0, cutoff);
  const hidden = sorted.slice(cutoff);

  const results = displayed.map(([e, n]) => {
    const stringifiedN = asPercent
      ? `${(100 * n).toFixed(2)}%`
      : `${n.toFixed(2)}`;
    return `${e} - ${stringifiedN}`;
  });
  if (hidden.length > 0) {
    results.push(`(${hidden.length} more not displayed.)`);
  }
  return results.join("\n");
};
