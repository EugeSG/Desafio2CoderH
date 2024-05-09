import * as fs from 'fs';

// Falta GET id, and modifiy

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    //Generate ID -- It should be different
    #getMaxId(array) {
        if (array[array.length - 1].id) {
            return array[array.length - 1].id + 1;
        }
        return 1
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
        // Find id
        for (const prod of productsFile) {
            if (prod.id == idProduct) return prod;
        }
        return "Error: Not found";
    }

    async updateProduct(obj, id) {
        try {
            if(!id) return "Faltan parámetros";
            let productExist = await this.getProducById(id);
            if (productExist == "Error: Not found") return productExist;
            else {
                const productsFile = await this.getProducts();
                productExist = { ...productExist, ...obj };
                let index = productsFile.findIndex((element) => element.id == id);
                const newArray = productsFile.filter((u) => u.id !== id);
                newArray.splice(index, 0, productExist);
                await fs.promises.writeFile(this.path, JSON.stringify(newArray));
                return productExist;
            }

        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const productExist = await this.getUserById(id);
            if (!productExist) return 'Error: Not found';
            const productsFile = await this.getProducts();
            if (productsFile.length > 0) {
                const newArray = productsFile.filter((u) => u.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(newArray));
                return productExist;
            } else return 'Error: The file is empty';
        } catch (error) {
            console.log(error);
        }
    }
}


