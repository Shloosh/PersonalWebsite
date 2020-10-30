#!/usr/bin/env bash

localDir="/home/shloosh/Desktop/PersonalWebsite"
localBackup="/tmp/website_backup.tar.gz"
serverUser="ubuntu"
serverHost="138.68.241.190"
serverPEM="/home/shloosh/Desktop/Programming/Server Connection Files/DigitalOcean.pem"
serverDir="/var/www/brianschmoker.com"
# For whatever reason, some profile info isn't loading for remote ssh and pm2 is not in the path variable
pm2="/home/ubuntu/.nvm/versions/node/v8.9.3/bin/pm2"

echo "Stopping app.js in pm2"
ssh -i "$serverPEM" $serverUser@$serverHost "$pm2 stop brianschmoker.com"
echo "Removing website files on remote server"
ssh -i "$serverPEM" $serverUser@$serverHost "rm -rf $serverDir/*"
echo "Backing up website"
tar czf "$localBackup" --directory="$localDir" --exclude=".git" --exclude="Push_to_Production.sh" --exclude="Windows_Push_to_Production.ps1" .
echo "Sending compressed website files"
scp -ri "$serverPEM" "$localBackup" $serverUser@$serverHost:$serverDir/
echo "Uncompressing files"
ssh -i "$serverPEM" $serverUser@$serverHost "tar -xzf $serverDir/website_backup.tar.gz -C $serverDir"
echo "Removing compressed backup from remote server"
ssh -i "$serverPEM" $serverUser@$serverHost "rm $serverDir/website_backup.tar.gz"
echo "Adding execute permissions to app.js"
ssh -i "$serverPEM" $serverUser@$serverHost "chmod u+x $serverDir/app.js"
echo "Starting app.js with pm2"
ssh -i "$serverPEM" $serverUser@$serverHost "$pm2 start $serverDir/app.js --cwd='$serverDir/' --name='brianschmoker.com'" 