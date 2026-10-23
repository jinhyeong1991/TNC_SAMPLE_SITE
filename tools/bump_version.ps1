# 모든 페이지(*.html)의 css/ · js/ 파일 주소 뒤에 ?v=버전 을 붙이거나 새 버전으로 바꾼다.
# GitHub Pages 는 CSS·JS 를 브라우저에 약 10분 저장해 두므로, 주소가 바뀌어야 방문자에게 새 파일이 바로 간다.
# 사용: 수정 후 커밋하기 전에  powershell -File tools\bump_version.ps1   (버전 = 실행 시각 yyyyMMddHHmm)
param([string]$Site = (Split-Path $PSScriptRoot -Parent), [string]$Version = (Get-Date -Format 'yyyyMMddHHmm'))
$utf8 = New-Object System.Text.UTF8Encoding $false
$re = '((?:href|src)="(?:css|js)/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"'
Get-ChildItem $Site -Filter *.html | ForEach-Object {
    $text = [IO.File]::ReadAllText($_.FullName, $utf8)
    $n = ([regex]::Matches($text, $re)).Count
    if ($n -gt 0) {
        $text = [regex]::Replace($text, $re, "`$1?v=$Version`"")
        [IO.File]::WriteAllText($_.FullName, $text, $utf8)
    }
    "{0}: {1} links -> v={2}" -f $_.Name, $n, $Version
}
