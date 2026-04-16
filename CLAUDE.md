@AGENTS.md

## Persistent Memory (claude-mem)

This project uses [claude-mem](https://github.com/thedotmack/claude-mem) (v12.1.5) for persistent context across sessions.

### How it works

- **Automatic capture**: Every tool use and session is observed and stored via lifecycle hooks (SessionStart, UserPromptSubmit, PostToolUse, Stop, SessionEnd).
- **Context injection**: Relevant memories from past sessions are injected automatically at the start of each new session.
- **MCP search tools**: Use `/mem-search <query>` inside Claude Code to search past observations.
- **Web viewer**: Memory stream is viewable at `http://localhost:37777` when the worker is running.
- **Worker**: Start with `npx claude-mem start` if the background service is not running.

### Privacy

Wrap sensitive content in `<private>` tags to exclude it from memory capture.

### Storage

Memories are stored in `~/.claude-mem/` using SQLite + Chroma (hybrid keyword + vector search).

