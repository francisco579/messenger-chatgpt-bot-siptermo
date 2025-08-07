# messenger-chatgpt-bot-siptermo

Bot para Facebook Messenger que responde utilizando ChatGPT-3.5 (OpenAI).  
Preparado para desplegar en [Railway](https://railway.app/) fácilmente.

## ¿Qué hace este bot?
- Recibe mensajes en tu página de Facebook Messenger.
- Envía el mensaje a ChatGPT-3.5 y responde automáticamente.

## Requisitos

1. **Cuenta de OpenAI** — para obtener tu API Key.
2. **Página de Facebook** — para crear el bot y obtener el token de Messenger.
3. **Cuenta en Railway** — para desplegar el bot.
4. **Cuenta en GitHub** — para guardar y conectar el código.

## Configuración rápida

1. Clona este repositorio en tu GitHub.
2. Crea un proyecto en Railway y conecta tu repositorio.
3. Configura las variables de entorno (Railway > Settings > Variables):
    - `OPENAI_API_KEY` — tu API Key de OpenAI.
    - `FB_PAGE_ACCESS_TOKEN` — el token de tu página de Facebook.
    - `FB_VERIFY_TOKEN` — el token de verificación que tú elijas para el webhook.
4. Publica tu URL de webhook en Facebook Developers (Messenger > Webhooks).
5. ¡Listo! Tu bot responderá los mensajes de Messenger con ChatGPT-3.5.

## Archivos principales

- `index.js` — Código principal del bot.
- `src/openai.js` — Conexión con la API de OpenAI.
- `src/messenger.js` — Conexión con la API de Messenger.

## ¿Necesitas ayuda?
Escríbeme por GitHub Issues o pregunta aquí.
