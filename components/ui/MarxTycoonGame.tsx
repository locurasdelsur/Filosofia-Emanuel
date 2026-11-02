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
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface MarxTycoonProps {
  onComplete?: () => void
}

export default function MarxTycoonGame({ onComplete }: MarxTycoonProps) {
  // Variables económicas y dialécticas
  const [capital, setCapital] = useState(1200) // Dinero disponible ($)
  const [obreros, setObreros] = useState(6) // Fuerza de trabajo contratada
  const [jornadaHoras, setJornadaHoras] = useState(10) // Horas por día
  const [nivelMaquinaria, setNivelMaquinaria] = useState(1) // Capital constante (tecnología)
  const [camisasProducidas, setCamisasProducidas] = useState(0)
  const [mercanciasStock, setMercanciasStock] = useState(0)
  
  // Medidores filosóficos
  const [plusvaliaAcumulada, setPlusvaliaAcumulada] = useState(0)
  const [nivelAlienacion, setNivelAlienacion] = useState(20) // 0 a 100%
  const [tensionSocial, setTensionSocial] = useState(15) // Tensión hacia la huelga (0 a 100%)
  const [concienciaDeClase, setConcienciaDeClase] = useState(false)
  const [huelgaDeclarada, setHuelgaDeclarada] = useState(false)
  const [fabricaSocializada, setFabricaSocializada] = useState(false)

  // Registro conceptual descubierto
  const [conceptosDesbloqueados, setConceptosDesbloqueados] = useState<string[]>([
    'Mercancía Fuerza de Trabajo'
  ])

  // Desbloqueo dinámico de conceptos según acciones
  const registrarConcepto = (nombre: string) => {
    if (!conceptosDesbloqueados.includes(nombre)) {
      setConceptosDesbloqueados(prev => [...prev, nombre])
    }
  }

  // Costo diario de salario por obrero ($40 fijos = costo de subsistencia)
  const salarioPorObrero = 40
  // Valor que produce cada obrero en una jornada de 10 hs base = 2 camisas/hora = 20 camisas
  const precioVentaCamisa = 15

  // Ciclo de producción (Tic de la fábrica)
  useEffect(() => {
    if (huelgaDeclarada || fabricaSocializada) return

    const interval = setInterval(() => {
      // Producción por segundo basada en obreros, jornada y maquinaria
      const factorProd = (jornadaHoras / 10) * nivelMaquinaria
      const nuevasCamisas = Math.round(obreros * factorProd * 0.5)
      
      setMercanciasStock(prev => prev + nuevasCamisas)
      setCamisasProducidas(prev => prev + nuevasCamisas)

      // Cálculo de plusvalía (Valor producido en camisas - Salarios pagados)
      const valorGenerado = nuevasCamisas * precioVentaCamisa
      const costoLaboral = obreros * 4
      const plusvaliaCiclo = Math.max(0, valorGenerado - costoLaboral)
      setPlusvaliaAcumulada(prev => prev + plusvaliaCiclo)

      // Crecimiento pasivo de la alienación y tensión
      setNivelAlienacion(prev => Math.min(100, prev + (jornadaHoras > 10 ? 1.5 : 0.4)))
      setTensionSocial(prev => {
        const aumento = (jornadaHoras > 12 ? 3 : jornadaHoras > 10 ? 1.5 : 0.5)
        const nuevaTension = prev + aumento
        if (nuevaTension >= 85) {
          registrarConcepto('Conflicto y Lucha de Clases')
        }
        if (nuevaTension >= 100) {
          setHuelgaDeclarada(true)
          registrarConcepto('Paso de Clase en Sí a Clase para Sí')
        }
        return Math.min(100, nuevaTension)
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [obreros, jornadaHoras, nivelMaquinaria, huelgaDeclarada, fabricaSocializada])

  // Acción 1: Vender las mercancías en el mercado (D - M - D')
  const venderMercancias = () => {
    if (mercanciasStock <= 0) return
    const ingreso = mercanciasStock * precioVentaCamisa
    setCapital(prev => prev + ingreso)
    setMercanciasStock(0)
    registrarConcepto('Fórmula del Capital: D - M - D\'')
    if (capital > 2500) {
      registrarConcepto('Fetichismo de la Mercancía')
    }
  }

  // Acción 2: Plusvalía Absoluta (Aumentar horas de trabajo)
  const aumentarJornada = () => {
    if (jornadaHoras >= 16) return
    setJornadaHoras(prev => prev + 2)
    setTensionSocial(prev => Math.min(100, prev + 18))
    setNivelAlienacion(prev => Math.min(100, prev + 15))
    registrarConcepto('Plusvalía Absoluta (Extensión de Jornada)')
  }

  // Acción 3: Plusvalía Relativa (Comprar telar a vapor)
  const comprarMaquinaria = () => {
    const costoTelar = 500 * nivelMaquinaria
    if (capital < costoTelar) return
    setCapital(prev => prev - costoTelar)
    setNivelMaquinaria(prev => prev + 1)
    setNivelAlienacion(prev => Math.min(100, prev + 12))
    registrarConcepto('Plusvalía Relativa y Composición Orgánica del Capital')
  }

  // Acción 4: Contratar más fuerza de trabajo
  const contratarObrero = () => {
    if (capital < 100) return
    setCapital(prev => prev - 100)
    setObreros(prev => prev + 2)
  }

  // Desenlace Emancipatorio: Socializar los medios de producción
  const resolverConflictoColectivo = () => {
    setFabricaSocializada(true)
    setHuelgaDeclarada(false)
    setConcienciaDeClase(true)
    setNivelAlienacion(0)
    setTensionSocial(0)
    registrarConcepto('Abolición de la Propiedad Privada de los Medios')
    if (onComplete) onComplete()
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 lg:p-8 text-zinc-100 shadow-2xl space-y-6">
      
      {/* Encabezado y Contexto */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-950/60 text-red-400 border-red-800/50">
              <Factory className="size-3.5 mr-1" /> Simulador Histórico-Materialista
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">Londres, Siglo XIX</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-zinc-100 mt-1">
            Fábrica Textil: El Engranaje del Capital
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl mt-1">
            Gestioná la producción textil y descubrí en tiempo real cómo las leyes de acumulación capitalista generan contradicciones insolubles.
          </p>
        </div>

        {/* Capital disponible */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl px-5 py-3 text-right">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Capital Acumulado (D)</p>
          <p className="text-2xl font-mono font-bold text-emerald-400 flex items-center justify-end">
            <DollarSign className="size-5 inline" />{capital.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Panel de Estadísticas Económicas y Dialécticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Fuerza de Trabajo</span>
            <Users className="size-4 text-sky-400" />
          </div>
          <p className="text-xl font-bold font-mono text-zinc-100">{obreros} operarios</p>
          <span className="text-[10px] text-zinc-500">Salario fijo de subsistencia</span>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Jornada Laboral</span>
            <Clock className="size-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-zinc-100">{jornadaHoras} hs / día</p>
          <span className="text-[10px] text-zinc-500">{jornadaHoras > 10 ? 'Tiempo excedente forzado' : 'Jornada legal'}</span>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Stock de Mercancías</span>
            <Package className="size-4 text-indigo-400" />
          </div>
          <p className="text-xl font-bold font-mono text-zinc-100">{mercanciasStock} prendas</p>
          <span className="text-[10px] text-zinc-500">Valor de cambio: ${precioVentaCamisa} c/u</span>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Plusvalía Extraída</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-300">${plusvaliaAcumulada.toLocaleString('es-AR')}</p>
          <span className="text-[10px] text-zinc-500">Trabajo excedente no pagado</span>
        </div>
      </div>

      {/* Medidores de Tensión y Alienación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-300">
              <Layers className="size-3.5" /> Nivel de Alienación del Obrero
            </span>
            <span className="font-mono text-zinc-400">{Math.round(nivelAlienacion)}%</span>
          </div>
          <Progress value={nivelAlienacion} className="h-2 bg-zinc-800" />
          <p className="text-[11px] text-zinc-500">
            {nivelAlienacion > 60 
              ? 'El obrero no se reconoce en lo que produce: el objeto lo domina como un poder extraño.'
              : 'El trabajo rutinario desgasta la relación del trabajador con su obra.'}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-red-400">
              <Flame className="size-3.5" /> Tensión de Clase (Riesgo de Huelga)
            </span>
            <span className="font-mono text-zinc-400">{Math.round(tensionSocial)}%</span>
          </div>
          <Progress value={tensionSocial} className="h-2 bg-zinc-800" />
          <p className="text-[11px] text-zinc-500">
            {tensionSocial >= 80 
              ? '¡Asambleas clandestinas en el taller! Los obreros empiezan a coordinarse.'
              : 'Descontento contenido por miedo a caer en el ejército de reserva.'}
          </p>
        </div>
      </div>

      {/* Acciones de Gestión Patronal */}
      {!huelgaDeclarada && !fabricaSocializada && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Decisiones de Acumulación Capitalista:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={venderMercancias}
              disabled={mercanciasStock <= 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-xl text-left"
            >
              <span className="font-bold flex items-center gap-1">
                <DollarSign className="size-3.5" /> Realizar Valor en el Mercado
              </span>
              <span className="text-[10px] text-emerald-100/80 font-normal">
                Vender stock ({mercanciasStock} prendas)
              </span>
            </Button>

            <Button
              onClick={aumentarJornada}
              disabled={jornadaHoras >= 16}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-xl text-left"
            >
              <span className="font-bold flex items-center gap-1">
                <Clock className="size-3.5" /> Plusvalía Absoluta (+2h)
              </span>
              <span className="text-[10px] text-amber-100/80 font-normal">
                Extender la jornada sin subir sueldo
              </span>
            </Button>

            <Button
              onClick={comprarMaquinaria}
              disabled={capital < 500 * nivelMaquinaria}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-xl text-left"
            >
              <span className="font-bold flex items-center gap-1">
                <Cpu className="size-3.5" /> Plusvalía Relativa (${500 * nivelMaquinaria})
              </span>
              <span className="text-[10px] text-sky-100/80 font-normal">
                Mecanizar: aumenta productividad
              </span>
            </Button>

            <Button
              onClick={contratarObrero}
              disabled={capital < 100}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs h-auto py-3 px-4 flex flex-col items-start gap-1 rounded-xl text-left"
            >
              <span className="font-bold flex items-center gap-1">
                <Users className="size-3.5" /> Comprar Más Mano de Obra
              </span>
              <span className="text-[10px] text-zinc-400 font-normal">
                Contratar 2 obreros ($100)
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Evento Crítico: Estallido de la Huelga General */}
      {huelgaDeclarada && !fabricaSocializada && (
        <div className="bg-red-950/40 border-2 border-red-500/60 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600 text-white rounded-2xl">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <Badge className="bg-red-700 text-white">¡CONTRADICCIÓN ANTAGÓNICA EXPLOTADA!</Badge>
              <h3 className="text-xl font-bold font-serif text-red-200 mt-1">
                Huelga General: Las Máquinas se Detuvieron
              </h3>
            </div>
          </div>
          
          <p className="text-sm text-zinc-300 leading-relaxed">
            La extensión de la jornada y la explotación de plusvalía desbordaron la tolerancia de los trabajadores. 
            El aislamiento se rompió: los operarios descubrieron que comparten las mismas cadenas y han conformado 
            una <strong>Clase para Sí</strong>. Ya no reclaman migajas; impugnan la propiedad misma de la fábrica.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={resolverConflictoColectivo}
              className="bg-red-600 hover:bg-red-500 text-white font-medium px-6 py-6 rounded-xl flex-1 text-sm"
            >
              Aceptar la Socialización de los Medios: Cooperativa de Productores Libres
            </Button>
          </div>
        </div>
      )}

      {/* Estado Final: Fábrica Socializada */}
      {fabricaSocializada && (
        <div className="bg-emerald-950/40 border-2 border-emerald-500/60 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-stone-950 rounded-2xl">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <Badge className="bg-emerald-600 text-stone-950">DESALIENTACIÓN CONQUISTADA</Badge>
              <h3 className="text-xl font-bold font-serif text-emerald-200 mt-1">
                Producción Socializada y Trabajo Emancipado
              </h3>
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Se ha abolido la apropiación privada de la plusvalía. El trabajo ya no es una mercancía que se compra para enriquecer a un tercero; 
            las máquinas ahora sirven para reducir el tiempo de trabajo necesario y expandir el tiempo libre de toda la comunidad.
          </p>

          <div className="pt-2">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40">
              Desafío de Marx Completado con Éxito (10/10)
            </Badge>
          </div>
        </div>
      )}

      {/* Bitácora de Conceptos Teóricos Descubiertos */}
      <div className="border-t border-zinc-800/80 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <CheckCircle2 className="size-3.5 text-red-400" /> 
          Conceptos Materialistas descubiertos en esta partida ({conceptosDesbloqueados.length}/6):
        </p>

        <div className="flex flex-wrap gap-2">
          {conceptosDesbloqueados.map((concepto, i) => (
            <Badge
              key={i}
              variant="outline"
              className="border-red-500/30 bg-red-950/20 text-red-300 text-xs py-1 px-3"
            >
              ✓ {concepto}
            </Badge>
          ))}
        </div>
      </div>

    </div>
  )
}
