
## baseULR
### https://conduit.bondaracademy.com/login
## github application for UI Practice 
### https://github.com/bondar-artem/pw-practice-app
## VS Code for installaion 
### https://code.visualstudio.com/
### https://nodejs.org/en
### https://www.docker.com/
### https://www.npmjs.com/package/@faker-js/faker
## git commands 
### https://www.bondaracademy.com/blog/most-poular-git-commands-for-testers


#  Runs the end-to-end tests.

####  npx playwright test --ui                Starts the interactive UI mode.
####  npx playwright test --project=chromium  Runs the tests only on Desktop Chrome.
####  npx playwright test example             Runs the tests in a specific file.
####  npx playwright test --debug             Runs the tests in debug mode.
####  npx playwright codegen                  Auto generate tests with Codegen.
####  npx playwright test                     We suggest that you begin by typing:

# CLI Commands to excute tests.
### npx playwright test --project=chromium --headed 
### npx playwright test example.spec --project=chromium --headed
### npx playwright test -g 'has title'  --project=chromium --headed
### npx playwright test --ui  

### npx playwright test --project=chromium --trace on  
### npx playwright test --project=chromium --debug

# to configure allure report 
#### Open PowerShell (as normal user) and run:
#### verify alllure 
##### allure --version
## if scoop not installed:
## Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
## Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

## then install allure
scoop install allure

## npm i -D allure-playwright @playwright/test --force 
### --force means ignore warning and dependency 
### - D means --save-dev (save as a devDependency)

## make sure in playwright.config.ts file mention 
###   reporter:[ ['allure-playwright']  ]
### after execution allure-report folder is created then run below command to genrate report in html 
## allure generate .\allure-results --clean -o allure-report