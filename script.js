const ALLOWED_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "hotmail.com",
  "highspring.in",
];

window.addEventListener("load", () => {
  gsap.from(".anim-reveal", {
    duration: 0.8,
    y: 15,
    opacity: 0,
    stagger: 0.08,
    ease: "power2.out",
  });
});

function switchTab(type) {
  if (
    (type === "register" &&
      document.getElementById("reg-tab").classList.contains("active-tab")) ||
    (type === "login" &&
      document.getElementById("login-tab").classList.contains("active-tab"))
  ) {
    return;
  }

  const regBtn = document.getElementById("reg-tab");
  const loginBtn = document.getElementById("login-tab");
  const regSection = document.getElementById("register-section");
  const loginSection = document.getElementById("login-section");
  const profileSection = document.getElementById("profile-section");
  const footerText = document.getElementById("footer-text");
  const sideReg = document.getElementById("header-register");
  const sideLogin = document.getElementById("header-login");
  const mobTitle = document.getElementById("mobile-title");
  const mobSubtitle = document.getElementById("mobile-subtitle");

  // Background glows to animate
  const glowTop = document.getElementById("glow-top-right");
  const glowBottomRight = document.getElementById("glow-bottom-right");
  const glowBottomLeft = document.getElementById("glow-bottom-left");

  if (type === "register") {
    regBtn.classList.add("active-tab");
    loginBtn.classList.remove("active-tab");
    loginSection.classList.add("hidden");
    profileSection.classList.add("hidden");
    regSection.classList.remove("hidden");

    if (footerText) {
      footerText.innerHTML = `Ready to build the future? <button onclick="switchTab('register')" class="text-secondary font-black hover:underline underline-offset-4 ml-1">Submit Application</button>`;
    }

    // Side content transition
    gsap.to(sideLogin, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      onComplete: () => {
        sideLogin.classList.add("hidden");
        sideReg.classList.remove("hidden");
        gsap.fromTo(
          sideReg,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4 }
        );
      },
    });

    // Glow animations for Register (Warmer)
    gsap.to(glowTop, { opacity: 1, scale: 1.1, duration: 1 });
    gsap.to(glowBottomRight, { opacity: 0.5, duration: 1 });
    gsap.to(glowBottomLeft, { opacity: 0.5, duration: 1 });

    gsap.fromTo(
      regSection,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 }
    );
    mobTitle.innerText = "Join Our Team";
    mobSubtitle.innerText = "Building the future together.";
  } else {
    loginBtn.classList.add("active-tab");
    regBtn.classList.remove("active-tab");
    regSection.classList.add("hidden");
    profileSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

    // Side content transition
    gsap.to(sideReg, {
      opacity: 0,
      y: 10,
      duration: 0.3,
      onComplete: () => {
        sideReg.classList.add("hidden");
        sideLogin.classList.remove("hidden");
        gsap.fromTo(
          sideLogin,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4 }
        );
      },
    });

    // Glow animations for Login (Cooler)
    gsap.to(glowTop, { opacity: 0.3, scale: 0.9, duration: 1 });
    gsap.to(glowBottomRight, { opacity: 1, scale: 1.1, duration: 1 });
    gsap.to(glowBottomLeft, { opacity: 1, scale: 1.1, duration: 1 });

    gsap.fromTo(
      loginSection,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 }
    );
    mobTitle.innerText = "Welcome Back";
    mobSubtitle.innerText = "Access your team dashboard.";
  }
}

function getErrorContainer(input) {
  const wrapper = input.closest("div:not(.flex)");
  return wrapper ? wrapper.querySelector(".error-container") : null;
}

function clearError(input) {
  const container = getErrorContainer(input);
  if (container) container.classList.remove("show");
  input.classList.remove("input-error");
}

function validateField(input, type) {
  const container = getErrorContainer(input);
  const errorText = container ? container.querySelector(".error-text") : null;
  let isValid = true;
  let msg = "";
  const nameRegex = /^[a-zA-Z]+$/;
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  switch (type) {
    case "name":
      isValid = nameRegex.test(input.value);
      msg = "Use only letters (A-Z) for names.";
      break;
    case "age":
      const ageVal = parseInt(input.value);
      if (isNaN(ageVal) || ageVal < 18 || ageVal > 150) {
        isValid = false;
        msg = "Age must be between 18 and 150.";
      }
      break;
    case "phone":
      isValid = phoneRegex.test(input.value);
      msg = "Enter a valid 10-digit phone number.";
      break;
    case "email":
      if (!emailRegex.test(input.value)) {
        isValid = false;
        msg = "Enter a valid email (e.g., name@gmail.com).";
      } else {
        const domain = input.value.split("@")[1];
        if (!ALLOWED_DOMAINS.includes(domain)) {
          isValid = false;
          msg = "Only gmail, outlook, or highspring.in allowed.";
        }
      }
      break;
    case "password":
      const pass = input.value;
      const missing = [];
      if (pass.length < 8) missing.push("8+ chars");
      if (!/[A-Z]/.test(pass)) missing.push("uppercase");
      if (!/[a-z]/.test(pass)) missing.push("lowercase");
      if (!/\d/.test(pass)) missing.push("number");
      if (!/[@$!%*?&]/.test(pass)) missing.push("symbol");

      if (missing.length > 0) {
        isValid = false;
        msg = "Missing: " + missing.join(", ") + ".";
      }
      break;
  }

  if (!isValid && input.value !== "") {
    if (errorText) errorText.innerText = msg;
    if (container) container.classList.add("show");
    input.classList.add("input-error");
    input.style.animation = "none";
    input.offsetHeight;
    input.style.animation = null;
  } else {
    if (container) container.classList.remove("show");
    input.classList.remove("input-error");
  }
  return isValid;
}

function showToast(msg, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  const toastIcon = document.getElementById("toast-icon");
  const toastIconBg = document.getElementById("toast-icon-bg");
  toastMsg.innerText = msg;
  if (type === "success") {
    toastIcon.innerHTML = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>`;
    toastIconBg.className =
      "w-12 h-12 rounded-xl flex items-center justify-center bg-success text-white shadow-xl";
  } else {
    toastIcon.innerHTML = `<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    toastIconBg.className =
      "w-12 h-12 rounded-xl flex items-center justify-center bg-red-600 text-white shadow-xl";
  }
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 3000);
}

async function handleRegister() {
  const btn = document.getElementById("reg-submit-btn");
  const fields = [
    { id: "regFirstName", key: "firstName", type: "name" },
    { id: "regLastName", key: "lastName", type: "name" },
    { id: "regAge", key: "age", type: "age" },
    { id: "regPhone", key: "phone", type: "phone" },
    { id: "regEmail", key: "email", type: "email" },
    { id: "regPassword", key: "password", type: "password" },
  ];
  let allValid = true;
  const data = {};
  fields.forEach((f) => {
    const el = document.getElementById(f.id);
    if (!validateField(el, f.type)) allValid = false;
    if (el.value === "") {
      allValid = false;
      const c = getErrorContainer(el);
      if (c) {
        c.classList.add("show");
        c.querySelector(".error-text").innerText =
          "Input required for this field.";
      }
      el.classList.add("input-error");
    }
    let val = el.value;
    if (f.id === "regPhone" && val !== "") {
      const code = document.getElementById("regCountryCode").value;
      val = code + val;
    }
    data[f.key] = val;
  });
  if (!allValid) {
    showToast("Please review and fix highlighted errors.", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "SUBMITTING...";
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      showToast("Welcome!", "success");
      setTimeout(() => switchTab("login"), 1500);
    } else showToast(result.message, "error");
  } catch (e) {
    showToast("System storm.", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "SUBMIT APPLICATION";
  }
}

async function handleLogin() {
  const btn = document.getElementById("login-submit-btn");
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPass").value;
  if (!email || !password) {
    showToast("Email and password are required.", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "SIGNING IN...";
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      showToast("Authenticated successfully!", "success");
      showProfile(data.user);
    } else
      showToast("Invalid credentials. Please verify your details.", "error");
  } catch (e) {
    showToast("Wood lost.", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "SIGN IN TO HUB";
  }
}

function showProfile(user) {
  document.getElementById("main-container").classList.add("hidden");
  document.getElementById("dashboard-screen").classList.remove("hidden");

  document.getElementById("dashName").innerText =
    `${user.firstName} ${user.lastName}`;
  document.getElementById("dashEmail").innerText = user.email;
  document.getElementById("dashPhone").innerText = user.phone;
  document.getElementById("dashAge").innerText = user.age;

  gsap.fromTo(
    document.getElementById("dashboard-screen"),
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
  );

  gsap.from(".anim-dash-reveal", {
    duration: 0.8,
    y: 20,
    opacity: 0,
    delay: 0.2,
    ease: "power2.out",
  });
}

function logout() {
  document.querySelectorAll("input").forEach((i) => {
    i.value = "";
    i.classList.remove("input-error");
  });
  document
    .querySelectorAll(".error-container")
    .forEach((c) => c.classList.remove("show"));

  document.getElementById("dashboard-screen").classList.add("hidden");
  document.getElementById("main-container").classList.remove("hidden");

  switchTab("login");
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const icon = document.getElementById("theme-icon");
  if (document.body.classList.contains("light-mode")) {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
  } else {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
  }
}
