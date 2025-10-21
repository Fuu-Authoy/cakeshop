const API_BASE = "https://banhngot.fitlhu.com/api/auth";

// Lấy phần tử
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const message = document.getElementById("message");

// Chuyển tab
if (loginTab && registerTab) {
  loginTab.onclick = () => switchTab("login");
  registerTab.onclick = () => switchTab("register");
}

function switchTab(type) {
  const isLogin = type === "login";
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("active", isLogin);
  registerForm.classList.toggle("active", !isLogin);
}

// Hiển thị thông báo
function showMessage(text, success = true) {
  if (message) {
    message.style.color = success ? "#16a34a" : "#dc2626";
    message.textContent = text;
  }
}

// ---- ĐĂNG KÝ ----
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      username: document.getElementById("register-username").value,
      email: document.getElementById("register-email").value,
      password: document.getElementById("register-password").value,
    };

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.success || json.token) {
        showMessage("🎉 Đăng ký thành công! Hãy đăng nhập nhé.");
      } else showMessage(json.message || "Lỗi khi đăng ký.", false);
    } catch {
      showMessage("❌ Không thể kết nối đến server.", false);
    }
  });
}

// ---- ĐĂNG NHẬP ----
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      username: document.getElementById("login-username").value,
      password: document.getElementById("login-password").value,
    };

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log("Login:", json);

      if (json.success && json.token) {
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.data));
        showMessage("✅ Đăng nhập thành công!");
        setTimeout(() => (window.location.href = "home.html"), 800);
      } else showMessage(json.message || "Sai thông tin đăng nhập.", false);
    } catch {
      showMessage("⚠️ Không thể kết nối đến server.", false);
    }
  });
}

// ---- TRANG HOME ----
if (window.location.pathname.includes("home.html")) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "index.html";

  document.getElementById("welcome").textContent = `Xin chào, ${user.username || "bạn"}!`;
  document.getElementById("emailInfo").textContent = user.email || "Không rõ";
  document.getElementById("createdAtInfo").textContent = user.createdAt || "Chưa cập nhật";

  // Danh sách sản phẩm mẫu
  const products = [
    { name: "Bánh Dâu Kem Tươi", price: "45.000đ" },
    { name: "Bánh Mousse Chanh Dây", price: "55.000đ" },
    { name: "Cupcake Socola", price: "30.000đ" },
    { name: "Bánh Phô Mai Trà Xanh", price: "60.000đ" },
  ];
  const list = document.getElementById("productList");
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "product";
    item.innerHTML = `<h4>${p.name}</h4><p>${p.price}</p>`;
    list.appendChild(item);
  });

  // Đăng xuất
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "index.html";
  };
}
