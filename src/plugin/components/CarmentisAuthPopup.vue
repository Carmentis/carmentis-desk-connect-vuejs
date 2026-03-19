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

const sendAuthRequest = () => {
  if (popupBase.value) {
    const authRequest = {
      type: WalletRequestType.AUTH_BY_PUBLIC_KEY,
      base64EncodedChallenge: props.challenge
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
  try {
    const validatedResponse = v.parse(WalletResponseAuthByPublicKeySchema, message);
    console.log("Authentication response provided:", validatedResponse)
    emit('response', validatedResponse);
  } catch (error) {
    emit('error', error instanceof Error ? error : new Error('Invalid response format'));
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
