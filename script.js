const themeSwitchBtn = document.getElementById("theme-switch-btn");
const extensionSection = document.getElementById("extensions-section");
const buttonSet = document.querySelectorAll(".button-set button");

// Global state
let allExtensions = [];

/**
 * Initialize Theme on Load
 */
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
};

/**
 * Initial data fetch with LocalStorage check
 */
const getData = async () => {
  showLoading();
  
  // 1. Check if we have data in LocalStorage
  const savedData = localStorage.getItem("extensions");
  
  try {
    // Artificial delay for skeleton demo
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (savedData) {
      // 2. If saved data exists, use it
      allExtensions = JSON.parse(savedData);
    } else {
      // 3. If no saved data, fetch from JSON
      const res = await fetch("./data.json");
      allExtensions = await res.json();
      // Save initial fetch to LocalStorage
      localStorage.setItem("extensions", JSON.stringify(allExtensions));
    }
    
    loadExtensions(allExtensions);
  } catch (err) {
    console.error("Error fetching data:", err);
    extensionSection.innerHTML = `<p class="empty-msg">Error loading extensions. Please try again.</p>`;
  }
};

const showLoading = () => {
  let skeletonHTML = "";
  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="skeleton-card">
        <div class="card-header">
          <div class="skeleton-logo"></div>
          <div class="content" style="width: 100%">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 80%"></div>
          </div>
        </div>
      </div>`;
  }
  extensionSection.innerHTML = skeletonHTML;
};

const loadExtensions = (data) => {
  const selectedBtn = document.querySelector(".button-set button.selected");
  const filterType = selectedBtn ? selectedBtn.innerText : "All";

  let filteredData = [];
  if (filterType === "All") filteredData = data;
  else if (filterType === "Active") filteredData = data.filter(item => item.isActive);
  else if (filterType === "Inactive") filteredData = data.filter(item => !item.isActive);

  let extensionsEl = "";
  filteredData.forEach(({ logo, name, description, isActive }) => {
    const checked = isActive ? "checked" : "";
    extensionsEl += `
      <div class="card" data-name="${name}">
        <div class="card-header">
          <div class="logo-wrapper">
            <img src="${logo}" alt="${name} Logo" />
          </div>
          <div class="content">
            <h3>${name}</h3>
            <p>${description}</p>
          </div>
        </div>
        <div class="card-footer">
          <button class="remove-btn">Remove</button>
          <div class="toggle-switch">
            <label class="slider-container">
              <input type="checkbox" class="sr-only" ${checked} aria-label="Toggle status for ${name}"/>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>`;
  });

  if (filteredData.length === 0) {
    extensionSection.innerHTML = `<p class="empty-msg">No ${filterType !== "All" ? filterType.toLowerCase() : ""} extensions found.</p>`;
  } else {
    extensionSection.innerHTML = extensionsEl;
  }
};

/**
 * Event Listeners
 */

// Theme Toggle with Saving
themeSwitchBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Filter Buttons
buttonSet.forEach((button) => {
  button.addEventListener("click", () => {
    buttonSet.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    loadExtensions(allExtensions);
  });
});

// Event Delegation for Card Actions
extensionSection.addEventListener("click", (e) => {
  // 1. Handle Checkbox Toggle
  if (e.target.type === "checkbox") {
    const card = e.target.closest(".card");
    const nameToToggle = card.getAttribute("data-name");
    const isChecked = e.target.checked;

    allExtensions = allExtensions.map((item) => 
      item.name === nameToToggle ? { ...item, isActive: isChecked } : item
    );
    
    // SAVE TO LOCALSTORAGE
    localStorage.setItem("extensions", JSON.stringify(allExtensions));

    const currentFilter = document.querySelector(".button-set button.selected").innerText;
    if ((currentFilter === "Active" && !isChecked) || (currentFilter === "Inactive" && isChecked)) {
      card.classList.add("removing");
      setTimeout(() => {
        card.remove();
        if (extensionSection.querySelectorAll(".card").length === 0) loadExtensions(allExtensions);
      }, 200);
    }
  }

  // 2. Handle Remove Button
  if (e.target.classList.contains("remove-btn")) {
    const card = e.target.closest(".card");
    const nameToRemove = card.getAttribute("data-name");

    allExtensions = allExtensions.filter((item) => item.name !== nameToRemove);
    
    // SAVE TO LOCALSTORAGE
    localStorage.setItem("extensions", JSON.stringify(allExtensions));

    card.classList.add("removing");
    setTimeout(() => {
      card.remove();
      if (extensionSection.querySelectorAll(".card").length === 0) loadExtensions(allExtensions);
    }, 200);
  }
});

// Initialize
initTheme();
getData();
