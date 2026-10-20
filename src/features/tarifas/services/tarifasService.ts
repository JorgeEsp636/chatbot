import { Tarifa } from '../../../types';

export const TARIFAS_STORAGE_KEY = 'cheems_tarifas_rapido_el_carmen_2026_v3';

export const EMPRESA_TRANSPORTE_OFICIAL = {
  nombre: 'RÁPIDO EL CARMEN S.A.',
  slogan: 'Progresamos y servimos cada día mejor',
  nit: '860.013.797-8',
  vigencia: 'Vigentes Año 2026',
  tarifaMinima: 4400,
  entidadVigilante: 'SuperTransporte',
};

export const TARIFA_MINIMA_2026 = 4400;

export const TARIFAS_RAPIDO_EL_CARMEN_2026: Tarifa[] = [
  // Columna 1 (De Ubaté a:)
  {
    id: 'tar_alizal',
    nombre: 'Ubaté - Alizal',
    origen: 'Ubaté',
    destino: 'Alizal',
    valor: 9800,
    descripcion: 'Ruta intermunicipal autorizada por Rápido El Carmen S.A.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_apartadero',
    nombre: 'Ubaté - Apartadero',
    origen: 'Ubaté',
    destino: 'Apartadero',
    valor: 12800,
    descripcion: 'Ruta intermunicipal autorizada por Rápido El Carmen S.A.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_capellania',
    nombre: 'Ubaté - Capellanía',
    origen: 'Ubaté',
    destino: 'Capellanía',
    valor: 6000,
    descripcion: 'Conexión veredal e intermunicipal Valle de Ubaté.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_carupa',
    nombre: 'Ubaté - Carupa',
    origen: 'Ubaté',
    destino: 'Carupa',
    valor: 6000,
    descripcion: 'Corredor principal Ubaté - Carmen de Carupa.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_choconta',
    nombre: 'Ubaté - Chocontá',
    origen: 'Ubaté',
    destino: 'Chocontá',
    valor: 18000,
    descripcion: 'Conexión interprovincial Ubaté - Almeidas.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_coper',
    nombre: 'Ubaté - Coper',
    origen: 'Ubaté',
    destino: 'Coper',
    valor: 39000,
    descripcion: 'Ruta interdepartamental Cundinamarca - Boyacá (Occidente).',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_cucunuba',
    nombre: 'Ubaté - Cucunubá',
    origen: 'Ubaté',
    destino: 'Cucunubá',
    valor: 5400,
    descripcion: 'Ruta artesanal y turística del Valle de Ubaté.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_fuquene',
    nombre: 'Ubaté - Fúquene',
    origen: 'Ubaté',
    destino: 'Fúquene',
    valor: 9500,
    descripcion: 'Corredor laguna de Fúquene.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_guacheta',
    nombre: 'Ubaté - Guachetá',
    origen: 'Ubaté',
    destino: 'Guachetá',
    valor: 11700,
    descripcion: 'Conexión cuenca minera y ganadera.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_hato_grande',
    nombre: 'Ubaté - Hato Grande',
    origen: 'Ubaté',
    destino: 'Hato Grande',
    valor: 14300,
    descripcion: 'Ruta veredal e intermunicipal autorizada.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_la_pluma',
    nombre: 'Ubaté - La Pluma',
    origen: 'Ubaté',
    destino: 'La Pluma',
    valor: 11200,
    descripcion: 'Ruta intermunicipal autorizada por Rápido El Carmen S.A.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_la_ye',
    nombre: 'Ubaté - La Ye',
    origen: 'Ubaté',
    destino: 'La Ye',
    valor: 16800,
    descripcion: 'Cruce estratégico y conexión intermunicipal.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_lenguazaque',
    nombre: 'Ubaté - Lenguazaque',
    origen: 'Ubaté',
    destino: 'Lenguazaque',
    valor: 9400,
    descripcion: 'Corredor carbonífero del Valle de Ubaté.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_nemocon',
    nombre: 'Ubaté - Nemocón',
    origen: 'Ubaté',
    destino: 'Nemocón',
    valor: 18000,
    descripcion: 'Conexión turística sabana centro y mina de sal.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_la_ramada_alta',
    nombre: 'Ubaté - La Ramada Alta',
    origen: 'Ubaté',
    destino: 'La Ramada Alta',
    valor: 11700,
    descripcion: 'Sector veredal La Ramada Alta.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_la_ramada_baja',
    nombre: 'Ubaté - La Ramada Baja',
    origen: 'Ubaté',
    destino: 'La Ramada Baja',
    valor: 10300,
    descripcion: 'Sector veredal La Ramada Baja.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_alto_de_cucunuba',
    nombre: 'Ubaté - Alto de Cucunubá',
    origen: 'Ubaté',
    destino: 'Alto de Cucunubá',
    valor: 10300,
    descripcion: 'Paso de montaña y mirador hacia Cucunubá.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },

  // Columna 2 (De Ubaté a:)
  {
    id: 'tar_patio_bonito',
    nombre: 'Ubaté - Patio Bonito',
    origen: 'Ubaté',
    destino: 'Patio Bonito',
    valor: 12600,
    descripcion: 'Sector rural y conexión agropecuaria.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_penas_de_cajon',
    nombre: 'Ubaté - Peñas de Cajón',
    origen: 'Ubaté',
    destino: 'Peñas de Cajón',
    valor: 11800,
    descripcion: 'Sector Peñas de Cajón.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_raquira',
    nombre: 'Ubaté - Ráquira',
    origen: 'Ubaté',
    destino: 'Ráquira',
    valor: 28000,
    descripcion: 'Destino alfarero y artesanal (Boyacá).',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_salinas',
    nombre: 'Ubaté - Salinas',
    origen: 'Ubaté',
    destino: 'Salinas',
    valor: 14500,
    descripcion: 'Ruta intermunicipal autorizada.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_samaca',
    nombre: 'Ubaté - Samacá',
    origen: 'Ubaté',
    destino: 'Samacá',
    valor: 31000,
    descripcion: 'Conexión industrial y minera con Boyacá.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_san_miguel_de_sema',
    nombre: 'Ubaté - San Miguel de Sema',
    origen: 'Ubaté',
    destino: 'San Miguel de Sema',
    valor: 21000,
    descripcion: 'Conexión lacustre Fúquene - Boyacá.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_simijaca',
    nombre: 'Ubaté - Simijaca',
    origen: 'Ubaté',
    destino: 'Simijaca',
    valor: 13500,
    descripcion: 'Límite norte del Valle de Ubaté.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_suesca',
    nombre: 'Ubaté - Suesca',
    origen: 'Ubaté',
    destino: 'Suesca',
    valor: 18000,
    descripcion: 'Conexión con rocas de Suesca y Almeidas.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_susa',
    nombre: 'Ubaté - Susa',
    origen: 'Ubaté',
    destino: 'Susa',
    valor: 12000,
    descripcion: 'Vía nacional Ubaté - Chiquinquirá.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_tausa',
    nombre: 'Ubaté - Tausa',
    origen: 'Ubaté',
    destino: 'Tausa',
    valor: 7600,
    descripcion: 'Puerta sur del valle y desvío al Neusa.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_tierra_negra',
    nombre: 'Ubaté - Tierra Negra',
    origen: 'Ubaté',
    destino: 'Tierra Negra',
    valor: 8800,
    descripcion: 'Sector alto y mirador de Tierra Negra.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_crucero',
    nombre: 'Ubaté - Crucero',
    origen: 'Ubaté',
    destino: 'Crucero',
    valor: 12900,
    descripcion: 'Cruce vial autorizado por Rápido El Carmen S.A.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_volcan_1',
    nombre: 'Ubaté - Volcán 1',
    origen: 'Ubaté',
    destino: 'Volcán 1',
    valor: 7000,
    descripcion: 'Sector rural Volcán 1.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_volcan_2',
    nombre: 'Ubaté - Volcán 2',
    origen: 'Ubaté',
    destino: 'Volcán 2',
    valor: 7000,
    descripcion: 'Sector rural Volcán 2.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_volcan_3',
    nombre: 'Ubaté - Volcán 3',
    origen: 'Ubaté',
    destino: 'Volcán 3',
    valor: 10000,
    descripcion: 'Sector rural Volcán 3.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_volcan_soaga',
    nombre: 'Ubaté - Volcán Soaga',
    origen: 'Ubaté',
    destino: 'Volcán Soaga',
    valor: 7000,
    descripcion: 'Sector veredal Volcán Soaga.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'tar_sutatausa',
    nombre: 'Ubaté - Sutatausa',
    origen: 'Ubaté',
    destino: 'Sutatausa',
    valor: 5900,
    descripcion: 'Farallones de Sutatausa e iglesia doctrinera.',
    activa: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

type TarifasSnapshotCallback = (tarifas: Tarifa[]) => void;
const subscribers: Set<TarifasSnapshotCallback> = new Set();

function getStoredTarifas(): Tarifa[] {
  try {
    const raw = localStorage.getItem(TARIFAS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TARIFAS_STORAGE_KEY, JSON.stringify(TARIFAS_RAPIDO_EL_CARMEN_2026));
      return TARIFAS_RAPIDO_EL_CARMEN_2026;
    }
    const parsed = JSON.parse(raw);
    // Si la lista almacenada tiene menos de 20 elementos (era la versión antigua de prueba), recargar las oficiales 2026
    if (!Array.isArray(parsed) || parsed.length < 20) {
      localStorage.setItem(TARIFAS_STORAGE_KEY, JSON.stringify(TARIFAS_RAPIDO_EL_CARMEN_2026));
      return TARIFAS_RAPIDO_EL_CARMEN_2026;
    }
    return parsed;
  } catch {
    return TARIFAS_RAPIDO_EL_CARMEN_2026;
  }
}

function persistAndBroadcast(tarifas: Tarifa[]) {
  localStorage.setItem(TARIFAS_STORAGE_KEY, JSON.stringify(tarifas));
  subscribers.forEach((callback) => callback(tarifas));
}

export const tarifasService = {
  /**
   * Obtener lista completa de tarifas
   */
  async obtenerTarifas(): Promise<Tarifa[]> {
    return getStoredTarifas();
  },

  /**
   * Suscripción en tiempo real idéntica al comportamiento de Firestore onSnapshot()
   */
  onSnapshot(callback: TarifasSnapshotCallback): () => void {
    subscribers.add(callback);
    // Emisión inmediata inicial
    callback(getStoredTarifas());

    // Escuchar eventos entre pestañas de navegador si aplica
    const storageHandler = (e: StorageEvent) => {
      if (e.key === TARIFAS_STORAGE_KEY) {
        callback(getStoredTarifas());
      }
    };
    window.addEventListener('storage', storageHandler);

    return () => {
      subscribers.delete(callback);
      window.removeEventListener('storage', storageHandler);
    };
  },

  async crearTarifa(datos: {
    nombre: string;
    origen: string;
    destino: string;
    valor: number;
    descripcion?: string;
    activa?: boolean;
  }): Promise<Tarifa> {
    if (!datos.nombre.trim()) throw new Error('El nombre de la tarifa es obligatorio.');
    if (!datos.origen.trim()) throw new Error('El punto de origen es obligatorio.');
    if (!datos.destino.trim()) throw new Error('El punto de destino es obligatorio.');
    if (isNaN(datos.valor) || datos.valor <= 0) {
      throw new Error('El valor de la tarifa debe ser un número positivo.');
    }

    const nueva: Tarifa = {
      id: `tar_${Date.now()}`,
      nombre: datos.nombre.trim(),
      origen: datos.origen.trim(),
      destino: datos.destino.trim(),
      valor: Number(datos.valor),
      descripcion: datos.descripcion?.trim() || '',
      activa: datos.activa ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const actual = getStoredTarifas();
    const actualizado = [nueva, ...actual];
    persistAndBroadcast(actualizado);
    return nueva;
  },

  async actualizarTarifa(id: string, datos: Partial<Omit<Tarifa, 'id' | 'createdAt'>>): Promise<Tarifa> {
    const actual = getStoredTarifas();
    const index = actual.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Tarifa no encontrada en la base de datos.');

    if (datos.valor !== undefined && (isNaN(datos.valor) || datos.valor <= 0)) {
      throw new Error('El valor debe ser superior a 0.');
    }

    const tarifaModificada: Tarifa = {
      ...actual[index],
      ...datos,
      updatedAt: new Date().toISOString(),
    };

    actual[index] = tarifaModificada;
    persistAndBroadcast([...actual]);
    return tarifaModificada;
  },

  async toggleActiva(id: string): Promise<boolean> {
    const actual = getStoredTarifas();
    const index = actual.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Tarifa no encontrada.');

    const nuevoEstado = !actual[index].activa;
    actual[index] = {
      ...actual[index],
      activa: nuevoEstado,
      updatedAt: new Date().toISOString(),
    };

    persistAndBroadcast([...actual]);
    return nuevoEstado;
  },

  async eliminarTarifa(id: string): Promise<void> {
    const actual = getStoredTarifas();
    const filtrado = actual.filter((t) => t.id !== id);
    persistAndBroadcast(filtrado);
  },

  /**
   * Restablecer a las 34 tarifas oficiales 2026 de Rápido El Carmen S.A.
   */
  restablecerTarifasOficiales(): Tarifa[] {
    persistAndBroadcast(TARIFAS_RAPIDO_EL_CARMEN_2026);
    return TARIFAS_RAPIDO_EL_CARMEN_2026;
  },
};
