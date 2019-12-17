# ADMTC ACAD

**NOTE: Only use Node Version 7.10.0, any other version wont work properly and will throw wierd errors which wont allow you to run the application at all.**

## Running the Application on your local development machine

* run `npm install` to download the node_modules
* open the environment.ts file and set the `apiUrl` to point to the backend API link.
* run `npm start` to start the application
* TIP: to run the application faster use the command `ng serve --aot=false`

## Developer's TODO

* before commiting your changes always check if there are any errors in the view files. you can do this by running the command `node --max_old_space_size=8048 ./node_modules/@angular/cli/bin/ng build --prod --base-href /admtc-acad/ --aot=false`
* when you are making changes in the src/assets/i18n/\*.json files make the changes locally and send the files to the Project Manager (Ivo Costa). Do not commit this file directly
* Never commit the files under environments folder

## Coding Guidelines

* If you notice that the file you are going to work on is not properly formatted then do the following steps
* 1. Format the file and commit the changes
* 2. Now make your changes and commit the code changes.

**DO NOT COMMIT BOTH THE FORMATTING AND CODE CHANGES IN ONE COMMIT**

## Backend API

* [Postman collection to the latest API](https://www.getpostman.com/collections/ece694e8b711982cd492)
* [Video showing how to import postman collection](https://www.useloom.com/share/3a6d4b9c267f431fb8098bf84e5f1862)

## Branching Guidelines

* master -- This branch will contain code that will be hosted on the production server
* develop -- This branch will contain code that will be hosted on the staging server
* feature/sprint_YY_MMM -- This branch will contain the code that team will be using for the current month of the sprint.
  YY --YEAR
  MM --Month code in three letters smallcase
  example: sprint_17_dec ==> for the month of december 2017
* feature/dev_FirstName_SecondName -- this is a branch each developer will create to commit his code. All his code changes will be residing in this branch.
  The developer has to take the latest code changes from the develop branch and merge into his branch before he starts work on any task.
  Also once the task is completed, again take a pull from develop and merge changes from develop into his branch. Once this is done create a pull request and send to the supervisor.

Example: Developer : Zohaib Mulla
feature/dev_zohaib_mulla


**Current Development Branch:** **feature/current_sprint**

## Ignore Environment Files

The Environment file points to the Staging Server path. Many times a developer would like to change this path to point to a local instance of the backend API. If you want git to ignore your changes to this file, please follow the below instructions

Run the commands to add the environment files so that git does not show them as modified, whenever developer makes any changes. 

* git update-index --assume-unchanged  src\environments\environment.ts
* git update-index --assume-unchanged  src\environments\environment.prod.ts

**Developers are not allowed to commit changes in the environment.ts and environment.prod.ts files. Unless explicity told to do so.**

