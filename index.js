const express = require('express');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');



var app=express();




function verificaImagini(){

	var textFisier=fs.readFileSync("resurse/json/galerie.json") //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect

	var caleGalerie=jsi.cale_galerie;
    let vectImagini=[]
	
	for (let im of jsi.imagini){
		
		var imVeche= path.join(caleGalerie, im.cale_imagine);//obtin claea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
		var ext = path.extname(im.cale_imagine);//obtin extensia
		var numeFisier =path.basename(im.cale_imagine,ext)//obtin numele fara extensie
		let imNoua=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
	

		vectImagini.push({mare:imVeche, mic:imNoua, descriere:im.titlu}); //adauga in vector un element
		
		if (!fs.existsSync(imNoua))//daca nu exista imaginea, mai jos o voi crea
		sharp(imVeche)
		  .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imNoua, function(err) {
              if(err)
			    console.log("eroare conversie",imVeche, "->", imNoua, err);
		  });
	}
	
    // [ {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}, {mare:cale_img_mare, mic:cale_img_mica, descriere:text}  ]
    return vectImagini;
}



//acceseaza localhost:8080 cat si localhost:8080/index
app.get(["/","/index"],function(req, res){

    console.log("incarcat index");
    
	try {
		res.render("pagini/index", {imagini: verificaImagini()});
	  }
	  catch(err) {
		console.log(err.message);
	  }
});



//adresa folderului cu resurse
app.use("/resurse",express.static(__dirname+"/resurse"));


//accesez pagina fotbal
app.get(["/pagini/fotbal"],function(req, res){

    console.log("incarcat pagina fotbal");
    res.render("pagini/fotbal");
    
});


//pentru a randa 404 cand utilizatorul doreste o alta pagina fata de cele existente
app.get('*', (req, res) => {
    res.render("pagini/404");
  });
  


//setez ca motor de template ejs
app.set("view engine","ejs");

//__dirname e folderul proiectului (variabila implicit setata de node)
console.log("Proiectul se afla la ",__dirname);






app.listen(8080);
console.log("Serverul a pornit!");