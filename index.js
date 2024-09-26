import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

// implementing express
const app = express();

const cart = [];

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get("/", (req, res) => {
    res.render('index', { cart });    
})

app.get("/cart", (req, res) => {
    res.render('cart', { cart });
})

app.post("/add-to-cart", (req, res) => {
    const { name, price, img} = req.body;

    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1, img:`/img/${img}` });
    }

    res.status(201).json(cart.length);
})

app.get("/cart",(req,res)=>{
    res.render("cart",{cart:cart})
})

app.post('/remove-from-cart', (req, res) => {
    const { name } = req.body;

    // Find the index of the product in the cart
    const productIndex = cart.findIndex(product => product.name === name);
    if (productIndex >= 0) {
        // Remove the product from the cart array using splice
        cart.splice(productIndex, 1);
        return res.status(200).json({ success: true });
    } else {
        // If product not found in cart
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
});


// setting up server on port 3000
app.listen(3000, () => {
    console.log(`The server is running on port 3000`);
})