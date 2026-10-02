const DEFAULT_PROFILE = {
  userId: "USR001",
  name: "Rehan Ali",
  email: "admin@rehan-school.com",
  phone: "03322131388",
  role: "Admin",
  photo: null
};

let tempPhoto = null;

function loadProfile() {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try { return JSON.parse(saved); }
    catch (e) { return { ...DEFAULT_PROFILE }; }
  }
  return { ...DEFAULT_PROFILE };
}

function saveToStorage(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function setAvatar(el, profile) {
  if (!el) return;
  if (profile.photo) {
    el.style.backgroundImage = `url(${profile.photo})`;
    el.classList.add("has-image");
    el.textContent = "";
  } else {
    el.style.backgroundImage = "";
    el.classList.remove("has-image");
    el.textContent = getInitials(profile.name);
  }
}

function renderProfile(profile) {
  setAvatar(document.getElementById("profileAvatar"), profile);
  setAvatar(document.getElementById("navAvatar"), profile);
  setAvatar(document.getElementById("sidebarAvatar"), profile);

  document.getElementById("displayName").textContent = profile.name;
  document.getElementById("displayRole").textContent = profile.role;
  document.getElementById("displayUserId").textContent = profile.userId;
  document.getElementById("displayEmail").textContent = profile.email;
  document.getElementById("displayPhone").textContent = profile.phone;
  document.getElementById("displayRole2").textContent = profile.role;

  document.getElementById("navName").textContent = profile.name;
  document.getElementById("navRole").textContent = profile.role;

  const sn = document.getElementById("sidebarName");
  if (sn) sn.textContent = profile.name;
}

function updatePhotoPreview(photo, name) {
  const preview = document.getElementById("photoPreview");
  const removeBtn = document.getElementById("removePhotoBtn");
  if (photo) {
    preview.style.backgroundImage = `url(${photo})`;
    preview.classList.add("has-image");
    preview.textContent = "";
    removeBtn.style.display = "inline-block";
  } else {
    preview.style.backgroundImage = "";
    preview.classList.remove("has-image");
    preview.textContent = getInitials(name || "User");
    removeBtn.style.display = "none";
  }
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file", false);
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast("Image size must be less than 2MB", false);
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    tempPhoto = e.target.result;
    updatePhotoPreview(tempPhoto, document.getElementById("inputName").value);
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  tempPhoto = null;
  document.getElementById("photoInput").value = "";
  updatePhotoPreview(null, document.getElementById("inputName").value);
}

function openEditModal() {
  const profile = loadProfile();
  document.getElementById("inputName").value = profile.name;
  document.getElementById("inputEmail").value = profile.email;
  document.getElementById("inputPhone").value = profile.phone;
  document.getElementById("inputRole").value = profile.role;
  document.getElementById("inputUserId").value = profile.userId;
  tempPhoto = profile.photo || null;
  updatePhotoPreview(tempPhoto, profile.name);
  document.getElementById("photoInput").value = "";
  document.getElementById("editModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeEditModal() {
  document.getElementById("editModal").classList.remove("active");
  document.body.style.overflow = "";
  tempPhoto = null;
}

function saveProfile(event) {
  event.preventDefault();
  const updated = {
    userId: document.getElementById("inputUserId").value,
    name: document.getElementById("inputName").value.trim(),
    email: document.getElementById("inputEmail").value.trim(),
    phone: document.getElementById("inputPhone").value.trim(),
    role: document.getElementById("inputRole").value,
    photo: tempPhoto
  };
  if (!updated.name || updated.name.length < 2) {
    showToast("Name must be at least 2 characters", false);
    return;
  }
  if (!updated.email.includes("@")) {
    showToast("Please enter a valid email", false);
    return;
  }
  saveToStorage(updated);
  renderProfile(updated);
  closeEditModal();
  showToast("Profile updated successfully!", true);
}

function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show" + (success ? " success" : "");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("sidebarOverlay").classList.toggle("active");
}

// Proper page switching - only one page visible
function showPage(pageName, clickedEl) {
  // Hide ALL pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // Show selected
  const page = document.getElementById("page-" + pageName);
  if (page) page.classList.add("active");

  // Title
  const titles = {
    dashboard: "Dashboard",
    students: "Students",
    teachers: "Teachers",
    classes: "Classes",
    attendance: "Attendance",
    subjects: "Subjects",
    exams: "Exams & Results",
    timetable: "Timetable",
    homework: "Homework",
    fees: "Fees & Payments",
    salary: "Salary",
    notices: "Notices",
    messages: "Messages",
    profile: "My Profile",
    settings: "Settings"
  };
  document.getElementById("pageTitle").textContent = titles[pageName] || pageName;

  // Active nav
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  if (clickedEl) {
    clickedEl.classList.add("active");
  } else {
    const link = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (link) link.classList.add("active");
  }

  // Close mobile sidebar
  if (window.innerWidth <= 900) {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("active");
  }
}

document.getElementById("editModal").addEventListener("click", function (e) {
  if (e.target === this) closeEditModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeEditModal();
    if (document.getElementById("sidebar").classList.contains("open")) toggleSidebar();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  renderProfile(loadProfile());
});
