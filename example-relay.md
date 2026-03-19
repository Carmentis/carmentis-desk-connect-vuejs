```vue
<script setup lang="ts">
import Button from 'primevue/button';
import {Initiator} from "@cmts-dev/carmentis-relay-client";
import {onMounted, ref} from "vue";
import {type WalletRequestAuthByPublicKey, WalletRequestType} from '@cmts-dev/carmentis-sdk/client';
import type {WalletRequestDataApproval} from "@cmts-dev/carmentis-sdk/client";

const relayUrl = "https://relay.testnet.carmentis.io";
const sessionId = ref('');
const symKey = ref('');
const connectionStatus = ref<'unset' | 'ready' | 'connected' | 'disconnected'>('unset')
const initiator = await Initiator.createSession(relayUrl);

function askAuth() {
  initiator.send({
    type: WalletRequestType.AUTH_BY_PUBLIC_KEY,
    base64EncodedChallenge: 'test'
  })
}

function askEventApproval() {
  const request: WalletRequestDataApproval = {
    type: WalletRequestType.DATA_APPROVAL,
    anchorRequestId: "1234",
    serverUrl: "https://server.testnet.carmentis.io",
  }
  initiator.send(request)
}

const messages = ref<object[]>([])
onMounted(async () => {

  await initiator.init();
  connectionStatus.value = 'ready';
  sessionId.value = initiator.getSessionId()
  symKey.value = initiator.getKey();

  initiator.onMessage((message) => {
    messages.value.push(message);
  });

  initiator.onSessionReady(() => {
    console.log('session ready')

    connectionStatus.value = 'connected';
  })

  initiator.onClose(() => {
    connectionStatus.value = 'disconnected';
  })

})
</script>

<template>
  <button @click="askAuth">Ask auth</button>
  <button @click="askEventApproval">Ask event approval</button>/>
  <a :href="`cmts://connect/carmentis-relay?relay=${relayUrl}&sessionId=${sessionId}&symKey=${symKey}`">Open desktop</a> {{sessionId}}
  <p>Received messages: {{messages.length}}</p>
  <p v-for="message of messages">{{JSON.stringify(message)}}</p>
  <p>Connection status: {{connectionStatus}}</p>
</template>

<style scoped></style>

```