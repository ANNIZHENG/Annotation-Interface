# Annotation Interface

Please create a postgresql database beforehand and change the path in server/db_tables.py line 7 to the current database path

Headphone Check program link: https://github.com/mcdermottLab/HeadphoneCheck

You may run the program in your local environment with the following terminal commands (Mac):

```
virtualenv env

source env/bin/activate

pip3 install flask

pip3 install sqlalchemy

pip3 install psycopg2-binary

python3 server/main.py
```
or if you are using conda:

```
conda config --append channels conda-forge

conda create --name <env_name_here> --file requirements.txt

conda activate <env_name_here>

python3 server/main.py
```
