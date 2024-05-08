import * as fs from 'fs';

// Falta GET id, and modifiy
 export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //Handle errors 
    #errors = false;

    //Generate ID
    #getMaxId(array) {
        let maxId = 0;
        array.map((prod) => {
            if (prod.id > maxId) maxId = prod.id;
        });
        return ++maxId;
    }


    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, "utf8");
                return JSON.parse(products);
            } else return [];
        } catch (error) {
            console.log(error);
        }
    }

    async createProduct(product) {
        try {
            let expectedProps = [
                "title",
                "description",
                "price",
                "thumbnail",
                "code",
                "stock",
            ];

            //Validate required fields
            if (!Object.keys(product).every((i) => expectedProps.includes(i)))
                return "Some field is missing.";

            //Validate required values
            if (Object.values(product).includes(undefined))
                return "All the field are necesary.";

            const productsFile = await this.getProducts();
            if (productsFile.length != 0) {
                for (const prod of productsFile) {
                    if (prod.code == product.code) {
                        return product.title + ": The field 'Code' is already existing. Please change it and try again."
                    }
                }

                //Add Id
                product.id = this.#getMaxId(productsFile)

                // Overwrite json with new product
                productsFile.push(product);

                // Create json with new product
                return await fs.promises.writeFile(this.path, JSON.stringify(productsFile));

                // Create json with new product
            } else return await fs.promises.writeFile(this.path, JSON.stringify([product]));

        } catch (error) {
            console.log(error);
        }
    }

    async getProducById(idProduct) {
        //Get products
        const productsFile = await this.getProducts();
        for (const prod of productsFile) {
            if (prod.id == idProduct) return prod;
        }
        return "Error: No found";
    }
}

