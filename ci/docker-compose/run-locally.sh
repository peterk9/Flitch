echo 'shutting down docker'
docker-compose down

cd ../../

echo 'building user-service'
cd ./services/user-service/api
sh package-docker.sh

cd ../../../

echo 'building userdb'
cd ./services/user-service/database/mongodb
sh package-docker.sh

cd ../../../

echo 'building video-streamer'
cd ./video-streamer
sh package-docker.sh

cd ../../ci/docker-compose

echo 'starting service'
docker-compose up -d

echo 'system logs'
docker-compose logs -f 