const utilities = require('../utilities');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password before storing
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword,
    );

    if (regResult) {
        req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
        return res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the registration failed.");
        return res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;

    const account = await accountModel.loginAccount(account_email);
  
    if (await bcrypt.compare(account_password, account.account_password)) {
        return res.status(200).send('Login successful');  
    } else {
        req.flash("notice", "Sorry, Invalid email or password.");
        return res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        });
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.");
        return res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
    }

    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password; // Elimina la contraseña antes de guardar los datos en la sesión
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
            }
            req.flash("notice", "You have logged in.");
            res.locals.account_firstname = accountData.account_firstname;
            return res.redirect("/account/");
        } else {
            req.flash("notice", "Sorry, Invalid email or password.");
            return res.status(401).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email
            });
        }
    } catch (error) {
        return new Error('Access Forbidden');
    }
}

/* ****************************************
 *  Count unread messages (to be implemented)
 * *************************************** */
async function getUnreadMessagesCount(userId) {
    // Implementa aquí tu lógica para contar los mensajes no leídos del usuario
    // Por ejemplo, podrías hacer una consulta a la base de datos
    return 5; // Cambia esto por la lógica real para obtener el conteo
}

/* ****************************************
 *  Deliver Management view
 * ************************************ */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav();
    
    // Asegúrate de que el usuario esté autenticado
    const accountData = res.locals.accountData; // Obtenemos los datos de la cuenta del usuario autenticado
    const msgNum = await getUnreadMessagesCount(accountData.id); // Llama a la función para contar mensajes no leídos

    res.render("account/management", {
        nav,
        title: "Account Management",
        errors: null,
        msgNum: msgNum, // Pasa msgNum a la vista
        locals: {
            account_firstname: accountData.account_firstname,
            accountData: accountData
        }
    });
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, buildManagement };
