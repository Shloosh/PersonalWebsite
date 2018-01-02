#!/usr/bin/env bash

serverUser="ubuntu"
serverHost="138.68.241.190"
serverPEM="/home/shloosh/Desktop/Programming/Server Connection Files/DigitalOcean.pem"
localDir="/home/shloosh/Desktop/PersonalWebsite"
serverDir="/var/www/brianschmoker.com"

echo "Stopping app.js in pm2"
ssh -i "$serverPEM" $serverUser@$serverHost "pm2 stop app"
echo "Removing website files on remote server"
ssh -i "$serverPEM" $serverUser@$serverHost "rm -rf $serverDir/*"
echo "Backing up website"
tar czf /tmp/website_backup.tar.gz --directory="$localDir" --exclude=".git" --exclude="Push_to_Production.sh" .
echo "Sending compressed website files"
scp -ri "$serverPEM" /tmp/website_backup.tar.gz $serverUser@$serverHost:$serverDir/
echo "Uncompressing files"
ssh -i "$serverPEM" $serverUser@$serverHost "tar -xzf $serverDir/website_backup.tar.gz -C $serverDir"
echo "Removing compressed backup from remote server"
ssh -i "$serverPEM" $serverUser@$serverHost "rm $serverDir/website_backup.tar.gz"
echo "Adding execute permissions to app.js"
ssh -i "$serverPEM" $serverUser@$serverHost "chmod u+x $serverDir/app.js"
echo "Starting app.js with pm2"
ssh -i "$serverPEM" $serverUser@$serverHost "pm2 start $serverDir/app.js"
