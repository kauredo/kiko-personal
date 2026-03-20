/**
 * GUITAR — "The Instrument"
 * 3D guitar as hero centerpiece. Rotates on scroll.
 * Strings vibrate on hover. Guitar neck as visual motif.
 * Dark, moody, premium product-page energy.
 */
import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { ArrowUpRight } from "lucide-react";

// ── 3D Guitar from primitives ──
function GuitarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle rotation following mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.3,
      0.05,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.15 - 0.1,
      0.05,
    );
    // Gentle float
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  const bodyColor = new THREE.Color("oklch(0.25 0.05 30)");
  const neckColor = new THREE.Color("oklch(0.35 0.06 60)");
  const metalColor = new THREE.Color("oklch(0.70 0.02 80)");
  const stringColor = new THREE.Color("oklch(0.80 0.01 80)");

  return (
    <group ref={groupRef} rotation={[0.1, -0.3, 0]} position={[0, -0.2, 0]} scale={0.8}>
      {/* Guitar body */}
      <mesh position={[0, -1.2, 0]}>
        <capsuleGeometry args={[0.8, 0.4, 16, 32]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.25} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.1} envMapIntensity={1.2} />
      </mesh>

      {/* Body cutaway detail */}
      <mesh position={[0.3, -0.6, 0.05]}>
        <capsuleGeometry args={[0.3, 0.1, 8, 16]} />
        <meshPhysicalMaterial color={bodyColor} roughness={0.3} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>

      {/* Pickguard */}
      <mesh position={[-0.15, -1.0, 0.42]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.6, 0.7, 0.02]} />
        <meshStandardMaterial color="oklch(0.15 0.02 260)" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.18, 2.4, 0.12]} />
        <meshStandardMaterial color={neckColor} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Fretboard */}
      <mesh position={[0, 0.8, 0.07]}>
        <boxGeometry args={[0.16, 2.4, 0.02]} />
        <meshStandardMaterial color="oklch(0.12 0.02 30)" roughness={0.8} />
      </mesh>

      {/* Frets */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[0, 2.0 - i * 0.18, 0.09]}>
          <boxGeometry args={[0.17, 0.008, 0.01]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.8} />
        </mesh>
      ))}

      {/* Headstock */}
      <mesh position={[0, 2.15, 0]}>
        <boxGeometry args={[0.22, 0.35, 0.10]} />
        <meshStandardMaterial color={neckColor} roughness={0.5} />
      </mesh>

      {/* Tuning pegs */}
      {[-0.14, -0.07, 0, 0.07, 0.14].map((x, i) => (
        <mesh key={i} position={[x, 2.25 + (i % 2) * 0.08, 0.08]}>
          <cylinderGeometry args={[0.015, 0.02, 0.06, 8]} />
          <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.9} />
        </mesh>
      ))}

      {/* Strings */}
      {[-0.05, -0.025, 0, 0.025, 0.05].map((x, i) => (
        <mesh key={`s${i}`} position={[x, 0.2, 0.12]}>
          <cylinderGeometry args={[0.002 - i * 0.0002, 0.002 - i * 0.0002, 3.5, 4]} />
          <meshStandardMaterial color={stringColor} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Bridge */}
      <mesh position={[0, -1.5, 0.42]}>
        <boxGeometry args={[0.3, 0.04, 0.03]} />
        <meshStandardMaterial color={metalColor} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Pickups */}
      {[-0.9, -1.2].map((y, i) => (
        <mesh key={`p${i}`} position={[0, y, 0.43]}>
          <boxGeometry args={[0.25, 0.08, 0.03]} />
          <meshStandardMaterial color="oklch(0.20 0.01 260)" roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function GuitarScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#ffe8d6" />
        <spotLight position={[0, -2, 4]} intensity={0.6} penumbra={1} color="#ffd4a3" angle={0.5} />
        <Suspense fallback={null}>
          <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.2}>
            <GuitarModel />
          </Float>
          <Environment preset="studio" backgroundBlurriness={1} background={false} environmentIntensity={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const STATS = [
  { val: "10+", label: "Years" },
  { val: "200+", label: "Shows" },
  { val: "50+", label: "Sessions" },
];

const EVENTS = [
  { date: "APR 15", title: "Rock Soul Night", venue: "Coliseu de Lisboa" },
  { date: "MAY 02", title: "Jazz & Soul Session", venue: "Hot Clube" },
  { date: "JUN 20", title: "Summer Festival", venue: "Parque das Nacoes" },
];

export function HomeGuitar() {
  const fg = "oklch(0.92 0.01 60)";
  const mutedFg = "oklch(0.45 0.01 260)";
  const primary = "oklch(0.70 0.12 60)";
  const border = "oklch(0.20 0.01 260)";
  const card = "oklch(0.12 0.01 260)";

  return (
    <div className="min-h-screen bg-[oklch(0.07_0.005_260)] text-white" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-16 lg:px-24">
        <span className="text-lg font-bold" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: fg }}>FC</span>
        <div className="flex items-center gap-6">
          {["Work", "Events", "Contact"].map((l) => (
            <span key={l} className="hidden text-xs uppercase md:block" style={{ letterSpacing: "0.15em", color: mutedFg, cursor: "pointer" }}>{l}</span>
          ))}
          <ThemeSwitcher />
        </div>
      </nav>

      {/* ═══ HERO — 3D Guitar ═══ */}
      <section className="relative min-h-screen overflow-hidden">
        <GuitarScene />

        {/* Text overlaid on left */}
        <div className="relative z-10 flex min-h-screen flex-col justify-end px-8 pb-20 md:px-16 lg:px-24">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <p className="mb-4 text-[10px] uppercase" style={{ letterSpacing: "0.3em", color: mutedFg }}>
              Guitar &middot; Keys &middot; MD &middot; Production
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
              Francisco<br />
              <span style={{ color: primary }}>Catarro</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed" style={{ color: mutedFg }}>
              Born in Portugal, based in the UK. Over a decade of performing,
              composing, arranging, and recording across genres and stages.
            </p>
            <a
              href="mailto:contact@franciscocatarro.com"
              className="mt-8 inline-flex items-center gap-3 border px-8 py-4 text-xs font-medium uppercase transition-colors hover:bg-white/10"
              style={{ borderColor: border, color: fg, letterSpacing: "0.15em" }}
            >
              Work with me <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="grid grid-cols-3" style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center py-14" style={{ borderRight: i < 2 ? `1px solid ${border}` : "none" }}>
            <span className="text-3xl md:text-4xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: primary }}>{s.val}</span>
            <span className="mt-2 text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: mutedFg }}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: primary }}>About</p>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
              The sound of<br />versatility.
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5">
            <p className="leading-relaxed" style={{ color: fg }}>
              Francisco Catarro is a guitarist, pianist, musical director, and producer whose
              playing carries the raw energy of a live stage and the precision of years behind the keys.
            </p>
            <p className="leading-relaxed" style={{ color: mutedFg }}>
              From rock clubs to symphony halls, from the studio console to center stage — he
              doesn't just show up, he transforms the room. That's why people keep calling him back.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED IMAGE ═══ */}
      <div className="px-8 md:px-16 lg:px-24">
        <div className="mx-auto max-w-5xl overflow-hidden" style={{ aspectRatio: "21/9", background: card, border: `1px solid ${border}` }}>
          <div className="flex h-full items-center justify-center" style={{ color: `${mutedFg}44` }}>
            <span className="text-xs uppercase" style={{ letterSpacing: "0.2em" }}>Featured Photo</span>
          </div>
        </div>
      </div>

      {/* ═══ EVENTS ═══ */}
      <section className="px-8 py-24 md:px-16 md:py-32 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: primary }}>Live</p>
          <h2 className="mb-16" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}>
            Upcoming shows
          </h2>
          {EVENTS.map((e, i) => (
            <div key={i} className="group flex items-center justify-between py-7 transition-colors hover:bg-white/[0.02]" style={{ borderTop: `1px solid ${border}` }}>
              <div className="flex items-baseline gap-8 md:gap-12">
                <span className="w-20 text-2xl md:text-3xl" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: `${fg}33` }}>{e.date}</span>
                <div>
                  <h3 className="text-base font-medium md:text-lg">{e.title}</h3>
                  <p className="mt-0.5 text-sm" style={{ color: mutedFg }}>{e.venue}</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="transition-colors" style={{ color: mutedFg }} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="px-8 py-28 text-center md:py-36" style={{ borderTop: `1px solid ${border}` }}>
        <p className="mb-3 text-[10px] uppercase" style={{ letterSpacing: "0.25em", color: primary }}>Contact</p>
        <h2 className="mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.1 }}>
          Let's create together
        </h2>
        <p className="mx-auto mb-10 max-w-md text-sm" style={{ color: mutedFg }}>
          Available for booking, collaboration, session work, and musical direction.
        </p>
        <a
          href="mailto:contact@franciscocatarro.com"
          className="inline-flex items-center gap-2 border px-10 py-4 text-xs uppercase transition-colors hover:bg-white/10"
          style={{ borderColor: primary, color: primary, letterSpacing: "0.2em" }}
        >
          Get in touch <ArrowUpRight size={14} />
        </a>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex flex-col items-center gap-6 px-8 py-16 text-center md:flex-row md:justify-between md:px-16 lg:px-24" style={{ borderTop: `1px solid ${border}` }}>
        <span className="text-[11px] uppercase" style={{ letterSpacing: "0.15em", color: mutedFg }}>&copy; {new Date().getFullYear()} Francisco Catarro</span>
        <span className="text-sm" style={{ fontFamily: "'Instrument Serif', Georgia, serif", color: `${fg}55` }}>
          Music is the only language that doesn't need translation.
        </span>
      </footer>
    </div>
  );
}
