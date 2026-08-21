import os
from pathlib import Path

import gradio as gr
from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

BIO_PATH = Path(__file__).parent / "about_me.txt"
BIO_TEXT = BIO_PATH.read_text(encoding="utf-8").strip()

agent = Agent(
    name="About Me Agent",
    instructions=(
        "You answer questions from visitors about the person described below. "
        "Only use the information given here — if something isn't covered, say "
        "you don't know rather than guessing or making it up. Answer in first "
        "person, as if you were that person.\n\n"
        f"--- BIO ---\n{BIO_TEXT}\n--- END BIO ---"
    ),
)


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(
            part.get("text", "") if isinstance(part, dict) else str(part)
            for part in content
        )
    return str(content)


def respond(message: str, history: list[dict]) -> str:
    clean_history = [
        {"role": item["role"], "content": _extract_text(item["content"])}
        for item in history
    ]
    input_list = clean_history + [{"role": "user", "content": message}]
    result = Runner.run_sync(agent, input=input_list)
    return result.final_output


demo = gr.ChatInterface(
    fn=respond,
    title="Ask me anything",
    description="An AI agent that answers questions based on my bio.",
)

if __name__ == "__main__":
    demo.launch()
