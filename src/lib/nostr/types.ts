// nostr-toolsの型をインポート
import type { Event, Filter } from 'nostr-tools';

// nostr-toolsの型をエクスポート（利便性のため）
export type { Event as NostrEvent, Filter, EventTemplate, UnsignedEvent, VerifiedEvent } from 'nostr-tools';

// b-answer固有の型定義のみを定義
export interface NostrRelay {
  url: string;
  read: boolean;
  write: boolean;
}

export interface NostrProfile {
  name?: string;
  about?: string;
  picture?: string;
  website?: string;
}

// b-answer固有のイベント型定義
// 共通のクライアントタグを生成するヘルパー関数
export function createClientTag(): ["client", "b-answer", "31990:7232d725dbbab9c881b2a26af88fd651dd917362a70ec7d3018296c6a22ff54e:b-answer", "wss://relay.b-answer.tiltpapa.tv"] {
  return ["client", "b-answer", "31990:7232d725dbbab9c881b2a26af88fd651dd917362a70ec7d3018296c6a22ff54e:b-answer", "wss://relay.b-answer.tiltpapa.tv"];
}

export interface GameMasterProfile extends Event {
  kind: 0;
  content: string; // JSON: NostrProfile
}

export interface PlayerProfile extends Event {
  kind: 30078;
  tags: string[][];
  content: string; // JSON: {name: string, pronunciation?: string, eula: string | false}
}

export interface StartEvent extends Event {
  kind: 78;
  tags: string[][];
  content: string; // Question JSON (answerフィールド除く)
}

export interface PlayerAnswerEvent extends Event {
  kind: 78;
  tags: string[][];
  content: string; // 暗号化された回答
}

// 問題データ構造（format.md準拠）
export interface Question {
  type: "choice" | "sort" | "bonus" | "point";
  question: {
    type: "text" | "image";
    content: string; // テキストまたは画像リンク
  };
  choices: Array<{
    type: "text" | "image";
    content: string; // テキストまたは画像リンク
    explanation: string; // 選択肢の解説
  }>;
  answer: number[]; // 正解の選択肢番号配列 (1-based indexing)
  total: number;    // 選択肢の総数 (1以上)
  required: number; // 正解として必要な選択肢数 (totalまで)
  point: number;    // この問題の得点
  prize: {
    type: "single" | "split";
    price: number;
  };
  version: string;  // フォーマットバージョン
}

// 出題時用（answerフィールドを除いた問題）
export type PublishedQuestion = Omit<Question, 'answer'>;

// プレイヤー成績データ
export interface PlayerScore {
  playerId: string;        // Player pubkey
  playerName: string;      // 表示名
  questionId: string;      // 問題のevent ID
  answer: number[];        // 回答した選択肢
  isCorrect: boolean;      // 正誤
  responseTime: number;    // 回答時間（マイクロ秒）
  points: number;          // 獲得得点
  timestamp: number;       // 回答時刻
}