# GitHub Actions Release 使用说明

这个项目已经配置了自动发布流程。只要把 `VERSION` 改成新版本号并推送到 `main`，GitHub Actions 就会自动创建 tag、生成 Release Notes、发布 GitHub Release，并构建 Docker 镜像推送到 GHCR。

## 一句话流程

```bash
# 1. 修改 VERSION，比如改成 1.0.2
git add VERSION
git commit -m "chore: release 1.0.2"
git push origin main
```

推送后打开 GitHub 仓库页面：

```text
Actions -> Release
```

等待 workflow 跑完，然后打开：

```text
Releases
```

就能看到新的版本，例如 `v1.0.2`。

## 自动发布触发条件

当前 workflow 的触发条件是：

1. 推送到 `main`
2. 这次 push 里修改了 `VERSION`

也就是说，普通代码 push 不会发新版 Release。只有 `VERSION` 变化时才会自动发布。

例如：

```txt
1.0.1
```

改成：

```txt
1.0.2
```

然后提交并推送：

```bash
git add VERSION
git commit -m "chore: release 1.0.2"
git push origin main
```

GitHub Actions 会创建：

```text
tag: v1.0.2
release: v1.0.2
```

## Release Notes 是怎么生成的

Release Notes 来自上一个 tag 到当前 commit 之间的提交记录。

例如当前上一个版本是：

```text
v1.0.1
```

你后来提交了这些 commit：

```text
fix(mermaid): fix node text clipping in flowchart diagrams
feat(posts): add Dependabot guide
docs(posts): update GitHub Actions guide
chore: update config
```

然后把 `VERSION` 改成 `1.0.2` 并推送，Release Notes 会生成类似：

```md
## 1.0.2 (2026-04-26)

## Bug Fixes

- mermaid: fix node text clipping in flowchart diagrams (commit_hash)

## Features

- posts: add Dependabot guide (commit_hash)
```

`docs:`、`chore:`、`ci:` 等维护类 commit 不会写入 Release Notes。

## Commit Message 怎么写

这个 workflow 主要识别两类 commit：

```text
feat: ...
fix: ...
```

也支持带范围的写法：

```text
feat(scope): ...
fix(scope): ...
```

### Bug Fixes

想让内容出现在 `Bug Fixes` 下面，用 `fix:`。

```bash
git commit -m "fix: fix broken RSS link"
```

显示结果：

```md
## Bug Fixes

- fix broken RSS link (commit_hash)
```

带范围：

```bash
git commit -m "fix(mermaid): fix node text clipping in flowchart diagrams"
```

显示结果：

```md
## Bug Fixes

- mermaid: fix node text clipping in flowchart diagrams (commit_hash)
```

### Features

想让内容出现在 `Features` 下面，用 `feat:`。

```bash
git commit -m "feat(search): add keyboard shortcut"
```

显示结果：

```md
## Features

- search: add keyboard shortcut (commit_hash)
```

### 不进入 Release Notes 的提交

不是 `feat:` 或 `fix:` 开头的 commit，会被忽略，不会进入 GitHub Release。

```bash
git commit -m "docs(posts): update GitHub Actions guide"
git commit -m "chore: update dependencies"
git commit -m "ci: update release workflow"
```

这些提交仍然会保留在 git 历史里，只是不显示在 Release Notes 里。

## 推荐写法

平时开发时尽量这样写：

```bash
git commit -m "fix(component): describe the bug fix"
git commit -m "feat(component): describe the new feature"
git commit -m "docs(posts): describe article or documentation work"
```

真实例子：

```bash
git commit -m "fix(footer): make commit hash clickable"
git commit -m "fix(mermaid): fix node text clipping in flowchart diagrams"
git commit -m "feat(posts): add Dependabot and Conventional Commits guides"
git commit -m "feat(about): rewrite About page and homepage description"
git commit -m "docs(posts): update GitHub Actions release guide"
```

## 发布一个新版本

假设现在 `VERSION` 是：

```txt
1.0.1
```

你想发布 `1.0.2`：

1. 修改 `VERSION`

```txt
1.0.2
```

2. 提交版本号

```bash
git add VERSION
git commit -m "chore: release 1.0.2"
```

3. 推送到 GitHub

```bash
git push origin main
```

4. 去 GitHub 看结果

```text
Actions -> Release
```

成功后：

```text
Releases -> v1.0.2
```

## 手动触发 Release

也可以在 GitHub 页面手动触发：

```text
Actions -> Release -> Run workflow
```

但是要注意：如果当前 `VERSION` 对应的 tag 已经存在，workflow 会跳过发布。

例如 `VERSION` 是：

```txt
1.0.1
```

而 GitHub 上已经有：

```text
v1.0.1
```

那么手动运行也不会重新发布。要发布新版本，需要先把 `VERSION` 改成新的版本号。

## 为什么之前截图里会显示 Other Changes

之前截图里的内容：

```md
## Bug Fixes

- mermaid: fix node text clipping in flowchart diagrams (a2c9b56)

## Features

- about: rewrite About page and homepage description (dad844c)
- posts: add Dependabot and Conventional Commits guides in EN/ZH/RU (35fc70e)
```

是因为这些 commit message 分别是：

```text
fix(mermaid): fix node text clipping in flowchart diagrams
feat(about): rewrite About page and homepage description
feat(posts): add Dependabot and Conventional Commits guides in EN/ZH/RU
```

workflow 会自动把：

```text
fix(...)
```

放进：

```text
Bug Fixes
```

把：

```text
feat(...)
```

放进：

```text
Features
```

现在 workflow 已经改成忽略其他类型，所以这些不会再出现在 Release Notes：

```text
docs(posts): update article
chore: release 1.0.2
ci: update workflow
```

## 注意事项

1. 每次发布都要使用新的版本号。
2. 不要重复使用已经发布过的 `VERSION`。
3. 想让 Release Notes 好看，commit message 要认真写。
4. `fix:` 进 `Bug Fixes`。
5. `feat:` 进 `Features`。
6. 博文和文档修改用 `docs(posts): ...`，不会进入 Release Notes。
7. `chore:`、`docs:`、`ci:` 等其他类型不会进入 Release Notes。

## 常用命令备忘

查看当前版本：

```bash
cat VERSION
```

查看最近 commit：

```bash
git log --oneline -10
```

修改版本后发布：

```bash
git add VERSION
git commit -m "chore: release 1.0.2"
git push origin main
```

查看已有 tag：

```bash
git tag --list
```

查看远程 tag：

```bash
git ls-remote --tags origin
```
