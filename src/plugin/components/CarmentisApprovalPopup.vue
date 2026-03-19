<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { WalletRequestType, type WalletResponseDataApproval, WalletResponseType, WalletResponseDataApprovalSchema } from '@cmts-dev/carmentis-sdk/client';
import * as v from 'valibot';
import CarmentisPopupBase from './CarmentisPopupBase.vue';
import Button from 'primevue/button';

const props = defineProps<{
  visible: boolean;
  relayUrl: string;
  anchorRequestId: string;
  serverUrl: string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'message': [message: any];
  'ready': [];
  'connected': [];
  'disconnected': [];
  'close-requested': [];
  'response': [response: WalletResponseDataApproval];
  'error': [error: Error];
}>();

const popupBase = ref<InstanceType<typeof CarmentisPopupBase>>();

const sendApprovalRequest = () => {
  if (popupBase.value) {
    const approvalRequest = {
      type: WalletRequestType.DATA_APPROVAL,
      anchorRequestId: props.anchorRequestId,
      serverUrl: props.serverUrl
    };
    popupBase.value.session.sendRequest(approvalRequest);
  }
};

onMounted(async () => {
  if (props.visible && popupBase.value) {
    await popupBase.value.session.createSession(props.relayUrl, sendApprovalRequest);
  }
});

// Watch for messages and emit response
watch(() => popupBase.value?.session.messages.value, (messages) => {
  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === WalletResponseType.DATA_APPROVAL) {
      try {
        const validatedResponse = v.parse(WalletResponseDataApprovalSchema, lastMessage);
        emit('response', validatedResponse);
      } catch (error) {
        emit('error', error instanceof Error ? error : new Error('Invalid response format'));
      }
    }
  }
}, { deep: true });
</script>

<template>
  <CarmentisPopupBase
    ref="popupBase"
    :visible="visible"
    title="Approve Event"
    :relay-url="relayUrl"
    @update:visible="emit('update:visible', $event)"
    @message="emit('message', $event)"
    @ready="emit('ready')"
    @connected="emit('connected')"
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

<style scoped>
.event-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.event-info h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.info-item .value {
  font-size: 13px;
  color: #1a1a1a;
  word-break: break-all;
}
</style>
