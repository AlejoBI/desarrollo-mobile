# MediCare+ – Parcial 1

Proyecto del **Parcial 1 – Desarrollo de Plataformas Móviles** que consiste en dos aplicaciones: una **PWA en React** para la administración de pacientes desde escritorio, y una **App móvil en Ionic React** para la gestión de visitas médicas a domicilio.

## Tecnologías utilizadas

- React
- TypeScript
- localStorage
- Progressive Web App (Manifest + Service Worker)

## Funcionalidades principales

- Login con autenticación simulada
- Persistencia de sesión con localStorage
- Gestión de pacientes (crear, editar, eliminar)
- Buscador de pacientes por nombre, apellido o DNI
- Avatar de usuario con iniciales
- Control de acceso por rol (médico/recepcionista)
- Conversión de la aplicación en PWA

## Capturas de pantalla

### Login y Configuración PWA
![Login con Service Worker y Manifest](./pwa-admin/login-workr-manifest.png)

### Dashboard Recepcionista
![Vista de recepcionista](./pwa-admin/dashboard-recepcionista.png)

### Perfil de Usuario
![Perfil de usuario - Recepcionista](./pwa-admin/dashboard-recepcionista-user.png)

### Dashboard Médico
![Vista de médico](./pwa-admin/dashboard-medico.png)

Este comando:
1. Compila la app (`ionic build`)
2. Copia los cambios a Android (`npx cap copy android`)
3. Sincroniza las dependencias (`npx cap sync android`)
4. **Abre automáticamente Android Studio** con la carpeta android ya configurada

Android Studio se abrirá en una ventana nueva con el proyecto listo. Solo debes:
1. Esperar a que se cargue el proyecto
2. Seleccionar el emulador en la lista de dispositivos
3. Presionar **Run** (botón Play)

### Opción 2: Manual

Si prefieres hacerlo paso a paso:

```bash
ionic build
npx cap copy android
npx cap sync android
```

Luego abre manualmente Android Studio desde tu computadora y ve a:
- Archivo → Abrir → Selecciona la carpeta `android` del proyecto
- Espera a que cargue
- Selecciona el emulador y presiona **Run**

O usa este comando para abrir Android Studio directamente:

```bash
ionic cap open android
```

---

## Autor

**Alejandro Bravo**  
Universidad Autónoma de Occidente