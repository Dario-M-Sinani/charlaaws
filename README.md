# Dario Michel Siñani Duran - Personal Profile & Live Feedback Dashboard

Este es un proyecto moderno, interactivo y optimizado construido con **React + Vite** para servir como perfil profesional de **Dario Michel Siñani Duran** (estudiante de Ingeniería de Sistemas y TI & Seguridad en la USFX, DevOps en `levosolution`).

El proyecto incluye una sección interactiva diseñada especialmente para ser mostrada al finalizar la charla **"Tu primera instancia EC2: Despliegue práctico y hardening básico"**, donde los asistentes pueden calificar la ponencia en tiempo real escaneando un código QR dinámico.

---

## ⚡ Características Destacadas

1. **Branding Consistente**: Paleta de colores inspirada en el logotipo de `levosolution` (Azul eléctrico `#619eff` e Índigo `#393978`) y combinada con el Naranja de AWS (`#ff9900`).
2. **Fondo de Nodos Interactivo**: Fondo canvas animado con partículas en red que se conectan entre sí y reaccionan al cursor del ratón (atracción/repulsión).
3. **Audio Sintetizado en el Navegador**: Utiliza la **Web Audio API** para generar efectos de sonido analógicos/retro en vivo al votar, sin necesidad de cargar archivos de audio externos.
4. **Animaciones de Confeti Dinámicas**: Explosiones de confeti en base al tipo de respuesta seleccionada utilizando `canvas-confetti`.
5. **Modo Proyector (Modo Presentador)**: Vista a pantalla completa optimizada para proyectores que muestra un código QR gigante con la URL dinámica del sitio y un gráfico de barras neon en tiempo real.
6. **Simulador de Pipeline CI/CD**: Un componente visual en el perfil que simula un flujo real de despliegue DevOps con estados activos y aprobados en bucle.
7. **Seguridad DevSecOps**: Contadores de votos en LocalStorage con un sistema de reseteo protegido por firma de credenciales.

---

## 🚀 Desarrollo Local

Para correr el servidor de desarrollo local:

1. Instala las dependencias:
   ```powershell
   npm install
   ```

2. Ejecuta el servidor en modo desarrollo:
   ```powershell
   npm run dev
   ```

3. Abre tu navegador en la dirección indicada (usualmente `http://localhost:5173`).

4. Para compilar la versión optimizada de producción:
   ```powershell
   npm run build
   ```

---

## ☁️ Despliegue en AWS (DevSecOps IaC)

En la carpeta `infrastructure/` se incluye una plantilla de **Terraform** completa y segura para desplegar este frontend en AWS siguiendo estándares de seguridad (Hardening):

### Recursos Creados:
- **Bucket S3 Privado**: Almacena de forma segura los archivos compilados del frontend (`dist/`), bloqueando todo acceso público directo.
- **CloudFront CDN**: Distribuye el contenido globalmente con baja latencia y redirección HTTPS forzada.
- **Origin Access Control (OAC)**: Método de autenticación seguro para que CloudFront acceda al S3 privado sin exponerlo a Internet.
- **Response Headers Policy**: Inserta cabeceras de seguridad HTTP robustas (`X-Frame-Options: DENY`, `Strict-Transport-Security` de 1 año, `X-Content-Type-Options: nosniff`, `XSS Protection`).

### Pasos para Desplegar:

1. Compila el frontend:
   ```powershell
   npm run build
   ```

2. Entra a la carpeta de infraestructura:
   ```powershell
   cd infrastructure
   ```

3. Inicializa Terraform y aplica los cambios (asegúrate de tener tus credenciales de AWS configuradas):
   ```powershell
   terraform init
   terraform apply
   ```

4. Sube los archivos compilados al S3 creado por Terraform:
   ```powershell
   aws s3 sync ../dist/ s3://dario-portfolio-feedback-charla-aws --delete
   ```

5. Si necesitas actualizar los archivos y ver los cambios inmediatamente, invalida la caché de CloudFront:
   ```powershell
   aws cloudfront create-invalidation --distribution-id <ID_DE_DISTRIBUCION> --paths "/*"
   ```
