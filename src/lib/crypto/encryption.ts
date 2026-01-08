import { nip04 } from 'nostr-tools';

/**
 * Answer_Keyを使用して回答を暗号化する
 * @param answer - 暗号化する回答データ
 * @param answerKey - 暗号化に使用するAnswer_Key
 * @param senderSecretKey - 送信者の秘密鍵
 * @returns 暗号化された回答文字列
 */
export async function encryptAnswer(
  answer: number[], 
  answerKey: string, 
  senderSecretKey: string
): Promise<string> {
  try {
    const answerJson = JSON.stringify(answer);
    const encrypted = await nip04.encrypt(senderSecretKey, answerKey, answerJson);
    return encrypted;
  } catch (error) {
    console.error('Failed to encrypt answer:', error);
    throw new Error('Answer encryption failed');
  }
}

/**
 * Answer_Keyを使用して回答を復号する
 * @param encryptedAnswer - 暗号化された回答
 * @param answerKey - 復号に使用するAnswer_Key
 * @param receiverSecretKey - 受信者の秘密鍵
 * @returns 復号された回答データ
 */
export async function decryptAnswer(
  encryptedAnswer: string, 
  answerKey: string, 
  receiverSecretKey: string
): Promise<number[]> {
  try {
    const decrypted = await nip04.decrypt(receiverSecretKey, answerKey, encryptedAnswer);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt answer:', error);
    throw new Error('Answer decryption failed');
  }
}

/**
 * Question_Keyを使用して問題を暗号化する
 * @param question - 暗号化する問題データ
 * @param questionKey - 暗号化に使用するQuestion_Key
 * @param senderSecretKey - 送信者の秘密鍵
 * @returns 暗号化された問題文字列
 */
export async function encryptQuestion(
  question: object, 
  questionKey: string, 
  senderSecretKey: string
): Promise<string> {
  try {
    const questionJson = JSON.stringify(question);
    const encrypted = await nip04.encrypt(senderSecretKey, questionKey, questionJson);
    return encrypted;
  } catch (error) {
    console.error('Failed to encrypt question:', error);
    throw new Error('Question encryption failed');
  }
}

/**
 * Question_Keyを使用して問題を復号する
 * @param encryptedQuestion - 暗号化された問題
 * @param questionKey - 復号に使用するQuestion_Key
 * @param receiverSecretKey - 受信者の秘密鍵
 * @returns 復号された問題データ
 */
export async function decryptQuestion(
  encryptedQuestion: string, 
  questionKey: string, 
  receiverSecretKey: string
): Promise<object> {
  try {
    const decrypted = await nip04.decrypt(receiverSecretKey, questionKey, encryptedQuestion);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt question:', error);
    throw new Error('Question decryption failed');
  }
}