// Filtros para asegurar que los teléfonos sean de 10 dígitos
const telTrabajador = document.getElementById('tel_trabajador');
const telFam = document.getElementById('tel_fam');

if (telTrabajador) {
    telTrabajador.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });
}
if (telFam) {
    telFam.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
    });
}

// Variables para la Firma Automática del Trabajador
const apPaternoInput = document.getElementById('ap_paterno_trabajador');
const apMaternoInput = document.getElementById('ap_materno_trabajador');
const nombresInput = document.getElementById('nombres_trabajador');
const nombreFirmaPrint = document.getElementById('nombre_firma_print');

// Función para actualizar la firma automáticamente en mayúsculas
function updateNombreFirma() {
    if (!nombreFirmaPrint) return;
    
    const paterno = apPaternoInput ? apPaternoInput.value.trim() : '';
    const materno = apMaternoInput ? apMaternoInput.value.trim() : '';
    const nombre = nombresInput ? nombresInput.value.trim() : '';
    
    // Junta los valores y limpia espacios extras (Orden: Nombre Paterno Materno)
    const nombreCompleto = `${nombre} ${paterno} ${materno}`.replace(/\s+/g, ' ').trim();
    nombreFirmaPrint.textContent = nombreCompleto;
}

if (apPaternoInput) apPaternoInput.addEventListener('input', updateNombreFirma);
if (apMaternoInput) apMaternoInput.addEventListener('input', updateNombreFirma);
if (nombresInput) nombresInput.addEventListener('input', updateNombreFirma);

// Botón para imprimir el formato con datos
document.getElementById('btn-print-filled').addEventListener('click', function() {
    window.print();
});

// Botón para imprimir el formato completamente en blanco
document.getElementById('btn-print-blank').addEventListener('click', function() {
    const inputs = document.querySelectorAll('input:not([type="button"]), select');
    const states = [];
    
    // Guardar el estado actual y vaciar
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            states.push({ element: input, checked: input.checked });
            input.checked = false;
        } else {
            states.push({ element: input, value: input.value });
            input.value = '';
        }
    });
    
    // Ocultar temporalmente el nombre en la firma al imprimir en blanco
    const val_firma = nombreFirmaPrint ? nombreFirmaPrint.textContent : '';
    if (nombreFirmaPrint) nombreFirmaPrint.textContent = '';
    
    window.print();
    
    // Restaurar los datos previos del usuario
    states.forEach(state => {
        if (state.element.type === 'checkbox' || state.element.type === 'radio') {
            state.element.checked = state.checked;
        } else {
            state.element.value = state.value;
        }
    });
    
    if (nombreFirmaPrint) nombreFirmaPrint.textContent = val_firma;
});

// Inicialización
updateNombreFirma();