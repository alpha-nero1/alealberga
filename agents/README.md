---
title: About Me Agent
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 6.22.0
app_file: app.py
pinned: false
---

# Agents

An AI agent, built with the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)
and served through a [Gradio](https://gradio.app) chat UI, that answers questions
about you based on the contents of `about_me.txt`.

## Setup

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in OPENAI_API_KEY
```

Edit `about_me.txt` with your own bio — background, work history, skills,
projects, whatever you want the agent to be able to answer questions about.

## Run locally

```bash
source .venv/bin/activate
python app.py
```

This starts a local Gradio chat UI (defaults to http://localhost:7860).

## Deploy to Hugging Face Spaces

Uses the `hf` CLI (`pip install -U huggingface_hub`, or `brew install huggingface-cli`
on macOS — the old `huggingface-cli` binary is deprecated in favor of `hf`).

1. Log in (needs a token with **write** access from
   [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)):

   ```bash
   hf auth login
   ```

2. Create the Space (this repo's YAML frontmatter above already declares the
   Gradio SDK and `app.py` as the entry point):

   ```bash
   hf repos create <your-username>/<space-name> --type space --space-sdk gradio
   ```

3. Add your `OPENAI_API_KEY` as a secret — do this from the Space's **Settings
   → Variables and secrets** page on huggingface.co rather than the CLI, so the
   key never ends up in your shell history.

4. Upload this folder's contents (run from inside `agents/`):

   ```bash
   hf upload <your-username>/<space-name> . . --type space \
     --exclude ".venv/*" --exclude "__pycache__/*" --exclude ".env"
   ```

5. The Space will build automatically from the upload and serve the chat UI at
   `https://huggingface.co/spaces/<your-username>/<space-name>`.

To redeploy after changes, just re-run the `hf upload` command — it pushes a
new commit to the Space.
