# Devil x Detail Web

## Production deployment

Production deploys automatically through Vercel after `main` is pushed to GitHub.

This repository uses a dedicated SSH identity for the `DevilxDetail` GitHub
account. Its remote must use the `github-devilxdetail` host alias:

```text
git@github-devilxdetail:DevilxDetail/DxD-Web-v3-React.git
```

Standard deployment workflow:

```bash
git status
git add <files>
git commit -m "<message>"
git push origin main
```

Verify the configured identity before pushing:

```bash
ssh -T git@github-devilxdetail
```

The expected response begins with `Hi DevilxDetail!`. Do not use the default
`github.com` SSH identity for this repository; that key belongs to a different
GitHub account used by other projects.
