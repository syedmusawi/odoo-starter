# OdooStarter
A starter project on developing Odoo modules

1. Run `docker-compose up --build --detach`
2. Setup the database master credentials (you will probably do it once). This example assumes you create a database named `acpec`
3. Login as administrator (to have the privilege to update module) and install `discuss (any other may work)` module to enable the `General Settings` tab
4. In the `Developer Tools` section click `Activate the developer mode` 
5. Navigate to `Apps` section and click on `Update Apps List` and type the module name in the search bar after cancelling the `Apps` filter.
   Your custom module should appear. 
6. Clone the version of odoo you want to create modules for and add it to source directory 
   `git clone https://github.com/odoo/odoo.git --depth 1 --branch <your-odoo-version> --single-branch odoo`
7. You can optionally initialize `Pipenv environment` in Pycharm. Refer to this [link](https://www.jetbrains.com/help/pycharm/pipenv.html)
8. You can create and execute a `run.sh` file for updating the module. The file should contain :
````
#!/bin/sh

docker restart <odoo-web-container-name>
docker exec -it <odoo-web-container-name> odoo -u <module-to-update> -d acpec -r odoo -w odoo --db_host=<your-db-host-ip> --db_port=5432
````
9. If you want to update odoo version repeat step 6 and run `docker pull web` to pull the latest odoo image. 
10. If you upgrade postgres you might have to delete the volume as well `docker volume rm acpec-odoo_odoo-db-data`.

