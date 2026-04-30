/**
 * =====================================================
 *  ARCHIVO DE CONTENIDOS — Edita aquí para añadir
 *  temas, vídeos, textos y preguntas.
 * =====================================================
 *
 *  CÓMO AÑADIR UN TEMA NUEVO:
 *  1. Copia uno de los bloques { id, title, icon, sections }
 *  2. Pégalo al final del array (antes del ];)
 *  3. Cambia el id, title, icon y rellena las secciones
 *
 *  ICONOS disponibles en: https://lucide.dev/icons/
 *  Pon el nombre tal cual aparece en la web (kebab-case).
 *
 *  ESTRUCTURA DE CADA SECCIÓN:
 *    title    → Nombre del apartado (aparece como tab)
 *    videos   → Array de { title, url, description }
 *               La url puede ser de YouTube o Vimeo
 *    text     → HTML que quieras mostrar (acepta <b>, <ul>, etc.)
 *    quiz     → Array de preguntas:
 *               { question, options: ["A","B","C"], answer: 0 }
 *               answer es el ÍNDICE de la opción correcta (empieza en 0)
 */

const SITE_TITLE = "TFG Carmen Ortega Pita";
const SITE_SUBTITLE = "Tu espacio de aprendizaje";

const TOPICS = [
  {
    id: "aritmetica",
    title: "Aritmética",
    icon: "calculator",           // nombre del icono de Lucide
  }, {
    id: "algebra",
    title: "Álgebra",
    icon: "radical",           // nombre del icono de Lucide
  }, {
    id: "geometria",
    title: "Geometría",
    icon: "box",           // nombre del icono de Lucide
    sections: [
      {
        id: "el-punto",
        title: "El Punto",
        videos: [
          {
            title: "El Punto",
            url: "assets/videos/dimension-0.mp4",
            description: "Conceptos fundamentales para iniciarse en la Geometría"
          },
        ],
        text: `
          <h3>¿Qué es el álgebra?</h3>
          <p>El álgebra es una rama de las matemáticas que usa <b>letras y símbolos</b>
          para representar números y cantidades en fórmulas y ecuaciones.</p>
          <h3>Conceptos clave</h3>
          <ul>
            <li><b>Variable:</b> una letra que representa un número desconocido (ej: x, y)</li>
            <li><b>Ecuación:</b> igualdad entre dos expresiones (ej: 2x + 3 = 7)</li>
            <li><b>Despejar:</b> encontrar el valor de la variable</li>
          </ul>
          <h3>Ejemplo resuelto</h3>
          <p>Resolver: <code>2x + 3 = 7</code></p>
          <p>→ 2x = 7 − 3 = 4 → x = 2 ✓</p>
        `,
        quiz: [
          {
            question: "En un cuadrado mágico, los números de cada fila, de cada columna y de las dos diagonales suman lo mismo. Este cuadrado de 4 × 4 debería ser un cuadrado mágico, pero hay un número que es erróneo. ¿En qué casilla está?",
            options: ["(c, 4)", "(b, 2)", "(a, 2)", "(d, 4)", "(c, 2)"],
            img_url: "./assets/img/cuadrado-magico.svg",
            answer: 1
          },
          {
            question: "¿Cuántos cuadrados puedes dibujar cuyos vértices coincidan con puntos de la figura?",
            options: ["8", "9", "10", "11", "12"],
            img_url: "./assets/img/vertices.svg",
            answer: 3
          },
        ]
      }, {
        id: "la-linea",
        title: "La Línea",
        videos: [
          {
            title: "La Línea",
            url: "assets/videos/dimension-1.mp4",
            description: "Qué ocurre cuando tenemos más de un punto"
          },
        ],
        quiz: [
          {
            question: "¿Cuántos cuadriláteros puedes encontrar en esta figura?",
            options: ["3", "4", "5", "6", "7"],
            img_url: "./assets/img/cuadrilateros.svg",
            answer: 3
          },
          {
            question: "En la figura puedes ver un cuadrado y dos triángulos equiláteros. Si la suma de los perímetros de los dos triángulos es 12 metros, ¿cuál es, en cm², el área del cuadrado?",
            options: ["9", "12", "16", "20", "25"],
            img_url: "./assets/img/triangulos.svg",
            answer: 2
          },
          {
            question: "¿Cuántos cuadrados puedes encontrar en una cuadrícula de lado 3?",
            options: ["11", "12", "13", "14", "15"],
            img_url: "./assets/img/cuadricula.svg",
            answer: 3
          },
          {
            question: "Para formar una cuadrícula de 2 × 2 se necesitan doce palillos. ¿Cuántos palillos se necesitan para formar una cuadrícula de 15 × 15?",
            options: ["225", "450", "465", "480", "515"],
            img_url: "./assets/img/palillos.svg",
            answer: 3
          },
        ]
      }, {
        id: "el-plano",
        title: "El Plano",
        videos: [
          {
            title: "El Plano",
            url: "assets/videos/dimension-2.mp4",
            description: "Qué ocurre cuando tenemos más de una línea"
          }
        ],
        quiz: [
          {
            question: "Para representar a Bob Esponja hemos partido de dos rectångulos de igual base. La altura del rectångulo de arriba es 33 cm. El área del rectángulo de abajo es 270 cm², lo que representa 3/14 del área total. ¿Cuál es, en cm. la altura del rectángulo de abajo?",
            options: ["15", "11", "10", "9", "42"],
            img_url: "./assets/img/bob-esponja.svg",
            answer: 4
          },
          {
            question: "En el dibujo puedes ver una figura que hemos formado juntando tres cuadrados de lados 12 cm, 15 cm y 17 cm. ¿Cuál es la longitud, en cm, de la línea negra que rodea toda la figura?",
            options: ["118", "120", "124", "128", "132"],
            img_url: "./assets/img/cuadrados.svg",
            answer: 0
          },
          {
            question: "Las circunferencias de la figura tienen radios 1, 2 y 3 centímetros. Para pintarla hemos utilizado más pintura gris que blanca. ¿Cuánto debería medir el ángulo para que tengamos que utilizar la misma cantidad de pintura gris que blanca?",
            options: ["60°", "90°", "120°", "150°", "180°"],
            img_url: "./assets/img/circunferencias.svg",
            answer: 4
          },
          {
            question: "Esta extraña figura está creada a partir de polígonos regulares. Si el lado del cuadrado mide 4 cm, ¿qué perímetro, en cm, tiene la figura completa?",
            options: ["30", "34", "36", "50", "60"],
            img_url: "./assets/img/poligonos.svg",
            answer: 2
          },
        ]
      }, {
        id: "los-volumenes",
        title: "Los Volúmenes",
        videos: [
          {
            title: "Los Volúmenes",
            url: "assets/videos/dimension-3.mp4",
            description: "Qué ocurre cuando tenemos más de un plano"
          }
        ],
        quiz: [
          {
            question: "En la figura ves un prisma de siete caras, quince aristas y diez vértices. ¿Cuántas aristas tendrá un prisma de 10 caras?",
            options: ["20", "21", "24", "27", "30"],
            img_url: "./assets/img/paralelepipedo.svg",
            answer: 2
          },
          {
            question: "Para construir una torre de dos plantas se necesitan cinco cubitos; para construir tres plantas son necesarios 14 cubitos. ¿Cuántos cubitos son necesarios para construir una torre de 6 plantas?",
            options: ["36", "64", "82", "91", "100"],
            img_url: "./assets/img/cubos.svg",
            answer: 3
          },
          {
            question: "Pintamos cada una de las seis caras de un cubo de un color diferente: azul (A), verde (V), rosa (R), marrón (M), blanco (B) y negro (N). Las siguientes imágenes muestran el cubo en tres posiciones diferentes. ¿De qué color es la cara opuesta a la rosa",
            options: ["Azul", "Verde", "Marrón", "Blanco", "Negro"],
            img_url: "./assets/img/3cubos.svg",
            img_width: "200px",
            answer: 4
          },
          {
            question: "Si quitamos algunos cubos de lado 1 de un cubo de lado 5, obtenemos el sólido mostrado. Consiste en varios pilares de la misma altura que se apoyan en una base común. ¿Cuántos cubos de lado 1 hemos quitado?",
            options: ["56", "60", "64", "68", "80"],
            img_url: "./assets/img/castillo.svg",
            answer: 2
          },
        ]
      },
    ],
  }, {
    id: "magnitudes",
    title: "Magnitudes y Unidades",
    icon: "weight-tilde",           // nombre del icono de Lucide
  }, {
    id: "logica",
    title: "Lógica",
    icon: "lightbulb",           // nombre del icono de Lucide
  }, {
    id: "estadistica",
    title: "Estadística",
    icon: "chart-pie",           // nombre del icono de Lucide
  }
];
