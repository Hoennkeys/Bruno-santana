import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScissorBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    container.appendChild(renderer.domElement);

    // --- REALISTIC MATERIALS (MATCHING THE BARBER SCISSOR IMAGE) ---
    // 1. Shiny Polished 24K Gold for the front cutting blades & pivot shank
    const goldBladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffcc00,
      roughness: 0.1,
      metalness: 0.98,
      emissive: 0x553d00,
      emissiveIntensity: 0.25,
    });

    // 2. Matte Black Ergonomic Handles & Finger Rings
    const blackHandleMaterial = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.45,
      metalness: 0.7,
    });

    // 3. Black Tension Screw
    const blackScrewMaterial = new THREE.MeshStandardMaterial({
      color: 0x090a0c,
      roughness: 0.3,
      metalness: 0.9,
    });

    // 4. Glowing Neon Cyan Core for Central Screw Joint (subtle sci-fi touch)
    const cyanCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    // Particle Materials (Sparkling Ambient Dust across full screen)
    const goldParticleMaterial = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const cyanParticleMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    // --- Master 3D Scissor Group ---
    const scissorGroup = new THREE.Group();
    scene.add(scissorGroup);

    // Scale 0.28 as requested
    scissorGroup.scale.set(0.28, 0.28, 0.28);
    scissorGroup.position.set(0, 0.2, 0);

    // --- Particle Cloud (Sparks spread across the entire screen) ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 28;
      const py = (Math.random() - 0.5) * 24;
      const pz = (Math.random() - 0.5) * 16;
      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.012,
        y: (Math.random() - 0.5) * 0.012 + 0.004,
        z: (Math.random() - 0.5) * 0.012,
      });
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const goldParticles = new THREE.Points(particleGeo, goldParticleMaterial);
    scene.add(goldParticles);

    const cyanParticles = new THREE.Points(particleGeo, cyanParticleMaterial);
    cyanParticles.position.set(0, 0, -2.0);
    scene.add(cyanParticles);

    // --- Central Pivot Group ---
    const pivotCenterGroup = new THREE.Group();
    scissorGroup.add(pivotCenterGroup);

    // Glowing Cyan Core Orb (Center of Screw)
    const cyanOrbGeo = new THREE.SphereGeometry(0.22, 24, 24);
    const cyanOrbMesh = new THREE.Mesh(cyanOrbGeo, cyanCoreMaterial);
    pivotCenterGroup.add(cyanOrbMesh);

    // Black Tension Screw Cap (Dominant Round Knob like reference image)
    const screwKnobGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.18, 32);
    const screwKnobMesh = new THREE.Mesh(screwKnobGeo, blackScrewMaterial);
    screwKnobMesh.rotation.x = Math.PI / 2;
    screwKnobMesh.position.z = 0.22;
    pivotCenterGroup.add(screwKnobMesh);

    // Gold Bevel Ring around Screw Knob
    const screwBezelGeo = new THREE.TorusGeometry(0.52, 0.06, 16, 36);
    const screwBezelMesh = new THREE.Mesh(screwBezelGeo, goldBladeMaterial);
    screwBezelMesh.position.z = 0.16;
    pivotCenterGroup.add(screwBezelMesh);

    // Internal Disassembled Gear Discs (For 3D Scroll Deconstruction effect)
    const gearCount = 4;
    const gearMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < gearCount; i++) {
      const gearGeo = new THREE.TorusGeometry(0.38 + i * 0.18, 0.03, 12, 28);
      const mat = i % 2 === 0 ? goldBladeMaterial : blackHandleMaterial;
      const gearMesh = new THREE.Mesh(gearGeo, mat);
      gearMesh.position.z = (i - 1.5) * 0.16;
      pivotCenterGroup.add(gearMesh);
      gearMeshes.push(gearMesh);
    }

    // --- REALISTIC BARBER SCISSOR BLADE & HANDLE ASSEMBLY ---
    const createBladeAssembly = (isRightSide: boolean) => {
      const armGroup = new THREE.Group();

      // 1. REALISTIC GOLD CUTTING BLADE (Straight, tapered, polished)
      // Tapers cleanly from pivot joint (0.45 width) up to a fine sharp tip at y=6.2
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(0.42, 0.8);
      bladeShape.lineTo(0.28, 4.2);
      bladeShape.quadraticCurveTo(0.14, 5.5, 0.02, 6.2); // Sleek sharp tip
      bladeShape.lineTo(-0.02, 6.2);
      bladeShape.quadraticCurveTo(-0.08, 4.2, -0.22, 0.8);
      bladeShape.lineTo(0, 0);

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        steps: 1,
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelSegments: 4,
      });
      bladeGeo.center();

      const bladeMesh = new THREE.Mesh(bladeGeo, goldBladeMaterial);
      bladeMesh.position.set(0, 3.1, 0);
      armGroup.add(bladeMesh);

      // Gold Cutting Edge Ridge Accent
      const edgeShape = new THREE.Shape();
      edgeShape.moveTo(0, 0);
      edgeShape.lineTo(0.08, 4.2);
      edgeShape.lineTo(0.02, 6.0);
      edgeShape.lineTo(-0.02, 6.0);
      edgeShape.lineTo(0, 0);

      const edgeGeo = new THREE.ExtrudeGeometry(edgeShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
      });
      const edgeMesh = new THREE.Mesh(edgeGeo, goldBladeMaterial);
      edgeMesh.position.set(isRightSide ? -0.1 : 0.1, 3.1, 0.06);
      armGroup.add(edgeMesh);

      // 2. GOLD RETAINING SHANK (Section between pivot screw and black handle)
      const shankGeo = new THREE.CylinderGeometry(0.35, 0.32, 1.2, 20);
      const shankMesh = new THREE.Mesh(shankGeo, goldBladeMaterial);
      shankMesh.position.set(0, -0.6, 0);
      armGroup.add(shankMesh);

      // 3. MATTE BLACK ERGONOMIC HANDLE & FINGER RING ASSEMBLY (Exact match to reference photo)
      const handleGroup = new THREE.Group();
      handleGroup.position.set(0, -1.2, 0);

      // Black Curved Neck Stem
      const neckCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isRightSide ? 0.25 : -0.25, -0.7, 0),
        new THREE.Vector3(isRightSide ? 0.7 : -0.7, -1.5, 0),
      ]);
      const neckGeo = new THREE.TubeGeometry(neckCurve, 20, 0.2, 16, false);
      const neckMesh = new THREE.Mesh(neckGeo, blackHandleMaterial);
      handleGroup.add(neckMesh);

      // Black Oval Finger Ring (Ergonomic offset)
      const ringPosition = new THREE.Vector3(isRightSide ? 0.85 : -0.85, -2.1, 0);
      const fingerRingGeo = new THREE.TorusGeometry(0.92, 0.18, 20, 44);
      const fingerRingMesh = new THREE.Mesh(fingerRingGeo, blackHandleMaterial);
      fingerRingMesh.position.copy(ringPosition);
      fingerRingMesh.scale.set(0.85, 1.15, 1.0); // Realistic barber oval ring
      handleGroup.add(fingerRingMesh);

      // 4. REALISTIC CURVED FINGER REST (TANG) & RUBBER STOPPER (BUMPER)
      if (isRightSide) {
        // Curved Finger Rest (Tang) gracefully extending up from top ring
        const tangCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.95, -1.2, 0),
          new THREE.Vector3(1.35, -0.7, 0),
          new THREE.Vector3(1.5, -0.1, 0),
          new THREE.Vector3(1.4, 0.4, 0), // Elegant upward hook as in photo
        ]);
        const tangGeo = new THREE.TubeGeometry(tangCurve, 24, 0.12, 16, false);
        const tangMesh = new THREE.Mesh(tangGeo, blackHandleMaterial);
        handleGroup.add(tangMesh);

        // Black Rubber Bumper Stopper between rings
        const bumperGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.3, 16);
        const bumperMesh = new THREE.Mesh(bumperGeo, blackHandleMaterial);
        bumperMesh.position.set(-0.65, -1.4, 0);
        bumperMesh.rotation.z = Math.PI / 2;
        handleGroup.add(bumperMesh);
      }

      armGroup.add(handleGroup);

      return { armGroup, bladeMesh, handleGroup, edgeMesh };
    };

    const leftArm = createBladeAssembly(false);
    const rightArm = createBladeAssembly(true);

    leftArm.armGroup.position.set(0, 0, -0.04);
    rightArm.armGroup.position.set(0, 0, 0.04);

    scissorGroup.add(leftArm.armGroup);
    scissorGroup.add(rightArm.armGroup);

    // --- Studio Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const goldLight = new THREE.DirectionalLight(0xffcc00, 6.0);
    goldLight.position.set(5, 7, 8);
    scene.add(goldLight);

    const cyanLight = new THREE.DirectionalLight(0x00e5ff, 3.0);
    cyanLight.position.set(-5, -5, 7);
    scene.add(cyanLight);

    const corePointLight = new THREE.PointLight(0x00e5ff, 4.0, 15);
    corePointLight.position.set(0, 0.6, 2);
    scene.add(corePointLight);

    // --- Scroll & Responsive Variables ---
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // --- Resize Handler ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;

      if (w < 640) {
        camera.position.z = 11;
      } else if (w < 1024) {
        camera.position.z = 9.5;
      } else {
        camera.position.z = 8.5;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // --- Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth Interpolation of scroll progress
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.08;
      const p = currentScrollProgress; // 0 (Hero top) to 1 (Bottom of page)

      // Pulsing Cyan Joint Glow
      const cyanPulse = (Math.sin(elapsedTime * 2.5) + 1) * 0.5;
      cyanCoreMaterial.emissiveIntensity = 2.0 + cyanPulse * 2.0;
      corePointLight.intensity = 3.0 + cyanPulse * 2.5;

      // Subtle Idle Float & Rotation at top
      const idleFloatY = Math.sin(elapsedTime * 1.2) * 0.12;
      const idleRotateZ = Math.sin(elapsedTime * 0.9) * 0.03;

      // Position & smooth translation on scroll
      scissorGroup.position.x = 0;
      scissorGroup.position.y = 0.4 + idleFloatY - p * 4.0;
      scissorGroup.position.z = -p * 6;

      // Horizontal orientation base (Math.PI / 2) + rotation driven by Scroll
      scissorGroup.rotation.y = elapsedTime * 0.15 + p * Math.PI * 1.8;
      scissorGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05 + p * 0.4;
      scissorGroup.rotation.z = Math.PI / 2 + idleRotateZ + p * 0.3;

      // Efeito de "Desfazimento" / Desmembramento biomecânico no scroll
      const bladeOpenAngle = 0.15 + p * 1.25; // 8 deg a 75 deg
      leftArm.armGroup.rotation.z = bladeOpenAngle;
      rightArm.armGroup.rotation.z = -bladeOpenAngle;

      // Axial & lateral displacement
      leftArm.armGroup.position.z = -0.04 - p * 2.0;
      rightArm.armGroup.position.z = 0.04 + p * 2.0;
      leftArm.armGroup.position.x = -p * 1.5;
      rightArm.armGroup.position.x = p * 1.5;

      // Pivô e Engrenagens se desfazem sutilmente
      pivotCenterGroup.position.z = p * 2.8;
      screwKnobMesh.position.z = 0.22 + p * 3.0;
      screwBezelMesh.position.z = 0.16 + p * 2.5;

      gearMeshes.forEach((gMesh, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        gMesh.position.z = (idx - 1.5) * (0.18 + p * 1.8);
        gMesh.rotation.z = elapsedTime * (1 + idx * 0.5) * dir + p * Math.PI * 2.5;
      });

      // Partículas flutuantes cibernéticas expandidas por toda a tela
      const positions = goldParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        positions[i * 3] += vel.x * (1 + p * 1.5);
        positions[i * 3 + 1] += vel.y * (1 + p * 1.5);
        positions[i * 3 + 2] += vel.z * (1 + p * 1.5);

        if (Math.abs(positions[i * 3]) > 14) positions[i * 3] *= -0.9;
        if (Math.abs(positions[i * 3 + 1]) > 12) positions[i * 3 + 1] *= -0.9;
        if (Math.abs(positions[i * 3 + 2]) > 8) positions[i * 3 + 2] *= -0.9;
      }
      goldParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Clean Up ---
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      goldBladeMaterial.dispose();
      blackHandleMaterial.dispose();
      blackScrewMaterial.dispose();
      cyanCoreMaterial.dispose();
      goldParticleMaterial.dispose();
      cyanParticleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 top-0 left-0 h-full w-full pointer-events-none"
      style={{
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
