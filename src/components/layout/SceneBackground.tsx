'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass }      from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// ── Full-page camera waypoints (scroll 0→1 over entire document) ──
const WAYPOINTS = [
  { progress: 0.00, x: 0, y: 30, z:  300 },
  { progress: 0.25, x: 0, y: 40, z:  -50 },
  { progress: 0.50, x: 0, y: 50, z: -400 },
  { progress: 0.70, x: 0, y: 60, z: -700 },
  { progress: 0.90, x: 0, y: 65, z: -950 },
]

function interpolateCam(progress: number) {
  const clamped = Math.max(0, Math.min(1, progress))
  let prev = WAYPOINTS[0]
  let next = WAYPOINTS[WAYPOINTS.length - 1]
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (clamped >= WAYPOINTS[i].progress && clamped <= WAYPOINTS[i + 1].progress) {
      prev = WAYPOINTS[i]
      next = WAYPOINTS[i + 1]
      break
    }
  }
  const range = next.progress - prev.progress
  const t     = range === 0 ? 0 : (clamped - prev.progress) / range
  return {
    x: prev.x + (next.x - prev.x) * t,
    y: prev.y + (next.y - prev.y) * t,
    z: prev.z + (next.z - prev.z) * t,
  }
}

export default function SceneBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Mutable scene state ──
    const smoothCam  = { x: 0, y: 30, z: 300 }
    const targetCam  = { x: 0, y: 30, z: 300 }
    const stars:    THREE.Points[] = []
    const mountains: THREE.Mesh[]  = []
    let   nebula:    THREE.Mesh | null = null
    let   locations: number[]          = []
    let   animId:    number

    // ── Scene ──
    const scene = new THREE.Scene()
    scene.fog   = new THREE.FogExp2(0x000000, 0.00022)

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 30, 300)

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.55

    // ── Post-processing (bloom) ──
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.75, 0.38, 0.82
    ))

    // ── Star fields (3 rotating layers, starColor attribute — no vertexColors:true) ──
    for (let layer = 0; layer < 3; layer++) {
      const count = 4000
      const geo   = new THREE.BufferGeometry()
      const pos   = new Float32Array(count * 3)
      const col   = new Float32Array(count * 3)
      const size  = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const r     = 250 + Math.random() * 750
        const theta = Math.random() * Math.PI * 2
        const phi   = Math.acos(Math.random() * 2 - 1)
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i*3+2] = r * Math.cos(phi)

        const pick = Math.random()
        if (pick < 0.12) {
          col[i*3] = 0.788; col[i*3+1] = 0.659; col[i*3+2] = 0.298  // Gold
        } else if (pick < 0.25) {
          col[i*3] = 0.48;  col[i*3+1] = 0.18;  col[i*3+2] = 0.82   // Purple
        } else if (pick < 0.35) {
          col[i*3] = 0.75;  col[i*3+1] = 0.82;  col[i*3+2] = 1.0    // Blue-white
        } else {
          const v = 0.8 + Math.random() * 0.2
          col[i*3] = v; col[i*3+1] = v; col[i*3+2] = v               // White
        }
        size[i] = 0.4 + Math.random() * 1.8
      }

      geo.setAttribute('position',  new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('starColor', new THREE.BufferAttribute(col, 3))
      geo.setAttribute('size',      new THREE.BufferAttribute(size, 1))

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time:  { value: 0 },
          depth: { value: layer },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 starColor;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;
          void main() {
            vColor = starColor;
            vec3 p = position;
            float a = time * 0.04 * (1.0 - depth * 0.28);
            float c = cos(a); float s = sin(a);
            p.xy = mat2(c,-s,s,c) * p.xy;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.0, 0.5, d));
          }
        `,
        transparent: true,
        blending:    THREE.AdditiveBlending,
        depthWrite:  false,
      })
      const sf = new THREE.Points(geo, mat)
      scene.add(sf)
      stars.push(sf)
    }

    // ── Nebula (EMBARC purple → void) ──
    const nebGeo = new THREE.PlaneGeometry(8000, 4000, 100, 100)
    const nebMat = new THREE.ShaderMaterial({
      uniforms: {
        time:    { value: 0 },
        col1:    { value: new THREE.Color('#3D0F6B') },
        col2:    { value: new THREE.Color('#0D0618') },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z += sin(p.x*0.005+time)*cos(p.y*0.005+time)*22.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 col1;
        uniform vec3 col2;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        void main() {
          float m = sin(vUv.x*8.0+time*0.3)*cos(vUv.y*8.0+time*0.22);
          vec3 col = mix(col1, col2, m*0.5+0.5);
          float a = opacity*(1.0 - length(vUv-0.5)*1.9);
          gl_FragColor = vec4(col, max(0.0,a));
        }
      `,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      side:        THREE.DoubleSide,
      depthWrite:  false,
    })
    nebula = new THREE.Mesh(nebGeo, nebMat)
    nebula.position.z = -600
    scene.add(nebula)

    // ── Mountains (4 parallax layers) ──
    const LAYERS = [
      { distance: -50,  height: 60,  color: 0x1A0A2E, opacity: 1.0 },
      { distance: -100, height: 80,  color: 0x0D0618, opacity: 0.85 },
      { distance: -150, height: 100, color: 0x3D0F6B, opacity: 0.55 },
      { distance: -200, height: 120, color: 0x6B21A8, opacity: 0.3  },
    ]

    LAYERS.forEach((layer, idx) => {
      const pts: THREE.Vector2[] = []
      const segs = 60
      for (let i = 0; i <= segs; i++) {
        const x = (i / segs - 0.5) * 1200
        const y = Math.sin(i * 0.12 + idx) * layer.height
              + Math.sin(i * 0.06 + idx * 1.3) * layer.height * 0.5
              + (Math.random() * layer.height * 0.18) - 100
        pts.push(new THREE.Vector2(x, y))
      }
      pts.push(new THREE.Vector2(6000,  -400))
      pts.push(new THREE.Vector2(-6000, -400))

      const shape = new THREE.Shape(pts)
      const geo   = new THREE.ShapeGeometry(shape)
      const mat   = new THREE.MeshBasicMaterial({
        color:       layer.color,
        transparent: true,
        opacity:     layer.opacity,
        side:        THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.z = layer.distance
      mesh.position.y = layer.distance
      mesh.userData   = { baseZ: layer.distance, index: idx }
      scene.add(mesh)
      mountains.push(mesh)
    })

    locations = mountains.map(m => m.position.z)

    // ── Atmosphere sphere (brand purple rim) ──
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float i = pow(0.68 - dot(vNormal, vec3(0,0,1)), 2.0);
          vec3 c = vec3(0.24, 0.08, 0.42) * i;
          float pulse = sin(time*1.5)*0.08+0.92;
          gl_FragColor = vec4(c*pulse, i*0.2);
        }
      `,
      side:        THREE.BackSide,
      blending:    THREE.AdditiveBlending,
      transparent: true,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(600, 32, 32), atmoMat))

    // ── Animation loop ──
    const clock = new THREE.Timer()
    const animate = () => {
      animId = requestAnimationFrame(animate)
      clock.update()
      const t = clock.getElapsed()

      // Update uniforms
      stars.forEach(sf => {
        (sf.material as THREE.ShaderMaterial).uniforms.time.value = t
      })
      if (nebula) (nebula.material as THREE.ShaderMaterial).uniforms.time.value = t * 0.4
      atmoMat.uniforms.time.value = t

      // Smooth camera
      smoothCam.x += (targetCam.x - smoothCam.x) * 0.045
      smoothCam.y += (targetCam.y - smoothCam.y) * 0.045
      smoothCam.z += (targetCam.z - smoothCam.z) * 0.045

      camera.position.set(
        smoothCam.x + Math.sin(t * 0.08) * 2,
        smoothCam.y + Math.cos(t * 0.12) * 1,
        smoothCam.z,
      )
      camera.lookAt(0, 10, -600)

      // Mountain ambient sway
      mountains.forEach((m, i) => {
        const pf = 1 + i * 0.4
        m.position.x = Math.sin(t * 0.1) * 2 * pf
      })

      composer.render()
    }
    animate()

    // ── Scroll handler — full-page camera waypoints + mountain parallax ──
    const onScroll = () => {
      const scrollY   = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = Math.min(scrollY / Math.max(1, maxScroll), 1)

      // Camera position from waypoints
      const cam = interpolateCam(progress)
      targetCam.x = cam.x
      targetCam.y = cam.y
      targetCam.z = cam.z

      // Mountains: hide at progress > 0.35
      mountains.forEach((m, i) => {
        if (progress > 0.35) {
          m.position.z = 600000
        } else {
          const speed   = 1 + i * 0.9
          const targetZ = locations[i] + scrollY * speed * 0.45
          m.position.z  = locations[i]
          m.position.y  = 50 + (targetZ - locations[i]) * 0.04
        }
      })

      // Nebula drifts deeper
      if (nebula) {
        nebula.position.z = progress > 0.35
          ? -600 - progress * 600
          : -600 - scrollY * 0.3
      }
    }

    // ── Mouse parallax ──
    const onMouse = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth  - 0.5
      targetCam.x = targetCam.x + nx * 20 - targetCam.x * 0.06
    }

    // ── Resize ──
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('scroll',    onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('resize',    onResize)
    onScroll()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize',    onResize)
      stars.forEach(s => {
        s.geometry.dispose()
        ;(s.material as THREE.Material).dispose()
      })
      mountains.forEach(m => {
        m.geometry.dispose()
        ;(m.material as THREE.Material).dispose()
      })
      if (nebula) {
        nebula.geometry.dispose()
        ;(nebula.material as THREE.Material).dispose()
      }
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        width:         '100%',
        height:        '100%',
        display:       'block',
      }}
    />
  )
}
