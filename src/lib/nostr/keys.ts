import { generateSecretKey, getPublicKey } from 'nostr-tools';

/**
 * バイト配列を16進数文字列に変換する
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 新しいNostr鍵ペアを生成する
 * @returns {Object} 秘密鍵と公開鍵のペア
 */
export function generateNostrKeyPair(): { secretKey: string; publicKey: string } {
  const secretKeyBytes = generateSecretKey();
  const secretKey = bytesToHex(secretKeyBytes);
  const publicKey = getPublicKey(secretKeyBytes);
  
  return {
    secretKey,
    publicKey
  };
}

/**
 * 秘密鍵から公開鍵を導出する
 * @param secretKey - 16進数文字列の秘密鍵
 * @returns 16進数文字列の公開鍵
 */
export function getPublicKeyFromSecret(secretKey: string): string {
  const secretKeyBytes = new Uint8Array(
    secretKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  return getPublicKey(secretKeyBytes);
}

/**
 * 鍵が有効なsecp256k1鍵かどうかを検証する
 * @param secretKey - 検証する秘密鍵
 * @returns 有効性のブール値
 */
export function isValidSecretKey(secretKey: string): boolean {
  try {
    if (secretKey.length !== 64) return false;
    
    const secretKeyBytes = new Uint8Array(
      secretKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    
    // 公開鍵の生成を試行して有効性を確認
    getPublicKey(secretKeyBytes);
    return true;
  } catch {
    return false;
  }
}