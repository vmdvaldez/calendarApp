CREATE DATABASE calendar_app;

\c calendar_app

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS activity (
    uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    date_created DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS category (
    uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    date_created DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_category (
    activity_id uuid REFERENCES activity(uid),
    category_id uuid REFERENCES category(uid),
    PRIMARY KEY(activity_id, category_id)
);


CREATE TABLE IF NOT EXISTS event(
    uid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id uuid REFERENCES activity(uid),
    title VARCHAR(50) NOT NULL,
    calendar_date DATE NOT NULL,
    time_start TIME,
    time_end TIME,
    date_created DATE NOT NULL DEFAULT NOW()

);