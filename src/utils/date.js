export const fromEpochUnixToDate = (epochUnix) => {
  const date = new Date(epochUnix * 1000);
  return date.toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ');
};
