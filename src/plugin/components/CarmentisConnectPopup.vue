<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { WalletRequestType } from '@cmts-dev/carmentis-sdk/client';
import { useCarmentisSession } from '../composables/useCarmentisSession';
import type { CarmentisPopupOptions, ConnectionStatus } from '../types';
import Button from 'primevue/button';

const props = defineProps<{
  options: CarmentisPopupOptions;
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'message': [message: any];
  'ready': [];
  'connected': [];
  'disconnected': [];
}>();

const session = useCarmentisSession();

const title = computed(() => {
  return props.options.requestType === WalletRequestType.AUTH_BY_PUBLIC_KEY
    ? 'Authenticate with Carmentis Desk'
    : 'Approve Event';
});

const statusText = computed(() => {
  switch (session.connectionStatus.value) {
    case 'unset':
      return 'Initializing...';
    case 'ready':
      return 'Waiting for connection...';
    case 'connected':
      return 'Connected';
    case 'disconnected':
      return 'Disconnected';
    default:
      return '';
  }
});

const statusClass = computed(() => {
  switch (session.connectionStatus.value) {
    case 'connected':
      return 'status-connected';
    case 'disconnected':
      return 'status-disconnected';
    case 'ready':
      return 'status-ready';
    default:
      return 'status-pending';
  }
});

const openDesk = () => {
  const deepLink = session.getDeepLink();
  window.location.href = deepLink;
};

const close = () => {
  emit('update:visible', false);
};

onMounted(async () => {
  if (props.visible) {
    await session.createSession(props.options.relayUrl);

    // Send the request based on type
    if (props.options.requestData) {
      session.sendRequest(props.options.requestData);
    }
  }
});

// Watch for messages
const unwatchMessages = () => {
  return session.messages;
};

// Emit events
const checkMessages = () => {
  if (session.messages.value.length > 0) {
    const lastMessage = session.messages.value[session.messages.value.length - 1];
    emit('message', lastMessage);
  }
};

// Track emitted states to avoid duplicate emissions
let lastEmittedStatus: ConnectionStatus | null = null;

// Watch connection status
const checkConnectionStatus = () => {
  const currentStatus = session.connectionStatus.value;

  if (currentStatus !== lastEmittedStatus) {
    if (currentStatus === 'ready') {
      emit('ready');
    } else if (currentStatus === 'connected') {
      emit('connected');
    } else if (currentStatus === 'disconnected') {
      emit('disconnected');
    }
    lastEmittedStatus = currentStatus;
  }
};

// Simple watchers
setInterval(() => {
  checkMessages();
  checkConnectionStatus();
}, 100);
</script>

<template>
  <div v-if="visible" class="carmentis-popup-overlay" @click="close">
    <div class="carmentis-popup" @click.stop>
      <div class="popup-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>

      <div class="popup-content">
        <div class="status-section">
          <div class="status-indicator" :class="statusClass"></div>
          <span class="status-text">{{ statusText }}</span>
        </div>

        <div class="info-text">
          <p v-if="session.connectionStatus.value === 'ready'">
            Click the button below to open Carmentis Desk and complete your request.
          </p>
          <p v-else-if="session.connectionStatus.value === 'connected'">
            Connection established. Please check Carmentis Desk to continue.
          </p>
          <p v-else-if="session.connectionStatus.value === 'disconnected'">
            Connection closed.
          </p>
        </div>

        <div class="action-section">
          <Button
            label="Open Carmentis Desk"
            @click="openDesk"
            :disabled="session.connectionStatus.value !== 'ready' && session.connectionStatus.value !== 'connected'"
            severity="primary"
            class="open-desk-btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carmentis-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.carmentis-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 450px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.popup-content {
  padding: 28px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-pending {
  background: #d1d5db;
  animation: pulse 2s infinite;
}

.status-ready {
  background: #fbbf24;
  animation: pulse 2s infinite;
}

.status-connected {
  background: #10b981;
}

.status-disconnected {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.info-text {
  margin-bottom: 24px;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
}

.action-section {
  display: flex;
  justify-content: center;
}

.open-desk-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
}
</style>
