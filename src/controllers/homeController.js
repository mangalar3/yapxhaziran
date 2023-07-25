const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/yapxUserModel');
const Urun = require('../models/urunler');
const Marka = require('../models/markaModel');
const Messages = require('../models/messagesModel');
const Forgetten = require('../models/Forgetten');
const Categories = require('../models/Categories');
const MeslekCategories = require('../models/meslekCategories');
const bcrypt = require('bcryptjs');
const fs = require('fs');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');
require('dayjs/locale/tr'); // Türkçe dil dosyasını yükleyin
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('tr');
// GET
const IsDecoded = async (req,res,next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            next()
        }
        else{
            res.redirect('/giris')
        }
    })
    }
    catch (err){
        console.log(err)
    }
}
const homeYonlendirme = async (req, res, next) => {
    res.redirect('/anasayfa')

};
const homeShow = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await Urun.find({ banner: '1' }).sort({ timestamp: -1 }).limit(10);
        const productList = await Urun.find({ active: '1' }).sort({ timestamp: -1 }).skip(Math.random() * 7000).limit(50);
        const encokarananurunler = []
        const encokoyalanurunler = await Urun.find({ urun_oysayisi: { $gt: 0 } }).sort({ timestamp: -1 }).limit(25);
        const aranan = await Urun.find({ tiklanmasayisi: { $gt: 1 } }).sort({ timestamp: -1 }).limit(25)
        const Product_WishListCounter = await Urun.find({ Product_WishListCounter: { $gt: 0 } }).sort({ timestamp: -1 }).limit(16)
        for (let i = aranan.length; i > (aranan.length) - 21; i--) {
            if (aranan[i] == undefined) {

            }
            else {
                encokarananurunler.push(aranan[i])
            }
        }
        const urunler = []
        const urunler2 = []
        const urunler3 = []
        const urunler4 = []
        const urunler5 = []
        for (let i = 0; i < 6; i++) {
            urunler.push(productList[i])
        }
        for (let i = 0; i < 4; i++) {
            urunler2.push(productList[i])
            urunler3.push(productList[i + 4])
            urunler4.push(productList[i + 8])
        }
        for (let i = 0; i < 12; i++) {
            urunler5.push(productList[i])
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/anasayfa', { layout: '../layouts/logged', title: `Yapx | Anasayfa`, description: ``, keywords: ``, banner, urunler, urunler2, urunler3, urunler4, urunler5, myacc, encokoyalanurunler, encokarananurunler, Product_WishListCounter })

            } else {
                const myacc = false
                res.render('user/anasayfa', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Anasayfa`, description: ``, keywords: ``, banner, urunler,myacc, urunler2, urunler3, urunler4, urunler5, encokoyalanurunler, encokarananurunler, Product_WishListCounter })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const MeslekRegisterGet = async (req, res, next) => {
    try {
        try {
            const token = req.cookies.usertoken;
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.redirect('/')
                } else {
                    res.render('user/MeslekKayitol', { layout: '../layouts/login', title: `Yapx | Meslek Kayıt OL`, description: ``, keywords: `` })
                }
            })

        } catch (err) {
            console.log(err);
            res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
        }
    }
    catch (err) {
        console.log(err)
    }
}
const dortyuzdort = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/404', { layout: '../layouts/logged', title: `Yapx | 404`, description: ``, keywords: `` })
            } else {
                res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | 404`, description: ``, keywords: `` })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const mesajlarim = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const array = myacc[0].Messages_List;
        const reversedArray = array.reverse();

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/mesajlarim', { layout: '../layouts/logged', title: `Yapx | Mesajlar`, description: ``, keywords: ``, myacc, reversedArray })
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const messagePage = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const messages = await Messages.find({ Message_ID: req.query.id });
        const array = messages[0].Message_Content;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                if (messages[0].Message_Creater == myacc[0].email || messages[0].Message_Receiver == myacc[0].email) {
                    if (messages[0].Message_Creater == myacc[0].email) {
                        var UserInfo = await User.find({ email: messages[0].Message_Receiver })
                    }
                    else {
                        var UserInfo = await User.find({ email: messages[0].Message_Creater })
                    }
                    const arr = myacc[0].Messages_List
                    const index = arr.findIndex(item => item.includes(req.query.id));
                    if (index !== -1) { // eğer öğe bulunduysa
                        // Mesaj Gönderilen
                        const kontrolEdilecekEleman = arr[index]
                        const kontrolEdilecekElemanArray = kontrolEdilecekEleman.split('?:?:?');
                        if (kontrolEdilecekElemanArray[7] == "1") {
                            await User.findByIdAndUpdate(myacc[0]._id, { Unreaded_MessageCount: myacc[0].Unreaded_MessageCount - 1 });
                        }
                        kontrolEdilecekElemanArray[7] = "0";
                        const yeniEleman = kontrolEdilecekElemanArray.join('?:?:?');
                        arr[index] = yeniEleman
                        const bilgiler = {
                            Messages_List: arr,
                        }
                        await User.findByIdAndUpdate(myacc[0]._id, bilgiler);
                        if (messages[0].Last_Sender != myacc[0].email) {
                            await Messages.findByIdAndUpdate(messages[0]._id, { is_Opened: "True" })
                        }

                    }

                    res.render('user/messagePage', { layout: '../layouts/logged', title: `Yapx | Mesajlar`, description: ``, keywords: ``, myacc, messages, array, UserInfo })
                }
                else {
                    res.redirect('/anasayfa')
                }
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}
const kurumsalregister = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');

            } else {
                res.render('user/kurumsalhesap', { layout: '../layouts/login', title: `Yapx | Kurumsal Kayıt`, description: ``, keywords: `` })
            }
        })



    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const isteklistesi = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        if(isNaN(Number(req.query.pg))){
            var pageNumber = 1
        }
        else{
            var pageNumber = Number(req.query.pg)
        }
        const wishListElementCount = myacc[0].wishlist.length
        const wishlist = myacc[0].wishlist.slice((5*pageNumber)-5, (5*pageNumber))
        for(let i = 0;i<wishlist.length;i++){
            const ProductFinder = await Urun.findOne({product_url:wishlist[i].product_url})
            if(ProductFinder.Product_MinimumPrice){
                wishlist[i].Product_MinimumPrice.value = ProductFinder.Product_MinimumPrice.value
            }           
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/isteklistesi', { layout: '../layouts/logged', title: `Yapx | Favori Listesi`, description: ``, keywords: ``, wishlist, myacc,wishListElementCount })
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};

const searchSelect = async (req,res,next) => {
    try{
        if (req.query.aranan == undefined) {
            var aranan = req.body.arama
            if (req.body.arama[0] == 'i') {
                var aranan = req.body.arama.replace(req.body.arama[0], 'İ')
            }
            if (req.body.arama[0] == 'ü') {
                var aranan = req.body.arama.replace(req.body.arama[0], 'Ü')
            }
            if (req.body.arama[0] == 'ç') {
                var aranan = req.body.arama.replace(req.body.arama[0], 'Ç')
            }
            if (req.body.arama[0] == 'ğ') {
                var aranan = req.body.arama.replace(req.body.arama[0], 'Ğ')
            }
            if (req.body.arama[0] == 'ö') {
                var aranan = req.body.arama.replace(req.body.arama[0], 'Ö')
            }
        }
        else {
            var aranan = req.query.aranan
        }
        const SearchedValue = req.body.arama
        let arananurun = aranan.split(' ')
        let aranans = []
        for (let i = 0; i < arananurun.length; i++) {
            let aranankelime = {
                product_name: { "$regex": arananurun[i], $options: 'i' }
            }
            aranans.push(aranankelime)
        }
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const UrunCount = await Urun.count({ $or: [{ product_marka: { "$regex": aranan, $options: 'i' } }, { product_category2: { "$regex": aranan, $options: 'i' } }, { product_category3: { "$regex": aranan, $options: 'i' } }, { $and: aranans }] }).sort({ timestamp: -1 })
        const DukkanCount = await User.count({$and: [{userid: "3"},{ dukkanadi: { "$regex": aranan, $options: 'i' } }]})
        const MeslekCount = await User.count({$and: [{userid: "5"},{ $or: [{ isim: { "$regex": aranan, $options: 'i' } },{ soyisim: { "$regex": aranan, $options: 'i' } }]}]})
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/Search/Select', { layout: '../layouts/logged', title: `Yapx | İstek Listesi`, description: ``, keywords: ``,myacc,UrunCount,DukkanCount,MeslekCount,SearchedValue })
            } else {

                res.render('user/Search/Select', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Giriş Yap`, description: ``, keywords: ``,myacc,UrunCount,DukkanCount,MeslekCount,SearchedValue })
            }
        })
    }
    catch (err){
        console.log(err)
    }
}
const arama = async (req, res, next) => {
    try {
        if (req.query.aranan == undefined) {
            var sayfano = 1

        }
        else {
            var sayfano = req.query.aranan

        }
        if (req.query.aranan == undefined) {
            var aranan = req.query.arananDeger
            if (req.query.arananDeger[0] == 'i') {
                var aranan = req.query.arananDeger.replace(req.query.arananDeger[0], 'İ')
            }
            if (req.query.arananDeger[0] == 'ü') {
                var aranan = req.query.arananDeger.replace(req.query.arananDeger[0], 'Ü')
            }
            if (req.query.arananDeger[0] == 'ç') {
                var aranan = req.query.arananDeger.replace(req.query.arananDeger[0], 'Ç')
            }
            if (req.query.arananDeger[0] == 'ğ') {
                var aranan = req.query.arananDeger.replace(req.query.arananDeger[0], 'Ğ')
            }
            if (req.query.arananDeger[0] == 'ö') {
                var aranan = req.query.arananDeger.replace(req.query.arananDeger[0], 'Ö')
            }
        }
        else {
            var aranan = req.query.aranan
        }
        res.clearCookie('arama');
        res.cookie('arama', aranan, { expires: new Date(Date.now() + 900000) });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let sayfalar = []
        const list = []
        let arananurun = aranan.split(' ')
        let aranans = []
        for (let i = 0; i < arananurun.length; i++) {
            let aranankelime = {
                product_name: { "$regex": arananurun[i], $options: 'i' }
            }
            aranans.push(aranankelime)
        }
        if (req.query.q == 'urunara' || req.query.searchKey == "urun") {
            res.clearCookie('aranan');
            res.cookie('aranan', 'urunara', { expires: new Date(Date.now() + 900000) })
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": aranan, $options: 'i' } }, { product_category2: { "$regex": aranan, $options: 'i' } }, { product_category3: { "$regex": aranan, $options: 'i' } }, { $and: aranans }] }).sort({ timestamp: -1 }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.query.arananDeger + ':' + (i + 1) + ':' + sayfano)
                        }
                        for (let i = 0; i < Product.length; i++) {
                            list.push((Product[i].product_marka).toString())
                        }
                        const filteredkategorilist2 = [...new Set(list)]
                        for (let i = 0; i < filteredkategorilist2.length; i++) {
                            const count = Product.filter(element => element.product_marka === filteredkategorilist2[i]).length;
                            filteredkategorilist2[i] = filteredkategorilist2[i] + ':' + count
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar, filteredkategorilist2, aranan })
                    })

                } else {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": aranan, $options: 'i' } }, { product_category2: { "$regex": aranan, $options: 'i' } }, { product_category3: { "$regex": aranan, $options: 'i' } }, { $and: aranans }] }).sort({ timestamp: -1 }).then(async Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.query.arananDeger + ':' + (i + 1) + ':' + sayfano)
                        }
                        for (let i = 0; i < Product.length; i++) {
                            list.push((Product[i].product_marka).toString())
                        }
                        const filteredkategorilist2 = [...new Set(list)]
                        for (let i = 0; i < filteredkategorilist2.length; i++) {
                            const count = Product.filter(element => element.product_marka === filteredkategorilist2[i]).length;
                            filteredkategorilist2[i] = filteredkategorilist2[i] + ':' + count
                        }
                        const myacc = false
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar,myacc, filteredkategorilist2, aranan })
                    })
                }
            })
        }
        if (req.query.q == 'dukkanara' || req.query.searchKey == "dukkan") {
            res.clearCookie('aranan');
            res.cookie('aranan', 'dukkanara', { expires: new Date(Date.now() + 900000) })
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({$and: [{userid: "3"},{ dukkanadi: { "$regex": aranan, $options: 'i' } }]}).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'dukkanara/' + req.query.arananDeger + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/dukkanarama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar, filteredkategorilist2, aranan })
                    })

                } else {
                    const productList = await User.find({ dukkanadi: { "$regex": aranan, $options: 'i' } }).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'dukkanara/' + aranan + ':' + (i + 1) + ':' + sayfano)
                        }
                        const myacc = false
                        res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar,myacc, filteredkategorilist2, aranan })
                    })
                }
            })
        }
        if (req.query.q == 'meslekara' || req.query.searchKey == "meslek") {
            res.clearCookie('aranan');
            res.cookie('aranan', 'dukkanara', { expires: new Date(Date.now() + 900000) })
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({$and: [{userid: "5"},{ $or: [{ isim: { "$regex": aranan, $options: 'i' } },{ soyisim: { "$regex": aranan, $options: 'i' } }]}]}).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'dukkanara/' + req.query.arananDeger + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/meslekarama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar, filteredkategorilist2, aranan })
                    })

                } else {
                    const productList = await User.find({$and: [{userid: "5"},{ $or: [{ isim: { "$regex": aranan, $options: 'i' } },{ soyisim: { "$regex": aranan, $options: 'i' } }]}]}).then(Product => {
                        const filteredkategorilist2 = ['1']
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'dukkanara/' + aranan + ':' + (i + 1) + ':' + sayfano)
                        }
                        const myacc = false
                        res.render('user/meslekarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar,myacc, filteredkategorilist2, aranan })
                    })
                }
            })

        }

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const aramasayfa = async (req, res, next) => {
    try {
        if (req.params.ara == undefined) {
            var sayfano = 1
        }
        else {
            var sayfano = Number(req.params.ara.split(':')[1])
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        let sayfalar = []
        const list = []
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let arananurun = req.params.ara.split(':')[0].split(' ')
        let aranans = []
        for (let i = 0; i < arananurun.length; i++) {
            let aranankelime = {
                product_name: { "$regex": arananurun[i], $options: 'i' }
            }
            aranans.push(aranankelime)
        }
        if (req.params.aramasayfa == 'urunara') {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_category2: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_category3: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { $and: aranans }] }).sort({ timestamp: -1 }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.query.aranan + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_category2: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_category3: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { $and: aranans }] }).sort({ timestamp: -1 }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.params.ara.split(':')[0] + ':' + (i + 1) + ':' + sayfano)
                        }
                        for (let i = 0; i < Product.length; i++) {
                            list.push((Product[i].product_marka).toString())
                        }
                        const filteredkategorilist2 = [...new Set(list)]
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar, filteredkategorilist2 })
                    })
                }
            })
        }
        else {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ dukkanadi: { "$regex": req.query.aranan, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.query.aranan + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    const productList = await User.find({ dukkanadi: { "$regex": req.query.aranan, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.query.aranan + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar })
                    })
                }
            })
        }

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const sifremiunuttum = async (req, res, next) => {
    try {

        res.render('user/sifremiunuttum', { layout: '../layouts/login', title: `Şifremi Unuttum`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const sifremiunuttumcode = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/HomePage', { layout: '../layouts/logged', title: `Yapx | Giriş`, description: ``, keywords: `` })
            } else {
                res.render('user/sifremiunuttumcode', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitolcodeget = async (req, res, next) => {
    try {


        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/HomePage', { layout: '../layouts/logged', title: `Yapx | Giriş`, description: ``, keywords: `` })
            } else {
                res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Kayit Ol`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const MeslekKayitol = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/')
            } else {
                res.render('user/MeslekKayitol', { layout: '../layouts/login', title: `Yapx | Kayıt Ol`, description: ``, keywords: `` })
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}
const meslekPage = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const MeslekUser = await User.findOne({ Meslek_URL: req.query.id })
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/meslekPage', { layout: '../layouts/logged', title: `Yapx | Meslek Page`, description: ``, keywords: ``, myacc, MeslekUser })
            } else {
                const myacc = false
                res.render('user/meslekPage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Meslek Page`, description: ``, keywords: ``, MeslekUser,myacc })
            }
        })

    }
    catch (err) {
        console.log(err)
    }
}
const kayitolcodepost = async (req, res, next) => {
    try {
        const dogrulamakodu = await User.find({ dogrulama_token: req.cookies.dogrulamatoken })
        const SifreVarmi = await User.find(dogrulamakodu[0]);
        const Sifrelegal = SifreVarmi[0].verfication_number;
        if (Sifrelegal == req.body.code) {
            const data = {
                time: Date(),
                email: SifreVarmi[0].email,
            }
            const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

            res.clearCookie('usertoken');
            res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
            const token = ('usertoken', jwtToken);
            const numberdb = {
                usertoken: token
            }
            const uyeBilgileri = await User.find({ dogrulama_token: req.cookies.dogrulamatoken })
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
            res.clearCookie('dogrulamatoken');
            res.redirect('/')
        }
        else {
            console.log('Sifre Yanlis')
        }
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const giris = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitbasarili = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/girisSecim', { layout: '../layouts/kayitbasarili', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const meslekkayitbasarili = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/girisSecim', { layout: '../layouts/meslekkayitbasarili', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};


const girisSecim = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/girisSecim', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitolSecim = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/');
            } else {
                res.render('user/kayitolSecim', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitol = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.redirect('/')
            } else {
                res.render('user/kayitol', { layout: '../layouts/login', title: `Yapx | Kayıt Ol`, description: ``, keywords: `` }) //abcdefg
            }
        })

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` })
    }
};
const urundetaylari = async (req, res, next) => {
    try {
        const params = req.params.urunno;
        const urunler = []
        const Product = await Urun.find({ product_url: params }).sort({ timestamp: -1 });
        const urunss = await Urun.find({ product_category2: Product[0].product_category2 }).limit(6);
        for (let i = 0; i < Product[0].product_seller.length; i++) {
            const urun = await User.find({ dukkanurl: Product[0].product_seller[i].seller_url })
            urun.push(Product[0].product_seller[i].price)
            urun.push(Product[0].product_seller[i].stock)
            if (urun == ![] || urun[i] == undefined) {
            }
            else {
                urunler.push(urun)
            }
        }
        const satansayisi = urunler.length
        const ozellik = Product[0].product_ozellik.split(/\r?\n/);
        const urunno = req.params.urunno;
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const star = Product[0].product_star
        let starav = 0
        for (let i = 0; i < star.length; i++) {
            starav = Number(star[i]) + Number(starav)
        }
        let avarage = Math.ceil(starav / star.length);
        const av = {
            avarage: isNaN(avarage) ? 0 : avarage
        };
        await Urun.findByIdAndUpdate(Product[0]._id, av);
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        if (myacc.length == 0) {
            myacc[0] = {
                userid: "0"
            }
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                if (Product[0].tiklanmasayisi) {
                    var uruntiklanmasayisi = {
                        tiklanmasayisi: (Product[0].tiklanmasayisi) + 1
                    }

                }
                else {
                    var uruntiklanmasayisi = {
                        tiklanmasayisi: 1
                    }
                }
                await Urun.findByIdAndUpdate(Product[0]._id, uruntiklanmasayisi);
                const productList = await Urun.find({ product_url: urunno }).then(Product => {
                    const urun_yorum = Product[0].urun_yorum

                    res.render('user/urunpage', { layout: '../layouts/logged', title: `Yapx | Urun Sayfasi`, description: ``, keywords: ``, Product, urun_yorum, avarage, urunler, urunss, myacc, ozellik, satansayisi })
                })
            } else {
                const urun_yorum = Product[0].urun_yorum
                const myacc = false
                res.render('user/urunpage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Urun Sayfasi`, description: ``, keywords: ``, Product, urun_yorum, avarage, urunler, urunss, ozellik, satansayisi, myacc })
            }
        })


    } catch (err) {
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` })
        console.log(err);
    }
};
const hakkimizda = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await Urun.find({ banner: '1' });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const productList = await Urun.find({ active: '1' }).then(Product => {
                    res.render('user/hakkimizda', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                })

            } else {
                const productList = await Urun.find({ active: '1' }).then(Product => {
                    res.render('user/hakkimizda', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product })
                })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const dukkanlar = async (req, res, next) => {
    try {
        if ((await User.find({ dukkanurl: req.params.dukkanlar })) == '') {
            res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
        }
        else {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            const params = req.params.dukkanlar;
            let urunler = []
            const test = await User.find({ dukkanurl: params });
            for (let i = 0; i <= test[0].dukkanurunleri.length; i++) {
                try {
                    let urun = await Urun.find({ product_url: test[0].dukkanurunleri[i].product_url })
                    if (urun == ![] || urun[0] == undefined) {
                    }
                    else {
                        urun.push(test[0].dukkanurunleri[i].price)
                        urun.push(test[0].dukkanurunleri[i].stock)
                        urunler.push(urun)
                    }
                }
                catch {
                }
            }
            const dukkanno = req.params.dukkanlar;
            const productList2 = await User.find({ dukkanurl: dukkanno })
            const star = productList2[0].dukkan_star
            let starav = 0
            for (let i = 0; i < star.length; i++) {
                starav = Number(star[i]) + Number(starav)
            }
            let avarage = Math.ceil(starav / star.length);
            const av = {
                dukkan_av: avarage,
            }
            const x = await User.findByIdAndUpdate(productList2[0]._id, av);
            const token = req.cookies.usertoken;
            const myacc = await User.find({ usertoken: token });
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    if (myacc[0].dukkanurl == req.params.dukkanlar) {
                        const productList = await User.find({ dukkanurl: params }).then(Product => {
                            const Dukkan_RegisterDate = Product[0].createdAt
                            const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                            const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions);
                            const dukkanyorum = productList2[0].dukkanyorum
                            const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                                count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                                return count;
                            }, {});

                            res.render('user/benimdukkanim', { layout: '../layouts/logged', title: `Yapx | ` + myacc[0].dukkanadi, description: ``, keywords: ``, Product, urunler, dukkanyorum, myacc, formatted_Dukkan_RegisterDate, countByBrand })
                        })
                    }
                    else {
                        const productList = await User.find({ dukkanurl: params }).then(Product => {
                            const Dukkan_RegisterDate = Product[0].createdAt
                            const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                            const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions);
                            const dukkanyorum = productList2[0].dukkanyorum
                            const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                                count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                                return count;
                            }, {});
                            res.render('user/dukkanlar', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, urunler, dukkanyorum, myacc, formatted_Dukkan_RegisterDate, countByBrand })
                        })
                    }

                } else {
                    const productList = await User.find({ dukkanurl: params }).then(Product => {
                        const Dukkan_RegisterDate = Product[0].createdAt
                        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
                        const formatted_Dukkan_RegisterDate = new Date(Dukkan_RegisterDate).toLocaleDateString('tr-TR', dateOptions);
                        const dukkanyorum = productList2[0].dukkanyorum
                        const countByBrand = Product[0].dukkanurunleri.reduce((count, product) => {
                            count[product.product_brand] = (count[product.product_brand] || 0) + 1;
                            return count;
                        }, {});
                        const myacc = false
                        res.render('user/dukkanlar', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product,myacc, urunler, dukkanyorum, formatted_Dukkan_RegisterDate, countByBrand })
                    })
                }
            })
        }

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const hesabim = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await User.find({ usertoken: token });
        if (banner[0].userid == '1') {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/hesabim', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                    })

                } else {
                    const productList = await Urun.find({ usertoken: token }).then(Product => {
                        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                    })
                }
            })

        }
        if (banner[0].userid == '5') {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/meslekSettings', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                    })

                } else {
                    const productList = await Urun.find({ usertoken: token }).then(Product => {
                        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                    })
                }
            })
        }
        else {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ usertoken: token }).then(Product => {
                        res.render('user/kurumsalhesabim', { layout: '../layouts/logged', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product, myacc })
                    })

                } else {
                    const productList = await Urun.find({ usertoken: token }).then(Product => {
                        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hakkımızda`, description: ``, keywords: ``, Product })
                    })
                }
            })
        }


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kategoriler = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const KategoriKac = 3
        let kategori = req.params.kategoriler;
        var sayfanumarasi = req.query.pg
        const paramss = Number(sayfanumarasi)
        if (typeof sayfanumarasi == "undefined") {
            kategorisayfa = 0
            sayfanumarasi = 0
        }
        else {
            kategorisayfa = (sayfanumarasi * 20) - 20
        }
        const Product = await Urun.find({ product_category3: { "$regex": kategori, $options: 'i' } }).sort({ timestamp: -1 }).skip(kategorisayfa).limit(20);
        const kategorilist = await Categories.find({ product_category2: Product[0].product_category2 })
        const list = []
        const filteredkategorilist = []
        for (let i = 0; i < kategorilist[0].product_category3.length; i++) {
            filteredkategorilist.push(kategorilist[0].product_category3[i] + ':' + await Urun.count({ product_category3: kategorilist[0].product_category3[i] }))
        }
        var MarkaSayisi = await Marka.find({ Category_Name3: kategori })
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category3 + ':' + Product[0].product_category2 + ':' + Product[0].product_category3);
        const test1 = []
        test1.push(yazi)
        const urunsayisi = await Urun.count({ product_category3: kategori })
        const sayfalar = []
        for (let i = 0; i < parseInt(urunsayisi / 20) + 1; i++) {
            sayfalar.push(kategori.split('?pg=')[0] + '?pg=' + (i + 1))
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product, test1, myacc, filteredkategorilist, sayfalar, urunsayisi, paramss, BrandList, KategoriKac, kategori })

            } else {
                const myacc = false
                res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product, test1,myacc, filteredkategorilist, sayfalar, urunsayisi, paramss, BrandList, KategoriKac, kategori })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kategori = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const kategori = req.params.kategori;
        const paramss = Number(sayfanumarasi)
        const KategoriKac = 2
        var sayfanumarasi = req.query.pg
        if (typeof sayfanumarasi == "undefined") {
            kategorisayfa = 0
            sayfanumarasi = 0
        }
        else {
            kategorisayfa = (sayfanumarasi * 20) - 20
        }
        const Product = await Urun.find({ product_category2: { "$regex": kategori, $options: 'i' } }).sort({ timestamp: -1 }).skip(kategorisayfa).limit(20);
        const kategorilist = await Categories.find({ product_category2: Product[0].product_category2 })
        const list = []
        const filteredkategorilist = []
        for (let i = 0; i < kategorilist[0].product_category3.length; i++) {
            filteredkategorilist.push(kategorilist[0].product_category3[i] + ':' + await Urun.count({ product_category3: kategorilist[0].product_category3[i] }))
        }
        var MarkaSayisi = await Marka.find({ Category_Name2: kategori })
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category2 + ':' + Product[0].product_category2 + ':' + Product[0].product_category3);
        const test1 = []
        test1.push(yazi)
        const urunsayisi = await Urun.count({ product_category2: kategori })
        const sayfalar = []
        for (let i = 0; i < parseInt(urunsayisi / 20) + 1; i++) {
            sayfalar.push(kategori.split('?pg=')[0] + '?pg=' + (i + 1))
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const yazi = Product[0]
                res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product, test1, myacc, filteredkategorilist, sayfalar, urunsayisi, paramss, BrandList, KategoriKac, kategori })

            } else {
                const yazi = Product[0]
                const myacc = false
                res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product,myacc, test1, filteredkategorilist, sayfalar, urunsayisi, paramss, BrandList, KategoriKac, kategori })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const meslekKategoriAlt = async (req, res, next) => {
    try {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const getMeslekKategori = await User.find({ Meslek_SubCategory: req.params.id }).limit(20)
        if(getMeslekKategori.length > 0){
            const getCategories = await MeslekCategories.findOne({ Meslek_Category: getMeslekKategori[0].Meslek_Category })
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.render('user/kategoriMeslek', { layout: '../layouts/logged', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``, myacc, getMeslekKategori, getCategories,meslekKategori:  req.params.id })
                } else {
                    res.render('user/kategoriMeslek', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``, getMeslekKategori, getCategories,meslekKategori:  req.params.id})
                }
            })
        }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.render('user/404', { layout: '../layouts/logged', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``, myacc })
                } else {
                    const myacc = false
                    res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``,myacc })
                }
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
const meslekKategoriUst = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const getMeslekKategori = await User.find({ Meslek_Category: req.params.id }).limit(20)
        if(getMeslekKategori.length > 0){
            const getCategories = await MeslekCategories.findOne({ Meslek_Category: getMeslekKategori[0].Meslek_Category })
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.render('user/kategoriMeslek', { layout: '../layouts/logged', title: `Yapx | Meslek Üst Kategoriler`, description: ``, keywords: ``, myacc, getMeslekKategori, getCategories,meslekKategori:  req.params.id })
                } else {
                    res.render('user/kategoriMeslek', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Meslek Üst Kategoriler`, description: ``, keywords: ``, getMeslekKategori, getCategories,meslekKategori:  req.params.id})
                }
            })
        }
        else{
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.render('user/404', { layout: '../layouts/logged', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``, myacc })
                } else {
                    const myacc = false
                    res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Meslek Alt Kategoriler`, description: ``, keywords: ``,myacc })
                }
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
const anakategori = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const kategori = req.params.kategori;
        const paramss = Number(sayfanumarasi)
        const KategoriKac = 1
        var sayfanumarasi = req.query.pg
        if (typeof sayfanumarasi == "undefined") {
            kategorisayfa = 0
            sayfanumarasi = 0
        }
        else {
            kategorisayfa = (sayfanumarasi * 20) - 20
        }
        if (kategori == "KABA & İNCE YAPI") {
            var duzgunkategori = "Kaba & İnce Yapı"
            var Product = await Urun.find({ product_category: { "$regex": duzgunkategori, $options: 'i' } }).sort({ timestamp: -1 }).skip(kategorisayfa).limit(20);
            var kategorilist = await Categories.find({ product_category: "KABA & İNCE YAPI" })
            var MarkaSayisi = await Marka.find({ Category_Name: duzgunkategori })
        }
        else {
            var Product = await Urun.find({ product_category: { "$regex": kategori, $options: 'i' } }).sort({ timestamp: -1 }).skip(kategorisayfa).limit(20);
            var kategorilist = await Categories.find({ product_category: kategori })
            var MarkaSayisi = await Marka.find({ Category_Name: kategori })
        }
        const list = []
        const filteredkategorilist = []
        for (let i = 0; i < kategorilist.length; i++) {
            filteredkategorilist.push(kategorilist[i].product_category2 + ':' + await Urun.count({ product_category2: kategorilist[i].product_category2 }))
        }
        const BrandList = MarkaSayisi[0].Brands
        const yazi = (Product[0].product_category + ':' + Product[0].product_category + ':' + Product[0].product_category);
        const test1 = []
        test1.push(yazi)
        const urunsayisi = await Urun.count({ product_category2: kategori })
        const sayfalar = []
        for (let i = 0; i < parseInt(urunsayisi / 20) + 1; i++) {
            sayfalar.push(kategori.split('?pg=')[0] + '?pg=' + (i + 1))
        }
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const yazi = Product[0]
                res.render('user/kategori', { layout: '../layouts/logged', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product, test1, myacc, filteredkategorilist, sayfalar, urunsayisi, paramss, BrandList, KategoriKac, kategori })

            } else {
                const yazi = Product[0]
                const myacc = false
                res.render('user/kategori', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Kategoriler`, description: ``, keywords: ``, Product, test1, filteredkategorilist, sayfalar,myacc, urunsayisi, paramss, BrandList, KategoriKac, kategori })
            }
        })


    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekle2 = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded && banner[0].userid == '3') {
                const productList = await User.find({ usertoken: token }).then(Product => {
                    res.render('user/uruneklerim', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``, Product, myacc })
                })

            } else {

                res.redirect('/')

            }
        })
    }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekleurun = async (req, res, next) => {
    try {
        const pg = req.query.pg
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const x = req.params.urunkategori
        let StoreProduct = []
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let StoreProducts = []

        for (let i = 0; i <= myacc[0].dukkanurunleri.length; i++) {
            try {
                let urun = await Urun.find({ product_url: myacc[0].dukkanurunleri[i].product_url })

                if (urun == ![] || urun[0] == undefined) {
                }
                else {
                    urun.push(myacc[0].dukkanurunleri[i].price)
                    urun.push(myacc[0].dukkanurunleri[i].stock)
                    StoreProducts.push(urun)
                    StoreProduct.push(myacc[0].dukkanurunleri[i].product_url)
                }
            }
            catch {
            }
        }
        var cg = req.query.cg == 1 ? '' : req.query.cg;
        const category = "product_category" + cg
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded && myacc[0].userid == '3') {
                const ProductCount = await Urun.count({ [category]: x, product_url: { $nin: StoreProduct } })
                const productList = await Urun.find({ [category]: x, product_url: { $nin: StoreProduct } }).skip((pg * 20) - 20).limit(20).then(Product => {

                    res.render('user/urunekleurun', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``, Product, myacc, StoreProducts, ProductCount })
                })

            } else {

                res.redirect('/giris')

            }
        })
    }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunekleArama = async (req, res, next) => {
    try {

        const pg = req.query.pg
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const x = req.query.q
        const brand = req.query.b
        let StoreProduct = []
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        let StoreProducts = []

        for (let i = 0; i <= myacc[0].dukkanurunleri.length; i++) {
            try {
                let urun = await Urun.find({ product_url: myacc[0].dukkanurunleri[i].product_url })

                if (urun == ![] || urun[0] == undefined) {
                }
                else {
                    urun.push(myacc[0].dukkanurunleri[i].price)
                    urun.push(myacc[0].dukkanurunleri[i].stock)
                    StoreProducts.push(urun)
                    StoreProduct.push(myacc[0].dukkanurunleri[i].product_url)
                }
            }
            catch {
            }
        }

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded && myacc[0].userid == '3') {
                const ProductCount = await Urun.count({ $and: [{ product_name: { "$regex": x, $options: 'i' } }, { product_marka: { "$regex": brand, $options: 'i' } }], product_url: { $nin: StoreProduct } })
                const productList = await Urun.find({ $and: [{ product_name: { "$regex": x, $options: 'i' } }, { product_marka: { "$regex": brand, $options: 'i' } }], product_url: { $nin: StoreProduct } }).skip((pg * 20) - 20).limit(20).then(Product => {

                    res.render('user/urunekleurun', { layout: '../layouts/logged', title: `Yapx | Dükkan Ürün Ekle`, description: ``, keywords: ``, Product, myacc, StoreProducts, ProductCount })
                })

            } else {

                res.redirect('/giris')

            }
        })
    }
    catch (err) {
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const SifremiUnuttumChange = async (req,res,next) => {
    try{
        const FindId = await Forgetten.findOne({ TransactionID: req.query.id})
        if(FindId.firstTime){
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            await Forgetten.findOneAndUpdate(FindId._id,{firstTime: false})
            const token = req.cookies.usertoken
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.redirect('/');
                } else {
                    res.render('user/login/changePasswordForget', { layout: '../layouts/login', title: `Yapx | Şifre Değiştir`, description: ``, keywords: ``,TransactionID: req.query.id })
                }
            })
        }
        else{
            res.redirect('/giris')
        }
    }
    catch (err){
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
}
const getWishList = async (req,res,next) => {
    try{
        const getUser = await User.findOne({usertoken: req.cookies.usertoken})
        if(getUser != undefined){
            res.json({status:true,data:getUser.wishlist})
        }
        else{
            res.json({status:false})
        }
    }
    catch (err) {
        console.log(err)
    }
}

// POST
const urunbul = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded && banner[0].userid == '3') {
                const productList = await User.find({ usertoken: token }).then(Product => {
                    if (req.body.chapter != "") {
                        res.redirect('/urunekle/' + req.body.chapter + '?' + "cg=3&pg=1")
                    }
                    if (req.body.chapter == "" && req.body.topic != "") {
                        res.redirect('/urunekle/' + req.body.topic + '?' + "cg=2&pg=1")
                    }
                    if (req.body.topic == "" && req.body.subject != "") {
                        res.redirect('/urunekle/' + req.body.subject + '?' + "cg=1&pg=1")
                    }
                    if (req.body.subject == "" && req.body.topic == "" && req.body.chapter == "") {
                        res.redirect('/urunekle')
                    }
                })

            } else {

                res.redirect('/')

            }
        })
    }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const urunbulv2 = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;

        const banner = await User.find({ usertoken: token });
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded && banner[0].userid == '3') {
                const productList = await User.find({ usertoken: token }).then(Product => {

                    res.redirect('/urunekleArama?q=' + req.body.aranan + '&b=' + req.body.brand + '&pg=1')
                })

            } else {

                res.redirect('/')

            }
        })
    }
    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const isteklistesiadd = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const isteklistesi = req.params.istek;
        const uyeBilgileri = await User.findOne({ usertoken: token });

        if (!uyeBilgileri.wishlist.some(item => item.product_url.includes(isteklistesi))) {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const ProductFind = await Urun.findOne({ product_url: isteklistesi })
                    const star = {
                        $push: {
                            wishlist: ProductFind
                        },
                    }
                    const WishListAdder = {
                        $push: {
                            Product_WishlistAdder: uyeBilgileri
                        },
                        Product_WishListCounter: ProductFind.Product_WishListCounter + 1
                    }
                    await Urun.findByIdAndUpdate(ProductFind._id, WishListAdder);
                    await User.findByIdAndUpdate(uyeBilgileri._id, star);
                    res.json({status:true})
                } else {
                    res.json({status:false,errMessage:"Giriş Yapınız."})
                }
            })
        }
        else {
            if(uyeBilgileri){
                res.json({status:false,errMessage:"Kullanıcıda Zaten Ekli."})
            }
            else{
                res.json({status:false,errMessage:"Giriş Yapınız."})
            }
            
        }

    }
    catch {
        res.json({status:false,errMessage:"Giriş Yapınız."})
    }
};
const isteklistesiremove = async (req, res, next) => {
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const isteklistesi = req.params.istek;
        const uyeBilgileri = await User.findOne({ usertoken: token });

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            const ProductFind = await Urun.findOne({ product_url: isteklistesi });
            const star = {
                $pull: {
                  wishlist: { _id: ProductFind._id }
                },
              };
              
            const WishListAdder = {
                $pull: {
                    Product_WishlistAdder: { _id: uyeBilgileri._id }
                },
                Product_WishListCounter: ProductFind.Product_WishListCounter - 1
            };
            await Urun.findByIdAndUpdate(ProductFind._id, WishListAdder);
            await User.findByIdAndUpdate(uyeBilgileri._id, star);
            res.redirect('/isteklistesi');
        } else {
            res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` });
        }
    
    })}
    catch {
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const kayitolpost = async (req, res, next) => {
    try {
        const uyeVarMi = await User.count({ email: req.body.email });
        if (uyeVarMi > 0) {
            console.log('Bu üye sistemde var!');
            res.redirect('/giris');
        }
        else {

            const bilgiler = {
                isim: req.body.isim,
                user_id: Date.now() + (Math.random() * 10000),
                soyisim: req.body.soyisim,
                email: req.body.email,
                User_Status: 'Aktif',
                wishlist: [],
                sifre: await bcrypt.hash(req.body.Password, 10),
                userid: '1',
                verfication_number: 's',
            }

            const yenikullanici = new User(
                bilgiler
            );
            await yenikullanici.save();
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'info@yapx.com.tr',
                    pass: 'fxhxlmidibkzhwxt'
                }
            });
            const data = {
                time: Date(),
                email: req.body.email,
            }
            const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
            res.clearCookie('dogrulamatoken');
            res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
            const token = ('dogrulamatoken', jwtToken);
            const uyeVarMi = await User.count({ email: req.body.email });
            if (uyeVarMi > 0) {
                const number = Math.floor(Math.random() * 1000000) + 99999;
                const numberdb = {
                    verfication_number: number,
                    dogrulama_token: token
                }
                const uyeBilgileri = await User.find({ email: req.body.email })
                await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                var mailOptions = {
                    from: 'izzeteminn@gmail.com',
                    to: req.body.email,
                    subject: ('Yapx Doğrulama Kodu'),
                    html: (`<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="x-apple-disable-message-reformatting"> <title></title> <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css"> <!-- Web Font / @font-face : BEGIN --> <!--[if mso]> <style> * { font-family: 'Roboto', sans-serif !important; } </style> <![endif]--> <!--[if !mso]> <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css"> <![endif]--> <!-- Web Font / @font-face : END --> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; font-family: 'Roboto', sans-serif !important; font-size: 14px; margin-bottom: 10px; line-height: 24px; color:#8094ae; font-weight: 400; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } a { text-decoration: none; } img { -ms-interpolation-mode:bicubic; } </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: white;"><center style="width: 100%; background-color: #f5f6fa;"> <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="white"> <tr> <td style="padding: 40px 0;"> <table style="width:100%;max-width:620px;margin:0 auto;"> <tbody> <tr> <td style="text-align: center; padding-bottom:25px"> <a href="yapx.com.tr"><img style="height: 80px; border-radius: 20px;" src="https://yapx.com.tr/general/img/yapxlogom-min.jpg" alt="logo"></a> <p style="font-size: 14px; color: #6576ff; padding-top: 12px;"></p> </td> </tr> </tbody> </table> <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff; border-radius: 20px;"> <tbody> <tr> <td style="text-align:center;padding: 30px 30px 15px 30px;"> <h2 style="font-size: 18px; color: #1ee0ac; font-weight: 600; margin: 0;">ONAY KODU</h2> </td> </tr> <tr> <td style="text-align:center;padding: 0 30px 20px"> <p style="margin-bottom: 10px;"></p> <p style="font-size: 25px; border: 1px solid gray; padding: 20px; border-radius: 20px; letter-spacing: 8px;">${number}</p> </td> </tr> <tr> <td style="text-align:center;padding: 0 30px 40px"> <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">Bu e-mail otomatik olarak gönderilmiştir lütfen bu maile yanıtlamayın.Herhangibir sorun yaşıyorsanız info@yapx.com ile iletişime geçiniz.</p> </td> </tr> </tbody> </table> <table style="width:100%;max-width:620px;margin:0 auto;"> <tbody> <tr> <td style="text-align: center; padding:25px 20px 0;"> <p style="font-size: 18px;"></p> <p style="padding-top: 15px; font-size: 12px;">Copyright © 2023 Yapx Tüm hakları saklıdır. <a style="color: #6576ff; text-decoration:none;" href="yapx.com">yapx.com</a></p> </td> </tr> </tbody> </table> </td> </tr> </table> </center></body></html>`)
                };
                console.log(number)
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);

                    }
                    res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Doğrulama Kodu`, description: ``, keywords: `` })
                });
            }
        }

    }

    catch (err) {
        console.log(err);
    }
};
const kurumsalpost = async (req, res, next) => {
    try {
        const uyeVarMi = await User.count({ email: req.body.email });
        if (uyeVarMi > 0) {
            res.redirect('/giris');
        }
        else {
            if (req.body.sifre == req.body.sifretekrar) {
                const bilgiler = {
                    dukkanadi: req.body.dukkanadi,
                    isim: req.body.isim,
                    email: req.body.email,
                    soyisim: req.body.soyisim,
                    wishlist: [],
                    sifre: await bcrypt.hash(req.body.sifre, 10),
                    verfication_number: 's',
                    sabittelefon: req.body.Sabit_telefon,
                    dukkanyorum: {},
                    dukkanili: req.body.Iller,
                    dukkanilcesi: req.body.Ilceler,
                    gsmtelefon: req.body.GSM_telefon,
                    faliyetalani: req.body.Faaliyet_alanı,
                    tckimlik: req.body.Tc_kimlikno,
                    sirketunvani: req.body.sirket_unvanı,
                    sirketkurulustarihi: req.body.sirket_kurulus_tarihi,
                    sirketadresi: req.body.sirket_adresi,
                    vergidairesiili: req.body.Vergi_Dairesiili,
                    dukkan_star: '5',
                    dukkan_av: '5',
                    dukkanoysayisi: '1',
                    dukkanurunleri: [],
                    dukkanphoto: 'test.png',
                    User_Status: 'Pasif',
                    vergikimliknumarasi: req.body.Vergi_kimlikno,
                    vergidairesi: req.body.Vergi_dairesi,
                    Dukkan_UniqueID: 'Yapx_' + Date.now() + (Math.random() * 100),
                    userid: '3',
                    usertoken: '',
                    dukkanurl: Math.floor(Math.random() * 1000000),
                }

                const yenikullanici = new User(
                    bilgiler
                );
                await yenikullanici.save();
            }
            else {

            }
            res.redirect('/kayitbasarili'); //abcde
        }
    }
    catch (err) {
        console.log(err);
    }
};
const loginUser = async (req, res, next) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const gelenSifre = req.body.sifre

    try {
        const uyeVarMi2 = await User.count({ email: req.body.email });
        // Üye Varmı Kontrol Et  
        if (uyeVarMi2 > 0) {
            const uyeVarMi = await User.find({ email: req.body.email });
            const Sifrelegal = uyeVarMi[0].sifre;
            const token = uyeVarMi[0].usertoken;
            // Varsa ve Bireysel Kullanıcıysa email doğrulamış mı kontrol et
            if (token == null) {
                if (uyeVarMi[0].userid == '1' || uyeVarMi[0].userid == '5') {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'info@yapx.com.tr',
                            pass: 'fxhxlmidibkzhwxt'
                        }
                    });
                    const data = {
                        time: Date(),
                        email: req.body.email,
                    }
                    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
                    res.clearCookie('dogrulamatoken');
                    res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + 900000) });
                    const token = ('dogrulamatoken', jwtToken);
                    const number = Math.floor(Math.random() * 1000000) + 99999;
                    const numberdb = {
                        verfication_number: number,
                        dogrulama_token: token
                    }
                    const uyeBilgileri = await User.find({ email: req.body.email })
                    await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                    var mailOptions = {
                        from: 'izzeteminn@gmail.com',
                        to: req.body.email,
                        subject: ('Verification Code is: ' + number),
                        text: ('Verification Code is: ' + number)
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);

                        }
                        res.render('user/kayitolcode', { layout: '../layouts/login', title: `Yapx | Doğrulama Kodu`, description: ``, keywords: `` })
                    });
                }
                else {
                    res.redirect('../giris/')
                }
            }
            // Doğruladıysa İşlemler
            else {
                const isMatch = await bcrypt.compare(gelenSifre, uyeVarMi[0].sifre);
                // Hesap Durumu Aktif mi Pasif mi ve Şifresi doğru mu diye kontrol et
                if (isMatch && uyeVarMi[0].User_Status == "Aktif") {
                    // Bireysel Kullanıcı Değilse Kalan Süresini Kontrol Et
                    if (uyeVarMi[0].userid == '3') {
                        if (uyeVarMi[0].User_GivenTime) {
                            var dateString = uyeVarMi[0].User_GivenTime; // Örnek tarih string'i
                            var tarih = new Date(Date.parse(dateString)); // Tarih nesnesi oluşturma
                            var simdikiZaman = new Date(); // Şu anki zaman nesnesi oluşturma
                            var farkMilisaniye = tarih.getTime() - simdikiZaman.getTime(); // Farkın milisaniye cinsinden hesaplanması
                            var farkGun = Math.floor(farkMilisaniye / (1000 * 60 * 60 * 24)); // Farkın gün cinsine dönüştürülmesi
                            // Kalan Süresi 0'dan Büyük İse Giriş Hakkı Ver
                            if (farkGun > 0) {
                                const jwtToken = token;
                                res.clearCookie('usertoken');
                                res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 9000000) });
                                const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                                    if (decoded) {
                                        console.log('login basarili');
                                        res.redirect('/')
                                    }
                                    else {
                                        const data = {
                                            time: Date(),
                                            email: req.body.email,
                                        }
                                        const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
                                        res.clearCookie('usertoken');
                                        res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
                                        const token = ('usertoken', jwtToken);
                                        const numberdb = {
                                            usertoken: token
                                        }
                                        const uyeBilgileri = await User.find({ email: req.body.email })
                                        await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                                        res.redirect('/')
                                    }
                                })
                            }
                            // Süresi Bitmişse Anasayfaya Gönder ve Para Ödeyin Kısmını Getir req.flash yazılcak
                            else {
                                req.flash('validation_error', [{ msg: 'Hesabınızın Süresi Bitmiştir Lütfen Yöneticiye Ulaşınız.' }]);
                                res.redirect('../giris')
                            }
                        }
                        // Eğer Süresi Tanımlanmamış ama aktifse Admine Yazsın
                        else {
                            res.locals.tUserlogin_error = req.flash('tUserlogin_error', 'Süreniz Dolmuştur.');
                            res.redirect('/giris')
                        }
                    }
                    // Bireysel Kullanıcı ise Token Süresinin Bitip Bitmediğini Kontrol et Bittiyse Yeni Token Oluşturup Login Yaptır
                    else {
                        const jwtToken = token;
                        res.clearCookie('usertoken');
                        res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 9000000) });
                        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                            if (decoded) {
                                console.log('login basarili');
                                res.redirect('/')
                            }
                            else {
                                const data = {
                                    time: Date(),
                                    email: req.body.email,
                                }
                                const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
                                res.clearCookie('usertoken');
                                res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + 900000000) });
                                const token = ('usertoken', jwtToken);
                                const numberdb = {
                                    usertoken: token
                                }
                                const uyeBilgileri = await User.find({ email: req.body.email })
                                await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
                                res.redirect('/')
                            }
                        })
                    }
                }
                else {
                    res.locals.tUserlogin_error = req.flash('tUserlogin_error', 'Şifrenizi Hatalı Girdiniz.');
                    res.redirect('/giris')
                }
            }
        }
        else {
            res.locals.tUserlogin_error = req.flash('tUserlogin_error', 'Böyle bir kullanıcı bulunamadı.');
            res.redirect('/giris')
        }
    }

    catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }

};
const sifremiunuttumPost = async (req, res, next) => {
    try {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'info@yapx.com.tr',
                pass: 'fxhxlmidibkzhwxt'
            }
        });
        const data = {
            time: Date(),
            email: req.body.email,
        }
        res.clearCookie('dogrulamatoken');
        const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        res.clearCookie('dogrulamatoken');
        res.cookie('dogrulamatoken', jwtToken, { expires: new Date(Date.now() + 900000) });
        const token = ('dogrulamatoken', jwtToken);
        const uyeVarMi = await User.count({ email: req.body.email });
        
        if (uyeVarMi > 0) {
            const number = Math.floor(Math.random() * 1000000) + 99999;
            const numberdb = {
                verfication_number: number,
                dogrulama_token: token
            }
            const uid = uuidv4()
            const informations = {
                TransactionID: uid,
                Email: req.body.email,
                firstTime: true
            }
            const yenikullanici = new Forgetten(
                informations
            );
            await yenikullanici.save();
            const uyeBilgileri = await User.find({ email: req.body.email })
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, numberdb);
            var mailOptions = {
                from: 'izzeteminn@gmail.com',
                to: req.body.email,
                subject: ('Yapx Şifre Sıfırlama'),
                
                html: (`<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="x-apple-disable-message-reformatting"> <title></title> <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css"> <!-- Web Font / @font-face : BEGIN --> <!--[if mso]> <style> * { font-family: 'Roboto', sans-serif !important; } </style> <![endif]--> <!--[if !mso]> <link href="https://fonts.googleapis.com/css?family=Roboto:400,600" rel="stylesheet" type="text/css"> <![endif]--> <!-- Web Font / @font-face : END --> <!-- CSS Reset : BEGIN --> <style> /* What it does: Remove spaces around the email design added by some email clients. */ /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */ html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; font-family: 'Roboto', sans-serif !important; font-size: 14px; margin-bottom: 10px; line-height: 24px; color:#8094ae; font-weight: 400; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } a { text-decoration: none; } img { -ms-interpolation-mode:bicubic; } </style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: white;"><center style="width: 100%; background-color: #f5f6fa;"> <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="white"> <tr> <td style="padding: 120px 0;"> <table style="width:100%;max-width:620px;margin:0 auto;"> <tbody> <tr> <td style="text-align: center; padding-bottom:25px"> <a href="yapx.com.tr"><img style="height: 120px; border-radius: 20px;" src="https://yapx.com.tr/general/img/yapxlogom-min.jpg" alt="logo"></a> <p style="font-size: 14px; color: #6576ff; padding-top: 12px;"></p> </td> </tr> </tbody> </table> <table style="width:100%;max-width:620px;margin:0 auto;background-color:#ffffff; border-radius: 20px;"> <tbody> <tr> <td style="text-align:center;padding: 20px 20px 20px 20px;"> <h2 style="font-size: 18px; color: #1ee0ac; font-weight: 600; margin: 0;">ONAY LİNKİ</h2> </td> </tr> <tr> <td style="text-align:center;padding: 0 30px 50px"> <p style="margin-bottom: 30px;"></p> <a href="https://yapx.com.tr/changePasswordForget?id=${uid}" style="font-size: 25px; padding: 20px 40px 20px 40px; border-radius: 20px; background-color: #fed700; color: white;">Bağlantıya Git</a> </td> </tr> <tr> <td style="text-align:center;padding: 0 30px 40px"> <p style="margin: 0; font-size: 13px; line-height: 22px; color:#9ea8bb;">Bu e-mail otomatik olarak gönderilmiştir lütfen bu maile yanıtlamayın.Herhangibir sorun yaşıyorsanız info@yapx.com ile iletişime geçiniz.</p> </td> </tr> </tbody> </table> <table style="width:100%;max-width:620px;margin:0 auto;"> <tbody> <tr> <td style="text-align: center; padding:25px 20px 0;"> <p style="font-size: 18px;"></p> <p style="padding-top: 15px; font-size: 12px;">Copyright © 2023 Yapx Tüm hakları saklıdır. <a style="color: #6576ff; text-decoration:none;" href="yapx.com">yapx.com</a></p> </td> </tr> </tbody> </table> </td> </tr> </table> </center></body></html>` )
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);

                }
                res.render('user/sifremiunuttumcode', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            });
        }
        else {
            console.log('Böyle hesap yok')
            res.redirect('/kayitol')
        }
    } catch (err) {
        console.log(err);
    }
};
const sifremiunuttumcodePost = async (req, res, next) => {
    try {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'izzeteminn@gmail.com',
                pass: 'iumdezcziubjzuxz'
            }
        });
        const token = req.cookies.dogrulamatoken;
        const uyeVarMi = await User.find({ dogrulama_token: token });
        const SifreVarmi = await User.find(uyeVarMi[0]);
        const Sifrelegal = SifreVarmi[0].verfication_number;
        if (Sifrelegal == req.body.code) {
            var mailOptions = {
                from: 'izzeteminn@gmail.com',
                to: SifreVarmi[0].email,
                subject: ('Yapx Şifre Sıfırlama'),
                text: ('Şifren: ' + SifreVarmi[0].sifre)
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);

                }
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
            });
        }
        else {
            res.redirect('/sifremiunuttumcode')
        }
    }
    catch (err) {
        console.log(err);
    }
};
const yorumekle = async (req, res, next) => {
    try {
        const urunno = req.params.urun;
        const UrunFind = await Urun.find({ product_url: urunno })
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const today = dayjs().locale('tr'); // dayjs kullanarak günün tarihini alıyoruz
        const day = today.format('DD'); // gün bilgisini alıyoruz
        const month = today.format('MM'); // ay bilgisini alıyoruz
        const year = today.format('YYYY'); // yıl bilgisini alıyoruz)
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const uyeBilgileri2 = await User.find({ usertoken: token });
                if (uyeBilgileri2[0].userid == '3' || uyeBilgileri2[0].userid == '2') {
                    var numberdb = {
                        $push: {
                            urun_yorum: {
                                CommenterName: uyeBilgileri2[0].dukkanadi,
                                CommentedProduct: UrunFind[0].product_url,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }

                    }
                }
                else {
                    var numberdb = {
                        $push: {
                            urun_yorum: {
                                CommenterName: uyeBilgileri2[0].isim,
                                CommentedProduct: UrunFind[0].product_url,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }


                    }
                }

                const star = {
                    $push: { product_star: (req.body.rating) },
                    urun_oysayisi: Number(UrunFind[0].urun_oysayisi) + 1,
                }
                await Urun.findByIdAndUpdate(UrunFind[0]._id, numberdb);
                await Urun.findByIdAndUpdate(UrunFind[0]._id, star);
                res.redirect('/urunler/' + UrunFind[0].product_url)
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Kayıt OL`, description: ``, keywords: `` })
            }
        })

    }
    catch {
        console.log(err)
    }
};
const yorumekleDukkan = async (req, res, next) => {
    try {
        const urunno = req.params.dukkan;
        const UrunFind = await User.find({ dukkanurl: urunno })
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const today = dayjs().locale('tr'); // dayjs kullanarak günün tarihini alıyoruz
        const day = today.format('DD'); // gün bilgisini alıyoruz
        const month = today.format('MM'); // ay bilgisini alıyoruz
        const year = today.format('YYYY'); // yıl bilgisini alıyoruz)
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const uyeBilgileri2 = await User.find({ usertoken: token });
                if (uyeBilgileri2[0].userid == '3' || uyeBilgileri2[0].userid == '2') {
                    var numberdb = {
                        $push: {
                            dukkanyorum: {
                                CommenterName: uyeBilgileri2[0].dukkanadi,
                                CommentedProduct: UrunFind[0].dukkanurl,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }

                    }
                }
                else {
                    var numberdb = {
                        $push: {
                            dukkanyorum: {
                                CommenterName: uyeBilgileri2[0].isim,
                                CommentedProduct: UrunFind[0].dukkanurl,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }


                    }
                }

                const star = {
                    $push: { dukkan_star: (req.body.rating) },
                    dukkanoysayisi: Number(UrunFind[0].dukkanoysayisi) + 1,
                }
                await User.findByIdAndUpdate(UrunFind[0]._id, numberdb);
                await User.findByIdAndUpdate(UrunFind[0]._id, star);
                res.redirect('/dukkanlar/' + UrunFind[0].dukkanurl)
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Kayıt OL`, description: ``, keywords: `` })
            }
        })

    }
    catch {
        console.log(err)
    }
};
const yorumekleMeslek = async (req, res, next) => {
    try {
        const urunno = req.params.dukkan;
        const UrunFind = await User.find({ Meslek_URL: urunno })
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const today = dayjs().locale('tr'); // dayjs kullanarak günün tarihini alıyoruz
        const day = today.format('DD'); // gün bilgisini alıyoruz
        const month = today.format('MM'); // ay bilgisini alıyoruz
        const year = today.format('YYYY'); // yıl bilgisini alıyoruz)
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const uyeBilgileri2 = await User.find({ usertoken: token });
                if (uyeBilgileri2[0].userid == '3' || uyeBilgileri2[0].userid == '2') {
                    var numberdb = {
                        $push: {
                            dukkanyorum: {
                                CommenterName: uyeBilgileri2[0].dukkanadi,
                                CommentedProduct: UrunFind[0].Meslek_URL,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }

                    }
                }
                else {
                    var numberdb = {
                        $push: {
                            dukkanyorum: {
                                CommenterName: uyeBilgileri2[0].isim,
                                CommentedProduct: UrunFind[0].Meslek_URL,
                                Comment: req.body.yorum,
                                CommentID: uuidv4(),
                                CommentChild: [],
                                Rating: req.body.rating,
                                Time: `${day}.${month}.${year} - ${hour}:${minute}`
                            },
                        }


                    }
                }

                const star = {
                    $push: { dukkan_star: (req.body.rating) },
                    dukkanoysayisi: Number(UrunFind[0].dukkanoysayisi) + 1,
                }
                await User.findByIdAndUpdate(UrunFind[0]._id, numberdb);
                await User.findByIdAndUpdate(UrunFind[0]._id, star);
                res.redirect('/meslekPage?id=' + UrunFind[0].Meslek_URL)
            } else {
                res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Kayıt OL`, description: ``, keywords: `` })
            }
        })

    }
    catch {
        console.log(err)
    }
};
const addPhotoDukkan = async (req,res,next) => {
    try{
        const findDukkan = await User.findOne({usertoken: req.cookies.usertoken})
        const Informations = {
            dukkanphoto: req.file.filename
        }
        await User.findByIdAndUpdate(findDukkan._id,Informations)
        res.redirect('/hesabim')
    }
    catch (err){
        console.log(err)
    }
}
const dukkanaekle = async (req, res, next) => {
    try {
        const { usertoken: token } = req.cookies;
        const { fiyat: price, url: kod, stok } = req.body;

        const banner = await Urun.findOne({ product_url: kod });
        const seller = await User.findOne({ usertoken: token });

        if (!banner || !seller) {
            return res.status(400).json({ error: 'Invalid product or seller' });
        }
        const product = {
            product_url: kod,
            product_title: banner.product_name,
            product_avarage: banner.avarage,
            product_hype: banner.tiklanmasayisi,
            product_category3: banner.product_category3,
            product_photo: banner.product_photo[0],
            seller_City: seller.dukkanili,
            seller_Town: seller.dukkanilcesi,
            product_brand: banner.product_marka,
            seller_url: seller.dukkanurl,
            seller_Name: seller.dukkanadi,
            seller_Email: seller.email,
            stock: stok,
            price: price,
            stock: stok
        };

        const productExists = seller.dukkanurunleri.some(p => p.product_url === kod);
        const result = banner.product_seller.filter(product => product.price < price).length > 0;
        if (!result) {
            const minPrice = {
                Product_MinimumPrice: {
                    value: Number(price),
                    Seller_Name: seller.dukkanadi,
                    Seller_Url: seller.dukkanurl
                },
                Product_Price: Number(price)
            };

            await Urun.findByIdAndUpdate(banner._id, minPrice);
        } else {
            const maxPrice = {
                Product_MaximumPrice: {
                    value: Number(price),
                    Seller_Name: seller.dukkanadi,
                    Seller_Url: seller.dukkanurl
                }
            };
            await Urun.findByIdAndUpdate(banner._id, maxPrice);
        }

        if (productExists) {
            return res.status(400).json({ error: 'Product already exists in store' });
        }

        const storeProduct = {
            ...product,
            createdAt: new Date()
        };

        const userUpdate = {
            $push: { dukkanurunleri: storeProduct }
        };

        const bannerUpdate = {
            $push: { product_seller: { ...product } }
        };

        await User.findByIdAndUpdate(seller._id, userUpdate);
        await Urun.findByIdAndUpdate(banner._id, bannerUpdate);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
const changePassword = async (req,res,next) => {
    try{
        const findUser = await User.findOne({usertoken: req.cookies.usertoken})
        const isMatch = await bcrypt.compare(req.body.guncelsifre, findUser.sifre);
        if(isMatch){
            const Informations = {
                sifre: await bcrypt.hash(req.body.yenisifre, 10),
            }
            await User.findByIdAndUpdate(findUser._id,Informations)
        }
        res.redirect('/hesabim')
    }
    catch (err){
        console.log(err)
    }
}
const DukkanaEkleV2forAtTheUrunPage = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        const price = req.body.fiyat;
        const kod = req.body.url;
        const stok = req.body.stok;
        var banner = await Urun.find({ product_url: kod });
        var uyeBilgileri2 = await User.find({ usertoken: token });
        var arr = uyeBilgileri2[0].dukkanurunleri;
        const result = arr.some(obj => obj.url === banner[0].product_url.toString());
        if (!result) {
            const dukkanurl = uyeBilgileri2[0].dukkanurl;
            const numberdb = {
                $push: {
                    dukkanurunleri: {
                        product_url: banner[0].product_url,
                        product_title: banner[0].product_name,
                        product_avarage: banner[0].avarage,
                        product_hype: banner[0].tiklanmasayisi,
                        seller_City: uyeBilgileri2[0].dukkanili,
                        product_category3: banner[0].product_category3,
                        product_photo: banner[0].product_photo[0],
                        seller_Town: uyeBilgileri2[0].dukkanilcesi,
                        product_brand: banner[0].product_marka,
                        seller_Name: uyeBilgileri2[0].dukkanadi,
                        seller_Email: uyeBilgileri2[0].email,
                        stock: stok,
                        seller_url: uyeBilgileri2[0].dukkanurl,
                        price: price,
                        stock: stok
                    }
                }
            };
            const star = {
                $push: {
                    product_seller: {
                        product_url: banner[0].product_url,
                        product_title: banner[0].product_title,
                        product_avarage: banner[0].avarage,
                        product_hype: banner[0].tiklanmasayisi,
                        seller_City: uyeBilgileri2[0].dukkanili,
                        seller_Town: uyeBilgileri2[0].dukkanilcesi,
                        product_brand: banner[0].product_marka,
                        stock: stok,
                        seller_url: uyeBilgileri2[0].dukkanurl,
                        price: price,
                        stock: stok
                    }
                }
            };
            const result = banner[0].product_seller.filter(product => product.price < price).length > 0;

            if (!result) {
                const minPrice = {
                    Product_MinimumPrice: {
                        value: Number(price),
                        Seller_Name: uyeBilgileri2[0].dukkanadi,
                        Seller_Url: uyeBilgileri2[0].dukkanurl
                    },
                    Product_Price: Number(price)
                };
                await Urun.findByIdAndUpdate(banner[0]._id, minPrice);
            } else {
                const maxPrice = {
                    Product_MaximumPrice: {
                        value: Number(price),
                        Seller_Name: uyeBilgileri2[0].dukkanadi,
                        Seller_Url: uyeBilgileri2[0].dukkanurl
                    }
                };
                await Urun.findByIdAndUpdate(banner[0]._id, maxPrice);
            }
            await User.findByIdAndUpdate(uyeBilgileri2[0]._id, numberdb);
            await Urun.findByIdAndUpdate(banner[0]._id, star);
            var referer = req.get('referer');
            res.redirect(referer);
        } else {
            var referer = req.get('referer');
            res.redirect(referer);
        }
    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }

};
const urunuduzenle = async (req, res, next) => {
    const token = req.cookies.usertoken;
    const uyeBilgileri2 = await User.find({ usertoken: token });
    const urun = await Urun.find({ product_url: req.params.url });
    const iduser = uyeBilgileri2[0]._id
    const idurun = urun[0]._id
    const array = []
    const array2 = []
    /*kullanicinin sattigi urunlerde degisiklik */
    for (let i = 0; i < uyeBilgileri2[0].dukkanurunleri.length; i++) {
        if (uyeBilgileri2[0].dukkanurunleri[i].product_url == req.params.url) {
            uyeBilgileri2[0].dukkanurunleri[i].price = req.body.fiyat
            uyeBilgileri2[0].dukkanurunleri[i].stock = req.body.stok
        }
        array.push(uyeBilgileri2[0].dukkanurunleri[i])
    }
    const yeniarray = {
        dukkanurunleri: array
    }
    await User.findByIdAndUpdate(iduser, yeniarray);
    /*urundeki satanlardaki degisiklik */
    for (let i = 0; i < urun[0].product_seller.length; i++) {
        if (urun[0].product_seller[i].seller_url == uyeBilgileri2[0].dukkanurl) {
            const result = urun[0].product_seller.filter(product => Number(product.price) > Number(urun[0].product_seller[i].price)).length > 0;
            const result2 = urun[0].product_seller.filter(product => Number(product.price) < Number(urun[0].product_seller[i].price)).length > 0;
            urun[0].product_seller[i].price = req.body.fiyat
            urun[0].product_seller[i].stock = req.body.stok
            if(!result){
                const changeFinder = urun[0]
                if (changeFinder && changeFinder.product_seller.length > 0) {
                const lowestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                    if (Number(curr.price) < Number(prev.price)) {
                    return curr;
                    } else {
                    return prev;
                    }
                });
                const minPrice = {
                    Product_MinimumPrice: {
                        value: Number(lowestPriceProduct.price),
                        Seller_Name: lowestPriceProduct.seller_Name,
                        Seller_Url: lowestPriceProduct.seller_url
                    },
                    Product_Price: Number(lowestPriceProduct.price)
                };
                await Urun.findOneAndUpdate(changeFinder._id,minPrice)
                }       
            }
            if(!result2){
                const changeFinder = urun[0]

                if (changeFinder && changeFinder.product_seller.length > 0) {
                const highestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                    if (Number(curr.price) > Number(prev.price)) {
                    return curr;
                    } else {
                    return prev;
                    }
                });

                const maxPrice = {
                    Product_MaximumPrice: {
                    value: Number(highestPriceProduct.price),
                    Seller_Name: highestPriceProduct.seller_Name,
                    Seller_Url: highestPriceProduct.seller_url
                    }
                };

                await Urun.findByIdAndUpdate(changeFinder._id, maxPrice);
                } else {
                    await Urun.findOneAndUpdate(changeFinder._id,{ Product_MaximumPrice:{}})
                }

            }
        }
        array2.push(urun[0].product_seller[i])
    }
    const yeniarray2 = {
        product_seller: array2
    }
    await Urun.findByIdAndUpdate(idurun, yeniarray2);
    res.redirect('/dukkanlar/' + uyeBilgileri2[0].dukkanurl);

};
const urunukaldir = async (req, res, next) => {
    try{
    const token = req.cookies.usertoken;
    var uyeBilgileri2 = await User.find({ usertoken: token });
    var urun = await Urun.find({ product_url: req.params.url });
    try {
        var iduser = uyeBilgileri2[0]._id
    }
    catch {
        res.redirect('/giris/');
    }
    const idurun = urun[0]._id
    const array = []
    /*kullanicinin sattigi urunlerde degisiklik */
    for (let i = 0; i < uyeBilgileri2[0].dukkanurunleri.length; i++) {
        if (uyeBilgileri2[0].dukkanurunleri[i].product_url == req.params.url) {
            uyeBilgileri2[0].dukkanurunleri.splice(i, 1)
        }
        else {
            array.push(uyeBilgileri2[0].dukkanurunleri[i])
        }
    }
    const yeniarray = {
        dukkanurunleri: array
    }
    await User.findByIdAndUpdate(iduser, yeniarray);
    /*urundeki satanlardaki degisiklik */
    for (let i = 0; i < urun[0].product_seller.length; i++) {
        if (urun[0].product_seller[i].seller_url == uyeBilgileri2[0].dukkanurl) {
            const result = urun[0].product_seller.filter(product => Number(product.price) > Number(urun[0].product_seller[i].price)).length > 0;
            const result2 = urun[0].product_seller.filter(product => Number(product.price) < Number(urun[0].product_seller[i].price)).length > 0;
            urun[0].product_seller.splice(i, 1)
            var array2 = urun[0].product_seller
            if(!result){
                const changeFinder = urun[0]
                if (changeFinder && changeFinder.product_seller.length > 0) {
                const lowestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                    if (Number(curr.price) < Number(prev.price)) {
                    return curr;
                    } else {
                    return prev;
                    }
                });
                const minPrice = {
                    Product_MinimumPrice: {
                        value: Number(lowestPriceProduct.price),
                        Seller_Name: lowestPriceProduct.seller_Name,
                        Seller_Url: lowestPriceProduct.seller_url
                    }
                };
                await Urun.findOneAndUpdate(changeFinder._id,minPrice)
                } 
                else {

                    await Urun.findOneAndUpdate(changeFinder._id,{ Product_MinimumPrice:{},Product_Price: 0})
                }        
            }
            if(!result2){
                const changeFinder = urun[0]

                if (changeFinder && changeFinder.product_seller.length > 0) {
                const highestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                    if (Number(curr.price) > Number(prev.price)) {
                    return curr;
                    } else {
                    return prev;
                    }
                });

                const maxPrice = {
                    Product_MaximumPrice: {
                    value: Number(highestPriceProduct.price),
                    Seller_Name: highestPriceProduct.seller_Name,
                    Seller_Url: highestPriceProduct.seller_url
                    }
                };

                await Urun.findByIdAndUpdate(changeFinder._id, maxPrice);
                } else {
                    await Urun.findOneAndUpdate(changeFinder._id,{ Product_MaximumPrice:{}})
                }

            }
        }
        else {
            array2.push(urun[0].product_seller[i])
        }
    }
    const yeniarray2 = {
        product_seller: array2
    }
    await Urun.findByIdAndUpdate(idurun, yeniarray2);
    var referer = req.get('referer');
    res.redirect(referer);
    }
    catch (err){
        console.log(err)
    }
};
const urunukaldirv2 = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        var uyeBilgileri2 = await User.find({ usertoken: token });
        var urun = await Urun.find({ product_url: req.body.url });

        try {
            var iduser = uyeBilgileri2[0]._id
        }
        catch {
            res.redirect('/giris/');
        }
        const idurun = urun[0]._id

        const updatedProducts = uyeBilgileri2[0].dukkanurunleri.filter(product => {
            return product.product_url !== req.body.url;
        });

        const yeniarray = {
            dukkanurunleri: updatedProducts
        };

        await User.findByIdAndUpdate(iduser, yeniarray);
        for (let i = 0; i < urun[0].product_seller.length; i++) {
            if (urun[0].product_seller[i].seller_url == uyeBilgileri2[0].dukkanurl) {
                const result = urun[0].product_seller.filter(product => Number(product.price) > Number(urun[0].product_seller[i].price)).length > 0;
                const result2 = urun[0].product_seller.filter(product => Number(product.price) < Number(urun[0].product_seller[i].price)).length > 0;
                urun[0].product_seller.splice(i, 1)
                var array2 = urun[0].product_seller
                if(!result){
                    const changeFinder = urun[0]
                    if (changeFinder && changeFinder.product_seller.length > 0) {
                    const lowestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                        if (Number(curr.price) < Number(prev.price)) {
                        return curr;
                        } else {
                        return prev;
                        }
                    });
                    const minPrice = {
                        Product_MinimumPrice: {
                            value: Number(lowestPriceProduct.price),
                            Seller_Name: lowestPriceProduct.seller_Name,
                            Seller_Url: lowestPriceProduct.seller_url
                        }
                    };
                    await Urun.findOneAndUpdate(changeFinder._id,minPrice)
                    } 
                    else {
                        await Urun.findOneAndUpdate(changeFinder._id,{ Product_MinimumPrice:{},Product_Price: 0})
                    }        
                }
                if(!result2){
                    const changeFinder = urun[0]
    
                    if (changeFinder && changeFinder.product_seller.length > 0) {
                    const highestPriceProduct = changeFinder.product_seller.reduce((prev, curr) => {
                        if (Number(curr.price) > Number(prev.price)) {
                        return curr;
                        } else {
                        return prev;
                        }
                    });
    
                    const maxPrice = {
                        Product_MaximumPrice: {
                        value: Number(highestPriceProduct.price),
                        Seller_Name: highestPriceProduct.seller_Name,
                        Seller_Url: highestPriceProduct.seller_url
                        }
                    };
    
                    await Urun.findByIdAndUpdate(changeFinder._id, maxPrice);
                    } else {
                        await Urun.findOneAndUpdate(changeFinder._id,{ Product_MaximumPrice:{}})
                    }
    
                }
            }
            else {
                array2.push(urun[0].product_seller[i])
            }
        }
        urun[0].product_seller = urun[0].product_seller.filter(seller => {
            
            return seller.seller_url !== uyeBilgileri2[0].dukkanurl;
        });

        const yeniarray2 = {
            product_seller: urun[0].product_seller
        };
        
        await Urun.findByIdAndUpdate(idurun, yeniarray2);
        res.json({ status: "Tamamlandı." })
    }
    catch (err) {
        console.log(err)
    }




};
const filtre = async (req, res, next) => {
    try {
        if (req.params.arama == undefined) {
            var sayfano = 1
        }
        else {
            var sayfano = req.params.arama
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const aranan = req.params.arama
        const markalar = await Urun.find({ product_name: { "$regex": req.cookies.arama, $options: 'i' } });
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        let sayfalar = []
        const list = []
        if (req.cookies.aranan == 'urunara') {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": req.body.arama, $options: 'i' } }, { product_name: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.body.arama + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    const productList = await Urun.find({ $and: [{ product_marka: { "$regex": req.body.myselect, $options: 'i' } }, { product_name: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/filtresayfa/' + 'urunara/' + Product[i].product_marka + ':' + (i + 1) + ':' + sayfano)
                        }
                        for (let i = 0; i < markalar.length; i++) {
                            list.push((markalar[i].product_marka).toString())
                        }
                        const filteredkategorilist2 = [...new Set(list)]
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar, filteredkategorilist2, aranan })
                    })
                }
            })
        }
        else {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $or: [{ product_marka: { "$regex": req.body.arama, $options: 'i' } }, { product_name: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.body.arama + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    if (req.body.Ilceler == 0) {
                        const productList = await User.find({ $and: [{ dukkanili: { "$regex": req.body.Iller.split(':')[1], $options: 'i' } }, { dukkanadi: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                            const toplamsayfa = parseInt(Product.length / 20) + 1
                            for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                                if (Product[sayfasayisi] != undefined) {
                                    sayfaurunleri.push(Product[sayfasayisi])
                                }
                            }
                            for (i = 0; i < toplamsayfa; i++) {
                                sayfalar.push('/filtresayfa/' + 'dukkanara/' + req.body.Iller + ':' + (i + 1) + ':' + sayfano)
                            }
                            res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar })
                        })
                    }
                    else {
                        const productList = await User.find({ $and: [{ dukkanili: { "$regex": req.body.Iller.split(':')[1], $options: 'i' } }, { dukkanadi: { "$regex": req.cookies.arama, $options: 'i' } }, { dukkanilcesi: { "$regex": req.body.Ilceler, $options: 'i' } }] }).then(Product => {
                            const toplamsayfa = parseInt(Product.length / 20) + 1
                            for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                                if (Product[sayfasayisi] != undefined) {
                                    sayfaurunleri.push(Product[sayfasayisi])
                                }
                            }
                            for (i = 0; i < toplamsayfa; i++) {
                                sayfalar.push('/filtresayfa/' + 'dukkanara/' + req.body.Iller + ':' + (i + 1) + ':' + sayfano)
                            }
                            res.render('user/dukkanarama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar })
                        })
                    }
                }
            })
        }
    }
    catch (err) {
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }



};
const filtresayfa = async (req, res, next) => {
    try {
        if (req.params.ara == undefined) {
            var sayfano = 1
        }
        else {
            var sayfano = Number(req.params.ara.split(':')[1])
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const markalar = await Urun.find({ product_name: { "$regex": req.cookies.arama, $options: 'i' } });
        let sayfalar = []
        const list = []
        const myacc = await User.find({ usertoken: token });
        let sayfaurunleri = []
        if (req.params.aramasayfa == 'urunara') {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await Urun.find({ $and: [{ product_name: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_marka: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/filtresayfa/' + 'urunara/' + req.body.arama + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    const productList = await Urun.find({ $and: [{ product_marka: { "$regex": req.params.ara.split(':')[0], $options: 'i' } }, { product_name: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/filtresayfa/' + 'urunara/' + Product[i].product_marka + ':' + (i + 1) + ':' + sayfano)
                        }
                        for (let i = 0; i < markalar.length; i++) {
                            list.push((markalar[i].product_marka).toString())
                        }
                        const filteredkategorilist2 = [...new Set(list)]
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar, filteredkategorilist2 })
                    })
                }
            })
        }
        else {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    const productList = await User.find({ dukkanadi: { "$regex": req.body.arama, $options: 'i' } }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.body.arama + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/logged', title: `Yapx | Arama`, description: ``, keywords: ``, Product, myacc, sayfaurunleri, sayfalar })
                    })

                } else {
                    const productList = await User.find({ $and: [{ dukkanili: { "$regex": req.body.Iller.split(':')[1], $options: 'i' } }, { dukkanadi: { "$regex": req.cookies.arama, $options: 'i' } }] }).then(Product => {
                        const toplamsayfa = parseInt(Product.length / 20) + 1
                        for (let sayfasayisi = 0 + (20 * sayfano) - 20; sayfasayisi < sayfano * 20; sayfasayisi++) {
                            if (Product[sayfasayisi] != undefined) {
                                sayfaurunleri.push(Product[sayfasayisi])
                            }
                        }
                        for (i = 0; i < toplamsayfa; i++) {
                            sayfalar.push('/aramasayfa/' + 'urunara/' + req.body.arama + ':' + (i + 1) + ':' + sayfano)
                        }
                        res.render('user/arama', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Arama`, description: ``, keywords: ``, Product, sayfaurunleri, sayfalar })
                    })
                }
            })
        }

    } catch (err) {
        console.log(err);
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
};
const MeslekSehirFiltresi = async (req, res, next) => {
    try {
        if (req.body.Iller) {
            var getMeslekKategori = await User.find({ $and: [{ Meslek_City: req.body.Iller }, { Meslek_SubCategory: req.body.category }] })
        }
        if (req.body.Iller && req.body.Ilceler != '0') {
            var getMeslekKategori = await User.find({ $and: [{ Meslek_City: req.body.Iller }, { Meslek_Country: req.body.Ilceler }, { Meslek_SubCategory: req.body.category }] })
        }
        const getCategories = await MeslekCategories.findOne({ Meslek_Category: getMeslekKategori[0].Meslek_Category })
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const myacc = await User.find({ usertoken: token });
        if (getMeslekKategori.length > 0) {
            const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
                if (decoded) {
                    res.render('user/kategoriMeslek', { layout: '../layouts/logged', title: `Yapx | Kategori Meslek`, description: ``, keywords: ``, myacc, getMeslekKategori, getCategories })
                } else {
                    res.render('user/kategoriMeslek', { layout: '../layouts/login', title: `Yapx | Giriş`, description: ``, keywords: `` })
                }
            })
        }
        else {
            res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
        }


    }
    catch (err) {
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
}
const logout = (req, res, next) => {
    req.session.destroy((error) => {
        res.clearCookie('usertoken');
        res.redirect('/');
    });
};
const mesajgonder = async (req, res, next) => {
    try {
        const { userid } = req.params;
        const { usertoken } = req.cookies;
        const [sender, receiver] = await Promise.all([
            User.findOne({ usertoken }),
            User.findOne({ Dukkan_UniqueID: userid }),
        ]);

        const messageExists = await Messages.exists({
            $or: [
                { Message_Creater: sender.email, Message_Receiver: receiver.email },
                { Message_Creater: receiver.email, Message_Receiver: sender.email },
            ],
        });

        if (!messageExists) {
            const uniqueId = uuidv4();
            const formattedDate = new Date().toLocaleString("tr-TR", {
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
                hour12: false
            });

            const senderName = sender.isim && sender.soyisim ? `${sender.isim} ${sender.soyisim}` : sender.dukkanadi;
            const receiverName = receiver.isim && receiver.soyisim ? `${receiver.isim} ${receiver.soyisim}` : receiver.dukkanadi;

            const message = {
                Message_ID: uniqueId,
                Message_Content: [`${req.body.message_content}?:?:?${formattedDate}?:?:?${sender.email}`],
                Message_Creater: sender.email,
                Message_Receiver: receiver.email,
                Last_Sender: sender.email,
                is_Opened: "False"
            };

            const messageModel = new Messages(message);
            await Promise.all([
                User.findByIdAndUpdate(sender._id, {
                    $push: { Messages_List: `${receiverName}?:?:?${uniqueId}?:?:?${req.body.konu}?:?:?${req.body.baslik}?:?:?${formattedDate}?:?:?First_Sender?:?:?${sender.email}?:?:?0` },
                }),
                User.findByIdAndUpdate(receiver._id, {
                    $push: { Messages_List: `${senderName}?:?:?${uniqueId}?:?:?${req.body.konu}?:?:?${req.body.baslik}?:?:?${formattedDate}?:?:?First_Comer?:?:?${receiver.email}?:?:?1` },
                }),
                messageModel.save(),
            ]);
            await User.findByIdAndUpdate(receiver._id, { Unreaded_MessageCount: receiver.Unreaded_MessageCount + 1 })
            res.redirect("/mesajlarim");
        } else {
            const message = await Messages.findOne({
                $or: [
                    { Message_Creater: sender.email, Message_Receiver: receiver.email },
                    { Message_Creater: receiver.email, Message_Receiver: sender.email },
                ],
            });

            res.redirect(`/messagePage?id=${message.Message_ID}`);
        }
    } catch (err) {
        console.log(err);
    }
};
const MeslekRegister = async (req, res, next) => {
    try {
        const KullaniciSorgu = await User.count({ email: req.body.email })
        if ((req.body.Password == req.body.rePassword) && KullaniciSorgu == 0) {
            const data = {
                userid: "5",
                isim: req.body.Name,
                soyisim: req.body.Surname,
                email: req.body.email,
                sifre: await bcrypt.hash(req.body.Password, 10),
                meslekAdi: req.body.MeslekSubCategory,
                Meslek_Projects: [],
                Meslek_Category: req.body.MeslekCategory,
                Meslek_SubCategory: req.body.MeslekSubCategory,
                Meslek_Referances: [],
                Meslek_Photos: ['test.png'],
                Meslek_URL: uuidv4(),
                User_Status: "Aktif",
                Meslek_About: "Kullanıcı Henüz Hakkındakileri Belirtmemiş.",
                Meslek_Adres: req.body.Address,
                Meslek_City: req.body.City,
                tckimlik: req.body.TcKimlik,
                Meslek_Country: req.body.Country,
                dukkanyorum: [],
                gsmtelefon: req.body.PhoneNumber,
                sabittelefon: req.body.sabittelefon,
                dukkan_av: 0,
                Meslek_Thumbnails: ["yapxmarketimthumb.jpg"],
                Meslek_Photos: ["default.png"]
            }
            const yenikullanici = new User(
                data
            );
            await yenikullanici.save();
            res.redirect('/meslekkayitbasarili') //abcdef
        }
        else {
            res.redirect('../meslekKayit')
        }
    }
    catch (err) {
        console.log(err)
    }
}
const mesajgonderContinue = async (req, res, next) => {
    try {
        const message = await Messages.findOne({ Message_ID: req.params.id });
        const messageSender = await User.findOne({ usertoken: req.cookies.usertoken });

        const now = new Date();
        const formattedDate = new Date().toLocaleString("tr-TR", {
            day: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            hour12: false
        });

        const messageContent = `${req.body.message_content}?:?:?${formattedDate}?:?:?${messageSender.email}`;

        const MessagePush = { $push: { Message_Content: messageContent } };
        await Messages.findByIdAndUpdate(message._id, MessagePush);

        const otherUserEmail = message.Message_Creater === messageSender.email ? message.Message_Receiver : message.Message_Creater;
        const otherUser = await User.findOne({ email: otherUserEmail });

        const updateMessageList = (list, index, read) => {
            const item = list[index];
            const itemArray = item.split('?:?:?');
            itemArray[4] = formattedDate;
            if (read) itemArray[7] = '1';
            list.splice(index, 1);
            list.push(itemArray.join('?:?:?'))
        };

        const index = otherUser.Messages_List.findIndex(item => item.includes(req.params.id));
        if (index !== -1) {
            updateMessageList(otherUser.Messages_List, index, true);
        }

        const index2 = messageSender.Messages_List.findIndex(item => item.includes(req.params.id));
        if (index2 !== -1) {
            updateMessageList(messageSender.Messages_List, index2, false);
        }

        await Promise.all([
            otherUser.save(),
            messageSender.save()
        ]);
        await Messages.findByIdAndUpdate(message._id, { Last_Sender: messageSender.email, is_Opened: "False" })
        if (message.Last_Sender != messageSender.email || message.is_Opened == "True") {
            await User.findByIdAndUpdate(otherUser._id, { Unreaded_MessageCount: otherUser.Unreaded_MessageCount + 1 })
        }
        res.redirect('/messagePage?id=' + message.Message_ID);
    } catch (err) {
        console.error(err);
        next(err);
    }
};
const childComment = async (req, res, next) => {
    try {
        const FindComment = await Urun.findOne({ product_url: req.query.product_id });
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken });
        const today = dayjs().locale('tr');
        const day = today.format('DD');
        const month = today.format('MM');
        const year = today.format('YYYY');
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        for (let index = 0; index < FindComment.urun_yorum.length; index++) {
        const element = FindComment.urun_yorum[index];
        
        if (element.CommentID == req.query.comment_id) {
            const updatedCommentChild = element.CommentChild;

            if (FindUser.userid == '3' || FindUser.userid == '2') {
            var numberdb = {
                CommenterName: FindUser.dukkanadi,
                CommentedProduct: FindComment.product_url,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            } else {
            var numberdb = {
                CommenterName: FindUser.isim,
                CommentedProduct: FindComment.product_url,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            }
            
            updatedCommentChild.push(numberdb);
            FindComment.urun_yorum[index].CommentChild = updatedCommentChild;

            await Urun.updateOne(
            { _id: FindComment._id, "urun_yorum.CommentID": req.query.comment_id },
            { $set: { "urun_yorum.$.CommentChild": updatedCommentChild } }
            );
        }
        }

        res.redirect('/urunler/'+FindComment.product_url)
    }
    catch (err) {
        console.log(err)
}
}
const childCommentDukkan = async (req, res, next) => {
    try {
        const FindComment = await User.findOne({ dukkanurl: req.query.product_id });
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken });
        const today = dayjs().locale('tr');
        const day = today.format('DD');
        const month = today.format('MM');
        const year = today.format('YYYY');
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        for (let index = 0; index < FindComment.dukkanyorum.length; index++) {
        const element = FindComment.dukkanyorum[index];
        
        if (element.CommentID == req.query.comment_id) {
            const updatedCommentChild = element.CommentChild;

            if (FindUser.userid == '3' || FindUser.userid == '2') {
            var numberdb = {
                CommenterName: FindUser.dukkanadi,
                CommentedProduct: FindComment.dukkanurl,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            } else {
            var numberdb = {
                CommenterName: FindUser.isim,
                CommentedProduct: FindComment.dukkanurl,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            }
            
            updatedCommentChild.push(numberdb);
            FindComment.dukkanyorum[index].CommentChild = updatedCommentChild;

            await User.updateOne(
            { _id: FindComment._id, "dukkanyorum.CommentID": req.query.comment_id },
            { $set: { "dukkanyorum.$.CommentChild": updatedCommentChild } }
            );
        }
        }

        res.redirect('/dukkanlar/'+FindComment.dukkanurl)
    }
    catch (err) {
        console.log(err)
}
}
const childCommentMeslek = async (req, res, next) => {
    try {
        const FindComment = await User.findOne({ Meslek_URL: req.query.product_id });
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken });
        const today = dayjs().locale('tr');
        const day = today.format('DD');
        const month = today.format('MM');
        const year = today.format('YYYY');
        const hour = today.format('HH'); // saat bilgisini alıyoruz
        const minute = today.format('mm'); // dakika bilgisini alıyoruz
        for (let index = 0; index < FindComment.dukkanyorum.length; index++) {
        const element = FindComment.dukkanyorum[index];
        
        if (element.CommentID == req.query.comment_id) {
            const updatedCommentChild = element.CommentChild;

            if (FindUser.userid == '3' || FindUser.userid == '2') {
            var numberdb = {
                CommenterName: FindUser.dukkanadi,
                CommentedProduct: FindComment.Meslek_URL,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            } else {
            var numberdb = {
                CommenterName: FindUser.isim,
                CommentedProduct: FindComment.Meslek_URL,
                Comment: req.body.yorum,
                CommentID: uuidv4(),
                CommentChild: [],
                Time: `${day}.${month}.${year} - ${hour}:${minute}`
            }
            }
            
            updatedCommentChild.push(numberdb);
            FindComment.dukkanyorum[index].CommentChild = updatedCommentChild;

            await User.updateOne(
            { _id: FindComment._id, "dukkanyorum.CommentID": req.query.comment_id },
            { $set: { "dukkanyorum.$.CommentChild": updatedCommentChild } }
            );
        }
        }

        res.redirect('/meslekPage?id=' +FindComment.Meslek_URL)
    }
    catch (err) {
        console.log(err)
}
}
const deletes = async (req, res, next) => {

    const silinecekler = await Urun.find({ product_category3: "Sulama Sistemleri" })
    for (i = 0; i < silinecekler.length; i++) {
        await Urun.findOneAndDelete({ product_name: silinecekler[i].product_name })
    }
};
const MeslekPhotoChange = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        const Photos = []
        req.files.forEach(element => {
            Photos.push(element.filename)
        });
        const info = {
            Meslek_Photos: Photos
        }
        await User.findByIdAndUpdate(FindUser._id, info)
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const addProjectMeslek = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        const Photos = []
        req.files.forEach(element => {
            Photos.push(element.filename)
        });
        const info = {
            $push: {
                Meslek_Projects: {
                    Project_Title: req.body.Project_Title,
                    Project_Date: req.body.Project_Date,
                    Project_Content: req.body.Project_Content,
                    Project_UI: uuidv4(),
                    Project_Photos: Photos
                }
            }
        }
        await User.findByIdAndUpdate(FindUser._id, info)
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const addReferanceMeslek = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        const info = {
            $push: {
                Meslek_Referances: {
                    Referance_Title: req.body.Referance_Title,
                    Referance_UI: uuidv4(),
                    Referance_Content: req.body.Referance_Content,
                }
            }
        }
        await User.findByIdAndUpdate(FindUser._id, info)
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const addAboutMeslek = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        if (FindUser.userid == "5") {
            
            const info = {
                Meslek_About: req.body.Meslek_About,
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        if (FindUser.userid == "3") {
            const info = {
                Dukkan_About: req.body.Dukkan_About,
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const addMeslekThumbnails = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        if (FindUser.userid == "3") {
            const Photos = []
            req.files.forEach(element => {
                Photos.push(element.filename)
            });
            const info = {
                Dukkan_Thumbnails: Photos
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        if (FindUser.userid == "5") {
            const Photos = []
            req.files.forEach(element => {
                Photos.push(element.filename)
            });
            const info = {
                Meslek_Thumbnails: Photos
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const addContanct = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ usertoken: req.cookies.usertoken })
        if (FindUser.userid == "5") {
            
            const info = {
                Meslek_Adres: req.body.adres,
                gsmtelefon: req.body.telefon
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        if (FindUser.userid == "3") {
            const info = {
                sirketadresi: req.body.adres,
                gsmtelefon: req.body.telefon
            }
            await User.findByIdAndUpdate(FindUser._id, info)
        }
        res.redirect('/hesabim')
    }
    catch (err) {
        console.log(err)
    }
}
const emailChecker = async (req, res, next) => {
    try {
        const findUser = await User.findOne({usertoken: req.cookies.usertoken})
        if (findUser.userid == "5") {
            if(req.body.isChecked == "True"){
                await User.findByIdAndUpdate(findUser._id,{Email_Permission: true})
            }
            else{
                await User.findByIdAndUpdate(findUser._id,{Email_Permission: false})
            }
            var referer = req.get('referer');
            res.redirect(referer);
        }
        if (findUser.userid == "3") {
            if(req.body.isChecked == "True"){
                await User.findByIdAndUpdate(findUser._id,{Email_Permission: true})
            }
            else{
                await User.findByIdAndUpdate(findUser._id,{Email_Permission: false})
            }
            var referer = req.get('referer');
            res.redirect(referer);
        }
    }
    catch (err) {
        console.log(err)
    }
}
const FavoriDukkanlar = async (req, res, next) => {
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const dukkanurl = req.params.dukkanurl;
        const uyeBilgileri = await User.find({ usertoken: token });

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            const isDukkanEkli = uyeBilgileri[0].wishlist_Shop.some(item => item.dukkanurl === dukkanurl);
            if (!isDukkanEkli) {
            const ProductFind = await User.findOne({ dukkanurl: dukkanurl });
            const star = {
                $push: {
                wishlist_Shop: ProductFind
                },
            };
            
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
            }
            res.json({status:true})
        } else {
            res.json({status:false,errMessage:"Giriş Yapınız."})
        }
        });
    }
    catch (Err) {
        console.log(Err)
    }
}
const FavoriMeslekler = async (req, res, next) => {
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const dukkanurl = req.params.dukkanurl;
        const uyeBilgileri = await User.find({ usertoken: token });

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            const isDukkanEkli = uyeBilgileri[0].wishlist_Meslek.some(item => item.Meslek_URL === dukkanurl);
            if (!isDukkanEkli) {
                const ProductFind = await User.findOne({ Meslek_URL: dukkanurl });
                const star = {
                    $push: {
                        wishlist_Meslek: ProductFind
                    },
                };
                
                await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
                res.json({status:true})
            }
            else{   
                res.json({status:false,errMessage:"Bir şey yanlış gitti."})
            }
            
        } else {
            res.json({status:false,errMessage:"Giriş Yapınız."})
        }
        });
    }
    catch (Err) {
        console.log(Err)
    }
}
const FavoriMesleklerRemove = async (req,res,next) =>{
    try{
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const dukkanurl = req.params.dukkanurl;
        const uyeBilgileri = await User.find({ usertoken: token });

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            const isDukkanEkli = uyeBilgileri[0].wishlist_Meslek.some(item => item.Meslek_URL === dukkanurl);
            if (isDukkanEkli) {
            const star = {
                $pull: {
                    wishlist_Meslek: { Meslek_URL: dukkanurl }
                },
            };
            
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
            }
            next();
        } else {
            res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` });
        }
        });
    }
    catch(err){
        console.log(err)
    }
}
const FavoriDukkanlarRemove = async (req,res,next) =>{
    try{
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const dukkanurl = req.params.dukkanurl;
        const uyeBilgileri = await User.find({ usertoken: token });

        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            const isDukkanEkli = uyeBilgileri[0].wishlist_Shop.some(item => item.dukkanurl === dukkanurl);
            if (isDukkanEkli) {
            const star = {
                $pull: {
                wishlist_Shop: { dukkanurl: dukkanurl }
                },
            };
            
            await User.findByIdAndUpdate(uyeBilgileri[0]._id, star);
            }
            next();
        } else {
            res.render('user/giris', { layout: '../layouts/login', title: `Yapx | Giriş Yap`, description: ``, keywords: `` });
        }
        });
    }
    catch(err){
        console.log(err)
    }
}
const meslekProfilePhotoDelete = async (req,res,next) => {
    try{
        if(req.query.photo == 'Profile'){
            const UserFind = await User.findOne({usertoken: req.cookies.usertoken})
            if(UserFind.Meslek_Photos.length > 1){
                const UserPhotos = UserFind.Meslek_Photos
                UserPhotos.splice(Number(req.query.index),1)
                await User.findOneAndUpdate({ _id: UserFind._id }, { $set: { Meslek_Photos: UserPhotos } });
            }
            res.redirect('/hesabim')
        }
        if(req.query.photo == 'Thumbnail'){
            const UserFind = await User.findOne({usertoken: req.cookies.usertoken})
            if(UserFind.Meslek_Thumbnails.length > 1){
                const UserPhotos = UserFind.Meslek_Thumbnails
                UserPhotos.splice(Number(req.query.index),1)
                await User.findOneAndUpdate({ _id: UserFind._id }, { $set: { Meslek_Thumbnails: UserPhotos } });
            }        
            res.redirect('/hesabim')
        }
        if(req.query.photo == 'Projects'){
            const UserFind = await User.findOne({usertoken: req.cookies.usertoken})
            const Meslek_Projects = UserFind.Meslek_Projects
            Meslek_Projects.splice(Number(req.query.index),1)
            await User.findOneAndUpdate({ _id: UserFind._id }, { $set: { Meslek_Projects: Meslek_Projects } });
            res.redirect('/hesabim')
        }
        if(req.query.photo == 'Referances'){
            const UserFind = await User.findOne({usertoken: req.cookies.usertoken})
            const Meslek_Referances = UserFind.Meslek_Referances
            Meslek_Referances.splice(Number(req.query.index),1)
            await User.findOneAndUpdate({ _id: UserFind._id }, { $set: { Meslek_Referances: Meslek_Referances } });
            res.redirect('/hesabim')
        }
    }
    catch (err){
        console.log(err)
    }
}
const SifremiUnuttumChangePost = async (req,res,next) => {
    try{
        const FindId = await Forgetten.findOne({ TransactionID: req.query.id})
        const findUser = await User.findOne({ email: FindId.Email })
        const info = {
            sifre: await bcrypt.hash(req.body.Password, 10)
        }
        await User.findByIdAndUpdate(findUser._id,info)
        await Forgetten.findByIdAndRemove(FindId._id)
        res.redirect('/giris')
    }
    catch (err){
        console.log(err)
        res.render('user/404', { layout: '../layouts/mainSecond_Layout', title: `Yapx | Hata`, description: ``, keywords: `` });
    }
}
const checkEmail = async (req,res,next) => {
    try{
        const Email = req.body.Email
        const UserCount = await User.count({email: Email})
        if(UserCount == 0){
            res.json({status:true})
        }
        else{
            res.json({status:false,errMessage:"Bu Email Adresi Kayıtlı."})
        }
    }
    catch (err){
        console.log(err)
    }
}
const UrunleriDuzelt = async (req,res,next) => {
    try{
        const FindUruns = await Urun.find({active : "1"})
        var info = {
            avarage : 0,
            urun_oysayisi: 0,
            product_seller: [],
            tiklanmasayisi: 0,
            Product_Price: 0,
            Product_WishListCounter: 0,
            urun_yorum: [],
            product_star: [],
            Product_MaximumPrice: {},
            Product_MinimumPrice: {}
        }
        FindUruns.forEach(async element => {
            await Urun.findOneAndUpdate(element._id,info)
            console.log(element.product_name + ' başarı ile düzenlendi.')
        });
    }
    catch (err){
        console.log(err)
    }
}
module.exports = {
    homeShow,
    meslekProfilePhotoDelete,
    homeYonlendirme,
    urunekleurun,
    SifremiUnuttumChangePost,
    UrunleriDuzelt,
    FavoriDukkanlar,
    arama,
    mesajgonderContinue,
    kategoriler,
    addMeslekThumbnails,
    MeslekRegisterGet,
    FavoriDukkanlarRemove,
    addContanct,
    urunekleArama,
    FavoriMeslekler,
    addAboutMeslek,
    sifremiunuttum,
    sifremiunuttumcode,
    FavoriMesleklerRemove,
    emailChecker,
    addProjectMeslek,
    SifremiUnuttumChange,
    kayitolcodepost,
    addReferanceMeslek,
    aramasayfa,
    kayitolcodeget,
    MeslekRegister,
    changePassword,
    IsDecoded,
    searchSelect,
    isteklistesi,
    MeslekKayitol,
    kurumsalpost,
    urunukaldir,
    dukkanaekle,
    isteklistesiremove,
    MeslekPhotoChange,
    meslekKategoriAlt,
    childCommentDukkan,
    childCommentMeslek,
    meslekKategoriUst,
    giris,
    checkEmail,
    kayitol,
    deletes,
    dortyuzdort,
    hesabim,
    getWishList,
    messagePage,
    childComment,
    DukkanaEkleV2forAtTheUrunPage,
    urunukaldirv2,
    girisSecim,
    kayitolSecim,
    mesajlarim,
    MeslekSehirFiltresi,
    meslekPage,
    kurumsalregister,
    urunbulv2,
    anakategori,
    urundetaylari,
    isteklistesiadd,
    kayitolpost,
    urunbul,
    yorumekleDukkan,
    yorumekleMeslek,
    filtresayfa,
    yorumekle,
    filtre,
    loginUser,
    kategori,
    addPhotoDukkan,
    sifremiunuttumPost,
    sifremiunuttumcodePost,
    logout,
    hakkimizda,
    mesajgonder,
    dukkanlar,
    urunekle2,
    urunuduzenle,
    kayitbasarili,
    meslekkayitbasarili


};