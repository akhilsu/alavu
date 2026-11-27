# Alavu

A spoken measurement book for tailors, installers and anyone measuring with both hands occupied. Built for Scaler × Wispr Flow Build for Bharat, Round 2, November 2026.

## Run

Run `docker compose up --build`, then open http://localhost:4173 in Chrome. The main screen starts without API keys. Alternatively install Node 20 or newer and run `npm start`. There are no npm dependencies. Run `npm test` for the measurement parser checks.

## Try the main flow

Choose Blouse fitting and English India or Malayalam. Press the microphone and grant access when ready. Say “Shoulder fourteen and a half inches, sleeve five and a half inches.” Alavu reads back the values and pauses recognition while speaking. Say “change sleeve to six and a quarter inches.” Say “review,” check the values, then “save.” Open the saved card to retrieve it. Save creates a numeric card ID shown in the interface.

Choose Window for width and drop in centimetres. Custom measurements accepts a label followed by a numeric value and a unit, such as “desk depth 60 centimetres.” English fractions and selected Malayalam field and number aliases are handled by the shared parser. Unclear values are held for correction, and the app requires a full review before confirming a save.

## Speech and data

Live speech uses the browser Web Speech API, which is available in supported Chrome environments on localhost or HTTPS. Recognition needs browser permission and may need the provider's internet service. Audio may be processed by the browser's provider. Alavu does not record or retain audio. Recognition language availability and mixed-language accuracy vary by device and provider. Readback uses an installed English voice.

The transcript field accepts Wispr Flow dictation and typed text through the same parser. “Try sample transcripts” is explicitly labeled sample input. It demonstrates parsing and error recovery when live speech is unavailable. It should be identified as sample mode in a demo.

Confirmed cards are stored in localStorage on the current browser. Export CSV for a portable copy. There is no account, server database, tracking or cross-device synchronization. Body measurement records can be sensitive, so use anonymous card names and sample dimensions for evaluation.

## Dependencies and limitations

The web interface and parser use plain JavaScript. The Node server uses built-in modules. Docker uses the official Node 22 Alpine base image. Google Fonts is optional and the system font fallback works without it. Browser recognition and voice services are outside Alavu's control. If they become unavailable, the transcript input and stored cards remain usable. Switching browsers requires exporting the records.

The prototype covers one measurement workflow. It does not infer dimensions from audio or validate that the tape was placed correctly. Users review the values and units before cutting or ordering material. Pilot speed and accuracy targets described in the pitch are proposed targets, with no claimed completed user study.

## API references

- [Browser recognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
- [Voice readback](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
