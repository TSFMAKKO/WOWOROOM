let topBarMeun = document.querySelectorAll(".topBar-menu a");
console.log("topBarMeun:", topBarMeun[0]);

let token = "";

function adminLoginHandler(e) {
  console.log("adminLogin");
  token = prompt("輸入token");
  console.log("token", token);
}

function init() {
  topBarMeun[1].addEventListener("click", adminLoginHandler);
}


init();
