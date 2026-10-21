import { useEffect, useRef } from 'react'
import { getTheme } from '@/lib/theme'
import * as THREE from 'three'

/**
 * 3D Kinetic Chain Web - Static Links, No Spinning
 *
 * Implements the mechanical chain motion:
 *  - 100% Static Links:
 *      * Zero spinning or axial roll.
 *      * Rigid, perfectly interlocked alternating 90-degree chain links.
 *  - Movement Progression:
 *      * Phase 1: Fast Pace Movement (0.0s - 1.10s) - Chains rush/drop into the scene at high velocity.
 *      * Phase 2: Sudden Lock (1.10s - 1.55s) - Abrupt, crisp lock with a heavy metallic tension shudder, holding locked.
 *      * Phase 3: Continuous Slow Movement (1.55s+) - Transitions into a hypnotic, gentle, continuous swaying drift.
 *      * Click/tap anywhere on the canvas to re-trigger the sequence!
 *  - White Sketched Wireframe Line-Art (Dark/Light responsive)
 *  - Interactive Plucking Physics
 */

// Chamfered stadium chain link with hollow inner cutout hole
function createChainLinkGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  const L = 0.50        // straight length
  const R = 0.28        // outer radius
  const W = 0.088       // wire thickness
  const Rin = R - W     // inner hole radius (0.192)
  const halfL = L * 0.5 // 0.25

  // Outer perimeter (counter-clockwise)
  shape.moveTo(-halfL, -R)
  shape.lineTo(halfL, -R)
  shape.absarc(halfL, 0, R, -Math.PI / 2, Math.PI / 2, false)
  shape.lineTo(-halfL, R)
  shape.absarc(-halfL, 0, R, Math.PI / 2, 3 * Math.PI / 2, false)

  // Inner hole (clockwise cutout)
  const hole = new THREE.Path()
  hole.moveTo(-halfL, -Rin)
  hole.absarc(-halfL, 0, Rin, 3 * Math.PI / 2, Math.PI / 2, true)
  hole.lineTo(halfL, Rin)
  hole.absarc(halfL, 0, Rin, Math.PI / 2, -Math.PI / 2, true)
  hole.lineTo(-halfL, -Rin)
  shape.holes.push(hole)

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 1, // 1 segment = crisp chamfered line-art edge
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 14,
  })
  geo.center()
  return geo
}

interface ControlPoint {
  rest: THREE.Vector3
  pos: THREE.Vector3
  vel: THREE.Vector3
}

interface ChainStrand {
  start: THREE.Vector3
  end: THREE.Vector3
  controlPoints: ControlPoint[]
  linkCount: number
  spline: THREE.CatmullRomCurve3
  zDepth: number
  entryOffsetX: number
  entryOffsetY: number
}

export default function HeroCanvasV2() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Scene & Perspective Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 18)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    el.appendChild(renderer.domElement)

    // Theme state
    let targetDark = getTheme() === 'dark' ? 1 : 0
    let darkMix = targetDark
    const darkMixUniform = { value: darkMix }

    const bgLight = new THREE.Color(0xf4f4ed) // Cream #F4F4ED
    const bgDark = new THREE.Color(0x060c1a)  // Deep Navy #060C1A
    const curBg = bgLight.clone().lerp(bgDark, darkMix)
    renderer.setClearColor(curBg, 1)

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.8)
    scene.add(hemiLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(12, 16, 12)
    scene.add(keyLight)

    // Custom Drawing-Type Material:
    // White sketched outlines on silhouettes, holes, and chamfer creases
    const material = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 30,
    })

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDarkMix = darkMixUniform
      shader.fragmentShader =
        'uniform float uDarkMix;\n' + shader.fragmentShader

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        [
          '#include <dithering_fragment>',
          'vec3 viewDir = normalize(vViewPosition);',
          'float ndotv = abs(dot(vNormal, viewDir));',
          'float silhouette = 1.0 - smoothstep(0.12, 0.38, ndotv);',
          'vec3 dNdx = dFdx(vNormal);',
          'vec3 dNdy = dFdy(vNormal);',
          'float crease = clamp((length(dNdx) + length(dNdy)) * 1.5, 0.0, 1.0);',
          'float lineStroke = clamp(max(silhouette * 1.15, crease * 0.95), 0.0, 1.0);',
          'vec3 lightDir = normalize(vec3(0.4, 0.8, 0.6));',
          'float diff = max(0.0, dot(vNormal, lightDir));',
          'float glint = pow(diff, 6.0) * 0.4;',
          'vec3 bodyDark   = vec3(0.03, 0.045, 0.075);',
          'vec3 strokeDark = vec3(1.0,  1.0,   1.0);',
          'vec3 bodyLight   = vec3(0.95, 0.95, 0.92);',
          'vec3 strokeLight = vec3(0.12, 0.14, 0.18);',
          'vec3 bodyCol   = mix(bodyLight, bodyDark, uDarkMix);',
          'vec3 strokeCol = mix(strokeLight, strokeDark, uDarkMix);',
          'vec3 drawnColor = mix(bodyCol, strokeCol, lineStroke);',
          'drawnColor += strokeCol * glint * (1.0 - lineStroke);',
          'gl_FragColor.rgb = drawnColor;',
        ].join('\n')
      )
    }

    const linkGeo = createChainLinkGeometry()

    // 4 Distinct Strands forming the architectural chain web:
    // Strand 0: Hanging Catenary Arc (drops in swiftly from above: entryOffsetY = +8.5)
    // Strand 1: Diagonal Slicing Strand (rushes in from upper-right: entryOffsetX = +7.0, entryOffsetY = +5.5)
    // Strand 2: Lower sweeping cradle strand (rushes up from below: entryOffsetY = -6.5)
    // Strand 3: Deep background diagonal (rushes in from upper-left: entryOffsetX = -6.0, entryOffsetY = +5.0)
    const strandConfigs = [
      { start: [-18.5, 9.5, 0.5], end: [18.5, 9.0, 0.5], sag: 6.8, count: 48, z: 0.5, entryX: 0.0, entryY: 8.5 },
      { start: [9.5, 11.0, -0.2], end: [-17.5, -11.0, -0.2], sag: 0.4, count: 44, z: -0.2, entryX: 7.0, entryY: 5.5 },
      { start: [-16.5, -7.0, 0.1], end: [17.5, -5.5, 0.1], sag: 2.2, count: 42, z: 0.1, entryX: 0.0, entryY: -6.5 },
      { start: [-8.5, 11.5, -0.6], end: [15.5, -10.5, -0.6], sag: 0.5, count: 42, z: -0.6, entryX: -6.0, entryY: 5.0 },
    ]

    const strands: ChainStrand[] = strandConfigs.map((cfg) => {
      const s = new THREE.Vector3(cfg.start[0], cfg.start[1], cfg.start[2])
      const e = new THREE.Vector3(cfg.end[0], cfg.end[1], cfg.end[2])

      // 3 movable internal control points per strand for physical vibration and catenary shape
      const cps: ControlPoint[] = [0.25, 0.5, 0.75].map((t) => {
        const base = new THREE.Vector3().lerpVectors(s, e, t)
        const sagAmount = Math.sin(t * Math.PI) * cfg.sag
        base.y -= sagAmount
        // Initial position starts at fast entry displacement
        const initialPos = base.clone()
        initialPos.x += cfg.entryX
        initialPos.y += cfg.entryY
        return {
          rest: base.clone(),
          pos: initialPos,
          vel: new THREE.Vector3(0, 0, 0),
        }
      })

      const splinePoints = [s, cps[0].pos, cps[1].pos, cps[2].pos, e]
      const spline = new THREE.CatmullRomCurve3(splinePoints, false, 'centripetal', 0.5)

      return {
        start: s,
        end: e,
        controlPoints: cps,
        linkCount: cfg.count,
        spline,
        zDepth: cfg.z,
        entryOffsetX: cfg.entryX,
        entryOffsetY: cfg.entryY,
      }
    })

    const TOTAL_LINKS = strands.reduce((acc, s) => acc + s.linkCount, 0)
    const instancedMesh = new THREE.InstancedMesh(linkGeo, material, TOTAL_LINKS)
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(instancedMesh)

    // Kinematics Timeline:
    // Fast Pace (0.0s - 1.10s) -> Sudden Lock (1.10s - 1.55s) -> Continuous Slow Movement (1.55s+)
    let introTime = 0
    let hasTriggeredLock = false

    const triggerAnimation = () => {
      introTime = 0
      hasTriggeredLock = false
      for (let sIdx = 0; sIdx < strands.length; sIdx++) {
        const strand = strands[sIdx]
        for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
          const cp = strand.controlPoints[cpIdx]
          cp.pos.copy(cp.rest)
          cp.pos.x += strand.entryOffsetX
          cp.pos.y += strand.entryOffsetY
          cp.vel.set(0, 0, 0)
        }
      }
    }
    window.addEventListener('click', triggerAnimation)

    // Theme change listener
    const onThemeChange = () => {
      targetDark = getTheme() === 'dark' ? 1 : 0
    }
    window.addEventListener('themechange', onThemeChange)

    // Mouse tracking & physics interaction
    const mouseTgt = { x: 0, y: 0 }
    const mouseCur = { x: 0, y: 0 }
    let lastMouseX = 0
    let lastMouseY = 0
    let mousePace = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseTgt.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTgt.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Scroll parallax tracking
    let scrollYTarget = 0
    let scrollYCurrent = 0
    const scroller = document.getElementById('main-panel') || window
    const onScroll = () => {
      scrollYTarget = (scroller instanceof HTMLElement ? scroller.scrollTop : window.scrollY) || 0
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })

    // Resize handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    }
    window.addEventListener('resize', onResize)

    // Visibility handling
    let isVisible = document.visibilityState !== 'hidden'
    const onVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden'
      if (isVisible) {
        lastTs = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Pre-allocated math objects for zero garbage collection
    const pCurrent = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const normal = new THREE.Vector3()
    const binormal = new THREE.Vector3()
    const colX = new THREE.Vector3()
    const colY = new THREE.Vector3()
    const colZ = new THREE.Vector3()
    const matrix = new THREE.Matrix4()

    let raf: number
    let time = 0
    let lastTs = performance.now()

    // Physics constants for chain plucking & vibration
    const SPRING_K = 24.0
    const DAMP_C   = 4.2
    const PLUCK_R  = 3.2

    function loop(now: number = performance.now()) {
      if (!isVisible) return
      raf = requestAnimationFrame(loop)

      const dt = Math.min(0.04, (now - lastTs) / 1000)
      lastTs = now
      time += dt
      introTime += dt

      // Smooth mouse follow
      const mouseFollowK = 1 - Math.exp(-5.0 * dt)
      mouseCur.x += (mouseTgt.x - mouseCur.x) * mouseFollowK
      mouseCur.y += (mouseTgt.y - mouseCur.y) * mouseFollowK

      // Mouse velocity
      const mdx = (mouseCur.x - lastMouseX) / Math.max(dt, 0.001)
      const mdy = (mouseCur.y - lastMouseY) / Math.max(dt, 0.001)
      const rawSpeed = Math.min(2.5, Math.sqrt(mdx * mdx + mdy * mdy) * 0.4)
      const paceK = 1 - Math.exp(-7.0 * dt)
      mousePace += (rawSpeed - mousePace) * paceK
      lastMouseX = mouseCur.x
      lastMouseY = mouseCur.y

      // Scroll parallax
      const scrollK = 1 - Math.exp(-3.5 * dt)
      scrollYCurrent += (scrollYTarget - scrollYCurrent) * scrollK
      const scrollRatio = scrollYCurrent / 1200

      // Theme transition
      const themeK = 1 - Math.exp(-6.0 * dt)
      darkMix += (targetDark - darkMix) * themeK
      darkMixUniform.value = darkMix

      // Update background
      curBg.copy(bgLight).lerp(bgDark, darkMix)
      renderer.setClearColor(curBg, 1)

      // Cursor point in 3D
      const halfW = 9.0 * camera.aspect
      const halfH = 9.0
      const mouseWorldX = mouseCur.x * halfW
      const mouseWorldY = mouseCur.y * halfH

      // Motion phases:
      // Phase 1 (0.0s - 1.10s): Fast-paced drop/rush into frame
      // Phase 2 (1.10s - 1.55s): Sudden Lock (frozen tension hold with clank shockwave)
      // Phase 3 (1.55s+): Continuous slow movement (smooth hypnotic sway)
      const isFast = introTime < 1.10
      const fastProgress = Math.min(1.0, introTime / 1.10)
      // High speed motion curve
      const fastFactor = isFast ? 1.0 - Math.pow(fastProgress, 2.4) : 0.0

      // Sudden lock trigger
      if (!hasTriggeredLock && introTime >= 1.10) {
        hasTriggeredLock = true
        for (let sIdx = 0; sIdx < strands.length; sIdx++) {
          const strand = strands[sIdx]
          const signY = strand.entryOffsetY >= 0 ? -1 : 1
          const signX = strand.entryOffsetX >= 0 ? -1 : 1
          for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
            const cp = strand.controlPoints[cpIdx]
            // Sharp metallic lock impact shudder into the physical springs
            cp.vel.y += signY * (24.0 + cpIdx * 4.0)
            cp.vel.x += signX * 12.0
            cp.vel.z += (cpIdx === 1 ? -16.0 : 12.0)
          }
        }
      }

      // Phase 3: Completely Static after the lock (zero idle sway or drift)
      const isSettled = introTime >= 1.50

      // Physical simulation of chain strands
      for (let sIdx = 0; sIdx < strands.length; sIdx++) {
        const strand = strands[sIdx]

        // Fast entry displacement (reaches 0 at 1.10s)
        const curOffsetX = strand.entryOffsetX * fastFactor
        const curOffsetY = strand.entryOffsetY * fastFactor

        // Parallax depth shift on scroll
        const parallaxY = scrollRatio * (strand.zDepth * 1.6 + 0.8)

        for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
          const cp = strand.controlPoints[cpIdx]

          const targetX = cp.rest.x + curOffsetX
          const targetY = cp.rest.y + curOffsetY - parallaxY
          const targetZ = cp.rest.z

          const dispX = targetX - cp.pos.x
          const dispY = targetY - cp.pos.y
          const dispZ = targetZ - cp.pos.z

          const fSpringX = dispX * SPRING_K
          const fSpringY = dispY * SPRING_K
          const fSpringZ = dispZ * SPRING_K

          const fDampX = -cp.vel.x * DAMP_C
          const fDampY = -cp.vel.y * DAMP_C
          const fDampZ = -cp.vel.z * DAMP_C

          // Cursor plucking interaction
          const pDx = cp.pos.x - mouseWorldX
          const pDy = cp.pos.y - mouseWorldY
          const pDistSq = pDx * pDx + pDy * pDy
          let fPluckX = 0
          let fPluckY = 0
          let fPluckZ = 0

          if (pDistSq < PLUCK_R * PLUCK_R) {
            const pDist = Math.sqrt(pDistSq)
            const pluckFalloff = (1 - pDist / PLUCK_R) * (0.8 + mousePace * 2.2)
            fPluckX = (pDx / (pDist + 0.001)) * pluckFalloff * 35.0
            fPluckY = (pDy / (pDist + 0.001)) * pluckFalloff * 35.0
            fPluckZ = pluckFalloff * 25.0
          }

          cp.vel.x += (fSpringX + fDampX + fPluckX) * dt
          cp.vel.y += (fSpringY + fDampY + fPluckY) * dt
          cp.vel.z += (fSpringZ + fDampZ + fPluckZ) * dt

          cp.pos.x += cp.vel.x * dt
          cp.pos.y += cp.vel.y * dt
          cp.pos.z += cp.vel.z * dt

          // Lock completely static once settled with zero residual drift
          if (isSettled && fPluckX === 0 && fPluckY === 0 && (Math.abs(cp.vel.x) + Math.abs(cp.vel.y) + Math.abs(cp.vel.z) < 0.2)) {
            cp.pos.x = targetX
            cp.pos.y = targetY
            cp.pos.z = targetZ
            cp.vel.set(0, 0, 0)
          }
        }

        strand.spline.updateArcLengths()
      }

      // Matrix transforms for all links
      // ABSOLUTELY ZERO SPINNING:
      // Links have a 100% STATIC alternating 90-degree orientation.
      let globalLinkIdx = 0

      for (let sIdx = 0; sIdx < strands.length; sIdx++) {
        const strand = strands[sIdx]
        const count = strand.linkCount

        for (let i = 0; i < count; i++) {
          const u = (i + 0.5) / count

          strand.spline.getPointAt(u, pCurrent)
          strand.spline.getTangentAt(u, tangent).normalize()

          // Stable camera-aligned reference frame (guarantees NO axial roll/spin)
          // Compute screen-plane perpendicular vector:
          binormal.set(-tangent.y, tangent.x, 0)
          if (binormal.lengthSq() < 0.0001) {
            binormal.set(0, 0, 1)
          } else {
            binormal.normalize()
          }
          normal.crossVectors(tangent, binormal).normalize()

          // 100% STATIC alternating orientation:
          // Even links lie flat facing the viewer; odd links stand perpendicular.
          // Zero rotation over time. Zero spinning!
          const isFlat = (i % 2 === 0)
          if (isFlat) {
            colX.copy(tangent)
            colY.copy(normal)
            colZ.copy(binormal)
          } else {
            colX.copy(tangent)
            colY.copy(binormal)
            colZ.copy(normal).negate()
          }

          matrix.set(
            colX.x, colY.x, colZ.x, pCurrent.x,
            colX.y, colY.y, colZ.y, pCurrent.y,
            colX.z, colY.z, colZ.z, pCurrent.z,
            0,      0,      0,      1
          )

          instancedMesh.setMatrixAt(globalLinkIdx, matrix)
          globalLinkIdx++
        }
      }

      instancedMesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
    }

    loop()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', triggerAnimation)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('themechange', onThemeChange)
      window.removeEventListener('resize', onResize)

      renderer.dispose()
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement)
      }
      linkGeo.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={ref} className="hero-canvas" aria-hidden="true" />
}
