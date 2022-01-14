# Annotation Interface

### Please create a postgresql database beforehand and change the path in server/db_tables.py line 8 (the current database used is from Postgres Heroku)

#### You may see the demonstration here: NOT-AVAILABLE-NOW

#### Headphone Check program link: https://github.com/mcdermottLab/HeadphoneCheck

1. Please create the Recording database before hand
```
CREATE TABLE "Recording" (
	id serial PRIMARY KEY,
	file_name VARCHAR,
	num_annotation INTEGER
);

INSERT INTO "Recording" (file_name, num_annotation)
VALUES ('0.wav',0),('1.wav',0),('2.wav',0),('3.wav',0),
('4.wav',0),('5.wav',0),('6.wav',0),('7.wav',0),('8.wav',0),('9.wav',0),
('10.wav',0),('11.wav',0),('12.wav',0),('13.wav',0),('14.wav',0);
```

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

<img src="/templates/interface/img/4.png" />