// Canvas setup
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Initialize variables
let mouseMoved = false;
let animationFrameId;

const pointer = {
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
};

const params = {
    pointsNumber: 50,
    widthFactor: 50000,
    mouseThreshold: 0.5,
    spring: 0.25,
    friction: 0.5,
};

// Create trail points
const trail = new Array(params.pointsNumber).fill(null).map(() => ({
    x: pointer.x,
    y: pointer.y,
    dx: 0,
    dy: 0,
}));

// Event listeners
function addEventListeners() {
    window.addEventListener("click", handleMouseOrTouch);
    window.addEventListener("mousemove", (e) => {
        mouseMoved = true;
        handleMouseOrTouch(e);
    });

    window.addEventListener("touchmove", (e) => {
        mouseMoved = true;
        const touch = e.targetTouches[0];
        handleMouseOrTouch(touch);
    });

    window.addEventListener("resize", () => {
        setupCanvas();
        trail.forEach(point => {
            point.x = pointer.x;
            point.y = pointer.y;
            point.dx = 0;
            point.dy = 0;
        });
    });
}

function handleMouseOrTouch(e) {
    const x = e.pageX || e.clientX;
    const y = e.pageY || e.clientY;
    updateMousePosition(x, y);
}

function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function update(t) {
    if (!mouseMoved) {
        pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
        pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;

        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "rgba(160, 93, 134, 1)");
    gradient.addColorStop(1, "rgba(57, 34, 115, 1)");

    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i) / params.pointsNumber ** 2;
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    animationFrameId = window.requestAnimationFrame(update);
}

// Initialize
function init() {
    setupCanvas();
    addEventListeners();
    update(0);
}

// Initialize typewriter
document.addEventListener('DOMContentLoaded', function () {
    var app = document.getElementById('app');
    var typewriter = new Typewriter(app, {
        loop: false,
        delay: 75,
        cursor: ''
    });

    typewriter
        .typeString('We are 29 students who want to showcase what we have learnt in the culmination of our three-year journey of BFA in Digital Arts at the University of Malta, which led us to create projects that include diverse topics such as human rights, history and culture, mental health, AI, and even questions the idea of art itself. Join us for our exhibition to experience various mediums of digital art, like editorial and graphic design, animation, photography, UI/UX design, mixed media, illustrations, fashion design, VR and video editing. SPECTRA is a chance for everyone to enjoy the unique perspectives and innovative approaches each student brings to their work, where the endless possibilities of digital art take shape.')
        .start();

    // Start the animation
    init();
});