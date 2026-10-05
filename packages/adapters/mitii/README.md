# @mitii-bench/adapter-mitii

Invokes the Mitii CLI against an isolated case workspace.

Configure via:

- `MITII_BIN` env var, or
- `runner.config.json` → `mitiiBin`, or
- sibling path `../Mitii/apps/cli/bin/mitii.js`

Invocation shape (current Mitii CLI):

- Agent / bench default: `mitii agent --cwd <workspace> --prompt-file <tmp> --autonomy apply --origin automation`
- Other modes: `mitii ask|plan --cwd <workspace> --prompt-file <tmp> --origin automation`
- After a run, `readMitiiSessionMetrics(workspace)` parses `.mitii/logs/*-thread_*.jsonl` (or legacy `cli-*.jsonl`) for model, start/end, duration, and token usage (written into `reports/runs/.../*.md`).

Provider/model settings live in Mitii (`mitii setup`, `~/.mitii/config.json`, `.env`) — not in `task.yaml`.
