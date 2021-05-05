#!/bin/bash

SERVER_ADDRESS=$1
echo $SERVER_ADDRESS

if [[ -z "${SERVER_ADDRESS}" ]]; then
	echo ""
	echo "Server address not specified, using default: localhost:80"
	echo "You can pass the server address as an argument to docker run"
	echo ""
	SERVER_ADDRESS="localhost:80"
fi

echo "const server = \""$SERVER_ADDRESS"\";" > tmp.js
cat /usr/share/nginx/html/index.js >> tmp.js
cat tmp.js > /usr/share/nginx/html/index.js
rm tmp.js

cd backend && uwsgi --ini /backend/uwsgi.ini &
cd /
#uwsgi --ini /backend/uwsgi.ini
while [ ! -e /backend/backend.sock ]; do sleep 0.5; done
chmod 666 /backend/backend.sock
#/docker-entrypoint.sh nginx
nginx -g "daemon off;"