const API = 'api.php';
let allStudents = [];
let currentPage = 1;
const PER_PAGE  = 10;
let editingId   = null;   // stud_lrn when editing
let deleteId    = null;

// ── Bootstrap ─────────────────────────────────────────────────────────────────
fetchStats();
fetchStudents();

// ── Stats ─────────────────────────────────────────────────────────────────────
async function fetchStats() {
  try {
    const res  = await fetch(`${API}?action=get_stats`);
    const data = await res.json();
    document.getElementById('statTotal').textContent    = data.total    ?? '—';
    document.getElementById('statMale').textContent     = data.male     ?? '—';
    document.getElementById('statFemale').textContent   = data.female   ?? '—';
    document.getElementById('statSections').textContent = data.sections ?? '—';
  } catch (e) { console.error('Stats fetch failed', e); }
}

// ── Students list ─────────────────────────────────────────────────────────────
async function fetchStudents(search = '') {
  const url  = `${API}?action=get_students${search ? '&search=' + encodeURIComponent(search) : ''}`;
  const res  = await fetch(url);
  allStudents = await res.json();
  currentPage = 1;
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('tableBody');
  const start = (currentPage - 1) * PER_PAGE;
  const page  = allStudents.slice(start, start + PER_PAGE);

  if (!allStudents.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p>No students found.</p>
    </div></td></tr>`;
    updatePagination();
    return;
  }

  tbody.innerHTML = page.map(s => {
    const fullName = `${s.last_name}, ${s.first_name}${s.middle_name ? ' ' + s.middle_name[0] + '.' : ''}`;
    const bday = s.birth_date
      ? new Date(s.birth_date + 'T00:00:00').toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' })
      : '—';
    const addr = [s.address_barangay, s.address_municipality].filter(Boolean).join(', ') || '—';
    const section = s.section_name
      ? `<span class="section-tag">Gr.${s.grade_level} – ${escHtml(s.section_name)}</span>`
      : '—';
    const adviser = s.adviser_fname ? `${escHtml(s.adviser_fname)} ${escHtml(s.adviser_lname)}` : '—';
    const genderBadge = s.gender === 'Male'
      ? `<span class="badge badge-m">Male</span>`
      : `<span class="badge badge-f">Female</span>`;

    return `<tr>
      <td class="td-id">${escHtml(s.stud_lrn)}</td>
      <td class="td-name">${escHtml(fullName)}</td>
      <td>${genderBadge}</td>
      <td>${bday}</td>
      <td>${section}</td>
      <td class="td-adviser">${adviser}</td>
      <td class="td-addr">${escHtml(addr)}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-view" onclick="openProfile('${escHtml(s.stud_lrn)}')">View</button>
          <button class="btn btn-edit" onclick="openEditModal('${escHtml(s.stud_lrn)}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="openConfirm('${escHtml(s.stud_lrn)}','${escHtml(fullName).replace(/'/g,"\\'")}')">Delete</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  updatePagination();
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
  for (let i = 1; i <= pages; i++)
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="changePage(${i})">${i}</button>`;
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

// ── Dropdowns ─────────────────────────────────────────────────────────────────
async function loadClasses() {
  const res  = await fetch(`${API}?action=get_classes`);
  const data = await res.json();
  const sel  = document.getElementById('fClass');
  sel.innerHTML = '<option value="">— Select Section —</option>' +
    data.map(c =>
      `<option value="${c.class_id}">Gr.${c.grade_level} – ${escHtml(c.section_name)} (${escHtml(c.school_year)})</option>`
    ).join('');
}

async function loadPersonnel() {
  const res  = await fetch(`${API}?action=get_personnel`);
  const data = await res.json();
  const sel  = document.getElementById('fAdviser');
  sel.innerHTML = '<option value="">— Select Adviser —</option>' +
    data.map(p =>
      `<option value="${p.personnel_id}">${escHtml(p.last_name)}, ${escHtml(p.first_name)} (${escHtml(p.position_type)})</option>`
    ).join('');
}

// ── Add Modal ─────────────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add New Student';
  document.getElementById('submitBtn').textContent  = 'Save Student';
  clearForm();
  document.getElementById('lrnField').style.display = '';
  Promise.all([loadClasses(), loadPersonnel()]);
  document.getElementById('formOverlay').classList.add('open');
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
async function openEditModal(lrn) {
  editingId = lrn;
  document.getElementById('modalTitle').textContent = 'Edit Student';
  document.getElementById('submitBtn').textContent  = 'Update Student';
  clearForm();
  document.getElementById('lrnField').style.display = 'none';

  await Promise.all([loadClasses(), loadPersonnel()]);

  const res  = await fetch(`${API}?action=get_student&id=${encodeURIComponent(lrn)}`);
  const data = await res.json();
  if (data.error) { showToast(data.error, 'error'); return; }

  document.getElementById('fFirstName').value    = data.first_name            || '';
  document.getElementById('fLastName').value     = data.last_name             || '';
  document.getElementById('fMiddleName').value   = data.middle_name           || '';
  document.getElementById('fBirthdate').value    = data.birth_date            || '';
  document.getElementById('fGender').value       = data.gender                || '';
  document.getElementById('fBarangay').value     = data.address_barangay      || '';
  document.getElementById('fMunicipality').value = data.address_municipality  || '';
  document.getElementById('fClass').value        = data.class_id              || '';
  document.getElementById('fAdviser').value      = data.adviser_id            || '';

  document.getElementById('formOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('formOverlay').classList.remove('open');
}

// ── Submit ────────────────────────────────────────────────────────────────────
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
    class_id:             document.getElementById('fClass').value,
    adviser_id:           document.getElementById('fAdviser').value,
  };

  const method = editingId ? 'PUT' : 'POST';
  const res    = await fetch(API, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();

  if (data.errors) { showToast(data.errors[0], 'error'); return; }
  if (data.success) {
    closeModal();
    fetchStudents(document.getElementById('searchInput').value);
    fetchStats();
    showToast(data.message, 'success');
  }
}

// ── Validation ────────────────────────────────────────────────────────────────
function validateForm() {
  let ok = true;
  const checks = [
    { id: 'fFirstName', err: 'errFirstName', test: v => v.trim() !== '' },
    { id: 'fLastName',  err: 'errLastName',  test: v => v.trim() !== '' },
    { id: 'fBirthdate', err: 'errBirthdate', test: v => v !== '' },
    { id: 'fGender',    err: 'errGender',    test: v => v !== '' },
    { id: 'fClass',     err: 'errClass',     test: v => v !== '' },
    { id: 'fAdviser',   err: 'errAdviser',   test: v => v !== '' },
  ];
  if (!editingId)
    checks.push({ id: 'fStudLrn', err: 'errStudLrn', test: v => /^\d{1,12}$/.test(v.trim()) });

  checks.forEach(({ id, err, test }) => {
    const field = document.getElementById(id);
    if (!field) return;
    const wrap  = field.closest('.field');
    if (!test(field.value)) { wrap.classList.add('has-err'); ok = false; }
    else                    { wrap.classList.remove('has-err'); }
  });
  return ok;
}

// ── Profile / Detail View ─────────────────────────────────────────────────────
async function openProfile(lrn) {
  document.getElementById('profileBody').innerHTML = '<div class="profile-loading">Loading…</div>';
  document.getElementById('profileOverlay').classList.add('open');

  const [sRes, gRes, aRes] = await Promise.all([
    fetch(`${API}?action=get_student&id=${encodeURIComponent(lrn)}`),
    fetch(`${API}?action=get_grades&id=${encodeURIComponent(lrn)}`),
    fetch(`${API}?action=get_attendance&id=${encodeURIComponent(lrn)}`),
  ]);
  const student    = await sRes.json();
  const grades     = await gRes.json();
  const attendance = await aRes.json();

  if (student.error) {
    document.getElementById('profileBody').innerHTML = `<p class="error-msg">${student.error}</p>`;
    return;
  }

  const fullName = `${student.first_name}${student.middle_name ? ' ' + student.middle_name : ''} ${student.last_name}`;
  const bday     = student.birth_date
    ? new Date(student.birth_date + 'T00:00:00').toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' })
    : '—';
  const addr = [student.address_barangay, student.address_municipality].filter(Boolean).join(', ') || '—';

  // Attendance bar
  const totalDays = (attendance.Present||0) + (attendance.Absent||0) + (attendance.Excused||0);
  const pPct      = totalDays ? Math.round((attendance.Present||0) / totalDays * 100) : 0;

  // Grades table
  const gradeRows = grades.length
    ? grades.map(g => {
        const periods   = ['1st Quarter','2nd Quarter','3rd Quarter','4th Quarter'];
        const scoreCols = periods.map(p =>
          g.periods[p] !== undefined
            ? `<td class="grade-cell">${g.periods[p].toFixed(2)}</td>`
            : `<td class="grade-cell grade-cell--empty">—</td>`
        ).join('');
        const finalClass = g.final_grade >= 75 ? 'grade-pass' : 'grade-fail';
        return `<tr>
          <td class="subject-name">${escHtml(g.subject_name)}</td>
          ${scoreCols}
          <td class="grade-cell grade-final ${finalClass}">${g.final_grade ? Number(g.final_grade).toFixed(2) : '—'}</td>
          <td><span class="remark-badge ${g.remarks === 'Passed' ? 'remark-pass' : 'remark-fail'}">${escHtml(g.remarks||'—')}</span></td>
        </tr>`;
      }).join('')
    : `<tr><td colspan="7" class="no-data">No grade records found.</td></tr>`;

  document.getElementById('profileBody').innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar">${student.first_name[0]}${student.last_name[0]}</div>
      <div class="profile-info">
        <h2>${escHtml(fullName)}</h2>
        <div class="profile-meta">
          <span class="badge ${student.gender === 'Male' ? 'badge-m' : 'badge-f'}">${escHtml(student.gender)}</span>
          <span class="meta-chip">LRN: ${escHtml(student.stud_lrn)}</span>
          ${student.section_name ? `<span class="meta-chip">Gr.${student.grade_level} – ${escHtml(student.section_name)}</span>` : ''}
          ${student.school_year  ? `<span class="meta-chip">${escHtml(student.school_year)}</span>` : ''}
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-card">
        <div class="card-label">Personal Info</div>
        <div class="card-row"><span>Birthdate</span><strong>${bday}</strong></div>
        <div class="card-row"><span>Address</span><strong>${escHtml(addr)}</strong></div>
      </div>
      <div class="profile-card">
        <div class="card-label">Academic Info</div>
        <div class="card-row"><span>Grade Level</span><strong>${student.grade_level || '—'}</strong></div>
        <div class="card-row"><span>Section</span><strong>${escHtml(student.section_name || '—')}</strong></div>
        <div class="card-row"><span>Adviser</span><strong>${student.adviser_fname ? escHtml(student.adviser_fname + ' ' + student.adviser_lname) : '—'}</strong></div>
      </div>
      <div class="profile-card attendance-card">
        <div class="card-label">Attendance (${totalDays} logged days)</div>
        <div class="attendance-bar-wrap">
          <div class="attendance-bar">
            <div class="bar-present" style="width:${pPct}%"></div>
          </div>
          <span class="bar-pct">${pPct}% present</span>
        </div>
        <div class="attendance-counts">
          <span class="att-chip att-present">✓ ${attendance.Present||0} Present</span>
          <span class="att-chip att-absent">✗ ${attendance.Absent||0} Absent</span>
          <span class="att-chip att-excused">◌ ${attendance.Excused||0} Excused</span>
        </div>
      </div>
    </div>

    ${grades.length ? `
    <div class="grades-section">
      <div class="section-label">Grades — Information Management (Subject 501)</div>
      <div class="grades-scroll">
        <table class="grades-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>
              <th>Final</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>${gradeRows}</tbody>
        </table>
      </div>
    </div>` : ''}
  `;
}

function closeProfile() {
  document.getElementById('profileOverlay').classList.remove('open');
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function openConfirm(lrn, name) {
  deleteId = lrn;
  document.getElementById('confirmText').textContent =
    `You are about to permanently delete the record of "${name}". This cannot be undone.`;
  document.getElementById('confirmOverlay').classList.add('open');

  document.getElementById('confirmDeleteBtn').onclick = async () => {
    const res  = await fetch(`${API}?action=delete&id=${encodeURIComponent(deleteId)}`, { method: 'DELETE' });
    const data = await res.json();
    closeConfirm();
    if (data.success) {
      fetchStudents(document.getElementById('searchInput').value);
      fetchStats();
      showToast(data.message, 'success');
    } else {
      showToast(data.error || 'Delete failed.', 'error');
    }
  };
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function clearForm() {
  ['fStudLrn','fFirstName','fLastName','fMiddleName','fBirthdate','fBarangay','fMunicipality']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('fGender').value  = '';
  document.getElementById('fClass').value   = '';
  document.getElementById('fAdviser').value = '';
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
  d.textContent = String(str ?? '');
  return d.innerHTML;
}

// Close overlays on backdrop click
document.getElementById('formOverlay').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('confirmOverlay').addEventListener('click', function(e) { if (e.target === this) closeConfirm(); });
document.getElementById('profileOverlay').addEventListener('click', function(e) { if (e.target === this) closeProfile(); });
