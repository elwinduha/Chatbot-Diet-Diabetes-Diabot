function fcal(w, act, u, jk, bmi) {
    // set kalori basal berdasarkan jenis kelamin
    if (jk == 'laki-laki') {
        cb = 30;
    } else {
        cb = 25;
    }

    // set jumlah kalori berdasarkan aktivitas
    if (act == 'rendah') {
        c = 0.2;
    } else if (act == 'sedang') {
        c = 0.3;
    } else if (act == 'berat') {
        c = 0.4;
    }

    // hitung kalori original (berat badan * kalori basal)

    let origC = w * cb;

    // set pengurangan dan pejumlahan kalori berdasarkan berat 
    if (bmi < 18.5) {
        let addC = 0.2;
        tC = (origC + (origC * c) + (origC * addC));
    } else if (bmi > 18.5 && bmi < 23) {
        tC = (origC + (origC * c));
    } else {
        let redC = 0.2;
        tC = (origC + (origC * c) - (origC * redC));
    }

    // set pengurangan dan penjumlahan kalori berdasarkan usia
    if (u <= 39) {
        return tC;
    } else if (u >= 40 && u <= 59) {
        let redC = 0.05;
        return (tC - (origC * redC));
    } else if (u >= 60 && u <= 69) {
        let redC = 0.1;
        return (tC - (origC * redC));
    } else {
        let redC = 0.2;
        return (tC - (origC * redC));
    }
}

berat = 50
aktivitas = 'berat'
umur = 40
jk = 'perempuan'
bmi = 18

cal = fcal(berat, aktivitas, umur, jk, bmi);
console.log(cal);