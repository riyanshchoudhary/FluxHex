// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// --- GSAP ScrollTrigger & Canvas Animation ---
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("frame-canvas");
const context = canvas.getContext("2d");

// Configuration
const frameCount = 96;
const currentFrame = index => (
    `/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const imageSeq = {
    frame: 0
};

// Setup canvas size
function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Scale down the canvas element via CSS to match the window size while keeping the high internal resolution
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    
    context.scale(dpr, dpr);
    render();
}

window.addEventListener('resize', resize);
resize();

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Initial draw once first image loads
images[0].onload = render;

// Render function: draw image filling the canvas (object-fit: cover equivalent)
function render() {
    if(!images[imageSeq.frame]) return;
    
    const img = images[imageSeq.frame];
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate aspect ratio against logical window size (since context is scaled)
    const hRatio = window.innerWidth / img.width;
    const vRatio = window.innerHeight / img.height;
    const ratio  = Math.max(hRatio, vRatio);
    
    const centerShift_x = (window.innerWidth - img.width*ratio) / 2;
    const centerShift_y = (window.innerHeight - img.height*ratio) / 2;
    
    // Enable high-quality image smoothing
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // Clear canvas taking into account the logical dimensions
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
}

// Animation Timeline
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
    }
});

tl.to(imageSeq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    onUpdate: render
});

// --- Bento Labels Animations ---
// Using separate ScrollTriggers to precisely control their appearance at specific scroll %
const labels = [
    { id: '#bento-1', start: '10%', end: '25%' },
    { id: '#bento-2', start: '30%', end: '45%' },
    { id: '#bento-3', start: '50%', end: '65%' }
];

labels.forEach(label => {
    gsap.to(label.id, {
        scrollTrigger: {
            trigger: ".content",
            start: `${label.start} top`,
            end: `${label.end} top`,
            scrub: true,
        },
        // We use keyframes to fade in, hold, and fade out
        keyframes: [
            { opacity: 1, y: 0, duration: 0.2 },
            { opacity: 1, y: 0, duration: 0.6 },
            { opacity: 0, y: -20, duration: 0.2 }
        ],
        ease: "power1.inOut"
    });
});

// --- Text Reveal Animations ---
const titles = gsap.utils.toArray('.hero-title, .section-title');
titles.forEach((title) => {
    gsap.to(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
});

const listItems = gsap.utils.toArray('.feature-list li');
listItems.forEach((item, index) => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 90%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay: index * 0.1
    });
});

gsap.to('.text-block p', {
    scrollTrigger: {
        trigger: '.text-block',
        start: "top 80%",
    },
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
});
