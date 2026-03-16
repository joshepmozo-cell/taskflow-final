const tareaInput = document.getElementById('nuevo-habito');
const btnAgregar = document.getElementById('btn-agregar');
const contenedor = document.getElementById('contenedor-tareas');
let tareas = JSON.parse(localStorage.getItem('mis-tareas')) || [];

function agregarTarea() {
    const texto = tareaInput.value.trim();
    if (texto === "") return;
    tareas.push({ id: Date.now(), texto: texto, completada: false });
    tareaInput.value = ""; 
    actualizarApp();
}

window.borrar = (id) => { tareas = tareas.filter(t => t.id !== id); actualizarApp(); }
window.toggle = (id) => { tareas = tareas.map(t => t.id === id ? {...t, completada: !t.completada} : t); actualizarApp(); }
function actualizarApp() { localStorage.setItem('mis-tareas', JSON.stringify(tareas)); renderizar(); }

function renderizar() {
    contenedor.innerHTML = "";
    tareas.forEach(tarea => {
        const article = document.createElement('article');

        article.className = 'task-card flex justify-between items-center bg-white dark:bg-slate-800 p-5 mb-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:-translate-y-1';
        article.innerHTML = `
            <div class="flex items-center gap-4">
                <input type="checkbox" class="w-5 h-5 cursor-pointer accent-[#203B53]" ${tarea.completada ? 'checked' : ''} onchange="toggle(${tarea.id})">
                <div>
                    <h3 class="font-medium text-slate-800 dark:text-slate-200 ${tarea.completada ? 'line-through opacity-50' : ''}">${tarea.texto}</h3>
                    <p class="text-xs text-slate-400">¡Ánimo! Tu puedes lograrlo 🔥</p>
                </div>
            </div>
            <button onclick="borrar(${tarea.id})" class="text-red-500 font-semibold text-sm">Eliminar</button>
        `;
        contenedor.appendChild(article);
    });
}

tareaInput.addEventListener('input', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.task-card');

    cards.forEach(card => {
        const titulo = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = titulo.includes(busqueda) ? 'flex' : 'none';
    });
});

document.getElementById('toggle-tema').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

btnAgregar.addEventListener('click', agregarTarea);

tareaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') agregarTarea(); });

renderizar();