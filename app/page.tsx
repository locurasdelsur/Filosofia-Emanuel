'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Cloud,
  Download,
  ExternalLink,
  GraduationCap,
  LockKeyhole,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Trophy,
  Upload,
  Video,
  Volume2,
  AlertTriangle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const GOOGLE_SCRIPT_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbz_YOUR_SCRIPT_ID_HERE/exec'
const COURSES = ['5° 1ª', '5° 2ª', '6° 1ª', '6° 2ª']

export type ProgressState = {
  teoriaCompletada: boolean
  juegoCompletado: boolean
  puntajeJuego: number
  pasoJuegoActual: number
  testCompletado: boolean
  puntajeTest: number
  fechaActualizacion: string
}

export type Session = {
  nombre: string
  curso: string
  progreso: Record<string, ProgressState>
}

export type GameOption = {
  text: string
  correct: boolean
  explanation: string
  videoFeedbackId?: string
}

export type GameStep = {
  step: number
  title: string
  context: string
  videoContextId?: string
  options: GameOption[]
}

export type QuizQuestion = {
  q: string
  options: string[]
  correct: number
  rationale: string
}

export type Author = {
  id: string
  name: string
  short: string
  theme: string
  accent: string
  image: string
  video: string
  excerpt: string
  citation: string
  takeaways: string[]
  gameSteps: GameStep[]
  questions: QuizQuestion[]
}

const baseProgress = (): ProgressState => ({
  teoriaCompletada: false,
  juegoCompletado: false,
  puntajeJuego: 0,
  pasoJuegoActual: 1,
  testCompletado: false,
  puntajeTest: 0,
  fechaActualizacion: new Date().toISOString()
})

const authors: Author[] = [
  {
    id: 'schopenhauer',
    name: 'Arthur Schopenhauer',
    short: 'El péndulo y la voluntad',
    theme: 'from-amber-500/20 to-orange-950/30',
    image: '/philosophers/schopenhauer.png',
    accent: 'text-amber-300',
    video: 'FjC55_P6k6U',
    excerpt: 'Toda volición nace de una necesidad, de una carencia, es decir, de un sufrimiento... la vida oscila como un péndulo de derecha a izquierda, entre el dolor y el aburrimiento.',
    citation: 'El mundo como voluntad y representación, Libro IV, §56–57',
    takeaways: [
      'El deseo nace de la carencia y nunca se satisface de forma duradera.',
      'La contemplación desinteresada y el arte suspenden transitoriamente el péndulo del dolor.',
      'La compasión (Mitleid) supera el Velo de Maya reconociendo que todo sufrimiento comparte la misma raíz.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'El Banquete y el Deseo Inmediato',
        context: 'Frente a vos hay un banquete repleto de manjares exquisitos. Tu cuerpo siente una carencia urgente que te empuja a consumirlo todo de inmediato.',
        videoContextId: 'FjC55_P6k6U',
        options: [
          { text: 'Comer hasta saciarte esperando alcanzar la felicidad permanente.', correct: false, explanation: 'La saciedad dura apenas segundos antes de dar paso al aburrimiento y a una nueva sed insaciable.', videoFeedbackId: 'U3dM6d2o3_E' },
          { text: 'Reconocer que el deseo es una carencia infinita y distanciarte para contemplar el impulso.', correct: true, explanation: 'Comprendés que el querer en sí mismo es sufrimiento; suspender la avidez es el primer paso lúcido.', videoFeedbackId: 'FjC55_P6k6U' },
          { text: 'Destruir la mesa con furia porque ningún alimento te dejará satisfecho.', correct: false, explanation: 'La violencia ciega no es negación de la Voluntad, sino una afirmación exacerbada de su frustración.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 2,
        title: 'El Arcón de las Riquezas',
        context: 'Aparece un cofre rebosante de monedas de oro con la promesa: "Acumula todo lo que puedas para asegurar tu tranquilidad futura".',
        videoContextId: 'FjC55_P6k6U',
        options: [
          { text: 'Llenarte los bolsillos creyendo que la seguridad material calma la angustia vital.', correct: false, explanation: 'Schopenhauer compara la riqueza con el agua salada: cuanta más bebes, más sed te da.', videoFeedbackId: 'U3dM6d2o3_E' },
          { text: 'Examinar el cofre y comprender que ningún objeto alcanzado procura una satisfacción inalterable.', correct: true, explanation: 'El logro exterior es como la limosna que salva hoy al mendigo para prolongar su miseria mañana.', videoFeedbackId: 'FjC55_P6k6U' },
          { text: 'Repartir el oro buscando reconocimiento y fama entre los presentes.', correct: false, explanation: 'La vanidad social multiplica los temores al juicio ajeno, atándote con mayor fuerza al sufrimiento.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 3,
        title: 'La Trampa del Reconocimiento Social',
        context: 'Una multitud en los balcones aplaude con entusiasmo si adoptás posturas solemnes y representás el rol de un triunfador.',
        videoContextId: 'FjC55_P6k6U',
        options: [
          { text: 'Reclamar aplausos constantes para alimentar tu autoestima.', correct: false, explanation: 'Vivir pendiente de la opinión ajena es la cumbre de la servidumbre subjetiva en el mundo de la representación.', videoFeedbackId: 'U3dM6d2o3_E' },
          { text: 'Dar la espalda al estrado reconociendo la vacuidad del estatus en el teatro de apariencias.', correct: true, explanation: 'El sabio busca el sosiego interior en vez del eco hueco y efímero de las multitudes.', videoFeedbackId: 'FjC55_P6k6U' },
          { text: 'Insultar a los espectadores para demostrar que no te importan.', correct: false, explanation: 'La hostilidad reactiva sigue demostrando dependencia afectiva del juicio exterior.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 4,
        title: 'El Espejo Velado',
        context: 'En el centro del salón hay un gran espejo cubierto por un velo de seda con inscripciones orientales.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Romper el espejo para no ver la realidad que oculta.', correct: false, explanation: 'Destruir el fenómeno no altera la cosa en sí; es solo un impulso ciego.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Retirar con serenidad el velo para confrontar la naturaleza de la representación.', correct: true, explanation: 'Te atrevés a rasgar el Velo de Maya que separa engañosamente al sujeto del objeto.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Colocarle más capas de tela para mantener la ilusión reconfortante.', correct: false, explanation: 'El autoengaño es el camino del optimismo superficial que Schopenhauer consideraba una burla amarga.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 5,
        title: 'El Enigma: Tat Tvam Asi',
        context: 'En el reflejo del espejo no aparece tu cara, sino imágenes de seres sufrientes: un mendigo, un animal herido, un prisionero.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Apartar la mirada alegando que sus desventuras no tienen nada que ver con vos.', correct: false, explanation: 'Ese es el error del Principium individuationis: creer que el dolor del otro es ajeno a tu propia esencia.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Comprender la sentencia "Tat Tvam Asi" (Tú eres eso): todos comparten la misma Voluntad doliente.', correct: true, explanation: 'Al superar la separación ilusoria del espacio-tiempo, reconocés que herir al otro es herirte a vos mismo.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Sentir lástima condescendiente considerándote superior a ellos.', correct: false, explanation: 'La piedad arrogante preserva el egoísmo; la compasión genuina implica identidad ontológica.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 6,
        title: 'El Despertar de la Compasión (Mitleid)',
        context: 'Un guardia herido custodia la puerta. Te pide auxilio pero tiene la llave colgada al cuello.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Arrebatarle la llave a la fuerza y dejarlo desamparado.', correct: false, explanation: 'El egoísmo depredador intensifica el ciclo de violencia donde la Voluntad se devora a sí misma.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Curar sus heridas antes de pensar en tu escape, compartiendo su dolor de manera desinteresada.', correct: true, explanation: 'La ética schopenhaueriana nace aquí: la compasión auténtica suprime el egoísmo y desarma el conflicto.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Ofrecerle ayuda únicamente a cambio de que te firme un contrato de lealtad.', correct: false, explanation: 'El cálculo utilitarista no es virtud moral; es comercio de conveniencias.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 7,
        title: 'El Fonógrafo Desarmado',
        context: 'El camino se bloquea por un cerrojo armónico. Hay una vitrola antigua con piezas sueltas y discos al lado.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Golpear el mecanismo con una piedra para forzarlo.', correct: false, explanation: 'El esfuerzo mecánico solo produce ruidos discordantes y bloquea la cerradura.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Reparar la aguja y colocar un disco de sinfonía orquestal pura.', correct: true, explanation: 'La música es la cumbre del arte: no copia las Ideas del mundo, sino que expresa a la Voluntad misma.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Poner un disco con marchas marciales de conquista militar.', correct: false, explanation: 'La música ligada a pasiones bélicas reanima los impulsos egoístas en vez de aquietar el intelecto.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 8,
        title: 'La Contemplación Estética Desinteresada',
        context: 'Al sonar la melodía clásica, el salón se transforma: el tiempo parece detenerse y los deseos callan.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Aprovechar el trance para calcular cuánto dinero vale la obra que estás escuchando.', correct: false, explanation: 'Interesar el arte económicamente destruye la pureza del conocimiento estético.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Abandonar toda pretensión personal y convertirte en el sujeto puro y libre de voluntad.', correct: true, explanation: 'La experiencia estética te libera transitoriamente de la rueda de Ixión y de las cadenas del deseo.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Frustrarte porque la música no te da una respuesta científica empírica.', correct: false, explanation: 'La ciencia se sujeta al principio de razón; el arte capta la esencia intuitiva.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 9,
        title: 'La Balanza Ascética',
        context: 'Ante la última puerta hay una balanza de dos platos que exige entregar aquello que te mantiene encadenado al ciclo existencial.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: 'Depositar un puñado de joyas para pagar el peaje.', correct: false, explanation: 'La balanza no pesa materia: pesa apego al mundo de la representación.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: 'Colocar simbólicamente la renuncia a la ambición y la mortificación del egoísmo individual.', correct: true, explanation: 'La ascesis es la redención definitiva: el querer voluntariamente deja de quererse a sí mismo.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: 'Intentar saltar por encima de la balanza con imprudencia.', correct: false, explanation: 'No se puede evadir la verdad ética mediante atajos físicos.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      },
      {
        step: 10,
        title: 'La Detención del Péndulo Cósmico',
        context: 'El péndulo central detiene su marcha. Para cruzar el umbral definitivo, debes formular el veredicto del sabio.',
        videoContextId: 'FjC55_P6k6U',
        options: [
            { text: '"Buscaré nuevos placeres en el mundo exterior para no aburrirme jamás".', correct: false, explanation: 'Reiniciarías la oscilación del péndulo directo hacia el sufrimiento y la frustración.', videoFeedbackId: 'U3dM6d2o3_E' },
            { text: '"Reconozco la nulidad del esfuerzo egoísta; elijo la serenidad de la renuncia y la paz compasiva".', correct: true, explanation: 'Completaste el recorrido: el péndulo se detiene y alcanzás la serenidad del espíritu emancipado.', videoFeedbackId: 'FjC55_P6k6U' },
            { text: '"El mundo es perfecto tal como fue diseñado por la razón providencial".', correct: false, explanation: 'El optimismo racionalista es para Schopenhauer una contradicción dolorosa frente a la miseria del mundo vivo.', videoFeedbackId: 'U3dM6d2o3_E' }
        ]
      }
    ],
    questions: [
      { q: '¿Qué es el mundo en su dimensión fenoménica para Schopenhauer?', options: ['Una mera representación subjetiva', 'La Voluntad en sí misma', 'Una creación divina perfecta', 'Materia inerte sin leyes'], correct: 0, rationale: 'El mundo que conocemos está mediado por las formas de la representación humana.' },
      { q: '¿Qué concepto define la esencia metafísica última de la realidad?', options: ['El Espíritu Absoluto', 'La Razón pura', 'La Voluntad ciega e insaciable', 'El Átomo material'], correct: 2, rationale: 'La Voluntad es el principio único que subyace a todos los fenómenos.' },
      { q: 'El "péndulo de la vida" oscila constantemente entre:', options: ['El bien y el mal', 'La razón y la locura', 'El dolor y el aburrimiento', 'El amor y el odio'], correct: 2, rationale: 'Saciada una necesidad surge el tedio; insatisfecha, el sufrimiento.' },
      { q: '¿Por qué Schopenhauer rechaza el suicidio como solución?', options: ['Porque es un delito civil', 'Porque afirma con desesperación el apego a la vida frustrada', 'Porque daña la economía', 'Porque está prohibido por los dogmas'], correct: 1, rationale: 'El suicida quiere la vida, solo rechaza las condiciones penosas que le tocaron.' },
      { q: '¿Qué arte ocupa la cúspide estética por expresar directamente la Voluntad?', options: ['La arquitectura', 'La pintura', 'La poesía', 'La música'], correct: 3, rationale: 'La música expresa la Voluntad de manera inmediata sin pasar por las Ideas.' },
      { q: '¿Qué fundamento tiene la compasión (Mitleid)?', options: ['El deber kantiano', 'Reconocer que el sufrimiento ajeno es idéntico al propio', 'El cálculo de placeres', 'El contrato social'], correct: 1, rationale: 'Supera el Velo de Maya identificando la misma esencia en todo ser vivo.' }
    ]
  },
  {
    id: 'marx',
    name: 'Karl Marx',
    short: 'Alienación y plusvalía',
    theme: 'from-rose-500/20 to-red-950/30',
    image: '/philosophers/marx.png',
    accent: 'text-rose-300',
    video: 'XhS6U01M8eE',
    excerpt: 'El trabajador se vuelve tanto más pobre cuanta más riqueza produce... Lo animal se convierte en lo humano y lo humano en lo animal.',
    citation: 'Manuscritos económico-filosóficos de 1844',
    takeaways: [
      'El producto del trabajo se enfrenta al trabajador como un poder independiente y extraño.',
      'La plusvalía es el valor no remunerado del trabajo vivo apropiado por el capital.',
      'La solidaridad y la organización transforman a la clase en sí en clase para sí.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'Compra de Fuerza de Trabajo',
        context: 'Administras los costos de una fábrica. El mercado exige maximizar la tasa de ganancia sobre el salario.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Pagar a los operarios el valor total de las mercancías producidas.', correct: false, explanation: 'Bajo la lógica del capital, pagar el valor total eliminaría la ganancia del empresario.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Comprar la fuerza de trabajo como una mercancía cuyo costo es solo el de su subsistencia.', correct: true, explanation: 'Descubrís la base del sistema: la fuerza de trabajo es la única mercancía capaz de generar más valor del que cuesta.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Cerrar la fábrica y repartir las máquinas entre los vecinos.', correct: false, explanation: 'Sin organización productiva colectiva, el reparto aislado no supera las leyes del mercado.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 2,
        title: 'Plusvalía Absoluta: Extender la Jornada',
        context: 'Para duplicar la producción podés forzar el límite físico de los trabajadores durante el día.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Aumentar la jornada laboral de 10 a 14 horas manteniendo el mismo jornal.', correct: true, explanation: 'Has aplicado la plusvalía absoluta: incrementar el tiempo de trabajo excedente por prolongación horaria.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Reducir la jornada a 6 horas y duplicar los sueldos.', correct: false, explanation: 'Esa medida reduciría la cuota de plusvalía y provocaría la quiebra frente a los competidores.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Darles café gratis para que no se cansen.', correct: false, explanation: 'Un paliativo que no resuelve la contradicción material de la explotación horaria.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 3,
        title: 'Plusvalía Relativa: La Máquina a Vapor',
        context: 'Llega un nuevo telar industrial que reduce a la mitad el tiempo necesario para fabricar cada prenda.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Destruir la máquina porque amenaza el esfuerzo artesanal de los obreros.', correct: false, explanation: 'El ludismo confunde el medio técnico con la relación social capitalista que lo explota.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Incorporar la tecnología para abaratar el tiempo de trabajo socialmente necesario.', correct: true, explanation: 'Comprendés la plusvalía relativa: la máquina eleva la productividad reduciendo el valor del trabajo necesario.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Usar la máquina únicamente como adorno en la entrada de la fábrica.', correct: false, explanation: 'El capital exige la valorización continua de sus inversiones en capital constante.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 4,
        title: 'Giro de Perspectiva: En la Cinta de Montaje',
        context: 'La pantalla cambia: ahora sos el operario frente a la máquina. El ritmo mecánico marca cada segundo de tu vida.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Acelerar el paso creyendo que el dueño te premiará con la copropiedad de la fábrica.', correct: false, explanation: 'Falsa conciencia: el aumento de tu rendimiento solo incrementa la acumulación ajena.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Experimentar cómo tu propia energía vital se convierte en un apéndice de la máquina.', correct: true, explanation: 'Vivenciás la alienación en el acto productivo: el trabajo no es libre afirmación sino mortificación física.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Cantar canciones alegres para olvidar la monotonía del trabajo.', correct: false, explanation: 'El consuelo subjetivo enmascara la enajenación material objetiva.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 5,
        title: 'Alienación del Producto Terminado',
        context: 'Terminás un par de botas perfectas. Intentás guardarlas para abrigar a tu familia en invierno.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Un capataz te arrebata las botas: el producto no te pertenece y cuesta más que tu sueldo mensual.', correct: true, explanation: 'Alienación del objeto: cuanto más valor produce el obrero, más desvalorizado y desposeído resulta.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Aceptar que las botas deben pertenecer al capataz porque él tiene mejor gusto.', correct: false, explanation: 'Sumisión ideológica que naturaliza la apropiación privada de la riqueza social.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Esconder una bota en tu bolsillo para venderla en secreto.', correct: false, explanation: 'La salida individual ilegal no transforma las relaciones de producción.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 6,
        title: 'El Fetichismo de la Mercancía',
        context: 'En el escaparate de la tienda, las mercancías parecen tener vida propia y relacionarse entre sí mediante precios.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Creer que el precio es una propiedad mágica natural que brota de las cosas mismas.', correct: false, explanation: 'Caíste en el fetichismo: borrar el trabajo humano que dio origen a la mercancía.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Descubrir que detrás de los precios de mercado hay relaciones sociales de explotación entre personas.', correct: true, explanation: 'Excelente: desarmás el fetichismo revelando el trabajo abstracto cristalizado en el valor.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Rezarle a las mercancías para que bajen de precio.', correct: false, explanation: 'El misticismo religioso refuerza la pasividad frente a las leyes económicas materiales.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 7,
        title: 'Pérdida del Ser Genérico (Gattungswesen)',
        context: 'Al finalizar la extenuante jornada laboral, sentís que solo sos libre al comer, beber y dormir.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Conformarte con esa vida animal alegando que los humanos no necesitan nada más.', correct: false, explanation: 'Renunciás a la esencia humana creativa reduciendo la existencia a pura subsistencia biológica.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Comprender que el capitalismo invirtió lo humano y lo animal: el trabajo creativo se convirtió en castigo.', correct: true, explanation: 'Cita clave de 1844: el ser humano queda despojado de su capacidad consciente y universal de transformar el mundo.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Dormir 16 horas seguidas para no pensar.', correct: false, explanation: 'El agotamiento extremo perpetúa el ciclo de reproducción de la fuerza de trabajo.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 8,
        title: 'La Trampa de la Competencia Individual',
        context: 'El patrón ofrece un bono de $2 al que trabaje más rápido que su compañero; el más lento será despedido.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Sabotear la máquina de tu compañero para asegurar tu puesto y cobrar el premio.', correct: false, explanation: 'Alienación respecto al prójimo: el sistema enfrenta a los trabajadores entre sí convirtiéndolos en rivales.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Rechazar la competencia fratricida y advertir a tu compañero sobre la trampa patronal.', correct: true, explanation: 'Nace la solidaridad de clase: comprender que el interés del colega es idéntico al tuyo.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Pedir que despidan a ambos para evitar discusiones.', correct: false, explanation: 'Derrotismo pasivo que amplía el ejército industrial de reserva.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 9,
        title: 'Diálogo y Solidaridad Obrera',
        context: 'Reunidos en el taller durante el cambio de turno, los obreros debaten qué camino seguir ante los abusos.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Pedirle al dueño que tenga piedad y sea un poco más generoso por caridad cristiana.', correct: false, explanation: 'El socialismo utópico e ingenuo apela a la buena voluntad de la clase opresora sin tocar las bases materiales.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Construir una organización sindical autónoma y un pliego de reivindicaciones colectivas.', correct: true, explanation: 'Paso decisivo: la organización colectiva supera la dispersión individual de los asalariados.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Emigrar solos a otra ciudad esperando que allí los capitalistas no busquen plusvalía.', correct: false, explanation: 'El mercado mundial replica las mismas relaciones de producción en cualquier latitud.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      },
      {
        step: 10,
        title: 'Paro de Máquinas: Clase para Sí',
        context: 'Suena la sirena de inicio. Es el momento de la decisión histórica entre la sumisión o la huelga.',
        videoContextId: 'XhS6U01M8eE',
        options: [
          { text: 'Bajar la cabeza y volver a operar la cinta de montaje en silencio.', correct: false, explanation: 'Permanecés como mera clase en sí: una masa sometida a las leyes del capital sin conciencia política.', videoFeedbackId: '8q2w3hY1F8g' },
          { text: 'Tirar de la palanca de paro general, detener los telares y asumir el control colectivo de la producción.', correct: true, explanation: '¡Victoria emancipatoria! El proletariado se constituye como clase para sí, sujeto consciente de la historia.', videoFeedbackId: 'XhS6U01M8eE' },
          { text: 'Prender fuego el edificio y escapar corriendo.', correct: false, explanation: 'La destrucción anárquica de los medios no socializa la riqueza; la emancipa la autogestión de los productores.', videoFeedbackId: '8q2w3hY1F8g' }
        ]
      }
    ],
    questions: [
      { q: 'Según el materialismo histórico, ¿qué constituye la base o infraestructura?', options: ['Las leyes y la religión', 'Las relaciones sociales de producción y fuerzas productivas', 'El arte y la filosofía', 'La moral de los gobernantes'], correct: 1, rationale: 'La base económica material condiciona la superestructura ideológica y jurídica.' },
      { q: '¿Qué es la plusvalía?', options: ['El costo de desgaste de las máquinas', 'El valor no remunerado del trabajo del cual se apropia el capitalista', 'El impuesto que cobra el Estado', 'La ganancia surgida de la astucia comercial'], correct: 1, rationale: 'Es el excedente de valor generado por el trabajo vivo no pagado en el salario.' },
      { q: 'El fetichismo de la mercancía consiste en:', options: ['Adorar estatuas religiosas', 'Percibir relaciones sociales entre personas como relaciones objetivas entre cosas', 'Regalar mercancías en ferias', 'Comprar únicamente objetos de lujo'], correct: 1, rationale: 'Oculta el trabajo humano bajo la apariencia de precios autónomos en el mercado.' },
      { q: '¿Cuál es el motor de la historia en el Manifiesto Comunista?', options: ['La evolución biológica', 'La lucha de clases', 'La voluntad de los héroes', 'El azar astronómico'], correct: 1, rationale: 'Toda la historia de la sociedad humana hasta nuestros días es historia de luchas de clases.' },
      { q: 'La alienación del producto significa que:', options: ['El producto le pertenece enteramente al obrero', 'El objeto se enfrenta al productor como un poder extraño e independiente', 'Las cosas se rompen con facilidad', 'El obrero no sabe usar herramientas'], correct: 1, rationale: 'El fruto de su esfuerzo le resulta ajeno y lo domina como mercancía exterior.' },
      { q: 'El paso de "clase en sí" a "clase para sí" ocurre cuando:', options: ['Los obreros ganan la lotería', 'Adquieren conciencia de sus intereses comunes y se organizan políticamente', 'Cambian de empleo a una oficina', 'Aprenden idiomas extranjeros'], correct: 1, rationale: 'Pasan de compartir una condición pasiva a ser un sujeto colectivo activo.' }
    ]
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    short: 'Muerte de Dios y Zaratustra',
    theme: 'from-fuchsia-500/20 to-purple-950/30',
    image: '/philosophers/nietzsche.png',
    accent: 'text-fuchsia-300',
    video: 'vV7V5Q8s1e4',
    excerpt: '¿Adónde fue Dios? ¡Nosotros lo hemos matado!... Cómo el espíritu se transforma en camello, el camello en león y el león en niño.',
    citation: 'La gaya ciencia, §125; Así habló Zaratustra',
    takeaways: [
      'La muerte de Dios es el derrumbe de los fundamentos metafísicos absolutos de Occidente.',
      'El león destruye el dogmático "Tú debes"; el niño inaugura el juego creador de nuevos valores.',
      'El Amor fati y el Eterno Retorno son la prueba suprema de afirmación radical de la vida terrenal.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'El Peso de los Mandatos Heredados',
        context: 'Caminás por una ciudad en ruinas donde sacerdotes y moralistas te entregan pesadas losas de piedra con órdenes grabadas.',
        videoContextId: 'vV7V5Q8s1e4',
        options: [
          { text: 'Aceptar todas las losas sobre tus hombros creyendo que sufrir te hace virtuoso.', correct: true, explanation: 'Encarnás la primera figura: el Camello, espíritu de carga que se arrodilla ante el "¡Tú debes!".', videoFeedbackId: '7uK8m4gJ5sE' },
          { text: 'Fingir que obedecés mientras por dentro planeás vengarte en secreto.', correct: false, explanation: 'El resentimiento es la raíz de la moral de esclavos; no emancipa al espíritu.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Sentarte a llorar en la vereda esperando que un milagro te salve.', correct: false, explanation: 'La resignación pasiva es el síntoma de debilidad vital que Nietzsche critica en la decadencia.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 2,
        title: 'La Carga del Camello en el Desierto',
        context: 'Cargas las losas del "Tú debes" a través de un desierto ardiente hasta que las rodillas comienzan a flaquear.',
        videoContextId: '7uK8m4gJ5sE',
        options: [
          { text: 'Pedir que te agreguen más peso para demostrar tu capacidad de sumisión.', correct: false, explanation: 'La mortificación ascética enferma los instintos vitales desvalorizando el cuerpo.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Sentir el peso asfixiante de los valores ajenos y advertir que no te pertenecen.', correct: true, explanation: 'El camello llega a su límite: en la soledad más profunda del desierto se gesta la gran crisis.', videoFeedbackId: '7uK8m4gJ5sE' },
          { text: 'Culpar a la arena del desierto por ser demasiado caliente.', correct: false, explanation: 'Desviar la mirada hacia factores externos elude la confrontación con los mandatos que aceptaste.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 3,
        title: 'Agotamiento del Rebaño y el Último Hombre',
        context: 'Una comunidad de hombres satisfechos te invita a descansar: "Aquí nadie sufre, todos somos iguales, nadie manda ni ambiciona nada grande".',
        videoContextId: 'vV7V5Q8s1e4',
        options: [
          { text: 'Acomodarte en su confort mediocre celebrando la ausencia de pasiones y riesgos.', correct: false, explanation: 'Caíste en la ciénaga del "Último Hombre": el nihilismo pasivo que busca solo un bienestar tibio y mezquino.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Sentir náusea ante esa mediocridad y rechazar la comodidad del rebaño conformista.', correct: true, explanation: 'Elegís el peligro de la superación antes que la felicidad empequeñecedora del último hombre.', videoFeedbackId: 'vV7V5Q8s1e4' },
          { text: 'Pedir que te nombren rey de los mediocres.', correct: false, explanation: 'Gobernar el rebaño con sus propios valores decadentes sigue siendo moral sacerdotal.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 4,
        title: 'Mutación en León: La Gran Negación',
        context: 'En el confín del desierto, te sacudís las losas y tu piel ruge. El espíritu se niega a seguir cargando.',
        videoContextId: '7uK8m4gJ5sE',
        options: [
          { text: 'El camello se transforma en León: el conquistador de su propia libertad que dice "¡Yo Quiero!".', correct: true, explanation: 'Segunda transformación: el león rompe la servidumbre y reclama señorío sobre su propio desierto.', videoFeedbackId: '7uK8m4gJ5sE' },
          { text: 'Volver gateando a pedir perdón a los sacerdotes de la ciudad.', correct: false, explanation: 'La regresión por miedo a la soledad traiciona el impulso de autosuperación.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Convertirte en una estatua de mármol que no se mueve.', correct: false, explanation: 'La inmovilidad petrificada es la parálisis de la voluntad de poder.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 5,
        title: 'El Combate contra el Gran Dragón ("Tú Debes")',
        context: 'Aparece una bestia dorada con mil escamas. Cada escama centellea con una ley grabada: "¡Tú debes obedecer!".',
        videoContextId: '7uK8m4gJ5sE',
        options: [
          { text: 'Pactar con el dragón para cumplir la mitad de sus mandatos a cambio de paz.', correct: false, explanation: 'El término medio burgués es una capitulación ante la moral gregaria.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Rugir con ferocidad y asestar el golpe dialéctico: "¡Yo quiero, y mis instintos afirman la vida!".', correct: true, explanation: 'El León vence al dragón milenario conquistando la libertad negativa: el sagrado "No" al deber impuesto.', videoFeedbackId: '7uK8m4gJ5sE' },
          { text: 'Esperar a que el dragón envejezca y muera solo.', correct: false, explanation: 'Los ídolos no caen solos; requieren el martillo crítico del filósofo intempestivo.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 6,
        title: 'Filosofía a Martillazos',
        context: 'Frente a los altares de las supuestas verdades eternas y absolutas, empuñás el martillo genealógico.',
        videoContextId: 'vV7V5Q8s1e4',
        options: [
          { text: 'Golpear los ídolos culturales y metafísicos comprobando que están huecos por dentro.', correct: true, explanation: 'Método nietzscheano: el martillo es un diapasón que ausculta los falsos valores decadentes.', videoFeedbackId: 'vV7V5Q8s1e4' },
          { text: 'Limpiar los altares para que queden prolijos y relucientes.', correct: false, explanation: 'El respeto reverencial por los dogmas marchitos sostiene el nihilismo decadente.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Construir un altar idéntico pero con tu propio nombre.', correct: false, explanation: 'Sustituir a Dios por un ídolo personal repite el error dogmático de la metafísica.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 7,
        title: 'Superación del Resentimiento',
        context: 'El león victorioso mira hacia atrás y siente rabia por todos los años de sometimiento que padeció.',
        videoContextId: '9jD4Z8eW3yI',
        options: [
          { text: 'Consumirte en el odio y la sed de venganza contra tus antiguos opresores.', correct: false, explanation: 'El resentimiento te convierte en esclavo de tu pasado y envenena la fuerza vital afirmativa.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Superar la reactividad: la fuerza noble no guarda rencor, se autodesborda en creación y salud.', correct: true, explanation: 'La moral de señores brota de una triunfal afirmación de sí misma, no de la reacción contra otros.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Escribir cartas de queja al diario local.', correct: false, explanation: 'La queja burocrática es el síntoma supremo de la mezquindad reactiva.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 8,
        title: 'Transformación en Niño Creador',
        context: 'El león comprende que solo sabe destruir, pero que para vivir se necesita fundar nuevos sentidos.',
        videoContextId: '7uK8m4gJ5sE',
        options: [
          { text: 'Quedarte como fiera salvaje que devora todo lo que encuentra.', correct: false, explanation: 'El nihilismo activo que solo destruye se ahoga en su propia violencia estéril.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'El espíritu se convierte en Niño: inocencia, olvido, un nuevo comienzo, un juego, un santo decir Sí.', correct: true, explanation: 'Tercera transformación: el niño crea valores propios con la ligereza del juego artístico.', videoFeedbackId: '7uK8m4gJ5sE' },
          { text: 'Buscar a tus padres para que te digan qué jugar.', correct: false, explanation: 'El niño de Zaratustra no es inmadurez biológica; es autonomía poética y soberanía creadora.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 9,
        title: 'El Demonio del Eterno Retorno',
        context: 'Bajo la luna solitaria, un demonio susurra: "¿Deseas que cada dolor, cada placer y cada instante de tu vida se repita exactamente igual infinitas veces?".',
        videoContextId: 'vV7V5Q8s1e4',
        options: [
          { text: 'Maldecir al demonio con terror porque tu vida contiene heridas que querés olvidar.', correct: false, explanation: 'El rechazo del instante demuestra que aún no afirmás la existencia terrenal con plenitud.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Responder con exaltación: "¡Nunca escuché nada más divino! Deseo este instante y cada uno eternamente".', correct: true, explanation: 'La prueba existencial suprema: vivir de modo que desees la repetición infinita de tus elecciones.', videoFeedbackId: 'vV7V5Q8s1e4' },
          { text: 'Negociar para que se repitan solo las vacaciones y los días soleados.', correct: false, explanation: 'El Eterno Retorno no admite censuras: afirma la totalidad de la vida con sus luces y abismos.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      },
      {
        step: 10,
        title: 'Coronación del Amor Fati',
        context: 'Llegas a la cumbre de la montaña. El horizonte no tiene dioses ni verdades escritas en el cielo: el sentido depende de tu propia creación.',
        videoContextId: 'vV7V5Q8s1e4',
        options: [
          { text: 'Rogar que aparezca un nuevo dogma religioso para no sentir el vértigo de las alturas.', correct: false, explanation: 'Recaída en el consuelo ultraterreno del platonismo decadente.', videoFeedbackId: '9jD4Z8eW3yI' },
          { text: 'Consagrarte al Amor Fati (amor al destino) y ser fiel al sentido de la Tierra como Superhombre.', correct: true, explanation: '¡Victoria zaratustriana! Superás el nihilismo, asumís la muerte de Dios y te erigís en creador de tus propios valores.', videoFeedbackId: 'vV7V5Q8s1e4' },
          { text: 'Bajar corriendo de la montaña y encerrarte en un sótano.', correct: false, explanation: 'El repliegue temeroso niega la gran salud del espíritu libre.', videoFeedbackId: '9jD4Z8eW3yI' }
        ]
      }
    ],
    questions: [
      { q: 'La proclama "Dios ha muerto" significa que:', options: ['Hubo una guerra militar en el cielo', 'Se derrumbaron los fundamentos metafísicos absolutos de Occidente', 'Nació una nueva secta religiosa', 'La biología demostró la inexistencia del alma'], correct: 1, rationale: 'Cae el horizonte de valores supremos incuestionables de la tradición occidental.' },
      { q: '¿Qué simboliza la primera transformación del espíritu (el Camello)?', options: ['La creación artística inocente', 'El espíritu de carga sumiso al mandato "¡Tú debes!"', 'La violencia destructiva armada', 'El aislamiento egoísta'], correct: 1, rationale: 'El camello se arrodilla y carga pesados fardos de mandatos morales heredados.' },
      { q: '¿Qué conquista el León frente al Gran Dragón?', options: ['La sumisión a la ley', 'La libertad negativa: el sagrado decir "No" y "¡Yo quiero!"', 'Nuevos diez mandamientos', 'La gloria militar'], correct: 1, rationale: 'El león destruye el deber tradicional pero todavía no sabe crear nuevos valores.' },
      { q: '¿Qué representa la transformación final en Niño?', options: ['Inmadurez e incapacidad ética', 'Nuevo comienzo, inocencia, juego y creación afirmativa', 'Necesidad de tutores estrictos', 'Regresión biológica'], correct: 1, rationale: 'El niño inaugura la rueda que gira por sí misma y dice un santo Sí a la vida.' },
      { q: 'La "moral de esclavos" se articula a partir de:', options: ['La autoafirmación orgullosa de la salud y el vigor', 'El resentimiento reactivo de los débiles contra la nobleza', 'El estudio de las matemáticas', 'La adoración de guerreros'], correct: 1, rationale: 'Los resentidos califican de "malvado" al fuerte y de "bueno" a sí mismos.' },
      { q: '¿Qué prueba ética plantea el Eterno Retorno de lo Mismo?', options: ['Una predicción astrológica precisa', 'Elegir cada acto deseando que se repita eternamente sin excusas', 'La reencarnación en animales', 'Un método de ahorro financiero'], correct: 1, rationale: 'Funciona como el filtro existencial más pesado para medir la afirmación de la vida.' }
    ]
  },
  {
    id: 'freud',
    name: 'Sigmund Freud',
    short: 'Ello, Yo, Superyó y cultura',
    theme: 'from-sky-500/20 to-cyan-950/30',
    image: '/philosophers/freud.png',
    accent: 'text-sky-300',
    video: '8mG5T8y1V8e',
    excerpt: 'El ser humano no es un ser manso... Homo homini lupus: la cultura tiene que movilizarlo todo para poner límites a las pulsiones agresivas del hombre.',
    citation: 'El malestar en la cultura, Cap. II–III',
    takeaways: [
      'El Ello busca descarga inmediata por principio de placer; el Superyó juzga e impone culpa.',
      'El Yo media entre las exigencias pulsionales, los mandatos morales y la dura realidad.',
      'La sublimación canaliza la energía pulsional reprimida hacia la creación cultural y el saber.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'La Demanda Visceral del Ello',
        context: 'En un examen decisivo, tu compañero te hace un gesto despectivo. Desde lo profundo de tu mente surge una pulsión agresiva feroz.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Lanzarle el pupitre por la cabeza para descargar la furia de inmediato.', correct: false, explanation: 'El principio de placer ciego del Ello no mide consecuencias sociales: serías expulsado.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Registrar la fuerza del impulso agresivo sin actuarlo impulsivamente.', correct: true, explanation: 'El Yo toma nota del empuje pulsional (Drang) sin dejarse desbordar por el Ello.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Fingir que no sentís nada y que sos un ángel sin instintos.', correct: false, explanation: 'Negar la pulsión prepara el terreno para la represión patógena.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 2,
        title: 'La Reprobación Punitiva del Superyó',
        context: 'Una voz severa con tono patriarcal retumba en tu cabeza: "¡Sos un monstruo por haber sentido bronca! Merecés fracasar en todo".',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Aceptar el castigo del Superyó y romper tu propia hoja de examen por culpa.', correct: false, explanation: 'El Superyó sádico somete al Yo a una culpa desmedida e irracional.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Reconocer que el Superyó es la introyección de normas y mandatos, no una verdad divina.', correct: true, explanation: 'Comprendés la génesis del heredero del complejo de Edipo y limitás su tiranía interna.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Pedir que el profesor te aplique castigos corporales.', correct: false, explanation: 'El masoquismo moral busca la expiación infinita para satisfacer al Superyó.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 3,
        title: 'El Colapso de la Represión Somática',
        context: 'Intentás tragar el enojo a la fuerza. A los diez minutos empezás con una jaqueca insoportable y la mano acalambrada.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Creer que te picó un mosquito exótico y no hacer nada.', correct: false, explanation: 'Ignorás el lenguaje del cuerpo y la conversión somática del síntoma.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Comprender que lo reprimido siempre retorna disfrazado como síntoma neurótico.', correct: true, explanation: 'Excelente diagnóstico: la energía pulsional no tramitada psíquicamente busca descarga en el cuerpo.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Tomar diez analgésicos para seguir tapando el conflicto.', correct: false, explanation: 'La medicación sin elaboración no resuelve el conflicto intrapsíquico reprimido.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 4,
        title: 'Interpretación del Lapsus Linguae',
        context: 'Al pedirle una hoja al profesor, en vez de decirle "Estimado profesor" pronunciás: "Estimado opresor".',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Decir que fue solo un error de cansancio en las cuerdas vocales sin sentido.', correct: false, explanation: 'La medicina positivista cree que son fallas mecánicas; Freud demostró que tienen sentido inconsciente.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Analizar el acto fallido: una formación de compromiso donde el deseo reprimido burló la censura.', correct: true, explanation: 'El lapsus devela la verdad sofocada: tu crítica a la autoridad se filtró en el habla cotidiana.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Prometer no volver a hablar durante seis meses.', correct: false, explanation: 'El silenciamiento forzado no cura; intensifica la inhibición neurótica.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 5,
        title: 'Descodificación del Sueño',
        context: 'Recordás un sueño recurrente: "Ibas descalzo persiguiendo un reloj de oro que se derretía en el mar mientras una campana sonaba".',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Pensar que el sueño predice el número que va a salir en la quiniela.', correct: false, explanation: 'El pensamiento mágico adivinatorio desconoce los mecanismos del inconsciente.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Separar el contenido manifiesto de las ideas latentes mediante la asociación libre.', correct: true, explanation: 'El sueño es la realización alucinatoria de deseos reprimidos transformada por condensación y desplazamiento.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Comprar un atrapasueños y colgarlo del techo.', correct: false, explanation: 'La superstición no reemplaza la labor analítica del recuerdo.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 6,
        title: 'El Peligro de la Proyección',
        context: 'Sentís una envidia intensa por el éxito de tu mejor amigo, pero te descubrís diciendo: "¡Él me tiene una envidia tremenda a mí!".',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Convencerte de que tu amigo es una persona malvada y romper la amistad.', correct: false, explanation: 'Consolidás la proyección paranoide destruyendo tus vínculos reales.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Frenar y admitir la proyección: atribuís al otro los sentimientos propios que tu Yo se niega a aceptar.', correct: true, explanation: 'Mecanismo de defensa descubierto: asumir los propios afectos desactiva la paranoia persecutoria.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Contratar a un detective para que espíe a tu amigo.', correct: false, explanation: 'Alimentar la fantasía proyectiva deteriora el criterio de realidad.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 7,
        title: 'Superación de la Angustia de Castración',
        context: 'El miedo a equivocarte y ser juzgado te paraliza ante la hoja en blanco como si arriesgaras tu integridad misma.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Entregar la hoja en blanco y declararte incapaz para siempre.', correct: false, explanation: 'La inhibición síntoma se apodera de tu autonomía psíquica.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Comprender el origen infantil de la angustia y tolerar la falta sin esperar perfección narcisista.', correct: true, explanation: 'Aceptar la castración simbólica es la condición de posibilidad de la madurez psíquica.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Hacer trampa copiándote del alumno de adelante.', correct: false, explanation: 'La conducta perversa desmiente la regla pero refuerza la culpa inconsciente posterior.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 8,
        title: 'Sublimación Creadora',
        context: 'Tenés acumulada una enorme carga de energía pulsional agresiva y erótica que busca salida.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Buscar una pelea callejera a la salida de la escuela para descargarla físicamente.', correct: false, explanation: 'La descarga pulsional descontrolada destruye la convivencia civilizada.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Canalizar esa energía en la redacción de un ensayo filosófico brillante y en la práctica deportiva.', correct: true, explanation: '¡Sublimación alcanzada! Desviás la energía hacia metas culturales y sociales valoradas sin reprimir.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Encerrarte en tu pieza a jugar videojuegos 20 horas sin comer.', correct: false, explanation: 'La fijación regresiva aísla al sujeto empobreciendo el desarrollo de su Yo.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 9,
        title: 'El Principio de Realidad',
        context: 'Llega la hora de entregar el examen. No podés quedarte fantaseando eternamente con una nota mágica.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: 'Exigir que te aprueben por decreto porque vos lo deseás con mucha fuerza.', correct: false, explanation: 'Omnipotencia infantil del pensamiento: el principio de placer choca contra la realidad.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: 'Aceptar los límites de la situación real, revisar tus respuestas y entregar con serenidad.', correct: true, explanation: 'El Yo se afianza: posterga la satisfacción inmediata para lograr un fin viable en el mundo exterior.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: 'Prender fuego el examen y salir corriendo del aula.', correct: false, explanation: 'Ruptura psicótica con la realidad objetiva.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      },
      {
        step: 10,
        title: 'Soberanía del Yo: "Wo Es war, soll Ich werden"',
        context: 'Salís del aula. Has atravesado el conflicto entre pulsiones, mandatos de culpa y demandas de la realidad.',
        videoContextId: '8mG5T8y1V8e',
        options: [
          { text: '"Declararé que no tengo inconsciente y que mi mente es pura razón consciente transparente".', correct: false, explanation: 'La ilusión cartesiana que el psicoanálisis vino a fracturar como la tercera herida narcisista de la humanidad.', videoFeedbackId: '4uV8e1k2V9s' },
          { text: '"Donde el Ello era, el Yo debe advenir: ampliaré el dominio consciente sin sofocar la vida pulsional".', correct: true, explanation: '¡Meta analítica cumplida! Conquistás el equilibrio dinámico entre el placer, la norma y la realidad.', videoFeedbackId: '8mG5T8y1V8e' },
          { text: '"Dejaré que el Superyó me juzgue y me torture todos los días de mi vida".', correct: false, explanation: 'La entrega neurótica a la culpa destruye la felicidad y la capacidad productiva del sujeto.', videoFeedbackId: '4uV8e1k2V9s' }
        ]
      }
    ],
    questions: [
      { q: 'En la segunda tópica freudiana, la instancia regida por el principio de placer es:', options: ['El Yo', 'El Ello', 'El Superyó', 'El Ideal del Yo'], correct: 1, rationale: 'El Ello es inconsciente y busca la descarga inmediata sin considerar la realidad.' },
      { q: 'El Superyó se estructura fundamentalmente a partir de:', options: ['La digestión biológica', 'La internalización de las normas parentales y culturales tras el Edipo', 'La lectura de libros de leyes', 'Un mandato genético innato'], correct: 1, rationale: 'Es el heredero del complejo de Edipo y actúa como juez moral interior.' },
      { q: '¿Qué es la sublimación?', options: ['Olvidar voluntariamente un trauma', 'Canalizar energía pulsional hacia fines culturales, artísticos o de saber', 'Un castigo físico impuesto por la ley', 'La rotura de vínculos sociales'], correct: 1, rationale: 'Permite la satisfacción de la pulsión mediante actividades socialmente valoradas.' },
      { q: 'La tesis central de "El malestar en la cultura" sostiene que:', options: ['La técnica nos hará felices a todos', 'La cultura exige una severa renuncia pulsional que engendra culpa e infelicidad', 'En la antigüedad nadie sufría', 'Las leyes deben abolirse'], correct: 1, rationale: 'La seguridad colectiva que brinda la civilización se paga con pérdida de felicidad.' },
      { q: 'Un acto fallido o lapsus linguae es:', options: ['Una falla nerviosa muscular sin sentido', 'Una formación de compromiso donde el deseo reprimido burla la censura', 'Un síntoma de locura irreversible', 'Un descuido sin importancia'], correct: 1, rationale: 'Posee pleno sentido psíquico y revela la verdad del deseo inconsciente.' },
      { q: 'La sentencia "Donde el Ello era, el Yo debe advenir" propone:', options: ['Eliminar todos los sentimientos', 'Ampliar el dominio lúcido del Yo sobre las pulsiones oscuras del Ello', 'Someter al paciente al médico', 'Vivir sin leyes ni reglas'], correct: 1, rationale: 'Sintetiza el objetivo del psicoanálisis de emancipar al sujeto de la tiranía inconsciente.' }
    ]
  },
  {
    id: 'sartre',
    name: 'Jean-Paul Sartre',
    short: 'Libertad y mala fe',
    theme: 'from-emerald-500/20 to-teal-950/30',
    image: '/philosophers/sartre.png',
    accent: 'text-emerald-300',
    video: '6rG7h2u1V8e',
    excerpt: 'El hombre empieza por existir... no hay naturaleza humana porque no hay Dios para concebirla. Estamos condenados a ser libres.',
    citation: 'El existencialismo es un humanismo',
    takeaways: [
      'La existencia precede a la esencia: somos únicamente aquello que nos hacemos mediante nuestros actos.',
      'La libertad es incondicional y conlleva la angustia de una responsabilidad total.',
      'La mala fe es la coartada de pretender ser una cosa inerte para evadir la angustia de elegir.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'La Sala sin Espejos ni Salida Visible',
        context: 'Despertás en un salón con sillones de terciopelo ajado. Hay tres personas sentadas que evitan mirarte a los ojos.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Buscar guardias armados o cadenas que expliquen por qué nadie sale.', correct: false, explanation: 'Esperás una coacción física exterior; en el existencialismo la trampa es interior y moral.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Examinar a los ocupantes y advertir que están atrapados por sus propias excusas.', correct: true, explanation: 'Inspirado en "A puerta cerrada": no hay verdugos externos, el encierro es el juicio mutuo y la mala fe.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Romper los muebles para prender fuego la habitación.', correct: false, explanation: 'El vandalismo reactivo busca una salida mágica eludiendo el examen existencial.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 2,
        title: 'Interrogatorio a Gastón: La Obediencia Debida',
        context: 'Gastón, un militar, declara: "Yo ejecuté órdenes atroces, pero yo no soy culpable: el reglamento me obligaba. No tenía otra opción".',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Darle la razón: "La ley militar lo exime de toda responsabilidad individual".', correct: false, explanation: 'Caíste en la complicidad de la mala fe: ningún código anula tu libertad de desobedecer.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Confrontarlo: "Usted eligió obedecer; negarse también era una opción con sus riesgos. Usted es sus actos".', correct: true, explanation: 'Desarmás la mala fe: inventar que una orden te priva de libertad es una mentira para calmar la angustia.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Consolarlo diciéndole que Dios perdonará a los soldados.', correct: false, explanation: 'Sartre señala que si Dios no existe, el hombre está desamparado y no encuentra disculpas a las que aferrarse.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 3,
        title: 'Deconstrucción del Determinismo del Pasado',
        context: 'Gastón insiste: "Mi padre me educó con mano dura, estaba predestinado en mi sangre ser así".',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Aceptar que la herencia genética y familiar determina el destino sin remedio.', correct: false, explanation: 'El determinismo biológico es la coartada predilecta de la mala fe para negar la libertad.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Recordarle la frase de Sartre: "Lo importante no es lo que hicieron de nosotros, sino lo que hacemos con lo que hicieron de nosotros".', correct: true, explanation: 'La facticidad del pasado existe, pero cada persona decide libremente el sentido y el proyecto sobre esos datos.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Sugerirle que consulte su carta astral para ver si la culpa es de los astros.', correct: false, explanation: 'Delegar la responsabilidad ética en planetas es el colmo del autoengaño.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 4,
        title: 'Interrogatorio a Elena: La Esencia Femenina Falsa',
        context: 'Elena afirma: "Yo soporté humillaciones de mi marido durante 20 años porque la naturaleza femenina exige sumisión y abnegación".',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Felicitarla por cumplir su esencia natural de mujer paciente.', correct: false, explanation: 'El existencialismo demostró que no hay esencias previas: la esencia es una construcción social e histórica.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Señalarle que la existencia precede a la esencia: no hay naturaleza dada; ella eligió tolerar para no afrontar la soledad.', correct: true, explanation: 'La liberación comienza cuando se reconoce que ninguna norma metafísica obliga a aceptar la opresión.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Decirle que las mujeres nacieron para sufrir en silencio.', correct: false, explanation: 'Prejuicio patriarcal que naturaliza relaciones contingentes de dominación.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 5,
        title: 'El Mozo de Café y la Cosificación (En-sí)',
        context: 'Un mozo camina con movimientos rígidos, mecánicos y exagerados: "Yo no elijo nada, yo soy simplemente un mozo en sí".',
        videoContextId: '7hK8m4gJ5sE',
        options: [
          { text: 'Admirar su profesionalismo y pedirle que te sirva un café rápido.', correct: false, explanation: 'Reforzás su juego: tratás al hombre como a un autómata que coincide consigo mismo como una piedra.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Desarmar su actuación: "Jugás a ser mozo para convertir tu conciencia libre (Para-sí) en una cosa sólida e inerte (En-sí)".', correct: true, explanation: 'Ejemplo célebre de "El ser y la nada": el mozo imita a un objeto para evadir la incertidumbre de su libertad.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Dejarle una propina miserable para que se enoje.', correct: false, explanation: 'La provocación no desmonta la categoría ontológica de la mala fe.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 6,
        title: 'El Terror a la Mirada Ajena',
        context: 'De pronto, los tres personajes se giran al unísono y clavan sus ojos en vos, juzgando cada uno de tus defectos.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Paralizarte de vergüenza y permitir que su mirada te defina para siempre.', correct: false, explanation: 'Caés en la trampa del Ser-para-otro: permitís que la mirada ajena te cosifique y te robe tu libertad.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Comprender que "el infierno son los otros" cuando delegás en sus ojos la potestad de juzgar tu propio valor.', correct: true, explanation: 'La frase de "A puerta cerrada" desmitificada: el infierno es la dependencia absoluta de la mirada ajena.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Ponerte una careta de payaso para que no te vean.', correct: false, explanation: 'La máscara cómica es otra forma de huida ante la confrontación intersubjetiva.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 7,
        title: 'El Dilema del Estudiante Durante la Guerra',
        context: 'Un joven entra llorando al salón: debe elegir entre cuidar a su madre enferma o escapar a Londres a unirse a la Resistencia.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Decirle que abra un manual de moral tradicional para encontrar la respuesta correcta.', correct: false, explanation: 'No hay señales en el mundo que dicten la respuesta: cualquier doctrina moral abstracta es insuficiente ante el dilema real.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Decirle la verdad de Sartre: "Estás libre, inventa; ninguna moral puede decidir por ti, debes elegir y comprometerte".', correct: true, explanation: 'Dilema real de 1945: elegir a quién consultar ya es una elección orientada; el hombre está forzado a inventar su camino.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Tirar una moneda al aire para que el azar decida la vida de la madre.', correct: false, explanation: 'Dejar la decisión al azar es una cobardía de mala fe para no hacerse cargo del resultado.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 8,
        title: 'La Apertura Espontánea de la Puerta',
        context: 'Al desarmar las tres coartadas de mala fe, el cerrojo hace clic y la puerta principal se abre de par en par.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Aterrorizarte porque afuera hay una niebla densa y preferir quedarte adentro discutiendo para siempre.', correct: false, explanation: 'Es el final de "A puerta cerrada": Garcin tiene la puerta abierta pero se queda porque prefiere el infierno conocido de los otros.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Comprender que la puerta siempre estuvo abierta: sólo tus propias excusas te mantenían encerrado.', correct: true, explanation: 'Revelación existencial: la prisión no era el cuarto, sino la cobardía de huir de tu propia autonomía.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Cerrar la puerta con llave y tirar la llave por la ventana.', correct: false, explanation: 'El encierro voluntario es la claudicación total del proyecto existencial.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 9,
        title: 'La Niebla de la Incertidumbre',
        context: 'Frente al umbral se extiende el porvenir sin recetas, sin Dios y sin garantías de éxito.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: 'Reclamar que el Estado o una iglesia te garanticen que no vas a fracasar.', correct: false, explanation: 'La búsqueda de certezas absolutas niega la contingencia originaria de la existencia humana.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: 'Asumir la angustia de la libertad: elegir sabiendo que al elegirte estás comprometiendo a toda la humanidad.', correct: true, explanation: 'El humanismo sartreano: la responsabilidad es universal porque cada acto crea una imagen de lo que debe ser el hombre.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: 'Esperar sentado en el umbral a que la niebla se disipe.', correct: false, explanation: 'No elegir ya es una elección: elegiste la inacción y sos responsable de tu silencio.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      },
      {
        step: 10,
        title: 'El Salto al Compromiso (L\'Engagement)',
        context: 'Das el paso hacia afuera. Has asumido tu condena de ser libre.',
        videoContextId: '6rG7h2u1V8e',
        options: [
          { text: '"Buscaré un empleo cómodo y no me involucraré jamás en ningún problema político ni social".', correct: false, explanation: 'La deserción individualista reproduce la serialidad pasiva y el conformismo burgués.', videoFeedbackId: '7hK8m4gJ5sE' },
          { text: '"Asumo mi libertad y me comprometo activamente con mi tiempo histórico: el hombre es la suma de sus proyectos".', correct: true, explanation: '¡Completaste el existencialismo! Te hacés cargo de tu proyecto vital sin coartadas, con autenticidad y compromiso.', videoFeedbackId: '6rG7h2u1V8e' },
          { text: '"Declararé que nada importa porque todo es absurdo y me dedicaré a dormir".', correct: false, explanation: 'El nihilismo cínico confunde la falta de sentido predeterminado con la imposibilidad de crear sentido.', videoFeedbackId: '7hK8m4gJ5sE' }
        ]
      }
    ],
    questions: [
      { q: 'La tesis fundamental de que "la existencia precede a la esencia" significa que:', options: ['Venimos al mundo con un destino fijado por Dios', 'Primero existimos y solo después nos definimos mediante nuestras elecciones', 'La genética determina nuestro carácter', 'La sociedad nos crea sin que podamos cambiar nada'], correct: 1, rationale: 'No hay naturaleza humana fija; cada quien se construye con sus actos.' },
      { q: '¿Por qué para Sartre "el hombre está condenado a ser libre"?', options: ['Porque puede elegir no haber nacido', 'Porque no se creó a sí mismo, pero una vez en el mundo es responsable de todo lo que hace', 'Porque los gobiernos otorgan la libertad civil', 'Porque no existen las leyes penales'], correct: 1, rationale: 'La libertad es un dato ontológico ineludible del que no podemos desprendernos.' },
      { q: 'La "mala fe" (mauvaise foi) consiste en:', options: ['Estafar a un socio comercial', 'Mentirse a uno mismo tratándose como una cosa determinada para evadir la libertad', 'Tener malas intenciones religiosas', 'Cometer delitos penales'], correct: 1, rationale: 'Es el autoengaño de justificarse en las circunstancias para eludir la angustia de elegir.' },
      { q: 'En "El existencialismo es un humanismo", al elegir una conducta moral el individuo:', options: ['Decide solo para su beneficio egoísta', 'Elige al mismo tiempo una imagen de cómo debe ser el hombre para toda la humanidad', 'Obedece el horóscopo', 'Copia pasivamente a sus amigos'], correct: 1, rationale: 'La responsabilidad individual compromete el horizonte ético de toda la especie.' },
      { q: '¿Qué significa la célebre frase "el infierno son los otros"?', options: ['Que los demonios nos quemarán en el averno', 'Que delegamos en la mirada ajena el poder de cosificarnos y juzgar nuestra vida', 'Que el transporte público es incómodo', 'Que hay que vivir aislados en una isla'], correct: 1, rationale: 'Refiere a la tiranía de la mirada del otro cuando caemos en la dependencia de su juicio.' },
      { q: 'El concepto de "desamparo" (délaissement) alude a:', options: ['La falta de albergues municipales', 'La soledad radical del ser humano ante la inexistencia de normas trascendentes en el cielo', 'El abandono de un soldado en el frente', 'Quedarse sin dinero'], correct: 1, rationale: 'Al no haber Dios ni valores a priori, no tenemos excusas ni guías infalibles.' }
    ]
  },
  {
    id: 'foucault',
    name: 'Michel Foucault',
    short: 'Panóptico y disciplina',
    theme: 'from-violet-500/20 to-indigo-950/30',
    image: '/philosophers/foucault.png',
    accent: 'text-violet-300',
    video: '5rK7h2u1V8e',
    excerpt: 'El efecto mayor del Panóptico es inducir en el detenido un estado consciente y permanente de visibilidad que garantiza el funcionamiento automático del poder.',
    citation: 'Vigilar y castigar, "El panoptismo"',
    takeaways: [
      'La disciplina distribuye meticulosamente los cuerpos, tiempos y espacios institucionales.',
      'El panóptico automatiza el poder haciendo que el propio vigilado interiorice la mirada normativa.',
      'El binomio Saber-Poder clasifica a la población entre lo normal y lo patológico.'
    ],
    gameSteps: [
      {
        step: 1,
        title: 'El Fracaso del Castigo Soberano',
        context: 'Te nombran director de una institución convulsionada por huelgas y desorden. Tus asesores sugieren castigos corporales ejemplares en el patio.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Aplicar el suplicio físico visible frente a todos para aterrorizar a la población.', correct: false, explanation: 'El poder soberano antiguo fracasa en la modernidad: el espectáculo violento despierta rebelión y solidaridad con el reo.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Comprender que el suplicio es aparatoso pero ineficaz; se necesita una tecnología que actúe sobre el alma y los hábitos.', correct: true, explanation: 'Paso histórico de "Vigilar y castigar": la penalidad moderna abandona el cuerpo torturado para moldear la conducta.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Contratar a un payaso para que haga reír a los rebeldes.', correct: false, explanation: 'La distracción banal no resuelve la crisis estructural del dispositivo institucional.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 2,
        title: 'Cuadriculación del Espacio: Fin del Amontonamiento',
        context: 'En las aulas los estudiantes se sientan en mesas redondas grupales conversando y distrayéndose mutuamente.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Dejarlos amontonados esperando que el desorden se organice mágicamente solo.', correct: false, explanation: 'El amontonamiento facilita la confabulación y la indisciplina colectiva.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Distribuir bancos individuales fijos en filas alineadas donde todos miren hacia el frente.', correct: true, explanation: 'Técnica disciplinaria espacial: cuadricular el espacio para aislar, vigilar, comparar y evitar confabulaciones.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Poner colchonetas en el suelo para que duerman la siesta.', correct: false, explanation: 'La ociosidad es considerada por la disciplina como la madre de todas las desviaciones.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 3,
        title: 'Cronometración Minuciosa del Tiempo',
        context: 'Los tiempos de entrada, recreo y estudio son laxos y dependen de las ganas de cada grupo.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Instalar timbres sincronizados al segundo que fraccionen la jornada en bloques rígidos de 40 minutos.', correct: true, explanation: 'Control temporal disciplinario: penetrar el ritmo biológico para asegurar la máxima utilidad del tiempo útil.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Tirar todos los relojes para que el tiempo sea libre y poético.', correct: false, explanation: 'La institución productiva moderna no tolera tiempos vacíos sin rendimiento.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Hacer sonar una trompeta solo cuando el director tiene hambre.', correct: false, explanation: 'La disciplina sustituye el capricho arbitrario del soberano por una regla continua y anónima.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 4,
        title: 'La Torre Central Panóptica',
        context: 'Diseñas el patio central del establecimiento. Bentham propone una torre en el medio con vidrios oscuros polarizados.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Hacer la torre de cristal transparente para que los presos vean si el guardia está durmiendo.', correct: false, explanation: 'Si el preso sabe cuándo NO lo miran, la vigilancia pierde su efecto continuo.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Instalar la torre con persianas oscuras para que el vigilado nunca sepa en qué instante exacto lo observan.', correct: true, explanation: 'Principio supremo del Panóptico: visibilidad permanente que automatiza el poder sin necesidad de fuerza física.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Poner un tanque de agua en la torre para regar las plantas.', correct: false, explanation: 'Ignorás la arquitectura del poder como máquina óptica de control.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 5,
        title: 'Interiorización de la Mirada Vigilante',
        context: 'El vigilante de la torre se toma el día libre y la torre queda completamente vacía.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Los estudiantes saltan los muros porque se enteraron por megáfono de que no hay nadie.', correct: false, explanation: 'Falla técnica: el panóptico perfecto no avisa de su presencia ni de su ausencia.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Los estudiantes caminan derechos y corrigen su postura por el solo hecho de saberse potencialmente observados.', correct: true, explanation: '¡Efecto panóptico consumado! El poder se vuelve permanente en sus efectos aunque sea discontinuo en su acción.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Los estudiantes se ponen a cantar canciones de cuna.', correct: false, explanation: 'No tiene relación con los mecanismos de docilidad corporal.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 6,
        title: 'Fabricación de Cuerpos Dóciles',
        context: 'En los talleres y gimnasios se exige que cada movimiento, inclinación del torso y sujeción de herramientas siga un manual estricto.',
        videoContextId: '2hK8m4gJ5sE',
        options: [
          { text: 'Dejar que cada uno use el martillo con la mano que prefiera sin técnica alguna.', correct: false, explanation: 'La anatomopolítica no tolera gestos espontáneos ineficientes.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Adiestrar la anatomía para volver al cuerpo económicamente útil y políticamente obediente.', correct: true, explanation: 'Definición foucaultiana de "cuerpo dócil": la disciplina descompone los gestos para optimizar su rendimiento.', videoFeedbackId: '2hK8m4gJ5sE' },
          { text: 'Obligarlos a hacer piruetas circenses para divertir a los inspectores.', correct: false, explanation: 'La disciplina no busca acrobacias inútiles, sino hábitos productivos normalizados.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 7,
        title: 'El Examen Continuo y el Legajo',
        context: 'Se crea un sistema donde se registran notas, observaciones de conducta, tests psicotécnicos y antecedentes médicos de cada alumno.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Quemar los papeles a fin de año para no acumular basura en secretaría.', correct: false, explanation: 'El poder moderno se basa en la acumulación documental del saber sobre los individuos.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Utilizar el examen como dispositivo que combina vigilancia jerárquica y sanción normalizadora, convirtiendo al alumno en un caso.', correct: true, explanation: 'El examen fija a los individuos en una red documental: el nacimiento del saber clínico y psicopedagógico como poder.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Usar las fichas para jugar al bingo los viernes a la tarde.', correct: false, explanation: 'Banalización de los dispositivos de gubernamentalidad y registro.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 8,
        title: 'La Frontera entre lo Normal y lo Anormal',
        context: 'Un estudiante no se adapta al ritmo de los bancos y prefiere dibujar en silencio.',
        videoContextId: '5rK7h2u1V8e',
        options: [
          { text: 'Llevarlo a la horca pública por haber cometido un crimen de traición al Estado.', correct: false, explanation: 'Confundís el derecho penal del rey con la tecnología de la norma.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Clasificarlo como "desviado/anormal" y derivarlo a un gabinete ortopédico de corrección psicológica.', correct: true, explanation: 'La modernidad sustituye la ley por la Norma: ya no se castiga el pecado, se cura y reeduca al anormal.', videoFeedbackId: '5rK7h2u1V8e' },
          { text: 'Nombrarlo vicedirector del colegio.', correct: false, explanation: 'La institución normalizadora no premia la disidencia sin antes disciplinarla.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 9,
        title: 'La Expansión Biopolítica a la Ciudad',
        context: 'Salís del edificio escolar y observás la ciudad moderna: cámaras urbanas, rastreo de tarjetas y algoritmos de redes sociales.',
        videoContextId: '2hK8m4gJ5sE',
        options: [
          { text: 'Pensar que la vigilancia quedó encerrada exclusivamente en las cárceles de piedra del siglo XIX.', correct: false, explanation: 'Grave error: el panoptismo saltó los muros para convertirse en la sociedad de control y biopolítica.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: 'Reconocer que el panóptico se digitalizó: la gestión de datos regula a toda la población bajo la fórmula de "hacer vivir y dejar morir".', correct: true, explanation: 'Comprendés la Biopolítica: la tecnología de poder administra la salud, los flujos y las conductas a escala masiva.', videoFeedbackId: '2hK8m4gJ5sE' },
          { text: 'Apagar tu teléfono creyendo que así destruís toda la economía mundial.', correct: false, explanation: 'El biopoder es capilar e inmanente; no depende de un único dispositivo individual.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      },
      {
        step: 10,
        title: 'El Veredicto: La Microfísica del Poder',
        context: 'El inspector general te pregunta: "¿En qué escritorio o en qué persona reside el poder de esta institución?".',
        videoContextId: '9uV8k2m1V4s',
        options: [
          { text: '"En el director, porque él cobra el sueldo más alto y firma las actas".', correct: false, explanation: 'Concepción jurídica clásica del poder como una sustancia que se posee desde arriba.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: '"El poder no es una cosa que se posea: es una red capilar, anónima y automática que circula a través de todos nosotros".', correct: true, explanation: '¡Completaste a Foucault! Desarmás la ilusión soberana: el poder es una microfísica inmanente donde todos somos vehículos de su ejercicio.', videoFeedbackId: '9uV8k2m1V4s' },
          { text: '"En la policía que espera afuera en la esquina".', correct: false, explanation: 'La policía es solo el brazo represivo de emergencia; el poder más eficaz es el que normaliza sin armas.', videoFeedbackId: '9uV8k2m1V4s' }
        ]
      }
    ],
    questions: [
      { q: 'La gran mutación penal descrita en "Vigilar y castigar" consiste en:', options: ['El aumento de ejecuciones públicas teatrales', 'El paso del suplicio físico a la disciplina silenciosa del encierro y el control del alma', 'La abolición total de todas las cárceles', 'Juzgar a los reyes por delitos menores'], correct: 1, rationale: 'El poder moderno abandona el castigo corporal aparatoso para moldear hábitos y conductas.' },
      { q: 'El principal efecto arquitectónico y político del Panóptico de Bentham es:', options: ['Permitir que los reclusos conversen entre sí', 'Inducir en el detenido un estado consciente de visibilidad que automatiza el poder', 'Proyectar cine educativo', 'Facilitar las fugas nocturnas'], correct: 1, rationale: 'La posibilidad constante de ser mirado hace que el individuo se autovigile.' },
      { q: '¿Qué significa el concepto de "cuerpo dócil"?', options: ['Un cuerpo enfermo que no puede moverse', 'Un cuerpo adiestrado minuciosamente para ser económicamente útil y políticamente obediente', 'Un atleta de alto rendimiento olímpico', 'Un cuerpo libre de normas'], correct: 1, rationale: 'La disciplina desmenuza tiempos y movimientos para maximizar la docilidad y el rendimiento.' },
      { q: 'A diferencia del poder soberano clásico ("hacer morir o dejar vivir"), la biopolítica moderna se define como:', options: ['Cobrar impuestos y permitir viajar', 'Hacer vivir y dejar morir (gestionar la vida y la salud poblacional)', 'Obligar a rezar los domingos', 'Prohibir los deportes'], correct: 1, rationale: 'El biopoder regula la natalidad, mortalidad, higiene y flujos de la población.' },
      { q: 'El binomio foucaultiano "Poder-Saber" demuestra que:', options: ['Solo los científicos deben ser presidentes', 'El conocimiento no es neutral: cada sistema de saber produce y reproduce relaciones de poder', 'Para gobernar se necesitan bibliotecas públicas', 'Quien tiene dinero compra títulos'], correct: 1, rationale: 'No hay relación de poder sin constitución correlativa de un campo de saber.' },
      { q: 'Para Foucault, el poder en las sociedades contemporáneas debe entenderse como:', options: ['Una propiedad que posee el rey o el presidente', 'Una red capilar difusa de relaciones que circula por todo el tejido social', 'Un arma de fuego guardada en comisarías', 'Una ilusión óptica inexistente'], correct: 1, rationale: 'La microfísica del poder opera desde abajo, en las prácticas, normas e instituciones cotidianas.' }
    ]
  }
]

function emptySession(nombre = '', curso = ''): Session {
  return {
    nombre,
    curso,
    progreso: Object.fromEntries(authors.map(a => [a.id, baseProgress()]))
  }
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export default function Page() {
  const [session, setSession] = useState<Session | null>(null)
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [loading, setLoading] = useState(false)
  const [sync, setSync] = useState<'local' | 'drive'>('local')
  const [selected, setSelected] = useState<Author | null>(null)
  const [phase, setPhase] = useState(0)
  const [gameStep, setGameStep] = useState(1)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [adminOpen, setAdminOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const [scriptUrl, setScriptUrl] = useState(GOOGLE_SCRIPT_WEBAPP_URL)

  useEffect(() => {
    const saved = localStorage.getItem('agora_filosofia_session')
    if (saved) {
      try {
        setSession(JSON.parse(saved))
      } catch {}
    }
    const savedUrl = localStorage.getItem('agora_script_url')
    if (savedUrl) setScriptUrl(savedUrl)
  }, [])

  const overall = useMemo(() => {
    if (!session) return 0
    const completed = Object.values(session.progreso).filter(p => p.testCompletado).length
    return Math.round((completed / authors.length) * 100)
  }, [session])

  const currentProgress = selected && session ? session.progreso[selected.id] : null

  const persist = async (next: Session, authorId?: string, score?: number) => {
    setSession(next)
    localStorage.setItem('agora_filosofia_session', JSON.stringify(next))
    setSync('local')

    if (!scriptUrl.includes('YOUR_SCRIPT_ID')) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: authorId ? 'guardar_progreso' : 'login',
            nombre: next.nombre,
            curso: next.curso,
            progreso: next.progreso,
            ultimo_autor: authorId,
            puntaje_total: score ?? 0
          })
        })
        if (res.ok) setSync('drive')
      } catch {}
    }
  }

  const login = async () => {
    if (!name.trim() || !course) return
    setLoading(true)
    let next = emptySession(name.trim(), course)
    const cache = localStorage.getItem('agora_filosofia_session')
    if (cache) {
      try {
        const parsed = JSON.parse(cache)
        if (parsed.nombre === name.trim() && parsed.curso === course) next = parsed
      } catch {}
    }

    if (!scriptUrl.includes('YOUR_SCRIPT_ID')) {
      try {
        const res = await fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'login', nombre: name.trim(), curso: course })
        })
        const data = await res.json()
        if (data.progreso) next.progreso = { ...next.progreso, ...data.progreso }
        setSync('drive')
      } catch {
        setSync('local')
      }
    }

    await persist(next)
    setLoading(false)
  }

  const updateProgress = (patch: Partial<ProgressState>, score?: number) => {
    if (!session || !selected) return
    const next = {
      ...session,
      progreso: {
        ...session.progreso,
        [selected.id]: {
          ...session.progreso[selected.id],
          ...patch,
          fechaActualizacion: new Date().toISOString()
        }
      }
    }
    persist(next, selected.id, score)
  }

  const enterAuthor = (author: Author) => {
    setSelected(author)
    setPhase(0)
    setGameStep(session?.progreso[author.id].pasoJuegoActual || 1)
    setAnswers({})
    setQuestions([])
  }

  const startQuiz = () => {
    if (!selected) return
    setQuestions(shuffle([...selected.questions, ...selected.questions, ...selected.questions, ...selected.questions]).slice(0, 20))
    setAnswers({})
    setPhase(2)
  }

  const finishQuiz = () => {
    if (!selected || !questions.length) return
    const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0)
    updateProgress({ testCompletado: true, puntajeTest: score }, score)
    setPhase(3)
  }

  const exportCsv = () => {
    const rows = authors.map(a => `${a.name},${session?.progreso[a.id].puntajeJuego ?? 0},${session?.progreso[a.id].puntajeTest ?? 0}`)
    const blob = new Blob([`Autor,Juego,Test\n${rows.join('\n')}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'agora-respaldo.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#101313] text-stone-100">
        <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_.9fr]">
          <section>
            <Badge className="mb-6 border-amber-400/30 bg-amber-300/10 text-amber-200">
              <Sparkles className="mr-1.5 size-3.5" /> Aula de filosofía contemporánea
            </Badge>
            <h1 className="max-w-2xl font-serif text-5xl leading-[.96] tracking-tight sm:text-7xl">
              Pensar no es repetir.<br />
              <span className="text-amber-300">Es tomar posición.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-400">
              Un recorrido interactivo por seis autores para convertir conceptos difíciles en decisiones, dilemas audiovisuales y pensamiento crítico.
            </p>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-400">
              <span className="flex items-center gap-2"><BookOpen className="size-4 text-amber-300" /> 6 autores</span>
              <span className="flex items-center gap-2"><Trophy className="size-4 text-amber-300" /> 10 desafíos ramificados</span>
              <span className="flex items-center gap-2"><CircleHelp className="size-4 text-amber-300" /> 20 preguntas aleatorias</span>
            </div>
          </section>

          <Card className="border-stone-700 bg-stone-900/80 shadow-2xl shadow-amber-950/20">
            <CardHeader>
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-amber-300 text-stone-950">
                <GraduationCap className="size-6" />
              </div>
              <CardTitle className="font-serif text-3xl text-stone-50">Ingresar al aula</CardTitle>
              <CardDescription className="text-stone-400">
                Guardaremos tu recorrido en tiempo real para que puedas retomarlo en cualquier momento.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-stone-300">Nombre y Apellido del Estudiante</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej. Martina López"
                  className="border-stone-700 bg-stone-950 text-stone-100"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-stone-300">Curso y División</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger className="border-stone-700 bg-stone-950 text-stone-100">
                    <SelectValue placeholder="Seleccioná tu curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={login}
                disabled={!name.trim() || !course || loading}
                className="w-full bg-amber-300 text-stone-950 hover:bg-amber-200"
              >
                {loading ? 'Conectando…' : 'Ingresar al Aula Virtual'} <ArrowRight className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  if (!selected) {
    return (
      <main className="min-h-screen bg-[#101313] text-stone-100">
        <header className="border-b border-stone-800 bg-stone-950/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber-300 text-stone-950">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <p className="font-serif text-lg leading-none">Ágora Crítica</p>
                <p className="text-[10px] uppercase tracking-[.25em] text-stone-500">Filosofía contemporánea</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm text-stone-200">{session.nombre}</p>
                <p className="text-xs text-stone-500">{session.curso}</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                <Cloud className="mr-1 size-3.5" /> {sync === 'drive' ? 'Sincronizado en Drive' : 'Guardado localmente'}
              </Badge>
              <Button variant="ghost" size="icon" onClick={() => setAdminOpen(true)} className="text-stone-400">
                <Settings2 />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSession(null)} className="hidden text-stone-400 sm:inline-flex">
                Cambiar estudiante
              </Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-amber-300">Tu mapa de aprendizaje</p>
              <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">Elegí un autor y empezá a pensar.</h1>
              <p className="mt-3 max-w-xl text-stone-400">No hay un orden obligatorio. Cada módulo combina teoría, dilemas inmersivos en video y evaluación.</p>
            </div>
            <div className="w-full md:max-w-xs">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-stone-400">Progreso general</span>
                <span className="font-semibold text-amber-300">{overall}%</span>
              </div>
              <Progress value={overall} className="h-2 bg-stone-800" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {authors.map((a, i) => {
              const p = session.progreso[a.id]
              const status = p.testCompletado ? 'Completado' : p.teoriaCompletada || p.pasoJuegoActual > 1 ? 'En progreso' : 'Pendiente'
              return (
                <Card key={a.id} className={`group relative overflow-hidden border-stone-800 bg-gradient-to-br ${a.theme} bg-stone-900 transition hover:-translate-y-1 hover:border-stone-500 hover:shadow-2xl hover:shadow-black/30`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={a.image} alt={`Retrato de ${a.name}`} className="size-full object-cover grayscale-[.15] transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-5 text-5xl font-serif text-white/80">0{i + 1}</div>
                    <Badge variant="outline" className="absolute right-4 top-4 border-white/20 bg-stone-950/60 text-stone-100 backdrop-blur">
                      {status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[.22em] text-stone-500">Módulo {String(i + 1).padStart(2, '0')}</span>
                      <span className="text-xs text-stone-500">{p.fechaActualizacion ? new Date(p.fechaActualizacion).toLocaleDateString('es-AR') : 'Hoy'}</span>
                    </div>
                    <CardTitle className="font-serif text-2xl text-stone-50">{a.name}</CardTitle>
                    <CardDescription className={`${a.accent} text-sm`}>{a.short}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs text-stone-500">Desafío Inmersivo</p>
                        <p className="mt-1 font-semibold text-stone-200">{p.puntajeJuego > 0 ? '10/10' : `${p.pasoJuegoActual - 1}/10`}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs text-stone-500">Cuestionario</p>
                        <p className="mt-1 font-semibold text-stone-200">{p.puntajeTest}/20</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => enterAuthor(a)} variant="secondary" className="w-full justify-between bg-stone-950/60 text-stone-200 hover:bg-stone-950">
                      {status === 'Pendiente' ? 'Explorar recorrido' : 'Continuar recorrido'} <ChevronRight className="size-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>

        {adminOpen && (
          <AdminDialog
            open={adminOpen}
            onOpenChange={setAdminOpen}
            pin={pin}
            setPin={setPin}
            unlocked={adminUnlocked}
            setUnlocked={setAdminUnlocked}
            scriptUrl={scriptUrl}
            setScriptUrl={setScriptUrl}
            exportCsv={exportCsv}
          />
        )}
      </main>
    )
  }

  const p = currentProgress!

  return (
    <main className="min-h-screen bg-[#101313] text-stone-100">
      <header className="border-b border-stone-800 bg-stone-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Button variant="ghost" onClick={() => setSelected(null)} className="-ml-3 text-stone-400">
            <ArrowLeft className="mr-2 size-4" /> Selector
          </Button>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-stone-500">{selected.name}</span>
            <ChevronRight className="size-4 text-stone-700" />
            <span className="text-sm text-stone-200">
              {phase === 0 ? 'Teoría' : phase === 1 ? 'Desafío Inmersivo (10 Pasos)' : phase === 2 ? 'Cuestionario' : 'Resultados'}
            </span>
          </div>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
            {sync === 'drive' ? 'Drive ✓' : 'Local'}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className={`mb-2 text-sm font-medium ${selected.accent}`}>Recorrido: {selected.name}</p>
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{selected.name}</h1>
            <p className="mt-2 text-stone-400">{selected.short}</p>
          </div>
          <div className="hidden size-16 items-center justify-center rounded-2xl border border-stone-700 bg-stone-900 sm:flex">
            <BookOpen className="size-7 text-amber-300" />
          </div>
        </div>

        <div className="mb-10 grid grid-cols-4 gap-2">
          {['Teoría', 'Desafío Inmersivo', 'Cuestionario', 'Resultados'].map((label, i) => (
            <button
              key={label}
              onClick={() => i <= phase && setPhase(i)}
              className={`border-t-2 px-1 pt-3 text-left text-xs transition ${
                i === phase
                  ? 'border-amber-300 text-stone-100 font-semibold'
                  : i < phase
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-stone-800 text-stone-600'
              }`}
            >
              <span className="mr-1">0{i + 1}</span> {label}
            </button>
          ))}
        </div>

        {phase === 0 && (
          <Theory
            author={selected}
            onStart={() => {
              updateProgress({ teoriaCompletada: true })
              setPhase(1)
            }}
          />
        )}

        {phase === 1 && (
          <GameCinema
            author={selected}
            step={gameStep}
            setStep={setGameStep}
            onComplete={() => {
              updateProgress({ juegoCompletado: true, puntajeJuego: 10, pasoJuegoActual: 10 })
              startQuiz()
            }}
            onSave={step => updateProgress({ pasoJuegoActual: step })}
          />
        )}

        {phase === 2 && (
          <Quiz questions={questions} answers={answers} setAnswers={setAnswers} onFinish={finishQuiz} />
        )}

        {phase === 3 && (
          <Results author={selected} progress={p} onBack={() => setSelected(null)} />
        )}
      </div>
    </main>
  )
}

function Theory({ author, onStart }: { author: Author; onStart: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <Card className="overflow-hidden border-stone-800 bg-stone-900">
        <div className="aspect-video bg-stone-950">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${author.video}?modestbranding=1&rel=0`}
            title={`Video sobre ${author.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <CardContent className="p-6">
          <Badge className="mb-4 border-amber-400/30 bg-amber-300/10 text-amber-200">Fuente textual auténtica</Badge>
          <h2 className="font-serif text-2xl text-stone-100">Texto clave para el recorrido</h2>
          <p className="mt-4 leading-8 text-stone-300 italic border-l-2 border-amber-400/40 pl-4 bg-black/20 py-2 rounded-r">
            «{author.excerpt}»
          </p>
          <p className="mt-3 text-xs text-stone-500 text-right">— {author.citation}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="border-amber-500/20 bg-amber-300/[.03]">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-amber-200">Tres claves conceptuales</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {author.takeaways.map(t => (
                <li key={t} className="flex gap-3 text-sm leading-6 text-stone-300">
                  <Check className="mt-1 size-4 shrink-0 text-amber-300" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-5 text-sm text-stone-400 leading-relaxed">
          <p className="font-medium text-stone-200 mb-2 flex items-center gap-2">
            <Volume2 className="size-4 text-amber-300" /> Dinámica del desafío:
          </p>
          En el siguiente paso atravesarás 10 dilemas en video. Cada elección que tomes modificará el escenario y desplegará la consecuencia filosófica correspondiente.
        </div>

        <Button onClick={onStart} className="mt-auto h-13 justify-between bg-amber-300 px-6 text-stone-950 hover:bg-amber-200 font-medium">
          Comenzar el desafío inmersivo (10 pasos) <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function GameCinema({
  author,
  step,
  setStep,
  onComplete,
  onSave
}: {
  author: Author
  step: number
  setStep: (n: number) => void
  onComplete: () => void
  onSave: (n: number) => void
}) {
  const currentStepData = author.gameSteps[step - 1] || author.gameSteps[0]
  const [selectedOption, setSelectedOption] = useState<GameOption | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const activeVideoId =
    selectedOption?.videoFeedbackId || currentStepData.videoContextId || author.video

  const handleSelect = (option: GameOption, idx: number) => {
    setSelectedOption(option)
    setSelectedIndex(idx)
  }

  const handleNext = () => {
    if (step === 10) {
      onComplete()
    } else {
      const nextStep = step + 1
      setStep(nextStep)
      onSave(nextStep)
      setSelectedOption(null)
      setSelectedIndex(null)
    }
  }

  const isCorrect = selectedOption?.correct ?? false

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-stone-950/90 border border-stone-800 rounded-3xl p-6 lg:p-8 shadow-2xl backdrop-blur">
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[.25em] text-amber-300 font-mono">
            Paso {step} de 10
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {Math.round((step / 10) * 100)}% resuelto
          </span>
        </div>
        <Progress value={(step / 10) * 100} className="h-2 bg-stone-800" />

        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-800 bg-black shadow-inner mt-2">
          <iframe
            key={activeVideoId}
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?modestbranding=1&rel=0&autoplay=0`}
            title={currentStepData.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="rounded-xl border border-stone-800/80 bg-stone-900/60 p-4 text-xs text-stone-400 leading-relaxed">
          <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
            <Video className="size-3.5" /> Disparador audiovisual
          </p>
          El video reacciona de acuerdo a la postura ética o metafísica que elijas en cada dilema.
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          <Badge variant="outline" className="border-amber-400/30 text-amber-300 mb-3">
            Dilema filosófico · {author.name}
          </Badge>
          <h2 className="font-serif text-2xl lg:text-3xl text-stone-50 leading-tight">
            {currentStepData.title}
          </h2>

          <div className="mt-4 rounded-2xl border border-stone-800 bg-stone-900/40 p-5 text-sm lg:text-base leading-7 text-stone-300">
            {currentStepData.context}
          </div>

          <p className="mt-5 text-xs uppercase tracking-wider text-stone-500 font-semibold">
            Seleccioná tu decisión:
          </p>

          <div className="mt-3 flex flex-col gap-3">
            {currentStepData.options.map((opt, i) => {
              const isSelected = selectedIndex === i
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt, i)}
                  className={`w-full rounded-2xl border p-4 text-left text-sm transition-all duration-200 flex items-start gap-4 ${
                    isSelected
                      ? opt.correct
                        ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100 shadow-lg shadow-emerald-950/30'
                        : 'border-rose-400 bg-rose-500/15 text-rose-100 shadow-lg shadow-rose-950/30'
                      : 'border-stone-800 bg-stone-900/40 text-stone-300 hover:border-stone-600 hover:bg-stone-900'
                  }`}
                >
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-mono font-bold ${
                    isSelected
                      ? opt.correct ? 'bg-emerald-400 text-stone-950' : 'bg-rose-400 text-stone-950'
                      : 'bg-stone-800 text-stone-400'
                  }`}>
                    0{i + 1}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </button>
              )
            })}
          </div>
        </div>

        {selectedOption && (
          <div
            className={`rounded-2xl border p-4 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 ${
              isCorrect
                ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                : 'border-amber-500/40 bg-amber-950/30 text-amber-200'
            }`}
          >
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <Check className="size-4 text-emerald-400" /> Posición filosófica coherente
                </>
              ) : (
                <>
                  <AlertTriangle className="size-4 text-amber-400" /> Trampa conceptual detectada
                </>
              )}
            </p>
            <p className="text-xs leading-6">{selectedOption.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-stone-800 pt-5">
          <Button
            variant="ghost"
            onClick={() => {
              if (step > 1) {
                const prev = step - 1
                setStep(prev)
                onSave(prev)
                setSelectedOption(null)
                setSelectedIndex(null)
              }
            }}
            disabled={step === 1}
            className="text-stone-400 hover:text-stone-200"
          >
            <ArrowLeft className="mr-2 size-4" /> Paso anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isCorrect}
            className="bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium px-6"
          >
            {step === 10 ? 'Abrir cuestionario evaluativo' : 'Avanzar al siguiente paso'}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Quiz({
  questions,
  answers,
  setAnswers,
  onFinish
}: {
  questions: QuizQuestion[]
  answers: Record<number, number>
  setAnswers: (a: Record<number, number>) => void
  onFinish: () => void
}) {
  const answered = Object.keys(answers).length

  return (
    <Card className="border-stone-800 bg-stone-900 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="border-violet-400/30 text-violet-200">
              Evaluación aleatoria
            </Badge>
            <CardTitle className="mt-3 font-serif text-3xl">Cuestionario de pensamiento crítico</CardTitle>
            <CardDescription className="text-stone-400">
              Respondé las 20 preguntas seleccionadas al azar sobre el autor para validar tu comprensión.
            </CardDescription>
          </div>
          <span className="text-sm font-mono text-stone-400">{answered} / 20</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {questions.map((q, i) => (
          <div key={i} className="rounded-2xl border border-stone-800 bg-stone-950/60 p-5">
            <p className="font-medium leading-6 text-stone-200">
              <span className="mr-2 text-amber-300 font-mono">{String(i + 1).padStart(2, '0')}.</span>
              {q.q}
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {q.options.map((option, j) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                    answers[i] === j
                      ? 'border-amber-300/60 bg-amber-300/10 text-stone-100 font-medium'
                      : 'border-stone-800 text-stone-400 hover:border-stone-700 hover:bg-stone-900/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === j}
                    onChange={() => setAnswers({ ...answers, [i]: j })}
                    className="mt-1 accent-amber-300"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="sticky bottom-0 justify-between border-t border-stone-800 bg-stone-900/95 py-4 backdrop-blur">
        <span className="text-sm text-stone-400">{answered} de 20 respondidas</span>
        <Button
          onClick={onFinish}
          disabled={answered < questions.length}
          className="bg-amber-300 text-stone-950 hover:bg-amber-200 px-6 font-medium"
        >
          Finalizar y enviar evaluación <Upload className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function Results({
  author,
  progress,
  onBack
}: {
  author: Author
  progress: ProgressState
  onBack: () => void
}) {
  const passed = progress.puntajeTest >= 12

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-stone-800 bg-stone-900 shadow-2xl">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-amber-300 text-stone-950">
            <Trophy className="size-7" />
          </div>
          <Badge className={passed ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-300/15 text-amber-200'}>
            {passed ? 'Aprobado · Pensamiento crítico sobresaliente' : 'Recorrido completado · Sugerencia de revisión'}
          </Badge>
          <CardTitle className="mt-4 font-serif text-5xl">{progress.puntajeTest} / 20</CardTitle>
          <CardDescription className="text-stone-400">
            Resultado final obtenido en el módulo de {author.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6 bg-stone-800" />
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Conceptos clave validados en este módulo:
          </p>
          <div className="flex flex-col gap-4">
            {author.questions.map((q, i) => (
              <div key={q.q} className="flex gap-3 text-sm rounded-xl border border-stone-800/80 bg-stone-950/40 p-4">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-3" />
                </div>
                <div>
                  <p className="text-stone-200 font-medium">{q.q}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-400">{q.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium h-12">
            Volver al selector de autores <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function AdminDialog({
  open,
  onOpenChange,
  pin,
  setPin,
  unlocked,
  setUnlocked,
  scriptUrl,
  setScriptUrl,
  exportCsv
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  pin: string
  setPin: (v: string) => void
  unlocked: boolean
  setUnlocked: (v: boolean) => void
  scriptUrl: string
  setScriptUrl: (v: string) => void
  exportCsv: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-stone-700 bg-stone-900 text-stone-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
            <LockKeyhole className="size-5 text-amber-300" /> Panel docente
          </DialogTitle>
          <DialogDescription className="text-stone-400">
            Configuración de sincronización con Google Drive y descarga de notas.
          </DialogDescription>
        </DialogHeader>

        {!unlocked ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin" className="text-stone-300">PIN maestro (por defecto: docente2026)</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="border-stone-700 bg-stone-950"
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={() => {
                if (pin === 'docente2026') setUnlocked(true)
              }}
              className="bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium"
            >
              Desbloquear
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 py-2">
            <div>
              <Label htmlFor="script" className="text-stone-300">Google Apps Script Web App URL</Label>
              <Input
                id="script"
                value={scriptUrl}
                onChange={e => setScriptUrl(e.target.value)}
                className="mt-2 border-stone-700 bg-stone-950 text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('agora_script_url', scriptUrl)
                  onOpenChange(false)
                }}
                className="mt-3 border-stone-700"
              >
                Guardar URL
              </Button>
            </div>
            <Separator className="bg-stone-800" />
            <div className="flex items-center justify-between rounded-xl border border-stone-800 p-4">
              <div>
                <p className="font-medium text-sm">Planilla activa en Drive</p>
                <p className="text-xs text-stone-500">Abrí el registro de calificaciones en vivo.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-stone-700"
                onClick={() => window.open(scriptUrl, '_blank')}
              >
                <ExternalLink className="mr-1.5 size-3.5" /> Abrir
              </Button>
            </div>
            <Button variant="secondary" onClick={exportCsv} className="w-full">
              <Download className="mr-2 size-4" /> Exportar respaldo CSV
            </Button>
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
