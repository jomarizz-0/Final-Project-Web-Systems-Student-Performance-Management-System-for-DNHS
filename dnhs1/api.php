<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {

    // ── READ ──────────────────────────────────────────────────────────────────
    case 'GET':

        if ($action === 'get_students') {
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("
                    SELECT s.*, p.first_name AS supervisor_fname, p.last_name AS supervisor_lname
                    FROM student s
                    LEFT JOIN personnel p ON s.personnel_id = p.personnel_id
                    WHERE s.first_name LIKE :s OR s.last_name LIKE :s
                       OR s.middle_name LIKE :s OR s.address_municipality LIKE :s
                       OR s.address_barangay LIKE :s
                    ORDER BY s.last_name, s.first_name
                ");
                $stmt->execute([':s' => "%$search%"]);
            } else {
                $stmt = $pdo->query("
                    SELECT s.*, p.first_name AS supervisor_fname, p.last_name AS supervisor_lname
                    FROM student s
                    LEFT JOIN personnel p ON s.personnel_id = p.personnel_id
                    ORDER BY s.last_name, s.first_name
                ");
            }
            echo json_encode($stmt->fetchAll());
        }

        elseif ($action === 'get_student') {
            // Fixed: use stud_lrn, not student_id
            $id = $_GET['id'] ?? null;
            if (!$id) { echo json_encode(['error' => 'No ID provided']); break; }
            $stmt = $pdo->prepare("SELECT * FROM student WHERE stud_lrn = ?");
            $stmt->execute([$id]);
            $student = $stmt->fetch();
            echo json_encode($student ?: ['error' => 'Student not found']);
        }

        elseif ($action === 'get_personnel') {
            $stmt = $pdo->query("
                SELECT personnel_id, first_name, last_name, position_type 
                FROM personnel ORDER BY last_name
            ");
            echo json_encode($stmt->fetchAll());
        }

        break;

    // ── CREATE ────────────────────────────────────────────────────────────────
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $errors = [];
        if (empty(trim($data['first_name']  ?? ''))) $errors[] = "First name is required.";
        if (empty(trim($data['last_name']   ?? ''))) $errors[] = "Last name is required.";
        if (empty($data['birth_date']       ?? ''))  $errors[] = "Birth date is required.";
        if (empty($data['gender']           ?? ''))  $errors[] = "Gender is required.";
        if (empty($data['stud_lrn']         ?? ''))  $errors[] = "Student LRN is required.";

        if ($errors) {
            http_response_code(422);
            echo json_encode(['errors' => $errors]);
            break;
        }

        // Check if LRN already exists
        $check = $pdo->prepare("SELECT stud_lrn FROM student WHERE stud_lrn = ?");
        $check->execute([trim($data['stud_lrn'])]);
        if ($check->fetch()) {
            http_response_code(422);
            echo json_encode(['errors' => ['LRN already exists.']]);
            break;
        }

        $stmt = $pdo->prepare("
            INSERT INTO student
                (stud_lrn, personnel_id, first_name, middle_name, last_name,
                 birth_date, gender, address_barangay, address_municipality)
            VALUES
                (:stud_lrn, :personnel_id, :first_name, :middle_name, :last_name,
                 :birth_date, :gender, :address_barangay, :address_municipality)
        ");
        $stmt->execute([
            ':stud_lrn'            => trim($data['stud_lrn']),
            ':personnel_id'        => !empty($data['personnel_id']) ? (int)$data['personnel_id'] : null,
            ':first_name'          => trim($data['first_name']),
            ':middle_name'         => trim($data['middle_name'] ?? ''),
            ':last_name'           => trim($data['last_name']),
            ':birth_date'          => $data['birth_date'],
            ':gender'              => $data['gender'],
            ':address_barangay'    => trim($data['address_barangay'] ?? ''),
            ':address_municipality'=> trim($data['address_municipality'] ?? ''),
        ]);
        echo json_encode(['success' => true, 'message' => 'Student added successfully.']);
        break;

    // ── UPDATE ────────────────────────────────────────────────────────────────
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        // Fixed: use stud_lrn, not student_id
        $id = $data['stud_lrn'] ?? null;
        if (!$id) { echo json_encode(['error' => 'No LRN provided']); break; }

        $errors = [];
        if (empty(trim($data['first_name'] ?? ''))) $errors[] = "First name is required.";
        if (empty(trim($data['last_name']  ?? ''))) $errors[] = "Last name is required.";
        if (empty($data['birth_date']      ?? ''))  $errors[] = "Birth date is required.";
        if (empty($data['gender']          ?? ''))  $errors[] = "Gender is required.";

        if ($errors) {
            http_response_code(422);   // Fixed: was http_replace_code()
            echo json_encode(['errors' => $errors]);
            break;
        }

        $stmt = $pdo->prepare("
            UPDATE student SET
                personnel_id          = :personnel_id,
                first_name            = :first_name,
                middle_name           = :middle_name,
                last_name             = :last_name,
                birth_date            = :birth_date,
                gender                = :gender,
                address_barangay      = :address_barangay,
                address_municipality  = :address_municipality
            WHERE stud_lrn = :id
        ");
        $stmt->execute([
            ':personnel_id'        => !empty($data['personnel_id']) ? (int)$data['personnel_id'] : null,
            ':first_name'          => trim($data['first_name']),
            ':middle_name'         => trim($data['middle_name'] ?? ''),
            ':last_name'           => trim($data['last_name']),
            ':birth_date'          => $data['birth_date'],
            ':gender'              => $data['gender'],
            ':address_barangay'    => trim($data['address_barangay'] ?? ''),
            ':address_municipality'=> trim($data['address_municipality'] ?? ''),
            ':id'                  => $id,
        ]);
        echo json_encode(['success' => true, 'message' => 'Student updated successfully.']);
        break;

    // ── DELETE ────────────────────────────────────────────────────────────────
    case 'DELETE':
        // Fixed: read from query string (matches script.js fetch URL)
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