# For Python Developers using Kami

We have provided a boilerplate code template to demonstrate the use case of Kami. Use the following guide to get up and running!

1. Get uv or miniconda or whatever choice of backend. Here, we'll assume you're using uv.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Make sure you have a python version >=3.10

```bash
uv python list
```

3. Create a virtualenv

```bash
# Using 3.11 here, but you may use any >=3.10 version
uv venv .venv --python=$(uv python find 3.11)
```

4. Activate virtualenv

```bash
source .venv/bin/activate
```

5. Install the dependencies used in the demo

```bash
uv pip install -e .
```

6. Try out some of the provide code snippets
```bash
uv run check_hotkey.py
```