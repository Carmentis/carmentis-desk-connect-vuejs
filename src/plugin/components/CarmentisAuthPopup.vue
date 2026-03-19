<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { WalletRequestType, type WalletResponseAuthByPublicKey, WalletResponseType, WalletResponseAuthByPublicKeySchema } from '@cmts-dev/carmentis-sdk/client';
import * as v from 'valibot';
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
  'response': [response: WalletResponseAuthByPublicKey];
  'error': [error: Error];
}>();

const popupBase = ref<InstanceType<typeof CarmentisPopupBase>>();

onMounted(async () => {
  if (props.visible && popupBase.value) {
    await popupBase.value.session.createSession(props.relayUrl);

    // Send authentication request
    const authRequest = {
      type: WalletRequestType.AUTH_BY_PUBLIC_KEY,
      base64EncodedChallenge: props.challenge
    };
    popupBase.value.session.sendRequest(authRequest);
  }
});

// Watch for messages and emit response
watch(() => popupBase.value?.session.messages.value, (messages) => {
  if (messages && messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.type === WalletResponseType.AUTH_BY_PUBLIC_KEY) {
      try {
        const validatedResponse = v.parse(WalletResponseAuthByPublicKeySchema, lastMessage);
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
    title="Authenticate with Carmentis Desk"
    :relay-url="relayUrl"
    @update:visible="emit('update:visible', $event)"
    @message="emit('message', $event)"
    @ready="emit('ready')"
    @connected="emit('connected')"
    @disconnected="emit('disconnected')"
    @close-requested="emit('close-requested')"
  />
</template>
