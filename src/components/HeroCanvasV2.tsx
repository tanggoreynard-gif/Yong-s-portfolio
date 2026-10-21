import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getTheme } from '@/lib/theme'
import { motionReduced } from '@/lib/a11y'

/**
 * HeroCanvasV2 - 2 Cross Chains (Hunter x Hunter inspired)
 *
 * Visual design:
 * - Exactly TWO heavy architectural chains forming a clean diagonal "X" cross.
 * - Chain 1: Top-Left to Bottom-Right (in front, z = 0.25).
 * - Chain 2: Top-Right to Bottom-Left (behind, z = -0.25).
 * - Alternating 90-degree interlocking stadium links with zero axial spin.
 *
 * Motion:
 * - Fast-paced entry (0.0s - 0.75s): The two chains strike rapidly into crossing position.
 * - Sudden Lock (0.75s - 1.05s): Abrupt metallic tension clank shudder that dampens out.
 * - 100% Completely Static (1.05s+): The chains remain rigidly locked in place with ZERO movement.
 */

// Chamfered stadium chain link with hollow inner cutout hole
function createChainLinkGeometry() {
  const outerR = 0.32
  const innerR = 0.16
  const straightHalfL = 0.36
  const thickness = 0.13

  const shape = new THREE.Shape()

  // Outer perimeter (counter-clockwise)
  shape.moveTo(straightHalfL, outerR)
  shape.absarc(straightHalfL, 0, outerR, Math.PI / 2, -Math.PI / 2, true)
  shape.lineTo(-straightHalfL, -outerR)
  shape.absarc(-straightHalfL, 0, outerR, -Math.PI / 2, Math.PI / 2, true)
  shape.closePath()

  // Inner hole (clockwise cutout)
  const hole = new THREE.Path()
  hole.moveTo(straightHalfL, innerR)
  hole.absarc(straightHalfL, 0, innerR, Math.PI / 2, -Math.PI / 2, false)
  hole.lineTo(-straightHalfL, -innerR)
  hole.absarc(-straightHalfL, 0, innerR, -Math.PI / 2, Math.PI / 2, false)
  hole.closePath()
  shape.holes.push(hole)

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.045,
    curveSegments: 16,
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  geo.center()
  geo.computeVertexNormals()
  return geo
}

type ControlPoint = {
  rest: THREE.Vector3
  pos: THREE.Vector3
  vel: THREE.Vector3
}

type ChainStrand = {
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

    // Three.js Scene Setup
    const scene = new THREE.Scene()

    const bgLight = new THREE.Color(0xF6F6F9)
    const bgDark = new THREE.Color(0x070B14)
    let targetDark = getTheme() === 'dark' ? 1 : 0
    let darkMix = targetDark
    const curBg = bgLight.clone().lerp(bgDark, darkMix)
    scene.background = curBg

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 18)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(curBg, 1)
    el.appendChild(renderer.domElement)

    // Directional and Ambient lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2)
    dirLight.position.set(4, 12, 10)
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xa5c4f5, 1.2)
    fillLight.position.set(-8, -6, -4)
    scene.add(fillLight)

    const ambLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambLight)

    // Custom shader material with ink-line hatching and metallic glint
    const darkMixUniform = { value: darkMix }
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.22,
      metalness: 0.88,
    })

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDarkMix = darkMixUniform
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        ['#include <common>', 'varying vec3 vViewPosition;', 'varying vec3 vNormalWorld;'].join('\n')
      )
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        [
          '#include <begin_vertex>',
          'vViewPosition = - (modelViewMatrix * vec4(transformed, 1.0)).xyz;',
          'vNormalWorld = normalize(mat3(modelMatrix) * normal);',
        ].join('\n')
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        ['#include <common>', 'uniform float uDarkMix;', 'varying vec3 vViewPosition;', 'varying vec3 vNormalWorld;'].join('\n')
      )
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

    // EXACTLY 2 CROSS CHAINS FORMING A CLEAN "X" INTERSECTION:
    // Strand 1: Top-Left to Bottom-Right (in front: z = +0.25, rushes in from upper-left: entryX = -10, entryY = +8)
    // Strand 2: Top-Right to Bottom-Left (behind: z = -0.25, rushes in from upper-right: entryX = +10, entryY = +8)
    const strandConfigs = [
      { start: [-17.5, 11.5, 0.25], end: [17.5, -11.5, 0.25], sag: 1.1, count: 52, z: 0.25, entryX: -10.0, entryY: 8.0 },
      { start: [17.5, 11.5, -0.25], end: [-17.5, -11.5, -0.25], sag: 1.1, count: 52, z: -0.25, entryX: 10.0, entryY: 8.0 },
    ]

    const strands: ChainStrand[] = strandConfigs.map((cfg) => {
      const s = new THREE.Vector3(cfg.start[0], cfg.start[1], cfg.start[2])
      const e = new THREE.Vector3(cfg.end[0], cfg.end[1], cfg.end[2])

      // 3 movable internal control points per strand
      const cps: ControlPoint[] = [0.25, 0.5, 0.75].map((t) => {
        const base = new THREE.Vector3().lerpVectors(s, e, t)
        const sagAmount = Math.sin(t * Math.PI) * cfg.sag
        base.y -= sagAmount

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

    // Physics constants for the intro lock
    const SPRING_K = 65.0
    const DAMP_C = 16.0

    // Intro kinematics timing:
    // Fast strike (0.0s - 0.75s) -> Sudden Lock Impact (0.75s - 1.05s) -> 100% Static (1.05s+)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || motionReduced()
    let introTime = reduced ? 999 : 0
    let hasTriggeredLock = reduced
    let isFullyStatic = reduced

    // Theme change listener
    const onThemeChange = () => {
      targetDark = getTheme() === 'dark' ? 1 : 0
    }
    window.addEventListener('themechange', onThemeChange)

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

    // Math temporary objects
    const pCurrent = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const normal = new THREE.Vector3()
    const binormal = new THREE.Vector3()
    const colX = new THREE.Vector3()
    const colY = new THREE.Vector3()
    const colZ = new THREE.Vector3()
    const matrix = new THREE.Matrix4()

    let raf: number
    let lastTs = performance.now()

    function updateMeshMatrices() {
      let globalLinkIdx = 0
      for (let sIdx = 0; sIdx < strands.length; sIdx++) {
        const strand = strands[sIdx]
        const count = strand.linkCount

        for (let i = 0; i < count; i++) {
          const u = (i + 0.5) / count

          strand.spline.getPointAt(u, pCurrent)
          strand.spline.getTangentAt(u, tangent).normalize()

          // Stable camera-aligned reference frame (guarantees zero axial roll/spin)
          binormal.set(-tangent.y, tangent.x, 0)
          if (binormal.lengthSq() < 0.0001) {
            binormal.set(0, 0, 1)
          } else {
            binormal.normalize()
          }
          normal.crossVectors(tangent, binormal).normalize()

          // Alternating 90-degree static orientations
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
    }

    function loop(now: number = performance.now()) {
      if (!isVisible) return
      raf = requestAnimationFrame(loop)

      const dt = Math.min(0.035, (now - lastTs) / 1000)
      lastTs = now
      introTime += dt

      // Smooth theme transition
      const themeK = 1 - Math.exp(-6.0 * dt)
      darkMix += (targetDark - darkMix) * themeK
      darkMixUniform.value = darkMix
      curBg.copy(bgLight).lerp(bgDark, darkMix)
      renderer.setClearColor(curBg, 1)

      // Motion timeline:
      // Phase 1: Fast entry (0.0s - 0.75s)
      const isFast = introTime < 0.75
      const fastProgress = Math.min(1.0, introTime / 0.75)
      const fastFactor = isFast ? 1.0 - Math.pow(fastProgress, 3.0) : 0.0

      // Phase 2: Sudden lock trigger at 0.75s
      if (!hasTriggeredLock && introTime >= 0.75) {
        hasTriggeredLock = true
        for (let sIdx = 0; sIdx < strands.length; sIdx++) {
          const strand = strands[sIdx]
          const signY = strand.entryOffsetY >= 0 ? -1 : 1
          const signX = strand.entryOffsetX >= 0 ? -1 : 1
          for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
            const cp = strand.controlPoints[cpIdx]
            // Crisp metallic tension shudder
            cp.vel.y += signY * 20.0
            cp.vel.x += signX * 14.0
            cp.vel.z += (cpIdx === 1 ? -12.0 : 10.0)
          }
        }
      }

      // Phase 3: Completely static after 1.05s
      if (introTime >= 1.05) {
        if (!isFullyStatic) {
          isFullyStatic = true
          // Lock every control point to its exact resting position
          for (let sIdx = 0; sIdx < strands.length; sIdx++) {
            const strand = strands[sIdx]
            for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
              strand.controlPoints[cpIdx].pos.copy(strand.controlPoints[cpIdx].rest)
              strand.controlPoints[cpIdx].vel.set(0, 0, 0)
            }
            strand.spline.updateArcLengths()
          }
          updateMeshMatrices()
        }
        // When fully static, only render the scene without recalculating matrices
        renderer.render(scene, camera)
        return
      }

      // Physics simulation during intro movement (0.0s - 1.05s)
      for (let sIdx = 0; sIdx < strands.length; sIdx++) {
        const strand = strands[sIdx]
        const curOffsetX = strand.entryOffsetX * fastFactor
        const curOffsetY = strand.entryOffsetY * fastFactor

        for (let cpIdx = 0; cpIdx < strand.controlPoints.length; cpIdx++) {
          const cp = strand.controlPoints[cpIdx]

          const targetX = cp.rest.x + curOffsetX
          const targetY = cp.rest.y + curOffsetY
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

          cp.vel.x += (fSpringX + fDampX) * dt
          cp.vel.y += (fSpringY + fDampY) * dt
          cp.vel.z += (fSpringZ + fDampZ) * dt

          cp.pos.x += cp.vel.x * dt
          cp.pos.y += cp.vel.y * dt
          cp.pos.z += cp.vel.z * dt
        }

        strand.spline.updateArcLengths()
      }

      updateMeshMatrices()
      renderer.render(scene, camera)
    }

    // Initial render
    updateMeshMatrices()
    loop()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibilityChange)
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
