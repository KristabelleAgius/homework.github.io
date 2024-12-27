var app = document.getElementById('app')
var Typewriter = new Typewriter(app, {
    loop: true,
    delay: 75,
});


Typewriter
    .pauseFor(2000)
    .typString('easily create cool and beautiful')
    .pauseFor(300)
    .deleteChars(10)
    .typeString('<strong>Awesome</strong> multiline typewriter effect for')
    .typeString('<strong>your website in <span style="color:#27ae60">5 minutes. </span></strong>')
    .pauseFor(1000)
    .start()