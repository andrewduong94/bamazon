var mysql = require("mysql");
var inquirer = require("inquirer");
var inventory;
var productList = [];

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

function afterConnection(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inventory = res;
    })

    inquirer.prompt([

        {
            type: "list",
            name: "managerAction",
            message: "Select one",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
        }
       
      ]).then(function(user) {
      
    if (user.managerAction){
        if (user.managerAction === "View products for sale"){
            showInventory()
        }
        if (user.managerAction === "View low inventory"){
            showLowInventory()
        }
        if (user.managerAction === "Add to inventory"){
            addInventory()
        }
        if (user.managerAction === "Add new product"){
            addProduct()
        }
    }
    else{
        console.log("Sorry no request...Bye!")
        connection.end();
    }
      });
};

function showInventory(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        var i;
        for (i = 0; i < res.length; i++){
            console.log(`ID: ${res[i].id}
            Product Name: ${res[i].product_name} 
            Price: $${res[i].price}
            Quantity: ${res[i].stock_quantity}`);
        }
        connection.end();
})
};

function showLowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        var i;
        for (i = 0; i < res.length; i++){
            console.log(`ID: ${res[i].id}
            Product Name: ${res[i].product_name} 
            Price: $${res[i].price}`);
        }
        connection.end();
})
};

function addInventory(){
    for (i = 0; i < inventory.length; i++){
        productList.push(inventory[i].product_name)
    }
    inquirer.prompt([

        {
            type: "list",
            name: "addQuantity",
            message: "Select Product",
            choices: productList
        },
        {
            type: "list",
            name: "addAmount",
            message: "Select Quantity to Add",
            choices: ["1","5","10","20"]
        }
    
       
      ]).then(function(user) {
        if (user.addQuantity && user.addAmount){
            totalProductInventory = 
            connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name= ?", [user.addAmount, user.addQuantity], function(err, res) {
                if (err) throw err;
                console.log(`Updated stock!`)
            })
            connection.end();
        }
        else{
            console.log("Missing input...Try again")
            connection.end();                        
        }
})
};

function addProduct(){
    inquirer.prompt([
      {
        type: "input",
        name: "inputName",
        message: "What is the product name?"
      },
    
      {
        type: "input",
        name: "inputDept",
        message: "What department?"
      },
      {
          type: "input",
          name: "inputPrice",
          message: "How much does it cost?"
      },
      {
          type: "input",
          name: "inputQuantity",
          message: "How many?"
      }
     
    ]).then(function(user) {
    
    if (user.inputName && user.inputDept && user.inputPrice && user.inputQuantity){

        connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)", [user.inputName, user.inputDept, user.inputPrice, user.inputQuantity], function(err, res) {
        if (err) throw err;
            console.log(`Added new product!`)
            })
            connection.end();
        }
        else{
            console.log("Missing input...Try again")
            connection.end();                        
        }
})
};



