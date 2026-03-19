# @cmts-dev/carmentis-desk-connect-vuejs

Vue.js components for connecting to Carmentis Desk via relay protocol.

## Installation

```bash
npm install @cmts-dev/carmentis-desk-connect-vuejs
# or
pnpm add @cmts-dev/carmentis-desk-connect-vuejs
```

## Usage

### Authentication Popup

```vue
<script setup>
import { ref } from 'vue';
import { CarmentisAuthPopup } from '@cmts-dev/carmentis-desk-connect-vuejs';
import '@cmts-dev/carmentis-desk-connect-vuejs/style.css';

const showAuth = ref(false);

const handleAuthResponse = (response) => {
  console.log('Public key:', response.publicKey);
  console.log('Signature:', response.signature);
};

const handleError = (error) => {
  console.error('Error:', error);
};
</script>

<template>
  <CarmentisAuthPopup
    v-model:visible="showAuth"
    relay-url="https://relay.testnet.carmentis.io"
    challenge="dGVzdA=="
    @response="handleAuthResponse"
    @error="handleError"
  />
</template>
```

### Event Approval Popup

```vue
<script setup>
import { ref } from 'vue';
import { CarmentisApprovalPopup } from '@cmts-dev/carmentis-desk-connect-vuejs';
import '@cmts-dev/carmentis-desk-connect-vuejs/style.css';

const showApproval = ref(false);

const handleApprovalResponse = (response) => {
  console.log('VB Hash:', response.b64VbHash);
  console.log('MB Hash:', response.b64MbHash);
  console.log('Height:', response.height);
};
</script>

<template>
  <CarmentisApprovalPopup
    v-model:visible="showApproval"
    relay-url="https://relay.testnet.carmentis.io"
    anchor-request-id="1234"
    server-url="https://server.testnet.carmentis.io"
    @response="handleApprovalResponse"
  />
</template>
```

## Development

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

## Release

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and publishing.

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add new feature` → Minor version bump (0.x.0)
- `fix: fix bug` → Patch version bump (0.0.x)
- `feat!: breaking change` → Major version bump (x.0.0)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:` → No release

### Publishing

1. Set up `NPM_TOKEN` secret in GitHub repository settings
2. Push commits to `main` branch
3. GitHub Actions will automatically:
   - Build the project
   - Run semantic-release
   - Publish to npm
   - Create GitHub release with changelog

## License

MIT
