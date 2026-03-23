/**
 * @fileoverview Lógica principal de TaskFlow.
 * Gestiona la interfaz de usuario, conectividad con Backend, Drag & Drop y filtros.
 * @version 3.0.0 (UI Avanzada + Backend Integrado)
 */

import { apiClient } from './api/client.js';

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
const uiStateContainer = document.getElementById('ui-state-container'); // Para mostrar "Cargando..."

const CLAVE_TEMA = 'tema-preferido';
let filtroActivo = 'todas';
let idTareaArrastrada = null;
let listaTareas = []; // Ahora se alimenta del Backend

// --- COLORES PARA CATEGORÍAS ---
const categoriasColores = {
    'Personal': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    'Trabajo': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Salud': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    'Hogar': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
};

// --- GESTIÓN DE TEMA ---
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

// --- COMUNICACIÓN CON EL BACKEND ---
async function loadTasks() {
    if (uiStateContainer) uiStateContainer.innerHTML = '<span class="text-blue-500 animate-pulse text-sm">⏳ Sincronizando...</span>';
    try {
        listaTareas = await apiClient.getTasks();
        actualizarEstadisticas();
        renderizarTareas();
        if (uiStateContainer) uiStateContainer.innerHTML = '';
    } catch (error) {
        if (uiStateContainer) uiStateContainer.innerHTML = '<span class="text-red-500 text-sm">❌ Error de conexión</span>';
    }
}

// --- LÓGICA DE LA APLICACIÓN ---
function actualizarEstadisticas() {
    const total = listaTareas.length;
    const completadas = listaTareas.filter(tarea => tarea.completed).length; // Adaptado a backend
    if (statsTotal) statsTotal.textContent = total;
    if (statsCompletadas) statsCompletadas.textContent = completadas;
    if (statsPendientes) statsPendientes.textContent = total - completadas;
}

function lanzarConfeti() {
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

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

async function agregarTarea() {
    const textoValidado = inputNuevaTarea?.value?.trim();
    const categoria = selectCategoria?.value || 'Personal';

    if (!textoValidado) return;
    if (textoValidado.length > 120) {
        alert("El nombre del hábito es demasiado largo. Máximo 120 caracteres.");
        return;
    }

    // Petición al backend en lugar de LocalStorage
    await apiClient.createTask(textoValidado, categoria);
    inputNuevaTarea.value = '';
    await loadTasks();
}

async function alternarEstadoTarea(id, estabaCompletada) {
    await apiClient.toggleTask(id);
    if (!estabaCompletada) lanzarConfeti();
    await loadTasks();
}

async function borrarTarea(id) {
    await apiClient.deleteTask(id);
    await loadTasks();
}

async function limpiarCompletadas() {
    const completadas = listaTareas.filter(t => t.completed);
    for (const tarea of completadas) {
        await apiClient.deleteTask(tarea.id); // Borramos una por una del servidor
    }
    await loadTasks();
}

async function completarTodas() {
    const pendientes = listaTareas.filter(t => !t.completed);
    if (pendientes.length > 0) lanzarConfeti();
    for (const tarea of pendientes) {
        await apiClient.toggleTask(tarea.id); // Completamos una por una en el servidor
    }
    await loadTasks();
}

// Drag & Drop (Solo visual por ahora, no persiste en BD)
function reordenarTareasArray(idOrigen, idDestino) {
    if (filtroActivo !== 'todas' || inputBusqueda.value.trim() !== "") return;
    const indiceOrigen = listaTareas.findIndex(t => t.id === idOrigen);
    const indiceDestino = listaTareas.findIndex(t => t.id === idDestino);
    if (indiceOrigen === -1 || indiceDestino === -1 || indiceOrigen === indiceDestino) return;

    const [tareaMovida] = listaTareas.splice(indiceOrigen, 1);
    listaTareas.splice(indiceDestino, 0, tareaMovida);
    // Nota: Aquí ya no usamos localStorage. 
}

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

    const todasCompletadas = listaTareas.length > 0 && listaTareas.every(t => t.completed);
    if (todasCompletadas && filtroActivo !== 'pendientes') {
        const bannerVictoria = document.createElement('div');
        bannerVictoria.className = 'text-center p-4 mb-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-green-500/20 rounded-2xl border border-blue-400/40 dark:border-blue-500/50 shadow-lg shadow-blue-500/10 animate-slideIn';
        bannerVictoria.innerHTML = `
            <p class="text-3xl mb-1 drop-shadow-sm" aria-hidden="true">🏆</p>
            <p class="text-blue-700 dark:text-blue-300 font-bold text-lg italic tracking-tight">¡Día perfecto completado!</p>
            <p class="text-[11px] uppercase tracking-widest text-blue-600/70 dark:text-blue-400/60 font-bold mt-1">Metas alcanzadas</p>
        `;
        fragmentoDOM.appendChild(bannerVictoria);
    }

    let tareasFiltradas = listaTareas.filter(t => t.title.toLowerCase().includes(inputBusqueda.value.toLowerCase()));
    if (filtroActivo === 'completadas') tareasFiltradas = tareasFiltradas.filter(t => t.completed);
    if (filtroActivo === 'pendientes') tareasFiltradas = tareasFiltradas.filter(t => !t.completed);

    tareasFiltradas.forEach(tarea => {
        const elementoArticulo = document.createElement('article');
        elementoArticulo.draggable = true;
        elementoArticulo.dataset.id = tarea.id;
        elementoArticulo.className = `task-card flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-xl border ${tarea.completed ? 'border-green-500/50 opacity-70' : 'border-slate-200 dark:border-slate-700'} shadow-sm transition-all duration-300 cursor-default mb-4`;

        const colorEtiqueta = categoriasColores[tarea.category] || categoriasColores['Personal'];
        const htmlEtiqueta = tarea.category
            ? `<span class="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ml-2 ${colorEtiqueta}">${tarea.category}</span>`
            : '';

        elementoArticulo.innerHTML = `
            <div class="flex items-center gap-4 flex-grow">
                <span class="text-slate-300 dark:text-slate-600 cursor-grab hover:text-blue-500 transition-colors" aria-hidden="true">☰</span>
                <input type="checkbox" aria-label="Marcar como completada" class="w-5 h-5 cursor-pointer accent-[#4A90E2] focus:ring-2 focus:ring-blue-400" ${tarea.completed ? 'checked' : ''}>
                <div class="flex-grow">
                    <div class="flex items-center">
                        <h3 class="font-medium text-slate-800 dark:text-slate-200 ${tarea.completed ? 'line-through opacity-50' : ''}" title="Doble clic para editar">
                            ${tarea.title}
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
            elementoArticulo.classList.add('opacity-50', 'border-dashed', 'border-blue-500');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', tarea.id);
        });

        elementoArticulo.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (tarea.id !== idTareaArrastrada) elementoArticulo.classList.add('border-t-4', 'border-blue-500');
            e.dataTransfer.dropEffect = 'move';
        });

        elementoArticulo.addEventListener('dragleave', () => elementoArticulo.classList.remove('border-t-4', 'border-blue-500'));

        elementoArticulo.addEventListener('drop', (e) => {
            e.preventDefault();
            elementoArticulo.classList.remove('border-t-4', 'border-blue-500');
            if (idTareaArrastrada && idTareaArrastrada !== tarea.id) {
                reordenarTareasArray(idTareaArrastrada, tarea.id);
                renderizarTareas(); // Volvemos a pintar localmente
            }
        });

        elementoArticulo.addEventListener('dragend', () => {
            elementoArticulo.classList.remove('opacity-50', 'border-dashed', 'border-blue-500');
            idTareaArrastrada = null;
        });

        // EVENTOS NORMALES
        elementoArticulo.querySelector('input').onchange = () => alternarEstadoTarea(tarea.id, tarea.completed);
        elementoArticulo.querySelector('button').onclick = () => borrarTarea(tarea.id);

        // EVENTO DE EDICIÓN CON DOBLE CLIC
        const textoTitulo = elementoArticulo.querySelector('h3');
        textoTitulo.ondblclick = () => {
            if (tarea.completed) return;
            const inputEdicion = document.createElement('input');
            inputEdicion.type = 'text';
            inputEdicion.value = tarea.title;
            inputEdicion.className = 'w-full bg-slate-100 dark:bg-slate-700 p-1 rounded border-none outline-none focus:ring-2 focus:ring-blue-400 dark:text-white font-medium';
            textoTitulo.replaceWith(inputEdicion);
            inputEdicion.focus();

            const guardarEdicion = async () => {
                const textoModificado = inputEdicion.value.trim();
                if (textoModificado && textoModificado !== tarea.title) {
                    await apiClient.editTask(tarea.id, textoModificado); // Llamada al backend
                    await loadTasks();
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
if (btnAgregar) btnAgregar.onclick = (e) => { e.preventDefault(); agregarTarea(); };
if (inputBusqueda) inputBusqueda.addEventListener('input', renderizarTareas);

document.getElementById('btn-filtro-todas').onclick = () => establecerFiltro('todas');
document.getElementById('btn-filtro-pendientes').onclick = () => establecerFiltro('pendientes');
document.getElementById('btn-filtro-completadas').onclick = () => establecerFiltro('completadas');
if (btnLimpiar) btnLimpiar.onclick = limpiarCompletadas;
if (btnCompletarTodas) btnCompletarTodas.onclick = completarTodas;

// Arranque inicial
establecerFiltro('todas');
loadTasks();