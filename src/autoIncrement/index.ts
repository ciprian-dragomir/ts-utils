export const increment = (startAt = 0, incrementBy = 1) => {
  let i = startAt;
  return {
    next: () => {
      const next = i;
      i += incrementBy;
      return next;
    },
    peek: () => i,
    reset: () => {
      i = startAt;
    },
  };
};
