<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust for production

// Database credentials (find these in cPanel)
$servername = "localhost";
$username = "codereli_joe";
$password = "coderelicJoe2801@green";
$dbname = "codereli_events";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Get the query type from request
$action = $_GET['action'] ?? '';

if ($action === 'countAllPlayers') {
    $sql = "SELECT COUNT(*) AS 'Total Players' FROM players";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode($data);
}

switch ($_GET['queryType'] ?? '') {
    case 'getContinualId':
        $continualId = $_GET['continualId'] ?? '';

        if (empty($continualId)) {
            echo json_encode(['error' => 'continualId is required']);
            exit;
        }

        $stmt = $conn->prepare("SELECT pdga_event_id FROM continual_events WHERE continual_id = ?");

        if (!$stmt) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $continualId);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        $stmt->close();
        break;

    case 'getEventDatesByIds':
        $eventIds = $_GET['eventIds'] ?? '';

        if (empty($eventIds)) {
            echo json_encode(['error' => 'eventIds is required']);
            exit;
        }

        // Convert comma-separated string to array
        $idsArray = explode(',', $eventIds);

        // Validate all are numeric
        foreach ($idsArray as $id) {
            if (!is_numeric($id)) {
                echo json_encode(['error' => 'Invalid event ID']);
                exit;
            }
        }

        // Create placeholders for prepared statement
        $placeholders = implode(',', array_fill(0, count($idsArray), '?'));

        $stmt = $conn->prepare("SELECT pdga_event_id, start_date FROM events WHERE pdga_event_id IN ($placeholders) ORDER BY pdga_event_id");

        if (!$stmt) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        // Bind parameters dynamically
        $types = str_repeat('i', count($idsArray));
        $stmt->bind_param($types, ...$idsArray);

        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        $stmt->close();
        break;

    case 'getPlayerCountsByEventIds':
        $eventIds = $_GET['eventIds'] ?? '';

        if (empty($eventIds)) {
            echo json_encode(['error' => 'eventIds is required']);
            exit;
        }

        // Convert comma-separated string to array
        $idsArray = explode(',', $eventIds);

        // Validate all are numeric
        foreach ($idsArray as $id) {
            if (!is_numeric($id)) {
                echo json_encode(['error' => 'Invalid event ID']);
                exit;
            }
        }

        // Create placeholders for prepared statement
        $placeholders = implode(',', array_fill(0, count($idsArray), '?'));

        $stmt = $conn->prepare("
        SELECT pdga_event_id, COUNT(*) AS player_count 
        FROM event_results 
        WHERE pdga_event_id IN ($placeholders)
        GROUP BY pdga_event_id
        ORDER BY pdga_event_id DESC
    ");

        if (!$stmt) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        // Bind parameters dynamically
        $types = str_repeat('i', count($idsArray));
        $stmt->bind_param($types, ...$idsArray);

        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        $stmt->close();
        break;

    case 'getContinualEventsComplete':
        $continualId = $_GET['continualId'] ?? '';

        if (empty($continualId)) {
            echo json_encode(['error' => 'continualId is required']);
            exit;
        }

        $stmt = $conn->prepare("
        SELECT 
            e.pdga_event_id,
            YEAR(e.start_date) as year,
            COUNT(er.id) as player_count
        FROM continual_events ce
        JOIN events e ON ce.pdga_event_id = e.pdga_event_id
        LEFT JOIN event_results er ON e.pdga_event_id = er.pdga_event_id
        WHERE ce.continual_id = ?
        GROUP BY e.pdga_event_id, e.start_date
        ORDER BY e.pdga_event_id ASC
    ");

        if (!$stmt) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $continualId);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        $stmt->close();
        break;

    case 'getContinualEventYears':
        $continualId = $_GET['continualId'] ?? '';

        if (empty($continualId)) {
            echo json_encode(['error' => 'continualId is required']);
            exit;
        }

        $stmt = $conn->prepare("
        SELECT DISTINCT
            YEAR(e.start_date) AS year
        FROM 
            continual_events ce
        JOIN 
            events e ON ce.pdga_event_id = e.pdga_event_id
        WHERE 
            ce.continual_id = ?
        ORDER BY 
            year ASC
    ");

        if (!$stmt) {
            echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $continualId);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        $stmt->close();
        break;
}

$conn->close();
