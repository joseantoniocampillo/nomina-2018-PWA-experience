require('../dist/clock-lib/jquery-clockpicker.min.js');
require('../dist/locales/bootstrap-datepicker.es.min.js');
module.exports = {
    e_d: 7.9458,
    e_a: 19.8571,
    e_c: 17.3872,
    e_cama: 8.3536,
    f_d: 12.8263,
    f_a: 24.9445,
    f_c: 21.2292,
    f_cama: 16.1893,
    dif_d: 4.8805,
    dif_a: 5.0874,
    dif_c: 3.842,
    dv_e_d: 5.2717,
    dv_e_a: 13.1744,
    dv_e_c: 11.5357,
    dv_dif_d: 1.5169,
    dv_dif_a: 0.028,
    dv_dif_c: -0.2997,
    reloj: function (input, f) {
        input.clockpicker({
            autoclose: true,
            ignoreReadonly: true,
            allowInputToggle: true,
            afterDone: function () {
                var r = input["0"].value;
                var res = parseInt(r.replace(":", ""));
                f(res);
            }
        });
    },
    fecha: function (fe, fun) {
        fe.datepicker({
            language: "es",
            autoclose: true,
            ignoreReadonly: true,
            allowInputToggle: true
        }).on('hide', function (e) {
            fun(e);
        });
    },
    hd: 800,
    ha: 1600,
    hc: 2300,
    hdl: 600,
    hal: 1400,
    hcl: 2100,
    hd_e: 700,
    ha_e: 1500,
    hc_e: 2200
}