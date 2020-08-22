export const normalize = (
  s: string,
  options?: {
    preserveDashes?: true;
    preserveParentheses?: true;
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
        if (options?.preserveParentheses && (token === "(" || token === ")")) {
          return true;
        }
        return /\b.+\b/.test(token);
      })
      // normalize words (TODO: could be more robust)
      .map((token) => token.toLowerCase())
      .join(options?.preserveSpaces ? " " : "")
  );
};

export const normalizeName = (s: string) => {
  return normalize(s, {
    preserveSpaces: true,
  });
};

export const normalizeForUrl = (s: string) => {
  return normalize(s, {
    preserveDashes: true,
  });
};
