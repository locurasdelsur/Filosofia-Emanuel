'use client'

import React, { useState, useEffect } from 'react'
import {
  Factory,
  Users,
  Clock,
  TrendingUp,
  Cpu,
  AlertTriangle,
  Flame,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  BookOpen,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface MarxTycoonProps {
  onComplete?: () => void
}

interface ConceptoModal {
  id: string
  titulo: string
  definicion: string
  cita: string
}

const CONCEPTOS_TEORICOS: Record<string, ConceptoModal> = {
  fuerza_trabajo: {
    id: 'fuerza_trabajo',
    titulo: 'La Mercancía Fuerza de Trabajo',
    definicion: 'Bajo el capitalismo, el trabajador no vende su persona ni su trabajo acabado, sino su capacidad de trabajar durante un tiempo determinado. Es la única mercancía viva que crea más valor del que cuesta reproducirla.',
    cita: '«Para extraer valor del consumo de una mercancía, nuestro poseedor de dinero tendría que ser tan afortunado como para descubrir en el mercado una mercancía cuyo valor de uso poseyera la peculiar propiedad de ser fuente de valor.» — El Capital'
  },
  d_m_d: {
    id: 'd_m_d',
    titulo: 'Fórmula General del Capital (D - M - D\')',
    definicion: 'A diferencia del intercambio simple (M - D - M) donde se vende para comprar un bien útil, el capitalista adelanta Dinero (D) para comprar Mercancías (M) y obtener al final una suma de Dinero acrecentada (D\'). Esa diferencia es la plusvalía.',
    cita: '«La circulación simple de mercancías tiene como fin el valor de uso; la circulación del dinero como capital lleva en sí misma su propio fin: la valorización incesante del valor.» — El Capital'
  },
  plusvalia_absoluta: {
    id: 'plusvalia_absoluta',
    titulo: 'Plusvalía Absoluta',
    definicion: 'Se obtiene prolongando la duración de la jornada laboral más allá del tiempo de trabajo necesario para pagar el salario del obrero. Todo minuto extra de trabajo forzado pasa a engrosar la ganancia patronal.',
    cita: '«La prolongación de la jornada de trabajo más allá del punto en que el obrero produce el equivalente del valor de su fuerza de trabajo es la producción de plusvalía absoluta.» — El Capital'
  },
  plusvalia_relativa: {
    id: 'plusvalia_relativa',
    titulo: 'Plusvalía Relativa y Maquinaria',
    definicion: 'Se logra aumentando la productividad técnica del trabajo mediante máquinas e innovaciones. Al producirse bienes más rápido, disminuye el tiempo de trabajo socialmente necesario para reproducir la vida del obrero, aumentando el excedente.',
    cita: '«La maquinaria no tiene como objetivo acortar la jornada laboral del obrero; es un medio para abreviar el tiempo de trabajo necesario para producir una mercancía.» — El Capital'
  },
  alienacion_producto: {
    id: 'alienacion_producto',
    titulo: 'Alienación respecto al Producto',
    definicion: 'El objeto fabricado con las manos del trabajador no le pertenece; se le enfrenta como un poder hostil, extraño e inalcanzable para su propio bolsillo.',
    cita: '«El trabajador se vuelve tanto más pobre cuanta más riqueza produce... La desvalorización del mundo humano crece en razón directa del aumento de valor del mundo de las cosas.» — Manuscritos de 1844'
  },
  huelga_clase_para_si: {
    id: 'huelga_clase_para_si',
    titulo: 'De "Clase en Sí" a "Clase para Sí"',
    definicion: 'Mientras los trabajadores compiten aislados entre sí, son solo una clase en sí (objeto pasivo de explotación). Al unirse y reconocer sus intereses históricos comunes frente al capital, se transforman en una clase para sí, sujeto consciente de su emancipación.',
    cita: '«Esta masa es ya una clase frente al capital, pero no todavía para sí misma. En la lucha, esta masa se une y se constituye como clase para sí.» — Miseria de la Filosofía'
  }
}

export default function MarxTycoonGame({ onComplete }: MarxTycoonProps) {
  // Modo pantalla completa
  const [fullscreen, setFullscreen] = useState(false)

  // Variables económicas
  const [capital, setCapital] = useState(1200)
  const [obreros, setObreros] = useState(6)
  const [jornadaHoras, setJornadaHoras] = useState(10)
  const [nivelMaquinaria, setNivelMaquinaria] = useState(1)
  const [mercanciasStock, setMercanciasStock] = useState(0)
  const [plusvaliaAcumulada, setPlusvaliaAcumulada] = useState(0)
  const [nivelAlienacion, setNivelAlienacion] = useState(20)
  const [tensionSocial, setTensionSocial] = useState(15)

  // Estados de victoria y fin de juego
  const [huelgaDeclarada, setHuelgaDeclarada] = useState(false)
  const [fabricaSocializada, setFabricaSocializada] = useState(false)

  // Control de ventanas emergentes (solo una vez por concepto)
  const [conceptosMostrados, setConceptosMostrados] = useState<string[]>([])
  const [modalActivo, setModalActivo] = useState<ConceptoModal | null>(null)

  const dispararConcepto = (clave: string) => {
    if (!conceptosMostrados.includes(clave) && CONCEPTOS_TEORICOS[clave]) {
      setConceptosMostrados(prev => [...prev, clave])
      setModalActivo(CONCEPTOS_TEORICOS[clave])
    }
  }

  // Disparar el primer concepto al montar el juego
  useEffect(() => {
    dispararConcepto('fuerza_trabajo')
  }, [])

  const precioVentaCamisa = 15

  // Motor del ciclo productivo
  useEffect(() => {
    if (huelgaDeclarada || fabricaSocializada) return

    const interval = setInterval(() => {
      const factorProd = (jornadaHoras / 10) * nivelMaquinaria
      const nuevasCamisas = Math.round(obreros * factorProd * 0.5)

      setMercanciasStock(prev => prev + nuevasCamisas)

      const valorGenerado = nuevasCamisas * precioVentaCamisa
      const costoLaboral = obreros * 4
      const plusvaliaCiclo = Math.max(0, valorGenerado - costoLaboral)
      setPlusvaliaAcumulada(prev => prev + plusvaliaCiclo)

      // Crecimiento de Alienación
      setNivelAlienacion(prev => {
        const nuevo = Math.min(100, prev + (jornadaHoras > 10 ? 1.5 : 0.4))
        if (nuevo >= 55) {
          dispararConcepto('alienacion_producto')
        }
        return nuevo
      })

      // Crecimiento de Tensión hacia la huelga
      setTensionSocial(prev => {
        const incremento = jornadaHoras > 12 ? 3.5 : jornadaHoras > 10 ? 1.8 : 0.5
        const nuevaTension = prev + incremento
        if (nuevaTension >= 100) {
          setHuelgaDeclarada(true)
          dispararConcepto('huelga_clase_para_si')
          return 100
        }
        return nuevaTension
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [obreros, jornadaHoras, nivelMaquinaria, huelgaDeclarada, fabricaSocializada, conceptosMostrados])

  // Venta en mercado
  const venderMercancias = () => {
    if (mercanciasStock <= 0) return
    const ingreso = mercanciasStock * precioVentaCamisa
    setCapital(prev => prev + ingreso)
    setMercanciasStock(0)
    dispararConcepto('d_m_d')
  }

  // Plusvalía Absoluta
  const aumentarJornada = () => {
    if (jornadaHoras >= 16) return
    setJornadaHoras(prev => prev + 2)
    setTensionSocial(prev => Math.min(100, prev + 18))
    setNivelAlienacion(prev => Math.min(100, prev + 15))
    dispararConcepto('plusvalia_absoluta')
  }

  // Plusvalía Relativa
  const comprarMaquinaria = () => {
    const costo = 500 * nivelMaquinaria
    if (capital < costo) return
    setCapital(prev => prev - costo)
    setNivelMaquinaria(prev => prev + 1)
    setNivelAlienacion(prev => Math.min(100, prev + 10))
    dispararConcepto('plusvalia_relativa')
  }

  // Contratar obreros
  const contratarObrero = () => {
    if (capital < 100) return
    setCapital(prev => prev - 100)
    setObreros(prev => prev + 2)
  }

  // Fin del juego: Socialización
  const resolverHuelga = () => {
    setFabricaSocializada(true)
    setHuelgaDeclarada(false)
    setNivelAlienacion(0)
    setTensionSocial(0)
  }

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 overflow-y-auto bg-stone-950 p-6 lg:p-10 flex flex-col justify-between'
          : 'relative bg-stone-950 border border-stone-800 rounded-3xl p-6 lg:p-8 text-stone-100 shadow-2xl space-y-6'
      }
    >
      {/* Barra superior y botón de Pantalla Completa */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-950/70 text-red-300 border-red-800/60">
              <Factory className="size-3.5 mr-1" /> Simulador Histórico: Karl Marx
            </Badge>
            <span className="text-xs text-stone-500 font-mono">Londres · Siglo XIX</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 mt-1.5">
            Fábrica Textil: El Engranaje del Capital
          </h2>
          <p className="text-xs text-stone-400 max-w-xl mt-1">
            Administrá la producción. Cada decisión que tomes para sostener la ganancia revelará una contradicción material inevitable.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
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

          <div className="bg-stone-900 border border-stone-800 rounded-2xl px-5 py-2.5 text-right">
            <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Capital Acumulado (D)</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 flex items-center justify-end">
              <DollarSign className="size-5 inline" />{capital.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas Económicas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Fuerza de Trabajo</span>
            <Users className="size-4 text-sky-400" />
          </div>
          <p className="text-xl font-bold font-mono text-stone-100">{obreros} operarios</p>
          <span className="text-[10px] text-stone-500">Salario fijo de subsistencia</span>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Jornada Laboral</span>
            <Clock className="size-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-stone-100">{jornadaHoras} hs / día</p>
          <span className="text-[10px] text-stone-500">{jornadaHoras > 10 ? 'Tiempo excedente forzado' : 'Jornada base'}</span>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Stock de Mercancías</span>
            <Package className="size-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold font-mono text-stone-100">{mercanciasStock} prendas</p>
          <span className="text-[10px] text-stone-500">Precio mercado: ${precioVentaCamisa} c/u</span>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Plusvalía Extraída</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-300">${plusvaliaAcumulada.toLocaleString('es-AR')}</p>
          <span className="text-[10px] text-stone-500">Trabajo excedente no remunerado</span>
        </div>
      </div>

      {/* Medidores Dialécticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/40 border border-stone-800/80 rounded-2xl p-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Layers className="size-3.5" /> Nivel de Alienación de los Trabajadores
            </span>
            <span className="font-mono text-stone-400">{Math.round(nivelAlienacion)}%</span>
          </div>
          <Progress value={nivelAlienacion} className="h-2 bg-stone-800" />
          <p className="text-[11px] text-stone-500">
            {nivelAlienacion > 50
              ? 'El producto se enfrenta al operario como un poder hostil e independiente.'
              : 'El trabajo rutinario despoja al ser humano de su actividad libre y creativa.'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-red-400">
              <Flame className="size-3.5" /> Tensión Social (Camino a la Huelga General)
            </span>
            <span className="font-mono text-stone-400">{Math.round(tensionSocial)}%</span>
          </div>
          <Progress value={tensionSocial} className="h-2 bg-stone-800" />
          <p className="text-[11px] text-stone-500">
            {tensionSocial >= 80
              ? '¡Asambleas obreras en marcha! Se avecina la paralización de las máquinas.'
              : 'Descontento acumulado bajo la disciplina fabril.'}
          </p>
        </div>
      </div>

      {/* Botones de Acción */}
      {!huelgaDeclarada && !fabricaSocializada && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
            Decisiones de Acumulación Capitalista:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={venderMercancias}
              disabled={mercanciasStock <= 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs h-auto py-3.5 px-4 flex flex-col items-start gap-1 rounded-2xl text-left"
            >
              <span className="font-bold flex items-center gap-1.5">
                <DollarSign className="size-4" /> Vender Mercancías (D - M - D')
              </span>
              <span className="text-[10px] text-emerald-100/80 font-normal">
                Realizar valor de {mercanciasStock} prendas
              </span>
            </Button>

            <Button
              onClick={aumentarJornada}
              disabled={jornadaHoras >= 16}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs h-auto py-3.5 px-4 flex flex-col items-start gap-1 rounded-2xl text-left"
            >
              <span className="font-bold flex items-center gap-1.5">
                <Clock className="size-4" /> Plusvalía Absoluta (+2 hs)
              </span>
              <span className="text-[10px] text-amber-100/80 font-normal">
                Alargar la jornada sin subir sueldo
              </span>
            </Button>

            <Button
              onClick={comprarMaquinaria}
              disabled={capital < 500 * nivelMaquinaria}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs h-auto py-3.5 px-4 flex flex-col items-start gap-1 rounded-2xl text-left"
            >
              <span className="font-bold flex items-center gap-1.5">
                <Cpu className="size-4" /> Plusvalía Relativa (${500 * nivelMaquinaria})
              </span>
              <span className="text-[10px] text-sky-100/80 font-normal">
                Comprar telares a vapor
              </span>
            </Button>

            <Button
              onClick={contratarObrero}
              disabled={capital < 100}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs h-auto py-3.5 px-4 flex flex-col items-start gap-1 rounded-2xl text-left"
            >
              <span className="font-bold flex items-center gap-1.5">
                <Users className="size-4" /> Contratar 2 Obreros ($100)
              </span>
              <span className="text-[10px] text-stone-400 font-normal">
                Comprar más fuerza de trabajo
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Condición de Fin 1: Estallido de Huelga */}
      {huelgaDeclarada && !fabricaSocializada && (
        <div className="bg-red-950/40 border-2 border-red-500/70 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-2xl">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <Badge className="bg-red-600 text-white">¡CONTRADICCIÓN ANTAGÓNICA EXPLOTADA!</Badge>
              <h3 className="text-xl font-bold font-serif text-red-200 mt-1">
                Huelga General: Las Máquinas se Detuvieron
              </h3>
            </div>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            La extracción insaciable de plusvalía colapsó la paciencia del taller. Los obreros rompieron la competencia individual y conformaron una <strong>Clase para Sí</strong>. Ya no piden migajas: exigen la gestión colectiva de la producción.
          </p>
          <Button
            onClick={resolverHuelga}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-6 rounded-2xl text-sm"
          >
            Aceptar la Socialización: Cooperativa de Productores Libres
          </Button>
        </div>
      )}

      {/* Condición de Fin 2: Victoria / Emancipación */}
      {fabricaSocializada && (
        <div className="bg-emerald-950/40 border-2 border-emerald-500/70 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 text-stone-950 rounded-2xl">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <Badge className="bg-emerald-500 text-stone-950 font-bold">DESAFÍO COMPLETADO (10/10)</Badge>
              <h3 className="text-2xl font-bold font-serif text-emerald-200 mt-1">
                Producción Socializada y Trabajo Emancipado
              </h3>
            </div>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            Se ha abolido la apropiación privada del excedente. El trabajo deja de ser una mercancía sacrificada para el lucro ajeno: las máquinas ahora reducen la fatiga humana y amplían el tiempo libre de toda la sociedad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              onClick={() => {
                if (fullscreen) setFullscreen(false)
                if (onComplete) onComplete()
              }}
              className="bg-amber-300 text-stone-950 hover:bg-amber-200 font-medium px-8 py-6 rounded-2xl text-sm"
            >
              Pasar al Cuestionario Evaluativo (20 Preguntas) <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Registro de Conceptos Descubiertos */}
      <div className="border-t border-stone-800/80 pt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-stone-400 font-semibold mr-1">Conceptos integrados:</span>
        {conceptosMostrados.map(key => (
          <Badge
            key={key}
            variant="outline"
            onClick={() => setModalActivo(CONCEPTOS_TEORICOS[key])}
            className="cursor-pointer border-red-500/40 bg-red-950/20 text-red-300 hover:bg-red-900/40 text-xs py-1 px-2.5 transition"
          >
            <BookOpen className="size-3 mr-1" /> {CONCEPTOS_TEORICOS[key]?.titulo}
          </Badge>
        ))}
      </div>

      {/* Ventana Emergente (Modal de Concepto Filosófico) */}
      {modalActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-stone-900 border-2 border-red-500/60 rounded-3xl max-w-lg w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <Badge className="bg-red-600 text-white">Concepto Clave Revelado</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalActivo(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="size-5" />
              </Button>
            </div>

            <h3 className="text-xl font-serif font-bold text-red-200">
              {modalActivo.titulo}
            </h3>

            <p className="text-sm text-stone-300 leading-relaxed">
              {modalActivo.definicion}
            </p>

            <blockquote className="border-l-2 border-red-400/60 pl-4 py-2 bg-black/30 rounded-r text-xs text-stone-400 italic">
              {modalActivo.cita}
            </blockquote>

            <Button
              onClick={() => setModalActivo(null)}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl py-2.5"
            >
              Comprendido, continuar el simulador
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
