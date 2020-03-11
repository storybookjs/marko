import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2019_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2019_2.projectFeatures.buildReportTab
import jetbrains.buildServer.configs.kotlin.v2019_2.projectFeatures.githubConnection
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2019_2.triggers.vcs

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2019.2"

project {
    template(Common)
    defaultTemplate = Common

    buildType(TestWorkflow)

    buildType(Build)
    buildType(Chromatic)
    buildType(Packtracker)
    buildType(E2E)
    buildType(SmokeTests)
    buildType(Frontpage)
    buildType(Docs)
    buildType(Lint)
    buildType(Test)
    buildType(Coverage)

    subProject(ExamplesProject)
    subProject(ChromaticProject)

    buildTypesOrderIds = arrayListOf(
            RelativeId("TestWorkflow"),
            RelativeId("Build"),
            RelativeId("Packtracker"),
            RelativeId("Chromatic"),
            RelativeId("E2E"),
            RelativeId("SmokeTests"),
            RelativeId("Frontpage"),
            RelativeId("Docs"),
            RelativeId("Lint"),
            RelativeId("Test"),
            RelativeId("Coverage")
    )


    features {
        githubConnection {
            id = "PROJECT_EXT_6"
            displayName = "GitHub.com"
            clientId = "800d730c725f771d6d2a"
            clientSecret = "credentialsJSON:d1a5af15-1200-46c6-b0f1-f35bd466d909"
        }
        buildReportTab {
            id = "PROJECT_EXT_8"
            title = "Official"
            startPage = "built-storybooks.tar.gz!official-storybook/index.html"
        }
    }
}

object Common: Template({
    name = "Common"

    vcs {
        root(DslContext.settingsRoot)
        checkoutMode = CheckoutMode.ON_AGENT
        checkoutDir = "storybook/%teamcity.build.branch%"
    }

    features {
        commitStatusPublisher {
            id = "BUILD_EXT_1"
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "credentialsJSON:5273320e-14be-4317-951e-a54c4dcca35d"
                }
            }
            param("github_oauth_user", "Hypnosphi")
        }
        swabra {
            id = "swabra"
            verbose = true
            paths = """
                -:node_modules
                -:**/node_modules
            """.trimIndent()
        }
        pullRequests {
            id = "BUILD_EXT_2"
            provider = github {
                authType = vcsRoot()
                filterAuthorRole = PullRequests.GitHubRoleFilter.EVERYBODY
            }
        }
    }
})

object Build : BuildType({
    name = "Build"

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                yarn repo-dirty-check
                yarn bootstrap --core
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    artifactRules = """
        +:**/dist/** => dist.tar.gz
        +:**/dll/** => dist.tar.gz
        -:**/node_modules/** => dist.tar.gz
    """.trimIndent()
})

object Packtracker : BuildType({
    name = "Packtracker"
    description = "Report webpack stats for manager of official storybook"

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "dist.tar.gz!** => ."
            }
        }
    }

    steps {
        script {
            workingDir = "examples/official-storybook"
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                yarn packtracker
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    params {
        param("env.PT_BRANCH", "%teamcity.build.branch%")
    }
})

object ExamplesProject : Project({
    name = "Examples"

    template(ExamplesTemplate)

    buildType(Examples1)
    buildType(Examples2)
    buildType(Examples3)
    buildType(Examples4)
    buildType(Examples5)
    buildType(AggregateExamples)
})

object ExamplesTemplate : Template({
    name = "Examples Template"

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "dist.tar.gz!** => ."
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                rm -rf built-storybooks
                mkdir -p built-storybooks
                
                yarn build-storybooks
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    artifactRules = "built-storybooks => built-storybooks.tar.gz"

    params {
        param("env.CIRCLE_NODE_TOTAL", "5")
    }
})

object Examples1 : BuildType({
    name = "Examples 1"
    templates = listOf(ExamplesTemplate)

    params {
        param("env.CIRCLE_NODE_INDEX", "0")
    }
})

object Examples2 : BuildType({
    name = "Examples 2"
    templates = listOf(ExamplesTemplate)

    params {
        param("env.CIRCLE_NODE_INDEX", "1")
    }
})

object Examples3 : BuildType({
    name = "Examples 3"
    templates = listOf(ExamplesTemplate)

    params {
        param("env.CIRCLE_NODE_INDEX", "2")
    }
})

object Examples4 : BuildType({
    name = "Examples 4"
    templates = listOf(ExamplesTemplate)

    params {
        param("env.CIRCLE_NODE_INDEX", "3")
    }
})

object Examples5 : BuildType({
    name = "Examples 5"
    templates = listOf(ExamplesTemplate)

    params {
        param("env.CIRCLE_NODE_INDEX", "4")
    }
})

object AggregateExamples : BuildType({
    name = "Aggregate Examples"

    dependencies {
        dependency(Examples1) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
        dependency(Examples2) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
        dependency(Examples3) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
        dependency(Examples4) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
        dependency(Examples5) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    artifactRules = "built-storybooks => built-storybooks.tar.gz"
})

object ChromaticProject : Project({
    name = "Chromatic"

    buildType(Chromatic1)
    buildType(Chromatic2)
    buildType(Chromatic3)
    buildType(Chromatic4)
})

object Chromatic1 : BuildType({
    name = "Chromatic 1"

    dependencies {
        dependency(AggregateExamples) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    steps {
        script {
            scriptContent = """
            #!/bin/bash
            set -e -x

            yarn install
            yarn chromatic --storybook-build-dir="built-storybooks/official-storybook" --exit-zero-on-changes --app-code="ab7m45tp9p"
            yarn chromatic --storybook-build-dir="built-storybooks/angular-cli" --app-code="tl92yzsj6w"
            yarn chromatic --storybook-build-dir="built-storybooks/cra-kitchen-sink" --app-code="tg55gajmdt"
            yarn chromatic --storybook-build-dir="built-storybooks/cra-react15" --app-code="gxk7iqej3wt"
            yarn chromatic --storybook-build-dir="built-storybooks/cra-ts-essentials" --app-code="b311ypk6of"
        """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object Chromatic2 : BuildType({
    name = "Chromatic 2"

    dependencies {
        dependency(AggregateExamples) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    steps {
        script {
            scriptContent = """
            #!/bin/bash
            set -e -x

            yarn install
            yarn chromatic --storybook-build-dir="built-storybooks/cra-ts-kitchen-sink" --app-code="19whyj1tlac"
            yarn chromatic --storybook-build-dir="built-storybooks/dev-kits" --app-code="7yykp9ifdxx"
            yarn chromatic --storybook-build-dir="built-storybooks/ember-cli" --app-code="19z23qxndju"
            yarn chromatic --storybook-build-dir="built-storybooks/html-kitchen-sink" --app-code="e8zolxoyg8o"
        """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object Chromatic3 : BuildType({
    name = "Chromatic 3"

    dependencies {
        dependency(AggregateExamples) {
            snapshot {
                onDependencyFailure = FailureAction.IGNORE
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    steps {
        script {
            scriptContent = """
            #!/bin/bash
            set -e -x

            yarn install
            yarn chromatic --storybook-build-dir="built-storybooks/marko-cli" --app-code="qaegx64axu"
            yarn chromatic --storybook-build-dir="built-storybooks/mithril-kitchen-sink" --app-code="8adgm46jzk8"
            yarn chromatic --storybook-build-dir="built-storybooks/preact-kitchen-sink" --app-code="ls0ikhnwqt"
            yarn chromatic --storybook-build-dir="built-storybooks/rax-kitchen-sink" --app-code="4co6vptx8qo"
        """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object Chromatic4 : BuildType({
    name = "Chromatic 4"

    dependencies {
        dependency(AggregateExamples) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    steps {
        script {
            scriptContent = """
            #!/bin/bash
            set -e -x

            yarn install
            yarn chromatic --storybook-build-dir="built-storybooks/riot-kitchen-sink" --app-code="g2dp3lnr34a"
            yarn chromatic --storybook-build-dir="built-storybooks/svelte-kitchen-sink" --app-code="8ob73wgl995"
            yarn chromatic --storybook-build-dir="built-storybooks/vue-kitchen-sink" --app-code="cyxj0e38bqj"
            yarn chromatic --storybook-build-dir="built-storybooks/web-components-kitchen-sink" --app-code="npm5gsofwkf"
        """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object Chromatic : BuildType({
    name = "Chromatic"
    type = Type.COMPOSITE

    dependencies {
        snapshot(Chromatic1) {}
        snapshot(Chromatic2) {}
        snapshot(Chromatic3) {}
        snapshot(Chromatic4) {}
    }
})

object E2E : BuildType({
    name = "E2E"

    dependencies {
        dependency(AggregateExamples) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "built-storybooks.tar.gz!** => built-storybooks"
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x

                yarn install
                yarn cypress install
                yarn serve-storybooks &
                yarn await-serve-storybooks
                yarn cypress run --reporter teamcity || :
                yarn ts-node --transpile-only cypress/report-teamcity-metadata.ts || :
            """.trimIndent()
            dockerImage = "cypress/base:10.18.1"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    artifactRules = """
        cypress/screenshots => screenshots.tar.gz
        cypress/videos => videos.tar.gz
    """.trimIndent()

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.TEST_COUNT
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
            comparison = BuildFailureOnMetric.MetricComparison.LESS
            compareTo = value()
        }
    }
})

object SmokeTests : BuildType({
    name = "Smoke Tests"

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "dist.tar.gz!** => ."
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x

                yarn install

                cd examples/cra-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../cra-ts-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../vue-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../svelte-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../angular-cli
                yarn storybook --smoke-test --quiet
          
                cd ../ember-cli
                yarn storybook --smoke-test --quiet
          
                cd ../marko-cli
                yarn storybook --smoke-test --quiet
          
                cd ../official-storybook
                yarn storybook --smoke-test --quiet
          
                cd ../mithril-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../riot-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../preact-kitchen-sink
                yarn storybook --smoke-test --quiet
          
                cd ../cra-react15
                yarn storybook --smoke-test --quiet
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object Frontpage : BuildType({
    name = "Frontpage"
    type = Type.DEPLOYMENT

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn bootstrap --install
                node ./scripts/build-frontpage.js
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:.teamcity/**"
            branchFilter = "+:master"
        }
    }
})

object Docs : BuildType({
    name = "Docs"
    type = Type.DEPLOYMENT

    steps {
        script {
            workingDir = "docs"
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                yarn build
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:.teamcity/**"
            branchFilter = """
                +:<default>
                +:next
                +:master
                +:pull/*
            """.trimIndent()
        }
    }
})

object Lint : BuildType({
    name = "Lint"

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "dist.tar.gz!** => ."
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                
                # TODO remove after merging
                mkdir temp-eslint-teamcity
                cd temp-eslint-teamcity
                yarn init -y
                yarn add -D eslint-teamcity
                cd ..
                
                yarn lint:js --format ./temp-eslint-teamcity/node_modules/eslint-teamcity/index.js .
                yarn lint:md .
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.INSPECTION_ERROR_COUNT
            threshold = 0
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
            comparison = BuildFailureOnMetric.MetricComparison.MORE
            compareTo = value()
        }
    }
})

object Test : BuildType({
    name = "Test"

    dependencies {
        dependency(Build) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "dist.tar.gz!** => ."
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                
                # TODO remove after merging
                mkdir temp-jest-teamcity
                cd temp-jest-teamcity
                yarn init -y
                yarn add -D jest-teamcity
                cd ..
                
                yarn jest --coverage -w 2 --reporters=${'$'}PWD/temp-jest-teamcity/node_modules/jest-teamcity
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }

    artifactRules = "coverage => coverage.tar.gz"
})

object Coverage : BuildType({
    name = "Coverage"

    dependencies {
        dependency(Test) {
            snapshot {
                onDependencyFailure = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "coverage.tar.gz!** => coverage"
            }
        }
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                yarn coverage
            """.trimIndent()
            dockerImage = "node:10"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})

object TestWorkflow : BuildType({
    name = "Test Workflow"
    type = Type.COMPOSITE
    maxRunningBuilds = 2

    dependencies {
        snapshot(Chromatic) {}
        snapshot(Packtracker) {}
        snapshot(E2E) {}
        snapshot(SmokeTests) {}
        snapshot(Lint) {}
        snapshot(Coverage) {}
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:.teamcity/**"
            branchFilter = """
                +:<default>
                +:next
                +:master
                +:pull/*
            """.trimIndent()
        }
    }
})
