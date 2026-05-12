/**
 * ============================================================
 * ARCHIVO: js/carrito.js
 * PROPÓSITO: Carrito flotante y panel lateral.
 * ============================================================
 */

const Carrito = (() => {

    let items = [];

    function inicializar() {
        const root = document.getElementById('carrito-root');
        if (!root) return;

        root.innerHTML = `
            <button class="cart-fab" id="cartFab" aria-label="Ver carrito">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-fab__badge" id="cartBadge">0</span>
            </button>
            <div class="cart-panel__overlay" id="cartOverlay"></div>
            <div class="cart-panel" id="cartPanel" role="dialog" aria-label="Carrito de compras">
                <div class="cart-panel__header">
                    <span class="cart-panel__title">🛒 Tu Carrito</span>
                    <button class="cart-panel__close" id="cartClose" aria-label="Cerrar carrito">&times;</button>
                </div>
                <div class="cart-panel__body" id="cartBody"></div>
                <div class="cart-panel__footer">
                    <div class="cart-total">
                        <span>Total</span>
                        <span id="cartTotal">$0</span>
                    </div>
                    <button class="cart-checkout-btn" id="cartCheckout" disabled>
                        <i class="fas fa-check-circle"></i> Proceder al pago
                    </button>
                </div>
            </div>
        `;

        document.getElementById('cartFab').addEventListener('click', abrir);
        document.getElementById('cartClose').addEventListener('click', cerrar);
        document.getElementById('cartOverlay').addEventListener('click', cerrar);
        document.getElementById('cartCheckout').addEventListener('click', checkout);
    }

    function agregar(producto) {
        const qty = producto._cantidadModal || 1;
        const idx = items.findIndex(i => i.nombre === producto.nombre);
        if (idx >= 0) {
            items[idx].qty += qty;
        } else {
            items.push({ ...producto, qty });
        }
        actualizar();
        abrir();
    }

    function actualizar() {
        const total = items.reduce((s, i) => {
            const p = parseInt(String(i.precio).replace(/[^0-9]/g, ''));
            return s + p * i.qty;
        }, 0);

        const totalCount = items.reduce((s, i) => s + i.qty, 0);
        const badge = document.getElementById('cartBadge');
        badge.textContent = totalCount;
        badge.classList.toggle('visible', totalCount > 0);

        document.getElementById('cartTotal').textContent = '$' + Utils.formatPrice(total);
        document.getElementById('cartCheckout').disabled = items.length === 0;

        const body = document.getElementById('cartBody');
        if (items.length === 0) {
            body.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i>Tu carrito está vacío</div>`;
            return;
        }

        body.innerHTML = items.map((item, idx) => {
            const precio = parseInt(String(item.precio).replace(/[^0-9]/g, ''));
            return `
            <div class="cart-item">
                ${item.imagen
                    ?`<img src="productos/${item.imagen}.png" alt="${Utils.escapeHtml(item.nombre)}" class="cart-item__img">`
                    : `<span class="cart-item__emoji">📦</span>`
                }
                <div class="cart-item__info">
                    <p class="cart-item__name">${Utils.escapeHtml(item.nombre)}</p>
                    <p class="cart-item__price">$${Utils.formatPrice(precio * item.qty)}</p>
                    <div class="cart-item__qty">
                        <button data-idx="${idx}" data-action="minus" aria-label="Disminuir">−</button>
                        <span>${item.qty}</span>
                        <button data-idx="${idx}" data-action="plus" aria-label="Aumentar">+</button>
                    </div>
                </div>
                <button class="cart-item__remove" data-idx="${idx}" aria-label="Eliminar"><i class="fas fa-trash"></i></button>
            </div>`;
        }).join('');

        body.querySelectorAll('.cart-item__qty button').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = parseInt(btn.dataset.idx);
                if (btn.dataset.action === 'plus') items[i].qty++;
                else if (items[i].qty > 1) items[i].qty--;
                else items.splice(i, 1);
                actualizar();
            });
        });

        body.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.addEventListener('click', () => {
                items.splice(parseInt(btn.dataset.idx), 1);
                actualizar();
            });
        });
    }

    function checkout() {
        if (items.length === 0) return;
        const primer = items[0];
        primer._cantidadCarrito = primer.qty;
        cerrar();
        ReservaModal.abrir(primer, () => {
            Productos.descontarStock(primer.nombre);
            items = [];
            actualizar();
            cerrar();
        });
    }

    function abrir() {
        document.getElementById('cartPanel').classList.add('open');
        document.getElementById('cartOverlay').classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function cerrar() {
        document.getElementById('cartPanel').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('visible');
        document.body.style.overflow = '';
    }

    return { inicializar, agregar };

})();
