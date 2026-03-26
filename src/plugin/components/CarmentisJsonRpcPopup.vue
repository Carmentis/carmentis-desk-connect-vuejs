<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { JsonRpc, type JsonRpcRequest, type JsonRpcSuccessResponse } from '@cmts-dev/carmentis-sdk-json-rpc';
import CarmentisPopupBase from './CarmentisPopupBase.vue';

const props = defineProps<{
  visible: boolean;
  relayUrl: string;
  title?: string;
  request: JsonRpcRequest;
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

const sendRequest = () => {
  if (popupBase.value) {
    popupBase.value.session.sendRequest(props.request);
  }
};

onMounted(async () => {
  if (props.visible && popupBase.value) {
    await popupBase.value.session.createSession(props.relayUrl, sendRequest);
  }
});

async function onConnected() {
  emit('connected');
  sendRequest();
}

async function onMessage(message: any) {
  if (JsonRpc.isSuccessResponse(message)) {
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
    :title="title ?? 'Carmentis Desk'"
    :relay-url="relayUrl"
    @update:visible="emit('update:visible', $event)"
    @message="(event) => onMessage(event)"
    @ready="emit('ready')"
    @connected="() => onConnected()"
    @disconnected="emit('disconnected')"
    @close-requested="emit('close-requested')"
  >
    <slot name="extra-content" />
  </CarmentisPopupBase>
</template>
