from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from datetime import datetime

app = FastAPI()

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def home(request: Request):

    now = datetime.now()

    return templates.TemplateResponse(
        request=request,
        name="home.html",
        context={
            "now": now
        }
    )