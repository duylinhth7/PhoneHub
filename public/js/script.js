//Flash
const flash = document.querySelectorAll(".alert-flash");
if (flash) {
    setTimeout(() => {
        flash.forEach(alert => {
            alert.classList.add("hide");
            setTimeout(() => alert.remove(), 500); // xóa hẳn khỏi DOM sau 0.5s
        })
    }, 3000);
}
//End Flash

//SWIPER
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});
var swiper2 = new Swiper(".mySwiper2", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});
//END SWIPER

//Thêm cart vào LocalStorage
const cart = localStorage.getItem("cart");
if (!cart) {
    localStorage.setItem("cart", "[]");
}
//ENd Thêm cart vào LocalStorage

//Add to cart
const formAddToCart = document.querySelector("#formAddToCart");
if (formAddToCart) {
    formAddToCart.addEventListener("submit", (e) => {
        e.preventDefault()
        const productId = formAddToCart.getAttribute("phone-id");
        const quantity = parseInt(e.target.quantity.value);
        if (productId && quantity > 0) {
            const product = {
                productId: productId,
                quantity: quantity
            };
            const cart = JSON.parse(localStorage.getItem("cart"));
            const exitsItems = cart.find(item => item.productId === product.productId);
            if (exitsItems) {
                exitsItems.quantity += product.quantity;
            } else {
                cart.push(product);
            };
            localStorage.setItem("cart", JSON.stringify(cart));
            miniCart()
        }

    })
}
//End add to cart

//Hiển thị số lượng trên Cart
const miniCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart) {
        const total = cart.reduce((sum, item) => sum += item.quantity, 0);
        const innerCart = document.querySelector("[mini-cart]");
        if (innerCart) {
            innerCart.innerHTML = total
        }
    }
}
miniCart()
//End hiển thị số lượng trên Cart


//Vẽ ra giỏ hàng ra giao diện
const drawCart = () => {
    const tableCart = document.querySelector("[table-cart]");
    if (tableCart) {
        fetch("/cart/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: localStorage.getItem("cart")
        })
            .then(res => res.json())
            .then(data => {
                if (data.listCart.length > 0) {
                    const cartEmpty = document.querySelector(".cart-empty");
                    cartEmpty.classList.add("hidden")
                    const total = data.listCart.reduce((sum, item) => {
                        return sum + item.quantity * item.special_price;
                    }, 0);
                    const htmls = data.listCart.map((item, index) => (
                        `<tr>
            <td>${index + 1}</td>
            <td>
              <img 
                src="${item.image}" 
                alt="${item.title}" 
                width="80px"
              >
            </td>
            <td>
              <a href="/products/${item.slug}">
                ${item.title}
              </a>
            </td>
            <td>
              ${item.special_price.toLocaleString("vi-VI")}đ
            </td>
            <td>
              <input type="number" name="quantity" quantity value="${item.quantity}" min="1" max=${item.stock} item-id="${item.id}" style="width: 60px">
            </td>
            <td>
              ${item.totalPrice.toLocaleString("vi-VI")}đ
            </td>
            <td>
              <button class="btn btn-sm btn-danger" btn-delete="${item.id}">Xóa</button>
            </td>
          </tr>`
                    ));
                    const tbody = document.querySelector("tbody");
                    if (tbody) {
                        tbody.innerHTML = htmls.join(" ")
                    }
                    const innerTotal = document.querySelector("[total-price]");
                    innerTotal.innerHTML = total.toLocaleString("vi-VI")
                    updateQuantity();
                    deleteProduct();
                    miniCart()
                } else {
                    const formInputInfo = document.querySelector('[form-input-info]');
                    const priceTotal = document.querySelector("h5.total-price")
                    priceTotal.classList.add("hidden")
                    tableCart.classList.add("hidden")
                    formInputInfo.classList.add("hidden")
                }
            });
    }
}
drawCart()
//End Vẽ ra giỏ hàng ra giao diện

//Cập nhật số lượng
const updateQuantity = () => {
    const listInputQuantity = document.querySelectorAll('[table-cart] input[name="quantity"]');
    if (listInputQuantity) {
        listInputQuantity.forEach(item => {
            item.addEventListener("change", (e) => {
                const newQuantity = parseInt(e.target.value);
                const productId = item.getAttribute("item-id");
                if (newQuantity > 0) {
                    const cart = JSON.parse(localStorage.getItem("cart"));
                    const exitsItem = cart.find(item => item.productId === productId);
                    if (exitsItem) {
                        exitsItem.quantity = newQuantity;
                        localStorage.setItem("cart", JSON.stringify(cart));
                        drawCart()
                    }
                }

            })
        })
    }
}
//End cập nhật số lượng

//Xóa sản phẩn khỏi giỏ hàng
const deleteProduct = () => {
    const listButtonDelete = document.querySelectorAll("[table-cart] [btn-delete]");
    if (listButtonDelete) {
        listButtonDelete.forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("btn-delete");
                const cart = JSON.parse(localStorage.getItem("cart"));
                const newCart = cart.filter(item => item.productId != productId);
                localStorage.setItem("cart", JSON.stringify(newCart));
                drawCart();
            })
        })
    }
}
//End xóa sản phẩm khỏi giỏ hàng


//Đặt sản phẩm
const formOrder = document.querySelector("[form-order]");
if (formOrder) {
    formOrder.addEventListener("submit", (e) => {
        e.preventDefault();
        const infoOrder = {
            fullName: e.target.fullName.value,
            phone: e.target.phone.value,
            note: e.target.note.value,
            address: e.target.address.value
        };
        const dataOrder = {
            infoOrder: infoOrder,
            cart: JSON.parse(localStorage.getItem("cart"))
        }
        fetch("/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataOrder)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == 200) {
                    localStorage.setItem("cart", '[]');
                    window.location.href = "/order/success";
                }
            })
    })
}
//End đặt sản phẩm

//PHẦN SLICK SLIDER
$('.product-slider').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 900,
});
// END PHẦN SLICK SLIDER

//PANIGATION - PHÂN TRANG
const buttonPanigation = document.querySelectorAll("[button-panigation]");
if (buttonPanigation) {
    buttonPanigation.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-panigation");
            const url = new URL(window.location.href);
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
    })
}
//END PANIGATION - PHÂN TRANG


//PHẦN SEARCH SUGGEST
const formSeach = document.querySelector("#search-form");
if (formSeach) {
    formSeach.addEventListener("keyup", (e) => {
        const value = e.target.value.trim();
        const suggestBox = document.querySelector("#search-suggest");
        //FETCH API SEARCH
        fetch(`/search/suggest?q=${value}`, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                if (data !== 400) {
                    // Tạo gợi ý
                    suggestBox.innerHTML = data.map(p => `
                    <li class="list-group-item">
                        <a href="/products/${p.slug}" class="text-decoration-none text-dark d-flex align-items-center">'
                            <img src="${p.image}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px;" />
                            <b>${p.title}</b>
                        </a>
                    </li>
                    `).join("");
                    suggestBox.style.display = "block";
                } else {
                    suggestBox.innerHTML = `<li class="list-group-item">Không tìm thấy sản phẩm...</li>`
                    suggestBox.style.display = "block";
                }
            });
        // Ẩn gợi ý khi click ra ngoài
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".form-search")) {
                suggestBox.style.display = "none";
            }
        });
    })
}
//END PHẦN SEARCH SUGGEST


//Phần SORT PRODUCT
const buttonSort = document.querySelectorAll("[button-sort]");
if(buttonSort){
    const url = new URL(window.location.href);
    buttonSort.forEach(button => {
        button.addEventListener("click", () => {  
            const value = button.getAttribute("button-sort");
            url.searchParams.set("sort", value);
            window.location.href = url.href;
        })
    })
}
//END Phần SORT PRODUCT