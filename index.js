const productos = [  // ARRAY DE PRODUCTOS 
    {
        id: 1,
        nombre: 'Blur',
        cantidad: 10,
        precio: 6700,
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmQDxh62i9jJkROomjkiUB9dGx8UKEVmxtIQ&usqp=CAU'
    },
    {
        id: 2,
        nombre: 'Arctic Monkeys',
        cantidad: 35,
        precio: 8780,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_892641-MLA32106571682_092019-O.jpg'
    },  
    {
        id: 3,
        nombre: 'Gorillaz',
        cantidad: 23,
        precio: 7650,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_690319-MLA52179852517_102022-W.jpg'
    },  
    {
        id: 4,
        nombre: 'The Strokes',
        cantidad: 70,
        precio: 8890,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_972634-MLA51987125023_102022-O.webp'
    },  
    {
        id: 5,
        nombre: 'Kings of Leon',
        cantidad: 7,
        precio: 6780,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_918419-MLA45059722076_032021-W.jpg'
    },
    {
        id: 6,
        nombre: 'The Doors',
        cantidad: 8,
        precio: 7500,
        imagen: 'https://images-eu.ssl-images-amazon.com/images/I/41Tq-hc-t0L._AC_UL750_SR750,750_.jpg'
    },
    {
        id: 7,
        nombre: 'Interpol',
        cantidad: 14,
        precio: 8600,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_763996-MLA52006628176_102022-W.jpg'
    },
    {
        id: 8,
        nombre: 'Tame Impala',
        cantidad: 23,
        precio: 6300,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_751703-MLA51952181562_102022-O.jpg'
    },



];

const contenedor = document.getElementById('contenedor'); 
const inputSearch = document.getElementById('input-search');
const contenedorCarrito = document.getElementById('contenedor-carrito');
const textoDolar = document.getElementById('precio-dolar');





const precioDolar = fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales'); //API DOLAR
const mostrarDolar = () => {
    precioDolar
    .then ( res=> res.json())
    .then ( res=> {
        const oficial = res.find (dolar => dolar.casa.agencia === '349')
        textoDolar.innerText = `Dolar oficial: Compra $${oficial?.casa.compra} - Venta $${oficial?.casa.venta}`
    });
}

let carrito = []; // ARRAY DE CARRITO DE COMPRAS

const agregarAlCarrito = (id) => {
    if (!id) {
        return;
    }
    const producto = productos.find(el => el.id === id );

    if (producto){
        const productoCarrito = new Carrito (producto.id, producto.nombre, 1, producto.precio, producto.imagen);
    
        if (carrito.some(el => el.id === id)) {  
            const target = carrito.find (el => el.id === id);
            carrito = carrito.filter(el => el.id !== id);

            const nuevoProducto =  new Carrito (target.id, target.nombre, target.cantidad + 1, target.precio, target.imagen);
            carrito.push(nuevoProducto);
        } else {
            carrito.push(productoCarrito);
        }
    
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    listarProductos(carrito);
}

const listarProductos = (productosCarrito) => {
    let acumulador = '';

    productosCarrito.forEach((producto) => {
        acumulador += `
            <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${producto.total}</td>
            </tr>
        
        `
    })

    contenedorCarrito.innerHTML = acumulador;

}

class Carrito { // CARRITO DE COMPRAS 
    constructor (id, nombre, cantidad, precio, imagen) {
        this.id = id; 
        this.nombre= nombre;
        this.cantidad = cantidad;
        this.precio = precio;
        this.imagen = imagen;
        this.total = precio * cantidad;
    }
}

const dibujarVinilos = (productos, contenedor) => { 
    let acumulador = '';

    productos.forEach(element => {
        acumulador += `
        <div class="card" style="width: 18rem; border-color: rgb(130, 201, 177)">
            <img src="${element.imagen}" class="card-img-top" alt="${element.nombre}">
        <div class="card-body">
            <h5 class="card-title">${element.nombre}</h5>
            <p class="card-text">Cantidad disponible: ${element.cantidad}</p>
            <p class="card-text">Precio: $ ${element.precio}</p>
            <a href="#" onclick="agregarAlCarrito(${element.id})" class="btn btn-primary btn-agregar">Agregar al carrito</a>
        </div>
        </div>
        `
        
    });

    contenedor.innerHTML = acumulador
    
}

dibujarVinilos(productos, contenedor);


//TOAST
const colores = ['LimeGreen', 'LightGreen', 'SpringGreen', 'ForestGreen', 'YellowGreen'];
const nombres = ['Julieta', 'Lucila', 'Marcos', 'Emanuel', 'Patricia'];
const bandas = ['Arctic Monkeys', 'Kings of Leon', 'Blur', 'The Strokes', 'Gorillaz'];
const toast = (nombre, tiempo, color, banda) => Toastify({
    text: `${nombre} compró vinilo ${banda} hace ${tiempo} segundos`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom", 
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: `linear-gradient(to right, ${color})`,
    },
    
  })

window.setInterval (() => {
    const random = Math.floor(Math.random() * 5);

    toast(nombres[random], Math.ceil(Math.random()*100), colores[random], bandas[Math.floor(Math.random()*5)]).showToast();
  }, 4000);




  const handleSearch = (e) => {         //BUSCADOR
    const filtrados = productos.filter(producto => producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()))

    dibujarVinilos(filtrados, contenedor);
} 

if (localStorage.getItem('carrito')) { // RECUPERAR CARRITO GUARDADO EN EL STORAGE 
    carrito =  JSON.parse(localStorage.getItem('carrito'));
    listarProductos(carrito);
}


mostrarDolar();

inputSearch.addEventListener('input', handleSearch);


