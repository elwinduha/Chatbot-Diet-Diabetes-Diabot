const express = require('express');
var router = express.Router();
const dfff = require('dialogflow-fulfillment');

//database (mongodb)
var MongoClient = require('mongodb').MongoClient;

// replace the uri string with your connection string.
var url = "mongodb+srv://dia_bot:1234@cluster0.qxkx4.mongodb.net/chtbot_diabot?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("chtbot_diabot");
  

    
    

// SYNTAX PENUTUP DATABASE CARI DENGAN CTRL+F [ penutup database ]



/* GET users listing. */
router.get('/', function(req, res,) {
  res.send("It's Online Now");
});


router.post('/', express.json(), (req, res)=>{
  const agent = new dfff.WebhookClient({
      request : req,
      response : res
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

  function resetContext(a){
    let delContext = a.contexts;
    for (let i = 0; i < delContext.length; i++) {   
    a.context.set({ 'name': delContext[i].name, 'lifespan': -1});
    }
  }

  function fBMI(w,h){
      return (w/(h^2)).toFixed(2);
  }

  function fcal(w,c){
    return w*c;
  }

  function pesanHasilBMI(a,nama,bmi,cal,desc,wc=true){

    if(wc){
      a.add("Hai "+nama+", BMI Anda adalah "+bmi+"\n"+desc);
      a.add('Anda membutuhkan '+cal+' Kalori.');
      a.add('Berikut Rekomendasi Makanan sesuai dengan Kebutuhan Kalori Anda');
      if (cal >= 1500 && cal <1600) {
      var query = { total: {$gte:1500 , $lt:1600} };
      dbo.collection("dataMakanan").find(query).toArray(function(err, result) {
        if (err) throw err;
          var i;
          var hasil;
          
            //agent.add("PAGI (07.00) \n "+result[i].makan_pagi+"\n total : "+result[i].total);
            a.add(result[1].makan_pagi);
            
          

          db.close();
        });

    }
    }else{
      a.add("Hai "+nama+", BMI Anda adalah "+bmi+"\n"+desc);
    }
    
  }

  function pesanTerimakasih(agent){
    agent.add('Terima Kasih telah Konsultasi, balas "mulai" untuk konsultasi kembali atau "selesai" untuk mengakhiri :)');
  }

  function rekomendasiMakanan(a, cal){

    if (cal >= 1500 && cal <1600) {
      var query = { total: {$gte:1500 , $lt:1600} };
      dbo.collection("dataMakanan").find(query).toArray(function(err, result) {
        if (err) throw err;
          var i;
          var hasil;
          
            //agent.add("PAGI (07.00) \n "+result[i].makan_pagi+"\n total : "+result[i].total);
            agent.add(result[1].makan_pagi);
            
          

          db.close();
        });

    }
    

 
  }

  function dataUser(agent){
    umur = agent.parameters["umur"];
    if ( umur < 20){
        resetContext(agent);
        agent.add("Maaf umur Anda belum memenuhi persyaratan hitung BMI, umur minimal 20 Tahun.");
        pesanTerimakasih(agent);
     
    } else if ( umur > 120){
      resetContext(agent);
      agent.add("Maaf umur yang Anda maksud tidak valid.");
      pesanTerimakasih(agent);
   
  }else{
        agent.add("Berapakah tinggi badan Anda? (Satuan Centi Meter, ex. 175 Cm");
    }
  }

  function cekBMI(agent){

    tinggi = agent.parameters["tinggi"]/100;
    berat = agent.parameters["berat"];
    bmi = fBMI(berat,tinggi);

    ctx = agent.contexts;
    nama = ctx[3].parameters["nama"];
    jk = ctx[3].parameters["jk"];
    
    agent.context.set({ 'name': 'sessData', 
                        'lifespan': 50,
                        'parameters': {
                        'bmi' : bmi
                        }});

    if (bmi < 18.5){
      agent.add('Bagaimana Aktivitas Anda? (Rendah, Sedang, Aktif) ');
    }else if(bmi >= 30.00){
      resetContext(agent);
      desc = "Anda termasuk kedalam kategori Obesitas III Resiko Parah";
      pesanHasilBMI(agent, nama, bmi, 0, desc, false);
      pesanTerimakasih(agent);
    }else{
      let s = (jk == "laki-laki") ? '90' : '80';
      agent.add('Apakah lingkar pinggang Anda lebih besar atau sama dengan '+s+' Cm?');
    }
  }

  function cAktivitas(agent){
    ctx = agent.contexts;
    bmi = ctx[1].parameters["bmi"];
    let aktivitas = ctx[0].parameters["aktivitas"];
    berat = ctx[0].parameters["berat"];
    jk = ctx[3].parameters["jk"];
    nama = ctx[3].parameters["nama"];

    if (jk == 'laki-laki'){

      //JIKA JENIS KELAMIN LAKI-LAKI/PRIA
      if (bmi < 18.5){
        desc = 'Berat Badan Anda Rendah';

        if (aktivitas == "rendah"){
          cal = fcal(berat,30);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,35);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,40)
        }
      }else if (bmi >= 18.5 || bmi < 23){
        desc = 'Berat Badan Anda Normal';

        if (aktivitas == "rendah"){
          cal = fcal(berat,25);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,30);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,35)
        }
      }else if (bmi >= 23 || bmi < 25){
        desc = 'Anda termasuk kedalam kategori Obesitas I Resiko Tinggi';

        if (aktivitas == "rendah"){
          cal = fcal(berat,20);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,25);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,30)
        }
      }

      pesanHasilBMI(agent, nama, bmi, cal, desc);
      rekomendasiMakanan(agent, cal); 
      resetContext(agent);
      pesanTerimakasih(agent);

    }else{

      // JIKA JENIS KELAMIN PEREMPUAN/WANITA
      if (bmi < 18.5){
        desc = 'Berat Badan Anda Rendah';

        if (aktivitas == "rendah"){
          cal = fcal(berat,25);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,30);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,35)
        }
      }else if (bmi >= 18.5 || bmi < 23){
        desc = 'Berat Badan Anda Normal';

        if (aktivitas == "rendah"){
          cal = fcal(berat,20);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,25);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,30)
        }
      }else if (bmi >= 23 || bmi < 25){
        desc = 'Anda termasuk kedalam kategori Obesitas I Resiko Tinggi';

        if (aktivitas == "rendah"){
          cal = fcal(berat,15);
        }else if (aktivitas == "sedang"){
          cal = fcal(berat,20);
        }else if (aktivitas == "tinggi"){
          cal = fcal(berat,25)
        }
      }

      pesanHasilBMI(agent, nama, bmi, cal, desc);
      rekomendasiMakanan(agent, cal); 
      resetContext(agent);
      pesanTerimakasih(agent);
    }
  }

  function cekLingkarPinggang(agent){
    ctx = agent.contexts;
    let jawaban = agent.parameters["closeAnswer"];
    bmi = ctx[2].parameters["bmi"];
    nama = ctx[3].parameters["nama"];
    berat = ctx[3].parameters["berat"];

    if(bmi < 25 && jawaban == 'ya'){
      agent.add('Bagaimana Aktivitas Anda? (Rendah, Sedang, Sangat Aktif) ');
    }else if(bmi < 25 && jawaban == 'tidak'){
      desc = "Anda termasuk kedalam kategori Obesitas I Resiko Meningkat";
      cal = fcal(berat,20)
      pesanHasilBMI(agent, nama, bmi, cal, desc);
      rekomendasiMakanan(agent, cal);
      resetContext(agent);
      pesanTerimakasih(agent);
    }else if(bmi < 30 && jawaban == 'ya'){
      desc = "Anda termasuk kedalam kategori Obesitas II Resiko Sangat Tinggi";
      pesanHasilBMI(agent, nama, bmi, 0, desc, false);
      resetContext(agent);
      pesanTerimakasih(agent);
    }else if(bmi < 30 && jawaban == 'tidak'){
      desc = "Anda termasuk kedalam kategori Obesitas II Resiko Tinggi";
      pesanHasilBMI(agent, nama, bmi, 0, desc, false);
      resetContext(agent);
      pesanTerimakasih(agent);
    }    
  }

  function finishProgram(agent){
    
    resetContext(agent);

    agent.add("Terima kasih telah menggunakan DiaBot. Jangan lupa mampir kembali ya dan juga Jangan lupa beritahu ke yang lainnya ya agar mereka bisa berkonsultasi dengan DiaBot.");
  }

  var intentMap = new Map();

  intentMap.set("dataDiri", dataUser);
  intentMap.set("dataBMI", cekBMI);
  intentMap.set("cekAktivitas", cAktivitas);
  intentMap.set("cekLingkarPinggang", cekLingkarPinggang);
  intentMap.set("DefaultFinishProgram", finishProgram);

  agent.handleRequest(intentMap);


});

// ini syntax penutup database,, 

});
//end databasecd C:cd

module.exports = router;