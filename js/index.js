const baseUrl = "https://livejs-api.hexschool.io";

const productWrapDOM = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCartTableDOM = document.querySelector(".shoppingCart-table");

const orderInfoForm = document.querySelector(".orderInfo-form");

console.log("productWrapDOM:", productWrapDOM);
console.log("productSelect:", productSelect);
console.log("shoppingCartTableDOM:", shoppingCartTableDOM);
console.log("orderInfoForm:", orderInfoForm);

let products = [];
//   /api/livejs/v1/customer/{api_path}/carts
let carts = [];

function addCardBtnHandler(e) {
  e.preventDefault();
  console.log("e:", e.target.dataset.id);
  const product_id = e.target.dataset.id;
  //   /api/livejs/v1/customer/{api_path}/carts
  const apiPath = `${baseUrl}/api/livejs/v1/customer/yuschool/carts`;
  //   檢查 carts 是否有。假如沒有就新增。假如有就要 原有數量+=1 再送出

  const product = carts.filter((p) => p.product.id === product_id);
  console.log("product", product);
  let quantity = (Number(product[0]?.quantity) || 0) + 1;

  console.log("quantity:", quantity);

  const payload = {
    data: {
      productId: product_id,
      quantity: quantity,
    },
  };
  axios.post(apiPath, payload).then((res) => {
    console.log("res:", res);

    carts = res.data.carts;
    const finalTotal = res.data.finalTotal;
    renderCartTable(carts, finalTotal);
  });
}

function renderCards(products) {
  let html = ``;
  products.forEach((product) => {
    html += `
        </li>
            <li class="productCard">
            <h4 class="productType">${product.category}</h4>
            <img
                src="${product.images}"
                alt="${product.id}"
            />
            <a href="#" data-id="${
              product.id
            }" class="addCardBtn">加入購物車</a>
            <h3>${product.title}</h3>
            <del class="originPrice">NT$${product.origin_price.toLocaleString()}</del>
            <p class="nowPrice">NT$${product.price.toLocaleString()}</p>
        `;
  });
  productWrapDOM.innerHTML = html;
  productWrapDOM.addEventListener("click", function (e) {
    console.log("e:", e.target.nodeName);
    e.target.nodeName === "A" && addCardBtnHandler(e);
  });
}

function productSelectHanlder(e) {
  let category = e.target.value;
  console.log("category:", category);
  let categorys = products.filter((p) => {
    if (category === "全部") {
      return true;
    }

    return p.category === category;
  });
  console.log("categorys:", categorys);

  renderCards(categorys);
}

function discardBtnHandler(e) {
  e.preventDefault();
  const id = e.target.dataset.id;
  console.log("id:", id);
  // /api/livejs/v1/customer/{api_path}/carts/{id}

  const apiPath = `${baseUrl}/api/livejs/v1/customer/yuschool/carts/${id}`;
  axios
    .delete(apiPath)
    .then((response) => {
      console.log(`刪除${id} res:`, response.data);
      renderCartTable(response.data.carts, response.data.finalTotal);
    })
    .catch((error) => {
      console.log("error:", error);
    });
}

function discardAllBtnHandler(e) {
  e.preventDefault();
  console.log("e:", e.target);
  // 打刪除 api
  // /api/livejs/v1/customer/{api_path}/carts
  // {
  //   "status": true,
  //   "carts": [],
  //   "total": 0,
  //   "finalTotal": 0,
  //   "message": "購物車產品已全部清空。 (*´▽`*)"
  // }
  const apiPath = `${baseUrl}/api/livejs/v1/customer/yuschool/carts`;
  axios.delete(apiPath).then((response) => {
    console.log("全部刪除 res:", response.data);
    renderCartTable(response.data.carts, response.data.finalTotal);
  });

  // 在呼叫一次 randerCartTable()
}

function renderCartTable(carts, finalTotal) {
  //
  let html = ``;
  carts.forEach((cart) => {
    html += `
                   <tr>
                    <td>
                      <div class="cardItem-title">
                        <img src="https://i.imgur.com/HvT3zlU.png" alt="" />
                        <p>${cart.product.title}</p>
                      </div>
                    </td>
                    <td>NT$${cart.product.price.toLocaleString()}</td>
                    <td>${cart.quantity}</td>
                    <td>NT$${(
                      cart.product.price * cart.quantity
                    ).toLocaleString()}</td>
                    <td class="discardBtn">
                      <a href="#" data-id="${
                        cart.id
                      }" class="material-icons"> clear </a>
                    </td>
                  </tr>
                  `;
  });
  shoppingCartTableDOM.querySelector("tbody").innerHTML = html;
  shoppingCartTableDOM.querySelector("tfoot").innerHTML = `
                   <tr>
                    <td>
                      <a href="#" class="discardAllBtn">刪除所有品項</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                      <p>總金額</p>
                    </td>
                    <td>NT$${finalTotal.toLocaleString()}</td>
                  </tr>
              `;
  // discardBtn
  const discardBtns = shoppingCartTableDOM.querySelectorAll(".discardBtn");
  discardBtns.forEach((btn) => {
    console.log("btn:", btn);
    btn.addEventListener("click", discardBtnHandler);
  });

  const discardAllBtn = shoppingCartTableDOM.querySelector(".discardAllBtn");

  discardAllBtn.addEventListener("click", discardAllBtnHandler);
}

function orderInfoHabndler(e) {
  e.preventDefault();
  console.log("e:", e.target["姓名"].value);
  const name = e.target["姓名"].value.trim();
  const tel = e.target["電話"].value.trim();
  const email = e.target["Email"].value.trim();
  const address = e.target["寄送地址"].value.trim();
  const payment = e.target["交易方式"].value.trim();

  console.log(name, tel, email, address, payment);

  let payload = {
    data: {
      user: {
        name,
        tel,
        email,
        address,
        payment,
      },
    },
  };

  console.log("payload", payload);
  const apiPath = `${baseUrl}/api/livejs/v1/customer/yuschool/orders`;
  console.log("apiPath", apiPath);

  axios
    .post(apiPath, payload)
    .then((response) => {
      console.log("訂單回應:", response.data);
      if (response.data.status) {
        alert("訂單建立成功！");
      } else {
        alert(response.data.message);
      }
    })
    .catch((error) => {
      console.error("錯誤:", error);
      if (error.response) {
        console.error("錯誤回應:", error.response.data);
        alert(error.response.data.message);
      } else {
        alert("訂單建立失敗");
      }
    });
}
function init() {
  axios
    .get(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/yuschool/products"
    )
    .then(function (response) {
      // 成功會回傳的內容
      if (response.data.status) {
        products = response.data.products;
        console.log("products", products);
        renderCards(products);

        productSelect.addEventListener("change", productSelectHanlder);
      }
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });

  axios
    .get(
      "https://livejs-api.hexschool.io/api/livejs/v1/customer/yuschool/carts"
    )
    .then(function (response) {
      if (response.data.status) {
        console.log("carts:", response.data);
        const finalTotal = response.data.finalTotal;
        carts = response.data.carts;
        console.log("carts:", carts);
        renderCartTable(carts, finalTotal);
      }
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });

  orderInfoForm.addEventListener("submit", orderInfoHabndler);
}

init();
