---
title: Formulate API
emoji: ⚡
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Formulate Backend API

This is the FastAPI backend for the Formulate application. 
It handles the LangGraph workflow, layout generation, and database management.

## Endpoints
- `POST /generate-site`: Generates the initial website layout.
- `POST /refine`: Applies structural modifications.