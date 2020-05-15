import {
  signUsingGeth,
  recoverUsingWeb3,
  recoverUsingGeth,
  recoverUsingWeb3Fixed,
} from "./app";

describe("compare", (): void => {
  it("case", async () => {
    const message = "🤗";
    const signature = await signUsingGeth(message);
    const address = "0xe8816898d851d5b61b7f950627d04d794c07ca37";

    await expect(recoverUsingWeb3(message, signature)).resolves.not.toBe(
      address
    );

    await expect(recoverUsingGeth(message, signature)).resolves.toBe(address);
    await expect(recoverUsingWeb3Fixed(message, signature)).resolves.toBe(
      address
    );
  });
});
