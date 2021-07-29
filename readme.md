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

# Set up your local environment.

## Command Line Installs

Run the following commands:

```
npm install
```

Install node version manager

```
npm i nvm
```

```
nvm install 10.24.1
```

```
nvm use 10.24.1
```

```
npm i sequelize
```

```
npm i mysql2
```

## Claudia.js

Follow this tutorial to set up Claudia:
https://claudiajs.com/tutorials/installing.html

Please run the commands for installing Claudia.js and installing as a project dependency.

Install AWS CLI

Open a new terminal to install it in the root of your local machine.

```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

Once is finished, the terminal will show a command `sudo ./aws/install` press enter and introduce your password.

Check if AWS was installed correctly, run the following command:

```
aws --version
```

Keeping on the root

```
aws configure
```

Then insert the access keys.

- aws_access_key_id =
- aws_secret_access_key =
- Default region name [None]: `eu-west-2`
- Default output format [None]: `JSON`

Ignore the profile section - the above will create a default profile which will be used automatically.
