# RandomTalk Real-Time Starter

## Run locally
1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:
   npm install
   npm start
4. Open http://localhost:3000 in two browser tabs.
5. Press "Find / Next" in both tabs. They will be matched.

## Important
This is a starter backend, not a production anonymous-chat service.

Before public launch, add:
- proper authentication and age-appropriate access controls
- persistent database
- abuse/spam/rate-limit controls
- moderation dashboard and secure report storage
- block lists that persist
- privacy policy, terms, data retention/deletion rules
- secure deployment (HTTPS/WSS), secrets management and logging
- CSRF/CORS/security headers as appropriate
- automated and human moderation
- legal review for the countries where the service operates
- a compliant payment/ad integration if monetized

Do not treat the in-memory reports array as secure production storage.
