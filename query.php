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
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    echo json_encode($data);
}

switch($_GET['queryType'] ?? '') {
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
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        
        echo json_encode($data);
        $stmt->close();
        break;
        
    default:
        echo json_encode([
            'error' => 'Invalid query type',
            'all_GET_params' => $_GET
        ]);
        break;
}

$conn->close();
?>