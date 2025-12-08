# PowerShell script to convert Markdown documentation to Word Document
# Requires Microsoft Word to be installed

$markdownFile = "docs\TESTING_COMPLETE_DOCUMENTATION.md"
$wordFile = "docs\TESTING_COMPLETE_DOCUMENTATION.docx"

Write-Host "Reading markdown file..." -ForegroundColor Yellow

# Read markdown content
$content = Get-Content $markdownFile -Raw -Encoding UTF8

# Create Word application
Write-Host "Creating Word document..." -ForegroundColor Yellow
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()

# Set document properties
$doc.Content.Font.Name = "Calibri"
$doc.Content.Font.Size = 11
$selection = $word.Selection

# Split content into lines for processing
$lines = $content -split "`n"

foreach ($line in $lines) {
    $line = $line.TrimEnd()
    
    if ($line -match '^# (.+)$') {
        # H1 - Title
        $selection.Style = "Title"
        $selection.TypeText($matches[1])
        $selection.TypeParagraph()
    }
    elseif ($line -match '^## (.+)$') {
        # H2 - Heading 1
        $selection.Style = "Heading 1"
        $selection.TypeText($matches[1])
        $selection.TypeParagraph()
    }
    elseif ($line -match '^### (.+)$') {
        # H3 - Heading 2
        $selection.Style = "Heading 2"
        $selection.TypeText($matches[1])
        $selection.TypeParagraph()
    }
    elseif ($line -match '^\*\*(.+?)\*\*') {
        # Bold text
        $selection.Font.Bold = $true
        $selection.TypeText($matches[1])
        $selection.Font.Bold = $false
        $selection.TypeParagraph()
    }
    elseif ($line -match '^\|(.+)\|$') {
        # Table row
        $cells = $matches[1] -split '\|' | Where-Object { $_.Trim() -ne '' }
        if ($cells.Count -gt 0) {
            # Check if we need to create a table
            if ($selection.Tables.Count -eq 0 -or $selection.Tables.Item($selection.Tables.Count).Rows.Count -eq 0) {
                $table = $doc.Tables.Add($selection.Range, 1, $cells.Count)
                $table.Style = "Grid Table 4 - Accent 1"
            } else {
                $table = $selection.Tables.Item($selection.Tables.Count)
                $row = $table.Rows.Add()
            }
            
            for ($i = 0; $i -lt $cells.Count; $i++) {
                $cellText = $cells[$i].Trim()
                $cellText = $cellText -replace '\*\*', ''
                if ($table.Rows.Count -eq 1) {
                    # Header row
                    $table.Cell(1, $i + 1).Range.Text = $cellText
                    $table.Cell(1, $i + 1).Range.Font.Bold = $true
                } else {
                    $table.Cell($table.Rows.Count, $i + 1).Range.Text = $cellText
                }
            }
            $selection.MoveDown()
        }
    }
    elseif ($line -match '^---$') {
        # Horizontal rule
        $selection.InsertBreak(7) # wdPageBreak
    }
    elseif ($line -match '^```') {
        # Code block - skip for now
        continue
    }
    elseif ($line.Length -gt 0) {
        # Regular paragraph
        $lineText = $line
        $lineText = $lineText -replace '\*\*(.+?)\*\*', '$1' # Remove bold markers
        $lineText = $lineText -replace '\*(.+?)\*', '$1' # Remove italic markers
        $lineText = $lineText -replace '`(.+?)`', '$1' # Remove code markers
        $lineText = $lineText -replace '✅', '[PASS]'
        $lineText = $lineText -replace '⚠️', '[PARTIAL]'
        
        if ($lineText -match '^- (.+)$') {
            # Bullet point
            $selection.TypeText("• " + $matches[1])
        } else {
            $selection.TypeText($lineText)
        }
        $selection.TypeParagraph()
    } else {
        # Empty line
        $selection.TypeParagraph()
    }
}

# Save document
Write-Host "Saving Word document..." -ForegroundColor Yellow
$fullPath = (Resolve-Path "docs").Path + "\TESTING_COMPLETE_DOCUMENTATION.docx"
$doc.SaveAs([ref]$fullPath, [ref]16) # 16 = wdFormatDocumentDefault

# Close document and Word
$doc.Close()
$word.Quit()

# Release COM objects
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Word document created successfully: $fullPath" -ForegroundColor Green
Write-Host "Opening document..." -ForegroundColor Yellow

# Open the document
Start-Process $fullPath

