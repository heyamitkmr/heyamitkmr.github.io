# Setting up AI (optional)

Dailyish works fully without AI. AI adds: tailored instant plans, free-text tuning, the in-depth planning chat, "Tell me how today went", and "How am I doing?".

Calls go **directly from your browser** to the provider you choose. Your key stays in this browser and is never exported.

## OpenRouter (easiest; many models)
1. Create an account at openrouter.ai and make an API key. **Set a low credit limit on the key.**
2. In Dailyish: Settings → AI → Set up → Provider "OpenRouter". The default model is a fast, inexpensive one; any OpenRouter model id works.
3. Paste the key, press **Test**, then **Save**.

Dailyish asks OpenRouter to use only providers that don't store or train on your data.

## Ollama (local, private)
1. Install Ollama and pull a model (e.g. `ollama pull llama3.2`).
2. Allow this site to call it. Set the environment variable before starting Ollama:
   `OLLAMA_ORIGINS=https://<your-username>.github.io` (or the address you use), then restart Ollama.
3. Settings → AI → Provider "Ollama (local)" → model name → Test → Save.

## LM Studio (local, private)
1. Load a model and start the local server.
2. Turn on **CORS** in the server settings.
3. Settings → AI → Provider "LM Studio (local)" → model id → Test → Save.

## Other OpenAI-compatible services
Choose "Other OpenAI-compatible" and enter the base URL (ending in `/v1`), the model id and the key. Some providers block requests from browsers; if Test fails with "couldn't reach", that is usually why.

## Browser notes
Chrome, Edge and Firefox allow an https page to call `http://localhost` (for local models). Safari may block it; use the hosted providers there.
