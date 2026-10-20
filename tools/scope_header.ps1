# header.css 를 상세/주문 페이지용으로 바꾼다: 모든 규칙을 샘플 헤더 요소(#hd 등) 안으로만 한정해서
# 실제 상품 페이지 CSS(.wrap .right .btn .pop ...)와 서로 덮어쓰지 않게 한다
param([string]$Site = (Split-Path $PSScriptRoot -Parent))
$css = [IO.File]::ReadAllText("$Site\css\header.css", [Text.Encoding]::UTF8)
$IDS = ':is(#hd,#hdSpace,#scrim,#dScrim,#drawer,#sDim,#srch,#toast,#hdDim)'
$GLOBAL = @(':root', '*', 'body', 'html', 'a', 'button', 'svg')

function Scope-One([string]$s) {
  $s = $s.Trim()
  if ($s -eq '') { return $null }
  if ($GLOBAL -contains $s) { return $null }   # 전역 리셋은 버린다 (실제 페이지 reset.css 를 따름)
  if ($s -match '^(from|to|\d+%)') { return $s }
  # 첫 덩어리(조합자 앞)에 :is(...) 를 붙인 형태 + 조상으로 붙인 형태
  $m = [regex]::Match($s, '^[^\s>+~]+')
  $first = $m.Value; $rest = $s.Substring($first.Length)
  $k = $first.IndexOf('::')
  if ($k -ge 0) { $self = $first.Substring(0, $k) + $IDS + $first.Substring($k) } else { $self = $first + $IDS }
  return "$IDS $s,$self$rest"
}

$out = New-Object System.Text.StringBuilder
$i = 0; $n = $css.Length
function Emit-Block([string]$text) {
  # text: 한 단계의 규칙 묶음. 선택자{...} 를 돌며 선택자만 바꾼다
  $res = New-Object System.Text.StringBuilder
  $p = 0
  while ($p -lt $text.Length) {
    $b = $text.IndexOf('{', $p)
    if ($b -lt 0) { [void]$res.Append($text.Substring($p)); break }
    $head = $text.Substring($p, $b - $p)
    # 짝이 맞는 } 찾기
    $d = 0; $e = $b
    for ($q = $b; $q -lt $text.Length; $q++) { $c = $text[$q]; if ($c -eq '{') { $d++ } elseif ($c -eq '}') { $d--; if ($d -eq 0) { $e = $q; break } } }
    $body = $text.Substring($b + 1, $e - $b - 1)
    $comment = ''
    $hc = [regex]::Replace($head, '/\*[\s\S]*?\*/', { param($mm) $script:comment += $mm.Value; '' })
    $ht = $hc.Trim()
    if ($ht.StartsWith('@keyframes')) { [void]$res.Append("$head{$body}") }
    elseif ($ht.StartsWith('@media') -or $ht.StartsWith('@supports')) { [void]$res.Append("$head{" + (Emit-Block $body) + "}") }
    else {
      $sels = @($ht -split ',' | ForEach-Object { Scope-One $_ } | Where-Object { $_ })
      if ($sels.Count) { [void]$res.Append("`n" + ($sels -join ',') + "{$body}") }
    }
    $p = $e + 1
  }
  return $res.ToString()
}
$scoped = Emit-Block $css
$hdr = "/* 자동 생성: css/header.css 를 #hd 등 샘플 헤더 요소 안으로 한정한 버전 (view.html · order.html 전용). header.css 를 고치면 tools/scope_header.ps1 로 다시 만드세요. */`n"
$vars = ":root{--red:#E1002A;--red-d:#B80022;--red-bg:#FFF0F2;--ink:#111318;--ink2:#4A4F5A;--ink3:#8A909C;--line:#ECEEF2;--bg:#F6F7F9;--white:#fff;--r:14px}`n"
$reset = "$IDS,$IDS *{box-sizing:border-box}`n$IDS{font-family:Pretendard,'Noto Sans KR',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;letter-spacing:normal;line-height:normal}`n$IDS a,$IDS a:hover{color:inherit;text-decoration:none}`n$IDS button{font:inherit;cursor:pointer;border:0;background:none;color:inherit}`n$IDS svg{display:block}`n$IDS ul,$IDS ol,$IDS li{list-style:none}`n$IDS input{font:inherit}`n$IDS h3,$IDS h4,$IDS h6,$IDS p,$IDS ul,$IDS ol,$IDS dl,$IDS form{margin:0;padding:0}`n"
[IO.File]::WriteAllText("$Site\css\header-view.css", $hdr + $vars + $reset + $scoped, (New-Object System.Text.UTF8Encoding $false))
"header-view.css: $((Get-Item "$Site\css\header-view.css").Length) bytes"
