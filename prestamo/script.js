// Filtros de entrada basados en reglas comunes (solo números, límite de caracteres)
document.getElementById('clabe').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 18);
});
document.getElementById('telefono').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 15);
});

// Variables del Préstamo
const montoInput = document.getElementById('monto');
const quincenasInput = document.getElementById('quincenas');
const quincenasLabel = document.getElementById('quincenas_val');
const quincenasPrint = document.getElementById('quincenas_print');
const tipoPrestamoDisplay = document.getElementById('tipo_prestamo_display');
const tipoPrestamoPrint = document.getElementById('tipo_prestamo_print');
const cantidadLetra = document.getElementById('cantidad_letra');
const warning = document.getElementById('monto_warning');

// Variables para la Firma Automática
const apPaternoInput = document.getElementById('ap_paterno');
const apMaternoInput = document.getElementById('ap_materno');
const nombresInput = document.getElementById('nombres');
const nombreFirmaPrint = document.getElementById('nombre_firma_print');

// Función para actualizar la firma automáticamente en mayúsculas
function updateNombreFirma() {
    if (!nombreFirmaPrint) return;
    
    const paterno = apPaternoInput.value.trim();
    const materno = apMaternoInput.value.trim();
    const nombre = nombresInput.value.trim();
    
    // Junta los valores y limpia espacios extras
    const nombreCompleto = `${nombre} ${paterno} ${materno}`.replace(/\s+/g, ' ').trim();
    nombreFirmaPrint.textContent = nombreCompleto;
}

// Escuchadores de eventos para los campos de texto del nombre
if (apPaternoInput) apPaternoInput.addEventListener('input', updateNombreFirma);
if (apMaternoInput) apMaternoInput.addEventListener('input', updateNombreFirma);
if (nombresInput) nombresInput.addEventListener('input', updateNombreFirma);

function updatePrestamo() {
    let monto = parseFloat(montoInput.value) || 0;
    
    // 1. Ajustar los límites del slider y clasificar el tipo de préstamo
    let tipo;
    if (monto > 10000) {
        // Préstamo Mayor a 10,000 (2 a 24 quincenas)
        quincenasInput.min = 2;
        quincenasInput.max = 24;
        tipo = 'Largo Plazo';
        
        // Evitar que se quede un valor menor por debajo del nuevo mínimo
        if (parseInt(quincenasInput.value) < 12) {
        tipo = 'Corto Plazo';
        }
    } else {
        // Préstamo hasta 10,000 (1 a 12 quincenas)
        quincenasInput.min = 1;
        quincenasInput.max = 12;
        tipo = 'Corto Plazo';
        
        // Evitar que se quede un valor mayor por encima del nuevo máximo
        if (parseInt(quincenasInput.value) > 12) {
            quincenasInput.value = 12;
        }
    }

    // 2. Aplicar el valor actual del slider
    let quincenas = parseInt(quincenasInput.value) || 12;
    quincenasLabel.textContent = quincenas;
    quincenasPrint.value = quincenas;

    // 3. Estilizar y reflejar el Tipo de Préstamo
    tipoPrestamoDisplay.textContent = tipo;
    tipoPrestamoPrint.value = tipo;

    if (tipo === 'Corto Plazo') {
        tipoPrestamoDisplay.className = 'status-badge status-corto';
    } else {
        tipoPrestamoDisplay.className = 'status-badge status-largo';
    }

    // 4. Mostrar advertencia únicamente si sobrepasa el límite reglamentario (20 mil)
    if (monto > 20000) {
        warning.textContent = '⚠️ El monto excede el máximo permitido ($20,000.00 M.N.).';
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }

    // 5. Transformar cantidad a letras
    cantidadLetra.value = NumeroALetras(monto);
}

    montoInput.addEventListener('input', function() {
        let valor = parseFloat(this.value);
        if (valor > 20000) {
            this.value = 20000; // Bloquea y fuerza el límite máximo a 20000
        }
        updatePrestamo();
    });
quincenasInput.addEventListener('input', updatePrestamo);

function NumeroALetras(num) {
    if (num === 0 || isNaN(num)) return "";
    var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasMonedaPlural: 'PESOS',
        letrasMonedaSingular: 'PESO'
    };
    var centavosStr = data.centavos.toString().padStart(2, '0') + "/100 M.N.";

    function Unidades(num) {
        switch (num) {
            case 1: return 'UN'; case 2: return 'DOS'; case 3: return 'TRES';
            case 4: return 'CUATRO'; case 5: return 'CINCO'; case 6: return 'SEIS';
            case 7: return 'SIETE'; case 8: return 'OCHO'; case 9: return 'NUEVE';
        }
        return '';
    }
    function Decenas(num) {
        var decena = Math.floor(num / 10);
        var unidad = num - (decena * 10);
        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ'; case 1: return 'ONCE'; case 2: return 'DOCE';
                    case 3: return 'TRECE'; case 4: return 'CATORCE'; case 5: return 'QUINCE';
                    default: return 'DIECI ' + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad); case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad); case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad); case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad); case 0: return Unidades(unidad);
        }
    }
    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);
        return strSin;
    }
    function Centenas(num) {
        var centenas = Math.floor(num / 100);
        var decenas = num - (centenas * 100);
        switch (centenas) {
            case 1:
                if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas); case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas); case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas); case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas); case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }
        return Decenas(decenas);
    }
    function Seccion(num, divisor, strSingular, strPlural) {
        var cientos = Math.floor(num / divisor);
        var resto = num - (cientos * divisor);
        var letras = '';
        if (cientos > 0) {
            if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
            else letras = strSingular;
        }
        if (resto > 0) letras += '';
        return letras;
    }
    function Miles(num) {
        var divisor = 1000;
        var cientos = Math.floor(num / divisor);
        var resto = num - (cientos * divisor);
        var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        var strCentenas = Centenas(resto);
        if (strMiles == '') return strCentenas;
        return strMiles + ' ' + strCentenas;
    }
    function Millones(num) {
        var divisor = 1000000;
        var cientos = Math.floor(num / divisor);
        var resto = num - (cientos * divisor);
        var strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
        var strMiles = Miles(resto);
        if (strMillones == '') return strMiles;
        return strMillones + ' ' + strMiles;
    }

    var letras = "";
    if (data.enteros == 0) {
        letras = 'CERO ' + data.letrasMonedaPlural;
    } else if (data.enteros == 1) {
        letras = Millones(data.enteros) + ' ' + data.letrasMonedaSingular;
    } else {
        letras = Millones(data.enteros) + ' ' + data.letrasMonedaPlural;
    }
    return letras + ' ' + centavosStr;
}

document.getElementById('btn-print-filled').addEventListener('click', function() {
    window.print();
});

document.getElementById('btn-print-blank').addEventListener('click', function() {
    const inputs = document.querySelectorAll('input:not([type="range"]):not([readonly]), select');
    const states = [];
    inputs.forEach(input => {
        states.push({ element: input, value: input.value });
        input.value = '';
    });
    
    const cantidad = document.getElementById('cantidad_letra');
    const val_cantidad = cantidad.value;
    cantidad.value = '';
    
    const warning_display = warning.style.display;
    warning.style.display = 'none';

    const val_q = quincenasInput.value;
    quincenasInput.value = 1;
    quincenasPrint.value = '';
    tipoPrestamoPrint.value = '';
    
    // Ocultar temporalmente el nombre en la firma al imprimir en blanco
    const val_firma = nombreFirmaPrint ? nombreFirmaPrint.textContent : '';
    if (nombreFirmaPrint) nombreFirmaPrint.textContent = '';
    
    window.print();
    
    states.forEach(state => { state.element.value = state.value; });
    cantidad.value = val_cantidad;
    quincenasInput.value = val_q;
    if (nombreFirmaPrint) nombreFirmaPrint.textContent = val_firma;
    warning.style.display = warning_display;
    updatePrestamo();
});

// Inicializar interfaz en la primera carga
updatePrestamo();
updateNombreFirma();