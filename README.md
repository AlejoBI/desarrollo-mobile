# Desarrollo-mobile
Repositorio para el desarrollo de ejercicios de la clase de desarrollo móvil.

## Crear una app Ionic por CLI

1. Instala Ionic CLI si no lo tienes:
	```bash
	npm install -g @ionic/cli
	```
2. Crea una nueva aplicación:
	```bash
	ionic start nombre-de-tu-app blank
	```
	Cambia `nombre-de-tu-app` por el nombre que desees.
3. Entra a la carpeta del proyecto:
	```bash
	cd nombre-de-tu-app
	```

## Inicializar el emulador de Android Studio por CLI

1. Asegúrate de tener Android Studio y el SDK instalados.
2. Agrega la plataforma Android a tu proyecto:
	```bash
	ionic cap add android
	```
3. Abre el proyecto en Android Studio:
	```bash
	ionic cap open android
	```
4. Sincroniza los cambios de tu proyecto con la carpeta nativa de Android:
	```bash
	npx cap sync android
	```
5. (Opcional) Si necesitas reconstruir la carpeta android desde cero:
	```bash
	npx cap copy android
	```
6. Para crear el build de la app y probarlo en el emulador:
	```bash
	npx cap run android --target=nombre_del_emulador
	```
	Cambia `nombre_del_emulador` por el nombre de tu AVD.
7. También puedes generar el APK o AAB para producción desde Android Studio usando Build > Build Bundle(s) / APK(s).