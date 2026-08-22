// Filtros de entrada para teléfonos
document.getElementById('telefono1').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 15);
});
document.getElementById('telefono2').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').substring(0, 15);
});

// Control dinámico del campo "Otro" según selección de parentesco
const radiosParentesco = document.getElementsByName('parentesco');
const inputOtro = document.getElementById('otro_parentesco');

radiosParentesco.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Otro') {
            inputOtro.disabled = false;
            inputOtro.classList.remove('readonly');
            inputOtro.focus();
        } else {
            inputOtro.disabled = true;
            inputOtro.classList.add('readonly');
            inputOtro.value = '';
        }
    });
});

// Funciones de utilidad segura para inyectar datos en Adobe Pro
function llenarCampoTexto(form, nombre, valor) {
    if (!valor) return;
    try {
        const campo = form.getTextField(nombre);
        if (campo) {
            campo.setText(valor.toString().trim().toUpperCase());
            console.log(`✅ Texto '${nombre}' llenado con éxito: "${valor.toString().trim().toUpperCase()}"`);
        }
    } catch (e) {
        console.warn(`⚠️ No se encontró el campo de texto: ${nombre}`);
    }
}

function llenarDropdown(form, nombre, valor) {
    if (!valor) return;
    try {
        const dropdown = form.getDropdown(nombre);
        if (dropdown) {
            dropdown.select(valor.toString().trim().toUpperCase());
            console.log(`✅ Dropdown '${nombre}' seleccionado con éxito: "${valor.toString().trim().toUpperCase()}"`);
        }
    } catch (e) {
        console.warn(`⚠️ No se encontró el dropdown: ${nombre}`);
    }
}

function marcarCheckbox(form, nombre, marcar) {
    try {
        const chk = form.getCheckBox(nombre);
        if (chk) {
            if (marcar) {
                chk.check();
                console.log(`✅ Checkbox '${nombre}' marcado.`);
            } else {
                chk.uncheck();
            }
        }
    } catch (e) {
        console.warn(`⚠️ No se encontró el checkbox: ${nombre}`);
    }
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
            // Descarga directa del formato en blanco BaseBolsaTrabajo.pdf
            const link = document.createElement('a');
            link.href = 'BaseBolsaTrabajo.pdf'; 
            link.download = 'BolsaTrabajo - Formato en Blanco.pdf'; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Llenado dinámico utilizando BaseBolsaTrabajo.pdf como plantilla
            const urlPlantilla = 'BaseBolsaTrabajo.pdf';
            const pdfBytesArray = await fetch(urlPlantilla).then(res => res.arrayBuffer());

            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytesArray);
            pdfDoc.registerFontkit(window.fontkit);
            const form = pdfDoc.getForm();

            // 1. Datos del trabajador
            llenarCampoTexto(form, 'APELLIDOP1', document.getElementById('ap_paterno').value);
            llenarCampoTexto(form, 'APELLIDOM1', document.getElementById('ap_materno').value);
            llenarCampoTexto(form, 'NOMBRES1', document.getElementById('nombres').value);
            
            // Centro como Dropdown
            llenarDropdown(form, 'CENTRO', document.getElementById('centro').value);
            
            llenarCampoTexto(form, 'TELEFONO1', document.getElementById('telefono1').value);
            llenarCampoTexto(form, 'CORREO1', document.getElementById('correo1').value);
            llenarCampoTexto(form, 'FECHA', document.getElementById('fecha').value);

            // 2. Parentesco (Grupo de Radio Buttons RB1 -> Opción1 a Opción7)
            let parentescoSeleccionado = '';
            for (const r of radiosParentesco) {
                if (r.checked) parentescoSeleccionado = r.value;
            }

            const mapaOpcionesRB1 = {
                'Cónyuge': 'Opción1',
                'Concubino(a)': 'Opción2',
                'Hijo(a)': 'Opción3',
                'Hermano(a)': 'Opción4',
                'Nieto(a)': 'Opción5',
                'Sobrino(a)': 'Opción6',
                'Otro': 'Opción7'
            };

            if (parentescoSeleccionado && mapaOpcionesRB1[parentescoSeleccionado]) {
                try {
                    const radioGroup = form.getRadioGroup('RB1');
                    if (radioGroup) {
                        radioGroup.select(mapaOpcionesRB1[parentescoSeleccionado]);
                        console.log(`✅ RadioGroup 'RB1' seleccionado: ${mapaOpcionesRB1[parentescoSeleccionado]}`);
                    }
                } catch (e) {
                    console.warn(`⚠️ No se pudo seleccionar el grupo de radio 'RB1'`, e);
                }
            }

            if (parentescoSeleccionado === 'Otro') {
                llenarCampoTexto(form, 'OTRO', document.getElementById('otro_parentesco').value);
            } else {
                llenarCampoTexto(form, 'OTRO', '');
            }

            // 3. Datos del familiar recomendado
            llenarCampoTexto(form, 'APELLIDOP2', document.getElementById('fam_ap_paterno').value);
            llenarCampoTexto(form, 'APELLIDOM2', document.getElementById('fam_ap_materno').value);
            llenarCampoTexto(form, 'NOMBRES2', document.getElementById('fam_nombres').value);
            llenarCampoTexto(form, 'FECHANAC', document.getElementById('fam_fecha_nac').value);
            llenarCampoTexto(form, 'TELEFONO2', document.getElementById('telefono2').value);
            llenarCampoTexto(form, 'CORREO2', document.getElementById('correo2').value);

            // Tabla de Estudios: Terminado (CB1 a CB9), Documentos y Perfiles (1 al 9)
            for (let i = 1; i <= 9; i++) {
                const cbChecked = document.getElementById(`cb_${i}`).checked;
                marcarCheckbox(form, `CB${i}`, cbChecked);

                const docVal = document.getElementById(`doc_${i}`).value;
                llenarCampoTexto(form, `DOCUMENTO${i}`, docVal);

                const perfilVal = document.getElementById(`perfil_${i}`).value;
                llenarCampoTexto(form, `PERFIL${i}`, perfilVal);
            }

            // 4. Ciudades o localidades (CC1 a CC7)
            for (let j = 1; j <= 7; j++) {
                const ccChecked = document.getElementById(`cc_${j}`).checked;
                marcarCheckbox(form, `CC${j}`, ccChecked);
            }

            // Firma / Nombre del trabajador al calce
            const nombreCompleto = `${document.getElementById('nombres').value} ${document.getElementById('ap_paterno').value} ${document.getElementById('ap_materno').value}`.trim();
            llenarCampoTexto(form, 'FIRMA', nombreCompleto);

            // Aplastar formulario para fijar valores
            form.flatten();

            const pdfModificadoBytes = await pdfDoc.save();
            const blob = new Blob([pdfModificadoBytes], { type: 'application/pdf' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            const nombreArchivo = nombreCompleto !== "" 
                ? `Bolsa de Trabajo - ${nombreCompleto.toUpperCase()}.pdf` 
                : 'Bolsa de Trabajo - Solicitud Llena.pdf';
            
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    } catch (error) {
        console.error('Error al procesar el PDF de Bolsa de Trabajo:', error);
        alert("Ocurrió un error. Verifica que el archivo 'BaseBolsaTrabajo.pdf' se encuentre en el servidor.");
    } finally {
        if(esBlanco) btnBlanco.innerHTML = textoOriginal;
        else btnLleno.innerHTML = textoOriginal;
    }
}