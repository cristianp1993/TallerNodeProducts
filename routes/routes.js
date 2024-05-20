const router = require('express').Router();
const fs = require('fs');

const path = require('path');
const productsFilePath = path.join(__dirname, '..', 'db', 'products.json');
const debug = require('debug')('app:routes');

// Ruta para mostrar la lista de productos con opción de búsqueda
router.get('/', (req, res) => {
    const { minPrice } = req.query;

    debug('Solicitud GET recibida en / con minPrice: %s', minPrice);

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            debug('Error al leer el archivo de productos: %O', err);
            return res.status(500).send('Error al leer el archivo de productos.');
        }

        let dataJson = JSON.parse(data);
        products = dataJson.products;
        console.log(products)
        debug('Productos cargados: %O', products);

        // Aplicar filtro si se proporciona minPrice
        if (minPrice) {
            products = products.filter(product => product.product_price >= parseInt(minPrice));
            debug('Productos después de aplicar el filtro de precio: %O', products);
        }

        // Renderizar la vista index y pasar los productos
        res.render('index', { products, minPrice });
    });
});

router.post('/submit', (req, res) => {
    const newProduct = req.body;
    debug('Solicitud POST recibida en /submit con datos: %O', newProduct);

    // Leer el archivo JSON existente
    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
            debug('Error al leer el archivo de productos: %O', err);
            return res.status(500).send('Error al leer el archivo de productos.');
        }

        // Parsear los datos existentes
        let dataJson = JSON.parse(data);
        products = dataJson.products;
        console.log(products.length)
        debug('Productos existentes cargados: %O', products);

        // Crear un nuevo producto con un ID único
        const newId = products.length ? products[products.length - 1].id_product + 1 : 1;
        const productToSave = {
            id_product: newId,
            ...newProduct
        };

        // Agregar el nuevo producto al array
        products.push(productToSave);
        debug('Nuevo producto agregado: %O', productToSave);

        const updatedContent = {
            products: products
        };

        // Guardar el archivo JSON actualizado
        fs.writeFile(productsFilePath, JSON.stringify(updatedContent, null, 2), 'utf8', (err) => {
            if (err) {
                debug('Error al guardar el archivo de productos: %O', err);
                return res.status(500).send('Error al guardar el archivo de productos.');
            }

            debug('Archivo de productos actualizado con éxito');
            // Renderizar la vista de éxito
            res.render('success');
        });
    });
});

module.exports = router;
