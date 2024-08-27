export const hash = (input: string | Buffer | ArrayBufferLike) => {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(input);
  return hasher.digest("hex");
};
