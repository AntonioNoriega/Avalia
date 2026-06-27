// ════════════════════════════════════════════════════════════════
//  Avalia · Seed de datos demo
//  Ejecutar: npm run seed   (node --env-file=.env src/config/seed.js)
//  Requiere haber corrido schema.sql en Supabase previamente.
// ════════════════════════════════════════════════════════════════
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase.js'

const rnd = (min, max) => Math.round(min + Math.random() * (max - min))

async function seedUsuarios () {
  const pass = await bcrypt.hash('Avalia2026', 12)
  const usuarios = [
    { nombre: 'Admin Avalia',      email: 'admin@avalia.mx',    rol: 'admin',            password_hash: pass },
    { nombre: 'Valeria Valuadora', email: 'valuador@avalia.mx', rol: 'valuador',         password_hash: pass },
    { nombre: 'Aldo Analista',     email: 'analista@avalia.mx', rol: 'analista_mercado', password_hash: pass },
    { nombre: 'Carla Cliente',     email: 'cliente@avalia.mx',  rol: 'cliente',          password_hash: pass },
  ]
  const { data, error } = await supabaseAdmin
    .from('usuarios').upsert(usuarios, { onConflict: 'email' }).select('id,email,rol')
  if (error) throw error
  console.log(`✓ usuarios: ${data.length} (contraseña demo: Avalia2026)`)
  return data
}

async function seedZonas () {
  const zonas = [
    { estado: 'Guerrero', municipio: 'Acapulco', colonia: 'Costa Azul',      cp: '39850' },
    { estado: 'Guerrero', municipio: 'Acapulco', colonia: 'Fraccionamiento Magallanes', cp: '39670' },
    { estado: 'Guerrero', municipio: 'Acapulco', colonia: 'Centro',          cp: '39300' },
    { estado: 'Guerrero', municipio: 'Acapulco', colonia: 'Diamante',        cp: '39907' },
  ]
  const { data, error } = await supabaseAdmin
    .from('zonas').upsert(zonas, { onConflict: 'estado,municipio,colonia' }).select('id,colonia')
  if (error) throw error
  console.log(`✓ zonas: ${data.length}`)
  return data
}

async function seedComparables (zonas) {
  // base de precio por m² (MXN) por colonia
  const basePorZona = {
    'Costa Azul': 28000, 'Fraccionamiento Magallanes': 22000, 'Centro': 18000, 'Diamante': 35000,
  }
  const tipos = ['casa', 'departamento']
  const conservas = ['nuevo', 'bueno', 'regular']

  // Regenera el set de seed cada vez (idempotente para datos de seed)
  await supabaseAdmin.from('comparables_mercado').delete().eq('origen', 'seed')

  const filas = []
  for (const z of zonas) {
    const base = basePorZona[z.colonia] || 20000
    for (const tipo of tipos) {
      const imagenesCasas = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
      ]
      const imagenesDeps = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=600&q=80'
      ]
      for (let i = 0; i < 8; i++) {
        const construccion = rnd(60, 220)
        const variacion = 0.85 + Math.random() * 0.3 // ±15%
        const precio_m2 = Math.round(base * variacion)
        const imgUrl = tipo === 'casa' 
          ? imagenesCasas[i % imagenesCasas.length] 
          : imagenesDeps[i % imagenesDeps.length]
        
        filas.push({
          tipo, zona_id: z.id,
          superficie_m2: construccion + rnd(0, 120),
          construccion_m2: construccion,
          recamaras: rnd(1, 4), banos: rnd(1, 3), estacionamientos: rnd(0, 2),
          antiguedad_anios: rnd(0, 25),
          estado_conserva: conservas[rnd(0, conservas.length - 1)],
          precio: precio_m2 * construccion,
          fecha_operacion: new Date(Date.now() - rnd(0, 180) * 864e5).toISOString().slice(0, 10),
          imagen_url: imgUrl,
          origen: 'seed',
        })
      }
    }
  }
  const { data, error } = await supabaseAdmin.from('comparables_mercado').insert(filas).select('id')
  if (error) throw error
  console.log(`✓ comparables_mercado: ${data.length}`)
}

async function seedInmuebleDemo (usuarios, zonas) {
  const cliente = usuarios.find(u => u.rol === 'cliente')
  const admin = usuarios.find(u => u.rol === 'admin')
  
  // Limpiamos los inmuebles anteriores para evitar duplicados
  await supabaseAdmin.from('inmuebles').delete().in('usuario_id', [cliente.id, admin.id])

  const inmuebles = [
    {
      usuario_id: cliente.id,
      tipo: 'departamento',
      zona_id: zonas.find(z => z.colonia === 'Costa Azul')?.id || zonas[0].id,
      superficie_m2: 90,
      construccion_m2: 80,
      recamaras: 2,
      banos: 2,
      estacionamientos: 1,
      antiguedad_anios: 5,
      estado_conserva: 'bueno',
      imagen_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
    },
    {
      usuario_id: admin.id,
      tipo: 'casa',
      zona_id: zonas.find(z => z.colonia === 'Diamante')?.id || zonas[0].id,
      superficie_m2: 350,
      construccion_m2: 300,
      recamaras: 4,
      banos: 4,
      estacionamientos: 3,
      antiguedad_anios: 2,
      estado_conserva: 'nuevo',
      imagen_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80'
    },
    {
      usuario_id: admin.id,
      tipo: 'casa',
      zona_id: zonas.find(z => z.colonia === 'Centro')?.id || zonas[0].id,
      superficie_m2: 180,
      construccion_m2: 150,
      recamaras: 3,
      banos: 2,
      estacionamientos: 1,
      antiguedad_anios: 15,
      estado_conserva: 'regular',
      imagen_url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'
    },
    {
      usuario_id: cliente.id,
      tipo: 'departamento',
      zona_id: zonas.find(z => z.colonia === 'Fraccionamiento Magallanes')?.id || zonas[0].id,
      superficie_m2: 120,
      construccion_m2: 110,
      recamaras: 3,
      banos: 2,
      estacionamientos: 2,
      antiguedad_anios: 8,
      estado_conserva: 'bueno',
      imagen_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    },
    {
      usuario_id: admin.id,
      tipo: 'oficina',
      zona_id: zonas.find(z => z.colonia === 'Diamante')?.id || zonas[0].id,
      superficie_m2: 150,
      construccion_m2: 150,
      recamaras: 0,
      banos: 2,
      estacionamientos: 4,
      antiguedad_anios: 1,
      estado_conserva: 'nuevo',
      imagen_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
    },
    {
      usuario_id: admin.id,
      tipo: 'local',
      zona_id: zonas.find(z => z.colonia === 'Centro')?.id || zonas[0].id,
      superficie_m2: 70,
      construccion_m2: 70,
      recamaras: 0,
      banos: 1,
      estacionamientos: 0,
      antiguedad_anios: 10,
      estado_conserva: 'bueno',
      imagen_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80'
    }
  ]

  const { error } = await supabaseAdmin.from('inmuebles').insert(inmuebles)
  if (error) throw error
  console.log('✓ Se crearon 6 inmuebles demo con fotos de alta resolución')
}

async function main () {
  try {
    const usuarios = await seedUsuarios()
    const zonas    = await seedZonas()
    await seedComparables(zonas)
    await seedInmuebleDemo(usuarios, zonas)
    console.log('\n✔ Seed completado.')
  } catch (e) {
    console.error('✖ Error en seed:', e.message || e)
    process.exit(1)
  }
}
main()
