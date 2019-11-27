const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
var pizza = require('./pizza.json');
app.set('view engine', 'hbs');
//Initialize Body Parser
app.use(bodyParser.urlencoded({ extended: false }));


//EXPLORING THE JSON FILE 
var pizzaSizes;
var pizzaCrusts;
var pizzaToppings

if ((pizza !== undefined) && (pizza.length > 0)) {
    pizza.forEach((types) => {
        pizzaSizes = types.size;
        pizzaCrusts = types.crust;
        pizzaToppings = types.toppings;

        return pizzaSizes, pizzaCrusts, pizzaToppings
    });
}


//PIZZA SIZE CONST
const pizzaSize = Object.keys(pizzaSizes);
const pizzaSizeValue = Object.values(pizzaSizes);

//PIZZA CRUST CONST
const pizzaCrust = Object.keys(pizzaCrusts)
const pizzaCrustValue = Object.values(pizzaCrusts)

//PIZZA TOPPINGS CONST
const pizzaTopping = Object.keys(pizzaToppings)
const pizzaToppingValue = Object.values(pizzaToppings)

//REQUIRING CALCULATOR MODULES
const calculator = require('./priceCalculator');

// ********

app.get('/', (req, res) => {
    let pToppings = pizzaTopping;
    let pCrust = pizzaCrust;
    let pSize = pizzaSize;

    res.render('index', { pToppings: pToppings, pCrust: pCrust, pSize: pSize });
});

// SETTING VARIABLES THAT WILL BE USED ON POST RESQUEST
let firstName = "";
let lastName = "";
let qty = 1;
let toppings = [];
let size = "";
let crust = "";
let phone;
let address = "";
// ...rest of the initial code omitted for simplicity.

app.use(express.json());
app.post('/confirmation', (req, res) => {
    // console.log('Received ', req.body);
    // const errors = validationResult(req);
    // if (errors.isEmpty()) {
    //     return res.status(422).jsonp({ errors: errors.array() });
    // } else {

    //GETTING AND SETTING THE VARIABLES FROM POST REQUEST
    qty = req.body.qty;
    toppings = req.body.toppings;
    size = req.body.size;
    crust = req.body.crust;;
    firstName = req.body.firstName;
    lastName = req.body.lastName;
    phone = req.body.phone;
    address = req.body.address;
    let regexPhone = new RegExp('^[0-9]{10}$');

    if (firstName == "" || lastName == "" || toppings == undefined ||
        crust == 0 || size == 0 || phone == "" || address == "" || 
        !regexPhone.test(phone)) {
        var errorLogin = 'Some Invalid Input!'
        const url = require('url');
        // res.render('./index', { error: errorLogin});
        res.redirect(url.format({
            pathname: "/",
            error: errorLogin,
        })
        );
    } else {


        //GETTING THE PRICE FROM THE CHOOSED TOPPINGS
        var pricePizza = []
        for (let i = 0; i < pizzaTopping.length; i++) {
            if (pizzaToppingValue[pizzaTopping.indexOf(toppings[i])] != undefined) {
                pricePizza.push(pizzaToppingValue[pizzaTopping.indexOf(toppings[i])])
            }
        }
        //GETTING THE PRICE FROM THE CHOOSED SIZE AND CRUST
        var sizePrice = 0;
        var crustPrice = 0;
        if (pizzaSizeValue[pizzaSize.indexOf(size)] != undefined &&
            pizzaCrustValue[pizzaCrust.indexOf(crust)] != undefined) {
            sizePrice = pizzaSizeValue[pizzaSize.indexOf(size)]
            crustPrice = pizzaCrustValue[pizzaCrust.indexOf(crust)]
        }

        //WORKING WITH THE CALCULATOR MODULE
        let arrayTotal = [];
        arrayTotal = arrayTotal.concat(pricePizza, sizePrice, crustPrice);

        var subtotal = 0;
        subtotal = calculator.subTotal(arrayTotal, subtotal, qty);

        var taxesValue = 0;
        taxesValue = calculator.taxesCalculator(subtotal);

        var totalValue = 0;
        totalValue = calculator.totalCalculator(subtotal, taxesValue, totalValue)

        res.render('confirmation', {
            qty: qty, toppings: toppings, size: size, crust: crust,
            firstName: firstName, lastName: lastName, phone: phone,
            address: address, pizzaPrice: pricePizza, sizePrice: sizePrice,
            crustPrice: crustPrice, suTotal: subtotal, taxesValue: taxesValue,
            totalValue: totalValue
        });
    }
});



app.post('/thankyou', (req, res) => {
    let order = {
        "NAME" : firstName + ' ' + lastName,
        "ADDRESS" : address,
        "PHONE" : phone,
        "ORDER" : [toppings, size, crust],
        "QTY" : qty
    };
    const fs = require('fs');
    
    let data = JSON.stringify(order, null, 2);
    fs.writeFileSync('orders.json', data);
    res.render('thankyou', { firstName: firstName, lastName: lastName });
});

app.listen(port, () => console.log(
    `Express started on http://localhost:${port};`
    + `press Ctrl-C to terminate.`));



