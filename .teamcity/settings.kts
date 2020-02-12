import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.v2019_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2019_2.projectFeatures.githubConnection

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
    buildType(Build)

    features {
        githubConnection {
            id = "PROJECT_EXT_6"
            displayName = "GitHub.com"
            clientId = "800d730c725f771d6d2a"
            clientSecret = "credentialsJSON:d1a5af15-1200-46c6-b0f1-f35bd466d909"
        }
    }
}

object Build : BuildType({
    name = "Build"

    artifactRules = """
        **/node_modules/** => workspace.tar.gz
        **/dist/** => workspace.tar.gz
    """.trimIndent()

    vcs {
        root(DslContext.settingsRoot)
    }

    steps {
        script {
            scriptContent = """
                #!/bin/bash
                set -e -x
                
                yarn install
                yarn repo-dirty-check
                yarn bootstrap --core
            """.trimIndent()
            dockerImage = "node:lts"
            dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
        }
    }
})
