# Guía de Contribución

¡Gracias por tu interés en contribuir a Precious by Orocash!

## Cómo contribuir

### Reportar bugs
- Verifica que el bug no haya sido reportado ya
- Describe el bug claramente incluyendo pasos para reproducirlo
- Incluye screenshots si es relevante
- Menciona tu entorno (OS, navegador, versión de Node)

### Sugerir mejoras
- Describe claramente la mejora propuesta
- Explica por qué sería útil
- Proporciona ejemplos de cómo funcionaría

### Pull Requests
1. Fork el repositorio
2. Crea una rama con un nombre descriptivo: `feature/nombre-feature` o `fix/nombre-bug`
3. Haz commits claros y descriptivos
4. Asegúrate de que los cambios sigan el estilo de código del proyecto
5. Escribe o actualiza tests si es necesario
6. Abre un PR con una descripción clara de los cambios

## Estándares de código

- Usa TypeScript para nuevos archivos
- Sigue las convenciones de Next.js
- Usa Prettier para formateo (configuración incluida)
- Comenta código complejo
- Evita código duplicado

## Requisitos de seguridad

- **Nunca** commites variables de entorno `.env` o credenciales
- Valida todas las entradas del usuario
- No expongas datos sensibles en logs o errores
- Mantén las dependencias actualizadas
- Ejecuta pruebas de seguridad antes de PR

## Configuración local

```bash
git clone https://github.com/tu-usuario/precious-by-orocash.git
cd precious-by-orocash
npm install
cp .env.example .env.local
# Completa .env.local con tus credenciales de Firebase
npm run dev
```

## Licencia

Al contribuir, aceptas que tus cambios serán publicados bajo la misma licencia del proyecto.
