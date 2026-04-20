// ==========================================
// Sistema de Agendamiento - ACME Salud
// Lógica de navegación entre pasos
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  let currentStep = 1;
  let selectedData = {
    specialty: null,
    doctor: null,
    date: null,
    time: null,
  };

  // ==========================================
  // Step 1: Selección de Especialidad
  // ==========================================
  const specialtyCards = document.querySelectorAll(".specialty-card");
  const nextStep1 = document.getElementById("next-step-1");

  specialtyCards.forEach((card) => {
    const selectBtn = card.querySelector(".select-btn");

    selectBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      // Deseleccionar todas las tarjetas
      specialtyCards.forEach((c) => c.classList.remove("selected"));

      // Seleccionar la tarjeta actual
      card.classList.add("selected");

      // Guardar datos
      selectedData.specialty = card.getAttribute("data-specialty");

      // Habilitar botón siguiente
      nextStep1.removeAttribute("disabled");

      // Actualizar texto en siguiente paso
      const specialtyName = card.querySelector("h3").textContent;
      document.getElementById("selected-specialty").textContent = specialtyName;
      document.getElementById("summary-specialty").textContent = specialtyName;
    });
  });

  nextStep1.addEventListener("click", () => {
    if (selectedData.specialty) {
      goToStep(2);
    }
  });

  // ==========================================
  // Step 2: Selección de Médico
  // ==========================================
  const doctorCards = document.querySelectorAll(".doctor-card");
  const prevStep2 = document.getElementById("prev-step-2");
  const nextStep2 = document.getElementById("next-step-2");

  doctorCards.forEach((card) => {
    const selectBtn = card.querySelector(".select-doctor-btn");

    selectBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      // Deseleccionar todas las tarjetas
      doctorCards.forEach((c) => c.classList.remove("selected"));

      // Seleccionar la tarjeta actual
      card.classList.add("selected");

      // Guardar datos
      selectedData.doctor = card.getAttribute("data-doctor");

      // Habilitar botón siguiente
      nextStep2.removeAttribute("disabled");

      // Actualizar texto en siguiente paso
      const doctorName = card.querySelector("h3").textContent;
      document.getElementById("summary-doctor").textContent = doctorName;
    });
  });

  prevStep2.addEventListener("click", () => {
    goToStep(1);
  });

  nextStep2.addEventListener("click", () => {
    if (selectedData.doctor) {
      goToStep(3);
    }
  });

  // ==========================================
  // Step 3: Selección de Fecha y Hora
  // ==========================================
  const calendarDays = document.querySelectorAll(".calendar-day.available");
  const timeSlots = document.querySelectorAll(".time-slot");
  const prevStep3 = document.getElementById("prev-step-3");
  const nextStep3 = document.getElementById("next-step-3");

  calendarDays.forEach((day) => {
    day.addEventListener("click", () => {
      // Deseleccionar todos los días
      calendarDays.forEach((d) => d.classList.remove("active"));

      // Seleccionar el día actual
      day.classList.add("active");

      // Guardar fecha
      selectedData.date = day.getAttribute("data-date");
    });
  });

  timeSlots.forEach((slot) => {
    slot.addEventListener("click", () => {
      // Deseleccionar todos los horarios
      timeSlots.forEach((s) => {
        s.classList.remove("selected");
        // Cambiar a outlined
        if (s.tagName === "MD-FILLED-BUTTON") {
          const newSlot = document.createElement("md-outlined-button");
          newSlot.className = s.className.replace("selected", "");
          newSlot.innerHTML = s.innerHTML;
          newSlot.setAttribute("data-time", s.getAttribute("data-time"));
          s.parentNode.replaceChild(newSlot, s);
        }
      });

      // Seleccionar el horario actual
      slot.classList.add("selected");

      // Guardar hora
      selectedData.time = slot.getAttribute("data-time");
    });
  });

  prevStep3.addEventListener("click", () => {
    goToStep(2);
  });

  nextStep3.addEventListener("click", () => {
    if (selectedData.date && selectedData.time) {
      goToStep(4);
    } else {
      alert("Por favor selecciona una fecha y hora para continuar");
    }
  });

  // ==========================================
  // Step 4: Confirmación
  // ==========================================
  const prevStep4 = document.getElementById("prev-step-4");
  const confirmBtn = document.getElementById("confirm-appointment");

  prevStep4.addEventListener("click", () => {
    goToStep(3);
  });

  confirmBtn.addEventListener("click", () => {
    // Validar términos
    const termsCheckboxes = document.querySelectorAll(".terms-section md-checkbox");
    const termsAccepted = termsCheckboxes[0].checked;
    const dataAccepted = termsCheckboxes[1].checked;

    if (!termsAccepted || !dataAccepted) {
      alert("Debes aceptar los términos y condiciones y autorizar el tratamiento de datos para continuar");
      return;
    }

    // Simular confirmación
    console.log("Cita confirmada:", selectedData);

    // Redirigir a página de confirmación
    window.location.href = "confirmacion.html";
  });

  // ==========================================
  // Función para cambiar de paso
  // ==========================================
  function goToStep(stepNumber) {
    // Ocultar todos los contenidos
    document.querySelectorAll(".step-content").forEach((content) => {
      content.classList.remove("active");
    });

    // Mostrar el contenido del paso actual
    document.getElementById(`step-${stepNumber}`).classList.add("active");

    // Actualizar estado del stepper
    document.querySelectorAll(".step").forEach((step, index) => {
      step.classList.remove("active", "completed");

      if (index + 1 < stepNumber) {
        step.classList.add("completed");
      } else if (index + 1 === stepNumber) {
        step.classList.add("active");
      }
    });

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });

    currentStep = stepNumber;
  }

  // ==========================================
  // Filtros de ubicación
  // ==========================================
  const locationChips = document.querySelectorAll("md-filter-chip");

  locationChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      // Esta es solo una demostración
      // En producción, aquí filtrarías los médicos por ubicación
      console.log("Filtro de ubicación:", chip.getAttribute("label"));
    });
  });

  // ==========================================
  // Búsqueda de especialidades
  // ==========================================
  const searchInput = document.querySelector('md-outlined-text-field[type="search"]');

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      specialtyCards.forEach((card) => {
        const specialtyName = card.querySelector("h3").textContent.toLowerCase();

        if (specialtyName.includes(searchTerm)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  console.log("Sistema de agendamiento inicializado");
});
