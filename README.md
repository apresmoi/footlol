# DEV Notes

##### Folders
* ./api: Main Django API, controls the querying of features, etc
* ./client: UI
* ./mysql: DB

### How to run

1. Execute docker-compose up and let the containers build. The first time will take some time since the database is huge.

* ui: http://localhost:8000/
* api: http://localhost:8080/
* mysql: http://localhost:3306/

#### Commands to export the database from inside the container:

docker exec -it game-mysql /bin/sh -c "mysqldump --max_allowed_packet=32505856 -u root --password=api1234 game > game.sql" && docker cp game-mysql:./game.sql ./mysql/game.sql
