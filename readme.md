# Team Titan Back-end

## AWS

You should be able to log into AWS using the IAM user option on https://aws.amazon.com/

## MySQL Workbench

Install workbench from here:
https://dev.mysql.com/downloads/workbench/
On workbench, go Database > Connect to Database
Insert team-titan.cjsrixc7budk.eu-west-2.rds.amazonaws.com into the Hostname Box
Username and password are in slack.
You should see two Schemas on the left, sys and titan

## Command Line Installs

Run the following commands:

npm install
npm i nvm (to install node version manager)
nvm install 10.24.1
nvm use 10.24.1
npm i sequelize
npm i mysql2

## Claudia.js

Follow this tutorial to set up Claudia:
https://claudiajs.com/tutorials/installing.html

When you reach "Configuring access credentials", enter into the command line "aws configure"
Then insert the access keys (posted in the slack channel)

- aws_access_key_id =
- aws_secret_access_key =

Ignore the profile section - the above will create a default profile which will be used automatically.
