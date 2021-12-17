# Annotation Interface

### Set up the virtual environment (debugging)

#### Please create a database beforehand and change the database path in server/db_tables.py line 11 and 14 to accommodate your environment.

headphone check code link: https://github.com/mcdermottLab/HeadphoneCheck

Please start postgresql and type these command lines to set up the virtual environment

```
virtualenv env

source env/bin/activate

pip3 install flask

pip3 install sqlalchemy

pip3 install psycopg2-binary

python3 server/main.py
```
If you are using conda:

```
conda config --append channels conda-forge

conda create --name <env_name_here> --file requirements.txt

conda activate <env_name_here>

python3 server/main.py
```

<img src="/templates/question/img/display.png" width="600" height=auto />