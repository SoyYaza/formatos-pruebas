// Filtros de entrada
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
const tipoPrestamoDisplay = document.getElementById('tipo_prestamo_display');
const cantidadLetra = document.getElementById('cantidad_letra');
const warning = document.getElementById('monto_warning');

let tipoPrestamoGlobal = 'Corto Plazo';

function updatePrestamo() {
    let monto = parseFloat(montoInput.value) || 0;
    
    if (monto > 10000) {
        quincenasInput.min = 12;
        quincenasInput.max = 24;
        tipoPrestamoGlobal = 'Largo Plazo';
        if (parseInt(quincenasInput.value) < 12) quincenasInput.value = 12;
    } else {
        quincenasInput.min = 1;
        quincenasInput.max = 12;
        tipoPrestamoGlobal = 'Corto Plazo';
        if (parseInt(quincenasInput.value) > 12) quincenasInput.value = 12;
    }

    let quincenas = parseInt(quincenasInput.value) || 12;
    quincenasLabel.textContent = quincenas;
    tipoPrestamoDisplay.textContent = tipoPrestamoGlobal;

    if (tipoPrestamoGlobal === 'Corto Plazo') {
        tipoPrestamoDisplay.className = 'status-badge status-corto';
    } else {
        tipoPrestamoDisplay.className = 'status-badge status-largo';
    }

    if (monto > 20000) {
        warning.textContent = '⚠️ El monto excede el máximo permitido ($20,000.00 M.N.).';
        warning.style.display = 'block';
    } else {
        warning.style.display = 'none';
    }
    cantidadLetra.value = NumeroALetras(monto);
}

montoInput.addEventListener('input', function() {
    let valor = parseFloat(this.value);
    if (valor > 20000) this.value = 20000;
    updatePrestamo();
});
quincenasInput.addEventListener('input', updatePrestamo);

// Función Números a Letras
function NumeroALetras(num) {
    if (num === 0 || isNaN(num)) return "";
    var data = {
        numero: num, enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasMonedaPlural: 'PESOS', letrasMonedaSingular: 'PESO'
    };
    var centavosStr = data.centavos.toString().padStart(2, '0') + "/100 M.N.";

    function Unidades(num) {
        switch (num) {
            case 1: return 'UN'; case 2: return 'DOS'; case 3: return 'TRES';
            case 4: return 'CUATRO'; case 5: return 'CINCO'; case 6: return 'SEIS';
            case 7: return 'SIETE'; case 8: return 'OCHO'; case 9: return 'NUEVE';
        } return '';
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
                switch (unidad) { case 0: return 'VEINTE'; default: return 'VEINTI' + Unidades(unidad); }
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
            case 1: if (decenas > 0) return 'CIENTO ' + Decenas(decenas); return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas); case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas); case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas); case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas); case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        } return Decenas(decenas);
    }
    function Seccion(num, divisor, strSingular, strPlural) {
        var cientos = Math.floor(num / divisor); var resto = num - (cientos * divisor); var letras = '';
        if (cientos > 0) { if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural; else letras = strSingular; }
        if (resto > 0) letras += ''; return letras;
    }
    function Miles(num) {
        var divisor = 1000; var cientos = Math.floor(num / divisor); var resto = num - (cientos * divisor);
        var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL'); var strCentenas = Centenas(resto);
        if (strMiles == '') return strCentenas; return strMiles + ' ' + strCentenas;
    }
    function Millones(num) {
        var divisor = 1000000; var cientos = Math.floor(num / divisor); var resto = num - (cientos * divisor);
        var strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES'); var strMiles = Miles(resto);
        if (strMillones == '') return strMiles; return strMillones + ' ' + strMiles;
    }
    var letras = "";
    if (data.enteros == 0) { letras = 'CERO ' + data.letrasMonedaPlural; } 
    else if (data.enteros == 1) { letras = Millones(data.enteros) + ' ' + data.letrasMonedaSingular; } 
    else { letras = Millones(data.enteros) + ' ' + data.letrasMonedaPlural; }
    return letras + ' ' + centavosStr;
}


// === MOTOR PDF-LIB: LLENADO DE PLANTILLA MEDIANTE NOMBRES EXACTOS ===
function llenarCampoSeguro(form, nombreCampo, valor) {
    try {
        const campo = form.getTextField(nombreCampo);
        if (campo && valor) {
            campo.setText(valor.toString().toUpperCase()); // Convertimos a mayúsculas por formalidad
        }
    } catch (error) {
        console.warn(`El campo '${nombreCampo}' no fue encontrado en el PDF Base.`);
    }
}

async function procesarPDF(esBlanco = false) {
    const btnLleno = document.getElementById('btn-print-filled');
    const btnBlanco = document.getElementById('btn-print-blank');
    const textoOriginal = esBlanco ? btnBlanco.innerHTML : btnLleno.innerHTML;
    
    // Cambiar estado del botón a "Cargando..."
    if(esBlanco) btnBlanco.innerHTML = '⏳ Descargando...';
    else btnLleno.innerHTML = '⏳ Generando...';

    try {
        if (esBlanco) {
            // === RUTA 1: DESCARGA DIRECTA (MÁS RÁPIDA) ===
            // Solo se ejecuta cuando bajan el formato en blanco
            const link = document.createElement('a');
            link.href = 'BasePrestamo.pdf'; 
            link.download = 'Solicitud_SUTCBEBCS_Blanco.pdf'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } else {
            // === RUTA 2: MOTOR PDF-LIB (INYECCIÓN DE DATOS) ===
            // Se ejecuta cuando quieren descargar la solicitud llenada
            const urlPlantilla = 'BasePrestamo.pdf';
            const pdfBytesArray = await fetch(urlPlantilla).then(res => res.arrayBuffer());
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytesArray);
            
            pdfDoc.registerFontkit(window.fontkit);
            const form = pdfDoc.getForm();

            // Mapeo de campos
            llenarCampoSeguro(form, 'APELLIDO PATERNO', document.getElementById('ap_paterno').value);
            llenarCampoSeguro(form, 'APELLIDO MATERNO', document.getElementById('ap_materno').value);
            llenarCampoSeguro(form, 'NOMBRE S', document.getElementById('nombres').value);
            llenarCampoSeguro(form, 'DOMICILIO CALLE COLONIA Y CP', document.getElementById('domicilio').value);
            llenarCampoSeguro(form, 'CIUDAD', document.getElementById('ciudad').value);
            llenarCampoSeguro(form, 'TELEFONO', document.getElementById('telefono').value);
            llenarCampoSeguro(form, 'CORREO ELECTRONICO', document.getElementById('email').value);
            llenarCampoSeguro(form, 'CLABE', document.getElementById('clabe').value);
            llenarCampoSeguro(form, 'BANCO', document.getElementById('banco').value);
            llenarCampoSeguro(form, 'CENTRO', document.getElementById('centro').value);
            llenarCampoSeguro(form, 'PUESTO', document.getElementById('puesto').value);
            llenarCampoSeguro(form, 'TURNO', document.getElementById('turno').value);
            llenarCampoSeguro(form, 'SUELDO NETO QUINCENAL', document.getElementById('sueldo').value);
            llenarCampoSeguro(form, 'DEDUCCIONES QUINCENALES', document.getElementById('deducciones').value);
            
            // Datos del Préstamo
            llenarCampoSeguro(form, 'MONTO SOLICITADO', document.getElementById('monto').value);
            llenarCampoSeguro(form, 'CORTO PLAZO LARGO PLAZO', tipoPrestamoGlobal);
            llenarCampoSeguro(form, 'QUINCENAS', document.getElementById('quincenas').value);
            llenarCampoSeguro(form, 'FECHA DE SOLICITUD', document.getElementById('fecha').value);
            llenarCampoSeguro(form, 'CANTIDAD CON LETRA', document.getElementById('cantidad_letra').value);

            // Nombre de Firma Combinado
            const nombreCompleto = `${document.getElementById('nombres').value} ${document.getElementById('ap_paterno').value} ${document.getElementById('ap_materno').value}`.trim();
            llenarCampoSeguro(form, 'NOMBRE Y FIRMA DEL SOLICITANTE', nombreCompleto);

            // Aplastamos el PDF para que el texto sea no editable
            form.flatten();

            // Generamos y descargamos el archivo lleno
            const pdfModificadoBytes = await pdfDoc.save();
            const blob = new Blob([pdfModificadoBytes], { type: 'application/pdf' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Solicitud_SUTCBEBCS_Llena.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    } catch (error) {
        console.error('Error al procesar/descargar el PDF:', error);
        alert("Ocurrió un error. Verifica que el archivo 'BasePrestamo.pdf' se encuentre subido en la misma carpeta del servidor.");
    } finally {
        // Restaurar texto del botón original
        if(esBlanco) btnBlanco.innerHTML = textoOriginal;
        else btnLleno.innerHTML = textoOriginal;
    }
}

// Eventos de botones
document.getElementById('btn-print-filled').addEventListener('click', () => procesarPDF(false));
document.getElementById('btn-print-blank').addEventListener('click', () => procesarPDF(true));

// Iniciar aplicación web
updatePrestamo();
