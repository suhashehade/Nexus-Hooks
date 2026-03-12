export const generateJobName = () => {
  const id = Math.random().toString(36).substring(2, 9);
  return `job-[${id}]`;
};
