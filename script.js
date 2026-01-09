const themeSwitchBtn = document.getElementById("theme-switch-btn");
const extensionSection = document.getElementById("extensions-section");

const getData = async () => {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();
    console.dir(data);
    loadAllExtensions(data);
  } catch (err) {
    console.error(err);
  }
};

const loadAllExtensions = (data) => {
  data.forEach(({ logo, name, description, isActive }) => {
    console.log(`${logo} + ${name} + ${description} + ${isActive}`);
    const checked = isActive ? "checked" : "";
    extensionSection.innerHTML += ` <div class="card">
          <div class="card-header">
            <div class="logo-wrapper">
              <img src="${logo}" alt="${name} Logo" />
            </div>
            <div class="content">
              <h3>${name}</h3>
              <p>
              ${description}
              </p>
            </div>
          </div>

          <div class="card-footer">
            <button class="remove-btn">Remove</button>
            <div class="toggle-switch">
              <label class="slider-container">
                <input type="checkbox" class="sr-only" ${checked} />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>`;
  });
};

themeSwitchBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

getData();
