Build a real-time chat room backend using `socket.io`.

* **Event**: `join-room` payload `{ roomId }`.
* **Event**: `send-message` payload `{ roomId, message }`. Broadcasts message strictly to sockets in specified room.

Implement primarily in `src/chat.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
