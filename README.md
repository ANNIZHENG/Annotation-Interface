# Annotation Interface (still fixing and adding more functions)

### Set up the virtual environment

#### Please create the database beforehand and change the database path in server/db_tables.py line 11 and 14 to accommodate your environment.

virtualenv env

source env/bin/activate

pip3 install flask

pip3 install sqlalchemy

pip3 install psycopg2-binary

brew services start postgresql (or other ways to start postgresql)
