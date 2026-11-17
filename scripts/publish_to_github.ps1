# Run from the OLAPulse project root on Windows PowerShell.
# Requires GitHub CLI (gh), an authorized GitHub account, and the local Git history.
$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'GitHub CLI is not installed. Install it with: winget install GitHub.cli'
}
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw 'Git is not installed. Install it with: winget install Git.Git'
}
gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host 'Follow GitHub authentication instructions:'
  gh auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw 'Could not authenticate GitHub CLI.' }
}
$username = (gh api user --jq '.login').Trim()
if (-not $username) { throw 'Unable to read the authenticated GitHub username.' }
$repo = "$username/OLAPulse"
gh repo view $repo --json name *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Creating public repository: $repo"
  gh repo create $repo --public --source . --remote origin --push
  if ($LASTEXITCODE -ne 0) { throw 'Repository creation or push failed.' }
} else {
  Write-Host "Repository exists: $repo"
  git remote get-url origin *> $null
  if ($LASTEXITCODE -ne 0) {
    git remote add origin "https://github.com/$repo.git"
  }
  git branch -M main
  git push -u origin main
  if ($LASTEXITCODE -ne 0) { throw 'Git push failed.' }
}
Write-Host "Repository: https://github.com/$repo"
Write-Host "Next: Settings > Pages > Source: GitHub Actions; review Actions workflow."
Write-Host "Expected live URL after a successful deployment: https://$username.github.io/OLAPulse/"
