const express = require('express');
var router = express.Router();
const dfff = require('dialogflow-fulfillment');

//database (mongodb)
var MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
var url = "mongodb+srv://dia_bot:12345@cluster0.qxkx4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("chtbot_diabot");
  dbo.collection("dataMakanan2").find({}).toArray(function (err, result) {
    if (err) throw err;





    // SYNTAX PENUTUP DATABASE CARI DENGAN CTRL+F [ penutup database ]



    /* GET users listing. */
    router.get('/', function (req, res,) {
      res.send("It's Online Now");
    });


    router.post('/', express.json(), (req, res) => {
      const agent = new dfff.WebhookClient({
        request: req,
        response: res
      });

      let nama;
      let tinggi;
      let bmi;
      let berat;
      let umur;
      let jk;
      let desc;
      let cal;
      let ctx;

      function resetContext(a) {
        let delContext = a.contexts;
        for (let i = 0; i < delContext.length; i++) {
          a.context.set({ 'name': delContext[i].name, 'lifespan': -1 });
        }
      }

      function fBMI(w, h) {
        return (w / (h ^ 2)).toFixed(2);
      }

      function fcal(w, act, u, jk, bmi) {

        // set kalori basal berdasarkan jenis kelamin
        if (jk == 'laki-laki') {
          cb = 30;
        } else if (jk == 'perempuan') {
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

      function pesanHasilBMI(a, nama, bmi, cal, desc, wc = true) {

        if (wc) {
          a.add("Hai " + nama + ", BMI Anda adalah " + bmi + "\n" + desc);
          a.add('Anda membutuhkan ' + cal + ' Kalori.');
          a.add('Berikut Rekomendasi Makanan sesuai dengan Kebutuhan Kalori Anda');




        } else {
          a.add("Hai " + nama + ", BMI Anda adalah " + bmi + "\n" + desc);
          a.add('Untuk saat ini kami belum bisa memberikan rekomendasi makanan untuk kategori Obesitas type I dan Obesitas Type II');
        }

      }

      function pesanTerimakasih(agent) {
        agent.add('Terima Kasih telah Konsultasi, balas "mulai" untuk konsultasi kembali atau "selesai" untuk mengakhiri :)');
      }

      function tanyaMenuLain(agent) {
        agent.add('Apakah Anda ingin Rekomendasi Menu lain? Jika iya, balas "menu lain" jika tidak balas "selesai"')
      }

      function rekomendasiMakanan(a, cal) {
        var i;
        var gram;
        var round_gram;
        for (i = 0; i < result.length; i++) {

          if (cal == result[i].total && cal < 2500) {
            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 +
              "\n\nTotal kalori : " + result[i].total

            );
          }//tutup if

          else if (cal == result[i].total && cal >= 2500) {

            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1000 && cal < 1100 && result[i].total >= 1000 && result[i].total < 1100) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1100 && cal < 1200 && result[i].total >= 1100 && result[i].total < 1200) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1200 && cal < 1300 && result[i].total >= 1200 && result[i].total < 1300) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1300 && cal < 1400 && result[i].total >= 1300 && result[i].total < 1400) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1400 && cal < 1500 && result[i].total >= 1400 && result[i].total < 1500) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1500 && cal < 1600 && result[i].total >= 1500 && result[i].total < 1600) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );
          }//tutup else if

          else if (cal > 1600 && cal < 1700 && result[i].total >= 1600 && result[i].total < 1700) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1700 && cal < 1800 && result[i].total >= 1700 && result[i].total < 1800) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1800 && cal < 1900 && result[i].total >= 1800 && result[i].total < 1900) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 1900 && cal < 2000 && result[i].total >= 1900 && result[i].total < 2000) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2000 && cal < 2100 && result[i].total >= 2000 && result[i].total < 2100) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2100 && cal < 2200 && result[i].total >= 2100 && result[i].total < 2200) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2200 && cal < 2300 && result[i].total >= 2200 && result[i].total < 2300) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2300 && cal < 2400 && result[i].total >= 2300 && result[i].total < 2400) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2400 && cal < 2500 && result[i].total >= 2400 && result[i].total < 2500) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2500 && cal < 2600 && result[i].total >= 2500 && result[i].total < 2600) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2600 && cal < 2700 && result[i].total >= 2600 && result[i].total < 2700) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2700 && cal < 2800 && result[i].total >= 2700 && result[i].total < 2800) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2800 && cal < 2900 && result[i].total >= 2800 && result[i].total < 2900) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 2900 && cal < 3000 && result[i].total >= 2900 && result[i].total < 3000) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if

          else if (cal > 3000 && cal < 3100 && result[i].total >= 3000 && result[i].total < 3100) {

            gram = (cal - result[i].total) / result[i].menu_tambahan.kalori_menu1;
            round_gram = gram.toFixed(1);


            a.add(
              result[i].class + ": \nPagi (07:00): \n-" + result[i].makan_pagi.menu1 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu1 + "\n-" +
              result[i].makan_pagi.menu2 + " , takaran (gram) : " + result[i].makan_pagi.kalori_menu2 + "\n\nSelingan (10:00) \n-" +
              result[i].selingan1.menu1 + " , takaran (gram) : " + result[i].selingan1.kalori_menu1 +
              result[i].selingan1.menu2 + " , takaran (gram) : " + result[i].selingan1.kalori_menu2 + "\n\nSiang (12:00) \n-" +
              result[i].makan_siang.menu1 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu1 + "\n-" +
              result[i].makan_siang.menu2 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu2 + "\n-" +
              result[i].makan_siang.menu3 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu3 + "\n-" +
              result[i].makan_siang.menu4 + " , takaran (gram) : " + result[i].makan_siang.kalori_menu4 + "\n\nSelingan (15:00) \n-" +
              result[i].selingan2.menu1 + " , takaran (gram) : " + result[i].selingan2.kalori_menu1 +
              result[i].selingan2.menu2 + " , takaran (gram) : " + result[i].selingan2.kalori_menu2 + "\n\nMalam (19:00) \n-" +
              result[i].makan_malam.menu1 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu1 + "\n-" +
              result[i].makan_malam.menu2 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu2 + "\n-" +
              result[i].makan_malam.menu3 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu3 + "\n-" +
              result[i].makan_malam.menu4 + " , takaran (gram) : " + result[i].makan_malam.kalori_menu4 + "\n\nSelingan (21:00) \n-" +
              result[i].selingan3.menu1 + " , takaran (gram) : " + result[i].selingan3.kalori_menu1 + "\n-" +
              result[i].selingan3.menu2 + " , takaran (gram) : " + result[i].selingan3.kalori_menu2 + "\n-" +
              result[i].menu_tambahan.menu1 + " , takaran(gram) : " + round_gram +
              "\n\nTotal kalori : " + cal

            );

          }//tutup else if




        }//tutup for



      }

      function dataUser(agent) {
        umur = agent.parameters["umur"];
        if (umur < 20) {
          resetContext(agent);
          agent.add("Maaf umur Anda belum memenuhi persyaratan hitung BMI, umur minimal 20 Tahun.");
          pesanTerimakasih(agent);

        } else if (umur > 120) {
          resetContext(agent);
          agent.add("Maaf umur yang Anda maksud tidak valid.");
          pesanTerimakasih(agent);

        } else {
          agent.add("Berapakah tinggi badan Anda? (Satuan Centi Meter, ex. 175 Cm");
        }
      }

      function cekBMI(agent) {

        tinggi = agent.parameters["tinggi"] / 100;
        berat = agent.parameters["berat"];
        bmi = fBMI(berat, tinggi);

        ctx = agent.contexts;
        nama = ctx[3].parameters["nama"];
        jk = ctx[3].parameters["jk"];

        agent.context.set({
          'name': 'sessData',
          'lifespan': 50,
          'parameters': {
            'bmi': bmi
          }
        });

        if (bmi < 18.5) {
          agent.add('Bagaimana Aktivitas Anda?');
          agent.add('Aktivitas Ringan (ex. Pegawai Kantor, Guru, Ibu Rumah Tangga)');
          agent.add('Aktivitas Sedang (ex. Pegawai Industri Ringan, Mahasiswa, Militer tidak sedang berperang)');
          agent.add('Aktivitas Berat (ex. Petani, Buruh, Atlet, Militer dalam keadaan latihan)');
        } else if (bmi >= 30.00) {
          resetContext(agent);
          desc = "Anda termasuk kedalam kategori Obesitas II";
          pesanHasilBMI(agent, nama, bmi, 0, desc, false);
          pesanTerimakasih(agent);
        } else {
          if (jk == 'laki-laki') {
            s = 90;
          } else if (jk == 'perempuan') {
            s = 80;
          }
          agent.add('Apakah lingkar pinggang Anda lebih besar atau sama dengan ' + s + ' Cm?');
        }
      }

      function cAktivitas(agent) {
        ctx = agent.contexts;
        bmi = ctx[1].parameters["bmi"];
        let aktivitas = ctx[0].parameters["aktivitas"];
        berat = ctx[0].parameters["berat"];
        jk = ctx[3].parameters["jk"];
        nama = ctx[3].parameters["nama"];
        umur = ctx[3].parameters["umur"];

        if (bmi < 18.5) {
          desc = 'Berat Badan Anda Kurang';
          cal = fcal(berat, aktivitas, umur, jk, bmi);
        } else if (bmi >= 18.5 || bmi < 23) {
          desc = 'Berat Badan Anda Normal';
          cal = fcal(berat, aktivitas, umur, jk, bmi);
        } else if (bmi >= 23 || bmi < 25) {
          desc = 'Anda termasuk kedalam kategori Obesitas I Resiko Tinggi';
          cal = fcal(berat, aktivitas, umur, jk, bmi);
        }

        agent.context.set({
          'name': 'sessData',
          'lifespan': 50,
          'parameters': {
            'kalori': cal
          }
        });
        pesanHasilBMI(agent, nama, bmi, cal, desc);
        rekomendasiMakanan(agent, cal);
        tanyaMenuLain(agent);
        // resetContext(agent);
        // pesanTerimakasih(agent);

      }

      function cekLingkarPinggang(agent) {
        ctx = agent.contexts;
        let jawaban = agent.parameters["closeAnswer"];
        bmi = ctx[2].parameters["bmi"];
        nama = ctx[3].parameters["nama"];
        berat = ctx[3].parameters["berat"];

        if (bmi < 25 && jawaban == 'ya') {
          agent.add('Bagaimana Aktivitas Anda?');
          agent.add('Aktivitas Ringan (ex. Pegawai Kantor, Guru, Ibu Rumah Tangga)');
          agent.add('Aktivitas Sedang (ex. Pegawai Industri Ringan, Mahasiswa, Militer tidak sedang berperang)');
          agent.add('Aktivitas Berat (ex. Petani, Buruh, Atlet, Militer dalam keadaan latihan)');
        } else if (bmi < 25 && jawaban == 'tidak') {
          desc = "Anda termasuk kedalam kategori Berat Badan Berlebih Resiko Meningkat";
          cal = fcal(berat, 20)
          pesanHasilBMI(agent, nama, bmi, cal, desc);
          rekomendasiMakanan(agent, cal);
          agent.context.set({
            'name': 'sessData',
            'lifespan': 50,
            'parameters': {
              'kalori': cal
            }
          });
          tanyaMenuLain(agent);
          // resetContext(agent);
          // pesanTerimakasih(agent);
        } else if (bmi < 30 && jawaban == 'ya') {
          desc = "Anda termasuk kedalam kategori Obesitas I Resiko Sangat Tinggi";

          pesanHasilBMI(agent, nama, bmi, 0, desc, false);
          resetContext(agent);
          pesanTerimakasih(agent);
        } else if (bmi < 30 && jawaban == 'tidak') {
          desc = "Anda termasuk kedalam kategori Obesitas I Resiko Sedang";
          pesanHasilBMI(agent, nama, bmi, 0, desc, false);
          resetContext(agent);
          pesanTerimakasih(agent);
        }
      }

      function menuLain(agent) {
        ctx = agent.contexts;
        cal = ctx[1].parameters['kalori'];

        // letak code untuk rekomendasi menu lain
        agent.add("Sabar ya menu nya lagi diracik sama Chef Bayu");
        // resetContext(agent);
        pesanTerimakasih(agent);
      }

      function finishProgram(agent) {

        resetContext(agent);

        agent.add("Terima kasih telah menggunakan DiaBot. Jangan lupa mampir kembali ya dan juga Jangan lupa beritahu ke yang lainnya ya agar mereka bisa berkonsultasi dengan DiaBot.");
      }

      var intentMap = new Map();

      intentMap.set("dataDiri", dataUser);
      intentMap.set("dataBMI", cekBMI);
      intentMap.set("cekAktivitas", cAktivitas);
      intentMap.set("cekLingkarPinggang", cekLingkarPinggang);
      intentMap.set("rekomendasiMenuLain", menuLain);
      intentMap.set("DefaultFinishProgram", finishProgram);


      agent.handleRequest(intentMap);


    });

    // ini syntax penutup database,, 
    db.close();
  });
});

//end databasecd C:cd

module.exports = router;
