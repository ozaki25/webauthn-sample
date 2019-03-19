const domain = 'localhost';

function str2buf(str: string): Uint8Array {
  return Uint8Array.from(window.atob(str), c => c.charCodeAt(0));
}

function buf2str(buf: ArrayBuffer | Uint8Array): string {
  const buffer: any =
    buf.constructor === Uint8Array ? buf : new Uint8Array(buf);
  return buffer.map((x: any) => Number(String.fromCharCode(x))).join('');
}

async function runAttestation() {
  if (!navigator.credentials) {
    alert('お使いのブラウザではこの機能を使うことができません');
    return;
  }
  // チャレンジ値の生成
  const challengeBuf = new Uint8Array(32);
  window.crypto.getRandomValues(challengeBuf);

  // 公開鍵生成リクエストのパラメータ
  const publicKey: PublicKeyCredentialCreationOptions = {
    challenge: challengeBuf,
    rp: { id: domain, name: 'FIDO Example Corporation' },
    user: {
      id: str2buf('MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII='),
      name: 'test@example.com',
      displayName: 'Alice von Wunderland',
    },
    attestation: 'direct',
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
    timeout: 60000,
  };
  // 公開鍵生成リクエスト
  try {
    const attestation = (await navigator.credentials.create({
      publicKey,
    })) as any; //PublicKeyCredential;
    console.dir(attestation);
    const {
      id,
      rawId,
      response: { attestationObject, clientDataJSON },
      type,
    } = attestation;
    return {
      id,
      rawId: buf2str(rawId),
      response: {
        attestationObject: buf2str(attestationObject),
        clientDataJSON: buf2str(clientDataJSON),
      },
      type,
    };
  } catch (e) {
    console.dir(e);
  }
}

const runAssertion = async (rawId: ArrayBuffer) => {
  if (!navigator.credentials) {
    alert('お使いのブラウザではこの機能を使うことができません');
    return;
  }
  // チャレンジ値の生成
  const challengeBuf = new Uint8Array(32);
  window.crypto.getRandomValues(challengeBuf);
  // 認証時のパラメータ
  const publicKey: PublicKeyCredentialRequestOptions = {
    allowCredentials: [{ id: rawId, type: 'public-key' }],
    challenge: challengeBuf,
    timeout: 60000,
  };
  // 認証リクエスト
  try {
    const assertion = await navigator.credentials.get({ publicKey });
    console.dir(assertion);
    return true;
  } catch (e) {
    console.dir(e);
    return null;
  }
};

export { runAttestation, runAssertion };
