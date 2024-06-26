URL_SERVER = 'http://localhost:8080/api/data';
URL_ARQ = 'products.json'
URL_USADA = URL_SERVER

function loadHeader() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navbarLinks = document.getElementById('navbarLinks');
    const closeMenu = document.getElementById('closeMenu')

    hamburgerMenu.addEventListener('click', function() {
        navbarLinks.classList.toggle('overlay');
    });
    closeMenu.addEventListener('click', function() {
        navbarLinks.classList.toggle('overlay');
    });
}


/* Carregar produtos do arquivo 'products.json' da URL do server ou do arquivo
   e exibir no grid */
function loadProducts(filterString = '') {
    fetch(URL_USADA)
    .then(response => response.json())
    .then(allProducts => {
        const grid = document.getElementById('productGrid');
        grid.innerHTML = ''
        const cart = getCart()
        let products = allProducts
        if (filterString) {
            products = allProducts.filter(product => product.name.toLowerCase().includes(filterString.toLowerCase()));
        }
        products.forEach(product => {
            const productCard = document.createElement('div');
            const isInCart = cart.some(pCart => product.id === pCart.id)
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: 5px 5px 0 0;">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})" id="item-card-${product.id}" class="add-card ${isInCart ? 'in-card' : ''}">
                          ${isInCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
                </button>
            `;
            grid.appendChild(productCard);
        });
    });
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

function toggleBotaoCartao(produtoId) {
    const btn = document.getElementById(`item-card-${produtoId}`)
    if (btn) {
        const classList = btn.classList
        if (classList.contains('in-card')) {
            classList.remove('in-card')
            btn.textContent = 'Adicionar ao Carrinho'
        } else {
            classList.add('in-card')
            btn.textContent = 'Remover do Carrinho'
        }
        verifyCartVolume()
    }
}

// Função para adicionar produtos ao carrinho de compras
function addToCart(productId) {
    let cart = getCart();
    const productExists = cart.some(product => product.id === productId);
    if (!productExists) {
        fetch(URL_USADA)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({...product, quantity: 1});
                localStorage.setItem('cart', JSON.stringify(cart));
                alert(`${product.name} adicionado ao carrinho.`);
                toggleBotaoCartao(product.id)
            }
        });
    } else {
        if (confirm(`Produto já está no carrinho. Deseja removê-lo?`)) {
            removeFromCart(productId)
            toggleBotaoCartao(productId)
        }
    }
}

function removeFromCart(productId) {
    let cart = getCart()
    const productIndex = cart.findIndex((product) => product.id == productId)
    cart.splice(productIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function logout() {
    localStorage.removeItem('loggedUser')
    window.location = './'
}

function loadUserContext() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || null;
    const identifier = document.getElementById('indentifier')
    if (loggedUser) {
        const {name, email} = loggedUser
        identifier.innerHTML = `
        <div class="userInfo">
            <span class="thumb"><img src="assets/thumb.png"></span>
            <span class="info">
                <span>${name}</span>
                <span>${email}</span>
            </span>
            <button onclick="logout()">sair</button>
        </div>`
        return
    }
    identifier.innerHTML = `<a href="pages/login">Entrar</a>`
}

function verifyCartVolume() {
    const theVolume = 'any-cart';
    const classTarget = '.logo-cart'
    const cart = getCart()
    if (Array.isArray(cart) && cart.length > 0) {
        const elements = document.querySelectorAll(classTarget);
        elements.forEach(function(element) {
        element.classList.add(theVolume);
    });
    } else {
        const elements = document.querySelectorAll(classTarget);
        elements.forEach(function(element) {
        element.classList.remove(theVolume);
    });
    }
}

document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value;
    const filteredResults = loadProducts(query);
});

// Inicializa a página com produtos carregados
document.addEventListener('DOMContentLoaded', () => {
    loadHeader()
    loadProducts()
    loadUserContext()
    verifyCartVolume()
});

