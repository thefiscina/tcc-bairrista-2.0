// global.ts
import { Injectable } from "@angular/core";
import { AppConfig } from "./service/app.config";
import * as moment from "moment";
@Injectable()
export class Global {
    apiUrl = AppConfig.settings.apiServer.apiUrl;
    currentUser: any = {}

    dateFormat(dataStr: any) {
        if (dataStr == null || dataStr == "") {
            return "--/--/--";
        }

        return moment(dataStr).format("DD/MM/YYYY");
    }

    dateTimeFormat(dataStr: any) {
        if (dataStr == null || dataStr == "") {
            return "--/--/--";
        }

        return `${moment(dataStr).format("DD/MM/YYYY")} as ${moment(dataStr).format("HH:mm")}`;
    }

    formatApiPath(items: any = []) {
        let returnStr = "";
        items.forEach((element: any) => {
            returnStr += element + "/";
        });
        return returnStr.substring(0, returnStr.length - 1);
    }

    creditCardType(cc: string) {
        let amex = new RegExp('^3[47][0-9]{13}$');
        let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
        let cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
        let cup2 = new RegExp('^81[0-9]{14}[0-9]*$');

        let mastercard = new RegExp('^5[1-5][0-9]{14}$');
        let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

        let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
        let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
        let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');

        let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
        let jcb = new RegExp('^35[0-9]{14}[0-9]*$');


        if (visa.test(cc)) {
            return 'VISA';
        }
        if (amex.test(cc)) {
            return 'AMEX';
        }
        if (mastercard.test(cc) || mastercard2.test(cc)) {
            return 'MASTERCARD';
        }
        if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
            return 'DISCOVER';
        }
        if (diners.test(cc)) {
            return 'DINERS';
        }
        if (jcb.test(cc)) {
            return 'JCB';
        }
        if (cup1.test(cc) || cup2.test(cc)) {
            return 'CHINA_UNION_PAY';
        }
        return undefined;
    }

    numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    mascara(t: any, mask: any) {
        var i = t.currentTarget.value;
        var saida = mask.substring(1, 0);
        var texto = mask.substring(i)
        if (texto.substring(0, 1) != saida) {
            t.currentTarget.value += texto.substring(0, 1);
        }
    }

    formatDateDay(value: any) {
        if (value) {
            return moment(value).format("DD");
        }
        return "--";
    }

    formatDateDayMonth(value: any) {
        if (value) {
            return moment(value).format("DD/MM");
        }
        return "--";
    }

    formateDateMonth(index: any) {
        var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        if (index) {
            // var monthIndex = moment(value).month();
            return meses[index];
        }
        return "--";
    }

    getIndexMonth(m: any) {
        var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        if (m) {
            let index = meses.findIndex(x => x === m) + 1;
            return index;
        }
        return 0;
    }

    formateDate(value: any) {
        if (value) {
            return moment(value).format("DD/MM/YYYY");
        }
        return "--";
    }

    formateDateAndTime(value: any) {
        if (value) {
            return moment(value).format("DD/MM/YYYY HH:MM");
        }
        return "--";
    }

    formateDateDayWeek(value: any) {
        var week = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]
        if (value) {
            var weekIndex = moment(value).day();
            return week[weekIndex].substring(0, 3);
        }
        return "--";
    }

    formateTime(value: any) {
        if (value) {
            return moment(value).format("HH:mm");
        }
        return "--";
    }

    formaterCurrency(value: any) {
        if (value) {
            if (value.toString().includes("R$")) {
                return value.replace("R$", "").trim();
            }
            return value;
        }
        return value
    }

    formatarDataHoraValor(data: any, hora: any) {
        if (data && hora) {
            var split = `${data.split("/")[2]}-${data.split("/")[1]}-${data.split("/")[0]}T${hora}`;
            var data_ = moment(split);
            var checarDataPassada = moment(data_).isBefore(moment());
            if (checarDataPassada) {
                return null;
            } else {
                return data_;
            }
        }
        return null;
    }

    MD5(d: any) {
        var result = this.M(this.V(this.Y(this.X(d), 8 * d.length)));
        return result.toLowerCase()
    };

    M(d: any) {
        for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
        return f;
    }

    X(d: any) {
        for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0;
        for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
        return _;
    }

    V(d: any) {
        for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
        return _;
    }

    Y(d: any, _: any) {
        d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
        for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
            var h = m, t = f, g = r, e = i;
            f = this.md5_ii(f = this.md5_ii(f = this.md5_ii(f = this.md5_ii(f = this.md5_hh(f = this.md5_hh(f = this.md5_hh(f = this.md5_hh(f = this.md5_gg(f = this.md5_gg(f = this.md5_gg(f = this.md5_gg(f = this.md5_ff(f = this.md5_ff(f = this.md5_ff(f = this.md5_ff(f, r = this.md5_ff(r, i = this.md5_ff(i, m = this.md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = this.md5_ff(r, i = this.md5_ff(i, m = this.md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = this.md5_ff(r, i = this.md5_ff(i, m = this.md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = this.md5_ff(r, i = this.md5_ff(i, m = this.md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = this.md5_gg(r, i = this.md5_gg(i, m = this.md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = this.md5_gg(r, i = this.md5_gg(i, m = this.md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = this.md5_gg(r, i = this.md5_gg(i, m = this.md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = this.md5_gg(r, i = this.md5_gg(i, m = this.md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = this.md5_hh(r, i = this.md5_hh(i, m = this.md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = this.md5_hh(r, i = this.md5_hh(i, m = this.md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = this.md5_hh(r, i = this.md5_hh(i, m = this.md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = this.md5_hh(r, i = this.md5_hh(i, m = this.md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = this.md5_ii(r, i = this.md5_ii(i, m = this.md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = this.md5_ii(r, i = this.md5_ii(i, m = this.md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = this.md5_ii(r, i = this.md5_ii(i, m = this.md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = this.md5_ii(r, i = this.md5_ii(i, m = this.md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = this.safe_add(m, h), f = this.safe_add(f, t), r = this.safe_add(r, g), i = this.safe_add(i, e)
        }
        return Array(m, f, r, i)
    };

    md5_cmn(d: any, _: any, m: any, f: any, r: any, i: any) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(_, d), this.safe_add(f, i)), r), m)
    };

    md5_ff(d: any, _: any, m: any, f: any, r: any, i: any, n: any) {
        return this.md5_cmn(_ & m | ~_ & f, d, _, r, i, n)
    };

    md5_gg(d: any, _: any, m: any, f: any, r: any, i: any, n: any) {
        return this.md5_cmn(_ & f | m & ~f, d, _, r, i, n)
    };

    md5_hh(d: any, _: any, m: any, f: any, r: any, i: any, n: any) {
        return this.md5_cmn(_ ^ m ^ f, d, _, r, i, n)
    };

    md5_ii(d: any, _: any, m: any, f: any, r: any, i: any, n: any) {
        return this.md5_cmn(m ^ (_ | ~f), d, _, r, i, n)
    };

    safe_add(d: any, _: any) {
        var m = (65535 & d) + (65535 & _);
        return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
    };

    bit_rol(d: any, _: any) {
        return d << _ | d >>> 32 - _
    };

    /* necessário para o md5 */
    /** NORMAL words**/
    md5Normal(valor: any) {
        //value = 'test';
        var result = this.MD5(valor);
        //document.body.innerHTML = 'hash -  normal words: ' + result;
        return result;
        // value = 'מבחן'
    }

    showAlert(title: any, body: any) {
        alert(`${title} : ${body}`);
    }


    checkSpecialCaracteres(string: any) {
        var pattern = /[!@#$%^&*(),.?":{}|<>]/;
        return pattern.test(string);
    }

    checkHasNumberAndLetters(string: any) {
        var pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
        return pattern.test(string);
    }

    checkHasLettersUppercase(string: any) {
        var pattern = /^(?=.*[A-Z])/;
        return pattern.test(string);
    }

    checkHasLettersLowercase(string: any) {
        var pattern = /^(?=.*[a-z])/;
        return pattern.test(string);
    }


    getRandomLocation(lat: any, lng: any, distance = 200) {
        // Convert to radians
        lat *= Math.PI / 180;
        lng *= Math.PI / 180;

        var radius;

        // Distance should be set in meters, negative for exact distance
        if (distance < 0) {
            // Exact distance
            radius = Math.abs(distance);
        } else {
            // Get uniformly-random distribution within peovided distance
            // http://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
            radius = Math.random() + Math.random();
            radius = radius > 1 ? 2 - radius : radius;
            radius *= distance ? distance : 10000; // multiply by distance meters
        }

        // Convert radius from meters to degrees to radians
        // 111319.9 meters = one degree along the equator
        radius /= 111319.9;
        // Correction for the actual distance from equator is NOT needed here
        // radius *= Math.cos(lat);
        // Convert to radians
        radius *= Math.PI / 180;

        // Random angle
        var angle = Math.random() * Math.PI * 2;

        // Get a point {nLat,nLng} in a distance={radius} out on the {angle} radial from point {lat,lng}
        // From Aviation Formulary V1.46 By Ed Williams:
        // → http://williams.best.vwh.net/avform.htm#LL
        // → ftp://ftp.bartol.udel.edu/anita/amir/My_thesis/Figures4Thesis/CRC_plots/Aviation%20Formulary%20V1.46.pdf
        // → https://github.com/arildj78/AvCalc/blob/master/avform.txt
        // [section "Lat/lon given radial and distance"]
        var nLng,
            nLat = Math.asin(Math.sin(lat) * Math.cos(radius) + Math.cos(lat) * Math.sin(radius) * Math.cos(angle));
        if (Math.cos(nLat) == 0) {
            nLng = lng;
        } else {
            nLng = (lng - Math.asin(Math.sin(angle) * Math.sin(radius) / Math.cos(nLat)) + Math.PI) % (Math.PI * 2) - Math.PI
        }

        // Convert to degrees
        nLat *= 180 / Math.PI;
        nLng *= 180 / Math.PI;

        return [nLat, nLng];
    };

}
