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
  RotateCcw,
  Settings2,
  Sparkles,
  Trophy,
  Upload,
  Video,
  Volume2,
  AlertTriangle,
  Factory,
  Users,
  Clock,
  TrendingUp,
  Cpu,
  Flame,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Maximize2,
  Minimize2,
  X,
  Heart,
  Briefcase,
  Home,
  ShieldAlert,
  Coins
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
    id: 'marx',
    name: 'Karl Marx',
    short: 'Simulador: Desigualdad Heredada y Plusvalía',
    theme: 'from-rose-500/20 to-red-950/30',
    image: '/philosophers/marx.png',
    accent: 'text-rose-300',
    video: 'JwmnpGUlsqU',
    excerpt: 'El trabajador se vuelve tanto más pobre cuanta más riqueza produce... Lo animal se convierte en lo humano y lo humano en lo animal.',
    citation: 'Manuscritos económico-filosóficos de 1844',
    takeaways: [
      'La cuna y la propiedad privada de los medios definen las oportunidades reales antes del mérito individual.',
      'La plusvalía es el trabajo vivo impago que permite al capitalista acumular mientras el obrero sobrevive.',
      'La salida a la desigualdad estructural no es el esfuerzo solitario, sino la conciencia y organización de clase.'
    ],
    questions: [
      { q: 'Según el materialismo histórico, ¿qué elemento constituye la base o infraestructura de una sociedad?', options: ['El derecho y la religión', 'Las relaciones sociales de producción y fuerzas productivas', 'La filosofía y el arte', 'Las leyes morales individuales'], correct: 1, rationale: 'La base económica material condiciona la superestructura ideológica y jurídica.' },
      { q: '¿Qué compone la superestructura ideológica e institucional?', options: ['Las fábricas y las maquinarias', 'El Estado, las leyes, la religión y las ideologías dominantes', 'Las materias primas y la tierra', 'Los salarios y los precios'], correct: 1, rationale: 'La superestructura refleja y legitima las relaciones de dominación material.' },
      { q: '¿Cuál es el motor de la historia humana de acuerdo con el Manifiesto Comunista?', options: ['La lucha de clases', 'La voluntad de los héroes y reyes', 'La evolución biológica darwiniana', 'El avance de las religiones'], correct: 0, rationale: 'Toda la historia de la sociedad humana hasta nuestros días es historia de luchas de clases.' },
      { q: 'La alienación del trabajador respecto al producto de su trabajo significa que:', options: ['El objeto producido le pertenece por derecho divino', 'El objeto se le enfrenta como un poder extraño e independiente que no le pertenece', 'El trabajador destruye las mercancías por placer', 'El salario siempre es superior al valor de la mercancía'], correct: 1, rationale: 'El fruto de su esfuerzo le resulta ajeno y lo domina como mercancía exterior.' },
      { q: 'En la alienación del acto de producción, el trabajo para el obrero resulta:', options: ['Una actividad libre y autorrealizadora', 'Una imposición exterior donde se niega a sí mismo', 'Un descanso mental', 'Una fuente inmediata de dicha'], correct: 1, rationale: 'El trabajo no satisface una necesidad interior sino que es un mero medio de subsistencia forzado.' },
      { q: 'La alienación respecto al "ser genérico" (Gattungswesen) implica que:', options: ['El ser humano olvida su nacionalidad', 'La actividad consciente y creativa de la especie queda reducida a mero medio de subsistencia física', 'El hombre se convierte en un animal doméstico', 'Pierde su identidad jurídica en el censo'], correct: 1, rationale: 'El hombre queda despojado de su capacidad universal y libre de transformar conscientemente la naturaleza.' },
      { q: '¿Qué es la "plusvalía" en la teoría económica de Marx?', options: ['El valor añadido por los impuestos del Estado', 'El valor no remunerado del trabajo del obrero del cual se apropia el capitalista', 'La ganancia que surge del regateo en el mercado', 'El costo del desgaste de las maquinarias'], correct: 1, rationale: 'Es el excedente de valor generado por el trabajo vivo por encima del salario pagado.' },
      { q: 'El "fetichismo de la mercancía" ocurre cuando:', options: ['Los consumidores adoran objetos religiosos en las tiendas', 'Las relaciones sociales entre productores se perciben como relaciones objetivas entre cosas', 'Las empresas regalan productos por caridad', 'Los trabajadores deciden no vender sus productos'], correct: 1, rationale: 'Oculta el trabajo humano bajo la apariencia de precios autónomos en el mercado.' },
      { q: '¿Cuál es la diferencia entre el valor de uso y el valor de cambio?', options: ['El valor de uso es el precio monetario; el de cambio es la utilidad', 'El valor de uso es la utilidad cualitativa; el de cambio es la proporción cuantitativa en que se intercambia', 'Son conceptos idénticos sin distinción', 'El valor de uso solo existe en el capitalismo moderno'], correct: 1, rationale: 'El valor de uso satisface necesidades; el de cambio mide equivalencias en el mercado.' },
      { q: 'El capital constante se diferencia del capital variable porque:', options: ['El constante se invierte en medios de producción y el variable en fuerza de trabajo', 'El constante varía día a día en la bolsa', 'El variable nunca genera ganancias', 'El constante paga salarios y el variable compra edificios'], correct: 0, rationale: 'El capital constante transfiere su valor; el variable (fuerza de trabajo) produce nuevo valor excedente.' },
      { q: 'La plusvalía absoluta se obtiene principalmente:', options: ['Aumentando la productividad mediante nuevas tecnologías', 'Prolongando la duración de la jornada laboral', 'Reduciendo los precios de los insumos', 'Prohibiendo las exportaciones'], correct: 1, rationale: 'Se prolonga el tiempo de trabajo más allá del necesario manteniendo el mismo salario.' },
      { q: 'La plusvalía relativa se consigue mediante:', options: ['El aumento de la jornada a 16 horas', 'El aumento de la productividad para reducir el tiempo de trabajo necesario', 'El despido de la mitad de los operarios', 'La inflación en el comercio minorista'], correct: 1, rationale: 'La mecanización reduce el valor de los bienes de subsistencia y abrevia el trabajo necesario.' },
      { q: 'Para Marx, las ideas dominantes en cualquier época son:', options: ['Las ideas de la clase más sabia y educada', 'Las ideas de la clase dominante material', 'Principios dictados por el azar histórico', 'Las opiniones de las mayorías oprimidas'], correct: 1, rationale: 'Quien dispone de los medios de producción material dispone también de los medios de producción espiritual.' },
      { q: '¿Cuál es el papel del Estado en la sociedad burguesa según Marx?', options: ['Un árbitro imparcial que protege a todos los ciudadanos', 'Una junta administradora de los negocios comunes de la burguesía', 'Una entidad sin poder frente a los sindicatos', 'Un organismo puramente benéfico'], correct: 1, rationale: 'El Estado moderno garantiza la reproducción jurídica y armada de la propiedad privada capitalista.' },
      { q: 'El proceso de "acumulación originaria" consistió históricamente en:', options: ['El ahorro prudente y austero de los primeros empresarios', 'La separación violenta de los productores directos de sus medios de subsistencia y producción', 'Un tratado pacífico entre siervos y señores feudales', 'La creación de los primeros billetes de papel'], correct: 1, rationale: 'El cercamiento de tierras expulsó a los campesinos forzándolos a venderse como proletarios.' },
      { q: '¿Qué define fundamentalmente a una clase social en el marxismo?', options: ['Su nivel de ingresos o prestigio social', 'Su posición respecto a la propiedad de los medios de producción', 'Su preferencia electoral y hábitos de consumo', 'Su nivel de instrucción académica'], correct: 1, rationale: 'Tener o no la propiedad de los medios productivos determina la inserción de clase.' },
      { q: 'El "ejército industrial de reserva" sirve al sistema capitalista para:', options: ['Defender al país de invasiones extranjeras', 'Mantener los salarios bajos debido a la presión constante del desempleo', 'Financiar proyectos estatales de infraestructura', 'Producir artículos de lujo para exportación'], correct: 1, rationale: 'La masa de desocupados presiona a la baja las demandas salariales de los ocupados.' },
      { q: 'En la Tesis 11 sobre Feuerbach, Marx sostiene que los filósofos:', options: ['Han destruido las verdades científicas', 'No han hecho más que interpretar el mundo de diversos modos, pero de lo que se trata es de transformarlo', 'Deben obedecer a los monarcas de turno', 'Deben rezar por el bienestar del pueblo'], correct: 1, rationale: 'La filosofía debe unirse a la praxis revolucionaria para emancipar materialmente a la sociedad.' },
      { q: 'La dialéctica en Marx se diferencia de la hegeliana en que:', options: ['Niega la contradicción y el cambio', 'Se apoya sobre bases materiales e históricas en vez de sobre el Espíritu Absoluto', 'Es puramente idealista y teológica', 'Rechaza todo tipo de análisis lógico'], correct: 1, rationale: 'Marx pone de pie la dialéctica de Hegel situándola sobre la realidad material de la producción.' },
      { q: 'La frase "la religión es el opio del pueblo" expresa que la religión actúa como:', options: ['Un narcótico artificial diseñado por farmacéuticas', 'Un consuelo ilusorio ante la miseria real que desmoviliza la crítica material', 'La principal causa del crecimiento industrial', 'Un conjunto de doctrinas verdaderas e incuestionables'], correct: 1, rationale: 'Es el suspiro de la criatura oprimida que proyecta en el más allá el alivio a sus penurias terrenales.' },
      { q: 'La diferencia entre "clase en sí" y "clase para sí" radica en:', options: ['El salario cobrado por hora', 'El paso de una posición objetiva en la producción a la conciencia colectiva y organización de lucha', 'El paso de ser campesinos a comerciantes', 'La inscripción formal en un partido político estatal'], correct: 1, rationale: 'Pasan de compartir pasivamente una explotación a ser sujetos conscientes y organizados.' },
      { q: 'La fórmula general del capital en circulación mercantil desarrollada es:', options: ['Mercancía - Dinero - Mercancía (M - D - M)', 'Dinero - Mercancía - Dinero incrementado (D - M - D\')', 'Dinero - Dinero - Mercancía', 'Mercancía - Mercancía - Dinero'], correct: 1, rationale: 'El dinero se adelanta como capital para comprar mercancías y retornar valorizado con plusvalía.' },
      { q: 'Las crisis periódicas en el capitalismo se caracterizan fundamentalmente por:', options: ['Falta absoluta de bienes de consumo (escasez natural)', 'Sobreproducción de mercancías en relación con la capacidad adquisitiva de las masas', 'Caídas de meteoritos y desastres biológicos', 'Exceso de salarios pagados a los obreros'], correct: 1, rationale: 'Se producen mercancías que no pueden realizarse en el mercado debido a la pauperización obrera.' },
      { q: 'La tendencia descendente de la cuota de ganancia se produce por:', options: ['El aumento de la composición orgánica del capital (mayor inversión en máquinas que en trabajo vivo)', 'La subida incontrolable de los impuestos aduaneros', 'La generosidad creciente de la clase patronal', 'La disminución del comercio exterior'], correct: 0, rationale: 'Solo el trabajo vivo produce plusvalía; al tecnificarse la producción, disminuye la proporción de trabajo vivo.' },
      { q: 'El comunismo como etapa final prevé:', options: ['El control absoluto de la vida por una policía militar eterna', 'La abolición de las clases sociales, de la propiedad privada de los medios y la extinción del Estado', 'El reparto forzoso de cepillos de dientes y ropa personal', 'El retorno a la vida en cavernas'], correct: 1, rationale: 'Es una sociedad de productores libres asociados donde el libre desarrollo de cada uno condiciona el de todos.' },
      { q: 'La propiedad que el marxismo busca abolir es:', options: ['La propiedad personal de bienes de consumo diario', 'La propiedad privada de los medios de producción social', 'El derecho a la vivienda propia de los trabajadores', 'Las herramientas de uso manual individual'], correct: 1, rationale: 'Se busca colectivizar fábricas, tierras y máquinas, no las pertenencias de uso individual.' },
      { q: '¿Por qué la fuerza de trabajo es una mercancía excepcional?', options: ['Porque nunca se gasta ni envejece', 'Porque es la única capaz de crear un valor superior al que cuesta reproducirla', 'Porque se compra y vende gratis en el mercado', 'Porque la genera el Estado de manera ilimitada'], correct: 1, rationale: 'Su consumo productivo crea nuevo valor excedente: la plusvalía.' },
      { q: 'La "enajenación recíproca entre hombres" en el capitalismo genera que:', options: ['Todos vivan en comunas fraternales', 'Los individuos se perciban mutuamente como rivales o instrumentos de lucro', 'Desaparezcan las fronteras nacionales de forma inmediata', 'Las familias trabajen unidas sin discrepancias'], correct: 1, rationale: 'La lógica de la competencia de mercado fractura los lazos de cooperación de la comunidad humana.' },
      { q: 'El ludismo (destrucción de máquinas) fue criticado por los socialistas científicos porque:', options: ['Era un delito contra la corona', 'Confundía el instrumento técnico de producción con la forma social capitalista de su explotación', 'Frenaba las ganancias de los sindicatos', 'Las máquinas eran sagradas'], correct: 1, rationale: 'El problema no es la máquina que alivia el esfuerzo, sino quién es su dueño y para qué se usa.' },
      { q: 'En la sociedad capitalista, el tiempo de trabajo socialmente necesario determina:', options: ['El valor de cambio de una mercancía', 'La duración del descanso dominical', 'El precio de los pasajes de transporte público', 'El horario de cierre de los bancos'], correct: 0, rationale: 'La magnitud de valor de un bien se mide por el tiempo medio socialmente requerido para producirlo.' },
      { q: 'La llamada "dictadura del proletariado" es concebida por Marx como:', options: ['Un régimen tiránico vitalicio de un solo dictador', 'Un periodo de transición revolucionario de la mayoría trabajadora hacia la sociedad sin clases', 'Una monarquía parlamentaria tradicional', 'Una teocracia de intelectuales'], correct: 1, rationale: 'Es la toma del poder por la inmensa mayoría de los productores para desmontar el aparato burgués.' },
      { q: 'El socialismo utópico fue criticado por Marx y Engels porque:', options: ['No creía en la paz ni en la bondad humana', 'Carecía de base materialista e histórica y apelaba a la buena voluntad de las clases ricas', 'Apoyaba el trabajo infantil', 'Quería privatizar toda la tierra'], correct: 1, rationale: 'Diseñaba modelos ideales en el aire sin entender la contradicción objetiva de las clases sociales.' },
      { q: 'El concepto de "falsa conciencia" alude a:', options: ['Problemas neurológicos transitorios', 'La internalización de la ideología dominante por parte de los oprimidos contra sus propios intereses', 'El delirio místico en las artes plásticas', 'Mentir deliberadamente en un juicio'], correct: 1, rationale: 'El dominado asume como universales y naturales los valores de la clase que lo somete.' },
      { q: '¿Qué ocurre con la división social del trabajo en la fase superior del comunismo?', options: ['Se militariza de forma permanente', 'Se supera la fijación del individuo a un único rol unilateral (intelectual vs. manual)', 'Se eliminan todos los oficios manuales', 'Se prohíbe el trabajo voluntario'], correct: 1, rationale: 'Permite al ser humano dedicarse a múltiples actividades creativas sin quedar atado a un rol fijo.' },
      { q: 'La fórmula distributiva del comunismo maduro es:', options: ['"A todos lo mismo sin importar su necesidad"', '"De cada cual según sus capacidades, a cada cual según sus necesidades"', '"El que no trabaje 14 horas no come"', '"A cada quien según su linaje noble"'], correct: 1, rationale: 'Consagra la emancipación plena superando el estrecho horizonte del derecho burgués.' },
      { q: 'El lumpenproletariado es definido por Marx como:', options: ['La vanguardia organizada de la revolución', 'Los sectores marginados y desclasados, propensos a ser cooptados por la reacción', 'Los campesinos propietarios de parcelas medianas', 'Los accionistas de corporaciones navieras'], correct: 1, rationale: 'Carecen de disciplina productiva y son fácilmente sobornados por las fuerzas reaccionarias.' },
      { q: 'La teoría del valor-trabajo sostiene que el valor de las mercancías procede de:', options: ['La escasez psicológica subjetiva en el cliente', 'El trabajo abstracto humano cristalizado en ellas', 'La bondad del empresario que las confecciona', 'La publicidad televisiva y de medios'], correct: 1, rationale: 'El gasto de energía laboral humana es la sustancia objetiva que crea valor en la economía.' },
      { q: 'La transición del feudalismo al capitalismo estuvo signada por:', options: ['La entrega pacífica de parcelas comunales a los labriegos', 'La expulsión del campesinado y la privatización forzada de tierras comunales', 'La abolición de las fábricas urbanas', 'El desuso de barcos comerciales'], correct: 1, rationale: 'La violencia histórica despojó a las masas de la tierra obligándolas a acudir al mercado laboral.' },
      { q: 'El papel de la tecnología bajo la lógica del capital apunta prioritariamente a:', options: ['Reducir el esfuerzo humano para otorgarle más ocio libre', 'Aumentar la productividad del trabajo para elevar la extracción de plusvalía', 'Fomentar la armonía con la naturaleza', 'Crear obras de arte comunitarias'], correct: 1, rationale: 'La mecanización busca abaratar costos laborales y maximizar la tasa de plusvalía relativa.' },
      { q: 'La desalienación radical solo puede lograrse mediante:', options: ['El aumento caritativo de sueldos dentro del mismo sistema', 'La transformación revolucionaria y la colectivización de los medios productivos', 'Terapia psicológica individual', 'Campañas de concientización cívica pasiva'], correct: 1, rationale: 'Modificar solo el salario no suprime la enajenación; se requiere abolir la relación capitalista misma.' }
    ]
  },
  {
    id: 'schopenhauer',
    name: 'Arthur Schopenhauer',
    short: 'El péndulo y la voluntad',
    theme: 'from-amber-500/20 to-orange-950/30',
    image: '/philosophers/schopenhauer.png',
    accent: 'text-amber-300',
    video: 'zLvGW_vMzxQ',
    excerpt: 'Toda volición nace de una necesidad, de una carencia, es decir, de un sufrimiento... la vida oscila como un péndulo de derecha a izquierda, entre el dolor y el aburrimiento.',
    citation: 'El mundo como voluntad y representación, Libro IV, §56–57',
    takeaways: [
      'El deseo nace de la carencia y nunca se satisface de forma duradera.',
      'La contemplación desinteresada y el arte suspenden transitoriamente el péndulo del dolor.',
      'La compasión (Mitleid) supera el Velo de Maya reconociendo que todo sufrimiento comparte la misma raíz.'
    ],
    questions: [
      { q: '¿Qué es el mundo en su dimensión fenoménica para Schopenhauer?', options: ['Una mera representación subjetiva', 'La Voluntad en sí misma', 'Una creación divina perfecta', 'Materia inerte sin leyes'], correct: 0, rationale: 'El mundo que conocemos está mediado por las formas de la representación humana.' },
      { q: '¿Qué concepto define la esencia metafísica última de la realidad?', options: ['El Espíritu Absoluto', 'La Razón pura', 'La Voluntad ciega e insaciable', 'El Átomo material'], correct: 2, rationale: 'La Voluntad es el principio único que subyace a todos los seres y fenómenos del cosmos.' },
      { q: 'El "péndulo de la vida" oscila constantemente entre:', options: ['El bien y el mal', 'La razón y la locura', 'El dolor y el aburrimiento', 'El amor y el odio'], correct: 2, rationale: 'Saciada una necesidad surge el tedio; insatisfecha, el sufrimiento.' },
      { q: '¿Por qué Schopenhauer rechaza el suicidio como solución?', options: ['Porque es un delito civil', 'Porque afirma con desesperación el apego a la vida frustrada', 'Porque daña la economía', 'Porque está prohibido por los dogmas'], correct: 1, rationale: 'El suicida quiere vivir, solo rechaza las condiciones desdichadas que le tocaron.' },
      { q: '¿Qué arte ocupa la cúspide estética por expresar directamente la Voluntad?', options: ['La arquitectura', 'La pintura', 'La poesía', 'La música'], correct: 3, rationale: 'La música expresa la Voluntad de manera inmediata sin pasar por las Ideas intermedias.' },
      { q: '¿Qué fundamento tiene la compasión (Mitleid)?', options: ['El deber moral kantiano', 'Reconocer que el sufrimiento ajeno es idéntico al propio', 'El cálculo de placeres', 'El contrato social'], correct: 1, rationale: 'Supera el Velo de Maya identificando la misma esencia doliente en todo ser vivo.' }
    ]
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    short: 'Muerte de Dios y Zaratustra',
    theme: 'from-fuchsia-500/20 to-purple-950/30',
    image: '/philosophers/nietzsche.png',
    accent: 'text-fuchsia-300',
    video: 'VBBu-7xos0Y',
    excerpt: '¿Adónde fue Dios? ¡Nosotros lo hemos matado!... Cómo el espíritu se transforma en camello, el camello en león y el león en niño.',
    citation: 'La gaya ciencia, §125; Así habló Zaratustra',
    takeaways: [
      'La muerte de Dios es el derrumbe de los fundamentos metafísicos absolutos de Occidente.',
      'El león destruye el dogmático "Tú debes"; el niño inaugura el juego creador de nuevos valores.',
      'El Amor fati y el Eterno Retorno son la prueba suprema de afirmación radical de la vida terrenal.'
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
    video: 'v2hDEhQnCzA',
    excerpt: 'El ser humano no es un ser manso... Homo homini lupus: la cultura tiene que movilizarlo todo para poner límites a las pulsiones agresivas del hombre.',
    citation: 'El malestar en la cultura, Cap. II–III',
    takeaways: [
      'El Ello busca descarga inmediata por principio de placer; el Superyó juzga e impone culpa.',
      'El Yo media entre las exigencias pulsionales, los mandatos morales y la dura realidad.',
      'La sublimación canaliza la energía pulsional reprimida hacia la creación cultural y el saber.'
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
    video: 'ZrRSZsbLbvI',
    excerpt: 'El hombre empieza por existir... no hay naturaleza humana porque no hay Dios para concebirla. Estamos condenados a ser libres.',
    citation: 'El existencialismo es un humanismo',
    takeaways: [
      'La existencia precede a la esencia: somos únicamente aquello que nos hacemos mediante nuestros actos.',
      'La libertad es incondicional y conlleva la angustia de una responsabilidad total.',
      'La mala fe es la coartada de pretender ser una cosa inerte para evadir la angustia de elegir.'
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
    video: 'v9CK1aRifrU',
    excerpt: 'El efecto mayor del Panóptico es inducir en el detenido un estado consciente y permanente de visibilidad que garantiza el funcionamiento automático del poder.',
    citation: 'Vigilar y castigar, "El panoptismo"',
    takeaways: [
      'La disciplina distribuye meticulosamente los cuerpos, tiempos y espacios institucionales.',
      'El panóptico automatiza el poder haciendo que el propio vigilado interiorice la mirada normativa.',
      'El binomio Saber-Poder clasifica a la población entre lo normal y lo patológico.'
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
    const completed = Object.values(session.progreso).filter(p => p.testCompletado && p.juegoCompletado).length
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
    setAnswers({})
    setQuestions([])
  }

  // Extrae exactamente 20 preguntas aleatorias SIN REPETICIÓN del banco único de 40 preguntas
  const startQuiz = () => {
    if (!selected) return
    const shuffledUnique = shuffle([...selected.questions])
    setQuestions(shuffledUnique.slice(0, 20))
    setAnswers({})
    setPhase(1)
  }

  const finishQuiz = () => {
    if (!selected || !questions.length) return
    const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0)
    updateProgress({ testCompletado: true, puntajeTest: score }, score)
    setPhase(2) // Pasa al simulador inmersivo
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
              Un recorrido interactivo para convertir conceptos en decisiones, simulación social y pensamiento crítico.
            </p>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-400">
              <span className="flex items-center gap-2"><BookOpen className="size-4 text-amber-300" /> 6 autores</span>
              <span className="flex items-center gap-2"><CircleHelp className="size-4 text-amber-300" /> 20 preguntas sin repetición</span>
              <span className="flex items-center gap-2"><Trophy className="size-4 text-amber-300" /> Simuladores interactivos</span>
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
                className="w-full bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium"
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
              <p className="mt-3 max-w-xl text-stone-400">
                El recorrido te guía a través de la teoría, el cuestionario evaluativo sin repetición y la simulación inmersiva.
              </p>
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
              const status = (p.testCompletado && p.juegoCompletado)
                ? 'Completado'
                : p.teoriaCompletada || p.testCompletado
                ? 'En progreso'
                : 'Pendiente'
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
                        <p className="text-xs text-stone-500">Cuestionario</p>
                        <p className="mt-1 font-semibold text-stone-200">{p.puntajeTest}/20</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                        <p className="text-xs text-stone-500">Desafío Inmersivo</p>
                        <p className="mt-1 font-semibold text-stone-200">{p.juegoCompletado ? '10/10' : `${p.pasoJuegoActual - 1}/10`}</p>
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
              {phase === 0 ? 'Teoría' : phase === 1 ? 'Cuestionario Evaluativo (20 preguntas)' : phase === 2 ? 'Desafío Inmersivo' : 'Resultados'}
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
            <p className={`mb-2 text-sm font-medium ${selected.accent}`}>Módulo: {selected.name}</p>
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">{selected.name}</h1>
            <p className="mt-2 text-stone-400">{selected.short}</p>
          </div>
          <div className="hidden size-16 items-center justify-center rounded-2xl border border-stone-700 bg-stone-900 sm:flex">
            <BookOpen className="size-7 text-amber-300" />
          </div>
        </div>

        {/* Stepper: Teoría -> Cuestionario -> Desafío Inmersivo -> Resultados */}
        <div className="mb-10 grid grid-cols-4 gap-2">
          {['Teoría', 'Cuestionario', 'Desafío Inmersivo', 'Resultados'].map((label, i) => (
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

        {/* FASE 0: TEORÍA */}
        {phase === 0 && (
          <Theory
            author={selected}
            onStart={() => {
              updateProgress({ teoriaCompletada: true })
              startQuiz()
            }}
          />
        )}

        {/* FASE 1: CUESTIONARIO (20 PREGUNTAS ÚNICAS) */}
        {phase === 1 && (
          <Quiz questions={questions} answers={answers} setAnswers={setAnswers} onFinish={finishQuiz} />
        )}

        {/* FASE 2: DESAFÍO INMERSIVO ESTILO INHERITED INEQUALITY */}
        {phase === 2 && (
          selected.id === 'marx' ? (
            <MarxInheritedInequalityGame
              onComplete={() => {
                updateProgress({ juegoCompletado: true, puntajeJuego: 10, pasoJuegoActual: 10 })
                setPhase(3)
              }}
            />
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-4">
              <Trophy className="size-12 text-amber-300 mx-auto" />
              <h3 className="font-serif text-2xl text-stone-100">Desafío Inmersivo de {selected.name}</h3>
              <p className="text-sm text-stone-400 max-w-md mx-auto">
                Has completado la evaluación con {p.puntajeTest} aciertos sobre 20. El módulo se ha registrado con éxito.
              </p>
              <Button
                onClick={() => {
                  updateProgress({ juegoCompletado: true, puntajeJuego: 10, pasoJuegoActual: 10 })
                  setPhase(3)
                }}
                className="bg-amber-300 text-stone-950 hover:bg-amber-200"
              >
                Ver Resultados Finales <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          )
        )}

        {/* FASE 3: RESULTADOS */}
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
            <Volume2 className="size-4 text-amber-300" /> Dinámica del módulo:
          </p>
          Primero responderás las 20 preguntas aleatorias de evaluación y luego pasarás al simulador inmersivo interactivo.
        </div>

        <Button onClick={onStart} className="mt-auto h-13 justify-between bg-amber-300 px-6 text-stone-950 hover:bg-amber-200 font-medium">
          Pasar al Cuestionario de Evaluación (20 preguntas) <ArrowRight className="size-4" />
        </Button>
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
              Evaluación aleatoria · 20 preguntas sin repetición
            </Badge>
            <CardTitle className="mt-3 font-serif text-3xl">Cuestionario de pensamiento crítico</CardTitle>
            <CardDescription className="text-stone-400">
              Respondé el cuestionario completo para desbloquear el simulador inmersivo.
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
          Enviar Evaluación y Abrir Desafío Inmersivo <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// ----------------------------------------------------
// SIMULADOR INMERSIVO DE MARX: "DESIGUALDAD HEREDADA"
// ----------------------------------------------------
interface DecisionTurno {
  ronda: number
  ano: number
  evento: string
  contextoObrero: string
  contextoBurgues: string
  opcionesObrero: {
    texto: string
    impactoDinero: number
    impactoSalud: number
    impactoConciencia: number
    explicacionMarx: string
    conceptoClaveId: string
  }[]
}

const TURNOS_SIMULACION: DecisionTurno[] = [
  {
    ronda: 1,
    ano: 1845,
    evento: 'La Herencia de Cuna: Medios de Producción vs. Desposesión',
    contextoObrero: 'Naciste sin tierras ni talleres. Para sobrevivir, debes vender tu única propiedad: tu tiempo y tu fuerza muscular en el mercado.',
    contextoBurgues: 'Naciste con acciones en el ferrocarril y una fábrica textil heredada de tu familia. Tu patrimonio inicial es de $25.000.',
    opcionesObrero: [
      {
        texto: 'Aceptar un empleo fabril de 12 horas por un salario mínimo de subsistencia ($20/mes).',
        impactoDinero: 20,
        impactoSalud: -15,
        impactoConciencia: 10,
        explicacionMarx: 'Nace la relación capitalista: vendes tu Fuerza de Trabajo como una mercancía para poder alimentarte.',
        conceptoClaveId: 'fuerza_trabajo'
      },
      {
        texto: 'Negarte a trabajar alegando que mereces ser dueño de tu tiempo libre.',
        impactoDinero: -10,
        impactoSalud: -40,
        impactoConciencia: 20,
        explicacionMarx: 'Caes en el Ejército Industrial de Reserva: el hambre te disciplina rápidamente para aceptar cualquier empleo.',
        conceptoClaveId: 'ejercito_reserva'
      }
    ]
  },
  {
    ronda: 2,
    ano: 1848,
    evento: 'La Jornada Extenuante: Extracción de Plusvalía Absoluta',
    contextoObrero: 'El patrón alarga la jornada a 14 horas para ganar la competencia. Cobras el mismo jornal mientras tus pulmones aspiran polvo de algodón.',
    contextoBurgues: 'La ganancia de tu fábrica se dispara un 40% simplemente aumentando las horas de luz de las velas en el taller.',
    opcionesObrero: [
      {
        texto: 'Cumplir las 14 horas callado creyendo que el mérito personal te hará millonario.',
        impactoDinero: 20,
        impactoSalud: -25,
        impactoConciencia: -15,
        explicacionMarx: 'Falsa conciencia: la Plusvalía Absoluta no premia tu esfuerzo, solo engorda el capital constante y la riqueza ajena.',
        conceptoClaveId: 'plusvalia_absoluta'
      },
      {
        texto: 'Hablar con otros operarios al salir del turno sobre la injusticia de las horas no remuneradas.',
        impactoDinero: 20,
        impactoSalud: -20,
        impactoConciencia: 30,
        explicacionMarx: 'Comienzo de la organización obrera: descifras que el excedente generado después de las 4 horas de trabajo necesario es robado como plusvalía.',
        conceptoClaveId: 'trabajo_necesario_excedente'
      }
    ]
  },
  {
    ronda: 3,
    ano: 1852,
    evento: 'La Llegada del Telar a Vapor: Plusvalía Relativa y Alienación',
    contextoObrero: 'Llegan máquinas modernas. Ahora producís 10 veces más ropa por hora, pero tu salario se reduce porque tu tarea se volvió mecánica y reemplazable.',
    contextoBurgues: 'La tecnificación abarata tus costos y te permite duplicar tus exportaciones a las colonias.',
    opcionesObrero: [
      {
        texto: 'Trabajar más rápido adaptándote al ritmo de la máquina para no ser despedido.',
        impactoDinero: 15,
        impactoSalud: -20,
        impactoConciencia: -10,
        explicacionMarx: 'Alienación en el acto de trabajo: te conviertes en un mero apéndice de la máquina. La tecnología, en vez de liberarte, intensifica tu servidumbre.',
        conceptoClaveId: 'plusvalia_relativa'
      },
      {
        texto: 'Concientizar al taller de que el problema no es la máquina, sino quién es su dueño privado.',
        impactoDinero: 15,
        impactoSalud: -10,
        impactoConciencia: 40,
        explicacionMarx: 'Superación del ludismo ingenuo: la técnica emancipa solo cuando se socializa su propiedad y su beneficio.',
        conceptoClaveId: 'alienacion_tecnica'
      }
    ]
  },
  {
    ronda: 4,
    ano: 1860,
    evento: 'El Mercado y el Fetichismo: La Mercancía que te Domina',
    contextoObrero: 'Pasás frente a las vidrieras del centro. Un traje confeccionado por tus manos cuesta $300; tu sueldo no alcanza ni para comprar un botón.',
    contextoBurgues: 'Tus tiendas venden miles de prendas. El público cree que el valor proviene de la marca y de los precios mágicos del mercado.',
    opcionesObrero: [
      {
        texto: 'Endeudarte a tasas usurarias para comprarte un traje y aparentar estatus burgués.',
        impactoDinero: -50,
        impactoSalud: -15,
        impactoConciencia: -30,
        explicacionMarx: 'Fetichismo de la mercancía: las cosas materiales cobran vida propia y dominan las mentes de quienes las produjeron.',
        conceptoClaveId: 'fetichismo'
      },
      {
        texto: 'Explicar a tu comunidad que detrás de cada precio de mercado hay sangre y sudor no pagado.',
        impactoDinero: 10,
        impactoSalud: -5,
        impactoConciencia: 50,
        explicacionMarx: 'Desmitificación dialéctica: el valor no surge del mercado abstracto sino del trabajo abstracto humano cristalizado.',
        conceptoClaveId: 'valor_trabajo'
      }
    ]
  },
  {
    ronda: 5,
    ano: 1871,
    evento: 'La Gran Contradicción: Huelga General y la Comuna',
    contextoObrero: 'La fábrica entra en crisis de sobreproducción. El patrón anuncia un recorte salarial del 50% y despidos masivos.',
    contextoBurgues: 'El Estado envía a la policía para custodiar tus galpones y disolver asambleas ilegales.',
    opcionesObrero: [
      {
        texto: 'Rogar compasión individual al patrón prometiendo no volver a quejarte nunca.',
        impactoDinero: 5,
        impactoSalud: -30,
        impactoConciencia: -40,
        explicacionMarx: 'Permaneces atrapado en la condición de Clase en Sí: una masa dividida y derrotada sin porvenir.',
        conceptoClaveId: 'clase_en_si'
      },
      {
        texto: 'Pagar el precio de la lucha: unirte a la Huelga General y tomar el control colectivo de la fábrica.',
        impactoDinero: 100,
        impactoSalud: 30,
        impactoConciencia: 100,
        explicacionMarx: '¡Victoria histórica! Nacimiento de la Clase para Sí: los trabajadores asumen la propiedad social de los medios de producción.',
        conceptoClaveId: 'clase_para_si'
      }
    ]
  }
]

function MarxInheritedInequalityGame({ onComplete }: { onComplete?: () => void }) {
  const [fullscreen, setFullscreen] = useState(false)
  const [rondaActual, setRondaActual] = useState(0)

  // Medidores del jugador proletario
  const [dineroObrero, setDineroObrero] = useState(25)
  const [saludObrero, setSaludObrero] = useState(85)
  const [concienciaClase, setConcienciaClase] = useState(10)

  // Medidores acumulados del capitalista (automáticos)
  const [capitalBurgues, setCapitalBurgues] = useState(25000)

  // Control de modales explicativos profundos
  const [modalConcepto, setModalConcepto] = useState<{ titulo: string; explicacion: string; cita: string } | null>(null)
  const [conceptosVistos, setConceptosVistos] = useState<string[]>([])
  const [juegoTerminado, setJuegoTerminado] = useState(false)

  const turno = TURNOS_SIMULACION[rondaActual]

  const tomarDecision = (opc: typeof TURNOS_SIMULACION[0]['opcionesObrero'][0]) => {
    // Aplicar consecuencias
    setDineroObrero(prev => prev + opc.impactoDinero)
    setSaludObrero(prev => Math.max(5, Math.min(100, prev + opc.impactoSalud)))
    setConcienciaClase(prev => Math.max(0, Math.min(100, prev + opc.impactoConciencia)))

    // El capitalista se enriquece automáticamente por la estructura
    setCapitalBurgues(prev => prev + (rondaActual + 1) * 12500)

    // Mostrar modal explicativo profundo si no se vio
    if (!conceptosVistos.includes(opc.conceptoClaveId)) {
      setConceptosVistos(prev => [...prev, opc.conceptoClaveId])
      setModalConcepto({
        titulo: `Concepto Desbloqueado: ${opc.texto}`,
        explicacion: opc.explicacionMarx,
        cita: '«No es la conciencia del hombre la que determina su ser, sino, por el contrario, el ser social es lo que determina su conciencia.» — Prólogo a la Contribución a la Crítica de la Economía Política'
      })
    }

    // Avanzar turno o terminar
    if (rondaActual < TURNOS_SIMULACION.length - 1) {
      setRondaActual(prev => prev + 1)
    } else {
      setJuegoTerminado(true)
    }
  }

  const reiniciarSimulacion = () => {
    setRondaActual(0)
    setDineroObrero(25)
    setSaludObrero(85)
    setConcienciaClase(10)
    setCapitalBurgues(25000)
    setJuegoTerminado(false)
  }

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-stone-950 p-6 lg:p-10 flex flex-col justify-between'
          : 'relative bg-stone-950 border border-stone-800 rounded-3xl p-6 lg:p-8 text-stone-100 shadow-2xl space-y-6'
      }
    >
      {/* Encabezado y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-950/70 text-red-300 border-red-800/60">
              <Factory className="size-3.5 mr-1" /> Simulador: Desigualdad Heredada (Estilo Inherited Inequality)
            </Badge>
            <span className="text-xs text-stone-500 font-mono">Londres · {turno ? turno.ano : '1871'}</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 mt-1.5">
            {juegoTerminado ? 'Resolución Histórica del Conflicto de Clases' : turno.evento}
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mt-1">
            Comprobá en tiempo real cómo la estructura material de clases condiciona tu vida antes de cualquier decisión personal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFullscreen(!fullscreen)}
            className="border-stone-700 bg-stone-900 text-stone-300 hover:text-white"
          >
            {fullscreen ? (
              <>
                <Minimize2 className="size-4 mr-1.5" /> Salir de Pantalla Completa
              </>
            ) : (
              <>
                <Maximize2 className="size-4 mr-1.5" /> Pantalla Completa
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={reiniciarSimulacion}
            className="text-stone-400 hover:text-white"
          >
            <RotateCcw className="size-4 mr-1.5" /> Reiniciar
          </Button>
        </div>
      </div>

      {/* COMPARATIVA DUAL: CUNA PROLETARIA VS. CUNA BURGUESA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tu Personaje: Proletario */}
        <div className="bg-stone-900/60 border-2 border-amber-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <Users className="size-4" /> Tu Vida: Proletario Desposeído
            </span>
            <span className="text-[10px] font-mono uppercase bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded">
              Solo vende fuerza de trabajo
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed italic">
            "{turno?.contextoObrero}"
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="bg-black/30 p-2.5 rounded-xl border border-stone-800">
              <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                <Coins className="size-3 text-amber-300" /> Ahorro Real
              </div>
              <p className="text-base font-mono font-bold text-stone-100 mt-1">${dineroObrero}</p>
            </div>

            <div className="bg-black/30 p-2.5 rounded-xl border border-stone-800">
              <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                <Heart className="size-3 text-rose-400" /> Salud / Vida
              </div>
              <p className="text-base font-mono font-bold text-rose-300 mt-1">{saludObrero}%</p>
            </div>

            <div className="bg-black/30 p-2.5 rounded-xl border border-stone-800">
              <div className="flex items-center gap-1 text-stone-400 text-[10px]">
                <Briefcase className="size-3 text-sky-400" /> Conciencia
              </div>
              <p className="text-base font-mono font-bold text-sky-300 mt-1">{concienciaClase}%</p>
            </div>
          </div>
        </div>

        {/* El Otro: Burgués Dueño de Medios */}
        <div className="bg-stone-900/30 border border-stone-800/80 rounded-2xl p-5 space-y-4 opacity-90">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-bold text-stone-300 text-sm flex items-center gap-1.5">
              <Home className="size-4 text-emerald-400" /> Clase Burguesa: Dueño de Medios
            </span>
            <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">
              Apropia plusvalía
            </span>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed italic">
            "{turno?.contextoBurgues}"
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div className="bg-black/30 p-2.5 rounded-xl border border-stone-800">
              <span className="text-stone-500 text-[10px]">Patrimonio Acumulado</span>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-1">${capitalBurgues.toLocaleString('es-AR')}</p>
            </div>

            <div className="bg-black/30 p-2.5 rounded-xl border border-stone-800">
              <span className="text-stone-500 text-[10px]">Garantía Estatal</span>
              <p className="text-sm font-mono font-bold text-stone-300 mt-1">Cortes y Policía a favor</p>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE DECISIÓN Y EXPLICACIÓN FILOSÓFICA */}
      {!juegoTerminado && turno && (
        <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Dilema del Turno {turno.ronda} de 5
            </span>
            <span className="text-xs text-stone-500">¿Qué camino elegís ante la presión del sistema?</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {turno.opcionesObrero.map((opc, i) => (
              <button
                key={i}
                onClick={() => tomarDecision(opc)}
                className="w-full text-left p-4 rounded-xl border border-stone-800 bg-stone-900/60 hover:border-amber-400/60 hover:bg-stone-900 transition flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-800 text-xs font-mono font-bold group-hover:bg-amber-300 group-hover:text-stone-950 transition">
                    0{i + 1}
                  </span>
                  <p className="text-sm text-stone-200 leading-snug">{opc.texto}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/60 text-[11px] text-stone-500 font-mono">
                  <span>Dinero: {opc.impactoDinero >= 0 ? `+$${opc.impactoDinero}` : `-$${Math.abs(opc.impactoDinero)}`}</span>
                  <span>·</span>
                  <span>Salud: {opc.impactoSalud >= 0 ? `+${opc.impactoSalud}%` : `${opc.impactoSalud}%`}</span>
                  <span>·</span>
                  <span>Conciencia: {opc.impactoConciencia >= 0 ? `+${opc.impactoConciencia}%` : `${opc.impactoConciencia}%`}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ESTADO FINAL: LECCIÓN APRENDIDA */}
      {juegoTerminado && (
        <div className="bg-emerald-950/40 border-2 border-emerald-500/70 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 text-stone-950 rounded-2xl">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <Badge className="bg-emerald-500 text-stone-950 font-bold">SIMULACIÓN COMPLETADA (10/10)</Badge>
              <h3 className="text-2xl font-bold font-serif text-emerald-200 mt-1">
                Conclusión Dialéctica: El Esfuerzo no Vence a la Estructura
              </h3>
            </div>
          </div>

          <div className="text-sm text-stone-300 space-y-3 leading-relaxed">
            <p>
              Durante 5 generaciones se demostró la tesis de Karl Marx: <strong>la desigualdad de cuna en el capitalismo no se revuelve por mérito individual</strong>. Mientras el obrero gastaba su salud para ganar $20, el dueño de los medios multiplicaba su fortuna sin mover una máquina, simplemente extrayendo el trabajo vivo ajeno.
            </p>
            <p className="p-4 bg-black/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 italic">
              «Los filósofos no han hecho más que interpretar de diversos modos el mundo, pero de lo que se trata es de transformarlo.» — Tesis XI sobre Feuerbach
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                if (fullscreen) setFullscreen(false)
                if (onComplete) onComplete()
              }}
              className="bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium px-8 py-6 rounded-2xl text-sm"
            >
              Ver Resultados Finales del Módulo de Karl Marx <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* MODAL EMERGENTE EXPLICATIVO (APARECE CON CADA DECISIÓN) */}
      {modalConcepto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border-2 border-red-500/80 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <Badge className="bg-red-600 text-white">Concepto Materialista Revelado</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalConcepto(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="size-5" />
              </Button>
            </div>

            <h3 className="text-xl font-serif font-bold text-red-200">
              {modalConcepto.titulo}
            </h3>

            <p className="text-sm text-stone-300 leading-relaxed">
              {modalConcepto.explicacion}
            </p>

            <blockquote className="border-l-2 border-red-400/60 pl-4 py-2 bg-black/40 rounded-r text-xs text-stone-400 italic">
              {modalConcepto.cita}
            </blockquote>

            <Button
              onClick={() => setModalConcepto(null)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl py-2.5"
            >
              Comprendido, continuar la simulación
            </Button>
          </div>
        </div>
      )}
    </div>
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
            {author.questions.slice(0, 6).map((q) => (
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
