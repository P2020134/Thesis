<?php
$satisfaction = $_POST["satisfaction"];
$effectiveness = $_POST["effectiveness"];
$communication = $_POST["communication"];
$valuable_aspect = $_POST["valuable_aspect"];
$challenges_faced = $_POST["challenges_faced"];
$suggestions = $_POST["suggestions"];
$recommended_services = $_POST["recommended_services"];
$additional_comments = $_POST["additional_comments"];

// Database connection
$conn = new mysqli("localhost", "root", "", "feedback_thesis");

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO registration (satisfaction, effectiveness, communication, valuable_aspect, challenges_faced, suggestions, recommended_services, additional_comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiisssss", $satisfaction, $effectiveness, $communication, $valuable_aspect, $challenges_faced, $suggestions, $recommended_services, $additional_comments);
    
    if ($stmt->execute()) {
        echo "Registration successful...";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
