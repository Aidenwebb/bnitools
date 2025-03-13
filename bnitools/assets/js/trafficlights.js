// ---------------- Helper Functions for Highlighting ----------------
const darkRed = getComputedStyle(document.documentElement).getPropertyValue('--color-dark-red').trim();
const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green').trim();
const lightYellow = getComputedStyle(document.documentElement).getPropertyValue('--color-light-yellow').trim();
const amber = getComputedStyle(document.documentElement).getPropertyValue('--color-amber').trim();
const lightRed = getComputedStyle(document.documentElement).getPropertyValue('--color-light-red').trim();

function getAbsentColor(value) {
  if (value === 0) return green;
  else if (value === 1) return lightYellow;
  else if (value === 2) return amber;
  else return darkRed;
}

function getReferralGivenPerWeekColor(val) {
  if (val >= 1.2) return green;
  else if (val >= 1) return lightYellow;
  else if (val >= 0.75) return amber;
  else if (val >= 0.5) return lightRed;
  else return darkRed;
}

function getThankedColor(amount) {
  if (amount < 500) return darkRed;
  else if (amount < 2500) return lightRed;
  else if (amount < 7500) return amber;
  else return green;
}

function getAvgVisitorsColor(val) {
  if (val < 0.073) return darkRed;
  else if (val < 0.167) return lightRed;
  else if (val < 0.25) return amber;
  else if (val < 0.5) return lightYellow;
  else return green;
}

function get121Color(val) {
  if (val < 0.25) return darkRed;
  else if (val < 0.5) return amber;
  else return green;
}

function getCEUColor(val) {
  if (val == 0) return darkRed;
  else if (val == 1) return lightRed;
  else if (val == 2) return amber;
  else return green;
}

function getTestimonialsColor(val) {
  if (val === 0) return darkRed;
  else if (val === 1) return green;
  else return "";
}

function getScoreColor(score) {
  if (score >= 70) return green;
  else if (score >= 50) return amber;
  else if (score >= 30) return "#ef5350"; // red
  else return darkRed;
}
// ---------------------------------------------------------------------

let tableRows = [];
let selectedFile = null;
const fileInput = document.getElementById("fileInput");
const browseButton = document.getElementById("browseButton");
const uploadCard = document.getElementById("uploadCard");

browseButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) processFile(selectedFile);
});
uploadCard.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadCard.classList.add("dragover");
});
uploadCard.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadCard.classList.remove("dragover");
});
uploadCard.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadCard.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    selectedFile = e.dataTransfer.files[0];
    fileInput.files = e.dataTransfer.files;
    processFile(selectedFile);
  }
});

function processFile(file) {
  document.getElementById("dataTableContainer").innerHTML = "";
  document.getElementById("analysisTableContainer").innerHTML = "";
  const reader = new FileReader();
  reader.onload = function(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row[0] === "Place" && row.includes("Score")) {
        headerRowIndex = i;
        break;
      }
    }
    if (headerRowIndex === -1) {
      alert("Table header not found in the spreadsheet.");
      return;
    }
    tableRows = [];
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.every(cell => cell === null || cell === undefined || cell.toString().trim() === ""))
        break;
      tableRows.push(row);
    }
    renderDataTable(tableRows);
    renderAnalysisTable(tableRows);
  };
  reader.readAsBinaryString(file);
}

const headersConfig = [
  "Place", "Chapter", "Name", "P", "A", "L", "M", "S", "G", "R", "V", "T", "CEU", "121", "£/€", "Score",
];

function renderDataTable(data) {
  let html = "<table id='dataTable' class='table table-bordered table-striped'>";
  html += "<thead><tr>";
  headersConfig.forEach(col => { html += `<th>${col}</th>`; });
  html += "</tr></thead><tbody>";
  data.forEach(row => {
    html += "<tr>";
    const p = parseInt(row[3]) || 0;
    const a = parseInt(row[4]) || 0;
    const l = parseInt(row[5]) || 0;
    const m = parseInt(row[6]) || 0;
    const s = parseInt(row[7]) || 0;
    const totalWeeks = p + a + l + m + s;
    headersConfig.forEach((col, i) => {
      let cellValue = row[i] !== undefined ? row[i] : "";
      let style = "";
      if (i === 4) {
        const absentVal = parseInt(cellValue) || 0;
        style = `style="background-color:${getAbsentColor(absentVal)};"`;
        cellValue = absentVal;
      } else if (i === 8) {
        const rawG = parseFloat(row[8]) || 0;
        let computed = totalWeeks ? (rawG / totalWeeks).toFixed(2) : "N/A";
        style = computed !== "N/A" ? `style="background-color:${getReferralGivenPerWeekColor(parseFloat(computed))};"` : "";
        cellValue = rawG;
      } else if (i === 10) {
        const rawVisitors = parseFloat(row[10]) || 0;
        let computed = totalWeeks ? (rawVisitors / totalWeeks).toFixed(2) : "N/A";
        style = computed !== "N/A" ? `style="background-color:${getAvgVisitorsColor(parseFloat(computed))};"` : "";
        cellValue = rawVisitors;
      } else if (i === 11) {
        const testimonials = parseInt(row[11]) || 0;
        style = `style="background-color:${getTestimonialsColor(testimonials)};"`;
        cellValue = testimonials;
      } else if (i === 12) {
        const ceu = parseInt(row[12]) || 0;
        style = `style="background-color:${getCEUColor(ceu)};"`;
        cellValue = ceu;
      } else if (i === 13) {
        const ones121 = parseFloat(row[13]) || 0;
        let computed = totalWeeks ? (ones121 / totalWeeks).toFixed(2) : "N/A";
        style = computed !== "N/A" ? `style="background-color:${get121Color(parseFloat(computed))};"` : "";
        cellValue = ones121;
      } else if (i === 14) {
        const thankedAmount = parseFloat(row[14]) || 0;
        style = `style="background-color:${getThankedColor(thankedAmount)};"`;
        cellValue = thankedAmount;
      } else if (i === 15) {
        const score = parseFloat(row[15]) || 0;
        style = `style="background-color:${getScoreColor(score)};"`;
        cellValue = score;
      } else if (["P", "L", "M", "S", "R"].includes(col)) {
        cellValue = parseInt(cellValue) || 0;
      }
      html += `<td ${style}>${cellValue}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  document.getElementById("dataTableContainer").innerHTML = html;
  $("#dataTable").DataTable({
    responsive: true,
    pageLength: 100,
    paging: true,
    searching: true,
    ordering: true,
    order: [[15, "desc"]],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'print',
        title: 'Traffic Lights Data',
        customize: function (win) {
          $(win.document.head).append(
            '<style>' +
            '@page { size: A4 landscape; margin: 10mm; } ' +
            'body { font-size: 10pt; } ' +
            'table { width: 100%; border-collapse: collapse; } ' +
            'table th, table td { border: 1px solid #000; padding: 5px; } ' +
            '</style>'
          );
        }
      }
    ]
  });
}

function renderAnalysisTable(data) {
    let html = "<table id='analysisTable' class='table table-bordered table-striped'>";
    html += "<thead><tr>";
    const analysisHeaders = [
      "Name", "Total Weeks", "Avg Referral Value", "Avg Thanked per Week", "Referral Ratio", "Avg Referrals Given per Week", "Avg Referrals Received per Week", "Avg Visitors per Week", "Avg CEUs per Week", "Score",
    ];
    analysisHeaders.forEach(title => { html += `<th>${title}</th>`; });
    html += "</tr></thead><tbody>";
    data.forEach(row => {
      const name = row[2] !== undefined ? row[2] : "";
      const p = parseFloat(row[3]) || 0;
      const a = parseFloat(row[4]) || 0;
      const l = parseFloat(row[5]) || 0;
      const m = parseFloat(row[6]) || 0;
      const s = parseFloat(row[7]) || 0;
      const totalWeeks = p + a + l + m + s;
      const referralsGiven = parseFloat(row[8]) || 0;
      const referralsReceived = parseFloat(row[9]) || 0;
      const visitors = parseFloat(row[10]) || 0;
      const educationUnits = parseFloat(row[12]) || 0;
      const thankedAmount = parseFloat(row[14]) || 0;
      const score = parseFloat(row[15]) || 0;
      
      // Calculate values
      const avgReferralValue = referralsGiven ? (thankedAmount / referralsGiven).toFixed(2) : "N/A";
      const avgThankedPerWeek = totalWeeks ? (thankedAmount / totalWeeks).toFixed(2) : "N/A";
      const referralRatio = referralsReceived ? (referralsGiven / referralsReceived).toFixed(2) : "N/A";
      const avgReferralsGivenPerWeek = totalWeeks ? (referralsGiven / totalWeeks).toFixed(2) : "N/A";
      const avgReferralsReceivedPerWeek = totalWeeks ? (referralsReceived / totalWeeks).toFixed(2) : "N/A";
      const avgVisitorsPerWeek = totalWeeks ? (visitors / totalWeeks).toFixed(2) : "N/A";
      const avgCEUsPerWeek = totalWeeks ? (educationUnits / totalWeeks).toFixed(2) : "N/A";
      
      html += "<tr>";
      html += `<td>${name}</td>`;
      html += `<td>${totalWeeks}</td>`;
      
      // For Avg Referral Value column:
      let avgReferralSort = (avgReferralValue === "N/A") ? Number.MAX_SAFE_INTEGER : parseFloat(avgReferralValue);
      html += `<td data-sort="${avgReferralSort}" data-bs-toggle="tooltip" data-bs-html="true" title="Thanked for ${thankedAmount} worth of business" style="background-color:${getThankedColor(thankedAmount)};">${avgReferralValue}</td>`;
      
      // Repeat similarly for other numeric columns if necessary.
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Thanked for ${thankedAmount} worth of business" style="background-color:${getThankedColor(thankedAmount)};">${avgThankedPerWeek}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Referrals Given: ${referralsGiven}<br>Referrals Received: ${referralsReceived}">${referralRatio}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Total Referrals Given: ${referralsGiven}" style="background-color:${getReferralGivenPerWeekColor(avgReferralsGivenPerWeek==="N/A"? 0 : parseFloat(avgReferralsGivenPerWeek))};">${avgReferralsGivenPerWeek}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Total Referrals Received: ${referralsReceived}">${avgReferralsReceivedPerWeek}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Total Visitors: ${visitors}" style="background-color:${getAvgVisitorsColor(avgVisitorsPerWeek==="N/A"? 0 : parseFloat(avgVisitorsPerWeek))};">${avgVisitorsPerWeek}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Total CEUs: ${educationUnits}" style="background-color:${getCEUColor(avgCEUsPerWeek==="N/A"? 0 : parseFloat(avgCEUsPerWeek))};">${avgCEUsPerWeek}</td>`;
      html += `<td data-bs-toggle="tooltip" data-bs-html="true" title="Score" style="background-color:${getScoreColor(score)};">${score}</td>`;
      html += "</tr>";
    });
    html += "</tbody></table>";
    document.getElementById("analysisTableContainer").innerHTML = html;
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) { return new bootstrap.Tooltip(tooltipTriggerEl); });
    
    $("#analysisTable").DataTable({
      responsive: true,
      pageLength: 100,
      paging: true,
      searching: true,
      ordering: true,
      autoWidth: false,
      order: [[9, "desc"]],
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'print',
          title: 'Traffic Lights Analysis',
          customize: function (win) {
            $(win.document.head).append(
              '<style>' +
              '@page { size: A4 landscape; margin: 10mm; } ' +
              'body { font-size: 10pt; } ' +
              'table { width: 100%; border-collapse: collapse; } ' +
              'table th, table td { border: 1px solid #000; padding: 5px; } ' +
              '</style>'
            );
          }
        }
      ]
    });
  }
  

$('a[data-bs-toggle="tab"]').on("shown.bs.tab", function (e) {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});

$(document).ready(function() {
  if ($("#dataTable").length) {
    $("#dataTable").DataTable().destroy();
    $("#dataTable").DataTable({
      responsive: true,
      pageLength: 100,
      paging: true,
      searching: true,
      ordering: true,
      order: [[15, "desc"]],
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'print',
          title: 'Traffic Lights Data',
          customize: function (win) {
            $(win.document.head).append(
              '<style>' +
              '@page { size: A4 landscape; margin: 10mm; } ' +
              'body { font-size: 10pt; } ' +
              'table { width: 100%; border-collapse: collapse; } ' +
              'table th, table td { border: 1px solid #000; padding: 5px; } ' +
              '</style>'
            );
          }
        }
      ]
    });
  }
});
