const API = 'api.php';
let allStudents = [];
let currentPage = 1;
const PER_PAGE = 10;
let editingId = null;   // will hold stud_lrn string
let deleteId  = null;

async function fetchStudents(search = '') {
  const url = `${API}?action=get_students${search ? '&search=' + encodeURIComponent(search) : ''}`;
  const res  = await fetch(url);
  allStudents = await res.json();
  currentPage = 1;
  renderTable();
  renderStats();
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * PER_PAGE;
  const page  = allStudents.slice(start, start + PER_PAGE);

  if (!allStudents.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p>No students found.</p></div></td></tr>`;
    updatePagination();
    return;
  }

  tbody.innerHTML = page.map(s => {
    const fullName = `${s.last_name}, ${s.first_name}${s.middle_name ? ' ' + s.middle_name[0] + '.' : ''}`;
    const bday = s.birth_date
      ? new Date(s.birth_date).toLocaleDateString('en-PH', {year:'numeric',month:'short',day:'numeric'})
      : '—';
    const addr = [s.address_barangay, s.address_municipality].filter(Boolean).join(', ') || '—';
    const sup  = s.supervisor_fname ? `${s.supervisor_fname} ${s.supervisor_lname}` : '—';

    return `
    <tr>
      <td class="td-id">${escHtml(s.stud_lrn)}</td>
      <td class="td-name">${escHtml(fullName)}</td>
      <td><span class="badge ${s.gender === 'M' ? 'badge-m' : 'badge-f'}">${s.gender === 'M' ? 'Male' : 'Female'}</span></td>
      <td>${bday}</td>
      <td>${escHtml(addr)}</td>
      <td>${escHtml(sup)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-edit" onclick="openEditModal('${escHtml(s.stud_lrn)}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="openConfirm('${escHtml(s.stud_lrn)}', '${escHtml(fullName).replace(/'/g,"\\'")}')">Delete</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updatePagination();
}

function renderStats() {
  document.getElementById('statTotal').textContent  = allStudents.length;
  document.getElementById('statMale').textContent   = allStudents.filter(s => s.gender === 'M').length;
  document.getElementById('statFemale').textContent = allStudents.filter(s => s.gender === 'F').length;
}

function updatePagination() {
  const total = allStudents.length;
  const pages = Math.ceil(total / PER_PAGE);
  const start = total ? (currentPage - 1) * PER_PAGE + 1 : 0;
  const end   = Math.min(currentPage * PER_PAGE, total);

  document.getElementById('paginationInfo').textContent =
    total ? `Showing ${start}–${end} of ${total} records` : 'No records';

  const btns = document.getElementById('pageButtons');
  if (pages <= 1) { btns.innerHTML = ''; return; }

  let html = `<button class="page-btn" onclick="changePage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="changePage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="changePage(${currentPage+1})" ${currentPage===pages?'disabled':''}>›</button>`;
  btns.innerHTML = html;
}

function changePage(p) {
  const pages = Math.ceil(allStudents.length / PER_PAGE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

let searchTimer;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => fetchStudents(e.target.value.trim()), 300);
});

async function loadPersonnel() {
  const res  = await fetch(`${API}?action=get_personnel`);
  const data = await res.json();
  const sel  = document.getElementById('fPersonnel');
  sel.innerHTML = '<option value="">— None —</option>' +
    data.map(p => `<option value="${p.personnel_id}">${p.last_name}, ${p.first_name} (${p.position_type || 'Staff'})</option>`).join('');
}

// ── Add Modal ────────────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Student';
  document.getElementById('submitBtn').textContent  = 'Save Student';
  clearForm();
  // Show LRN field for new students
  document.getElementById('lrnField').style.display = '';
  loadPersonnel();
  document.getElementById('formOverlay').classList.add('open');
}

// ── Edit Modal ───────────────────────────────────────────────────────────────
async function openEditModal(id) {
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Edit Student';
  document.getElementById('submitBtn').textContent  = 'Update Student';
  clearForm();
  // Hide LRN field when editing (LRN is the PK, shouldn't change)
  document.getElementById('lrnField').style.display = 'none';
  await loadPersonnel();

  const res  = await fetch(`${API}?action=get_student&id=${id}`);
  const data = await res.json();
  if (data.error) { showToast(data.error, 'error'); return; }

  document.getElementById('fFirstName').value    = data.first_name            || '';
  document.getElementById('fLastName').value     = data.last_name             || '';
  document.getElementById('fMiddleName').value   = data.middle_name           || '';
  document.getElementById('fBirthdate').value    = data.birth_date            || '';
  document.getElementById('fGender').value       = data.gender                || '';
  document.getElementById('fBarangay').value     = data.address_barangay      || '';
  document.getElementById('fMunicipality').value = data.address_municipality  || '';
  document.getElementById('fPersonnel').value    = data.personnel_id          || '';

  document.getElementById('formOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('formOverlay').classList.remove('open');
}

// ── Submit ───────────────────────────────────────────────────────────────────
async function submitForm() {
  if (!validateForm()) return;

  const payload = {
    stud_lrn:             editingId || document.getElementById('fStudLrn').value.trim(),
    first_name:           document.getElementById('fFirstName').value.trim(),
    middle_name:          document.getElementById('fMiddleName').value.trim(),
    last_name:            document.getElementById('fLastName').value.trim(),
    birth_date:           document.getElementById('fBirthdate').value,
    gender:               document.getElementById('fGender').value,
    address_barangay:     document.getElementById('fBarangay').value.trim(),
    address_municipality: document.getElementById('fMunicipality').value.trim(),
    personnel_id:         document.getElementById('fPersonnel').value || null,
  };

  const method = editingId ? 'PUT' : 'POST';
  const res = await fetch(API, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (data.errors) { showToast(data.errors[0], 'error'); return; }
  if (data.success) {
    closeModal();
    fetchStudents(document.getElementById('searchInput').value);
    showToast(data.message, 'success');
  }
}

// ── Validation ───────────────────────────────────────────────────────────────
function validateForm() {
  let ok = true;
  const checks = [
    { id: 'fFirstName', err: 'errFirstName', test: v => v.trim() !== '' },
    { id: 'fLastName',  err: 'errLastName',  test: v => v.trim() !== '' },
    { id: 'fBirthdate', err: 'errBirthdate', test: v => v !== '' },
    { id: 'fGender',    err: 'errGender',    test: v => v !== '' },
  ];
  // Validate LRN only on create
  if (!editingId) {
    checks.push({ id: 'fStudLrn', err: 'errStudLrn', test: v => /^\d{12}$/.test(v.trim()) });
  }
  checks.forEach(({ id, err, test }) => {
    const field = document.getElementById(id);
    if (!field) return;
    const wrap = field.closest('.field');
    if (!test(field.value)) { wrap.classList.add('has-err'); ok = false; }
    else                    { wrap.classList.remove('has-err'); }
  });
  return ok;
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function openConfirm(id, name) {
  deleteId = id;
  document.getElementById('confirmText').textContent =
    `You are about to permanently delete the record of "${name}". This cannot be undone.`;
  document.getElementById('confirmOverlay').classList.add('open');

  document.getElementById('confirmDeleteBtn').onclick = async () => {
    const res  = await fetch(`${API}?action=delete&id=${encodeURIComponent(deleteId)}`, { method: 'DELETE' });
    const data = await res.json();
    closeConfirm();
    if (data.success) {
      fetchStudents(document.getElementById('searchInput').value);
      showToast(data.message, 'success');
    } else {
      showToast(data.error || 'Delete failed.', 'error');
    }
  };
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}

function clearForm() {
  ['fStudLrn','fFirstName','fLastName','fMiddleName','fBirthdate','fBarangay','fMunicipality']
    .forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  document.getElementById('fGender').value    = '';
  document.getElementById('fPersonnel').value = '';
  document.querySelectorAll('.field.has-err').forEach(el => el.classList.remove('has-err'));
}

let toastTimer;
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

document.getElementById('formOverlay').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('confirmOverlay').addEventListener('click', function(e) { if (e.target === this) closeConfirm(); });

fetchStudents();