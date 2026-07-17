export function waitForPromise(delay: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, delay);
  });
}
