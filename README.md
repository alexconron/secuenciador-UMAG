# Bio-Secuenciador  
### Visualización en tiempo real de datos de color desde Arduino usando FastAPI y Next.js

Este proyecto es una aplicación web que permite visualizar en tiempo real los datos de color detectados por un sensor conectado a un Arduino. Utiliza **FastAPI** para el backend y **Next.js** para el frontend.

---

## Características principales

- Comunicación en tiempo real entre el frontend y el backend usando **WebSockets**.
- Lectura de datos desde **Arduino** a través de puerto serie.
- Visualización dinámica del color detectado en la interfaz web.
- API GraphQL para simular y consultar nucleótidos.

---

## Estructura del proyecto

```
bio-secuenciador/
├── backend/
│   ├── main.py
│   └── api/
│       ├── nucleotide.py
│       ├── query.py
│       ├── schema.py
│       └── subscription.py
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    └── page.tsx
```

---

## Requisitos

- Python 3.12+
- Node.js 18+
- Arduino conectado por USB
- `pip`, `npm`
- (Opcional) `virtualenv` para entorno virtual

---

## Instalación

### Backend

1. Crea un entorno virtual (recomendado):

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # En Windows: .venv\Scripts\activate
   ```

2. Instala las dependencias necesarias:

   ```bash
   pip install -r requirements.txt
   ```

   Si no tienes un `requirements.txt`, puedes crear uno con el siguiente contenido:

   ```
   fastapi
   uvicorn
   pyserial
   strawberry-graphql
   ```

3. Ejecuta el servidor:

   ```bash
   uvicorn backend.main:app --reload
   ```

### Frontend

1. Instala las dependencias:

   ```bash
   cd frontend
   npm install
   ```

2. Ejecuta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

---

## Uso

- Accede a `http://localhost:3000` para ver la interfaz web.
- El color de fondo cambiará dinámicamente según los datos recibidos del Arduino.
- Asegúrate de que el backend esté corriendo en `http://localhost:8000`.

---

## Notas

- Asegúrate de que el Arduino esté conectado en `/dev/ttyACM0` o ajusta la ruta en `main.py` según corresponda.
- El backend expone un WebSocket en `/ws` para la comunicación en tiempo real.
- También ofrece una interfaz GraphQL en `/graphql`.

---

## Licencia

[MIT](./LICENSE)

---

## API Backend

El backend expone dos interfaces principales:

- **WebSocket en `/ws`**: Para recibir datos de color en tiempo real desde Arduino.
- **GraphQL en `/graphql`**: Permite consultar y suscribirse a nucleótidos simulados.

### Ejemplo de consulta GraphQL

Puedes usar el playground de GraphQL en `http://localhost:8000/graphql`.  
Ejemplo de consulta para obtener todos los nucleótidos:

```graphql
query {
  getAllNucleotide {
    id
    name
  }
}
```

### Ejemplo de suscripción

Para recibir nucleótidos simulados en tiempo real:

```graphql
subscription {
  getNucleotide(amount: 10)
}
```

---

## Flujo de datos

1. **Arduino** envía datos de color por el puerto serie.
2. **Backend** ([main.py](backend/main.py)) recibe los datos y los expone por WebSocket y GraphQL.
3. **Frontend** ([page.tsx](frontend/app/page.tsx)) se conecta vía WebSocket y GraphQL para mostrar los datos en tiempo real y graficar las secuencias.

---

## Desarrollo y pruebas

- Para modificar la API GraphQL, edita los archivos en [backend/api/](backend/api/).
- Para cambiar la interfaz, edita los componentes en [frontend/components/](frontend/components/).
---

## Código Arduino

El [código](arduino.ino) que debe cargarse en el Arduino para que detecte colores y los envíe al backend mediante el puerto serie esta basado en el proyecto de  [SurtrTech](https://projecthub.arduino.cc/SurtrTech/color-detection-using-tcs3200230-a1e463).