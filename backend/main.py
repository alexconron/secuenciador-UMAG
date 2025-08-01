from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import serial
import time
from fastapi.responses import HTMLResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración del puerto serie para Arduino
arduino = serial.Serial("/dev/ttyACM0", 9600, timeout=2) 
time.sleep(2)  # Espera a que Arduino se reinicie al conectar


@app.get("/", response_class=HTMLResponse)
async def get_html():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Color desde Arduino</title>
        <style>
            body {
                transition: background-color 0.3s ease;
                font-family: Arial, sans-serif;
                color: #000;
                padding: 20px;
            }
            #output {
                font-size: 1.2em;
                white-space: pre-wrap;
                margin-top: 10px;
                padding: 10px;
                background-color: rgba(255,255,255,0.7);
                border: 1px solid #ccc;
                border-radius: 8px;
                width: fit-content;
            }
        </style>
    </head>
    <body>
        <h1>Color detectado</h1>
        <div id="output">Esperando datos...</div>

        <script>
            const ws = new WebSocket("ws://localhost:8000/ws");
            let isReady = false;

            ws.onopen = () => {
                console.log("WebSocket conectado");
                isReady = true;
                startPolling();
            };

            ws.onmessage = (event) => {
                const output = document.getElementById("output");
                output.textContent = event.data;

                try {
                    const data = JSON.parse(event.data);
                    document.body.style.backgroundColor = `rgb(${255 - data.r}, ${255 - data.g}, ${255 - data.b})`;
                } catch (e) {
                    console.error("No es JSON válido:", event.data);
                }
            };

            function startPolling() {
                setInterval(() => {
                    if (isReady) {
                        ws.send("get_colors");
                    }
                }, 1000); // Cada 1 segundo
            }
        </script>
    </body>
    </html>
    """


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        msg = await websocket.receive_text()
        print(f"Recibido del cliente: {msg}")
        if msg == "get_colors":
            arduino.reset_input_buffer()
            arduino.write(b"read\n")

            while True:
                line = arduino.readline().decode(errors="ignore").strip()
                print(f"Desde Arduino: {line}")
                if line.startswith("{") and line.endswith("}"):
                    await websocket.send_text(line)
                    break
