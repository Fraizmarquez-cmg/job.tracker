const empresaInput = document.getElementById('empresaInput');
const puestoInput = document.getElementById('puestoInput');
const fechaInput = document.getElementById('fechaInput');
const estadoInput = document.getElementById('estadoInput');
const btnAgregar = document.getElementById('btnAgregar');
const jobsContainer = document.getElementById('jobsContainer');

const totalCount = document.getElementById('totalCount');
const enviadoCount = document.getElementById('enviadoCount');
const entrevistaCount = document.getElementById('entrevistaCount');
const ofertaCount = document.getElementById('ofertaCount');

const filterButtons = document.querySelectorAll('.filter-btn');

let postulaciones = JSON.parse(localStorage.getItem('mis_postulaciones')) || [];
let filtroActual = 'Todos';

function guardarYRenderizar() {
    localStorage.setItem('mis_postulaciones', JSON.stringify(postulaciones));
    renderPostulaciones();
}

function actualizarContadores() {
    totalCount.textContent = postulaciones.length;
    enviadoCount.textContent = postulaciones.filter(job => job.estado === 'Enviado').length;
    entrevistaCount.textContent = postulaciones.filter(job => job.estado === 'Entrevista').length;
    ofertaCount.textContent = postulaciones.filter(job => job.estado === 'Oferta').length;
}

function renderPostulaciones() {
    jobsContainer.innerHTML = '';


    const postulacionesFiltradas = postulaciones.filter(job => {
        if (filtroActual === 'Todos') return true;
        return job.estado === filtroActual;
    });

    if (postulacionesFiltradas.length === 0) {
        jobsContainer.innerHTML = `<p class="empty-msg">No hay postulaciones registradas en esta categoría.</p>`;
        actualizarContadores();
        return;
    }

    postulacionesFiltradas.forEach((job) => {
        const indexReal = postulaciones.indexOf(job);

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h3>${job.empresa}</h3>
            <p><strong>Puesto:</strong> ${job.puesto}</p>
            <p><strong>Fecha:</strong> ${job.fecha}</p>
            <p><strong>Estado:</strong> ${job.estado}</p>
            <button class="btnEliminar" data-index="${indexReal}">Eliminar</button>
        `;
        jobsContainer.appendChild(card);
    });

    actualizarContadores();
}

// Evento para agregar nueva postulación
btnAgregar.addEventListener('click', () => {
    const empresa = empresaInput.value.trim();
    const puesto = puestoInput.value.trim();
    const fecha = fechaInput.value;
    const estado = estadoInput.value.trim();

    if (empresa && puesto && fecha && estado) {
        const nuevaPostulacion = { empresa, puesto, fecha, estado };
        postulaciones.push(nuevaPostulacion);
        
        guardarYRenderizar();

        empresaInput.value = '';
        puestoInput.value = '';
        fechaInput.value = '';
        estadoInput.value = '';
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

jobsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('btnEliminar')) {
        const index = event.target.getAttribute('data-index');
        postulaciones.splice(index, 1);
        guardarYRenderizar();
    }
});


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filtroActual = button.getAttribute('data-filter');
        renderPostulaciones();
    });
});


renderPostulaciones();