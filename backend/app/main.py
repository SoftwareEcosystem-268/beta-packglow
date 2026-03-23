from fastapi import FastAPI


app = FastAPI(title="beta-packglow backend")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
