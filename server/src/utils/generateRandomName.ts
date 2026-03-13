export const generateRandomName = (name: string) => {
  const id = Math.random().toString(36).substring(2, 9);
  return `${name}-[${id}]`;
};
