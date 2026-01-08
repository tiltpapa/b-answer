import { Relay } from 'nostr-tools';
import { finalizeEvent, verifyEvent } from 'nostr-tools';
import type { NostrEvent, Filter } from './types';

export class NostrRelayManager {
  private relays: Map<string, Relay> = new Map();
  private defaultRelays = [
    'wss://relay.b-answer.tiltpapa.tv',
    'wss://yabu.me',
    'wss://nos.lol'
  ];

  /**
   * リレーに接続する
   * @param url - リレーのURL
   */
  async connectToRelay(url: string): Promise<Relay> {
    if (this.relays.has(url)) {
      return this.relays.get(url)!;
    }

    try {
      const relay = await Relay.connect(url);
      this.relays.set(url, relay);
      
      console.log(`Connected to relay: ${url}`);

      return relay;
    } catch (error) {
      console.error(`Failed to connect to relay ${url}:`, error);
      throw error;
    }
  }

  /**
   * デフォルトリレーに接続する
   */
  async connectToDefaultRelays(): Promise<void> {
    const connectionPromises = this.defaultRelays.map(url => 
      this.connectToRelay(url).catch(error => {
        console.warn(`Failed to connect to default relay ${url}:`, error);
        return null;
      })
    );

    const results = await Promise.allSettled(connectionPromises);
    const connectedCount = results.filter(result => 
      result.status === 'fulfilled' && result.value !== null
    ).length;

    if (connectedCount === 0) {
      throw new Error('Failed to connect to any default relays');
    }

    console.log(`Connected to ${connectedCount} out of ${this.defaultRelays.length} default relays`);
  }

  /**
   * イベントを送信する
   * @param event - 送信するイベント
   * @param secretKey - 署名用の秘密鍵
   */
  async publishEvent(event: Omit<NostrEvent, 'id' | 'sig'>, secretKey: string): Promise<string> {
    const secretKeyBytes = new Uint8Array(
      secretKey.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    const signedEvent = finalizeEvent(event, secretKeyBytes);
    
    if (!verifyEvent(signedEvent)) {
      throw new Error('Invalid event signature');
    }

    const publishPromises = Array.from(this.relays.values()).map(async (relay) => {
      try {
        await relay.publish(signedEvent);
        return true;
      } catch (error) {
        console.error(`Failed to publish to relay:`, error);
        return false;
      }
    });

    const results = await Promise.allSettled(publishPromises);
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    if (successCount === 0) {
      throw new Error('Failed to publish event to any relay');
    }

    console.log(`Event published to ${successCount} relays`);
    return signedEvent.id;
  }

  /**
   * イベントを購読する
   * @param filters - フィルター条件
   * @param onEvent - イベント受信時のコールバック
   */
  async subscribeToEvents(
    filters: Filter[], 
    onEvent: (event: NostrEvent) => void
  ): Promise<() => void> {
    const subscriptions: (() => void)[] = [];

    for (const relay of this.relays.values()) {
      try {
        const subscription = relay.subscribe(filters, {
          onevent: onEvent,
          oneose: () => {
            console.log('End of stored events from relay');
          }
        });

        subscriptions.push(() => subscription.close());
      } catch (error) {
        console.error('Failed to subscribe to relay:', error);
      }
    }

    // 全ての購読を停止する関数を返す
    return () => {
      subscriptions.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * 特定のイベントを取得する
   * @param filters - フィルター条件
   * @returns 取得したイベントの配列
   */
  async getEvents(filters: Filter[]): Promise<NostrEvent[]> {
    const events: NostrEvent[] = [];
    const eventIds = new Set<string>();

    const subscriptionPromises = Array.from(this.relays.values()).map(relay => {
      return new Promise<void>((resolve) => {
        const subscription = relay.subscribe(filters, {
          onevent: (event: NostrEvent) => {
            if (!eventIds.has(event.id)) {
              eventIds.add(event.id);
              events.push(event);
            }
          },
          oneose: () => {
            subscription.close();
            resolve();
          }
        });
      });
    });

    await Promise.allSettled(subscriptionPromises);
    return events;
  }

  /**
   * 全てのリレー接続を閉じる
   */
  async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.relays.values()).map(relay => relay.close());
    await Promise.allSettled(closePromises);
    this.relays.clear();
  }

  /**
   * 接続中のリレー数を取得する
   */
  getConnectedRelayCount(): number {
    return this.relays.size;
  }

  /**
   * 接続中のリレーURLリストを取得する
   */
  getConnectedRelayUrls(): string[] {
    return Array.from(this.relays.keys());
  }
}