/**
 * @fileoverview Lógica principal de TaskFlow.
 * Gestiona la interfaz de usuario, el almacenamiento local, Drag & Drop y filtros.
 * @version 2.0.0
 */

if (window.tailwind) {
    tailwind.config = { darkMode: 'class' };
}

// --- SELECTORES PRINCIPALES ---
const inputNuevaTarea = document.getElementById('nuevo-habito');
const selectCategoria = document.getElementById('categoria-habito');
const inputBusqueda = document.getElementById('buscar-habito');
const btnAgregar = document.getElementById('btn-agregar');
const contenedorTareas = document.getElementById('contenedor-tareas');
const btnToggleTema = document.getElementById('toggle-tema');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnCompletarTodas = document.getElementById('btn-completar-todas');

const statsTotal = document.getElementById('stats-total');
const statsCompletadas = document.getElementById('stats-completadas');
const statsPendientes = document.getElementById('stats-pendientes');

const CLAVE_STORAGE = 'mis-tareas';
const CLAVE_TEMA = 'tema-preferido';
let filtroActivo = 'todas';
let idTareaArrastrada = null;

// --- COLORES PARA CATEGORÍAS ---
const categoriasColores = {
    'Personal': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    'Trabajo': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Salud': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    'Hogar': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
};

/**
 * Inicializa el tema visual (claro/oscuro) leyendo la preferencia en LocalStorage.
 * Por defecto, establece el modo oscuro.
 */
function inicializarTema() {
    const temaGuardado = localStorage.getItem(CLAVE_TEMA) || 'dark';
    if (temaGuardado === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
}
inicializarTema();

btnToggleTema.addEventListener('click', () => {
    const esOscuro = document.documentElement.classList.toggle('dark');
    localStorage.setItem(CLAVE_TEMA, esOscuro ? 'dark' : 'light');
});

// --- GESTIÓN DE DATOS ---
let listaTareas = (() => {
    try {
        const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
        return datosGuardados ? JSON.parse(datosGuardados) : [];
    } catch (error) { 
        console.error("Error al leer LocalStorage:", error);
        return []; 
    }
})();

/**
 * Guarda el estado actual en LocalStorage y actualiza la interfaz y estadísticas.
 */
function actualizarAplicacion() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas));
    actualizarEstadisticas();
    renderizarTareas();
}

/**
 * Recalcula y actualiza los contadores de tareas en el panel lateral.
 */
function actualizarEstadisticas() {
    const total = listaTareas.length;
    const completadas = listaTareas.filter(tarea => tarea.completada).length;
    if (statsTotal) statsTotal.textContent = total;
    if (statsCompletadas) statsCompletadas.textContent = completadas;
    if (statsPendientes) statsPendientes.textContent = total - completadas;
}

/**
 * Dispara una animación de confeti en la pantalla utilizando la librería canvas-confetti.
 */
function lanzarConfeti() {
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

/**
 * Aplica un filtro de visibilidad a las tareas y actualiza el estilo de los botones.
 * @param {string} nuevoFiltro - El identificador del filtro ('todas', 'pendientes', 'completadas').
 */
function establecerFiltro(nuevoFiltro) {
    filtroActivo = nuevoFiltro;
    const identificadores = ['btn-filtro-todas', 'btn-filtro-pendientes', 'btn-filtro-completadas'];

    identificadores.forEach(id => {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.classList.remove('bg-[#203B53]', 'text-white', 'bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-300', 'dark:hover:bg-slate-600');
        
        const claveBoton = id.replace('btn-filtro-', '');
        if (claveBoton === nuevoFiltro) {
            boton.classList.add('bg-[#203B53]', 'text-white');
        } else {
            boton.classList.add('bg-slate-200', 'dark:bg-slate-700', 'text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-300', 'dark:hover:bg-slate-600');
        }
    });
    renderizarTareas();
}

/**
 * Valida y añade una nueva tarea al inicio de la lista.
 */
function agregarTarea() {
    const textoValidado = inputNuevaTarea?.value?.trim();
    const categoria = selectCategoria?.value || 'Personal';

    // Validación adicional: Evitar tareas vacías o excesivamente largas
    if (!textoValidado) return;
    if (textoValidado.length > 120) {
        alert("El nombre del hábito es demasiado largo. Máximo 120 caracteres.");
        return;
    }

    listaTareas.unshift({ id: crypto.randomUUID(), texto: textoValidado, categoria, completada: false });
    inputNuevaTarea.value = '';
    actualizarAplicacion();
}

/**
 * Alterna el estado de completado de una tarea específica por su ID.
 * @param {string} id - El identificador único de la tarea.
 */
function alternarEstadoTarea(id) {
    let seAcabaDeCompletar = false;
    listaTareas = listaTareas.map(tarea => {
        if (tarea.id === id) {
            if (!tarea.completada) seAcabaDeCompletar = true;
            return { ...tarea, completada: !tarea.completada };
        }
        return tarea;
    });
    if (seAcabaDeCompletar) lanzarConfeti();
    actualizarAplicacion();
}

/**
 * Elimina una tarea de la lista permanentemente.
 * @param {string} id - El identificador único de la tarea a eliminar.
 */
function borrarTarea(id) {
    listaTareas = listaTareas.filter(tarea => tarea.id !== id);
    actualizarAplicacion();
}

/**
 * Elimina todas las tareas que han sido marcadas como completadas.
 */
function limpiarCompletadas() {
    listaTareas = listaTareas.filter(tarea => !tarea.completada);
    actualizarAplicacion();
}

/**
 * Marca todas las tareas pendientes como completadas y dispara la animación de celebración.
 */
function completarTodas() {
    const existenPendientes = listaTareas.some(tarea => !tarea.completada);
    listaTareas = listaTareas.map(tarea => ({ ...tarea, completada: true }));
    if (existenPendientes) lanzarConfeti();
    actualizarAplicacion();
}

/**
 * Reordena el array de tareas tras una operación de Drag & Drop.
 * @param {string} idOrigen - ID de la tarea arrastrada.
 * @param {string} idDestino - ID de la tarea sobre la que se soltó.
 */
function reordenarTareasArray(idOrigen, idDestino) {
    if (filtroActivo !== 'todas' || inputBusqueda.value.trim() !== "") return;

    const indiceOrigen = listaTareas.findIndex(t => t.id === idOrigen);
    const indiceDestino = listaTareas.findIndex(t => t.id === idDestino);

    if (indiceOrigen === -1 || indiceDestino === -1 || indiceOrigen === indiceDestino) return;

    const [tareaMovida] = listaTareas.splice(indiceOrigen, 1);
    listaTareas.splice(indiceDestino, 0, tareaMovida);

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(listaTareas));
}

/**
 * Renderiza el DOM utilizando un DocumentFragment para optimizar el rendimiento.
 */
function renderizarTareas() {
    if (!contenedorTareas) return;
    contenedorTareas.innerHTML = "";

    if (listaTareas.length === 0) {
        contenedorTareas.innerHTML = `
            <div class="text-center py-20 animate-pulse">
                <span class="text-5xl block mb-4" aria-hidden="true">🚀</span>
                <p class="text-slate-400 font-medium">No hay tareas aún...</p>
                <p class="text-lg text-slate-500 font-bold">¡Añade algo y veamos tu potencial!</p>
            </div>`;
        return;
    }

    const fragmentoDOM = document.createDocumentFragment();

    const todasCompletadas = listaTareas.length > 0 && listaTareas.every(t => t.completada);
    if (todasCompletadas && filtroActivo !== 'pendientes') {
        const bannerVictoria = document.createElement('div');
        bannerVictoria.className = 'text-center p-4 mb-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-green-500/20 rounded-2xl border border-blue-400/40 dark:border-blue-500/50 shadow-lg shadow-blue-500/10 animate-in fade-in zoom-in duration-500';
        bannerVictoria.innerHTML = `
            <p class="text-3xl mb-1 drop-shadow-sm" aria-hidden="true">🏆</p>
            <p class="text-blue-700 dark:text-blue-300 font-bold text-lg italic tracking-tight">¡Día perfecto completado!</p>
            <p class="text-[11px] uppercase tracking-widest text-blue-600/70 dark:text-blue-400/60 font-bold mt-1">Metas alcanzadas</p>
        `;
        fragmentoDOM.appendChild(bannerVictoria);
    }

    let tareasFiltradas = listaTareas.filter(t => t.texto.toLowerCase().includes(inputBusqueda.value.toLowerCase()));
    if (filtroActivo === 'completadas') tareasFiltradas = tareasFiltradas.filter(t => t.completada);
    if (filtroActivo === 'pendientes') tareasFiltradas = tareasFiltradas.filter(t => !t.completada);

    tareasFiltradas.forEach(tarea => {
        const elementoArticulo = document.createElement('article');
        elementoArticulo.draggable = true; 
        elementoArticulo.dataset.id = tarea.id;
        elementoArticulo.className = 'task-card flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 cursor-default mb-4';

        const colorEtiqueta = categoriasColores[tarea.categoria] || categoriasColores['Personal'];
        const htmlEtiqueta = tarea.categoria 
            ? `<span class="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ml-2 ${colorEtiqueta}">${tarea.categoria}</span>` 
            : '';

        elementoArticulo.innerHTML = `
            <div class="flex items-center gap-4 flex-grow">
                <span class="text-slate-300 dark:text-slate-600 cursor-grab opacity-50 hover:opacity-100" aria-hidden="true">☰</span>
                <input type="checkbox" aria-label="Marcar como completada" class="w-5 h-5 cursor-pointer accent-[#4A90E2] focus:ring-2 focus:ring-blue-400" ${tarea.completada ? 'checked' : ''}>
                <div class="flex-grow">
                    <div class="flex items-center">
                        <h3 class="font-medium text-slate-800 dark:text-slate-200 ${tarea.completada ? 'line-through opacity-50' : ''}" title="Doble clic para editar">
                            ${tarea.texto}
                        </h3>
                        ${htmlEtiqueta}
                    </div>
                    <p class="text-xs text-slate-400 mt-1">¡Ánimo, lo vas a lograr! 🔥</p>
                </div>
            </div>
            <button aria-label="Eliminar tarea" class="text-red-400 text-sm font-semibold hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 ml-4 focus:ring-2 focus:ring-red-400 outline-none">Eliminar</button>
        `;

        // DRAG & DROP EVENTOS
        elementoArticulo.addEventListener('dragstart', (e) => {
            if (filtroActivo !== 'todas' || inputBusqueda.value.trim() !== "") { e.preventDefault(); return; }
            idTareaArrastrada = tarea.id;
            elementoArticulo.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', tarea.id); 
        });

        elementoArticulo.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (tarea.id !== idTareaArrastrada) elementoArticulo.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });

        elementoArticulo.addEventListener('dragleave', () => elementoArticulo.classList.remove('drag-over'));

        elementoArticulo.addEventListener('drop', (e) => {
            e.preventDefault();
            elementoArticulo.classList.remove('drag-over');
            if (idTareaArrastrada && idTareaArrastrada !== tarea.id) {
                reordenarTareasArray(idTareaArrastrada, tarea.id);
                const listaNodos = Array.from(contenedorTareas.querySelectorAll('.task-card'));
                const nodoArrastrado = listaNodos.find(n => n.dataset.id === idTareaArrastrada);
                if (listaNodos.indexOf(nodoArrastrado) < listaNodos.indexOf(elementoArticulo)) elementoArticulo.after(nodoArrastrado);
                else elementoArticulo.before(nodoArrastrado);
            }
        });

        elementoArticulo.addEventListener('dragend', () => {
            elementoArticulo.classList.remove('dragging');
            idTareaArrastrada = null;
            contenedorTareas.querySelectorAll('.task-card').forEach(n => n.classList.remove('drag-over'));
        });

        // EVENTOS NORMALES
        elementoArticulo.querySelector('input').onchange = () => alternarEstadoTarea(tarea.id);
        elementoArticulo.querySelector('button').onclick = () => borrarTarea(tarea.id);

        const textoTitulo = elementoArticulo.querySelector('h3');
        textoTitulo.ondblclick = () => {
            if (tarea.completada) return;
            const inputEdicion = document.createElement('input');
            inputEdicion.type = 'text';
            inputEdicion.value = tarea.texto;
            inputEdicion.className = 'w-full bg-slate-100 dark:bg-slate-700 p-1 rounded border-none outline-none focus:ring-2 focus:ring-blue-400 dark:text-white font-medium';
            textoTitulo.replaceWith(inputEdicion);
            inputEdicion.focus();
            const guardarEdicion = () => {
                const textoModificado = inputEdicion.value.trim();
                if (textoModificado && textoModificado !== tarea.texto) {
                    tarea.texto = textoModificado;
                    actualizarAplicacion();
                } else { renderizarTareas(); }
            };
            inputEdicion.onblur = guardarEdicion;
            inputEdicion.onkeydown = (e) => { if (e.key === 'Enter') guardarEdicion(); };
        };

        fragmentoDOM.appendChild(elementoArticulo);
    });
    contenedorTareas.appendChild(fragmentoDOM);
}

// --- EVENTOS DE INTERFAZ ---
btnAgregar.onclick = agregarTarea;
inputNuevaTarea.addEventListener('keypress', (e) => { if (e.key === 'Enter') agregarTarea(); });
inputBusqueda.addEventListener('input', renderizarTareas);

document.getElementById('btn-filtro-todas').onclick = () => establecerFiltro('todas');
document.getElementById('btn-filtro-pendientes').onclick = () => establecerFiltro('pendientes');
document.getElementById('btn-filtro-completadas').onclick = () => establecerFiltro('completadas');
btnLimpiar.onclick = limpiarCompletadas;
btnCompletarTodas.onclick = completarTodas;

actualizarEstadisticas();
establecerFiltro('todas');