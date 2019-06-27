const oAuth2 = require('disco-oauth');
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookies = require('cookies');

const OAuth2 = new oAuth2(process.env.CLIENTID, process.env.CLIENTSEC);
OAuth2.setScopes(['identify', 'guilds']);
OAuth2.setRedirect('http://localhost:5665/dashboard/overview');

class InitWebPage {

    constructor(port) {

        this.app = express();
        this.app.engine('hbs', hbs({

            extname: 'hbs',
            layoutsDir: path.join(__dirname, 'layouts'),
            defaultLayout: 'layout',

        }));

        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'hbs');
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(cookies.express(["some", "random", "keys"]));

        this.registerWebPages();

        this.Server = this.app.listen(port, () => {

            console.log(`Server is listening on port ` + this.Server.address().port.toString());

        });

    }

    registerWebPages() {

        this.app.get('/', (req, res) => {

            res.redirect('/welcome');

        });

        this.app.get('/welcome', (req, res) => {

            res.render('welcome', {

                title: 'welcome',
                AuthLink: OAuth2.getAuthCodeLink()

            })

        });

    }

}

module.exports = InitWebPage;
