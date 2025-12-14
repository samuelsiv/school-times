import os

import httpx
from dotenv import load_dotenv
from sanic import Sanic, response

load_dotenv()

API_KEY = os.getenv("API_KEY", "")
USER_AGENT = os.getenv("USER_AGENT", "")

if not API_KEY:
    raise ValueError("API_KEY environment variable is not set.")

if not USER_AGENT:
    raise ValueError("USER_AGENT environment variable is not set.")

app = Sanic("proxy")

@app.middleware("response")
async def allow_cors(request, response):
    response.headers.setdefault("Access-Control-Allow-Origin", "*")
    response.headers.setdefault("Access-Control-Allow-Methods", "*")
    response.headers.setdefault("Access-Control-Allow-Headers", "*")
    response.headers.setdefault("Access-Control-Max-Age", "86400")

@app.route("/<path:path>", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"], name="proxy_path")
@app.route("/", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"], name="proxy_root")
async def proxy(request, path=""):
    if request.method == "OPTIONS":
        return response.text("", status=200)

    path = path or ""
    normalized_path = path.lstrip("/")
    target_url = f"https://web.spaggiari.eu/{normalized_path}" if normalized_path else "https://web.spaggiari.eu"
    query_string = request.query_string
    if query_string:
        target_url = f"{target_url}?{query_string}"

    headers = {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in {"host", "content-length", "accept-encoding"}
    }
    headers["Z-Dev-Apikey"] = API_KEY
    headers["User-Agent"] = USER_AGENT

    body = request.body

    async with httpx.AsyncClient(follow_redirects=True) as client:
        response_obj = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            timeout=60.0,
        )

    filtered_headers = {
        name: value
        for name, value in response_obj.headers.items()
        if name.lower() not in {"content-encoding", "transfer-encoding", "connection"}
    }

    return response.raw(
        response_obj.content,
        status=response_obj.status_code,
        headers=filtered_headers,
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        single_process=True,
    )

