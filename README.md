# Annotation Interface

### Set up the virtual environment

#### Please create a database beforehand and change the database path in server/db_tables.py line 8 to accommodate your environment.

headphone check code link: https://github.com/mcdermottLab/HeadphoneCheck

1. Please create the Recording database before hand
```
psql postgres

\c <database_name_here>

CREATE TABLE "Recording" (
	id serial PRIMARY KEY,
	file_name VARCHAR,
	number INTEGER
);

INSERT INTO "Recording" (file_name, number)
VALUES ('0.wav',0),('1.wav',0),('2.wav',0),('3.wav',0),
('4.wav',0),('5.wav',0),('6.wav',0),('7.wav',0),('8.wav',0),('9.wav',0),
('10.wav',0),('11.wav',0),('12.wav',0),('13.wav',0),('14.wav',0);
```

2. Please start postgresql and set up the virtual environment:

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