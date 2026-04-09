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

## Instalar APK en teléfono físico (Windows)

Esta guía aplica para el proyecto de ejemplo en `sensors`.

### 1. Preparar el teléfono

1. Activa **Opciones de desarrollador** en Android.
2. Activa **Depuración USB**.
3. Conecta el teléfono por USB y acepta la huella RSA cuando aparezca.

### 2. Verificar ADB

Si `adb` está en `C:\Users\Gamer\Downloads\platform-tools`, ejecuta:

```powershell
& "C:\Users\Gamer\Downloads\platform-tools\adb.exe" devices
```

En **CMD** (símbolo del sistema), usa este formato (sin `&`):

```cmd
"C:\Users\Gamer\Downloads\platform-tools\adb.exe" devices
```

Debes ver tu equipo con estado `device`.

### 3. Generar APK debug

Desde la carpeta `sensors`, ejecuta en este orden:

```powershell
npm run build
npx cap sync android
```

Si Gradle marca error de Java, usa Java 21 del JBR de Android Studio en la sesión actual:

```powershell
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

Ahora genera el APK:

```powershell
.\android\gradlew.bat -p android assembleDebug
```

APK generado en:

`sensors\android\app\build\outputs\apk\debug\app-debug.apk`

### 4. Instalar APK en el teléfono

```powershell
& "C:\Users\Gamer\Downloads\platform-tools\adb.exe" install -r "C:\Users\Gamer\OneDrive\Desktop\Repositories\desarrollo-mobile\sensors\android\app\build\outputs\apk\debug\app-debug.apk"
```

En **CMD** (símbolo del sistema), usa este formato (sin `&`):

```cmd
"C:\Users\Gamer\Downloads\platform-tools\adb.exe" install -r "C:\Users\Gamer\OneDrive\Desktop\Repositories\desarrollo-mobile\sensors\android\app\build\outputs\apk\debug\app-debug.apk"
```

Si termina con `Success`, la app quedó instalada.

---
