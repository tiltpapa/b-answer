import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateNostrKeyPair, isValidSecretKey, getPublicKeyFromSecret } from './keys';

describe('Nostr Key Generation', () => {
  // **Feature: b-answer-quiz-system, Property 1: 鍵生成の独立性**
  it('should generate independent and valid secp256k1 keys', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // 生成する鍵ペアの数
        (count) => {
          const keyPairs = [];
          const secretKeys = new Set<string>();
          const publicKeys = new Set<string>();

          // 指定された数の鍵ペアを生成
          for (let i = 0; i < count; i++) {
            const keyPair = generateNostrKeyPair();
            keyPairs.push(keyPair);

            // 秘密鍵の重複チェック
            expect(secretKeys.has(keyPair.secretKey)).toBe(false);
            secretKeys.add(keyPair.secretKey);

            // 公開鍵の重複チェック
            expect(publicKeys.has(keyPair.publicKey)).toBe(false);
            publicKeys.add(keyPair.publicKey);

            // 秘密鍵の有効性チェック
            expect(isValidSecretKey(keyPair.secretKey)).toBe(true);

            // 秘密鍵から公開鍵を正しく導出できることを確認
            expect(getPublicKeyFromSecret(keyPair.secretKey)).toBe(keyPair.publicKey);

            // 鍵の長さチェック
            expect(keyPair.secretKey).toHaveLength(64); // 32バイト = 64文字
            expect(keyPair.publicKey).toHaveLength(64); // 32バイト = 64文字

            // 16進数文字列であることを確認
            expect(/^[0-9a-f]{64}$/i.test(keyPair.secretKey)).toBe(true);
            expect(/^[0-9a-f]{64}$/i.test(keyPair.publicKey)).toBe(true);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate secret key format correctly', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (invalidKey) => {
          // 有効な64文字の16進数文字列でない場合は無効
          if (!/^[0-9a-f]{64}$/i.test(invalidKey)) {
            expect(isValidSecretKey(invalidKey)).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate different keys on each call', () => {
    const keyPair1 = generateNostrKeyPair();
    const keyPair2 = generateNostrKeyPair();

    // 異なる鍵ペアが生成されることを確認
    expect(keyPair1.secretKey).not.toBe(keyPair2.secretKey);
    expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);

    // 両方とも有効な鍵であることを確認
    expect(isValidSecretKey(keyPair1.secretKey)).toBe(true);
    expect(isValidSecretKey(keyPair2.secretKey)).toBe(true);
  });
});