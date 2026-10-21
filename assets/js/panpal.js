/* =========================================================================
   panpal.js — Pan Pal, LeadStart's hero, as a buddy you can drag anywhere
   and chat with in a bubble.

   MOCKUP: loaded on the homepage only, and not shipped. His replies are
   scripted from this site's own FAQ; a live version would POST the
   conversation to /app/api/site-chat, LeadStart-App's existing chat
   endpoint (same origin through the /app rewrite in vercel.json).

   His face is Forge's HeroFace (src/renderer/src/components/HeroFace.tsx),
   drawn with the same shapes and colours; the standing body is new here.
   How he behaves follows Forge's Super Clippy (components/ClippyBuddy.tsx):
   drag him anywhere and he stays put, tap him to open his bubble, his eyes
   follow your pointer, and he only animates while something is happening.
   ========================================================================= */
(() => {
  'use strict'
  if (window.LeadStartPanPal) return

  // ------------------------------------------------------------- his art --
  /** A closed path through `n` points of the curve `at` (t from 0 to 2π). */
  const trace = (at, n = 240) =>
    'M' +
    Array.from({ length: n }, (_, i) =>
      at((i / n) * 2 * Math.PI)
        .map((v) => v.toFixed(2))
        .join(' '),
    ).join('L') +
    'Z'
  const pow = (v, p) => Math.sign(v) * Math.abs(v) ** p

  // His head: the envelope, gone round and soft as a pillow (a squircle).
  const HEAD = trace((t) => [50 + 35 * pow(Math.cos(t), 2 / 3.4), 58.5 + 27 * pow(Math.sin(t), 2 / 3.4)])

  // The Patch Mask: two teardrops shaped like a panda's eye patches, and a bridge over the nose.
  const lobe = (cx, cy, rot, drop) => {
    const c = Math.cos((rot * Math.PI) / 180)
    const s = Math.sin((rot * Math.PI) / 180)
    return trace((t) => {
      const x = 20.26 * Math.cos(t)
      const y = 16.35 * Math.sin(t) * (1 - drop * Math.cos(t))
      return [cx + x * c - y * s, cy + x * s + y * c]
    })
  }
  const MASK = [lobe(38.75, 54.63, -26, 0.26), lobe(85.25, 54.63, 26, -0.26), 'M48 43.03 Q62 38.03 76 43.03 L76 52.03 Q62 47.03 48 52.03 Z']

  const NAVY = '#0b0f5c'
  const INK = '#1b1b1f'
  let uid = 0

  const defs = (u) => `
    <linearGradient id="${u}cape" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7d83ff"/><stop offset=".42" stop-color="#2e37fe"/><stop offset="1" stop-color="#1a1f9e"/></linearGradient>
    <linearGradient id="${u}suit" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d83ff"/><stop offset=".5" stop-color="#2e37fe"/><stop offset="1" stop-color="#1a1f9e"/></linearGradient>
    <linearGradient id="${u}mask" gradientUnits="userSpaceOnUse" x1="0" y1="33" x2="0" y2="73"><stop offset="0" stop-color="#6b72ff"/><stop offset=".5" stop-color="#2e37fe"/><stop offset="1" stop-color="#1d24b8"/></linearGradient>
    <linearGradient id="${u}tie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b72ff"/><stop offset=".55" stop-color="#2e37fe"/><stop offset="1" stop-color="#1d24b8"/></linearGradient>
    <radialGradient id="${u}gold" cx=".35" cy=".35" r=".75"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#d99a0e"/></radialGradient>
    <linearGradient id="${u}paper" gradientUnits="userSpaceOnUse" x1="0" y1="26" x2="0" y2="90"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eceff5"/></linearGradient>
    <radialGradient id="${u}fur" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#444a58"/><stop offset=".6" stop-color="${INK}"/><stop offset="1" stop-color="#0c0d10"/></radialGradient>
    <radialGradient id="${u}inner" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#454c5e"/><stop offset="1" stop-color="#252a35"/></radialGradient>
    <radialGradient id="${u}disc" cx=".5" cy=".3" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#edeeff"/><stop offset="1" stop-color="#d1d3ff"/></radialGradient>
    <clipPath id="${u}o"><circle cx="50" cy="50" r="50"/></clipPath>
    <clipPath id="${u}hd"><path d="${HEAD}"/></clipPath>
    <clipPath id="${u}torso"><rect x="36" y="80" width="28" height="30" rx="12"/></clipPath>`

  /** His head, exactly as Forge draws it: the mask's ties, Velvet ears, the envelope, Big Grin brows, mask, eyes and smile. */
  const head = (u) => {
    const url = (id) => `url(#${u}${id})`
    const ears = [23.5, 76.5]
      .map(
        (x) => `
      <circle cx="${x}" cy="34" r="13.65" fill="${url('fur')}"/>
      <circle cx="${x < 50 ? x + 1.64 : x - 1.64}" cy="35.37" r="6.83" fill="${url('inner')}"/>
      <path d="M${x - 9.4} 29.62 A10.37 10.37 0 0 1 ${x - 2.16} 23.85" fill="none" stroke="rgba(255,255,255,.32)" stroke-width="1.5" stroke-linecap="round"/>`,
      )
      .join('')
    // Each eye blinks as one group; its pupil and glints look about inside it.
    const eyes = [41.75, 82.25]
      .map(
        (x) => `
      <g class="pp-eye" data-x="${x}">
        <ellipse cx="${x}" cy="53.03" rx="10.26" ry="12.15" fill="#fff" stroke="#1f2430" stroke-width="1.6"/>
        <g class="pp-pupil">
          <ellipse cx="${x + 0.54}" cy="54.78" rx="6.24" ry="6.77" fill="#141821"/>
          <circle cx="${x - 1.71}" cy="52.07" r="2.09" fill="#fff"/>
          <circle cx="${x + 3.16}" cy="57.62" r=".95" fill="#fff" opacity=".9"/>
        </g>
      </g>`,
      )
      .join('')
    return `
      <g fill="${url('tie')}" stroke="${NAVY}" stroke-width="1.1" stroke-linejoin="round">
        <path d="M76 51.5 C86 45.5 94 52.5 104 44.5 C101 56.5 90 59.5 77 57.5 Z"/>
        <path d="M76 57 C85 58.5 91 64.5 100 64.5 C94 69.5 85 67.5 76 61.5 Z"/>
      </g>
      <path d="M84 50.5 C90 47.9 95 50.1 101 47.1" fill="none" stroke="rgba(255,255,255,.3)" stroke-width=".9" stroke-linecap="round"/>
      ${ears}
      <path d="${HEAD}" fill="${url('paper')}" stroke="#2a3140" stroke-width="1.1"/>
      <g clip-path="${url('hd')}" fill="none">
        <path d="M12 34 Q33 40.5 47 43.2 Q50 43.9 53 43.2 Q67 40.5 88 34" stroke="#c9d0dc" stroke-width="1.35" stroke-linejoin="round"/>
        <path d="M28 35.4 Q36 33.8 45 33.6" stroke="#fff" stroke-width="1.1" opacity=".9" stroke-linecap="round"/>
      </g>
      <path class="pp-brows" d="M43.26 46.6 Q38.66 42.4 33.86 46.2 M56.74 46.6 Q61.34 42.4 66.14 46.2" fill="none" stroke="${INK}" stroke-width="2.1" stroke-linecap="round"/>
      <g transform="translate(14.66 29.69) scale(.57)" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="19.5" cy="78.4" rx="8.2" ry="4.8" fill="#f472b6" opacity=".3"/>
        <ellipse cx="104.5" cy="78.4" rx="8.2" ry="4.8" fill="#f472b6" opacity=".3"/>
        ${MASK.map((d) => `<path d="${d}" fill="${NAVY}" stroke="${NAVY}" stroke-width="4"/>`).join('')}
        ${MASK.map((d) => `<path d="${d}" fill="${url('mask')}"/>`).join('')}
        <path d="M27.75 44.03 Q35.75 36.53 47.75 37.03" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="1.6"/>
        ${eyes}
        <ellipse cx="62" cy="70.8" rx="4.4" ry="2.9" fill="${INK}"/>
        <ellipse cx="60.6" cy="69.9" rx="1.5" ry=".7" fill="#fff" opacity=".5"/>
        <path d="M54.4 75.6 Q62 77.8 69.6 75.6 Q68.6 85.4 62 85.6 Q55.4 85.4 54.4 75.6 Z" fill="#3b1d2b" stroke="${INK}" stroke-width="1.8"/>
        <path d="M57.2 82.6 Q62 79.4 66.8 82.6 Q64.8 85.3 62 85.4 Q59.2 85.3 57.2 82.6 Z" fill="#f472b6"/>
      </g>`
  }

  /** His bust in a circle, as Forge shows him wherever an agent's photo goes (and the favicon): its gradients, then its shapes. */
  const bust = (u) => {
    const url = (id) => `url(#${u}${id})`
    return {
      defs: defs(u),
      shapes: `<g clip-path="${url('o')}">
        <rect width="100" height="100" fill="${url('disc')}"/>
        <path d="M30 87.2 L14 104 L86 104 L70 87.2 Z" fill="${url('cape')}" stroke="${NAVY}" stroke-width="1.6" stroke-linejoin="round"/>
        <rect x="33" y="81.2" width="34" height="30" rx="12" fill="${url('suit')}" stroke="${NAVY}" stroke-width="1.4"/>
        ${[37.5, 62.5].map((x) => `<circle cx="${x}" cy="89.7" r="2.6" fill="${url('gold')}" stroke="rgba(0,0,0,.45)" stroke-width="1"/>`).join('')}
        ${head(u)}
      </g>`,
    }
  }
  const face = (cls = 'pp-face') => {
    const b = bust(`ppf${++uid}`)
    return `<svg class="${cls}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${b.defs}</defs>${b.shapes}</svg>`
  }
  // The chat draws his face once, here, and every avatar in it points at that copy (a full copy is about 24 KB of
  // markup, and each reply would otherwise add one).
  const sprite = () => {
    const b = bust(`ppf${++uid}`)
    return `<svg class="pp-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs>${b.defs}</defs><symbol id="pp-face" viewBox="0 0 100 100">${b.shapes}</symbol></svg>`
  }
  const avatar = (cls) => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#pp-face"/></svg>`

  // Where each arm hangs from, and its resting angle.
  const SHOULDER = { l: [36.4, 90.5], r: [63.6, 90.5] }
  const REST_ARM = { l: 24, r: -24 }

  /** All of him, standing: his head on a small caped suit with a bolt badge, panda-black paws and feet, and a shadow. */
  const figure = () => {
    const u = `ppb${++uid}`
    const url = (id) => `url(#${u}${id})`
    const arm = (side) => {
      const [x, y] = SHOULDER[side]
      return `<g class="pp-arm" data-side="${side}" transform="rotate(${REST_ARM[side]} ${x} ${y})">
        <rect x="${x - 3.3}" y="${y - 2.2}" width="6.6" height="15.2" rx="3.3" fill="${url('suit')}" stroke="${NAVY}" stroke-width="1.2"/>
        <circle cx="${x}" cy="${y + 13.6}" r="3.9" fill="${url('fur')}"/>
      </g>`
    }
    return `<svg class="pp-figure" viewBox="4 16 102 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs(u)}</defs>
      <ellipse class="pp-shadow" cx="50" cy="121.4" rx="21" ry="3.1" fill="rgba(15,23,42,.18)"/>
      <g class="pp-body">
        <path d="M36 86.5 Q50 84 64 86.5 C69.5 96 74.5 104.5 78 114 Q71 111.8 64 115 Q57 111.8 50 115 Q43 111.8 36 115 Q29 111.8 22 114 C25.5 104.5 30.5 96 36 86.5 Z" fill="${url('cape')}" stroke="${NAVY}" stroke-width="1.4" stroke-linejoin="round"/>
        ${[41.2, 51.4].map((x) => `<rect x="${x}" y="102" width="7.4" height="15" rx="3.7" fill="${url('fur')}"/>`).join('')}
        ${[44.4, 55.6].map((x) => `<ellipse cx="${x}" cy="117.6" rx="5" ry="3.1" fill="${url('fur')}"/>`).join('')}
        <rect x="36" y="80" width="28" height="30" rx="12" fill="${url('suit')}"/>
        <rect x="30" y="102.2" width="40" height="3.4" fill="${NAVY}" clip-path="${url('torso')}"/>
        <rect x="36" y="80" width="28" height="30" rx="12" fill="none" stroke="${NAVY}" stroke-width="1.4"/>
        <rect x="47.6" y="101.6" width="4.8" height="4.6" rx="1" fill="${url('gold')}" stroke="rgba(0,0,0,.4)" stroke-width=".6"/>
        <circle cx="50" cy="93.2" r="5.4" fill="#fff" stroke="${NAVY}" stroke-width="1.1"/>
        <path d="M51.3 88.9 L47.3 94 L49.9 94 L48.7 97.6 L52.8 92.3 L50.1 92.3 Z" fill="${url('gold')}" stroke="rgba(0,0,0,.35)" stroke-width=".5" stroke-linejoin="round"/>
        ${head(u)}
        ${arm('l')}${arm('r')}
        ${[39.6, 60.4].map((x) => `<circle cx="${x}" cy="88.4" r="2.4" fill="${url('gold')}" stroke="rgba(0,0,0,.45)" stroke-width=".9"/>`).join('')}
      </g></svg>`
  }

  window.LeadStartPanPal = { face, figure }

  // ------------------------------------------------------ what he says --
  // Every reply comes from LeadStart-App's answer book, word for word (POST /app/api/site-chat, which leadstart.io's
  // /app rewrite makes the same site): Claude only picks which entry answers the visitor and never writes a reply
  // (src/lib/site-chat/ in LeadStart-App). The widget holds only what shows before anyone asks: his greeting, his hello
  // lines and the suggested questions, each tied to its entry in the book, so a click on one skips Claude.
  const API = '/app/api/site-chat'
  const CHIPS = [
    { label: 'How does it work?', topic: 'how_it_works' },
    { label: 'How does pricing work?', topic: 'pricing' },
    { label: 'Is my territory exclusive?', topic: 'territory' },
    { label: 'How fast will I see results?', topic: 'timeline' },
    { label: 'Where do my leads come from?', topic: 'lead_sources' },
    { label: 'Book an intro call', topic: 'book' },
  ]
  const GREETING = "Hey, I'm Pan Pal, LeadStart's outreach sidekick! Ask me anything about how we book intro calls with your ideal customers."
  const INTRO = "Pan Pal is automated. Anything he can't answer goes to our team."
  // When the book can't be reached: its own "Reaching a person" entry.
  const OFFLINE = {
    text: "Call or text Daniel at 425-286-9732, or email hello@leadstart.io. You'll hear back the same day, usually within a few hours.",
    links: [{ label: 'Contact page', href: '/contact.html' }],
  }
  // What he says now and then with a little wave: the first line first, then all of them in a shuffled order, none
  // twice until he's said them all. Each leads with something the homepage says (no fact it doesn't), fits two lines of
  // his 250px speech bubble (measured), says "ideal customers", never "buyers", and keeps to Daniel's marks: one
  // exclamation mark at most, no em dashes, no emoji. A click on one opens his chat, shows `ask` as the visitor's
  // question and answers it from the book's `topic`, so every "ask me" gets its answer.
  const HELLOS = [
    { say: "Hey, I'm Pan Pal. Ask me what I can do for you!", ask: 'What can you do for me?', topic: 'how_it_works' },
    { say: 'We book intro calls with your ideal customers. Ask me how.', ask: 'How does it work?', topic: 'how_it_works' },
    { say: 'What does it cost? Ask me how quotes work.', ask: 'How does pricing work?', topic: 'pricing' },
    { say: 'One client per territory per vertical. Ask me why.', ask: 'Why one client per territory?', topic: 'territory' },
    { say: 'First intro calls usually land in weeks 3 to 5. Ask me why.', ask: 'Why weeks 3 to 5?', topic: 'timeline' },
    { say: 'Your lists are built fresh, not bought. Curious how?', ask: 'How are my lists built?', topic: 'lead_sources' },
    { say: 'Hot replies hit your phone in seconds. Ask me how.', ask: 'How do hot replies reach me?', topic: 'hot_replies' },
    { say: 'Month-to-month, no annual contracts. Curious why?', ask: 'Why month-to-month?', topic: 'contract' },
    { say: "You don't touch the tech. Ask me what we handle.", ask: 'What do you handle for me?', topic: 'done_for_you' },
  ]

  // ----------------------------------------------------------- the buddy --
  const SPOT = 'leadstart.panpalSpot'
  const PAD = 8
  /** How far a press has to move before it's a drag rather than a tap. */
  const DRAG_PX = 4
  /** How long the pointer rests before his eyes drift back to the middle. */
  const REST_MS = 2000
  /** How close (beyond his edge) the pointer has to come before his eyes follow it. */
  const NEAR = 250
  const GAP = 10
  /** How long a hello stays up, and how long he waves as it comes out. */
  const REMARK_MS = 5000
  const HELLO_WAVE_MS = 1600
  /** The first hello after the page settles, then one every 10 to 15 seconds. */
  const HELLO_FIRST_MS = 2500
  const HELLO_EVERY_MS = [10000, 15000]
  /** Between him and his speech bubble, room for its tail. */
  const SAY_GAP = 12
  const fine = matchMedia('(hover: hover) and (pointer: fine)')
  const still = matchMedia('(prefers-reduced-motion: reduce)')
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, hi < lo ? lo : v))
  const vw = () => document.documentElement.clientWidth
  const vh = () => window.innerHeight
  const el = (tag, cls, attrs = {}) => {
    const n = document.createElement(tag)
    if (cls) n.className = cls
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v)
    return n
  }

  const me = el('div', 'pp-buddy', {
    role: 'button',
    tabindex: '0',
    'aria-label': 'Chat with Pan Pal',
    'aria-expanded': 'false',
    'aria-controls': 'pp-chat',
    title: 'Pan Pal · drag me anywhere',
  })
  me.innerHTML = figure()

  const say = el('button', 'pp-say', { type: 'button' })
  say.hidden = true

  const bubble = el('div', 'pp-bubble closed gone', { id: 'pp-chat', role: 'dialog', 'aria-label': 'Chat with Pan Pal', 'aria-hidden': 'true' })
  bubble.inert = true
  bubble.innerHTML = `
    <span class="pp-tail" aria-hidden="true"></span>
    <div class="pp-card">
      <header class="pp-head">
        <button type="button" class="pp-back" aria-label="Back to the page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <span class="pp-avatar">${avatar('pp-face')}</span>
        <span class="pp-who"><strong>Pan Pal</strong><span>LeadStart's outreach sidekick</span></span>
        <button type="button" class="pp-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="pp-log" role="log" aria-live="polite"></div>
      <form class="pp-compose">
        <textarea rows="1" placeholder="Ask Pan Pal anything…" aria-label="Message Pan Pal" enterkeyhint="send"></textarea>
        <button type="submit" class="pp-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>
      </form>
    </div>`
  const log = bubble.querySelector('.pp-log')
  const box = bubble.querySelector('textarea')
  const form = bubble.querySelector('form')

  const art = el('div')
  art.innerHTML = sprite()
  document.body.append(art.firstElementChild, me, say, bubble)

  const body = me.querySelector('.pp-body')
  const shadow = me.querySelector('.pp-shadow')
  const eyes = [...me.querySelectorAll('.pp-eye')]
  const pupils = [...me.querySelectorAll('.pp-pupil')]
  const brows = me.querySelector('.pp-brows')
  const arms = Object.fromEntries([...me.querySelectorAll('.pp-arm')].map((g) => [g.dataset.side, g]))

  // ---------- where he stands ----------
  // An offset from the window's nearest corner, so a resize keeps him where you left him.
  const loadSpot = () => {
    try {
      const s = JSON.parse(localStorage.getItem(SPOT) ?? 'null')
      if (s && (s.h === 'left' || s.h === 'right') && (s.v === 'top' || s.v === 'bottom')) return s
    } catch {
      // fall through to the default
    }
    return { h: 'right', x: 20, v: 'bottom', y: 16 }
  }
  let spot = loadSpot()
  let pos = { x: 0, y: 0 }
  const xyOf = (s) => {
    const w = me.offsetWidth
    const h = me.offsetHeight
    const x = s.h === 'left' ? s.x : vw() - w - s.x
    const y = s.v === 'top' ? s.y : vh() - h - s.y
    return { x: clamp(x, PAD, vw() - w - PAD), y: clamp(y, PAD, vh() - h - PAD) }
  }
  const spotOf = ({ x, y }) => {
    const w = me.offsetWidth
    const h = me.offsetHeight
    const left = x + w / 2 < vw() / 2
    const top = y + h / 2 < vh() / 2
    return { h: left ? 'left' : 'right', x: left ? x : vw() - w - x, v: top ? 'top' : 'bottom', y: top ? y : vh() - h - y }
  }
  const stand = (p) => {
    pos = p
    me.style.left = `${p.x}px`
    me.style.top = `${p.y}px`
  }
  stand(xyOf(spot))

  // ---------- his bubble, beside him ----------
  let open = false
  let hideTimer
  const setPlace = (left, top, side, tail) => {
    bubble.style.left = `${Math.round(left)}px`
    bubble.style.top = `${Math.round(top)}px`
    bubble.dataset.side = side
    bubble.style.setProperty('--tail', `${Math.round(tail)}px`)
  }
  // On the side with more room, level with his head, the tail on him; on a narrow screen, above or below him.
  const place = () => {
    const { x, y } = pos
    const w = me.offsetWidth
    const h = me.offsetHeight
    bubble.classList.remove('stack')
    bubble.style.height = ''
    let bw = bubble.offsetWidth
    if (vw() >= bw + w + GAP + PAD * 2 + 8) {
      const bh = bubble.offsetHeight
      const roomR = vw() - (x + w)
      const right = roomR >= bw + GAP + PAD || roomR > x
      const left = clamp(right ? x + w + GAP : x - bw - GAP, PAD, vw() - bw - PAD)
      const headAt = y + h * 0.42
      const top = clamp(headAt - Math.min(bh * 0.72, Math.max(40, bh - 60)), PAD, vh() - bh - PAD)
      setPlace(left, top, right ? 'left' : 'right', clamp(headAt - top, 26, bh - 26))
      return
    }
    bubble.classList.add('stack')
    bw = bubble.offsetWidth
    const above = y - GAP - PAD
    const below = vh() - (y + h) - GAP - PAD
    const up = above >= below
    const bh = Math.max(240, Math.min(540, up ? above : below))
    bubble.style.height = `${bh}px`
    const left = clamp(x + w / 2 - bw / 2, PAD, vw() - bw - PAD)
    const top = clamp(up ? y - GAP - bh : y + h + GAP, PAD, vh() - bh - PAD)
    setPlace(left, top, up ? 'bottom' : 'top', clamp(x + w / 2 - left, 26, bw - 26))
  }

  // ---------- a remark, while his bubble is shut ----------
  let sayTimer
  let sayOut = null
  const hideSay = () => {
    clearTimeout(sayTimer)
    if (!say.hidden && !sayOut && !still.matches) {
      // It goes back the way it came, a little quicker: shrinking into its tail as it fades.
      sayOut = say.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.6)' }], { duration: 160, easing: 'ease-in' })
      sayOut.onfinish = () => {
        say.hidden = true
        sayOut = null
      }
    } else if (!sayOut) say.hidden = true
    // He waves while his hello is up, and stops when it goes.
    if (waveUntil > performance.now()) {
      waveUntil = performance.now()
      kick()
    }
  }
  // A speech bubble beside him, its tail on his face: on the side with room, else above or below him.
  const placeSay = () => {
    if (say.hidden) return
    const { x, y } = pos
    const w = me.offsetWidth
    const h = me.offsetHeight
    const sw = say.offsetWidth
    const sh = say.offsetHeight
    const roomR = vw() - (x + w) - SAY_GAP - PAD
    const roomL = x - SAY_GAP - PAD
    let left, top, side, tail
    if (roomR >= sw || roomL >= sw) {
      const right = roomR >= sw && (roomR >= roomL || roomL < sw)
      const faceAt = y + h * 0.36
      left = right ? x + w + SAY_GAP : x - sw - SAY_GAP
      top = clamp(faceAt - 22, PAD, vh() - sh - PAD)
      side = right ? 'left' : 'right'
      tail = clamp(faceAt - top, 14, sh - 14)
    } else {
      const up = y - sh - SAY_GAP >= PAD
      left = clamp(x + w / 2 - sw / 2, PAD, vw() - sw - PAD)
      top = up ? y - sh - SAY_GAP : y + h + SAY_GAP
      side = up ? 'bottom' : 'top'
      tail = clamp(x + w / 2 - left, 16, sw - 16)
    }
    say.dataset.side = side
    say.style.left = `${Math.round(left)}px`
    say.style.top = `${Math.round(top)}px`
    say.style.setProperty('--tail', `${Math.round(tail)}px`)
  }
  const remark = (text) => {
    if (open) return
    sayOut?.cancel()
    sayOut = null
    say.textContent = text
    say.hidden = false
    placeSay()
    wave(HELLO_WAVE_MS)
    clearTimeout(sayTimer)
    sayTimer = setTimeout(hideSay, REMARK_MS)
  }

  // ---------- a hello now and then ----------
  let helloTimer
  let helloQueue = [HELLOS[0]]
  let lastHello
  // The hello on screen now, so a click on it asks its question.
  let showing
  const nextHello = () => {
    if (!helloQueue.length) {
      helloQueue = HELLOS.slice()
      for (let i = helloQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[helloQueue[i], helloQueue[j]] = [helloQueue[j], helloQueue[i]]
      }
      // Never the same line twice in a row across rounds.
      if (helloQueue[0] === lastHello) helloQueue.push(helloQueue.shift())
    }
    lastHello = helloQueue.shift()
    return lastHello
  }
  const helloIn = (ms) => {
    clearTimeout(helloTimer)
    helloTimer = setTimeout(sayHello, ms)
  }
  const helloLater = () => helloIn(HELLO_EVERY_MS[0] + Math.random() * (HELLO_EVERY_MS[1] - HELLO_EVERY_MS[0]))
  // Quiet while his chat is open (closing it starts the count again), and while he's carried or the tab is hidden.
  function sayHello() {
    if (open) return
    if (drag?.moved || document.hidden) return helloIn(4000)
    showing = nextHello()
    remark(showing.say)
    helloLater()
  }

  // ---------- the chat ----------
  const CHAT = 'leadstart.panpalChat'
  // The conversation, kept for this visit so it follows the visitor from page to page: each turn as it was shown, and
  // the topics already answered, so a suggestion never asks for one of them again.
  let history = []
  const given = new Set()
  try {
    const saved = JSON.parse(sessionStorage.getItem(CHAT) ?? 'null')
    if (saved && Array.isArray(saved.history)) {
      history = saved.history.filter((t) => (t.role === 'visitor' || t.role === 'pan_pal') && typeof t.text === 'string').slice(-40)
      for (const t of saved.given ?? []) given.add(t)
    }
  } catch {
    // a fresh conversation
  }
  const keep = () => {
    try {
      sessionStorage.setItem(CHAT, JSON.stringify({ history: history.slice(-40), given: [...given] }))
    } catch {
      // storage full or blocked: the conversation lasts this page only
    }
  }
  let chipsRow = null
  let queue = Promise.resolve()

  // The conversation sits at its newest line and stays there as lines arrive, the box grows or the keyboard comes up,
  // unless the visitor has scrolled back to read.
  let atEnd = true
  let logH = 0
  const toEnd = () => {
    log.scrollTop = log.scrollHeight
    atEnd = true
  }
  log.addEventListener(
    'scroll',
    () => {
      // WebKit fires a scroll as the conversation shrinks, before a ResizeObserver hears of it: a scroll that comes with
      // a height change is ignored, or "at the end" would turn false.
      if (log.clientHeight !== logH) return
      atEnd = log.scrollHeight - log.scrollTop - log.clientHeight < 4
    },
    { passive: true },
  )
  new ResizeObserver(() => {
    logH = log.clientHeight
    if (atEnd) toEnd()
  }).observe(log)

  // Pan Pal's lines are plain text beside his face; the visitor's are flat bubbles on the right.
  const render = (turn, fresh) => {
    const row = el('div', `pp-msg ${turn.role === 'visitor' ? 'me' : 'bot'}${fresh ? ' fresh' : ''}`)
    if (turn.role === 'pan_pal') row.insertAdjacentHTML('afterbegin', avatar('pp-mini'))
    const col = el('div', 'pp-col')
    const t = el('div', 'pp-text')
    t.textContent = turn.text
    col.append(t)
    if (turn.links?.length) {
      const c = el('div', 'pp-ctas')
      for (const { label, href } of turn.links) {
        const a = el('a', 'pp-link', { href })
        a.textContent = label
        c.append(a)
      }
      col.append(c)
    }
    row.append(col)
    log.append(row)
    if (atEnd) toEnd()
  }
  const addTurn = (turn) => {
    history.push(turn)
    keep()
    render(turn, !still.matches)
  }
  const showChips = () => {
    chipsRow?.remove()
    chipsRow = null
    const left = CHIPS.filter((c) => !given.has(c.topic)).slice(0, 3)
    if (!left.length) return
    chipsRow = el('div', `pp-chips${still.matches ? '' : ' fresh'}`)
    for (const c of left) {
      const b = el('button', 'pp-chip', { type: 'button' })
      b.textContent = c.label
      b.addEventListener('click', () => send(c.label, c.topic))
      chipsRow.append(b)
    }
    log.append(chipsRow)
    if (atEnd) toEnd()
  }
  // The conversation as it was on the last page, or his greeting to start one.
  const rebuild = () => {
    log.textContent = ''
    log.append(el('p', 'pp-intro'))
    log.firstChild.textContent = INTRO
    if (history.length) for (const t of history) render(t, false)
    else addTurn({ role: 'pan_pal', text: GREETING })
    showChips()
    toEnd()
  }
  // Thinking is a line of dots and the word, not a bubble.
  const thinking = () => {
    const t = el('div', 'pp-thinking', { role: 'status' })
    t.innerHTML = '<span class="pp-dots" aria-hidden="true"><i></i><i></i><i></i></span>Thinking'
    log.append(t)
    if (atEnd) toEnd()
    return t
  }
  const ask = async (payload) => {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 15000)
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal })
      const data = await r.json().catch(() => null)
      return r.ok && Array.isArray(data?.replies) && data.replies.length ? data.replies : [OFFLINE]
    } catch {
      return [OFFLINE]
    } finally {
      clearTimeout(timer)
    }
  }
  const respond = async (payload) => {
    const t = thinking()
    const replies = await ask(payload)
    t.remove()
    for (const r of replies) {
      if (r.topic) given.add(r.topic)
      addTurn({ role: 'pan_pal', text: r.text, links: Array.isArray(r.links) ? r.links : [] })
    }
    showChips()
    wave()
  }
  // A known question goes as its topic and skips Claude; a typed one goes with the conversation so far.
  const send = (raw, topic) => {
    const text = raw.trim()
    if (!text) return
    chipsRow?.remove()
    chipsRow = null
    addTurn({ role: 'visitor', text })
    const payload = topic ? { topic } : { messages: history.slice(-20).map(({ role, text: t }) => ({ role, text: t })) }
    queue = queue.then(() => respond(payload))
  }
  // The box grows to about six lines before it scrolls inside. Measuring it (height auto, then scrollHeight) gives the
  // conversation that height for an instant and clamps its scroll, so it goes back to its end in the same frame.
  const fit = () => {
    box.style.height = 'auto'
    box.style.height = `${Math.min(box.scrollHeight, 150)}px`
    if (atEnd) toEnd()
  }
  box.addEventListener('input', fit)
  // Return sends; Shift Return adds a line.
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault()
      form.requestSubmit()
    }
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    send(box.value)
    box.value = ''
    fit()
  })

  // ---------- opening and closing ----------
  // On a phone the chat is its own screen over the page (Daniel's phone chat rule): it grows out of Pan Pal and goes
  // back into him by the same path, turning round from where it is if pressed again on the way. Wider, it's the bubble
  // beside him.
  const phone = matchMedia('(max-width: 600px)')
  const root = document.documentElement
  let full = false
  let motion = null
  // The full screen shrunk onto Pan Pal: where it starts opening and ends closing.
  const onto = () => {
    const r = me.getBoundingClientRect()
    return `translate(${r.left}px, ${r.top - (vv?.offsetTop ?? 0)}px) scale(${r.width / innerWidth}, ${r.height / innerHeight})`
  }
  const finishClose = () => {
    bubble.classList.add('closed', 'gone')
    bubble.classList.remove('full')
    root.classList.remove('pp-locked')
  }
  const swing = (opening) => {
    if (motion?.playState === 'running') motion.reverse()
    else {
      const frames = [
        { transform: onto(), opacity: 0 },
        { transform: 'none', opacity: 1 },
      ]
      motion = bubble.animate(frames, opening ? { duration: 220, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' } : { duration: 160, easing: 'ease-in', direction: 'reverse' })
    }
    const m = motion
    m.onfinish = () => {
      if (motion !== m) return
      motion = null
      if (!open) finishClose()
    }
  }
  const lay = () => {
    if (full) {
      bubble.style.setProperty('--screen-h', `${innerHeight}px`)
      followViewport()
    } else place()
  }
  const setOpen = (v, how) => {
    if (v === open) return
    open = v
    me.setAttribute('aria-expanded', String(v))
    me.setAttribute('aria-label', v ? 'Close chat with Pan Pal' : 'Chat with Pan Pal')
    clearTimeout(hideTimer)
    if (v) {
      hideSay()
      full = phone.matches
      bubble.classList.toggle('full', full)
      root.classList.toggle('pp-locked', full)
      // Shown and placed before the box takes the cursor: a hidden box refuses focus.
      bubble.classList.remove('gone')
      bubble.inert = false
      bubble.removeAttribute('aria-hidden')
      lay()
      if (!log.childElementCount) rebuild()
      if (full && !still.matches) swing(true)
      bubble.classList.remove('closed')
      // The cursor goes straight into the box; on a phone, the keyboard waits for a tap in it.
      if (!full && (how === 'key' || fine.matches)) box.focus({ preventScroll: true })
    } else {
      const inside = bubble.contains(document.activeElement)
      if (inside) box.blur()
      bubble.inert = true
      bubble.setAttribute('aria-hidden', 'true')
      if (full && !still.matches) swing(false)
      else if (full) finishClose()
      else {
        bubble.classList.add('closed')
        hideTimer = setTimeout(() => bubble.classList.add('gone'), 200)
      }
      if (inside && how === 'key') me.focus({ preventScroll: true })
      helloLater()
    }
    kick()
  }
  bubble.querySelector('.pp-close').addEventListener('click', () => setOpen(false, 'press'))
  bubble.querySelector('.pp-back').addEventListener('click', () => setOpen(false, 'press'))
  say.addEventListener('click', () => {
    const hello = showing
    setOpen(true, 'press')
    if (hello) send(hello.ask, hello.topic)
  })
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open && bubble.contains(document.activeElement)) setOpen(false, 'key')
  })
  // Turned between a phone's width and a wider one while open: the chat changes form with it.
  phone.addEventListener('change', () => {
    if (!open || full === phone.matches) return
    motion?.cancel()
    motion = null
    full = phone.matches
    bubble.classList.toggle('full', full)
    root.classList.toggle('pp-locked', full)
    lay()
  })
  // An edge swipe from the left goes back to the page, as Back does.
  let swipe = null
  bubble.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0]
      swipe = full && t.clientX < 24 ? { x: t.clientX, y: t.clientY } : null
    },
    { passive: true },
  )
  bubble.addEventListener('touchend', (e) => {
    const s = swipe
    swipe = null
    const t = e.changedTouches[0]
    if (s && t.clientX - s.x > 70 && Math.abs(t.clientY - s.y) < 60) setOpen(false, 'press')
  })

  // ---------- the keyboard, on a phone ----------
  // The chat screen rides the keyboard and nothing else moves (Daniel's phone chat rule). The tap itself puts the cursor
  // in the box (preventScroll, so iOS doesn't slide the page to show it). The box and the conversation glide on the
  // keyboard's own curve, started with the keyboard. While the keyboard stays up, the most it has covered holds, since
  // iOS sometimes reports a height without the form bar above it.
  const vv = window.visualViewport
  const KB = 'leadstart.panpalKb'
  let kbUp = false
  let kbCover = 0
  const kind = () => (innerWidth > innerHeight ? 'wide' : 'tall')
  const lastKb = () => {
    try {
      return JSON.parse(localStorage.getItem(KB) ?? '{}')[kind()] ?? 0
    } catch {
      return 0
    }
  }
  const keepKb = (px) => {
    try {
      const m = JSON.parse(localStorage.getItem(KB) ?? '{}')
      m[kind()] = px
      localStorage.setItem(KB, JSON.stringify(m))
    } catch {
      // not kept: the next open guesses again
    }
  }
  // The keyboard's own curve, measured frame by frame in Safari on the iOS 27 simulator: a critically damped spring,
  // 1 - (1 + wt)e^-wt, about half way in 55ms and settled by 300ms (w = 28 a second rising, 34 going down). The box
  // glides on the same curve, so it rides the keyboard rather than leading or trailing it.
  const KB_MS = 300
  const spring = (w) =>
    Array.from({ length: 25 }, (_, i) => {
      const t = (i / 24) * (KB_MS / 1000)
      return i === 24 ? 1 : 1 - (1 + w * t) * Math.exp(-w * t)
    })
  const RISE = spring(28)
  const FALL = spring(34)
  const slide = (node, a, b, curve, delay) =>
    node.animate(
      curve.map((p, i) => ({ offset: i / 24, transform: `translateY(${a + (b - a) * p}px)` })),
      { duration: KB_MS, delay, fill: 'both' },
    )
  // The screen's foot (--kb, the keyboard's room under the box). It moves with transforms only, which iOS keeps drawing
  // while it holds the page's own drawing: a glide of the padding itself ran smoothly in the page and showed as a jump
  // of two frames (measured in the iOS 27 simulator). Rising, the box and the conversation slide up together, and the
  // layout takes the room in the frame they land. Going down, the layout gives the room back at once and they slide
  // down from where they were, so the screen stays full size and nothing under it shows. The top bar and the box are
  // opaque and above the conversation, so its lines slide under them. The conversation moves only as far as its own
  // scroll changes: at its end it keeps its newest line above the box; short of a screen, it stays put. A new height
  // mid-glide (iOS's report correcting the first-time guess) turns the glide from where the box and the lines show,
  // never from where they were headed. A glide that starts with the layout's change is handed to iOS held at its
  // start and set going a frame later: started in the same frame, it reached the screen a frame after the layout did,
  // and the box showed once at its end before it glided.
  let glides = []
  let footAt = 0
  let heading = 0
  const shownY = (node) => {
    const t = getComputedStyle(node).transform
    return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42
  }
  const foot = (px, delay = 0) => {
    const to = Math.round(px)
    if (Math.abs(to - heading) < 2) return null
    heading = to
    // Where the box and the conversation show now, gliding or not.
    const from = footAt
    const boxY = shownY(form)
    const seen = log.scrollTop - shownY(log)
    for (const a of glides) a.cancel()
    glides = []
    // How far the conversation can scroll with the new foot, laid out there for a moment (nothing draws in between):
    // its scrollHeight never reads less than its own height, so a short conversation can't tell it otherwise.
    bubble.style.setProperty('--kb', `${to}px`)
    const end = Math.max(0, log.scrollHeight - log.clientHeight)
    const s1 = atEnd ? end : Math.min(Math.max(0, seen), end)
    // While it glides the layout keeps the more room of the two: rising, the room it had, taken when the box lands;
    // going down, the new room at once.
    const base = Math.min(from, to)
    bubble.style.setProperty('--kb', `${base}px`)
    footAt = base
    const sb = to > base ? Math.max(0, Math.min(seen, log.scrollHeight - log.clientHeight)) : s1
    log.scrollTop = sb
    const land = () => {
      bubble.style.setProperty('--kb', `${to}px`)
      footAt = to
      log.scrollTop = s1
    }
    if (still.matches) {
      land()
      return null
    }
    const curve = to > from ? RISE : FALL
    const mine = [slide(form, boxY + base - from, base - to, curve, delay), slide(log, sb - seen, sb - s1, curve, delay)]
    glides = mine
    mine[0].onfinish = () => {
      if (glides !== mine) return
      land()
      for (const a of mine) a.cancel()
      glides = []
    }
    if (base !== from) {
      for (const a of mine) a.pause()
      requestAnimationFrame(() => {
        if (glides === mine) for (const a of mine) a.play()
      })
    }
    return mine
  }
  // When to move: with the keyboard, which iOS moves on its own clock (measured frame by frame in Safari on the iOS 27
  // simulator, with the page's frame clock drawn on it). Rising: iOS holds the page's frames back for about 100ms after
  // the tap (once 530ms), starts the keyboard with the first frame it lets through, and reports the new visual viewport
  // about 20ms later. Started at the tap, the box was up half a second before that late keyboard; started at the first
  // frame after the hold, it showed its first third in one jump. So the glide starts with the report and joins the
  // keyboard a few frames in. A Home Screen app reports the keyboard only once it has risen, so 60ms after a hold it
  // starts anyway. No keyboard by 1.5s (a hardware keyboard): nothing moves.
  let pending = null
  let watching = 0
  const begin = () => {
    if (pending === null) return
    const to = pending
    pending = null
    foot(to)
  }
  const awaitKeyboard = (to) => {
    pending = to
    const id = ++watching
    const since = performance.now()
    let last = since
    let held = 0
    const tick = (t) => {
      if (id !== watching || pending === null) return
      if (!held && t - last > 50) held = t
      if (held && t - held > 60) return begin()
      last = t
      if (t - since < 1500) requestAnimationFrame(tick)
      else pending = null
    }
    requestAnimationFrame(tick)
  }
  // Going down: iOS starts the keyboard with the first frame the page draws after the box lets go, then holds the
  // page's frames back, glides included, for about 50ms, and reports the new visual viewport only once the keyboard
  // has gone. A glide begun when the box let go showed late and in one jump. When the visitor puts the keyboard away from
  // the page (a tap on the conversation), the glide goes to iOS first, held at its start, and the box lets go three
  // frames later, the glide's delay set so it's level with the keyboard when iOS shows the page again (57% of the way
  // to the keyboard's 54%, measured). Put away from iOS's side (the bar's Done), the glide starts at once.
  const LET_GO_MS = 70
  let lettingGo = false
  const putAway = () => {
    if (!kbUp || lettingGo) return
    lettingGo = true
    pending = null
    foot(0, LET_GO_MS)
    requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(() => box.blur())))
  }
  function followViewport() {
    if (!full || !vv) return
    bubble.style.setProperty('--vv-top', `${vv.offsetTop}px`)
    if (!kbUp || lettingGo) return
    const cover = innerHeight - vv.height - vv.offsetTop
    if (cover > 120 && cover > kbCover) {
      kbCover = cover
      keepKb(cover)
      if (pending === null) foot(cover)
      else {
        pending = cover
        begin()
      }
    }
  }
  vv?.addEventListener('resize', followViewport)
  vv?.addEventListener('scroll', followViewport)
  box.addEventListener('focus', () => {
    if (!full) return
    kbUp = true
    kbCover = 0
    // The height iOS will report: the last one on this kind of screen, or the first time about the letters keyboard's
    // share of an iPhone screen (396 of 874).
    awaitKeyboard(lastKb() || innerHeight * (kind() === 'tall' ? 0.45 : 0.55))
  })
  box.addEventListener('blur', () => {
    if (!full) return
    kbUp = false
    pending = null
    if (lettingGo) lettingGo = false
    else foot(0)
  })
  box.addEventListener('touchend', (e) => {
    if (!full || document.activeElement === box) return
    e.preventDefault()
    box.focus({ preventScroll: true })
    const end = box.value.length
    box.setSelectionRange(end, end)
  })
  // A tap on the conversation puts the keyboard away, as chat apps do.
  log.addEventListener('touchstart', putAway, { passive: true })

  // A press on his buttons (or on him) never takes the cursor out of the box; held there, Shift for a capital would
  // light the button up and the letters would go nowhere. On a phone they're left alone, so the keyboard behaves as ever.
  bubble.addEventListener('mousedown', (e) => {
    if (fine.matches && e.target.closest('button')) e.preventDefault()
  })
  say.addEventListener('mousedown', (e) => {
    if (fine.matches) e.preventDefault()
  })
  // Shift or Caps Lock alone never draws a focus ring after a press: the page is marked on a press, and the mark
  // clears on any other key (so Tab still shows where you are).
  addEventListener('pointerdown', () => (root.dataset.focus = 'press'), true)
  addEventListener(
    'keydown',
    (e) => {
      if (!['Shift', 'CapsLock', 'Meta', 'Alt', 'Control'].includes(e.key)) delete root.dataset.focus
    },
    true,
  )

  // ---------- drawing him ----------
  const REST = { lookX: 0, lookY: 0, lean: 0, sway: 0, ty: 0, wide: 1, blink: 1, armL: REST_ARM.l, armR: REST_ARM.r }
  const pose = { ...REST }
  const target = { ...REST }
  let mouse = { x: -1e4, y: -1e4 }
  let movedAt = -Infinity
  let activeUntil = performance.now() + 600
  let blinkAt = performance.now() + 2500
  let waveUntil = 0
  let hover = false
  // Whether the pointer is close enough for his eyes to follow it.
  let near = false
  let drag = null
  let raf = 0
  let timer
  // His size, measured only when it can change (a resize), so a frame never has to lay the page out to find him.
  let size = { w: me.offsetWidth, h: me.offsetHeight }
  const f = (v) => v.toFixed(2)
  const draw = () => {
    body.setAttribute('transform', `rotate(${f(pose.lean)} 50 24) rotate(${f(pose.sway)} 50 118) translate(0 ${f(pose.ty)})`)
    const lift = clamp(-pose.ty / 5, 0, 1)
    shadow.setAttribute('transform', `translate(50 121.4) scale(${f(1 - 0.2 * lift)}) translate(-50 -121.4)`)
    shadow.setAttribute('opacity', f(1 - 0.45 * lift))
    for (const g of eyes) {
      const x = g.dataset.x
      g.setAttribute('transform', `translate(${x} 53.03) scale(${f(pose.wide)} ${f(pose.wide * pose.blink)}) translate(${-x} -53.03)`)
    }
    for (const p of pupils) p.setAttribute('transform', `translate(${f(pose.lookX * 3)} ${f(pose.lookY * 2.4)})`)
    brows.setAttribute('transform', `translate(0 ${f(-(pose.wide - 1) * 12)})`)
    arms.l.setAttribute('transform', `rotate(${f(pose.armL)} ${SHOULDER.l.join(' ')})`)
    arms.r.setAttribute('transform', `rotate(${f(pose.armR)} ${SHOULDER.r.join(' ')})`)
  }
  const frame = (now) => {
    raf = 0
    const reduce = still.matches
    Object.assign(target, REST)
    if (!reduce && near && now - movedAt < REST_MS) {
      target.lookX = clamp((mouse.x - (pos.x + size.w / 2)) / 180, -1, 1)
      target.lookY = clamp((mouse.y - (pos.y + size.h * 0.4)) / 180, -1, 1)
    }
    if (hover) target.wide = 1.1
    const d = drag
    if (d?.moved && !reduce) {
      // Carried: he swings against the pull, eyes wide, paws up, a little off the ground.
      target.lean = clamp(-d.vx * 22, -26, 26)
      target.wide = 1.18
      target.ty = -5
      target.armL = 68
      target.armR = -68
      d.vx *= 0.85
    }
    const waving = !reduce && now < waveUntil
    if (waving) {
      // His paw out to the side, waving, his body swaying with it from his feet; brows up and eyes bright.
      target.armR = -108 + 24 * Math.sin(now / 95)
      target.sway = 3.5 * Math.sin(now / 190)
      target.wide = Math.max(target.wide, 1.06)
    }
    if (!reduce && now > blinkAt) {
      // A blink's last frame opens his eyes again.
      if (now > blinkAt + 130) blinkAt = now + 2200 + Math.random() * 3200
      else target.blink = 0.08
    }
    let settling = false
    for (const k of Object.keys(pose)) {
      const rate = k === 'blink' ? 0.6 : waving && (k === 'armR' || k === 'sway') ? 0.35 : 0.2
      const next = reduce ? target[k] : pose[k] + (target[k] - pose[k]) * rate
      if (Math.abs(next - target[k]) > 0.01) settling = true
      pose[k] = next
    }
    draw()
    if (reduce) return
    // Keep going only while something is happening; otherwise sleep until the next blink, or until the pointer has
    // rested long enough for his eyes to come back to the middle.
    if (now < activeUntil || waving || d?.moved || settling || (now > blinkAt && now < blinkAt + 140)) go()
    else {
      clearTimeout(timer)
      const rest = movedAt + REST_MS
      timer = setTimeout(go, Math.max(50, (rest > now ? Math.min(blinkAt, rest) : blinkAt) - performance.now()))
    }
  }
  // Not while nobody can see him.
  const go = () => {
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame)
  }
  function kick() {
    activeUntil = performance.now() + 500
    go()
  }
  function wave(ms = 1400) {
    waveUntil = performance.now() + ms
    kick()
  }
  // His eyes follow the pointer only within NEAR px of him, so moving it around the rest of the page costs nothing;
  // the move that takes it out of range is the last one he hears, and his eyes drift back to the middle.
  const onMove = (e) => {
    const close = Math.hypot(e.clientX - (pos.x + size.w / 2), e.clientY - (pos.y + size.h / 2)) < NEAR + size.w / 2
    if (!close && !near) return
    near = close
    mouse = { x: e.clientX, y: e.clientY }
    movedAt = performance.now()
    activeUntil = movedAt + 700
    go()
  }
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('pointerdown', onMove, { passive: true })
  document.addEventListener('visibilitychange', go)
  me.addEventListener('pointerenter', () => {
    hover = true
    kick()
  })
  me.addEventListener('pointerleave', () => {
    hover = false
    kick()
  })

  // ---------- carrying him, and a tap ----------
  let carried = false
  me.addEventListener('pointerdown', (e) => {
    carried = false
    if (e.button !== 0) return
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: pos.x, y: pos.y, moved: false, lx: e.clientX, lt: performance.now(), vx: 0 }
    try {
      me.setPointerCapture(e.pointerId)
    } catch {
      // A pointer the page doesn't track: the drag still works over him.
    }
  })
  // A press on him never takes the cursor (Tab still reaches him).
  me.addEventListener('mousedown', (e) => e.preventDefault())
  me.addEventListener('pointermove', (e) => {
    const d = drag
    if (!d || e.pointerId !== d.id) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (!d.moved && Math.hypot(dx, dy) < DRAG_PX) return
    if (!d.moved) {
      d.moved = true
      me.classList.add('dragging')
      hideSay()
    }
    const now = performance.now()
    d.vx = (e.clientX - d.lx) / Math.max(8, now - d.lt)
    d.lx = e.clientX
    d.lt = now
    stand({ x: clamp(d.x + dx, PAD, vw() - me.offsetWidth - PAD), y: clamp(d.y + dy, PAD, vh() - me.offsetHeight - PAD) })
    if (open) place()
    kick()
  })
  const letGo = (e) => {
    const d = drag
    if (!d || e.pointerId !== d.id) return
    drag = null
    me.classList.remove('dragging')
    if (!d.moved) return
    carried = true
    spot = spotOf(pos)
    try {
      localStorage.setItem(SPOT, JSON.stringify(spot))
    } catch {
      // private mode: he still stays put until the page reloads
    }
    kick()
  }
  me.addEventListener('pointerup', letGo)
  me.addEventListener('pointercancel', letGo)
  // A tap opens the chat on the click that follows it, as any button does. Opened at the finger's release, the phone's
  // chat screen was already under the finger when iOS sent that click, so whatever sat there took it: the text box
  // (the keyboard came up) or a suggested question (sent unasked). A screen reader's press is a click too. A carry that
  // ends over him isn't a tap.
  me.addEventListener('click', (e) => {
    const wasCarried = carried
    carried = false
    if (wasCarried && e.detail) return
    setOpen(!open, e.detail ? 'press' : 'key')
  })
  me.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(!open, 'key')
    }
  })

  // He keeps his corner as the window resizes, and his bubble follows.
  const onResize = () => {
    size = { w: me.offsetWidth, h: me.offsetHeight }
    stand(xyOf(spot))
    if (open) lay()
    placeSay()
  }
  addEventListener('resize', onResize)
  window.visualViewport?.addEventListener('resize', onResize)

  go()

  helloIn(HELLO_FIRST_MS)
})()
