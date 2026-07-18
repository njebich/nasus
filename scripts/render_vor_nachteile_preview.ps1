$workbookPath = 'E:\Das Western Rollenspiel\LLM\outputs\vor-und-nachteile-v1.1-chatgpt\vor-und-nachteile-v1.1-chatgpt.xlsx'
$previewDir = 'E:\Das Western Rollenspiel\LLM\outputs\vor-und-nachteile-v1.1-chatgpt\preview'
New-Item -ItemType Directory -Path $previewDir -Force | Out-Null

$excel = $null
$workbook = $null
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $workbook = $excel.Workbooks.Open($workbookPath, 0, $true)

    $main = $workbook.Worksheets.Item('Vor- und Nachteile')
    $main.Activate()
    $main.PageSetup.PrintArea = '$A$1:$M$12'
    $main.PageSetup.Orientation = 2
    $main.PageSetup.Zoom = $false
    $main.PageSetup.FitToPagesWide = 1
    $main.PageSetup.FitToPagesTall = 1
    $main.ExportAsFixedFormat(0, (Join-Path $previewDir 'main-preview.pdf'))
    $main.Range('A1:M12').CopyPicture(1, 2)
    $mainChart = $main.ChartObjects().Add(0, 0, 2400, 950)
    $mainChart.Chart.Paste() | Out-Null
    $mainChart.Chart.Export((Join-Path $previewDir 'main-preview.png'), 'PNG') | Out-Null
    $mainChart.Delete()

    $legend = $workbook.Worksheets.Item('Legende')
    $legend.Activate()
    $legend.PageSetup.PrintArea = '$A$1:$B$18'
    $legend.PageSetup.Orientation = 2
    $legend.PageSetup.Zoom = $false
    $legend.PageSetup.FitToPagesWide = 1
    $legend.PageSetup.FitToPagesTall = 1
    $legend.ExportAsFixedFormat(0, (Join-Path $previewDir 'legend-preview.pdf'))
    $legend.Range('A1:B18').CopyPicture(1, 2)
    $legendChart = $legend.ChartObjects().Add(0, 0, 1800, 900)
    $legendChart.Chart.Paste() | Out-Null
    $legendChart.Chart.Export((Join-Path $previewDir 'legend-preview.png'), 'PNG') | Out-Null
    $legendChart.Delete()

    $mapping = $workbook.Worksheets.Item('Werte-Zuordnungen')
    $mapping.Activate()
    $mapping.PageSetup.PrintArea = '$A$1:$I$16'
    $mapping.PageSetup.Orientation = 2
    $mapping.PageSetup.Zoom = $false
    $mapping.PageSetup.FitToPagesWide = 1
    $mapping.PageSetup.FitToPagesTall = 1
    $mapping.ExportAsFixedFormat(0, (Join-Path $previewDir 'mapping-preview.pdf'))
    $mapping.Range('A1:I16').CopyPicture(1, 2)
    $mappingChart = $mapping.ChartObjects().Add(0, 0, 2100, 900)
    $mappingChart.Chart.Paste() | Out-Null
    $mappingChart.Chart.Export((Join-Path $previewDir 'mapping-preview.png'), 'PNG') | Out-Null
    $mappingChart.Delete()

    $listAudit = $workbook.Worksheets.Item('Listen-Abgleich')
    $listAudit.Activate()
    $listAudit.PageSetup.PrintArea = '$A$1:$H$18'
    $listAudit.PageSetup.Orientation = 2
    $listAudit.PageSetup.Zoom = $false
    $listAudit.PageSetup.FitToPagesWide = 1
    $listAudit.PageSetup.FitToPagesTall = 1
    $listAudit.ExportAsFixedFormat(0, (Join-Path $previewDir 'list-audit-preview.pdf'))
    $listAudit.Range('A1:H18').CopyPicture(1, 2)
    $listAuditChart = $listAudit.ChartObjects().Add(0, 0, 2200, 1000)
    $listAuditChart.Chart.Paste() | Out-Null
    $listAuditChart.Chart.Export((Join-Path $previewDir 'list-audit-preview.png'), 'PNG') | Out-Null
    $listAuditChart.Delete()

    $removed = $workbook.Worksheets.Item('Entfernte Zeilen')
    $removed.Activate()
    $removed.PageSetup.PrintArea = '$A$1:$E$18'
    $removed.PageSetup.Orientation = 2
    $removed.PageSetup.Zoom = $false
    $removed.PageSetup.FitToPagesWide = 1
    $removed.PageSetup.FitToPagesTall = 1
    $removed.ExportAsFixedFormat(0, (Join-Path $previewDir 'removed-preview.pdf'))
    $removed.Range('A1:E18').CopyPicture(1, 2)
    $removedChart = $removed.ChartObjects().Add(0, 0, 2200, 1000)
    $removedChart.Chart.Paste() | Out-Null
    $removedChart.Chart.Export((Join-Path $previewDir 'removed-preview.png'), 'PNG') | Out-Null
    $removedChart.Delete()
}
finally {
    if ($workbook -ne $null) {
        $workbook.Close($false)
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
    }
    if ($excel -ne $null) {
        $excel.Quit()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
