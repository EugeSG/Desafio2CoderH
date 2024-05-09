import express from 'express';
import { ProductManager } from './productManager.js';

const app = express();
app.use(express.json());

const productManager = new ProductManager('./products.json')

app.get('/products', async (req, res) => {
    // Se puede corroborar que la query sea "limit" y no otra.
    const numOflimit = req.query.limit
    try {
        const products =  await productManager.getProducts();
        if(numOflimit) res.status(200).json(products.slice(0, numOflimit));
        else res.status(200).json(products); 
    } catch {
        res.status(500).json({msg: 'Server error'});
    }
  
})

app.get('/products/:pid', async(req, res) => {
    try {
        const product = await productManager.getProducById(req.params.pid);
        if(!product) res.status(404).json({msg: 'Not found'})
        else res.status(200).json(product);
    } catch(error){
        console.log(error);
        res.status(500).json({msg: 'Server Error'})

    }
})
app.listen(8080, ()=>console.log(`Server ok on port 8080`));