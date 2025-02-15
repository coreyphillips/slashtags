import type { KeyPair } from 'noise-curve-tiny-secp';

export type CardMetadata = {
  name: string;
  image: string;
  description?: string;
  url?: string;
};

export type JSON =
  | string
  | null
  | boolean
  | number
  | JSON[]
  | { [key: string]: JSON };

export type Metadata = Partial<JSON & CardMetadata>;

export type ACT_1Callbacks = {
  onChallenge: (params: {
    challenge: string;
    publicKey: string;
    metadata: Metadata;
  }) => Promise<
    | {
        metadata: Metadata;
        keyPair: KeyPair;
      }
    | false
    | undefined
  >;
  onSuccess?: (params: {
    responder: { publicKey: Uint8Array; metadata: Metadata };
    initiator: { publicKey: Uint8Array; metadata: Metadata };
  }) => any;
  onError?: (err: unknown) => any;
};

export type CallBacks = {
  ACT_1?: ACT_1Callbacks;
  [key: string]: any;
};

export type HandleResponse = { act: string; tkt: string; address: string } & (
  | { status: 'SKIP'; reason: string }
  | { status: 'OK' }
  | { status: 'ERROR'; error: any }
);
