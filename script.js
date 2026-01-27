let clave = '';
const display = document.getElementById('display');
const mensaje = document.getElementById('mensaje');

document.querySelectorAll('[data-num]').forEach(btn => {
    btn.onclick = () => {
        if (clave.length < 6) {
            clave += btn.dataset.num;
            display.textContent = '•'.repeat(clave.length);
        }
    };
});

document.getElementById('borrar').onclick = () => {
    clave = clave.slice(0, -1);
    display.textContent = '•'.repeat(clave.length);
};

document.getElementById('volver').onclick = () => {
    clave = '';
    display.textContent = '';
    mensaje.textContent = '';
    mensaje.className = '';
};

document.getElementById('iniciar').onclick = () => {
    if (clave === '1234') {
        mensaje.textContent = '✓ Clave correcta';
        mensaje.className = 'exito';
    } else {
        mensaje.textContent = '✗ Clave incorrecta';
        mensaje.className = 'error';
    }
};

document.querySelectorAll('nav a').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    };
});