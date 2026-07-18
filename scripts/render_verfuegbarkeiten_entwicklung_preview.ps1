$workbookPath = 'E:\Das Western Rollenspiel\LLM\Verfuegbarkeiten-Herkunftsorte-Entwicklung.xlsx'
$previewDir = 'E:\Das Western Rollenspiel\LLM\temp\verfuegbarkeiten_entwicklung_preview'
New-Item -ItemType Directory -Path $previewDir -Force | Out-Null

$configs = @(
    @{ Index = 1; Range = 'A1:F35'; File = '01-uebersicht'; Width = 1900; Height = 2450 },
    @{ Index = 2; Range = 'A1:F18'; File = '02-ortsmodell'; Width = 2100; Height = 1200 },
    @{ Index = 3; Range = 'A1:F35'; File = '03-ortsauspraegungen'; Width = 2150; Height = 1750 },
    @{ Index = 4; Range = 'A1:F47'; File = '04-warengruppen'; Width = 3000; Height = 2400 },
    @{ Index = 5; Range = 'A1:J7'; File = '05-beispielorte'; Width = 3150; Height = 850 },
    @{ Index = 6; Range = 'A1:E49'; File = '06-ort-haendler'; Width = 2300; Height = 2850 },
    @{ Index = 7; Range = 'A1:F22'; File = '07-voelker-modell'; Width = 2150; Height = 1350 },
    @{ Index = 8; Range = 'A1:G26'; File = '08-material-referenz'; Width = 2850; Height = 1650 },
    @{ Index = 9; Range = 'A1:K32'; File = '09-ruestungen'; Width = 3300; Height = 1750 },
    @{ Index = 10; Range = 'A1:O25'; File = '10-artefakte'; Width = 3900; Height = 1500 },
    @{ Index = 11; Range = 'A1:M25'; File = '11-audit'; Width = 3400; Height = 1500 },
    @{ Index = 12; Range = 'A1:F28'; File = '12-offene-entscheidungen'; Width = 2450; Height = 2150 },
    @{ Index = 13; Range = 'A1:D13'; File = '13-claude-auftrag'; Width = 2200; Height = 1150 }
)

$excel = $null
$workbook = $null
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    $workbook = $excel.Workbooks.Open($workbookPath, 0, $true)
    $excel.CalculateFull()

    foreach ($config in $configs) {
        $sheet = $workbook.Worksheets.Item($config.Index)
        $sheet.Activate()
        $range = $sheet.Range($config.Range)
        $range.CopyPicture(1, 2)
        $chart = $sheet.ChartObjects().Add(0, 0, $config.Width, $config.Height)
        try {
            $chart.Chart.Paste() | Out-Null
            $target = Join-Path $previewDir ($config.File + '.png')
            $chart.Chart.Export($target, 'PNG') | Out-Null
            Write-Output $target
        }
        finally {
            $chart.Delete()
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($chart) | Out-Null
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($range) | Out-Null
            [System.Runtime.InteropServices.Marshal]::ReleaseComObject($sheet) | Out-Null
        }
    }
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
