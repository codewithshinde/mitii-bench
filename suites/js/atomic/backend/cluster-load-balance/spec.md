Build a basic multi-process web server using Node `cluster` module.

* **Master Process**: Forks workers based on `os.cpus().length`.
* **Workers**: Listen on port `3000` sharing socket.

Implement primarily in `src/clusterServer.js` (add helper modules under `src/` as needed). Keep `npm run build` succeeding.
