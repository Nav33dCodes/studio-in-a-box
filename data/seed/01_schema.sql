CREATE DATABASE IF NOT EXISTS studio_in_a_box;

USE studio_in_a_box;

CREATE TABLE IF NOT EXISTS movies (
    movie_id UUID,
    title String,
    genre String,
    release_year UInt16,
    production_budget Float64,
    box_office Float64,
    marketing_budget Float64,
    runtime_minutes UInt16,
    scene_count UInt16,
    location_count UInt16,
    cast_size UInt16,
    vfx_intensity String,
    opening_weekend Float64,
    international_box_office Float64
) ENGINE = MergeTree()
ORDER BY (genre, release_year);

CREATE TABLE IF NOT EXISTS scenes (
    scene_id UUID,
    movie_id UUID,
    scene_number UInt16,
    location_type String,
    indoor_outdoor String,
    time_of_day String,
    character_count UInt16,
    prop_count UInt16,
    vfx_intensity String,
    special_equipment UInt16,
    estimated_scene_cost Float64,
    production_complexity String
) ENGINE = MergeTree()
ORDER BY (movie_id, scene_number);
