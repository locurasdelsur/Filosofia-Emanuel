// Ejemplo de configuración enriquecida para los pasos de juego
const JUEGOS_ENRIQUECIDOS = {
  schopenhauer: [
    {
      paso: 1,
      titulo: "El Velo del Deseo Material",
      contexto: "Te encontrás ante una mesa repleta de lujos y comodidades que prometen saciarte para siempre...",
      videoContextoId: "FjC55_P6k6U", // Fragmento introductorio
      opciones: [
        {
          texto: "Consumir todo de inmediato para calmar la ansiedad",
          correcta: false,
          explicacion: "Al consumir, el alivio dura apenas segundos antes de dar paso a un aburrimiento insoportable.",
          videoFeedbackId: "U3dM6d2o3_E" // Video que ilustra el vacío/tedio
        },
        {
          texto: "Reconocer que el deseo es una carencia infinita y buscar la contemplación",
          correcta: true,
          explicacion: "Comprendés que la satisfacción material es ilusoria y das el primer paso hacia el cese del querer."
        }
      ]
    },
    // ... pasos subsiguientes
  ],
  sartre: [
    {
      paso: 1,
      titulo: "La Sala sin Espejos",
      contexto: "Tres personas justifican sus actos pasados alegando que las circunstancias o la genética no les dejaron otra salida...",
      videoContextoId: "6rG7h2u1V8e",
      opciones: [
        {
          texto: "Aceptar que la sociedad y el contexto determinan el destino individual",
          correcta: false,
          explicacion: "Caes en la trampa de la mala fe: usar el entorno como coartada para no asumir la angustia de la libertad.",
          videoFeedbackId: "7hK8m4gJ5sE" // Video explicativo sobre la mala fe
        },
        {
          texto: "Cuestionar las coartadas y señalar que no elegir ya es una elección",
          correcta: true,
          explicacion: "Desarmas la mala fe: la existencia precede a la esencia y cada quien es responsable de sus actos."
        }
      ]
    }
  ],
  foucault: [
    {
      paso: 1,
      titulo: "La Transición del Castigo",
      contexto: "Debes restablecer el orden en una institución convulsionada. El método clásico de castigo público ha fracasado...",
      videoContextoId: "5rK7h2u1V8e",
      opciones: [
        {
          texto: "Aumentar las sanciones visibles y la fuerza física sobre los infractores",
          correcta: false,
          explicacion: "El suplicio genera mártires y revueltas; es costoso e ineficiente frente a las resistencias.",
          videoFeedbackId: "9uV8k2m1V4s" // Video sobre la microfísica del poder
        },
        {
          texto: "Diseñar un dispositivo de visibilidad continua donde la mirada se interiorice",
          correcta: true,
          explicacion: "Implementas el principio panóptico: la disciplina opera desde adentro del propio individuo."
        }
      ]
    }
  ]
};
