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

let tipoPrestamoGlobal = 'CORTO PLAZO';

function updatePrestamo() {
    let monto = parseFloat(montoInput.value) || 0;
    
    if (monto > 10000) {
        quincenasInput.min = 12;
        quincenasInput.max = 24;
        tipoPrestamoGlobal = 'LARGO PLAZO';
        if (parseInt(quincenasInput.value) < 12) quincenasInput.value = 12;
    } else {
        quincenasInput.min = 1;
        quincenasInput.max = 12;
        tipoPrestamoGlobal = 'CORTO PLAZO';
        if (parseInt(quincenasInput.value) > 12) quincenasInput.value = 12;
    }

    let quincenas = parseInt(quincenasInput.value) || 12;
    quincenasLabel.textContent = quincenas;
    tipoPrestamoDisplay.textContent = tipoPrestamoGlobal;

    if (tipoPrestamoGlobal === 'CORTO PLAZO') {
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

    // Calcular y asignar la cantidad con letra en el formulario web
    const textoLetras = NumeroALetras(monto);
    cantidadLetra.value = textoLetras;
    console.log("💰 Monto ingresado:", monto, "-> Letras generadas:", textoLetras);
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

// Función universal inteligente y tolerante a variaciones
function llenarCampoSeguro(form, nombres, valor) {
    if (!valor && valor !== 0) return;
    const listaNombres = Array.isArray(nombres) ? nombres : [nombres];
    const valStr = valor.toString().trim().toUpperCase();

    const allFields = form.getFields();

    for (const nombreBuscado of listaNombres) {
        const busquedaUpper = nombreBuscado.toUpperCase().trim();
        
        for (const field of allFields) {
            const realName = field.getName().toUpperCase().trim();
            
            if (realName === busquedaUpper || realName.includes(busquedaUpper)) {
                try {
                    const dropdown = form.getDropdown(field.getName());
                    if (dropdown) {
                        dropdown.select(valStr);
                        console.log(`✅ Dropdown '${field.getName()}' seleccionado: "${valStr}"`);
                        return;
                    }
                } catch (e1) {
                    try {
                        const campoTexto = form.getTextField(field.getName());
                        if (campoTexto) {
                            campoTexto.setText(valStr);
                            console.log(`✅ Texto '${field.getName()}' llenado: "${valStr}"`);
                            return;
                        }
                    } catch (e2) {
                        try {
                            const radio = form.getRadioGroup(field.getName());
                            if (radio) {
                                radio.select(valStr);
                                console.log(`✅ Radio '${field.getName()}' seleccionado: "${valStr}"`);
                                return;
                            }
                        } catch (e3) {}
                    }
                }
            }
        }
    }
    console.warn(`⚠️ No se pudo encontrar o llenar el campo. Buscados:`, listaNombres);
}

function updatePrestamo() {
    let monto = parseFloat(montoInput.value) || 0;
    
    if (monto > 10000) {
        quincenasInput.min = 12;
        quincenasInput.max = 24;
        tipoPrestamoGlobal = 'LARGO PLAZO';
        if (parseInt(quincenasInput.value) < 12) quincenasInput.value = 12;
    } else {
        quincenasInput.min = 1;
        quincenasInput.max = 12;
        tipoPrestamoGlobal = 'CORTO PLAZO';
        if (parseInt(quincenasInput.value) > 12) quincenasInput.value = 12;
    }

    let quincenas = parseInt(quincenasInput.value) || 12;
    quincenasLabel.textContent = quincenas;
    tipoPrestamoDisplay.textContent = tipoPrestamoGlobal;

    if (tipoPrestamoGlobal === 'CORTO PLAZO') {
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

    // --- CÁLCULOS FINANCIEROS (Interés simple del 1% quincenal) ---
    let interesTotal = monto * 0.01 * quincenas;
    let totalPagar = monto + interesTotal;
    let pagoQuincenal = quincenas > 0 ? totalPagar / quincenas : 0;

    // Mostrar en el panel visual
    document.getElementById('pago_quincenal').textContent = '$' + pagoQuincenal.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('interes_total').textContent = '$' + interesTotal.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('total_pagar').textContent = '$' + totalPagar.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    cantidadLetra.value = NumeroALetras(monto);
}

// === GESTOR DE DESCARGAS Y LLENADO DINÁMICO DE PDF ===
async function procesarPDF(esBlanco = false) {
    const btnLleno = document.getElementById('btn-print-filled');
    const btnBlanco = document.getElementById('btn-print-blank');
    const textoOriginal = esBlanco ? btnBlanco.innerHTML : btnLleno.innerHTML;
    
    if(esBlanco) btnBlanco.innerHTML = '⏳ Descargando...';
    else btnLleno.innerHTML = '⏳ Generando...';

    try {
        if (esBlanco) {
            const link = document.createElement('a');
            link.href = 'BasePrestamo.pdf'; 
            link.download = 'Prestamo Sindical XCEE.pdf'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const urlPlantilla = 'BasePrestamo.pdf';
            const pdfBytesArray = await fetch(urlPlantilla).then(res => res.arrayBuffer());

            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytesArray);
            pdfDoc.registerFontkit(window.fontkit);
            const form = pdfDoc.getForm();

            // Mapeo general de campos
            llenarCampoSeguro(form, ['APELLIDO PATERNO'], document.getElementById('ap_paterno').value);
            llenarCampoSeguro(form, ['APELLIDO MATERNO'], document.getElementById('ap_materno').value);
            llenarCampoSeguro(form, ['NOMBRE S', 'NOMBRES', 'NOMBRE (S)'], document.getElementById('nombres').value);
            llenarCampoSeguro(form, ['DOMICILIO CALLE COLONIA Y CP', 'DOMICILIO'], document.getElementById('domicilio').value);
            llenarCampoSeguro(form, ['CIUDAD'], document.getElementById('ciudad').value);
            llenarCampoSeguro(form, ['TELEFONO', 'TELÉFONO'], document.getElementById('telefono').value);
            llenarCampoSeguro(form, ['CORREO ELECTRÓNICO', 'CORREO ELECTRONICO'], document.getElementById('email').value);
            llenarCampoSeguro(form, ['CLABE', 'CUENTA CLABE'], document.getElementById('clabe').value);
            llenarCampoSeguro(form, ['BANCO'], document.getElementById('banco').value);
            llenarCampoSeguro(form, ['PUESTO'], document.getElementById('puesto').value);
            llenarCampoSeguro(form, ['CENTRO', 'CENTRO DE TRABAJO'], document.getElementById('centro').value);
            llenarCampoSeguro(form, ['TURNO'], document.getElementById('turno').value);
            llenarCampoSeguro(form, ['SUELDO NETO QUINCENAL', 'SUELDO'], document.getElementById('sueldo').value);
            llenarCampoSeguro(form, ['DEDUCCIONES QUINCENALES', 'DEDUCCIONES'], document.getElementById('deducciones').value);
            
            // Datos del Préstamo
            llenarCampoSeguro(form, ['MONTO SOLICITADO', 'MONTO'], document.getElementById('monto').value);
            
            // Plazo (Corto / Largo Plazo)
            llenarCampoSeguro(form, ['PLAZO', 'CORTO PLAZO / LARGO PLAZO', 'CORTO PLAZO LARGO PLAZO', 'TIPO PRESTAMO'], tipoPrestamoGlobal);
            
            llenarCampoSeguro(form, ['QUINCENAS'], document.getElementById('quincenas').value);
            llenarCampoSeguro(form, ['FECHA DE SOLICITUD', 'FECHA'], document.getElementById('fecha').value);
            
            // Cantidad con letra (cubre múltiples nombres posibles en el PDF)
            llenarCampoSeguro(form, ['CANTIDAD CON LETRA', 'CANTIDAD_LETRA', 'LETRAS', 'MONTO LETRA'], document.getElementById('cantidad_letra').value);

            const nombreCompleto = `${document.getElementById('nombres').value} ${document.getElementById('ap_paterno').value} ${document.getElementById('ap_materno').value}`.trim();
            llenarCampoSeguro(form, ['NOMBRE Y FIRMA DEL SOLICITANTE', 'FIRMA'], nombreCompleto);

            form.flatten();

            const pdfModificadoBytes = await pdfDoc.save();
            const blob = new Blob([pdfModificadoBytes], { type: 'application/pdf' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            const nombreArchivo = nombreCompleto !== "" 
                ? `Prestamo Sindical XCEE - ${nombreCompleto.toUpperCase()}.pdf` 
                : 'Prestamo Sindical XCEE - Solicitud Llena.pdf';
            
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    } catch (error) {
        console.error('Error al procesar el PDF:', error);
        alert("Ocurrió un error. Verifica que el archivo 'BasePrestamo.pdf' se encuentre en el servidor.");
    } finally {
        if(esBlanco) btnBlanco.innerHTML = textoOriginal;
        else btnLleno.innerHTML = textoOriginal;
    }
}

// Iniciar aplicación web al cargar
updatePrestamo();