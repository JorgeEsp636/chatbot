import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { rutasService } from '../rutas/services/rutasService';
import { tarifasService } from '../tarifas/services/tarifasService';
import { CONDUCTORES_DEFAULT } from '../conductores/ConductoresView';
import { BUSES_DEFAULT } from '../buses/BusesView';
import { pqrsService } from '../pqrs/services/pqrsService';
import { EMPRESA_TRANSPORTE_OFICIAL, TARIFA_MINIMA_2026 } from '../tarifas/services/tarifasService';
import { UsuarioDocument } from '../../types';

type Language = 'es' | 'en';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  time: string;
  actionPayload?: {
    type: 'ruta' | 'tarifa';
    target: string;
  };
}

interface AsistenteIAViewProps {
  usuario: UsuarioDocument;
}

const crearMensajesIniciales = (idioma: Language): ChatMessage[] => [
  {
    id: 'msg_01',
    sender: 'ia',
    text: idioma === 'es'
      ? '¡Hola! Soy CHEEMS Bot, el asistente virtual de CHEEMS para el Valle de Ubaté. Puedo orientarte sobre rutas, horarios y tarifas registradas, ubicación en el mapa, vías, PQRS y uso de la aplicación.'
      : 'Hello! I am CHEEMS Bot, the virtual assistant for the Ubaté Valley. I can help you with routes, schedules, fares, map location, roads, PQRS, and app usage.',
    time: '12:00',
  },
];

export const AsistenteIAView: React.FC<AsistenteIAViewProps> = ({usuario}) => {
  const [idioma, setIdioma] = useState<Language>('es');
  const [mensajes, setMensajes] = useState<ChatMessage[]>(() => crearMensajesIniciales('es'));
  const [inputTexto, setInputTexto] = useState('');
  const [pensando, setPensando] = useState(false);

  const cambiarIdioma = (lang: Language) => {
    setIdioma(lang);
    setMensajes((prev) => prev.map((msg, index) =>
      index === 0 && msg.sender === 'ia'
        ? {
            ...msg,
            text: lang === 'es'
              ? '¡Hola! Soy CHEEMS Bot, el asistente virtual de CHEEMS para el Valle de Ubaté. Puedo orientarte sobre rutas, horarios y tarifas registradas, ubicación en el mapa, vías, PQRS y uso de la aplicación.'
              : 'Hello! I am CHEEMS Bot, the virtual assistant for the Ubaté Valley. I can help you with routes, schedules, fares, map location, roads, PQRS, and app usage.',
          }
        : msg
    ));
  };

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const esPreguntaPersonaTranshumana = (texto: string) =>
    normalizar(texto).includes('transhum');

  const declaracionPersonaTranshumana = `La Declaración de Persona Transhumana en la Universidad de Cundinamarca es una postura ética e inclusiva que reconoce la identidad de género y la dignidad de las personas transhumanas dentro de la comunidad universitaria. Esta declaración busca generar un ambiente de respeto, comprensión y apoyo, garantizando que todos los individuos, reafirmen su compromiso con la diversidad, la no discriminación y la creación de un espacio seguro y acogedor para todas las personas.

DECLARACIÓN PERSONA TRANSHUMANA

1. ORGANIZO y dirijo mi propia vida.
2. ENTIENDO y defiendo que la vida es la gran apuesta del siglo 21.
3. EDIFICO un estilo propio de vida que me permite ser feliz, amar, vivir bien y lograr mi desarrollo personal.
4. DETERMINO mi vida, aprendo de ella y asumo las buenas prácticas de mis semejantes, que contribuyen a mi desarrollo individual.
5. ME VALORO Y CUIDO mi salud corporal, mental, emocional, sentimental y espiritual.
6. VOY MÁS ALLÁ DE MÍ, cada día mejoro, reinvento y evoluciono, dejando de lado los intereses propios, tomando la posición del otro, los seres vivos y la naturaleza.
7. ME PERFECCIONO, antes y no necesariamente, a través de la tecnología y la ciencia; además, lucho por mi felicidad, realizo mi plan de vida, sin desconocer a los demás y dando lo mejor como profesional, emprendedor, innovador y transformador de mi entorno.
8. VIVO Y CONTRIBUYO para que la comunidad esté en paz y armonía.
9. Soy LIBRE, AUTÓNOMO Y RESPONSABLE a través del diálogo y la construcción, como ideal regulativo; me dirijo, controlo y dicto mis propias leyes.
10. FORJO MI PERSONALIDAD, el carácter, la identidad, la autonomía y la responsabilidad.
11. REALIZO actos transformadores de mejora que permiten, entre distintas actuaciones, escoger la que me aporte y no me haga daño, ni a la naturaleza, la sociedad, la convivencia y la vida democrática.
12. EXPLORO y CULTIVO los sentimientos, emociones y comportamientos positivos, para promover mi felicidad.

Adriano Muñoz Barrera
Rector UCundinamarca S21
Fusagasugá
Agosto, 26 de 2022`;

  const responderPregunta = async (pregunta: string, historial: ChatMessage[]) => {
    const q = normalizar(pregunta);
    if (esPreguntaPersonaTranshumana(pregunta)) {
      return declaracionPersonaTranshumana;
    }

    const esSaludo = /^(hola|holi|buenos dias|buenas tardes|buenas noches|buenas)(\s|$)/.test(q);
    const preguntaComoEsta = ['como estas', 'como esta', 'que tal', 'como te va', 'todo bien'].some((frase) => q.includes(frase));
    const esAgradecimiento = /^(muchas gracias|mil gracias|gracias|te agradezco)(\s|$)/.test(q);
    const esDespedida = /^(chao|adios|hasta luego|nos vemos|hasta pronto)(\s|$)/.test(q);
    const esMensajeSocial = esSaludo || preguntaComoEsta || esAgradecimiento || esDespedida;

    if (esMensajeSocial) {
      if (idioma === 'en') {
        if (preguntaComoEsta) {
          return 'Hello! I am doing well, thanks for asking. I am CHEEMS Bot and I am ready to help. What would you like to know about routes, schedules, fares, or the app?';
        }
        if (esAgradecimiento) {
          return 'My pleasure! That is what CHEEMS Bot is here for. Can I help with anything else about your trip or the app?';
        }
        if (esDespedida) {
          return 'Goodbye! Have a great trip. I will be here whenever you need route, fare, or CHEEMS information.';
        }
        return 'Hello! Nice to meet you. How are you? Tell me, how can I help you today with your trip or CHEEMS?';
      }

      if (preguntaComoEsta) {
        return '¡Hola! Muy bien, gracias por preguntar. Soy CHEEMS Bot y estoy listo para ayudarte. ¿Qué necesitas saber sobre rutas, horarios, tarifas o la aplicación?';
      }
      if (esAgradecimiento) {
        return '¡Con mucho gusto! Para eso está CHEEMS Bot. ¿Te ayudo con algo más sobre tu viaje o la aplicación?';
      }
      if (esDespedida) {
        return '¡Hasta luego! Que tengas un buen viaje. Aquí estaré cuando necesites consultar rutas, tarifas o información de CHEEMS.';
      }
      return '¡Hola! Qué gusto saludarte. ¿Cómo estás? Cuéntame, ¿en qué puedo ayudarte hoy con tu viaje o con CHEEMS?';
    }

    const rutas = rutasService.obtenerRutas();
    const tarifas = await tarifasService.obtenerTarifas();
    const tarifasActivas = tarifas.filter((item) => item.activa);
    const destinos = [...new Set([
      ...rutas.map((ruta) => ruta.destino),
      ...tarifasActivas.map((item) => item.destino),
    ])].sort((a, b) => b.length - a.length);
    const coincideDestino = (texto: string) => destinos.find((item) => {
      const nombre = normalizar(item);
      const alias = nombre === 'carupa' || nombre === 'carmen de carupa'
        ? ['carupa', 'carmen de carupa']
        : [nombre];
      return alias.some((nombreDestino) => texto.includes(nombreDestino));
    });
    const destino = coincideDestino(q) || [...historial]
      .reverse()
      .filter((mensaje) => mensaje.sender === 'user')
      .map((mensaje) => coincideDestino(normalizar(mensaje.text)))
      .find(Boolean);
    const placa = rutas.find((ruta) => q.includes(normalizar(ruta.placa)));
    const ruta = placa || rutas.find((item) => destino && (
      normalizar(item.destino) === normalizar(destino) ||
      (normalizar(item.destino).includes('carupa') && normalizar(destino).includes('carupa'))
    ));
    const tarifa = tarifasActivas.find((item) => destino && (
      normalizar(item.destino) === normalizar(destino) ||
      (normalizar(item.destino).includes('carupa') && normalizar(destino).includes('carupa'))
    ));
    const formatearInfoRuta = (rutaDetalle: (typeof rutas)[number]) => {
      const tarifaRuta = tarifasActivas.find((item) =>
        normalizar(item.destino) === normalizar(rutaDetalle.destino) ||
        (normalizar(item.destino).includes('carupa') && normalizar(rutaDetalle.destino).includes('carupa'))
      );
      const tarifaFormateada = tarifaRuta
        ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(tarifaRuta.valor)
        : (idioma === 'en' ? 'Not registered in Fares' : 'No registrada en Tarifas');
      const estadoRuta = idioma === 'en'
        ? (rutaDetalle.activa ? 'Active' : 'Inactive')
        : (rutaDetalle.activa ? 'Activa' : 'Inactiva');
      if (idioma === 'en') {
        return `Route ${rutaDetalle.origen} → ${rutaDetalle.destino}:\n• Fare: ${tarifaFormateada}\n• Status: ${estadoRuta}\n• Departure: ${rutaDetalle.horaSalida.slice(0, 5)}\n• Frequency: every ${rutaDetalle.frecuenciaMin} min\n• Estimated duration: ${rutaDetalle.duracionEstimada}\n• Distance: ${rutaDetalle.distanciaKm.toFixed(1)} km\n• Company: ${rutaDetalle.empresa}\n• Vehicle: ${rutaDetalle.vehiculo}\n• Driver: ${rutaDetalle.conductorNombre}`;
      }
      return `Ruta ${rutaDetalle.origen} → ${rutaDetalle.destino}:\n• Tarifa: ${tarifaFormateada}\n• Estado: ${estadoRuta}\n• Hora de salida: ${rutaDetalle.horaSalida.slice(0, 5)}\n• Frecuencia: cada ${rutaDetalle.frecuenciaMin} min\n• Duración estimada: ${rutaDetalle.duracionEstimada}\n• Distancia: ${rutaDetalle.distanciaKm.toFixed(1)} km\n• Empresa: ${rutaDetalle.empresa}\n• Vehículo: ${rutaDetalle.vehiculo}\n• Placa: ${rutaDetalle.placa}\n• Conductor: ${rutaDetalle.conductorNombre}`;
    };

    const formatearListaRutas = (lista: (typeof rutas)[number][]) => {
      const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      });

      return lista.map((rutaDetalle) => {
        const valor = formatter.format(rutaDetalle.tarifa);
        if (idioma === 'en') {
          return `• ${rutaDetalle.origen} → ${rutaDetalle.destino} | ${rutaDetalle.activa ? 'active' : 'inactive'} | departure ${rutaDetalle.horaSalida.slice(0, 5)} | every ${rutaDetalle.frecuenciaMin} min | ${rutaDetalle.duracionEstimada} | ${rutaDetalle.distanciaKm.toFixed(1)} km | fare ${valor} | vehicle ${rutaDetalle.vehiculo} | plate ${rutaDetalle.placa} | driver ${rutaDetalle.conductorNombre} | company ${rutaDetalle.empresa}`;
        }
        return `• ${rutaDetalle.origen} → ${rutaDetalle.destino} | ${rutaDetalle.activa ? 'activa' : 'inactiva'} | salida ${rutaDetalle.horaSalida.slice(0, 5)} | frecuencia cada ${rutaDetalle.frecuenciaMin} min | ${rutaDetalle.duracionEstimada} | ${rutaDetalle.distanciaKm.toFixed(1)} km | tarifa ${valor} | vehículo ${rutaDetalle.vehiculo} | placa ${rutaDetalle.placa} | conductor ${rutaDetalle.conductorNombre} | empresa ${rutaDetalle.empresa}`;
      }).join('\n');
    };

    const formatearInfoTarifa = (tarifaDetalle: (typeof tarifasActivas)[number]) => {
      const valorFormateado = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(tarifaDetalle.valor);

      if (idioma === 'en') {
        return `Of course, the fare ${tarifaDetalle.origen} → ${tarifaDetalle.destino} is ${valorFormateado}. ${tarifaDetalle.activa ? 'It is valid at the moment.' : 'It is not active at the moment.'} Would you like me to compare this route with another one?`;
      }
      return `Claro, la tarifa ${tarifaDetalle.origen} → ${tarifaDetalle.destino} es ${valorFormateado}. ${tarifaDetalle.activa ? 'Está vigente en este momento.' : 'No está activa en este momento.'} ¿Quieres que te compare esta ruta con otra?`;
    };

    const esListaRutas = q.includes('ruta') && (
      q.includes('todas') || q.includes('lista') || q.includes('que rutas') || q.includes('hay rutas') || q.includes('disponibles') || q.includes('activas') || q === 'rutas' || q.includes('todas las rutas') || q.includes('cuales son las rutas') || q.includes('cuantas rutas') || q.includes('rutas activas')
    );
    const esTarifa = ['tarifa', 'precio', 'cuanto vale', 'costo', 'pasaje'].some((palabra) => q.includes(palabra));
    const esHorario = ['horario', 'hora', 'sale', 'salida', 'frecuencia', 'proximo bus'].some((palabra) => q.includes(palabra));
    const esUbicacion = ['ubicacion', 'donde', 'gps', 'en tiempo real', 'estado del bus', 'pasando por'].some((palabra) => q.includes(palabra));
    const esVehiculo = esUbicacion || Boolean(placa) || ['bus', 'vehiculo', 'placa', 'conductor'].some((palabra) => q.includes(palabra));
    const esPQRS = ['pqrs', 'peticion', 'queja', 'reclamo', 'sugerencia'].some((palabra) => q.includes(palabra));
    const esVias = ['via', 'carretera', 'bloqueo', 'derrumbe', 'estado de la via', 'estado de las vias'].some((palabra) => q.includes(palabra));
    const esSoporte = ['aplicacion', 'app', 'iniciar sesion', 'registrarme', 'registro', 'contrasena', 'no puedo entrar', 'problema tecnico', 'mapa'].some((palabra) => q.includes(palabra));
    const esConsultaAplicacion = ['aplicativo', 'modulos', 'secciones', 'que tiene cheems', 'que ofrece cheems', 'que puedo hacer', 'funciones de la app'].some((frase) => q.includes(frase));
    const esPrincipios = ['transhumana', 'transhumano', 'declaracion transhumana', 'etica de la inteligencia artificial'].some((palabra) => q.includes(palabra));
    const esConsultaTransporte = esListaRutas || esTarifa || esHorario || esVehiculo || esPQRS || esVias || esSoporte || esConsultaAplicacion || esPrincipios || Boolean(destino) || q.includes('ruta') || q.includes('transporte');

    if (!esConsultaTransporte) {
      return 'Soy CHEEMS Bot y atiendo consultas sobre transporte público del Valle de Ubaté y el uso de la plataforma CHEEMS. Puedo ayudarte con rutas, tarifas, horarios, vías, PQRS o soporte básico de la aplicación.';
    }

    if (esPrincipios) {
      return 'CHEEMS busca integrar la inteligencia artificial de forma ética para apoyar las capacidades humanas, ampliar el acceso a la tecnología en comunidades rurales y contribuir a una movilidad más sostenible. Puedo ampliar la orientación sobre transporte o el uso de la plataforma.';
    }

    if (esConsultaAplicacion) {
      return 'CHEEMS reúne módulos de Rutas (destinos, horarios y recorridos), Tarifas (valores registrados), Buses (flota y estado operativo), Conductores (directorio y rutas asignadas), Mapa (consulta de unidades y recorridos), PQRS (radicar y seguir solicitudes), Dashboard (resumen de operación) y Perfil (cuenta y rol). Los datos del mapa y de operación pueden ser simulados o no estar actualizados en tiempo real.';
    }

    if (esPQRS) {
      return 'Para radicar una petición, queja, reclamo o sugerencia, puedo ayudarte a redactar la información básica: ruta, fecha, descripción del caso y empresa involucrada. Si quieres, te la preparo en el chat.';
    }

    if (esSoporte) {
      return 'Para soporte técnico o de la aplicación, puedo ayudarte con la información básica del problema: qué pasó, en qué pantalla apareció, y si es error de inicio de sesión, mapa o rutas. Dímelo y te lo organizo.';
    }

    if (esVias) {
      return 'No tengo un reporte en tiempo real sobre el estado de las vías, pero sí puedo ayudarte con la información más útil: ruta involucrada, dirección o punto de referencia y si se trata de bloqueo, derrumbe o demora.';
    }

    if (esListaRutas) {
      const soloRutasActivas = q.includes('activa') || q.includes('disponibles');
      const rutasSolicitadas = soloRutasActivas ? rutas.filter((item) => item.activa) : rutas;
      const destinosConTarifaSinRuta = soloRutasActivas ? [] : tarifasActivas.filter((item) =>
        !rutas.some((rutaRegistrada) => {
          const destinoTarifa = normalizar(item.destino);
          const destinoRuta = normalizar(rutaRegistrada.destino);
          return destinoTarifa === destinoRuta ||
            (destinoTarifa.includes('carupa') && destinoRuta.includes('carupa'));
        })
      );
      const listaDestinosConTarifa = destinosConTarifaSinRuta.map((item) => {
        const valor = new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }).format(item.valor);
        return `• Ubaté → ${item.destino} | tarifa ${valor} | sin horario registrado en Rutas`;
      }).join('\n');
      const detalleDestinos = listaDestinosConTarifa
        ? `\n\nDestinos adicionales con tarifa registrada (sin ficha de horario):\n${listaDestinosConTarifa}`
        : '';
      if (idioma === 'en') {
        return rutasSolicitadas.length
          ? `Registered routes (${rutasSolicitadas.length}):\n${formatearListaRutas(rutasSolicitadas)}${detalleDestinos}`
          : 'No routes are registered at the moment.';
      }
      return rutasSolicitadas.length
        ? `Rutas con ficha operativa (${rutasSolicitadas.length}):\n${formatearListaRutas(rutasSolicitadas)}${detalleDestinos}`
        : 'No hay rutas registradas en este momento.';
    }

    if (esTarifa) {
      if (destino) {
        return tarifa
          ? formatearInfoTarifa(tarifa)
          : `No encuentro una tarifa activa registrada para ${destino}. Puedo ayudarte con otra ruta o consultar la tarifa de otro destino.`;
      }
      if (!q.includes('tarifas') && !q.includes('todas') && !q.includes('lista')) {
        return '¿Para qué municipio o vereda necesitas consultar la tarifa? Dime el destino y te lo respondo directamente.';
      }
      const listaTarifas = tarifasActivas.map((item) => `• ${item.destino}: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.valor)}`);
      return listaTarifas.length
        ? `Tarifas activas registradas en CHEEMS:\n${listaTarifas.join('\n')}`
        : 'No hay tarifas activas disponibles en CHEEMS en este momento.';
    }

    if (esVehiculo && esUbicacion) {
      if (ruta) {
        return `El registro de CHEEMS asocia ${ruta.placa} con la ruta ${ruta.origen} → ${ruta.destino}. Este dato no confirma su ubicación actual en tiempo real.`;
      }
      return 'No puedo confirmar la ubicación actual de un vehículo desde el chat. Si quieres, te ayudo a buscar por placa o destino en la información disponible.';
    }

    if (esVehiculo) {
      if (idioma === 'en') {
        return ruta
          ? `Of course, the vehicle ${ruta.vehiculo} (${ruta.placa}) is assigned to the route ${ruta.origen} → ${ruta.destino}, company ${ruta.empresa}. Would you like to know the fare or schedule for that same route?`
          : 'I could not find a vehicle associated with that destination or plate in the available records. If you tell me the plate or destination, I can help you find it better.';
      }
      return ruta
        ? `Claro, el vehículo ${ruta.vehiculo} (${ruta.placa}) está asociado a la ruta ${ruta.origen} → ${ruta.destino}, empresa ${ruta.empresa}. ¿Quieres que te diga también la tarifa o el horario de esa misma ruta?` 
        : 'No encuentro un vehículo asociado a ese destino o placa en los registros disponibles. Si me dices la placa o el destino, te ayudo a buscarlo mejor.';
    }

    if (esHorario) {
      return ruta
        ? formatearInfoRuta(ruta)
        : destino
          ? `No encuentro un horario operativo registrado para ${destino}. Te puedo ayudar con otra ruta o con la tarifa del destino.`
          : '¿Para qué destino necesitas el horario? Indícame el municipio o vereda para consultar las rutas registradas.';
    }

    if (destino && ruta) {
      return formatearInfoRuta(ruta);
    }

    if (destino) {
      return `Encontré información relacionada con ${destino}. Si me dices qué quieres saber exactamente — tarifa, horario, vehículo o ruta — te la respondo directamente.`;
    }

    return '¿Qué municipio o vereda del Valle de Ubaté te interesa? Con el destino puedo revisar la información de rutas o tarifas registrada en CHEEMS.';
  };

  const handleEnviar = async (textoAEnviar?: string) => {
    const query = textoAEnviar || inputTexto;
    if (!query.trim() || pensando) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setMensajes((prev) => [...prev, userMsg]);
    setInputTexto('');
    setPensando(true);

    try {
      let respTexto = '';
      const esConsultaTranshumana = esPreguntaPersonaTranshumana(query);
      if (esConsultaTranshumana) {
        respTexto = await responderPregunta(query, mensajes);
      } else try {
        const rutas = rutasService.obtenerRutas().map((ruta) => ({
          nombre: ruta.nombre,
          origen: ruta.origen,
          destino: ruta.destino,
          horaSalida: ruta.horaSalida,
          vehiculo: ruta.vehiculo,
          placa: ruta.placa,
          conductor: ruta.conductorNombre,
          empresa: ruta.empresa,
          duracionEstimada: ruta.duracionEstimada,
          distanciaKm: ruta.distanciaKm,
          tarifa: ruta.tarifa,
          frecuenciaMin: ruta.frecuenciaMin,
          activa: ruta.activa,
        }));
        const tarifas = (await tarifasService.obtenerTarifas())
          .filter((tarifa) => tarifa.activa)
          .map(({ origen, destino, valor, activa }) => ({ origen, destino, valor, activa }));
        const pqrs = pqrsService.obtenerPorUsuario(usuario.id, usuario.rol);
        const pqrsPorEstado = pqrs.reduce<Record<string, number>>((conteo, solicitud) => {
          conteo[solicitud.estado] = (conteo[solicitud.estado] || 0) + 1;
          return conteo;
        }, {});
        const buses = BUSES_DEFAULT.map(({placa, numeroInterno, empresa, modelo, capacidadPasajeros, rutaActual, estado, aireAcondicionado, wifi}) => ({
          placa, numeroInterno, empresa, modelo, capacidadPasajeros, rutaActual: rutaActual.replace('&rarr;', '→'), estado, aireAcondicionado, wifi,
        }));
        const conductores = CONDUCTORES_DEFAULT.map(({placa, empresa, vehiculo, rutaAsignada, estado, calificacion, viajesCompletados}) => ({
          placa, empresa, vehiculo, rutaAsignada: rutaAsignada.replace('&rarr;', '→'), estado, calificacion, viajesCompletados,
        }));
        const rutasActivas = rutas.filter((ruta) => ruta.activa).length;
        const tarifasActivas = tarifas.length;
        const modulos = [
          {nombre: 'Rutas', funcion: 'consultar recorridos, destinos, horarios y frecuencia'},
          {nombre: 'Tarifas', funcion: 'consultar valores vigentes por destino'},
          {nombre: 'Conductores', funcion: 'consultar directorio, empresa, vehículo y ruta asignada'},
          {nombre: 'Buses', funcion: 'consultar flota, capacidad, servicios y estado operativo'},
          {nombre: 'Mapa', funcion: 'visualizar recorridos y ubicación reportada de unidades; puede ser simulada'},
          {nombre: 'PQRS', funcion: 'radicar y hacer seguimiento a peticiones, quejas, reclamos y sugerencias'},
          {nombre: 'Dashboard', funcion: 'ver métricas resumidas de rutas, tarifas, conductores y buses'},
          {nombre: 'Perfil', funcion: 'consultar datos de cuenta y rol; conductores gestionan disponibilidad'},
        ];
        const chatbotApiUrl = (import.meta as any).env?.VITE_CHATBOT_API_URL || '/api/chat';
        const response = await fetch(chatbotApiUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            question: query.trim(),
            language: idioma,
            history: mensajes.slice(-8).map(({sender, text}) => ({sender, text})),
            context: {
              aplicacion: 'CHEEMS, sistema de transporte público del Valle de Ubaté.',
              modulos,
              alcanceUsuario: {rol: usuario.rol, municipio: usuario.municipio || 'Ubaté'},
              rutas,
              tarifas,
              tarifarioOficial: {
                empresa: EMPRESA_TRANSPORTE_OFICIAL.nombre,
                vigencia: EMPRESA_TRANSPORTE_OFICIAL.vigencia,
                tarifaMinimaCOP: TARIFA_MINIMA_2026,
                entidadVigilante: EMPRESA_TRANSPORTE_OFICIAL.entidadVigilante,
              },
              buses,
              conductores,
              pqrs: {totalAccesibles: pqrs.length, porEstado: pqrsPorEstado},
              dashboard: {
                rutasActivas,
                rutasRegistradas: rutas.length,
                tarifasActivas,
                conductoresRegistrados: conductores.length,
                conductoresActivos: conductores.filter((conductor) => conductor.estado === 'ACTIVO' || conductor.estado === 'EN_RUTA').length,
                busesRegistrados: buses.length,
                busesOperativos: buses.filter((bus) => bus.estado === 'DISPONIBLE' || bus.estado === 'EN_RUTA').length,
              },
            },
          }),
        });
        const data = await response.json() as {text?: string; error?: string};
        if (!response.ok) {
          throw new Error(data.error || `El servicio de IA respondió con HTTP ${response.status}.`);
        }
        respTexto = data.text?.trim() || '';
        if (!respTexto) throw new Error('El servicio de IA no devolvió una respuesta.');
      } catch (error) {
        console.error('Error consultando la IA de CHEEMS:', error);
        const detalle = error instanceof Error ? ` ${error.message}` : '';
        respTexto = idioma === 'en'
          ? `I could not reach the AI service.${detalle} Check the server configuration and try again.`
          : `No pude consultar la IA.${detalle} Verifica que GEMINI_API_KEY esté configurada en el servidor y vuelve a intentarlo.`;
      }
      const iaMsg: ChatMessage = {
        id: `ia_${Date.now()}`,
        sender: 'ia',
        text: respTexto,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMensajes((prev) => [...prev, iaMsg]);
    } catch {
      const iaMsg: ChatMessage = {
        id: `ia_${Date.now()}`,
        sender: 'ia',
        text: 'En este momento no pude consultar los datos de CHEEMS. Inténtalo de nuevo o revisa directamente los módulos Rutas y Tarifas. Si el problema continúa, repórtalo por PQRS.',
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };
      setMensajes((prev) => [...prev, iaMsg]);
    } finally {
      setPensando(false);
    }
  };

  const sugerencias = idioma === 'en'
    ? [
        'Which routes are active?',
        'What is the fare to Guachetá?',
        'Where can I check a bus location?',
        'How do I file a PQRS?',
      ]
    : [
        '¿Qué rutas están activas?',
        '¿Cuál es la tarifa a Guachetá?',
        '¿Dónde consulto la ubicación de un bus?',
        '¿Cómo radico una PQRS?',
      ];

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[650px]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>CHEEMS Bot</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {idioma === 'en' ? 'Public transportation assistant for the Ubaté Valley' : 'Asistente de transporte público del Valle de Ubaté'}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-slate-950/80 p-1">
          {(['es', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => cambiarIdioma(lang)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                idioma === lang ? 'bg-cyan-500 text-slate-950' : 'text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {lang === 'es' ? 'ES' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Sugerencias Rápidas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sugerencias.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleEnviar(sug)}
            disabled={pensando}
            className="shrink-0 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>{sug}</span>
          </button>
        ))}
      </div>

      {/* Contenedor de Chat Glassmorphism */}
      <div className="flex-1 cheems-glass rounded-3xl p-4 border border-cyan-500/30 overflow-y-auto space-y-3 flex flex-col shadow-inner">
        {mensajes.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'ia' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-500 text-slate-950 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] rounded-br-none'
                  : 'bg-slate-950/80 border border-cyan-500/20 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">
                {m.sender === 'ia' ? m.text.replace(/\*\*/g, '') : m.text}
              </div>
              <div
                className={`text-[9px] mt-1.5 text-right font-mono ${
                  m.sender === 'user' ? 'text-slate-900 font-bold' : 'text-slate-500'
                }`}
              >
                {m.time}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {pensando && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs py-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Consultando información registrada en CHEEMS...</span>
          </div>
        )}
      </div>

      {/* Input de Chat */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEnviar();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            disabled={pensando}
            placeholder={idioma === 'en' ? 'Ask about routes, fares, roads or PQRS...' : 'Pregunta sobre rutas, tarifas, vías o PQRS...'}
            className="w-full bg-slate-950/90 border border-cyan-500/30 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={!inputTexto.trim() || pensando}
          className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AsistenteIAView;
