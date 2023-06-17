const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/yapxUserModel');
const Urun = require('../../models/urunler');
const Marka = require('../../models/markaModel');
const Categories = require('../../models/Categories');
const bcrypt = require('bcryptjs');
const fs = require('fs');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const product_url = async (req,res,next) => {
    try{
    if(req.query.filtersByBrand==null){
        const markalar1 = await Urun.find({product_category3: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20);
        if(markalar1.length==0){
            var markalar = await Urun.find({product_category2: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20);        
            if (markalar.length == 0){
                const markalar2 = await Urun.find({product_category: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20);
                res.json(markalar2)
            }
            else{
                res.json(markalar)
            }
        }
        else{
            res.json(markalar1)
        }
    }
    else{
        if(req.query.filtersByBrand!=undefined){
            let istenenmarka = req.query.filtersByBrand.split(',')
            var markalar = []
            for(let i = 0;i<istenenmarka.length;i++){
                let aranankelime = {
                    product_marka: {"$regex": istenenmarka[i], $options: 'i' }
                }    
                markalar.push(aranankelime)
            }
            var productList = await Urun.find({$and: [{$or: [ {product_marka:{"$regex": req.params.kategoriler, $options: 'i' } },{product_category2:{"$regex": req.params.kategoriler, $options: 'i' } },{product_category3:{"$regex": req.params.kategoriler, $options: 'i' } } ]}],$or: markalar}).skip((req.query.pg*20)-20).limit(20)
        }
        else{
            var productList = await Urun.find({$and: [{$or: [ {product_marka:{"$regex": req.params.kategoriler, $options: 'i' } },{product_category2:{"$regex": req.params.kategoriler, $options: 'i' } },{product_category3:{"$regex": req.params.kategoriler, $options: 'i' } } ]}],$or: markalar}).skip((req.query.pg*20)-20).limit(20)
        }

        res.json(productList)
            }
    }
    catch (err) {
        console.log(err)
    }
};
const filters = async(req,res,next) => {
    try{
        if(req.query.searchKey==undefined){
            const markalar1 = await Urun.find({product_category3: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20).sort({ product_name: 1 }).collation({ locale: "tr", caseLevel: true });
            var markalar1sirala = markalar1
            if(markalar1.length==0){
                var markalar = await Urun.find({product_category2: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20).sort({ product_name: 1 }).collation({ locale: "tr", caseLevel: true });;        
                if (markalar.length == 0){
                    const markalar2 = await Urun.find({product_category: req.params.kategoriler}).skip((req.query.pg*20)-20).limit(20).sort({ product_name: 1 }).collation({ locale: "tr", caseLevel: true });;
                    res.json(markalar2)
                }
                else{
                    res.json(markalar)
                }
            }
            else{
                res.json(markalar1sirala)
            }
        }
    }
    catch{

    }


}
const aramagoster = async(req,res,next) =>{
    let arananurun = req.params.kelime.split(' ')
    let aranan = []
    for(let i = 0;i<arananurun.length;i++){
        let aranankelime = {
            product_name: {"$regex": arananurun[i], $options: 'i' }
        }
        aranan.push(aranankelime)
    }
    const productList = await Urun.find({$or: [ {product_marka:{"$regex": req.params.kelime, $options: 'i' } },{product_category2:{"$regex": req.params.kelime, $options: 'i' } },{product_category3:{"$regex": req.params.kelime, $options: 'i' } },{$and: aranan} ]}).sort( { timestamp : -1 } ).limit(5)
    res.json(productList)
}
const aramasayfa2 = async(req,res,next) =>{
    let arananurun = req.params.aranan.split(' ')
    let aranan = []
    for(let i = 0;i<arananurun.length;i++){
        let aranankelime = {
            product_name: {"$regex": arananurun[i], $options: 'i' }
        }
        aranan.push(aranankelime)
    }
    if(req.query.filtersByBrand!=undefined){
        let istenenmarka = req.query.filtersByBrand.split(',')
        var markalar = []
        for(let i = 0;i<istenenmarka.length;i++){
            let aranankelime = {
                product_marka: {"$regex": istenenmarka[i], $options: 'i' }
            }    
            markalar.push(aranankelime)
        }
        if(req.query.pg!=1){
            var productList = await Urun.find({$and: [{$or: [{product_category:{"$regex": req.params.aranan, $options: 'i' } },{product_marka:{"$regex": req.params.aranan, $options: 'i' } },{product_category2:{"$regex": req.params.aranan, $options: 'i' } },{product_category3:{"$regex": req.params.aranan, $options: 'i' } },{$and: aranan} ]}],$or: markalar}).skip((req.query.pg*20)-20).limit(20)
        }
    }
    else{
        var productList = await Urun.find({$or: [ {product_category:{"$regex": req.params.aranan, $options: 'i' } },{product_marka:{"$regex": req.params.aranan, $options: 'i' } },{product_category2:{"$regex": req.params.aranan, $options: 'i' } },{product_category3:{"$regex": req.params.aranan, $options: 'i' } },{$and: aranan} ]}).skip((req.query.pg*20)-20).limit(20)
    }

    res.json(productList)
}
/* Gerekirse Açılacak Markaların Hangi Kategoride Kaç Tane olduğunu Hesaplar
const urunleriayir = async(req,res,next) =>{
    try{
        fucntion trtoen() {
            return this.replaceAll("Ç","C")
            .replaceAll("ç","c")
            .replaceAll("Ğ","G")
            .replaceAll("ğ","g")
            .replaceAll("İ","I")
            .replaceAll("ı","i")
            .replaceAll("Ö","O")
            .replaceAll("ö","o")
            .replaceAll("Ş","S")
            .replaceAll("ş","s")
            .replaceAll("Ü","U")
            .replaceAll("ü","u")
            .replaceAll("-","-")
            .replaceAll("_","-")
            .replaceAll("&","ve")
            .replaceAll("'","")
            .replaceAll(" ","-")
            .replaceAll("/","-")
            .replaceAll("!","")
            .replaceAll("+","-")
            .replaceAll(",","")
            .replaceAll(".","")
            .replaceAll("*","");
        };
        var liste2 = []
        var list = []
        const BrandListGenel = ["Peyzaj ve Mermer Grubu"] 
        for(let i =0;i<BrandListGenel.length;i++){
            var liste1 = []
            var list = []
            var ilkliste = await Urun.find({product_category: BrandListGenel[i]})
            for(let i =0;i<ilkliste.length;i++){
                list.push((ilkliste[i].product_marka).toString())
                liste1.push((ilkliste[i].product_category2).toString())
            }       
            const BrandList = [...new Set(list)] 
            const Category_List1 = [...new Set(liste1)]
            for(let i =0;i<BrandList.length;i++){
                const count = ilkliste.filter(element => element.product_marka === BrandList[i]).length;
                BrandList[i] = BrandList[i]+':'+count
            }
            const bilgiler = {
                Category_Name : "Peyzaj ve Mermer",
                Brands: BrandList
            }
            const yenikullanici = new Marka(
                bilgiler
            );
            await yenikullanici.save();
            for(let i = 0;i<Category_List1.length;i++){
                var list = []
                var liste2 = []
                var Category_List2 = []
                var ikinciliste = await Urun.find({product_category2: Category_List1[i]})
                for(let i =0;i<ikinciliste.length;i++){
                    list.push((ikinciliste[i].product_marka).toString())
                    liste2.push((ikinciliste[i].product_category3).toString())
                }       
                const BrandList2 = [...new Set(list)] 
                var Category_List2 = [...new Set(liste2)]
                for(let i =0;i<BrandList2.length;i++){
                    const count = ikinciliste.filter(element => element.product_marka === BrandList2[i]).length;
                    BrandList2[i] = BrandList2[i]+':'+count
                }
                const bilgiler2 = {
                    Category_Name2 : Category_List1[i],
                    Brands: BrandList2
                }
                const yenikullanici = new Marka(
                    bilgiler2
                );
                await yenikullanici.save();
                if (Category_List2){
                    for(let i = 0;i<Category_List2.length;i++){
                        var list = []
                        var ucunculiste = await Urun.find({product_category3: Category_List2[i]})
                        for(let i =0;i<ucunculiste.length;i++){
                            list.push((ucunculiste[i].product_marka).toString())
                        }       
                        const BrandList3 = [...new Set(list)] 
                        for(let i =0;i<BrandList3.length;i++){
                            const count = ucunculiste.filter(element => element.product_marka === BrandList3[i]).length;
                            BrandList3[i] = BrandList3[i]+':'+count
                        }
                        const bilgiler3 = {
                            Category_Name3 : Category_List2[i],
                            Brands: BrandList3
                        }
                        const yenikullanici = new Marka(
                            bilgiler3
                        );
                        await yenikullanici.save();
                    }
                    }
                }         
        }
    }
    catch(err){
        console.log(err)
    }
}
*/
const ProductFilter = async(req,res,next) => {
    let aranan = req.query.searchKey
    //Aranan Kelime Filtresi
    let arananurun = aranan.split(' ')
    let aranans = []
    for(let i = 0;i<arananurun.length;i++){
        let aranankelime = {
            product_name: {"$regex": arananurun[i], $options: 'i' }
        }    
        aranans.push(aranankelime)
    }
    //Markaların Filtresi
    let istenenmarka = req.query.filtersByBrand.split(',')
    let markalar = []
    for(let i = 0;i<istenenmarka.length;i++){
        let aranankelime = {
            product_marka: {"$regex": istenenmarka[i], $options: 'i' }
        }    
        markalar.push(aranankelime)
    }
    const productList = await Urun.find({$and: [{$or: [ {product_category:{"$regex": aranan, $options: 'i' } },{product_marka:{"$regex": aranan, $options: 'i' } },{product_category2:{"$regex": aranan, $options: 'i' } },{product_category3:{"$regex": aranan, $options: 'i' } },{$and: aranans} ]}],$or: markalar}).skip((req.query.pg*20)-20).limit(20)
    res.json(productList)
};
const fiyatagorelisteleSatici = async (req,res,next) => {
    try{
        /* http://localhost:8080/siralafiyatagore?sirala=fiyatagore&ProductName=weberkol%20serakol */
        const UrunAdi = req.query.ProductName
        console.log(UrunAdi)
        const urunbul = await Urun.find({product_url: UrunAdi})
        const urunler = []
        if(req.query.sirala == "fiyatagoreartan"){
            const satanlar = urunbul[0].product_seller
            satanlar.sort(function(a, b) {
                var aMid = a.price;
                var bMid = b.price;
                return aMid - bMid;
            });
            for(let i=0; i < satanlar.length;i++){
                const urun = await User.find({dukkanurl: satanlar[i].seller_url})
                urun.push(satanlar[i].price)
                urun.push(satanlar[i].stock)
                if(urun == ![] || urun[i] == undefined){
                }
                else{
                    urunler.push(urun)
                }
            }
            res.json(urunler);
        }
        if(req.query.sirala == "fiyatagoreazalan"){
            const satanlar = urunbul[0].product_seller;
            satanlar.sort(function(a, b) {
            var aMid = a.price;
            var bMid = b.price;
            return bMid - aMid; // büyükten küçüğe sıralama
            });
            for (let i = 0; i < satanlar.length; i++) {
                const urun = await User.find({ dukkanurl: satanlar[i].seller_url });
                urun.push(satanlar[i].price);
                urun.push(satanlar[i].stock);
                if (urun == ![] || urun[i] == undefined) {
                } else {
                    urunler.push(urun);
                }
            }
            res.json(urunler);
        }
        if(req.query.sirala == "sortA-Z"){
            const satanlar = urunbul[0].product_seller;
            satanlar.sort(function(a, b) {
            var aMid = a.seller_Name.trim().toUpperCase().replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
            var bMid = b.seller_Name.trim().toUpperCase().replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
            if (aMid < bMid) {
                return -1;
            }
            if (aMid > bMid) {
                return 1;
            }
            return 0;
            });
            for (let i = 0; i < satanlar.length; i++) {
            const urun = await User.find({ dukkanurl: satanlar[i].seller_url });
            urun.push(satanlar[i].price);
            urun.push(satanlar[i].stock);
            if (urun == ![] || urun[i] == undefined) {
            } else {
            urunler.push(urun);
            }
            }
            res.json(urunler);
        }
        if(req.query.sirala == "sortZ-A"){
            const satanlar = urunbul[0].product_seller;
            satanlar.sort(function(a, b) {
            var aMid = a.seller_Name.trim().toUpperCase().replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
            var bMid = b.seller_Name.trim().toUpperCase().replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/İ/g, 'I').replace(/Ö/g, 'O').replace(/Ç/g, 'C');
            if (aMid < bMid) {
                return -1;
            }
            if (aMid > bMid) {
                return 1;
            }
            return 0;
            });
            for (let i = 0; i < satanlar.length; i++) {
            const urun = await User.find({ dukkanurl: satanlar[i].seller_url });
            urun.push(satanlar[i].price);
            urun.push(satanlar[i].stock);
            if (urun == ![] || urun[i] == undefined) {
            } else {
            urunler.push(urun);
            }
            }
            res.json(urunler.reverse());
        }
        if(req.query.sirala == "default"){
            const satanlar = urunbul[0].product_seller
            for(let i=0; i < satanlar.length;i++){
                const urun = await User.find({dukkanurl: satanlar[i].seller_url})
                urun.push(satanlar[i].price)
                urun.push(satanlar[i].stock)
                if(urun == ![] || urun[i] == undefined){
                }
                else{
                    urunler.push(urun)
                }
            }
            res.json(urunler);
        }
        if(req.query.sirala == "City"){
            const satanlar = urunbul[0].product_seller;      
            const saticilar = satanlar.filter(function(satici) {
                return satici.seller_City === req.query.City;
            });
            for(let i=0; i < saticilar.length;i++){
                const urun = await User.find({dukkanurl: saticilar[i].seller_url})
                urun.push(saticilar[i].price)
                urun.push(saticilar[i].stock)
                if(urun == ![] || urun[i] == undefined){
                }
                else{
                    urunler.push(urun)
                }
            }
            res.json(urunler);

        }

    }
    catch (err){
        console.log(err)
    }
};
const FilterPoints = async (req,res,next) => {
    try{
        if(req.query.searchKey==undefined){
            const markalar1 = await Urun.find({ product_category3: req.params.kategoriler }).sort({ avarage: -1 }).skip((req.query.pg * 20) - 20).limit(20)
            var markalar1sirala = markalar1
            if(markalar1.length==0){
                var markalar = await Urun.find({product_category2: req.params.kategoriler }).sort({ avarage: -1 }).skip((req.query.pg*20)-20).limit(20);        
                if (markalar.length == 0){
                    const markalar2 = await Urun.find({product_category: req.params.kategoriler}).sort({ avarage: -1 }).skip((req.query.pg*20)-20).limit(20);
                    res.json(markalar2)
                }
                else{
                    res.json(markalar)
                }
            }
            else{
                res.json(markalar1sirala)
            }
        }
    }
    catch (err){
        console.log(err)
    }
}
const FilterPrice = async (req,res,next) => {
    try{
        if(req.query.searchKey==undefined){
            const markalar1 = await Urun.find({ product_category3: req.params.kategoriler }).sort({ Product_Price: -1 }).skip((req.query.pg * 20) - 20).limit(20)
            var markalar1sirala = markalar1
            if(markalar1.length==0){
                var markalar = await Urun.find({product_category2: req.params.kategoriler }).sort({ Product_Price: -1 }).skip((req.query.pg*20)-20).limit(20);        
                if (markalar.length == 0){
                    const markalar2 = await Urun.find({product_category: req.params.kategoriler}).sort({ Product_Price: -1 }).skip((req.query.pg*20)-20).limit(20);
                    res.json(markalar2)
                }
                else{
                    res.json(markalar)
                }
            }
            else{
                res.json(markalar1sirala)
            }
        }
    }
    catch (err){
        console.log(err)
    }
}
const FilterAtShop = async (req,res,next) => {
    try{
        const UserFind = await User.findOne({ dukkanurl: req.query.url });
        const ProductList = UserFind.dukkanurunleri;
        const filteredProducts = ProductList.filter((product) => {
            const regex = new RegExp(req.query.aranan, "gi");
            return product.product_title.match(regex);
        });
        res.json(filteredProducts);

    }
    catch (err){
        console.log(err)
    }
}
const FilterBrandAtShop = async (req,res,next) => {
    try{
        const UserFind = await User.findOne({ dukkanurl: req.query.url });
        const ProductList = UserFind.dukkanurunleri;
        let filteredProducts = [];

        for (let i = 0; i < (req.query.filtersByBrand).split(',').length; i++) {
            const regex = new RegExp((req.query.filtersByBrand).split(',')[i], "gi");
            const productsByBrand = ProductList.filter((product) => product.product_brand.match(regex));
            filteredProducts = filteredProducts.concat(productsByBrand);
        }

        res.json(filteredProducts);

    }
    catch (err){
        console.log(err)
    }
}
const FilterSearchText = async (req,res,next) => {
    try{
        switch(req.body.kategoriNo){
            case "1":
                var UrunFind = await Urun.find({$and : [{product_category: req.body.kategoriName},{product_name: {"$regex": req.body.aranan, $options: 'i' }}]})
                res.json(UrunFind)
                break;
            case "2":
                var UrunFind = await Urun.find({$and : [{product_category2: req.body.kategoriName},{product_name: {"$regex": req.body.aranan, $options: 'i' }}]})
                res.json(UrunFind)
                break;
            case "3": 
            var UrunFind = await Urun.find({$and : [{product_category3: req.body.kategoriName},{product_name: {"$regex": req.body.aranan, $options: 'i' }}]})
                res.json(UrunFind)
                break;  
        }
    }
    catch (err){
        console.log()
    }
}
const FilterCityCountry = async (req,res,next) => {
    try{
        const data = req.body.data
        const responseSend = []
        const UrunUrl = req.body.UrunUrl
        const FindDukkan = await Urun.findOne({product_url: UrunUrl})
        const SellerList = FindDukkan.product_seller
        function filterProductsByCityAndTown(data, products) {
            const filteredProducts = [];
          
            data.forEach(filter => {
              const filteredCity = filter.City;
              const filteredCountry = filter.Country;
          
              if (filteredCountry.length === 0) {
                products.forEach(product => {
                  const sellerCity = product.seller_City.split(':')[1];
                  
                  if (filteredCity === sellerCity) {
                    filteredProducts.push(product);
                  }
                });
              } else {
                products.forEach(product => {
                  const sellerCity = product.seller_City.split(':')[1];
                  const sellerTown = product.seller_Town;
                  
                  if (filteredCity === sellerCity && filteredCountry.includes(sellerTown)) {
                    filteredProducts.push(product);
                  }
                });
              }
            });
          
            return filteredProducts;
          }
          
        const filteredProducts = filterProductsByCityAndTown(data, SellerList);
        for(let i = 0;i<filteredProducts.length;i++){
            const FindUserx = await User.findOne({dukkanurl:filteredProducts[i].seller_url})
            responseSend[i] = [];
            responseSend[i][0] = FindUserx
            responseSend[i][1] = filteredProducts[i].price
            responseSend[i][2] = filteredProducts[i].stock
        }
        res.json(responseSend)

    }
    catch (err){
        console.log(err)
    }
}
const FilterCityCountrySearch = async (req,res,next) =>{
    try{
        const SearchedValue = req.body.data
        const Cities = []
        const Country = []
        SearchedValue.forEach(element => {
            Cities.push({dukkanili:{ "$regex": element.City, $options: 'i' }})
            element.Country.forEach(element => {
                Country.push({dukkanilcesi:{ "$regex": element, $options: 'i' }})
            });
        });
        if(Country.length > 0){
            var Value = await User.find({$and:[{userid: "3"},{$or: Cities},{$or: Country},{dukkanadi:{ "$regex": req.body.aranan, $options: 'i' }}]})
        }
        else{
            var Value = await User.find({$and:[{userid: "3"},{$or: Cities},{dukkanadi:{ "$regex": req.body.aranan, $options: 'i' }}]})
        }
        res.json(Value)
    }
    catch (err){
        console.log(err)
    }
}
const FilterCityCountrySearchMeslek = async (req,res,next) =>{
    try{
        const SearchedValue = req.body.data
        const Cities = []
        const Country = []
        SearchedValue.forEach(element => {
            Cities.push({Meslek_City:{ "$regex": element.City, $options: 'i' }})
            element.Country.forEach(element => {
                Country.push({Meslek_Country:{ "$regex": element, $options: 'i' }})
            });
        });
        if(Country.length > 0){
            var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{$or: Country},{$or: [{isim:{ "$regex": req.body.aranan, $options: 'i' }},{soyisim:{ "$regex": req.body.aranan, $options: 'i' }}]}]})
        }
        else{
            var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{$or: [{isim:{ "$regex": req.body.aranan, $options: 'i' }},{soyisim:{ "$regex": req.body.aranan, $options: 'i' }}]}]})
        }
        res.json(Value)
    }
    catch (err){
        console.log(err)
    }
}
const FilterCityCountrySearchMeslekKategori = async (req,res,next) =>{
    try{
        const SearchedValue = req.body.data
        const Cities = []
        const Country = []
        SearchedValue.forEach(element => {
            Cities.push({Meslek_City:{ "$regex": element.City, $options: 'i' }})
            element.Country.forEach(element => {
                Country.push({Meslek_Country:{ "$regex": element, $options: 'i' }})
            });
        });
        if(Country.length > 0){
            var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{$or: Country},{Meslek_SubCategory: req.body.kategori}]})
            if(Value.length == 0){
                var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{$or: Country},{Meslek_Category: req.body.kategori}]})
            }
        }
        else{
            var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{Meslek_SubCategory: req.body.kategori}]})
            if(Value.length == 0){
                var Value = await User.find({$and:[{userid: "5"},{$or: Cities},{$or: Country},{Meslek_Category: req.body.kategori}]})
            }

        }
        res.json(Value)
    }
    catch (err){
        console.log(err)
    }
}
module.exports = {
    aramasayfa2,
    ProductFilter,
    fiyatagorelisteleSatici,
    FilterCityCountry,
    product_url,
    FilterBrandAtShop,
    FilterPoints,
    FilterPrice,
    FilterCityCountrySearch,
    FilterSearchText,
    FilterAtShop,
    FilterCityCountrySearchMeslek,
    FilterCityCountrySearchMeslekKategori,
    aramagoster,
    filters,
};