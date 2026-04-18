export async function generateX25519KeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "X25519" },
    true,
    ["deriveKey", "deriveBits"]
  );

  const pubRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
  const privRaw = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
  const privBytes = new Uint8Array(privRaw);
  const privRawKey = privBytes.slice(-32);

  return {
    publicKey: b64encode(new Uint8Array(pubRaw)),
    privateKey: b64encode(privRawKey),
  };
}

export async function generateP256KeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const pubKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  // Extract SEC1 (ECPrivateKey) from PKCS8.
  // Mihomo/Clash needs the raw SEC1 DER which starts with 0x30 0x77... (Base64: MHcCAQEE...)
  const sec1Key = extractSEC1FromPKCS8(new Uint8Array(privKeyDer));

  return {
    publicKey: b64encode(new Uint8Array(pubKeyDer)),
    privateKey: b64encode(sec1Key), 
  };
}

function extractSEC1FromPKCS8(pkcs8: Uint8Array): Uint8Array {
  // PKCS#8 for P-256 usually has the SEC1 payload at the end.
  // We look for the sequence start (0x30) that follows an Octet String tag (0x04).
  for (let i = 0; i < pkcs8.length - 1; i++) {
    if (pkcs8[i] === 0x04 && pkcs8[i + 1] <= 0x7F && pkcs8[i + 2] === 0x30) {
      return pkcs8.slice(i + 2);
    }
    // Handle long form length if necessary
    if (pkcs8[i] === 0x04 && pkcs8[i + 1] === 0x81 && pkcs8[i + 3] === 0x30) {
      return pkcs8.slice(i + 3);
    }
  }
  return pkcs8;
}

export function generateRandomHex(bytes: number): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

function b64encode(buf: Uint8Array): string {
  return btoa(String.fromCharCode(...buf));
}

export function cleanKey(key: string): string {
  if (!key) return "";
  return key
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s/g, "");
}
