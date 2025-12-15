const baseUrl = "https://livejs-api.hexschool.io";

const topBarMeun = document.querySelectorAll(".topBar-menu a");
const orderPageTable = document.querySelector(".orderPage-table");
console.log("topBarMeun:", topBarMeun[0]);

let token = "";
let orders = [];

function adminLoginHandler(e) {
  console.log("adminLogin");
  token = prompt("輸入token", "AJHFU1C9nCPFhGfn6Gnr5RqsYGH3");
  console.log("token", token);

  const apiPath = `${baseUrl}/api/livejs/v1/admin/yuschool/orders`;
  axios
    .get(apiPath, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((res) => {
      console.log("res", res.data);
      if (res.data.status) {
        orders = res.data.orders;
        console.log("orders", orders);

        let html = ``;
        orders.forEach((el) => {
          let productsHtml = ``;
          el.products.forEach((product) => {
            productsHtml += `<p>${product.title} x ${product.quantity}</p>`;
          });

          html += `
            <tr>
            <td>${el.id}</td>
            <td>
              <p>${el.user.name}</p>
              <p>${el.user.tel}</p>
            </td>
            <td>${el.user.address}</td>
            <td>${el.user.email}</td>
            <td>
              ${productsHtml}
            </td>
            <td>${new Date(el.createdAt * 1000).toLocaleDateString('zh-TW')}</td>
            <td class="orderStatus">
              <a href="#">${el.paid ? '已處理' : '未處理'}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" data-id="${el.id}" value="刪除" />
            </td>
          </tr>
            `;
        });
        orderPageTable.querySelector("tbody").innerHTML = html;
      }
    });
}

function renderOrderPageTable(orders) {}

function init() {
  topBarMeun[1].addEventListener("click", adminLoginHandler);

  renderOrderPageTable(orders);
}

init();
