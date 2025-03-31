import { versionData } from "./versionData.js";

// Function to highlight text based on the search query
function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(
    regex,
    '<mark style="background-color:rgb(255, 239, 15); color:rgb(255, 42, 0); padding: 5px; border-radius: 5px;">$1</mark>'
  );
}

// Function to update the version display
export function updateVersionDisplay(searchQuery = "") {
  const container = document.getElementById("version-container");
  container.innerHTML = "";

  let versions = Object.entries(versionData)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => {
      // Convertir les numéros de version en nombres pour un tri correct
      const vA = parseFloat(a.version);
      const vB = parseFloat(b.version);
      return vB - vA;
    });

  // Filter versions if a search query is active
  if (searchQuery) {
    versions = versions.filter((version) => {
      const searchableContent = [
        version.version,
        version.device,
        ...version.changes.features,
        ...version.changes.security,
        version.impacts.security,
        version.impacts.performance,
        ...version.instructions,
        ...version.resolvedIssues,
        version.updateRisks,
        version.residualRisks,
        ...version.installation.steps,
        ...version.installation.compatibility.accessories,
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(searchQuery.toLowerCase());
    });
  }

  versions.forEach((version) => {
    const versionElement = document.createElement("section");
    versionElement.className = "version";
    const versionId = version.version.replace(/\./g, "");
    versionElement.id = `version${versionId}`;

    const updateTypeText =
      version.updateType === "corrective"
        ? "Corrective Version"
        : "Evolutionary Version";

    const formattedDate = version.releaseDate.split("/").join(".");

    // Function to highlight content if necessary
    const highlight = (text) =>
      searchQuery ? highlightText(text, searchQuery) : text;

    versionElement.innerHTML = `
      <div class="version-header">
        <h2>
          Version ${highlight(version.version)} - ${highlight(
      version.changes.features[0] || "Version update"
    )}
          <img src="img/Arrow.png" alt="Arrow" class="arrow-icon" />
        </h2>
        <div class="tag-container">
          <span class="tag device-tag">${highlight(version.device)}</span>
          <span class="tag date-tag">${formattedDate}</span>
          <span class="tag release-tag">${updateTypeText}</span>
        </div>
      </div>
      <div class="release-details">
        <div class="version-content">
          <div class="version-info-grid">
            <div class="info-section">
              <h3>General Information</h3>
              <p><strong>Software Version:</strong> ${highlight(
                version.version
              )}</p>
              <p><strong>Model:</strong> ${highlight(version.device)}</p>
              <p><strong>Release Date:</strong> ${version.releaseDate}</p>
              <p><strong>Security Classification:</strong> ${
                version.securityClass
              }</p>
              <p><strong>Update Type:</strong> ${updateTypeText}</p>
            </div>

            <div class="info-section">
              <h3>Change Details</h3>
              <h4>Changes Made</h4>
              <ul>
                ${version.changes.features
                  .map((f) => `<li>${highlight(f)}</li>`)
                  .join("")}
              </ul>
              <h4>Functional Impacts</h4>
              <ul>
                ${version.changes.security
                  .map((s) => `<li>${highlight(s)}</li>`)
                  .join("")}
              </ul>
            </div>

            <div class="info-section">
              <h3>Impact of Changes</h3>
              <h4>Security Impact</h4>
              <p>${highlight(version.impacts.security)}</p>
              <h4>Performance Impact</h4>
              <p>${highlight(version.impacts.performance)}</p>
            </div>

            <div class="info-section">
              <h3>Usage Instructions</h3>
              <ul>
                ${version.instructions
                  .map((i) => `<li>${highlight(i)}</li>`)
                  .join("")}
              </ul>
            </div>

            <div class="info-section">
              <h3>Issues and Risks</h3>
              <h4>Resolved Issues</h4>
              <ul>
                ${version.resolvedIssues
                  .map((r) => `<li>${highlight(r)}</li>`)
                  .join("")}
              </ul>
              <h4>Risks of Not Updating</h4>
              <p>${highlight(version.updateRisks)}</p>
              <h4>Residual Risks</h4>
              <p>${highlight(version.residualRisks)}</p>
            </div>

            <div class="info-section">
              <h3>Installation Procedure</h3>
              <h4>Installation Steps</h4>
              <ul>
                ${version.installation.steps
                  .map((step) => `<li>${highlight(step)}</li>`)
                  .join("")}
              </ul>
              <h4>Compatibility</h4>
              <p><strong>Compatible Accessories:</strong> ${highlight(
                version.installation.compatibility.accessories.join(", ")
              )}</p>
              <p><strong>Compatible Previous Versions:</strong> ${version.installation.compatibility.previousVersions.join(
                ", "
              )}</p>
            </div>

            <div class="info-section">
              <h3>Technical Support</h3>
              <p><strong>Email:</strong> <a href="mailto:hello@winback.com" class="contact-link">${
                version.support.email
              }</a></p>
              <p><strong>Phone:</strong> <a href="tel:+33483661666" class="contact-link">${
                version.support.phone
              }</a></p>
              <p><strong>Hours:</strong> ${version.support.hours}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const versionHeader = versionElement.querySelector(".version-header");
    const releaseDetails = versionElement.querySelector(".release-details");
    const arrowIcon = versionElement.querySelector(".arrow-icon");

    versionHeader.addEventListener("click", () => {
      releaseDetails.classList.toggle("show");
      arrowIcon.style.transform = releaseDetails.classList.contains("show")
        ? "rotate(180deg)"
        : "rotate(0deg)";
    });

    container.appendChild(versionElement);
  });

  updateSidebar(versions);

  // Vérifier si on arrive avec un hash dans l'URL et ouvrir la version correspondante
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1);
    const targetVersion = document.getElementById(targetId);
    if (targetVersion) {
      const releaseDetails = targetVersion.querySelector(".release-details");
      const arrowIcon = targetVersion.querySelector(".arrow-icon");
      if (releaseDetails && arrowIcon) {
        releaseDetails.classList.add("show");
        arrowIcon.style.transform = "rotate(180deg)";
        setTimeout(() => {
          targetVersion.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }
}

// Function to update the sidebar with version links
function updateSidebar(versions) {
  const sidebar = document.getElementById("sidebar");
  const ul = sidebar.querySelector("ul");
  ul.innerHTML = "";

  versions.forEach((version) => {
    const versionId = version.version.replace(/\./g, "");
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#version${versionId}">
        Version ${version.version}
        <img src="img/Arrow.png" alt="Arrow" class="side-arrow-icon" />
      </a>
    `;

    // Ajouter le gestionnaire de clic
    li.querySelector("a").addEventListener("click", (e) => {
      // Trouver la section de version correspondante
      const targetVersion = document.getElementById(`version${versionId}`);
      if (targetVersion) {
        // Ouvrir les détails de la version
        const releaseDetails = targetVersion.querySelector(".release-details");
        const arrowIcon = targetVersion.querySelector(".arrow-icon");
        if (releaseDetails && arrowIcon) {
          releaseDetails.classList.add("show");
          arrowIcon.style.transform = "rotate(180deg)";
        }

        // Fermer la sidebar sur mobile
        const burgerMenu = document.getElementById("burger-menu");
        const sidebar = document.getElementById("sidebar");
        const body = document.body;
        if (window.innerWidth <= 768) {
          burgerMenu.classList.remove("active");
          sidebar.classList.add("hidden");
          sidebar.classList.remove("visible");
          body.classList.remove("sidebar-open");
        }

        // Scroll doux vers la version
        setTimeout(() => {
          targetVersion.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });

    ul.appendChild(li);
  });
}

// Initialize the display
document.addEventListener("DOMContentLoaded", () => {
  updateVersionDisplay();

  // Add search functionality
  const searchInput = document.querySelector(".search-bar input");
  searchInput.addEventListener("input", (e) => {
    updateVersionDisplay(e.target.value.trim());
  });
});
