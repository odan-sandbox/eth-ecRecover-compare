import Web3 from "web3";

export function recoverUsingWeb3(
  message: string,
  signature: string
): Promise<string> {
  const web3 = new Web3(null);
  return Promise.resolve(
    web3.eth.accounts.recover(message, signature).toLowerCase()
  );
}

export async function recoverUsingGeth(
  message: string,
  signature: string
): Promise<string> {
  const web3 = new Web3("http://localhost:8501");
  const address = await web3.eth.personal.ecRecover(message, signature);
  return address.toLowerCase();
}

export function recoverUsingWeb3Fixed(
  message: string,
  signature: string
): Promise<string> {
  const web3 = new Web3(null);

  const digest = web3.utils.sha3(
    `\x19Ethereum Signed Message:\n${Buffer.from(message).length}${message}`
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Promise.resolve(
    web3.eth.accounts.recover(digest!, signature, true).toLowerCase()
  );
}

export function signUsingWeb3(message: string): Promise<string> {
  const web3 = new Web3(null);
  const account = web3.eth.accounts.create();
  const signature = account.sign(message);

  return Promise.resolve(signature.signature);
}

export async function signUsingGeth(message: string): Promise<string> {
  const web3 = new Web3("http://localhost:8501");

  const signature = await web3.eth.personal.sign(
    message,
    // ref: https://github.com/0xProject/0x-monorepo/blob/d9e13d6b9986cd15ef30ffc73599baafd9bb6675/packages/devnet/genesis.json#L23
    "0xe8816898d851d5b61b7f950627d04d794c07ca37",
    "password"
  );

  return signature;
}

async function main(): Promise<void> {
  const web3 = new Web3(null);
  const message = "🤗";
  console.log(web3.eth.accounts.hashMessage(message));
  console.log(web3.eth.accounts.hashMessage(web3.utils.utf8ToHex(message)));

  console.log("-".repeat(10));

  const signature = await signUsingGeth(message);

  console.log(await recoverUsingWeb3(message, signature));
  // => 0xafae8774a4da3c87e53dabca8bd05db85bab0ad1, NG

  console.log(await recoverUsingGeth(message, signature));
  // => 0xe8816898d851d5b61b7f950627d04d794c07ca37, OK

  console.log(await recoverUsingWeb3Fixed(message, signature));
  // => 0xe8816898d851d5b61b7f950627d04d794c07ca37, OK
}

if (require.main === module) {
  main();
}

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
