/* ==========================================================================
   Relatório de Gestão de Resíduos — 58º Congresso de Patologia Clínica 2026
   Lógica JavaScript Centralizada & Visualização de Dados
   ========================================================================== */

/**
 * 1. DADOS CENTRALIZADOS DO RELATÓRIO
 * Conforme Seção 20 do Prompt de Desenvolvimento
 */
const reportData = {
  event: {
    title: "58º Congresso Brasileiro de Patologia Clínica / Medicina Laboratorial 2026",
    location: "CentroSul, Florianópolis — SC",
    dates: "15 a 18 de setembro de 2026",
    authors: [
      { name: "Larissa Waskow", role: "Bióloga" },
      { name: "Tatiana de Aguiar", role: "Engenheira Ambiental" }
    ]
  },

  totals: {
    generated: 8638.01,
    tons: 8.64,
    recycledSale: 2072.43,
    recycledDonation: 1488.80,
    compostable: 202.30,
    otherNoSocialValue: 248.00,
    reject: 4626.48,
    socialValue: 1284.36,
    co2eReduction: 3648.8163
  },

  destinations: [
    { name: "Reciclado — venda", value: 2072.43, pct: 23.99, color: "#2E7D32" },
    { name: "Reciclado — doado", value: 1488.80, pct: 17.24, color: "#81C784" },
    { name: "Orgânico compostável", value: 202.30, pct: 2.34, color: "#F57F17" },
    { name: "Outros sem valor social", value: 248.00, pct: 2.87, color: "#0288D1" },
    { name: "Rejeito", value: 4626.48, pct: 53.56, color: "#E53935" }
  ],

  stages: [
    { name: "Montagem", value: 4014.74, pct: 46.48, color: "#0288D1" },
    { name: "Evento", value: 2523.27, pct: 29.21, color: "#2E7D32" },
    { name: "Desmontagem", value: 2100.00, pct: 24.31, color: "#7B1FA2" }
  ],

  wasteTypes: [
    { name: "Madeira", value: 1823.13, type: "Reciclável" },
    { name: "Rejeito", value: 1494.61, type: "Rejeito" },
    { name: "Bagum/PVC", value: 1488.80, type: "Reciclável" },
    { name: "WC", value: 1104.92, type: "Rejeito" },
    { name: "Misto", value: 824.71, type: "Rejeito" },
    { name: "Papel/papelão", value: 799.69, type: "Reciclável" },
    { name: "Plástico", value: 253.03, type: "Reciclável" },
    { name: "Ferro", value: 248.00, type: "Reciclável" },
    { name: "Compostável", value: 202.30, type: "Orgânico" },
    { name: "Carpê", value: 198.87, type: "Reciclável" },
    { name: "Vidro", value: 74.45, type: "Reciclável" },
    { name: "Copinho", value: 52.15, type: "Reciclável" },
    { name: "Metal", value: 36.30, type: "Reciclável" },
    { name: "PET", value: 32.10, type: "Reciclável" },
    { name: "Isopor", value: 4.95, type: "Reciclável" }
  ]
};

/**
 * 2. VALIDAÇÃO MATEMÁTICA AUTOMÁTICA
 * Conforme Seção 21 do Prompt de Desenvolvimento
 */
function validateReportData() {
  const sumWaste = reportData.wasteTypes.reduce((acc, item) => acc + item.value, 0);
  const sumStages = reportData.stages.reduce((acc, item) => acc + item.value, 0);
  const sumDestinations = reportData.destinations.reduce((acc, item) => acc + item.value, 0);
  const expectedTotal = reportData.totals.generated;

  const eps = 0.01;
  const isWasteValid = Math.abs(sumWaste - expectedTotal) < eps;
  const isStagesValid = Math.abs(sumStages - expectedTotal) < eps;
  const isDestValid = Math.abs(sumDestinations - expectedTotal) < eps;

  if (isWasteValid && isStagesValid && isDestValid) {
    console.log("✓ Validação Matemática Concluída com Sucesso: 8.638,01 kg = 8.638,01 kg");
    const statusEl = document.getElementById("validation-status");
    if (statusEl) {
      statusEl.innerHTML = `✓ Integridade dos dados verificada (8.638,01 kg)`;
    }
  } else {
    console.error("❌ ERRO DE VALIDAÇÃO MATEMÁTICA DETECTADO!");
    console.error(`Resíduos: ${sumWaste}, Etapas: ${sumStages}, Destinações: ${sumDestinations}`);
    alert("Atenção: Inconsistência detectada nos cálculos dos relatórios!");
  }
}

/**
 * 3. ANIMAÇÃO DOS NÚMEROS (KPI COUNTERS)
 */
function animateCounters() {
  const counterElements = document.querySelectorAll(".counter-val");
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute("data-target"));
        const prefix = el.getAttribute("data-prefix") || "";
        const suffix = el.getAttribute("data-suffix") || "";
        const decimals = parseInt(el.getAttribute("data-decimals") || "2", 10);
        
        let startTimestamp = null;
        const duration = 1500;

        function step(timestamp) {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          // Ease-out quad
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = easeProgress * targetVal;

          const formattedVal = currentVal.toLocaleString("pt-BR", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          });

          el.textContent = `${prefix}${formattedVal}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }

        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => observer.observe(el));
}

/**
 * 4. RENDERIZAÇÃO DOS GRÁFICOS COM CHART.JS
 */
function initCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js não encontrado. Os gráficos serão exibidos com legendas estáticas.");
    return;
  }

  // Configurações globais do Chart.js
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = "#64748B";

  // A) Gráfico de Rosca — Destinação dos Resíduos
  const ctxDonut = document.getElementById("chartDonut");
  if (ctxDonut) {
    new Chart(ctxDonut, {
      type: "doughnut",
      data: {
        labels: reportData.destinations.map(d => d.name),
        datasets: [{
          data: reportData.destinations.map(d => d.value),
          backgroundColor: reportData.destinations.map(d => d.color),
          borderWidth: 2,
          borderColor: "#FFFFFF",
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = reportData.destinations[context.dataIndex];
                const valFormatted = item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
                return ` ${item.name}: ${valFormatted} kg (${item.pct}%)`;
              }
            }
          }
        },
        cutout: "68%"
      }
    });
  }

  // B) Gráfico de Barras — Distribuição por Etapa
  const ctxStages = document.getElementById("chartStages");
  if (ctxStages) {
    new Chart(ctxStages, {
      type: "bar",
      data: {
        labels: reportData.stages.map(s => s.name),
        datasets: [{
          label: "Quantidade (kg)",
          data: reportData.stages.map(s => s.value),
          backgroundColor: reportData.stages.map(s => s.color),
          borderRadius: 8,
          maxBarThickness: 50
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = reportData.stages[context.dataIndex];
                const valFormatted = item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
                return ` ${item.name}: ${valFormatted} kg (${item.pct}% do total)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#F1F5F9" },
            ticks: {
              callback: function(val) {
                return val.toLocaleString("pt-BR") + " kg";
              }
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // C) Gráfico de Barras Horizontais — Caracterização dos Resíduos (15 categorias)
  const ctxHorizontal = document.getElementById("chartHorizontal");
  if (ctxHorizontal) {
    const totalMass = reportData.totals.generated;

    // Cores por tipo de material
    const typeColors = {
      "Reciclável": "#2E7D32",
      "Rejeito": "#E53935",
      "Orgânico": "#F57F17"
    };

    // Labels incluindo tipo do material
    const labelsWithType = reportData.wasteTypes.map(w => `${w.name} (${w.type})`);
    const barColors = reportData.wasteTypes.map(w => typeColors[w.type] || "#0288D1");

    // Plugin inline para exibir valores sobre as barras
    const datalabelsPlugin = {
      id: "horizontalDatalabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, dsIdx) => {
          const meta = chart.getDatasetMeta(dsIdx);
          meta.data.forEach((bar, index) => {
            const value = dataset.data[index];
            const pct = ((value / totalMass) * 100).toFixed(1);
            const label = `${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} kg (${pct}%)`;

            ctx.save();
            ctx.font = "bold 11px 'Inter', sans-serif";
            ctx.textBaseline = "middle";

            const barWidth = bar.width;
            const textWidth = ctx.measureText(label).width;

            // Se a barra for larga o suficiente, texto dentro; senão, fora
            if (barWidth > textWidth + 20) {
              ctx.fillStyle = "#FFFFFF";
              ctx.textAlign = "right";
              ctx.fillText(label, bar.x - 8, bar.y);
            } else {
              ctx.fillStyle = "#334155";
              ctx.textAlign = "left";
              ctx.fillText(label, bar.x + 6, bar.y);
            }
            ctx.restore();
          });
        });
      }
    };

    new Chart(ctxHorizontal, {
      type: "bar",
      plugins: [datalabelsPlugin],
      data: {
        labels: labelsWithType,
        datasets: [{
          label: "Massa (kg)",
          data: reportData.wasteTypes.map(w => w.value),
          backgroundColor: barColors,
          borderRadius: 6,
          barThickness: 22
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const item = reportData.wasteTypes[context.dataIndex];
                const pct = ((item.value / totalMass) * 100).toFixed(2);
                const valFormatted = item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
                return ` ${item.name} (${item.type}): ${valFormatted} kg (${pct}% do total)`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: "#F1F5F9" },
            ticks: {
              callback: function(val) {
                return val.toLocaleString("pt-BR") + " kg";
              }
            },
            title: {
              display: true,
              text: "Massa (kg)",
              font: { size: 13, weight: "600", family: "'Inter', sans-serif" },
              color: "#475569"
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 12, weight: "500", family: "'Inter', sans-serif" },
              color: "#334155"
            }
          }
        }
      }
    });
  }
}

/**
 * 5. GALERIA LIGHTBOX
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");

  if (!modal) return;

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const caption = item.getAttribute("data-caption") || img.alt;
      
      modalImg.src = img.src;
      modalCaption.textContent = caption;
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/**
 * 6. BOTÃO DE IMPRESSÃO & NAVEGAÇÃO SUAVE
 */
function initInteractions() {
  const printBtn = document.getElementById("btnPrint");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Active Link Highlighting on Scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
  // Redimensionamento para modo Impressão/PDF
  window.addEventListener("beforeprint", () => {
    if (typeof Chart !== "undefined") {
      for (const id in Chart.instances) {
        Chart.instances[id].resize();
      }
    }
  });

  window.addEventListener("afterprint", () => {
    if (typeof Chart !== "undefined") {
      for (const id in Chart.instances) {
        Chart.instances[id].resize();
      }
    }
  });
}

/* Inicializar ao carregar o DOM */
document.addEventListener("DOMContentLoaded", () => {
  validateReportData();
  animateCounters();
  initCharts();
  initLightbox();
  initInteractions();
});
