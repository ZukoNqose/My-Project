# PowerShell script to convert Markdown to Word-compatible HTML
# Word can open HTML files and save as .docx

$markdownFile = "docs\TESTING_COMPLETE_DOCUMENTATION.md"
$htmlFile = "docs\TESTING_COMPLETE_DOCUMENTATION.html"
$wordFile = "docs\TESTING_COMPLETE_DOCUMENTATION.docx"

# Read markdown content
$content = Get-Content $markdownFile -Raw -Encoding UTF8

# Basic markdown to HTML conversion
$html = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Comprehensive Testing Documentation - Todo Application</title>
    <style>
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            border-bottom: 2px solid #95a5a6;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        h3 {
            color: #555;
            margin-top: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }
        ul, ol {
            margin: 10px 0;
            padding-left: 30px;
        }
        li {
            margin: 5px 0;
        }
        .status-pass {
            color: #27ae60;
            font-weight: bold;
        }
        .status-fail {
            color: #e74c3c;
            font-weight: bold;
        }
        .status-partial {
            color: #f39c12;
            font-weight: bold;
        }
        hr {
            border: none;
            border-top: 2px solid #ecf0f1;
            margin: 30px 0;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #ecf0f1;
        }
    </style>
</head>
<body>
"@

# Convert markdown to HTML (basic conversion)
$content = $content -replace '# (.+)', '<h1>$1</h1>'
$content = $content -replace '## (.+)', '<h2>$1</h2>'
$content = $content -replace '### (.+)', '<h3>$1</h3>'
$content = $content -replace '\*\*(.+?)\*\*', '<strong>$1</strong>'
$content = $content -replace '\*(.+?)\*', '<em>$1</em>'
$content = $content -replace '`(.+?)`', '<code>$1</code>'
$content = $content -replace '---', '<hr>'
$content = $content -replace '\n\n', '</p><p>'
$content = $content -replace '\n', '<br>'

# Convert tables (basic)
$content = $content -replace '\|(.+)\|', { 
    $row = $_.Groups[1].Value
    $cells = $row -split '\|' | Where-Object { $_.Trim() -ne '' }
    $htmlRow = '<tr>' + ($cells | ForEach-Object { "<td>$($_.Trim())</td>" }) + '</tr>'
    $htmlRow
}

# Wrap in paragraphs
$content = "<p>$content</p>"

$html += $content
$html += @"
</body>
</html>
"@

# Save HTML file
$html | Out-File -FilePath $htmlFile -Encoding UTF8

Write-Host "HTML file created: $htmlFile" -ForegroundColor Green
Write-Host "You can now:" -ForegroundColor Yellow
Write-Host "1. Open $htmlFile in Microsoft Word" -ForegroundColor Cyan
Write-Host "2. Save As -> Word Document (.docx)" -ForegroundColor Cyan
Write-Host "3. Or use: Get-Content $htmlFile | Out-File -FilePath $wordFile" -ForegroundColor Cyan

# Try to open in Word if available
$wordPath = "C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE"
if (Test-Path $wordPath) {
    Write-Host "Opening in Microsoft Word..." -ForegroundColor Green
    Start-Process $wordPath -ArgumentList $htmlFile
} else {
    Write-Host "Microsoft Word not found. Please open $htmlFile manually." -ForegroundColor Yellow
}

