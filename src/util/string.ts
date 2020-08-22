export const normalize = (
  s: string,
  options?: {
    preserveDashes?: true;
    preserveSpaces?: true;
  }
) => {
  return (
    s
      // remove diacritics
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // tokenize string into words and not-words
      .split(/\b/)
      // remove not-word tokens
      .filter((token) => {
        if (options?.preserveDashes && token === "-") {
          return true;
        }
        return /\b.+\b/.test(token);
      })
      // normalize words (TODO: could be more robust)
      .map((token) => token.toLowerCase())
      .join(options?.preserveSpaces ? " " : "")
  );
};
