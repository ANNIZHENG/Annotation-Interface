# Annotation Interface

### Set up the virtual environment (debugging)

#### Please create a database beforehand and change the database path in server/db_tables.py line 11 and 14 to accommodate your environment.

headphone check code link: https://github.com/mcdermottLab/HeadphoneCheck

Please type these command lines to set up the virtual environment.
```
virtualenv env

source env/bin/activate

pip3 install flask

pip3 install sqlalchemy

pip3 install psycopg2-binary
```
and start postgresql, then type

```
python3 server/main.py
```

<img src="/templates/question/img/display2.png" width="600" height=auto />