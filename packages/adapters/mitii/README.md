# @mitii-bench/adapter-mitii

Invokes the Mitii CLI against an isolated case workspace.

Configure via:

- `MITII_BIN` env var, or
- `runner.config.json` → `mitiiBin`, or
- sibling path `../Mitii/apps/cli/bin/mitii.js`

Agent/provider settings stay here — not in `task.yaml`.
