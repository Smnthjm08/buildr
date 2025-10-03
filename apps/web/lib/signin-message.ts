import bs58 from "bs58";
import nacl from "tweetnacl";

type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
};

export class SigninMessage {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;

  constructor({ domain, publicKey, nonce, statement }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare() {
    return `${this.statement}\n\nDomain: ${this.domain}\nWallet: ${this.publicKey}\nNonce: ${this.nonce}`;
  }

  validate(signature: string) {
    const msgUint8 = new TextEncoder().encode(this.prepare());
    const signatureUint8 = bs58.decode(signature);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
