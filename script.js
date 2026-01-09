const themeSwitchBtn = document.getElementById("theme-switch-btn");
const extensionSection = document.getElementById("extensions-section");
const buttonSet = document.querySelectorAll(".button-set button");

// Global state to keep track of your cards
let allExtensions = [];

/**
 * Initial data fetch
 */
const getData = async () => {
  showLoading();
  try {
    const res = await fetch("./data.json");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Only set the array if it's currently empty
    if (allExtensions.length === 0) {
      allExtensions = await res.json();
    }
    loadExtensions(allExtensions);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const showLoading = () => {
  let skeletonHTML = "";
  // Generate 6 placeholder cards
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

/**
 * Handles rendering the cards based on current filters
 */
const loadExtensions = (data) => {
  // 1. Identify which filter is currently active
  const selectedBtn = document.querySelector(".button-set button.selected");
  const filterType = selectedBtn ? selectedBtn.innerText : "All";

  // 2. Filter the data based on the selected button
  let filteredData = [];
  if (filterType === "All") {
    filteredData = data;
  } else if (filterType === "Active") {
    filteredData = data.filter((item) => item.isActive === true);
  } else if (filterType === "Inactive") {
    filteredData = data.filter((item) => item.isActive === false);
  }

  // 3. Build the HTML string
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

  // 4. Update the DOM
  if (filteredData.length === 0) {
    extensionSection.innerHTML = `<p class="empty-msg">No ${filterType !== "All" ? filterType.toLowerCase() : ""} extensions found.</p>`;
  } else {
    extensionSection.innerHTML = extensionsEl;
  }
};

/**
 * Event Listeners
 */

// Theme Toggle
themeSwitchBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Filter Buttons
buttonSet.forEach((button) => {
  button.addEventListener("click", () => {
    buttonSet.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    loadExtensions(allExtensions);
  });
});

// Event Delegation for Card Actions (Remove & Toggle)
extensionSection.addEventListener("click", (e) => {
  // 1. Handle Checkbox Toggle
  if (e.target.type === "checkbox") {
    const card = e.target.closest(".card");
    const nameToToggle = card.getAttribute("data-name");
    const isChecked = e.target.checked;

    // Update global array state
    allExtensions = allExtensions.map((item) => {
      if (item.name === nameToToggle) {
        return { ...item, isActive: isChecked };
      }
      return item;
    });

    // Check if we need to remove the card from current view
    const selectedButton = document.querySelector(
      ".button-set button.selected",
    );
    const currentFilter = selectedButton.innerText;

    if (
      (currentFilter === "Active" && !isChecked) ||
      (currentFilter === "Inactive" && isChecked)
    ) {
      card.classList.add("removing"); // Start animation
      setTimeout(() => {
        card.remove();
        // If the view is now empty, re-render to show the "No extensions found" message
        if (extensionSection.querySelectorAll(".card").length === 0) {
          loadExtensions(allExtensions);
        }
      }, 200);
    }
  }

  // 2. Handle Remove Button
  if (e.target.classList.contains("remove-btn")) {
    const card = e.target.closest(".card");
    const nameToRemove = card.getAttribute("data-name");

    // Remove from array
    allExtensions = allExtensions.filter((item) => item.name !== nameToRemove);

    // Remove from UI
    card.remove();

    // If the view is now empty, re-render to show message
    if (extensionSection.querySelectorAll(".card").length === 0) {
      loadExtensions(allExtensions);
    }
  }
});

// Initial load
getData();
