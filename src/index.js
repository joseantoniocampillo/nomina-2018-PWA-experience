if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

$(document).ready(function () {
    // Handler for .ready() called.
    const v = require('./valores.js');
    const moment = require('./moment.min.js');

    const kFijoHasta10mil = 0.0185,
        kFijoMasDe10mil = 0.0329,
        kDietaHasta10mil = 0.0268,
        kDietaMasDe10mil = 0.0484;
    const kfijoPart = kms => kms <= 10000 ? kFijoHasta10mil :
        (kFijoHasta10mil * 10000 + (kms - 10000) * kFijoMasDe10mil) / kms;
    const kdietaPart = kms => kms <= 10000 ? kDietaHasta10mil :
        (kDietaHasta10mil * 10000 + (kms - 10000) * kDietaMasDe10mil) / kms;
    const kms_sal = $('#kms-salida');
    const hora_salida = $('#hora-salida');
    const fecha_salida = $('#fecha-salida');
    const hora_salida_es = $('#hora-salida-es');
    const fecha_salida_es = $('#fecha-salida-es');
    const hora_llegada_es = $('#hora-llegada-es');
    const fecha_llegada_es = $('#fecha-llegada-es');
    const hora_llegada = $('#hora-llegada');
    const fecha_llegada = $('#fecha-llegada');
    const kms_llegada = $('#kms-llegada');

    const kms_mensualidad = $('#mensualidad');
    const precioparticular = $('#precioparticular');
    const KMS_MENS_VALUE_LOCAL = 'kms_mensualidad_value';
    const PRECIO_KM_VALUE_LOCAL = 'precio_km_value';

    var kms_mensualidad_value, preciokm_value;
    var inicializa_campos = function () {
        kms_mensualidad_value = localStorage.getItem(KMS_MENS_VALUE_LOCAL);
        console.log('kms mensualidad value', kms_mensualidad_value);
        if (kms_mensualidad_value === null) {
            kms_mensualidad_value = '12000';
            localStorage.setItem(KMS_MENS_VALUE_LOCAL, '12000');
        }
        document.getElementById(kms_mensualidad_value).selected = true;

        // precio km value:       
        preciokm_value = localStorage.getItem(PRECIO_KM_VALUE_LOCAL);
        console.log('precio km value', preciokm_value);
        if (preciokm_value === null) {
            preciokm_value = '0.117';
            localStorage.setItem(PRECIO_KM_VALUE_LOCAL, '0.117');
        }
        document.getElementById(preciokm_value).selected = true;
    };

    if (typeof (Storage) !== "undefined") {
        inicializa_campos();
    }

    kms_mensualidad.change(function (e) {
        var str = "";
        $("#mensualidad option:selected").each(function () {
            str = $(this).attr('id');
            kms_mensualidad_value = str;
            localStorage.setItem(KMS_MENS_VALUE_LOCAL, kms_mensualidad_value);
            calcula();
        });
    });
    precioparticular.change(function (e) {
        var str = "";
        $("#precioparticular option:selected").each(function () {
            str = $(this).attr('id');
            preciokm_value = str;
            localStorage.setItem(PRECIO_KM_VALUE_LOCAL, preciokm_value);
            calcula();
        });
    });

    kms_sal.oninput = function () {
        calcula();
    };
    kms_llegada.oninput = function () {
        calcula();
    };

    const resultados = $('#resultados');
    //const resultados_variable = $('#resultados-variable');
    const aKms = $('#aKms');
    const info = $('#info');

    var fecha_salida_var, fecha_llegada_var, fecha_salida_es_var, fecha_llegada_es_var;
    var hora_salida_var, hora_llegada_var;
    var hora_salida_es_var, hora_llegada_es_var;
    var primera_dieta, ultima_dieta, resultado, ultima_dieta_extr;
    var dietas_completas, dietas_completas_extr;
    var variable_ext_primera, variable_ext_ultima, variable_ext_completas;


    $('#nueva-operacion').click(e => {
        /* e.preventDefault();
        oculta();
        fecha_salida_var = undefined;
        fecha_llegada_var = undefined;
        fecha_salida_es_var = undefined;
        fecha_llegada_es_var = undefined;
        hora_salida_var = undefined;
        hora_llegada_var = undefined;
        $(':input', '#formulario')
            .removeAttr('checked')
            .removeAttr('selected')
            .not(':button, :submit, :reset, :hidden, :radio, :checkbox')
            .val(''); */
    });

    var total_extr = 0;
    var dif_viaje;

    v.reloj(hora_salida, va => {
        hora_salida_var = va;
        //TODO: localStorage.setItem('hora_salida', hora_salida["0"].value);
        calcula();
    });

    v.reloj(hora_salida_es, va => {
        hora_salida_es_var = va;
        if (typeof hora_salida_es_var === 'number' &&
            typeof hora_llegada_es_var === 'number' &&
            typeof fecha_salida_es_var === 'object' &&
            typeof fecha_llegada_es_var === 'object')
            calcula();
        else oculta();
    });
    v.reloj(hora_llegada_es, va => {
        hora_llegada_es_var = va;
        if (typeof hora_salida_es_var === 'number' &&
            typeof hora_llegada_es_var === 'number' &&
            typeof fecha_salida_es_var === 'object' &&
            typeof fecha_llegada_es_var === 'object')
            calcula();
        else oculta();
    });
    v.reloj(hora_llegada, va => {
        hora_llegada_var = va;
        calcula();
    });


    v.fecha(fecha_salida, va => {
        fecha_salida_var = moment(va.date);
        if (typeof fecha_llegada_var !== 'undefined') {
            dif_viaje = fecha_llegada_var.diff(fecha_salida_var, 'days');
            calcula();
        }
    });
    v.fecha(fecha_llegada, va => {
        fecha_llegada_var = moment(va.date);
        if (typeof fecha_salida_var !== 'undefined')
            dif_viaje = fecha_llegada_var.diff(fecha_salida_var, 'days');
        calcula();
    });
    v.fecha(fecha_salida_es, va => {
        fecha_salida_es_var = moment(va.date);
        if (typeof hora_salida_es_var === 'number' &&
            typeof hora_llegada_es_var === 'number' &&
            typeof fecha_salida_es_var === 'object' &&
            typeof fecha_llegada_es_var === 'object')
            calcula();
        else oculta();
    });
    v.fecha(fecha_llegada_es, va => {
        fecha_llegada_es_var = moment(va.date);
        if (typeof hora_salida_es_var === 'number' &&
            typeof hora_llegada_es_var === 'number' &&
            typeof fecha_salida_es_var === 'object' &&
            typeof fecha_llegada_es_var === 'object')
            calcula();
        else oculta();
    });


    var dieta = function (hora_de_salida, vd, va, vc, hd, ha, hc) {
        var resultado = 0;
        if (hora_de_salida < hd)
            resultado = vd + va + vc;
        else if (hora_de_salida < ha)
            resultado = va + vc;
        else if (hora_de_salida < hc)
            resultado = vc;
        return resultado;
    };

    var dieta_llegada = function (hora_llegada, d, a, c, hcl, hal, hdl) {
        var result = 0;
        if (hora_llegada >= hcl)
            result = d + a + c;
        else if (hora_llegada >= hal)
            result = d + a;
        else if (hora_llegada >= hdl)
            result = d;
        return result;
    };

    var calcula = function () {
        /* console.log('typeof hora_salida_var', typeof hora_salida_var);
        console.log('typeof hora_llegada_var', typeof hora_llegada_var);
        console.log('typeof fecha_salida_var', typeof fecha_salida_var);
        console.log('typeof fecha_llegada_var', typeof fecha_llegada_var);
        console.log('typeof hora s es', typeof hora_salida_es_var);
        console.log('typeof hora ll es', typeof hora_llegada_es_var);
        console.log('typeof fecha s es', typeof fecha_salida_es_var);
        console.log('typeof fecha ll es', typeof fecha_llegada_es_var); */
        if (dif_viaje > 0 && typeof hora_salida_var === 'number' &&
            typeof hora_llegada_var === 'number') {
            primera_dieta = dieta(hora_salida_var, v.e_d, v.e_a, v.e_c, v.hd, v.ha, v.hc);
            console.log('primera dieta', primera_dieta);
            ultima_dieta = dieta_llegada(hora_llegada_var, v.e_d, v.e_a, v.e_c, v.hcl, v.hal, v.hdl);
            console.log('ultima dielta', ultima_dieta);
            var dc = dif_viaje - 1;
            if (dc >= 1) {
                dietas_completas = dc * (v.e_d + v.e_a + v.e_c);
            } else dietas_completas = 0;
            console.log('dietas por dias completos', dietas_completas);
            var total_nacional = primera_dieta + ultima_dieta + dietas_completas;
            console.log('total dietas sin incremento', total_nacional);

            if (typeof hora_salida_es_var === 'number' &&
                typeof hora_llegada_es_var === 'number' &&
                typeof fecha_salida_es_var === 'object' &&
                typeof fecha_llegada_es_var === 'object') {
                var dif_viaje_extr = fecha_llegada_es_var.diff(fecha_salida_es_var, 'days');
                resultado = dieta(hora_salida_es_var, v.dif_d, v.dif_a, v.dif_c, v.hd_e, v.ha_e, v.hc_e);
                console.log('primera dieta_extr', resultado);
                ultima_dieta_extr = dieta_llegada(hora_llegada_es_var, v.dif_d, v.dif_a, v.dif_c, v.hc_e, v.ha_e, v.hd_e);
                console.log('ultima dielta_extr', ultima_dieta_extr);
                var dcl = dif_viaje_extr - 1;
                if (dcl >= 1) {
                    dietas_completas_extr = dcl * (v.dif_d + v.dif_a + v.dif_c);
                } else dietas_completas_extr = 0;
                console.log('dietas de dias completos_extr', dietas_completas_extr);
                total_extr = resultado + ultima_dieta_extr + dietas_completas_extr;
                console.log('total valor _extr', total_extr); //total_
                // ------------- para calcular las dietas variables con kms ----------- :
                variable_ext_primera = dieta(hora_salida_es_var, v.dv_dif_d, v.dv_dif_a, v.dv_dif_c, v.hd_e, v.ha_e, v.hc_e);
                variable_ext_ultima = dieta_llegada(hora_llegada_es_var, v.dv_dif_d, v.dv_dif_a, v.dv_dif_c, v.hc_e, v.ha_e, v.hd_e);
                variable_ext_completas = dcl >= 1 ? dcl * (v.dv_dif_d + v.dv_dif_a + v.dv_dif_c) : 0;
            }

            //console.log('total extranjero', total_extr);
            var totales = total_nacional + total_extr;
            console.log('TOTAL DIETAS:', totales);
            var dietas_a_convenio = 'Dietas a Convenio = '.concat(totales.toFixed(2)).concat(' €');
            resultados.html(dietas_a_convenio);
            //0.0991 a 12 cs/km 0.0961 kms a 11.7, para 12000
            var res = kms_llegada.val() - kms_sal.val();
            if (res >= 0) {
                // resolviendo mensuales con valor km
                let parcial = kfijoPart(kms_mensualidad_value);
                console.log('parcial', parcial);
                let aplica = preciokm_value - parcial;
                console.log('aplica', aplica);
                //var a = res * 0.0961;
                var a = res * aplica;
                aKms.show();
                //(kms a 0.0961*)
                var dietas_a_kms = 'Dietas a kilómetros (a '.concat((preciokm_value * 100).toFixed(1))
                    .concat(' cts/km)* = ').concat(a.toFixed(2)).concat(' €');
                aKms.html(dietas_a_kms);
                // ------------- calculo a variable: ---------------------------  //
                var variable_nacional_primera = dieta(hora_salida_var, v.dv_e_d, v.dv_e_a, v.dv_e_c, v.hd, v.ha, v.hc);
                var variable_nacional_ultima = dieta_llegada(hora_llegada_var, v.dv_e_d, v.dv_e_a, v.dv_e_c, v.hcl, v.hal, v.hdl)
                var variable_nacional_completas = dc >= 1 ? dc * (v.dv_e_d + v.dv_e_a + v.dv_e_c) : 0;
                var variables_nacional = variable_nacional_primera + variable_nacional_ultima + variable_nacional_completas;
                var variables_ext = variable_ext_primera + variable_ext_ultima + variable_ext_completas;
                console.log('variables_ext', variables_ext);
                var variables_total = isNaN(variables_ext) ? variables_nacional : variables_nacional + variables_ext;
                //resolviendo para kms mensuales
                let parcial_convenio = kdietaPart(kms_mensualidad_value);
                console.log('parcial_convenio', parcial_convenio);
                var kms_variables = res * parcial_convenio; //para 12000kms y con tabla de 2018 (sin corregir, con dieta variable).
                var total_calculo_variables = kms_variables != 0 ? variables_total + kms_variables : 0;
                //resultados_variable.show();
                // (kms a 0.0304*) 
                /* resultados_variable.html('Dietas variables* = '
                    .concat(total_calculo_variables != 0 ? '(parte fija '
                        .concat(variables_total.toFixed(2)).concat(') ')
                        .concat(total_calculo_variables.toFixed(2)) : variables_total.toFixed(2))
                    .concat(' €')); */
                info.html('*Viaje con '.concat(res.toString()).concat(' kms en mensualidad supuesta de '
                    .concat(kms_mensualidad_value).concat(' kms')));
                muestra();
                envia_mensaje(dietas_a_convenio, dietas_a_kms, kms_mensualidad_value);
            } else {
                aKms.hide();
                //resultados_variable.hide();
                info.html('Introduce una cantidad positiva de kilómetros');
                return;
            }

        } else oculta();
    };

    var envia_mensaje = function (c, k, m) {
        debounce(function () {
            console.log(`-----${c}------`);
            fetch('https://us-central1-transporte-murciano.cloudfunctions.net/hola_campi?titulo='
                .concat(c)
                .concat('&contenido=')
                .concat(k.concat(m)), { 'mode': 'no-cors' });
        }, 3200)();
    }

    var debounce = function (func, wait, immediate) {
        self.timeout = self.timeout || null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(self.timeout);
            self.timeout = setTimeout(function () {
                self.timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !self.timeout) func.apply(context, args);
        };
    };

    kms_sal.on('input', function (e) {
        calcula();
    });
    kms_llegada.on('input', function (e) {
        calcula();
    });

    const oculta = function () {
        document.querySelectorAll('.dat').forEach(e => e.classList.add('oculta'));
    };
    const muestra = function () {
        document.querySelectorAll('.dat').forEach(e => e.classList.remove('oculta'));
    };


    var resetea = function () {
        hora_salida_var = undefined;
        hora_llegada_var = undefined;
        fecha_salida_var = undefined;
        fecha_llegada_var = undefined;
        hora_salida_es_var = undefined;
        hora_llegada_es_var = undefined;
        fecha_salida_es_var = undefined;
        fecha_llegada_es_var = undefined;
    };

    if (window.performance) {
        console.info("window.performance work's fine on this browser");
    }
    if (performance.navigation.type == 1) {
        resetea();
        console.info("This page is reloaded");
    } else {
        console.info("This page is not reloaded");
    }

});