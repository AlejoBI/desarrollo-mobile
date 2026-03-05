# Desarrollo-mobile

Repositorio para el desarrollo de ejercicios de la clase de desarrollo móvil.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) instalado
- [Android Studio](https://developer.android.com/studio) instalado con al menos un AVD configurado
- Ionic CLI instalado globalmente:
  ```bash
  npm install -g @ionic/cli
  ```

---

## Crear una nueva app Ionic

```bash
ionic start nombre-de-tu-app blank --type=react
cd nombre-de-tu-app
```

---

## Configurar Android (solo la primera vez por proyecto)

```bash
ionic cap add android
```

---

## Ejecutar la app en Android Studio

### Opción 1: Automática (Recomendada)

Cada vez que hagas cambios, ejecuta este comando desde la carpeta del proyecto:

**En PowerShell (Windows):**

```powershell
ionic build; npx cap copy android; npx cap sync android; ionic cap open android
```

**En Bash/Terminal (Mac/Linux):**

```bash
ionic build && npx cap copy android && npx cap sync android && ionic cap open android
```

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
