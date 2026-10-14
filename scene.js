// Interactive 3D hero: a low-poly avatar surrounded by orbiting integration nodes.
import * as THREE from "three";
import { OrbitControls } from "./vendor/three/OrbitControls.js";

const container = document.getElementById("hero-3d");
const bubble = document.getElementById("bubble");
const tip = document.getElementById("node-tip");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = matchMedia("(pointer: coarse)").matches;

const NODES = [
  { label: "GHL", color: 0x22d3ee, info: "GoHighLevel · CRM, pipelines & workflows", target: "#services" },
  { label: "AI", color: 0xfacc15, info: "AI voice agents & conversational AI", target: "#services" },
  { label: "n8n", color: 0xf472b6, info: "n8n · workflow automation", target: "#skills" },
  { label: "API", color: 0x4ade80, info: "Custom APIs & webhooks", target: "#services" },
  { label: "Make", color: 0xa78bfa, info: "Make.com scenarios", target: "#skills" },
  { label: "Zapier", color: 0xfb923c, info: "Zapier integrations", target: "#skills" },
  { label: "</>", color: 0x60a5fa, info: "Web apps with Claude Code", target: "#projects" },
  { label: "Data", color: 0x34d399, info: "Python · Pandas · Power BI", target: "#skills" },
];

const LINES = [
  "Hi! I'm Ali 👋",
  "I turn manual work into automations ⚙️",
  "Need an AI voice agent? Let's talk!",
  "GHL Certified Admin, at your service ✅",
  "Drag me around, I don't mind 😄",
  "Try the terminal below: type 'help'",
  "APIs, webhooks, n8n… I connect it all 🔌",
];

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

if (container && webglAvailable()) init();

function init() {
  // ---------- Renderer, scene, camera ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.prepend(renderer.domElement);
  renderer.domElement.setAttribute("aria-label", "Interactive 3D avatar of Muhammad Ali Qureshi");
  renderer.domElement.setAttribute("role", "img");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.9, 11.5);

  scene.add(new THREE.HemisphereLight(0xc7d2fe, 0x1e1b4b, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 5);
  scene.add(key);
  const rimCyan = new THREE.PointLight(0x22d3ee, 40, 12);
  rimCyan.position.set(-3.5, 2, -2.5);
  scene.add(rimCyan);
  const rimViolet = new THREE.PointLight(0xa78bfa, 30, 12);
  rimViolet.position.set(3.5, -0.5, -2);
  scene.add(rimViolet);

  const mat = (color, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.75, metalness: 0.05, ...extra });

  const SKIN = mat(0xc98d6b);
  const SKIN_DARK = mat(0xb07656);
  const HAIR = mat(0x1b1512, { roughness: 0.9 });
  const BLAZER = mat(0x1e293b);
  const SHIRT = mat(0xe2e8f0);
  const WHITE = mat(0xffffff, { roughness: 0.3 });
  const PUPIL = mat(0x1a1009, { roughness: 0.2 });

  // ---------- Avatar ----------
  const avatar = new THREE.Group();
  avatar.position.y = -0.35;
  scene.add(avatar);
  const clickable = [];
  const add = (parent, geo, material, pos = [0, 0, 0], scale, rot) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos);
    if (scale) m.scale.set(...scale);
    if (rot) m.rotation.set(...rot);
    parent.add(m);
    clickable.push(m);
    return m;
  };

  // Torso, shoulders, shirt
  add(avatar, new THREE.CylinderGeometry(0.95, 1.2, 1.6, 12), BLAZER, [0, -0.85, 0], [1, 1, 0.68]);
  add(avatar, new THREE.SphereGeometry(1, 12, 8), BLAZER, [0, -0.12, 0], [1.02, 0.42, 0.7]);
  add(avatar, new THREE.ConeGeometry(0.34, 0.85, 3), SHIRT, [0, -0.4, 0.6], [1, 1, 0.3], [Math.PI, 0, 0]);
  add(avatar, new THREE.CylinderGeometry(0.27, 0.31, 0.5, 10), SKIN_DARK, [0, 0.2, 0]);

  // Arms (pivot at the shoulder so the right one can wave)
  const makeArm = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.98, -0.2, 0);
    pivot.rotation.z = side * 0.14;
    avatar.add(pivot);
    add(pivot, new THREE.CylinderGeometry(0.21, 0.18, 1.15, 10), BLAZER, [0, -0.56, 0]);
    add(pivot, new THREE.SphereGeometry(0.17, 10, 8), SKIN, [0, -1.18, 0]);
    return pivot;
  };
  makeArm(-1);
  const rightArm = makeArm(1);

  // Head
  const head = new THREE.Group();
  head.position.y = 0.98;
  avatar.add(head);
  const HEAD_SCALE = [1, 1.15, 1];
  add(head, new THREE.SphereGeometry(0.72, 16, 14), SKIN, [0, 0, 0], HEAD_SCALE);
  // hair: top cap + back of head + messy tufts
  add(head, new THREE.SphereGeometry(0.76, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), HAIR, [0, 0.03, -0.02], HEAD_SCALE);
  add(head, new THREE.SphereGeometry(0.755, 16, 12, Math.PI, Math.PI, 0, Math.PI * 0.62), HAIR, [0, 0, -0.01], HEAD_SCALE);
  [[-0.3, 0.74, 0.3], [0.0, 0.8, 0.3], [0.3, 0.72, 0.28], [-0.15, 0.82, -0.05], [0.2, 0.8, -0.1]].forEach((p, i) =>
    add(head, new THREE.IcosahedronGeometry(0.2 + (i % 2) * 0.04, 0), HAIR, p, null, [i, i * 0.7, 0])
  );
  // beard (front half, lower cap), mouth, mustache
  add(head, new THREE.SphereGeometry(0.765, 16, 12, 0, Math.PI, Math.PI * 0.6, Math.PI * 0.4), HAIR, [0, -0.01, 0.02], HEAD_SCALE);
  add(head, new THREE.BoxGeometry(0.42, 0.09, 0.1), HAIR, [0, -0.25, 0.7], null, [0.25, 0, 0]);
  add(head, new THREE.BoxGeometry(0.2, 0.045, 0.05), mat(0xa8604c), [0, -0.37, 0.72]);
  // ears, nose
  add(head, new THREE.SphereGeometry(0.14, 8, 6), SKIN_DARK, [-0.72, 0.02, 0], [0.5, 1, 0.8]);
  add(head, new THREE.SphereGeometry(0.14, 8, 6), SKIN_DARK, [0.72, 0.02, 0], [0.5, 1, 0.8]);
  add(head, new THREE.ConeGeometry(0.08, 0.22, 6), SKIN_DARK, [0, -0.06, 0.78], null, [Math.PI / 2, 0, 0]);
  // eyes and brows
  const eyes = new THREE.Group();
  head.add(eyes);
  const pupils = [];
  [-1, 1].forEach((s) => {
    const eye = add(eyes, new THREE.SphereGeometry(0.11, 12, 10), WHITE, [s * 0.25, 0.1, 0.62], [1, 0.8, 0.6]);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), PUPIL);
    pupil.position.set(0, 0, 0.09);
    eye.add(pupil);
    pupils.push(pupil);
    add(head, new THREE.BoxGeometry(0.26, 0.065, 0.07), HAIR, [s * 0.25, 0.28, 0.64], null, [0, 0, -s * 0.12]);
  });

  // Platform under the avatar
  const platform = new THREE.Group();
  platform.position.y = -2.15;
  scene.add(platform);
  platform.add(new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.05, 0.14, 48), mat(0x0d1322, { flatShading: false, metalness: 0.4, roughness: 0.4 })));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: 0x22d3ee }));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.08;
  platform.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 6, 96), new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.6 }));
  ring2.rotation.x = Math.PI / 2;
  platform.add(ring2);

  // ---------- Orbiting integration nodes ----------
  const orbit = new THREE.Group();
  orbit.rotation.x = 0.18;
  scene.add(orbit);
  const HUB = new THREE.Vector3(0, -0.15, 0);
  const nodeMeshes = [];
  const pulses = [];

  function labelSprite(text, color) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 96;
    const g = c.getContext("2d");
    g.fillStyle = "rgba(13,19,34,0.9)";
    g.strokeStyle = "#" + color.toString(16).padStart(6, "0");
    g.lineWidth = 4;
    g.beginPath();
    g.roundRect(8, 14, 240, 68, 34);
    g.fill();
    g.stroke();
    g.fillStyle = "#e5e9f0";
    g.font = "bold 40px 'JetBrains Mono', monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 128, 50);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.scale.set(0.95, 0.36, 1);
    return s;
  }

  NODES.forEach((n, i) => {
    const a = (i / NODES.length) * Math.PI * 2;
    const radius = 2.85;
    const pos = new THREE.Vector3(Math.cos(a) * radius, Math.sin(i * 1.9) * 0.9 + 0.2, Math.sin(a) * radius);
    const node = new THREE.Group();
    node.position.copy(pos);
    node.userData = { ...n, base: pos.clone(), phase: i * 0.8 };
    orbit.add(node);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.26, 1),
      new THREE.MeshStandardMaterial({ color: n.color, emissive: n.color, emissiveIntensity: 0.55, flatShading: true, roughness: 0.3 })
    );
    core.userData.node = node;
    node.add(core);
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.38, 0),
      new THREE.MeshBasicMaterial({ color: n.color, wireframe: true, transparent: true, opacity: 0.35 })
    );
    node.add(shell);
    node.userData.shell = shell;
    const label = labelSprite(n.label, n.color);
    label.position.y = 0.62;
    node.add(label);
    nodeMeshes.push(core);

    // connection line from the hub to the node, with a travelling data pulse
    const lineGeo = new THREE.BufferGeometry().setFromPoints([HUB, pos]);
    orbit.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: n.color, transparent: true, opacity: 0.28 })));
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: n.color }));
    pulse.userData = { from: HUB, to: pos, t: Math.random(), speed: 0.25 + Math.random() * 0.25, out: i % 2 === 0 };
    orbit.add(pulse);
    pulses.push(pulse);
  });
  // outer workflow ring linking neighbouring nodes
  const ringPts = NODES.map((_, i) => orbit.children.find((c) => c.userData.label === NODES[i].label).position.clone());
  ringPts.push(ringPts[0].clone());
  orbit.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.12 })));

  // ---------- Starfield ----------
  const starGeo = new THREE.BufferGeometry();
  const starCount = 700;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 9 + Math.random() * 10;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.05, transparent: true, opacity: 0.7 }));
  scene.add(stars);

  // ---------- Controls ----------
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -0.1, 0);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.6;
  controls.minPolarAngle = Math.PI * 0.32;
  controls.maxPolarAngle = Math.PI * 0.6;
  // On touch screens, let one-finger swipes scroll the page instead of rotating
  if (coarse) controls.enabled = false;

  // ---------- Sizing ----------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // back the camera off far enough that the whole orbit (plus labels) fits the width
    const tanHalfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    camera.position.setLength(Math.max(11, 3.9 / tanHalfH));
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  // ---------- Interaction ----------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const mouse = { x: 0, y: 0 };
  let hovered = null;
  let waveUntil = 0;
  let bubbleTimer = 0;
  let lineIndex = 0;
  const clock = new THREE.Clock();

  function toNdc(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  function projectToScreen(obj, offsetY = 0) {
    const v = new THREE.Vector3();
    obj.getWorldPosition(v);
    v.y += offsetY;
    v.project(camera);
    return { x: (v.x * 0.5 + 0.5) * container.clientWidth, y: (-v.y * 0.5 + 0.5) * container.clientHeight };
  }

  function say(text) {
    bubble.textContent = text;
    const p = projectToScreen(head, 0.9);
    bubble.style.left = `${Math.min(p.x + 30, container.clientWidth - 250)}px`;
    bubble.style.top = `${Math.max(p.y - 60, 8)}px`;
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove("show"), 3200);
  }

  function wave(text) {
    waveUntil = clock.elapsedTime + 2.2;
    say(text || LINES[lineIndex++ % LINES.length]);
  }
  addEventListener("avatar:wave", () => wave("👋 Hello from the terminal!"));

  addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
  });

  renderer.domElement.addEventListener("pointermove", (e) => {
    toNdc(e);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(nodeMeshes)[0];
    const node = hit ? hit.object.userData.node : null;
    if (node !== hovered) {
      hovered = node;
      renderer.domElement.style.cursor = node ? "pointer" : "";
      tip.hidden = !node;
      if (node) tip.innerHTML = `<b>${node.userData.label}</b> · ${node.userData.info}`;
    }
    if (!node) {
      const overAvatar = raycaster.intersectObjects(clickable)[0];
      renderer.domElement.style.cursor = overAvatar ? "pointer" : "";
    }
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    hovered = null;
    tip.hidden = true;
  });

  // click (not drag) on the avatar or a node
  let downAt = null;
  renderer.domElement.addEventListener("pointerdown", (e) => (downAt = { x: e.clientX, y: e.clientY }));
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;
    toNdc(e);
    raycaster.setFromCamera(ndc, camera);
    const nodeHit = raycaster.intersectObjects(nodeMeshes)[0];
    if (nodeHit) {
      const n = nodeHit.object.userData.node.userData;
      say(`${n.label}: ${n.info}`);
      document.querySelector(n.target)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (raycaster.intersectObjects(clickable)[0]) wave();
  });

  // Greeting
  setTimeout(() => wave("Hi! I'm Ali 👋 drag me or click me"), 1200);

  // ---------- Render loop (paused while off-screen) ----------
  let running = true;
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    if (running) loop();
  }).observe(container);

  let nextBlink = 2;
  const motion = reduceMotion ? 0 : 1;

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // idle breathing
    avatar.position.y = -0.35 + Math.sin(t * 1.6) * 0.035 * motion;

    // head + pupils follow the cursor
    head.rotation.y += (mouse.x * 0.55 - head.rotation.y) * 0.08;
    head.rotation.x += (mouse.y * 0.28 - head.rotation.x) * 0.08;
    pupils.forEach((p) => {
      p.position.x += (mouse.x * 0.03 - p.position.x) * 0.2;
      p.position.y += (-mouse.y * 0.025 - p.position.y) * 0.2;
    });

    // blinking
    if (t > nextBlink) {
      eyes.scale.y = 0.1;
      if (t > nextBlink + 0.12) {
        eyes.scale.y = 1;
        nextBlink = t + 2.5 + Math.random() * 3;
      }
    }

    // waving arm
    const waving = t < waveUntil;
    const targetZ = waving ? 2.55 + Math.sin(t * 14) * 0.35 : 0.14;
    rightArm.rotation.z += (targetZ - rightArm.rotation.z) * 0.18;

    // orbit + nodes
    orbit.rotation.y += dt * 0.16 * motion;
    orbit.children.forEach((c) => {
      if (!c.userData.base) return;
      c.position.y = c.userData.base.y + Math.sin(t * 1.2 + c.userData.phase) * 0.12 * motion;
      c.userData.shell.rotation.y += dt * 0.8;
      c.userData.shell.rotation.x += dt * 0.5;
      const s = c === hovered ? 1.35 : 1;
      c.scale.setScalar(c.scale.x + (s - c.scale.x) * 0.15);
    });
    pulses.forEach((p) => {
      const d = p.userData;
      d.t = (d.t + dt * d.speed * motion) % 1;
      const k = d.out ? d.t : 1 - d.t;
      p.position.lerpVectors(d.from, d.to, k);
    });

    // hovered node tooltip follows the node
    if (hovered) {
      const s = projectToScreen(hovered, 0.55);
      tip.style.left = `${s.x}px`;
      tip.style.top = `${s.y}px`;
    }

    stars.rotation.y += dt * 0.01 * motion;
    ring.material.color.setHSL(0.52 + Math.sin(t * 0.5) * 0.04, 0.85, 0.55);
    controls.update();
    renderer.render(scene, camera);
  }

  container.classList.add("has-3d");
  loop();
}
