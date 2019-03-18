function str2buf(str: string): Uint8Array {
  return Uint8Array.from(window.atob(str), c => c.charCodeAt(0));
}

function buf2str(buf: Uint8Array): string {
  if (buf.constructor !== Uint8Array) buf = new Uint8Array(buf);
  return buf.map(x => Number(String.fromCharCode(x))).join('');
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
    rp: { id: 'example.com', name: 'FIDO Example Corporation' },
    user: {
      id: str2buf('MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII='),
      name: 'test@example.com',
      displayName: 'Alice von Wunderland',
    },
    attestation: 'direct',
    pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
  };
  // 公開鍵生成リクエスト
  try {
    const attestation = (await navigator.credentials.create({
      publicKey,
    })) as PublicKeyCredential;
    console.log(attestation);
    return attestation.rawId;
  } catch (e) {
    console.log(e);
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
  };
  // 認証リクエスト
  try {
    const assertion = await navigator.credentials.get({ publicKey });
    console.dir(assertion);
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default {
  runAttestation,
  runAssertion,
};
