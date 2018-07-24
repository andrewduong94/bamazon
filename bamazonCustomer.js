var mysql = require("mysql");
var inquirer = require("inquirer");
var inventory;
var quantity;
var productID;
var productPrice;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var i;
    for (i = 0; i < res.length; i++){
        console.log(`ID: ${res[i].id}
        Product Name: ${res[i].product_name} 
        Price: $${res[i].price}`);
    }
    inventory = res;
    buy();
  })
  
}

function buy(){
    inquirer.prompt([

        {
          type: "input",
          name: "purchaseProduct",
          message: "Which product would you like to buy? *Enter Product ID?"
        },
      
        {
          type: "input",
          name: "purchaseQuantity",
          message: "How many?",
        }
       
      ]).then(function(user) {
      
    if (user.purchaseProduct && user.purchaseQuantity){
        if (user.purchaseQuantity > inventory[user.purchaseProduct].stock_quantity){
            console.log("Insufficient quantity!")
        }
        else{
            quantity = user.purchaseQuantity;
            productPrice = inventory[user.purchaseProduct-1].price
            productID = user.purchaseProduct;
            makePurchase()
        }
    }
    else{
        console.log("Missing input...Please try again")
        connection.end();
    }
      });
    
}

function makePurchase(){
updateQuantity = inventory[productID-1].stock_quantity - quantity;
console.log(updateQuantity);
connection.query("UPDATE products SET stock_quantity = ? WHERE ID= ?", [updateQuantity, productID], function(err, res, fields){
    if (err) throw err;
    console.log(`Total: $${quantity*productPrice}`);
    console.log('Transaction Successful')
    connection.end();
})
};