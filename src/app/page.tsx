"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, ChevronRight, Menu, X, Shield, BedDouble, Crown, UtensilsCrossed, Smile, ClipboardList, Sparkles, FileBarChart2, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  }),
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { usuario, cargando, logout, esEmpleado, esCliente, puedeVerVillas } = useAuth();

  const habitaciones = [
    { nombre: "Habitación Clásica", precio: "$250", img: "/imagenes/RegularB.jpg", desc: "Elegancia intemporal con vistas a los jardines." },
    { nombre: "Suite Premium", precio: "$400", img: "/imagenes/PremiumA.jpg", desc: "Espacios amplios con balcón privado y amenidades de lujo." },
    { nombre: "Suite VIP", precio: "$650", img: "/imagenes/VIPA.jpg", desc: "El pináculo del lujo con vistas panorámicas." },
  ];

  const villas = [
    { nombre: "Villa Zafiro", precio: "$900", img: "/imagenes/villaA1.jpg", desc: "Un refugio íntimo rodeado de naturaleza exótica." },
    { nombre: "Villa Esmeralda", precio: "$1,200", img: "/imagenes/villaB1.jpg", desc: "Diseño majestuoso con piscina privada." },
    { nombre: "Villa Diamante", precio: "$1,800", img: "/imagenes/villaC1.jpg", desc: "Nuestra residencia más imponente." },
  ];

  const memberships = [
    { tipo: "ESTÁNDAR", color: "border-luxury-charcoal/20", bg: "bg-white", beneficios: ["Habitaciones regulares", "Amenidades básicas", "Cancelación hasta 48 hrs", "Acceso a restaurante"], precio: "Incluida", badge: null },
    { tipo: "PREMIUM", color: "border-luxury-gold", bg: "bg-luxury-champagne/20", beneficios: ["Villas (mín. 2 noches)", "Amenidades extendidas", "Cancelación hasta 24 hrs", "Upgrades temporales", "Prioridad en reservas"], precio: "Desde $1,500 / trimestre", badge: null },
    { tipo: "VIP", color: "border-purple-300", bg: "bg-purple-50/30", beneficios: ["Acceso total a villas", "Amenidades sin límite", "Cancelación hasta check-in", "Upgrades máximos", "Servicio de mayordomo", "Eventos exclusivos"], precio: "Desde $3,000 / trimestre", badge: "Más Popular" },
  ];

  const adminCards = [
    { href: "/gestion-usuarios", icon: Shield, badge: "Administrador", title: "Gestión de Usuarios", desc: "Administra accesos, roles y privilegios." },
    { href: "/reservas-alojamiento", icon: BedDouble, badge: "Recepción", title: "Reservas de Alojamiento", desc: "Crea y gestiona reservas con upgrades automáticos." },
    { href: "/tipos-clientes", icon: Crown, badge: "Fidelización", title: "Membresías y Clientes", desc: "Registra clientes y gestiona membresías." },
    { href: "/restaurante", icon: UtensilsCrossed, badge: "Restaurante", title: "Reservas de Restaurante", desc: "Gestiona turnos y disponibilidad en tiempo real." },
    { href: "/kids-club", icon: Smile, badge: "Entretenimiento", title: "Kids Club", desc: "Inscripción y control de actividades infantiles." },
    { href: "/higiene", icon: Sparkles, badge: "Operaciones", title: "Higiene y Alojamiento", desc: "Ciclo de limpieza y privacidad de habitaciones." },
    { href: "/bitacora-restaurante", icon: ClipboardList, badge: "Bitácora", title: "Bitácora del Restaurante", desc: "Registro de check-in y estado de turnos." },
    { href: "/reportes", icon: FileBarChart2, badge: "Reportes", title: "Reportes de Villas y Servicios", desc: "Estadísticas de ocupación, ingresos y uso de servicios." },
  ];

  const mostrarVillas = !usuario || esEmpleado || puedeVerVillas;

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-black font-sans">

      {/* ═══ NAVBAR ═══ */}
      <header className="fixed top-0 w-full z-50 bg-luxury-ivory/90 backdrop-blur-md border-b border-luxury-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] text-luxury-black font-light">EL REFUGIO</Link>

          <nav className="hidden md:flex gap-8 items-center">
            {[
              { label: "Hospedaje", href: "#hospedaje" },
              { label: "Amenidades", href: "#amenidades" },
              { label: "Membresías", href: "#membresias" },
              ...(esEmpleado ? [{ label: "Administración", href: "#admin" }] : []),
            ].map(link => (
              <a key={link.href} href={link.href}
                className="text-xs uppercase tracking-[0.15em] font-semibold text-luxury-charcoal/60 hover:text-luxury-black transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {cargando ? (
              <div className="w-24 h-10 rounded-xl bg-luxury-champagne/50 animate-pulse" />
            ) : usuario ? (
              <>
                <div className="hidden md:flex items-center gap-2 rounded-2xl border border-luxury-gold/25 bg-luxury-champagne/30 px-4 py-2">
                  <User size={14} className="text-luxury-gold" />
                  <div className="text-xs">
                    <p className="font-semibold text-luxury-black leading-tight">{usuario.nombre_completo}</p>
                    <p className="text-luxury-charcoal/50 leading-tight">{usuario.rol_nombre}</p>
                  </div>
                </div>
                <button onClick={logout}
                  className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-luxury-charcoal/50 hover:text-red-600 transition-colors px-3 py-2">
                  <LogOut size={14} /> Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/registro" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-semibold text-luxury-charcoal/60 hover:text-luxury-black transition-colors px-3 py-2">Registrarse</Link>
                <Link href="/login" className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.1em] font-semibold text-luxury-black bg-luxury-gold px-6 py-3 rounded hover:bg-luxury-gold/80 transition-colors">
                  <LogIn size={14} /> Iniciar Sesión
                </Link>
              </>
            )}
            <button className="md:hidden text-luxury-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-luxury-ivory border-t border-luxury-charcoal/10 px-6 py-6 space-y-4">
            {[
              { label: "Hospedaje", href: "#hospedaje" },
              { label: "Amenidades", href: "#amenidades" },
              { label: "Membresías", href: "#membresias" },
              ...(esEmpleado ? [{ label: "Administración", href: "#admin" }] : []),
            ].map(link => (
              <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
                className="block text-sm uppercase tracking-wider text-luxury-charcoal/70 hover:text-luxury-black">{link.label}</a>
            ))}
            {usuario ? (
              <div className="pt-4 border-t border-luxury-charcoal/10 space-y-3">
                <p className="text-sm font-semibold text-luxury-black">{usuario.nombre_completo}</p>
                <p className="text-xs text-luxury-charcoal/50">{usuario.rol_nombre}</p>
                <button onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="block text-sm text-red-600 font-semibold">Cerrar Sesión</button>
              </div>
            ) : (
              <>
                <Link href="/registro" onClick={() => setIsMenuOpen(false)}
                  className="block text-center text-sm uppercase tracking-wider text-luxury-charcoal/70 hover:text-luxury-black">Registrarse</Link>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}
                  className="block text-center text-sm uppercase tracking-wider font-semibold text-luxury-black bg-luxury-gold px-6 py-3 rounded mt-4">Iniciar Sesión</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/imagenes/HotelA.png" alt="Hotel Exterior" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-[900px] mt-24">
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="font-serif text-5xl md:text-7xl text-white mb-8 drop-shadow-lg leading-tight">
            Donde el Lujo se Encuentra con la Naturaleza
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
            className="text-lg md:text-xl text-white/90 mb-12 drop-shadow-md">
            Experimente la elegancia clásica y la sofisticación moderna
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.4}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/reservas-alojamiento"
              className="bg-luxury-gold text-luxury-black text-xs uppercase tracking-[0.1em] font-semibold px-10 py-4 rounded hover:bg-luxury-champagne transition-colors shadow-[0_20px_40px_rgba(10,10,10,0.3)]">
              Reservar Ahora
            </Link>
            <a href="#hospedaje"
              className="border border-white text-white text-xs uppercase tracking-[0.1em] font-semibold px-10 py-4 rounded hover:bg-white hover:text-luxury-black transition-colors duration-300">
              Explorar
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ BIENVENIDA PERSONALIZADA ═══ */}
      {usuario && (
        <section className="py-12 px-6 bg-luxury-champagne/20 border-b border-luxury-gold/15">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-luxury-black text-luxury-gold font-serif text-xl font-bold">
                {usuario.nombre_completo.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="font-serif text-2xl text-luxury-black">Bienvenido, {usuario.nombre_completo.split(' ')[0]}</p>
                <p className="text-sm text-luxury-charcoal/60">
                  {esEmpleado ? `${usuario.rol_nombre} — Acceso al panel de administración` : `Cliente ${usuario.tipo_cliente} — Disfruta tu estancia`}
                </p>
              </div>
            </div>
            {esCliente && (
              <div className="flex gap-3">
                <Link href="/reservas-alojamiento" className="rounded-2xl bg-luxury-black px-5 py-2.5 text-xs font-semibold text-luxury-gold uppercase tracking-wider hover:bg-luxury-charcoal transition">Mis Reservas</Link>
                <Link href="/tipos-clientes" className="rounded-2xl border border-luxury-gold/30 px-5 py-2.5 text-xs font-semibold text-luxury-charcoal uppercase tracking-wider hover:bg-luxury-champagne transition">Mi Membresía</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══ INTRO ═══ */}
      <section className="py-28 px-6 max-w-[800px] mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-6">Una Estancia Inolvidable</h2>
        <div className="w-16 h-px bg-luxury-gold mx-auto mb-10" />
        <p className="text-lg text-luxury-charcoal/70 leading-relaxed">
          Descubra un santuario donde la arquitectura minimalista abraza la belleza indómita de la costa.
          Cada detalle de El Refugio ha sido meticulosamente diseñado para ofrecer una experiencia de
          serenidad absoluta.
        </p>
      </section>

      {/* ═══ HOSPEDAJE ═══ */}
      <section id="hospedaje" className="bg-luxury-black py-28 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Habitaciones del Hotel</h2>
            <div className="w-16 h-px bg-luxury-gold mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
            {habitaciones.map(room => (
              <Link href="/reservas-alojamiento" key={room.nombre} className="group cursor-pointer block">
                <div className="relative h-[400px] mb-6 overflow-hidden">
                  <Image src={room.img} alt={room.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl mb-2">{room.nombre}</h3>
                  <p className="text-xs uppercase tracking-[0.15em] text-luxury-gold mb-3">Desde {room.precio} / noche</p>
                  <p className="text-sm text-gray-400">{room.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {mostrarVillas ? (
            <>
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Villas Exclusivas</h2>
                <div className="w-16 h-px bg-luxury-gold mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {villas.map(villa => (
                  <Link href="/reservas-alojamiento" key={villa.nombre} className="group cursor-pointer block">
                    <div className="relative h-[400px] mb-6 overflow-hidden">
                      <Image src={villa.img} alt={villa.nombre} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-serif text-2xl mb-2">{villa.nombre}</h3>
                      <p className="text-xs uppercase tracking-[0.15em] text-luxury-gold mb-3">Desde {villa.precio} / noche</p>
                      <p className="text-sm text-gray-400">{villa.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 border border-luxury-charcoal/20 rounded-3xl">
              <Crown size={40} className="text-luxury-gold mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-white mb-3">Villas Exclusivas</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Las villas están disponibles exclusivamente para nuestros miembros Premium y VIP.
                Actualice su membresía para acceder a estas experiencias únicas.
              </p>
              <Link href="/tipos-clientes"
                className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black text-xs uppercase tracking-wider font-semibold px-8 py-3 rounded hover:bg-luxury-champagne transition-colors">
                <Crown size={14} /> Ver Membresías
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══ AMENIDADES ═══ */}
      <section id="amenidades" className="py-28 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">Experiencias y Bienestar</h2>
          <div className="w-16 h-px bg-luxury-gold mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[700px]">
          <div className="relative h-[400px] md:h-full overflow-hidden group cursor-pointer">
            <Image src="/imagenes/SpaA.jpg" alt="Spa" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="font-serif text-3xl text-white mb-2">Spa &amp; Wellness</h3>
              <p className="text-white/80 text-sm">Santuario de relajación absoluta</p>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-8 h-[500px] md:h-full">
            <div className="relative overflow-hidden group cursor-pointer">
              <Image src="/imagenes/PiscinaA3.jpg" alt="Piscina" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="font-serif text-2xl text-white mb-1">Infinity Pool</h3>
                <p className="text-white/80 text-sm">Vistas panorámicas</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="relative overflow-hidden group cursor-pointer">
                <Image src="/imagenes/GymB.png" alt="Gimnasio" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-xl text-white">Fitness Center</h3>
                </div>
              </div>
              <div className="relative overflow-hidden group cursor-pointer">
                <Image src="/imagenes/WellnessA2.jpg" alt="Wellness" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-serif text-xl text-white">Clases Wellness</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MEMBRESÍAS ═══ */}
      <section id="membresias" className="py-28 px-6 lg:px-16 bg-luxury-champagne/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">Programa de Membresías</h2>
            <div className="w-16 h-px bg-luxury-gold mx-auto mb-6" />
            <p className="text-luxury-charcoal/70 max-w-2xl mx-auto">
              Descubra los beneficios exclusivos de cada nivel.
              {esCliente && usuario?.tipo_cliente && (
                <span className="block mt-2 font-semibold text-luxury-gold">Tu nivel actual: {usuario.tipo_cliente}</span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memberships.map(mem => {
              const esNivelActual = esCliente && usuario?.tipo_cliente && mem.tipo.includes(usuario.tipo_cliente);
              return (
                <div key={mem.tipo} className={`relative rounded-2xl border-2 ${esNivelActual ? 'border-luxury-gold ring-2 ring-luxury-gold/30' : mem.color} ${mem.bg} p-8 flex flex-col transition-shadow duration-300 hover:shadow-xl`}>
                  {mem.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs uppercase tracking-wider font-semibold px-4 py-1 rounded-full">{mem.badge}</div>}
                  {esNivelActual && <div className="absolute -top-3 right-4 bg-luxury-gold text-luxury-black text-xs uppercase tracking-wider font-semibold px-4 py-1 rounded-full">Tu plan</div>}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl text-luxury-black mb-1">{mem.tipo}</h3>
                    <p className="text-xs uppercase tracking-wider text-luxury-gold font-semibold">{mem.precio}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {mem.beneficios.map(b => (
                      <li key={b} className="flex items-start gap-3 text-sm text-luxury-charcoal/80"><span className="text-luxury-gold mt-0.5">✓</span>{b}</li>
                    ))}
                  </ul>
                  <Link href="/tipos-clientes" className={`block text-center text-xs uppercase tracking-[0.1em] font-semibold py-3 rounded transition-colors duration-300 ${
                    mem.tipo === 'VIP' ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : mem.tipo === 'PREMIUM' ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/80'
                    : 'bg-luxury-charcoal/10 text-luxury-charcoal hover:bg-luxury-charcoal/20'
                  }`}>
                    {esNivelActual ? 'Tu plan actual' : mem.tipo === 'ESTÁNDAR' ? 'Incluida con registro' : 'Solicitar Membresía'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PANEL ADMINISTRACIÓN — solo empleados ═══ */}
      {esEmpleado && (
        <section id="admin" className="py-28 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.25em] text-luxury-charcoal/50 mb-3">Acceso interno</p>
              <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">Panel de Administración</h2>
              <div className="w-16 h-px bg-luxury-gold mx-auto mb-6" />
              <p className="text-luxury-charcoal/70 max-w-2xl mx-auto">
                Sistema de gestión del resort — {usuario?.rol_nombre}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {adminCards.map(card => (
                <Link key={card.href} href={card.href}
                  className="group block rounded-2xl border border-luxury-charcoal/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-luxury-gold/40 hover:-translate-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-luxury-champagne/50 mb-5 group-hover:bg-luxury-gold/20 transition-colors">
                    <card.icon size={20} className="text-luxury-charcoal/70 group-hover:text-luxury-gold transition-colors" />
                  </div>
                  <span className="inline-block rounded-full bg-luxury-champagne/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-luxury-charcoal/60 mb-3">{card.badge}</span>
                  <h3 className="font-serif text-lg text-luxury-black mb-1">{card.title}</h3>
                  <p className="text-sm text-luxury-charcoal/60 leading-relaxed">{card.desc}</p>
                  <p className="mt-4 text-xs font-semibold text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">Acceder <ChevronRight size={14} /></p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-luxury-ivory border-t border-luxury-charcoal/10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="font-serif text-xl tracking-[0.2em] text-luxury-black mb-6 font-light">EL REFUGIO</div>
            <p className="text-sm text-luxury-charcoal/60 max-w-sm leading-relaxed">
              Redefiniendo el lujo y la sofisticación. Un destino exclusivo para los viajeros más exigentes.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-luxury-black mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm text-luxury-charcoal/60">
              <li><a href="#hospedaje" className="hover:text-luxury-gold transition-colors">Habitaciones y Villas</a></li>
              <li><a href="#amenidades" className="hover:text-luxury-gold transition-colors">Experiencias</a></li>
              <li><a href="#membresias" className="hover:text-luxury-gold transition-colors">Membresías</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-luxury-black mb-6">Contacto</h4>
            <ul className="space-y-3 text-sm text-luxury-charcoal/60">
              <li className="flex items-center gap-3"><MapPin size={14} className="text-luxury-gold" /> Av. del Mar 123, Paraíso</li>
              <li className="flex items-center gap-3"><Phone size={14} className="text-luxury-gold" /> +1 (800) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-16 mt-16 pt-8 border-t border-luxury-charcoal/10 text-xs text-luxury-charcoal/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} El Refugio Resort &amp; Villas. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-luxury-black transition-colors">Privacidad</a>
            <a href="#" className="hover:text-luxury-black transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
