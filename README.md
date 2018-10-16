# @priestine/semantics

[![pipeline](https://gitlab.com/priestine/semantics/badges/master/pipeline.svg)](https://gitlab.com/priestine/semantics) [![coverage](https://gitlab.com/priestine/semantics/badges/master/coverage.svg)](https://gitlab.com/priestine/semantics/commits/master) [![licence: MIT](https://img.shields.io/npm/l/@priestine/semantics.svg)](https://gitlab.com/priestine/semantics) [![docs: typedoc](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://priestine.gitlab.io/semantics) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics)

`@priestine/semantics` automates version bumping for your projects. It determines the next version number (you need to follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specificationg) for it to work correctly), generates the release notes and publishes the release tag (only GitLab is currently supported).

## Features

* Automated versioning that follows [SemVer](https://semver.org/) spec
* Automatically generated release notes
* Simple and transparent way of releasing your code
* Support for formalized commits that follow widely adopted specifications
* Support for any language
* Simple integration with CI/CD
* Docker image for your entertainment
* Unopinionated behaviour (except for requirements of following SemVer and Conventional Commits)
* Easy-to-use interface for referencing current and generated versions plus the changelog that are generated by `@priestine/semantics` which you can use in your deployment later on

## WAT?

`@priestine/semantics` uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) to determine the types of changes in the codebase and determines the next [semantic version](https://semver.org/), generates a list of changes (a changelog) and publishes appropriate release tag with the changelog attached to it.

## Execution logic

1. Get the latest release tag for the project
2. Obtain the commit that the latest release tag is bound to
3. Get a list of commits since the latest release commit up to the current one
4. Analyze commits
5. Generate changelog for analyzed commits
6. Use API to create a release tag and append the changelog to the release message
7. Put metadata (see [#output](#output)) in temporary files

You can use add your own logic in the same job after `@priestine/semantics` has finished running, or assign a separate release job that will run on publishing the tag to GitLab.

## Installation

### Docker and GitLab CI (preferred choice)

The easiest way to use the app is to go get the [Dockerfile from Docker Cloud](https://cloud.docker.com/repository/docker/priestine/semantics). You can create a separate job in your `.gitlab-ci.yml` that will bump your versions. In fact it is as easy as

```yaml
# .gitab-ci.yml

versioning:
  stage: deploy
  image: priestine/semantics:latest
  script:
  - priestine-semantics
  only:
  - master
```

**IMPORTANT NOTE**: For the app to be able to publish new tags on GitLab, you need to provide a `PRIVATE_TOKEN` environment variable. If you don't want `@priestine/semantics` to publish tags, simply omit the following step. Without the `PRIVATE_TOKEN` the app will only evaluate changes and put temporary files with metadata grabbed during evaluation (see [#output](#output))

### `PRIVATE_TOKEN`

Private token env variable is in fact a GitLab user access token that is used for publishing tags to GitLab. To create an access token, follow the steps:

1. Go to your profile page (https://gitlab.com/profile)
2. Choose `Access Tokens` in the menu on the left (https://gitlab.com/profile/personal_access_tokens)
3. In the `Name` input, provide something viable like `Semantics`
4. In the **scopes** section, check the `api` checkbox
5. Press the `Create personal access token button`
6. You'll get your newly created access token inside `Your New Personal Access Token` input
7. Copy it and paste it in your private environment variables as `PRIVATE_TOKEN` ([GitLab docs](https://docs.gitlab.com/ee/ci/environments.html))

It is a good idea to create a separate user and use it for the releasing purposes.

`@priestine/semantics` Dockerfile is built from `node:10-alpine`:

#### Docker info

[![Docker Pulls](https://img.shields.io/docker/pulls/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics/) [![Docker Stars](https://img.shields.io/docker/stars/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics/) [![MicroBadger Layers](https://img.shields.io/microbadger/layers/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics/) [![MicroBadger Size](https://img.shields.io/microbadger/image-size/priestine/semantics.svg)](https://hub.docker.com/r/priestine/semantics/)

### Manual usage

If you want to run `@priestine/semantics` yourself locally (or elsewhere except for CI) you will need [Node.js 8 or higher](https://nodejs.org/en/download/) installed on your machine. Simply install the package globally

```bash
yarn global add @priestine/semantics
```

or

```bash
npm i -g @priestine/semantics
```

Then, in your project directory, run

```bash
priestine-semantics
```

#### NPM info

[![npm](https://img.shields.io/npm/dt/@priestine/semantics.svg)](https://www.npmjs.com/package/@priestine/semantics) [![npm](https://img.shields.io/npm/v/@priestine/semantics.svg)](https://www.npmjs.com/package/@priestine/semantics)

### Output

While running, `@priestine/semantics` generates a few temporary files for your disposal. NOTE: they will only be created if a new release is required.

#### .tmp.current_commit_data (Example)

The commit assigned to the previous tag (if there was previous release tag in place for current project).

```text
4ed93c713f65eff843406a549c740132c99da123

```

#### .tmp.current_tag_data (Example)

Previous tag (if there was previous release tag in place for current project).

```text
2.2.3

```

#### .tmp.version_data (Example)

The version that should be assigned according to the contents of the commits.

```text
2.2.4

```

#### .tmp.current_changes.json (Example)

JSON containing all the commits that were evaluated.

```json
[
  {
    "hash": "4ed93c713f65eff843406a549c740132c99da123",
    "abbrevHash": "4ed93c7",
    "author": {
      "name": "priestine1",
      "email": "priestine1.dev@gmail.com"
    },
    "subject": "Correct writing of normalized changes to JSON",
    "body": [],
    "issueReference": "#25",
    "type": "fix",
    "breakingChanges": []
  },
  {
    "hash": "36af8aaa38cea6613c773ce55390a09d7e5898d0",
    "abbrevHash": "36af8aa",
    "author": {
      "name": "priestine1",
      "email": "priestine1.dev@gmail.com"
    },
    "subject": "Last attempt to fix publishing for today",
    "body": [],
    "issueReference": "#14",
    "type": "fix",
    "breakingChanges": []
  }
]

```

#### .tmp.changelog.md (Example)

Markdown changelog for evaluated commits.

```markdown
# 2.2.4


## Bug Fixes

`A bug fix`

* **4ed93c7**: Correct writing of normalized changes to JSON (**#25**)
* **36af8aa**: Last attempt to fix publishing for today (**#14**)

```

## Badge

Let people know that your package is published using `@priestine/semantics` by including the badge in your README:

```markdown
[![versioning: semantics](https://img.shields.io/badge/versioning-semantics-912e5c.svg)](https://gitlab.com/priestine/semantics)
```
