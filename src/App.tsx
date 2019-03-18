import React, { useEffect, useState } from 'react';
import { runAttestation, runAssertion } from './WebAuthentication';

function App() {
  const [rawId, setRawId] = useState<ArrayBuffer | null>(null);

  const generateRawId = async () => {
    const result = await runAttestation();
    console.log(result);
    setRawId(result || null);
  };

  const assertionRawId = async () => {
    if (!rawId) {
      alert('認証情報を登録して下さい');
      return;
    }
    const result = await runAssertion(rawId);
    console.log(result);
    alert(result ? 'OK' : 'NG');
  };

  return (
    <>
      <h1>Hello</h1>
      <button onClick={generateRawId}>登録</button>
      <button onClick={assertionRawId}>認証</button>
    </>
  );
}

export default App;
