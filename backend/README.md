## Configuración del entorno

Antes de iniciar el servidor crea un archivo `.env` en esta carpeta o define las
variables de entorno necesarias.

El servicio de base de datos utiliza la variable `MONGO_URI` (o `MONGODB_URI`)
para conectarse a MongoDB. Asegúrate de establecerla con la cadena de conexión
apropiada.

Para empezar puedes copiar el archivo `.env.example` como `.env` y rellenar sus
valores. Si obtienes errores de DNS al usar una URI `mongodb+srv://`, cambia a
la forma estándar `mongodb://usuario:contraseña@host:puerto/nombre_bd`.
