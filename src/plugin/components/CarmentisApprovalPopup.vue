<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { JsonRpc, type JsonRpcRequest, type JsonRpcSuccessResponse } from '@cmts-dev/carmentis-sdk-json-rpc';
import CarmentisPopupBase from './CarmentisPopupBase.vue';

const props = defineProps<{
  visible: boolean;
  relayUrl: string;
  anchorRequestId: string;
  serverUrl: string;
  showTechnicalDetails?: boolean;
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

const sendApprovalRequest = () => {
  if (popupBase.value) {
    const approvalRequest: JsonRpcRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'wr-data-approval',
      params: {
        anchorRequestId: props.anchorRequestId,
        serverUrl: props.serverUrl
      }
    };
    popupBase.value.session.sendRequest(approvalRequest);
  }
};

onMounted(async () => {
  if (props.visible && popupBase.value) {
    await popupBase.value.session.createSession(props.relayUrl, sendApprovalRequest);
  }
});

async function onConnected() {
  emit("connected")
  sendApprovalRequest()
}

async function onMessage(message: any) {
  if (JsonRpc.isSuccessResponse(message)) {
    console.log("Approval response provided:", message)
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
    title="Approve Event"
    :relay-url="relayUrl"
    :show-technical-details="showTechnicalDetails"
    @update:visible="emit('update:visible', $event)"
    @message="(event) => onMessage(event)"
    @ready="emit('ready')"
    @connected="() => onConnected()"
    @disconnected="emit('disconnected')"
    @close-requested="emit('close-requested')"
  >
    <template #extra-content>
      <div class="event-info">
        <h3>Request Details</h3>
        <div class="info-item">
          <span class="label">Anchor Request ID:</span>
          <span class="value">{{ anchorRequestId }}</span>
        </div>
        <div class="info-item">
          <span class="label">Server URL:</span>
          <span class="value">{{ serverUrl }}</span>
        </div>
      </div>
    </template>
  </CarmentisPopupBase>
</template>

<!-- Styles are defined in src/assets/main.scss -->
