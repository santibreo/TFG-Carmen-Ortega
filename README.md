# EduSite 📚

Plataforma educativa con vídeos, apuntes y cuestionarios interactivos.

---

## ✏️ Cómo añadir o editar contenido

**El único archivo que necesitas tocar es:** `assets/js/content.js`

Ábrelo con cualquier editor de texto (Notepad, TextEdit, VS Code…).

### Añadir un tema nuevo

1. Copia uno de los bloques existentes (desde `{` hasta `},`)
2. Pégalo al final del array, justo antes del `];`
3. Cambia los datos:

```javascript
{
  id: "mi-tema",          // sin espacios ni acentos, solo letras y guiones
  title: "Mi Tema",       // nombre que aparece en el menú
  icon: "star",           // icono de https://lucide.dev/icons/
  sections: [
    {
      title: "Primer apartado",
      videos: [
        {
          title: "Nombre del vídeo",
          url: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
          description: "Breve descripción del vídeo."
        }
      ],
      text: `
        <h3>Título de los apuntes</h3>
        <p>Texto del apartado. Puedes usar <b>negrita</b> y listas:</p>
        <ul>
          <li>Punto uno</li>
          <li>Punto dos</li>
        </ul>
      `,
      quiz: [
        {
          question: "¿Pregunta de ejemplo?",
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          answer: 0   // ← índice de la respuesta correcta (0 = A, 1 = B, 2 = C, 3 = D)
        }
      ]
    }
  ]
}
```

### Iconos disponibles

Consulta la lista completa en **https://lucide.dev/icons/**

El nombre del icono va en minúsculas y con guiones. Por ejemplo:
- `calculator` → calculadora
- `book-open` → libro abierto
- `flask-conical` → matraz de laboratorio
- `music` → nota musical
- `globe` → globo terráqueo
- `code` → código
- `heart` → corazón

---

## 🚀 Publicar cambios

1. Guarda el archivo `content.js`
2. Sube los cambios a GitHub (arrastra el archivo a la web de GitHub o usa el botón de commit)
3. GitHub publicará automáticamente los cambios en 1-2 minutos

---

## 🔧 Primera configuración (solo una vez)

1. Crea un repositorio en GitHub (puede ser público o privado con plan Pro)
2. Sube todos los archivos de esta carpeta
3. Ve a **Settings → Pages**
4. En *Source*, selecciona **GitHub Actions**
5. El siguiente push disparará el despliegue automático

---

## Estructura del proyecto

```
edusite/
├── index.html                  ← Página principal (no tocar)
├── assets/
│   ├── css/
│   │   └── style.css           ← Estilos (no tocar)
│   └── js/
│       ├── content.js          ← ✅ AQUÍ SE EDITA EL CONTENIDO
│       └── app.js              ← Motor de la app (no tocar)
└── .github/
    └── workflows/
        └── deploy.yml          ← Despliegue automático (no tocar)
```
