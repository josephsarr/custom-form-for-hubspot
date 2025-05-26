document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("brochureForm");
    const phoneInput = document.getElementById("phone");
  
    /* ---------- helper: show / clear inline error ---------- */
    function setError(el, msg = "") {
      const span = el.parentElement.querySelector(".error-msg");
      span.textContent = msg;
      el.classList.toggle("is-invalid", !!msg);
    }
  
    /* ---------- helper: slug from current URL ---------- */
    const getSlug = () =>
      decodeURIComponent(
        window.location.pathname
          .split("/") // ['', 'formations', 'mba-international-paris-ip']
          .filter(Boolean) // remove empty segments
          .pop() // -> 'mba-international-paris-ip'
      );
  
    /* ---------- live validation ---------- */
    form.querySelectorAll("input[required]").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.validity.valid) setError(input);
      });
    });
  
    /* ---------- phone custom message ---------- */
    phoneInput.addEventListener("invalid", () => {
      if (phoneInput.validity.patternMismatch) {
        phoneInput.setCustomValidity(
          "Ajoutez l’indicatif pays, ex. +221 77 123 45 67"
        );
      } else {
        phoneInput.setCustomValidity("");
      }
    });
    phoneInput.addEventListener("input", () => phoneInput.setCustomValidity(""));
  
    /* ---------- submit ---------- */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      let invalid = false;
      form.querySelectorAll("input[required]").forEach((input) => {
        setError(input);
        if (!input.checkValidity()) {
          invalid = true;
          setError(input, input.validationMessage);
        }
      });
  
      if (!invalid) {
        /* 1) build dynamic PDF URL from slug and open in new tab */
        const slug = getSlug(); // e.g. "mba-international-paris-ip"
        const pdfURL = `https://bem.sn/assets/brochures-dauphine/${slug}.pdf`; // dynamic path
        window.open(pdfURL, "_blank", "noopener,noreferrer");
  
        /* 2) reset form fields */
        form.reset();
        form.querySelectorAll(".error-msg").forEach((s) => (s.textContent = ""));
        form
          .querySelectorAll(".is-invalid")
          .forEach((el) => el.classList.remove("is-invalid"));
      }
    });
  
    /* ---------- auto-fill hidden “formation” field ---------- */
    const formationField = document.getElementById("formation");
    if (formationField) {
      const programmeTitle = document
        .querySelector("h1 span.accessibility-grey-bg")
        ?.textContent.trim();
      if (programmeTitle) formationField.value = programmeTitle;
    }
  });