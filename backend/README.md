## Configuración del entorno

Antes de iniciar el servidor crea un archivo `.env` en esta carpeta o define las
variables de entorno necesarias.

El servicio de base de datos utiliza la variable `MONGO_URI` (o `MONGODB_URI`)
para conectarse a MongoDB. Asegúrate de establecerla con la cadena de conexión
apropiada.

Para empezar puedes copiar el archivo `.env.example` como `.env` y rellenar sus
valores. Si obtienes errores de DNS al usar una URI `mongodb+srv://`, cambia a
la forma estándar `mongodb://usuario:contraseña@host:puerto/nombre_bd`.

El valor de `CLIENT_URL` debe coincidir con la URL de tu frontend (por ejemplo
`http://localhost:5173`) para generar los enlaces de verificación de cuenta.

Para configurar el middleware CORS puedes definir `ALLOWED_ORIGINS` con una
lista de dominios separados por comas (por defecto se usan `CLIENT_URL` y las
URLs de desarrollo). Esto te permite usar la misma imagen en desarrollo y en
producción sin modificar el código. Asegúrate de separar las URLs con comas,
por ejemplo:

```
ALLOWED_ORIGINS=http://localhost:5173,https://apppatin-frontend.onrender.com
```

Además debes definir `GOOGLE_CLIENT_ID` con el ID de cliente OAuth de Google si
quieres habilitar el inicio de sesión con Google.
Para evitar el error `origin_mismatch` de Google, asegúrate de que la URL configurada en `CLIENT_URL` y cualquier dominio donde despliegues el frontend estén registrados como **Authorized JavaScript origins** del cliente OAuth en la Google Cloud Console.
