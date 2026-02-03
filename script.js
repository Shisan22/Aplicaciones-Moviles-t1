// CONFIGURACIÓN DE SONIDOS CON WEB AUDIO API

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

/**
 * @param {number} frequency
 * @param {number} duration
 * @param {string} type
 */
function playTone(frequency, duration, type = 'sine') {
    if (isMuted) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Objeto con diferentes sonidos
const sounds = {
    bird: () => playTone(800, 0.2, 'sine'),
    
    whoosh: () => playTone(200, 0.5, 'sawtooth'),
    
    wind: () => playTone(150, 1, 'sine'),
    
    chime: () => {
        playTone(523.25, 0.3, 'triangle'); // C5
        setTimeout(() => playTone(659.25, 0.3, 'triangle'), 100);
        setTimeout(() => playTone(783.99, 0.5, 'triangle'), 200);
    }
};

// ANIMACIONES CON GSAP

// Timeline principal (pausada por defecto)
const mainTimeline = gsap.timeline({ paused: true });

// Animación del sol (rotación y pulso)
mainTimeline.to('.sun', {
    rotation: 360,
    scale: 1.1,
    duration: 3,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}, 0);

// Animación de nubes (movimiento horizontal continuo)
mainTimeline.to('.cloud1', {
    x: '100vw',
    duration: 20,
    ease: 'none',
    repeat: -1,
    onStart: () => sounds.wind()
}, 0);

mainTimeline.to('.cloud2', {
    x: '-100vw',
    duration: 25,
    ease: 'none',
    repeat: -1
}, 0);

// Animación de pájaros (aparición gradual)
mainTimeline.to('.bird', {
    opacity: 1,
    duration: 0.5,
    stagger: 0.3,
    onStart: () => sounds.bird()
}, 1);

// Vuelo del pájaro 1
mainTimeline.to('.bird1', {
    x: '100vw',
    y: -100,
    duration: 8,
    ease: 'power1.inOut',
    repeat: -1,
    onRepeat: () => sounds.bird()
}, 1.5);

// Vuelo del pájaro 2
mainTimeline.to('.bird2', {
    x: '100vw',
    y: -150,
    duration: 10,
    ease: 'power1.inOut',
    repeat: -1
}, 1.8);

// Vuelo del pájaro 3
mainTimeline.to('.bird3', {
    x: '100vw',
    y: -80,
    duration: 9,
    ease: 'power1.inOut',
    repeat: -1
}, 2.1);

// Animación del árbol (balanceo con el viento)
mainTimeline.to('.tree', {
    rotation: 3,
    transformOrigin: 'bottom center',
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}, 0);

// Animación de las montañas (efecto parallax sutil)
mainTimeline.to('.mountain1', {
    x: -20,
    duration: 15,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}, 0);

mainTimeline.to('.mountain2', {
    x: 30,
    duration: 18,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}, 0);

mainTimeline.to('.mountain3', {
    x: -15,
    duration: 20,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
}, 0);

// Animación de entrada del panel de texto
gsap.from('.text-panel', {
    y: 200,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    delay: 0.5
});

// CONTADOR DE CARACTERES EN TIEMPO REAL

const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');

//Event listener para actualizar el contador en tiempo real
 
textInput.addEventListener('input', function() {
    const count = this.value.length;
    charCount.textContent = count;
    
    // Animación del contador cuando cambia
    gsap.fromTo(charCount, 
        { scale: 1.5, color: '#FFD700' },
        { scale: 1, color: '#FFFFFF', duration: 0.3, ease: 'back.out(2)' }
    );
    
    // Sonido al escribir (cada 5 caracteres para no saturar)
    if (count % 5 === 0 && count > 0) {
        playTone(440 + count, 0.1, 'sine');
    }
});

// Efecto de escala al hacer focus en el textarea
textInput.addEventListener('focus', function() {
    gsap.to(this, { 
        scale: 1.02, 
        duration: 0.3, 
        ease: 'power2.out' 
    });
    playTone(523.25, 0.2, 'sine');
});

// Volver a escala normal al perder el focus
textInput.addEventListener('blur', function() {
    gsap.to(this, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.in' 
    });
});

// CONTROLES DE BOTONES

const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
let isPlaying = false;

//Control de play/pausa de la animación
 
playBtn.addEventListener('click', function() {
    if (!isPlaying) {
        mainTimeline.play();
        sounds.chime();
        this.textContent = '⏸ Pausar Animación';
        isPlaying = true;
    } else {
        mainTimeline.pause();
        this.textContent = '▶ Iniciar Animación';
        isPlaying = false;
    }
});

//Control de silenciar/activar sonido

muteBtn.addEventListener('click', function() {
    isMuted = !isMuted;
    this.textContent = isMuted ? '🔇 Activar Sonido' : '🔊 Silenciar';
    this.style.background = isMuted ? '#f44336' : '#ff9800';
});

// MENSAJES DE CONSOLA

console.log('%c🎨 Paisaje Animado con GSAP y Howler.js', 'font-size: 20px; color: #4CAF50; font-weight: bold;');
console.log('%c✨ Presiona el botón para iniciar la animación', 'font-size: 14px; color: #666;');
console.log('%c📝 Escribe en el campo de texto para ver el contador en acción', 'font-size: 14px; color: #666;');
