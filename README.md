# Annotation Interface

### Set up the virtual environment

#### Please create a database beforehand and change the database path in server/db_tables.py line 11 and 14 to accommodate your environment.

headphone check code link: https://github.com/mcdermottLab/HeadphoneCheck

Please create the Recording database before hand!

Please start postgresql and set up the virtual environment:

```
virtualenv env

source env/bin/activate

pip3 install flask

pip3 install sqlalchemy

pip3 install psycopg2-binary

python3 server/main.py
```
if you are using conda:

```
conda config --append channels conda-forge

conda create --name <env_name_here> --file requirements.txt

conda activate <env_name_here>

python3 server/main.py
```

<img src="/templates/interface/img/display.png" width="700" height=auto />