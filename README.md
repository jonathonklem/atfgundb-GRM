# ATFGunDB

## Scripts
1. `npm run build` inside root will automatically run make and `npm build` inside frontend
2. `npm run deploy` inside root will automatically run the 2 sls scripts to deploy to lambda and s3

## Things Breaking
1. If lambda randomly starts sending 502, check to make sure that mongo db is open to access

## Frontend 
1. Make sure to run `npm install` to install all of the packages.  When you encounter an error first try `rm -rf node_modles && npm install` to refresh all packages
2. To build tailwinds css `npm run build:css`
3. To start web app `npm run start`

## Backend
1. Make sure .env is populated in the root directory with the proper mongodb connection string
2. Run `go run localdev.go` to start local web server

## Environment Variables
1. local dev go reads `ALLOWED_ORIGIN` prod does as well but that's managed in aws (`aws ssm put-parameter --name "/ATFGUNDBMiddleware/config/allowed_origin" --type "String" --value "https://dw7nq8qexc11l.cloudfront.net" --overwrite`)
2. local dev go reads `MONGO_URL` prod does same as #1

## Installation Prerequisites
1. Need to have aws cli
    `curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"`
    `sudo installer -pkg AWSCLIV2.pkg -target /`
2. Need to have serverless
    `npm install -g serverless`
3. Need serverless finch
    `npm install --save serverless-finch`

## Installation steps
1. Run `make` to build the aws go file
2. `sls deploy` uploads go file to lambda
3. Run `npm run build` inside of frontend 
4. `sls client deploy` to push to bucket

## Serverless additional information
1. May need to run `aws configure` and add the keys
2. Initially had to set the proper parameter name with `aws ssm put-parameter --name "/ATFGUNDBMiddleware/config/allowed_origin" --type "String" --value "X.X.X.X"`
3. Serverless was being finicky so had to add aws creds this way `serverless config credentials --provider aws --key XXXXXXXX --secret "YYYYYYYYYY"`

Guide followed from: https://www.kantega.no/blogg/running-go-and-react-on-aws-using-lambda