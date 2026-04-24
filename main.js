document.addEventListener("DOMContentLoaded", () => {

    // Lenis
    const lenis = new Lenis({
        duration: 1.2,
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById("frame-canvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");

    const frameCount = 96;

    // ✅ CORRECT PATH
    const currentFrame = index =>
        `/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const images = [];
    const imageSeq = { frame: 0 };

    function resize() {
        const dpr = window.devicePixelRatio || 1;

        context.setTransform(1, 0, 0, 1, 0, 0);

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        context.scale(dpr, dpr);

        render();
    }

    window.addEventListener("resize", resize);
    resize();

    // preload images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    images[0].onload = render;

    function render() {
        if (!images[imageSeq.frame]) return;

        const img = images[imageSeq.frame];

        const hRatio = window.innerWidth / img.width;
        const vRatio = window.innerHeight / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const centerShift_x = (window.innerWidth - img.width * ratio) / 2;
        const centerShift_y = (window.innerHeight - img.height * ratio) / 2;

        context.clearRect(0, 0, window.innerWidth, window.innerHeight);

        context.drawImage(
            img,
            0, 0, img.width, img.height,
            centerShift_x, centerShift_y,
            img.width * ratio, img.height * ratio
        );
    }

    // scroll animation
    gsap.timeline({
        scrollTrigger: {
            trigger: ".content",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
        }
    }).to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render
    });

});