<script lang="ts">
  import { onMount } from 'svelte';
  import { NostrRelayManager } from '$lib/nostr/relay';
  import { generateNostrKeyPair } from '$lib/nostr/keys';

  let relayManager: NostrRelayManager;
  let connectionStatus = 'Disconnected';
  let keyPair: { secretKey: string; publicKey: string } | null = null;

  onMount(async () => {
    relayManager = new NostrRelayManager();
    
    try {
      connectionStatus = 'Connecting...';
      await relayManager.connectToDefaultRelays();
      connectionStatus = `Connected to ${relayManager.getConnectedRelayCount()} relays`;
    } catch (error) {
      connectionStatus = 'Connection failed';
      console.error('Failed to connect to relays:', error);
    }
  });

  function generateKeys() {
    keyPair = generateNostrKeyPair();
  }
</script>

<svelte:head>
  <title>b-answer Quiz System</title>
</svelte:head>

<div class="container">
  <h1>b-answer Quiz System</h1>
  
  <section class="status">
    <h2>Connection Status</h2>
    <p class="status-text">{connectionStatus}</p>
  </section>

  <section class="keys">
    <h2>Nostr Key Generation</h2>
    <button on:click={generateKeys}>Generate New Key Pair</button>
    
    {#if keyPair}
      <div class="key-display">
        <div class="key-item">
          <label>Public Key:</label>
          <code>{keyPair.publicKey}</code>
        </div>
        <div class="key-item">
          <label>Secret Key:</label>
          <code>{keyPair.secretKey}</code>
        </div>
      </div>
    {/if}
  </section>
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }

  .status, .keys {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  .status-text {
    font-weight: bold;
    color: #666;
  }

  button {
    background: #007cba;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #005a87;
  }

  .key-display {
    margin-top: 1rem;
  }

  .key-item {
    margin-bottom: 1rem;
  }

  .key-item label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .key-item code {
    display: block;
    background: #f5f5f5;
    padding: 0.5rem;
    border-radius: 4px;
    word-break: break-all;
    font-family: monospace;
  }
</style>