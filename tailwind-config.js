// Tailwind config cargada como archivo externo para evitar inline scripts.
// Esto permite aplicar una CSP más estricta sin depender de 'unsafe-inline' en script-src.
window.tailwind = window.tailwind || {};
window.tailwind.config = { darkMode: 'class' };

