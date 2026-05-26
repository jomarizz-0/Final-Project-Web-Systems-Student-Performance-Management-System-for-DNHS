<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {

    // ── READ ──────────────────────────────────────────────────────────────────
    case 'GET':

        // Get all students with class section + adviser info
        if ($action === 'get_students') {
            $search = $_GET['search'] ?? '';
            $baseSQL = "
                SELECT
                    s.stud_lrn,
                    s.first_name,
                    s.middle_name,
                    s.last_name,
                    s.gender,
                    s.birth_date,
                    s.address_barangay,
                    s.address_municipality,
                    s.class_id,
                    s.adviser_id,
                    cs.grade_level,
                    cs.section_name,
                    cs.school_year,
                    p.first_name  AS adviser_fname,
                    p.last_name   AS adviser_lname,
                    p.position_type AS adviser_position
                FROM student s
                LEFT JOIN class_section cs ON s.class_id    = cs.class_id
                LEFT JOIN personnel    p  ON s.adviser_id   = p.personnel_id
            ";
            if ($search) {
                $stmt = $pdo->prepare($baseSQL . "
                    WHERE s.first_name LIKE :s OR s.last_name LIKE :s
                       OR s.middle_name LIKE :s
                       OR s.address_municipality LIKE :s
                       OR s.address_barangay LIKE :s
                       OR cs.section_name LIKE :s
                    ORDER BY s.last_name, s.first_name
                ");
                $stmt->execute([':s' => "%$search%"]);
            } else {
                $stmt = $pdo->query($baseSQL . "ORDER BY s.last_name, s.first_name");
            }
            echo json_encode($stmt->fetchAll());
        }

        // Get single student by LRN
        elseif ($action === 'get_student') {
            $id = $_GET['id'] ?? null;
            if (!$id) { echo json_encode(['error' => 'No LRN provided']); break; }
            $stmt = $pdo->prepare("
                SELECT s.*,
                    cs.grade_level, cs.section_name, cs.school_year,
                    p.first_name AS adviser_fname, p.last_name AS adviser_lname
                FROM student s
                LEFT JOIN class_section cs ON s.class_id  = cs.class_id
                LEFT JOIN personnel    p  ON s.adviser_id = p.personnel_id
                WHERE s.stud_lrn = ?
            ");
            $stmt->execute([$id]);
            $student = $stmt->fetch();
            echo json_encode($student ?: ['error' => 'Student not found']);
        }

        // Get all personnel (for adviser dropdown — teachers/advisers only)
        elseif ($action === 'get_personnel') {
            $stmt = $pdo->query("
                SELECT personnel_id, first_name, last_name, position_type
                FROM personnel
                WHERE position_type IN ('Teacher','Adviser','Head Teacher','Registrar','Guidance Counselor','Librarian','Principal')
                ORDER BY last_name, first_name
            ");
            echo json_encode($stmt->fetchAll());
        }

        // Get all class sections (for class dropdown)
        elseif ($action === 'get_classes') {
            $stmt = $pdo->query("
                SELECT cs.class_id, cs.grade_level, cs.section_name, cs.school_year,
                       p.first_name AS adviser_fname, p.last_name AS adviser_lname
                FROM class_section cs
                LEFT JOIN personnel p ON cs.adviser_id = p.personnel_id
                ORDER BY cs.grade_level, cs.section_name
            ");
            echo json_encode($stmt->fetchAll());
        }

        // Get grades for a student
        elseif ($action === 'get_grades') {
            $id = $_GET['id'] ?? null;
            if (!$id) { echo json_encode(['error' => 'No LRN provided']); break; }
            $stmt = $pdo->prepare("
                SELECT g.grade_id, g.final_grade, g.remarks,
                       sub.subject_name, sub.subject_description,
                       p.first_name AS teacher_fname, p.last_name AS teacher_lname,
                       GROUP_CONCAT(
                           CONCAT(gd.grading_period, ':', gd.grade_score)
                           ORDER BY gd.grading_period SEPARATOR '|'
                       ) AS period_scores
                FROM grades g
                LEFT JOIN subject sub ON g.subject_id = sub.subject_id
                LEFT JOIN personnel p ON g.teacher_id = p.personnel_id
                LEFT JOIN grade_details gd ON g.grade_id = gd.grade_id
                WHERE g.stud_lrn = ?
                GROUP BY g.grade_id
                ORDER BY sub.subject_name
            ");
            $stmt->execute([$id]);
            $rows = $stmt->fetchAll();
            // Parse period_scores into a structured array
            foreach ($rows as &$row) {
                $periods = [];
                if ($row['period_scores']) {
                    foreach (explode('|', $row['period_scores']) as $entry) {
                        [$period, $score] = explode(':', $entry, 2);
                        $periods[$period] = (float)$score;
                    }
                }
                $row['periods'] = $periods;
                unset($row['period_scores']);
            }
            echo json_encode($rows);
        }

        // Get attendance summary for a student
        elseif ($action === 'get_attendance') {
            $id = $_GET['id'] ?? null;
            if (!$id) { echo json_encode(['error' => 'No LRN provided']); break; }
            $stmt = $pdo->prepare("
                SELECT
                    status,
                    COUNT(*) AS total
                FROM attendance
                WHERE stud_lrn = ?
                GROUP BY status
            ");
            $stmt->execute([$id]);
            $summary = [];
            foreach ($stmt->fetchAll() as $row) {
                $summary[$row['status']] = (int)$row['total'];
            }
            echo json_encode([
                'Present' => $summary['Present'] ?? 0,
                'Absent'  => $summary['Absent']  ?? 0,
                'Excused' => $summary['Excused'] ?? 0,
            ]);
        }

        // Dashboard stats
        elseif ($action === 'get_stats') {
            $total   = $pdo->query("SELECT COUNT(*) FROM student")->fetchColumn();
            $male    = $pdo->query("SELECT COUNT(*) FROM student WHERE gender='Male'")->fetchColumn();
            $female  = $pdo->query("SELECT COUNT(*) FROM student WHERE gender='Female'")->fetchColumn();
            $sections= $pdo->query("SELECT COUNT(*) FROM class_section")->fetchColumn();
            echo json_encode([
                'total'    => (int)$total,
                'male'     => (int)$male,
                'female'   => (int)$female,
                'sections' => (int)$sections,
            ]);
        }

        break;

    // ── CREATE ────────────────────────────────────────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $errors = [];
        if (empty(trim($data['stud_lrn']   ?? '')))  $errors[] = "Student LRN is required.";
        if (empty(trim($data['first_name'] ?? '')))  $errors[] = "First name is required.";
        if (empty(trim($data['last_name']  ?? '')))  $errors[] = "Last name is required.";
        if (empty($data['birth_date']      ?? ''))   $errors[] = "Birth date is required.";
        if (empty($data['gender']          ?? ''))   $errors[] = "Gender is required.";
        if (empty($data['class_id']        ?? ''))   $errors[] = "Class/Section is required.";
        if (empty($data['adviser_id']      ?? ''))   $errors[] = "Adviser is required.";

        if ($errors) { http_response_code(422); echo json_encode(['errors' => $errors]); break; }

        // Validate LRN format (up to 12 digits)
        $lrn = trim($data['stud_lrn']);
        if (!preg_match('/^\d{1,12}$/', $lrn)) {
            http_response_code(422);
            echo json_encode(['errors' => ['LRN must be numeric (up to 12 digits).']]);
            break;
        }

        // Check duplicate LRN
        $check = $pdo->prepare("SELECT stud_lrn FROM student WHERE stud_lrn = ?");
        $check->execute([$lrn]);
        if ($check->fetch()) {
            http_response_code(422);
            echo json_encode(['errors' => ['LRN already exists.']]);
            break;
        }

        $stmt = $pdo->prepare("
            INSERT INTO student
                (stud_lrn, first_name, middle_name, last_name,
                 gender, birth_date,
                 address_barangay, address_municipality,
                 class_id, adviser_id)
            VALUES
                (:stud_lrn, :first_name, :middle_name, :last_name,
                 :gender, :birth_date,
                 :address_barangay, :address_municipality,
                 :class_id, :adviser_id)
        ");
        $stmt->execute([
            ':stud_lrn'             => $lrn,
            ':first_name'           => trim($data['first_name']),
            ':middle_name'          => trim($data['middle_name'] ?? ''),
            ':last_name'            => trim($data['last_name']),
            ':gender'               => $data['gender'],
            ':birth_date'           => $data['birth_date'],
            ':address_barangay'     => trim($data['address_barangay'] ?? ''),
            ':address_municipality' => trim($data['address_municipality'] ?? ''),
            ':class_id'             => (int)$data['class_id'],
            ':adviser_id'           => (int)$data['adviser_id'],
        ]);
        echo json_encode(['success' => true, 'message' => 'Student added successfully.']);
        break;

    // ── UPDATE ────────────────────────────────────────────────────────────────
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id   = $data['stud_lrn'] ?? null;
        if (!$id) { echo json_encode(['error' => 'No LRN provided']); break; }

        $errors = [];
        if (empty(trim($data['first_name'] ?? ''))) $errors[] = "First name is required.";
        if (empty(trim($data['last_name']  ?? ''))) $errors[] = "Last name is required.";
        if (empty($data['birth_date']      ?? ''))  $errors[] = "Birth date is required.";
        if (empty($data['gender']          ?? ''))  $errors[] = "Gender is required.";
        if (empty($data['class_id']        ?? ''))  $errors[] = "Class/Section is required.";
        if (empty($data['adviser_id']      ?? ''))  $errors[] = "Adviser is required.";

        if ($errors) { http_response_code(422); echo json_encode(['errors' => $errors]); break; }

        $stmt = $pdo->prepare("
            UPDATE student SET
                first_name            = :first_name,
                middle_name           = :middle_name,
                last_name             = :last_name,
                gender                = :gender,
                birth_date            = :birth_date,
                address_barangay      = :address_barangay,
                address_municipality  = :address_municipality,
                class_id              = :class_id,
                adviser_id            = :adviser_id
            WHERE stud_lrn = :id
        ");
        $stmt->execute([
            ':first_name'           => trim($data['first_name']),
            ':middle_name'          => trim($data['middle_name'] ?? ''),
            ':last_name'            => trim($data['last_name']),
            ':gender'               => $data['gender'],
            ':birth_date'           => $data['birth_date'],
            ':address_barangay'     => trim($data['address_barangay'] ?? ''),
            ':address_municipality' => trim($data['address_municipality'] ?? ''),
            ':class_id'             => (int)$data['class_id'],
            ':adviser_id'           => (int)$data['adviser_id'],
            ':id'                   => $id,
        ]);
        echo json_encode(['success' => true, 'message' => 'Student updated successfully.']);
        break;

    // ── DELETE ────────────────────────────────────────────────────────────────
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) { echo json_encode(['error' => 'No ID provided']); break; }

        $stmt = $pdo->prepare("DELETE FROM student WHERE stud_lrn = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount()) {
            echo json_encode(['success' => true, 'message' => 'Student deleted successfully.']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Student not found.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
?>
