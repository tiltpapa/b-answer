# 要件ドキュメント

## 概要

b-answerは、制限時間付きの択一クイズをリアルタイムで出題・回答・集計するWebアプリケーションである。Nostrプロトコルを基盤とした分散イベント配信と、Cloudflareを用いたサーバーレス構成により、スケーラブルで高可用性なクイズシステムを提供する。

## 用語集

- **System**: b-answerクイズシステム全体
- **Game_Master**: ゲームを作成・開催・進行する主催者
- **Player**: ゲームに参加し回答するユーザー
- **Game**: 本システムを用いて行われる1つの大会・イベント
- **Nostr_Relay**: Nostrプロトコルに基づくイベント配信サーバー
- **Workers**: Cloudflare Workersによるサーバーレス処理部
- **Web_App**: Cloudflare Pagesで動作するSvelteKitベースのフロントエンド
- **Answer_Key**: プレイヤーの回答を暗号化するための鍵
- **Question_Key**: 非公開ゲームの問題を暗号化するための鍵
- **ReceivedAt**: イベントがNostrリレーに到達した正確な時刻

## 要件

### 要件 1

**ユーザーストーリー:** Game_Masterとして、制限時間付きクイズゲームを作成・開催したいので、問題作成から出題、回答集計、結果発表まで一貫して管理できる機能が必要である

#### 受入基準

1. WHEN Game_Masterがアカウントを作成する THEN System SHALL ゲーム専用のNostr秘密鍵を生成し、Game_Master IDとして管理する
2. WHEN Game_Masterが問題を作成する THEN System SHALL 問題タイトル、問題文、選択肢、正解、解説を含む問題データを保存する
3. WHEN Game_Masterが問題を出題する THEN System SHALL 制限時間付きでNostrイベントとして問題を配信する
4. WHEN Game_Masterが回答を集計する THEN System SHALL 全プレイヤーの回答時刻と正誤を判定し、ランキングを生成する
5. WHEN Game_Masterが結果を発表する THEN System SHALL 正解、解説、ランキングをプレイヤーに配信する

### 要件 2

**ユーザーストーリー:** Playerとして、リアルタイムクイズゲームに参加したいので、問題を受信し、制限時間内に回答し、結果を確認できる機能が必要である

#### 受入基準

1. WHEN Playerがゲームに参加する THEN System SHALL プレイヤー専用のAnswer_Keyを生成し、既存のNostr秘密鍵とは独立して回答暗号化に使用する
2. WHEN Playerが問題を受信する THEN System SHALL 問題文、選択肢、制限時間を表示し、回答可能状態にする
3. WHEN Playerが回答を送信する THEN System SHALL 回答をAnswer_Keyで暗号化し、Nostrイベントとして送信する
4. WHEN Playerが制限時間内に回答する THEN System SHALL 回答時刻をReceivedAtとして正確に記録する
5. WHEN Playerが結果を確認する THEN System SHALL 自分の回答、正解、順位、得点を表示する

### 要件 3

**ユーザーストーリー:** システム管理者として、高精度な時刻管理が必要なので、全イベントの到達時刻を正確に記録・取得できる機能が必要である

#### 受入基準

1. WHEN Nostr_RelayがイベントTHEN System SHALL イベントIDとReceivedAtを専用データベースに記録する
2. WHEN WorkersがReceivedAtを要求する THEN System SHALL 指定されたイベントIDのReceivedAtを返却する
3. WHEN 複数のイベントが同時に到達する THEN System SHALL マイクロ秒精度でReceivedAtを区別して記録する
4. WHEN pタグまたはeタグが存在する THEN System SHALL 関連イベントIDも併せて記録する

### 要件 4

**ユーザーストーリー:** セキュリティ担当者として、プレイヤーの回答と非公開ゲームの問題を保護したいので、適切な暗号化機能が必要である

#### 受入基準

1. WHEN ゲームが開始される THEN System SHALL 各プレイヤー用のAnswer_Keyを生成し、Cloudflare KVに保存する
2. WHEN 非公開ゲームが作成される THEN System SHALL Question_Keyを生成し、主催者と参加プレイヤーが取得可能にする
3. WHEN プレイヤーが回答する THEN System SHALL Answer_Keyで回答を暗号化してからNostrイベントとして送信する
4. WHEN Game_Masterが回答を復号する THEN System SHALL 全プレイヤーのAnswer_Keyを使用して回答を復号可能にする
5. WHEN 非公開ゲームで問題を配信する THEN System SHALL Question_Keyで問題を暗号化してから配信する

### 要件 5

**ユーザーストーリー:** 開発者として、認証とアクセス制御が必要なので、NIP-98に基づく認証機能が必要である

#### 受入基準

1. WHEN WorkersへのAPIリクエストが発生する THEN System SHALL NIP-98認証を要求する
2. WHEN 認証が成功する THEN System SHALL リクエストされた操作を実行する
3. WHEN 認証が失敗する THEN System SHALL アクセスを拒否し、適切なエラーを返却する
4. WHEN 鍵管理操作が要求される THEN System SHALL 認証されたユーザーのみアクセスを許可する

### 要件 6

**ユーザーストーリー:** ユーザーとして、レスポンシブで使いやすいUIが必要なので、デバイスに応じた最適な表示と操作性が必要である

#### 受入基準

1. WHEN Web_Appがロードされる THEN System SHALL デバイスサイズに応じてレスポンシブレイアウトを表示する
2. WHEN Game_Masterがログインする THEN System SHALL TweetDeck風マルチカラムUIを表示する
3. WHEN Playerが回答画面を表示する THEN System SHALL 問題表示部を3:4比率で表示し、その下に6色の回答ボタンを配置する
4. WHEN 回答権がない状態である THEN System SHALL 常にシャッター演出を表示し、回答ボタンを無効化する
5. WHEN キーボード操作が行われる THEN System SHALL 1-6キーで回答ボタンを操作可能にする

### 要件 7

**ユーザーストーリー:** Game_Masterとして、ゲーム進行を効率的に管理したいので、問題管理、回答状況監視、得点管理の統合機能が必要である

#### 受入基準

1. WHEN Game_Masterが問題を管理する THEN System SHALL 下書きフォルダ機能と簡易台本出力機能を提供する
2. WHEN Game_Masterが回答状況を監視する THEN System SHALL リアルタイムでプレイヤー別回答状況を表示する
3. WHEN Game_Masterが得点を管理する THEN System SHALL ピリオド別・総合得点の自動計算と手動調整機能を提供する
4. WHEN Game_Masterが回答権を制御する THEN System SHALL 個別プレイヤーの回答権を有効・無効に切り替える
5. WHEN Game_Masterがプレビューを実行する THEN System SHALL 送信ディレイを無視して即座に問題を表示する

### 要件 8

**ユーザーストーリー:** システム運用者として、データの永続化と冗長性が必要なので、複数のNostrリレーへの分散保存機能が必要である

#### 受入基準

1. WHEN プロフィールデータが作成される THEN System SHALL メインリレーと冗長保存リレーに保存する
2. WHEN 下書きデータが保存される THEN System SHALL 複数のリレーに分散保存して可用性を確保する
3. WHEN 成績データが生成される THEN System SHALL 永続化のため複数リレーに保存する
4. WHEN メインリレーが利用不可能になる THEN System SHALL 冗長保存リレーから自動的にデータを取得する

### 要件 9

**ユーザーストーリー:** セキュリティ監査者として、XSS攻撃を防止したいので、ユーザー生成コンテンツの適切なサニタイゼーション機能が必要である

#### 受入基準

1. WHEN ユーザーが問題文を入力する THEN System SHALL HTMLタグとスクリプトをサニタイズする
2. WHEN ユーザーが選択肢を入力する THEN System SHALL 悪意のあるコードを無害化する
3. WHEN プレイヤー名が表示される THEN System SHALL XSS攻撃を防ぐためエスケープ処理を実行する
4. WHEN 解説文が表示される THEN System SHALL 安全なHTMLのみを許可し、危険なタグを除去する

### 要件 10

**ユーザーストーリー:** 開発者として、ローカル開発とブランチ別デプロイが必要なので、環境に応じた柔軟なデプロイメント機能が必要である

#### 受入基準

1. WHEN ローカル環境で開発する THEN System SHALL 全コンポーネントがローカルで実行可能な構成を提供する
2. WHEN ブランチがプッシュされる THEN System SHALL ブランチ名に基づいてWeb_Appをサブディレクトリにデプロイする
3. WHEN 本番環境にデプロイする THEN System SHALL 全コンポーネントが連携して動作することを確認する