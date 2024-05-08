import express from 'express';
import { ProductManager } from './productManager.js';

const app = express();
app.use(express.json());

const productManager = new ProductManager('./products.json')

app.get('/products/:id', async (req, res) => {
    try {
        const products =  await productManager.getProducts();
        res.status(200).json(products);
    } catch {
        res.status(500).json({msg: 'Server error'});
    }
  
})

app.get('/prod'), async(req, res) => {
    try {
        const products =  await productManager.getProducts();
        res.status(200).json(products);
    } catch {
        res.status(500).json({msg: 'Server error'});
    }
    // try {
    //     res.send('asdasdasd')
    //     // const {idProd} = req.params;
    //     // const product = await productManager.getProducById(idProd);
    //     // if(!product) res.status(404).json({msg: 'ERROR-CUSTOM'})
    //     // else res.status(200).json(product);
    // } catch(error){
    //     console.log('something')
    //     // console.log(error);
    //     // res.status(500).json({msg: 'ERROR-CUSTOM'})

    // }
}
app.listen(8080, ()=>console.log(`Server ok on port 8080`))