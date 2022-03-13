# Annotation Interface

### To view code, please refer to this repository: https://github.com/ANNIZHENG/Temp-Annotation-Interface

#### Please create a postgresql database beforehand and change the path in server/db_tables.py line 7 (the current database used is from Postgres Heroku)

#### You may check the database directory for postgresql commands for creating Recording, Recording_Joint_Source, Source tables before starting the program

#### database/db.ipynb is a jupyter notebook file for you to analyze the data from the default database

#### Headphone Check program link: https://github.com/mcdermottLab/HeadphoneCheck

1. Please create the Recording database before hand using database/database.sql

2. Optional: Please start postgresql and set up the virtual environment

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
