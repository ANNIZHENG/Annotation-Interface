CREATE TABLE "Recording" (
	id serial PRIMARY KEY,
	recording_name VARCHAR,
	num_annotation INTEGER,
	num_source INTEGER,
	vertical BOOLEAN
);

CREATE TABLE "Source" (
	id serial PRIMARY KEY,
	file_name VARCHAR,
	coarse_class VARCHAR,
	specific_class VARCHAR,
	bandwidth_continuity VARCHAR
);

CREATE TABLE "Recording_Joint_Source" (
	recording_id INTEGER,
	source_id INTEGER,
	azimuth INTEGER,
	vertical_elevation INTEGER,
	horizontal_elevation INTEGER
);

COPY "Recording"(recording_name, num_annotation, num_source, vertical)
FROM '/Users/anniezheng/Desktop/Annotation-Interface/database/recording.csv'
DELIMITER ','
CSV HEADER;

COPY "Source"(file_name, coarse_class, specific_class, bandwidth_continuity)
FROM '/Users/anniezheng/Desktop/Annotation-Interface/database/source.csv'
DELIMITER ','
CSV HEADER;

COPY "Recording_Joint_Source"(recording_id, source_id, azimuth, vertical_elevation, horizontal_elevation)
FROM '/Users/anniezheng/Desktop/Annotation-Interface/database/recording_joint_source.csv'
DELIMITER ','
CSV HEADER;
