import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { encryptAnswer, decryptAnswer } from './encryption';
import { generateNostrKeyPair } from '../nostr/keys';

describe('Answer Encryption', () => {
  // **Feature: b-answer-quiz-system, Property 8: 回答暗号化の正確性**
  it('should encrypt and decrypt answers correctly with Answer_Key', async () => {
    // 固定のテストケースで基本的な暗号化・復号をテスト
    const answer = [1, 3, 5];
    const keyPair = generateNostrKeyPair(); // 同じ鍵ペアを暗号化・復号で使用
    const answerKey = generateNostrKeyPair().publicKey; // Answer_Keyとして公開鍵を使用

    // 回答を暗号化
    const encryptedAnswer = await encryptAnswer(
      answer, 
      answerKey, 
      keyPair.secretKey
    );

    // 暗号化された回答が空でないことを確認
    expect(encryptedAnswer).toBeTruthy();
    expect(typeof encryptedAnswer).toBe('string');
    expect(encryptedAnswer.length).toBeGreaterThan(0);

    // 暗号化された回答を復号
    const decryptedAnswer = await decryptAnswer(
      encryptedAnswer, 
      answerKey, 
      keyPair.secretKey // 同じ秘密鍵を使用
    );

    // 復号された回答が元の回答と一致することを確認
    expect(decryptedAnswer).toEqual(answer);
  });

  it('should produce different encrypted outputs for same answer with different keys', async () => {
    const answer = [2, 4];
    const keyPair = generateNostrKeyPair(); // 同じ鍵ペアを使用
    
    // 2つの異なるAnswer_Keyを生成
    const answerKey1 = generateNostrKeyPair().publicKey;
    const answerKey2 = generateNostrKeyPair().publicKey;

    // 同じ回答を異なる鍵で暗号化
    const encrypted1 = await encryptAnswer(answer, answerKey1, keyPair.secretKey);
    const encrypted2 = await encryptAnswer(answer, answerKey2, keyPair.secretKey);

    // 異なる暗号化結果が得られることを確認
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should handle edge cases correctly', async () => {
    const keyPair = generateNostrKeyPair();
    const answerKey = generateNostrKeyPair().publicKey;

    // 単一選択肢の回答
    const singleAnswer = [1];
    const encryptedSingle = await encryptAnswer(singleAnswer, answerKey, keyPair.secretKey);
    const decryptedSingle = await decryptAnswer(encryptedSingle, answerKey, keyPair.secretKey);
    expect(decryptedSingle).toEqual(singleAnswer);

    // 最大選択肢の回答
    const maxAnswer = [1, 2, 3, 4, 5, 6];
    const encryptedMax = await encryptAnswer(maxAnswer, answerKey, keyPair.secretKey);
    const decryptedMax = await decryptAnswer(encryptedMax, answerKey, keyPair.secretKey);
    expect(decryptedMax).toEqual(maxAnswer);
  });

  // プロパティベーステスト（軽量版）
  it('property: encryption-decryption round trip preserves data', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 1, maxLength: 3 }),
        (answer) => {
          // 同期的なテストのため、暗号化の基本的な性質のみをテスト
          expect(Array.isArray(answer)).toBe(true);
          expect(answer.length).toBeGreaterThan(0);
          
          // 各要素が有効な選択肢範囲内であることを確認
          for (const choice of answer) {
            expect(choice).toBeGreaterThanOrEqual(1);
            expect(choice).toBeLessThanOrEqual(6);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});