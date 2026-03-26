<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { JsonRpc, type JsonRpcRequest, type JsonRpcSuccessResponse } from '@cmts-dev/carmentis-sdk-json-rpc';
import CarmentisPopupBase from './CarmentisPopupBase.vue';

const props = defineProps<{
  visible: boolean;
  relayUrl: string;
  challenge: string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'message': [message: any];
  'ready': [];
  'connected': [];
  'disconnected': [];
  'close-requested': [];
  'response': [response: JsonRpcSuccessResponse];
  'error': [error: Error];
}>();

const popupBase = ref<InstanceType<typeof CarmentisPopupBase>>();

const sendAuthRequest = () => {
  if (popupBase.value) {
    const authRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'wr-auth-pk',
      params: {
        base64EncodedChallenge: props.challenge
      }
    };
    popupBase.value.session.sendRequest(authRequest);
  }
};

onMounted(async () => {
  if (props.visible && popupBase.value) {
    await popupBase.value.session.createSession(props.relayUrl, sendAuthRequest);
  }
});

async function onConnected() {
  emit("connected")
  sendAuthRequest()
}

async function onMessage(message: any) {
  if (JsonRpc.isSuccessResponse(message)) {
    console.log("Authentication response provided:", message)
    emit('response', message);
  } else if (JsonRpc.isErrorResponse(message)) {
    emit('error', new Error(`JSON-RPC error ${message.error.code}: ${message.error.message}`));
  } else {
    emit('error', new Error('Invalid response format'));
  }
}

</script>

<template>
  <CarmentisPopupBase
    ref="popupBase"
    :visible="visible"
    title="Authenticate with Carmentis Desk"
    :relay-url="relayUrl"
    @update:visible="emit('update:visible', $event)"
    @message="(event) => onMessage(event)"
    @ready="emit('ready')"
    @connected="() => onConnected()"
    @disconnected="emit('disconnected')"
    @close-requested="emit('close-requested')"
  />
</template>
