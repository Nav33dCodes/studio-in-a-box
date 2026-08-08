const fs = require('fs');
const crypto = require('crypto');

const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance', 'Thriller', 'Fantasy'];
const vfxIntensities = ['Low', 'Medium', 'High'];
const locations = ['Warehouse', 'City Street', 'Apartment', 'Forest', 'Office', 'Studio', 'Desert', 'Space Station'];
const complexities = ['Low', 'Medium', 'High', 'Extreme'];

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

let sql = 'USE studio_in_a_box;\n\n';
sql += 'INSERT INTO movies (movie_id, title, genre, release_year, production_budget, box_office, marketing_budget, runtime_minutes, scene_count, location_count, cast_size, vfx_intensity, opening_weekend, international_box_office) VALUES\n';

const NUM_MOVIES = 150;
const movies = [];

for (let i = 0; i < NUM_MOVIES; i++) {
    const movieId = crypto.randomUUID();
    const genre = randomChoice(genres);
    const vfx = (genre === 'Sci-Fi' || genre === 'Action' || genre === 'Fantasy') ? randomChoice(['Medium', 'High']) : randomChoice(['Low', 'Medium']);
    const budget = randomFloat(10_000_000, 200_000_000);
    const boxOfficeMultiplier = randomFloat(0.5, 4.0);
    const boxOffice = budget * boxOfficeMultiplier;
    const sceneCount = randomInt(40, 120);

    movies.push({ movieId, sceneCount, vfx });

    sql += `('${movieId}', 'Synthetic Movie ${i + 1}', '${genre}', ${randomInt(2010, 2025)}, ${budget.toFixed(2)}, ${boxOffice.toFixed(2)}, ${(budget * 0.5).toFixed(2)}, ${randomInt(90, 180)}, ${sceneCount}, ${randomInt(5, 30)}, ${randomInt(10, 100)}, '${vfx}', ${(boxOffice * 0.3).toFixed(2)}, ${(boxOffice * 0.4).toFixed(2)})`;
    sql += (i === NUM_MOVIES - 1) ? ';\n\n' : ',\n';
}

sql += 'INSERT INTO scenes (scene_id, movie_id, scene_number, location_type, indoor_outdoor, time_of_day, character_count, prop_count, vfx_intensity, special_equipment, estimated_scene_cost, production_complexity) VALUES\n';

let firstScene = true;
movies.forEach((movie, mIndex) => {
    const avgSceneCost = randomFloat(50_000, 500_000);
    
    for (let s = 1; s <= movie.sceneCount; s++) {
        if (!firstScene) sql += ',\n';
        firstScene = false;

        const sceneId = crypto.randomUUID();
        const locType = randomChoice(locations);
        const inOut = randomChoice(['Indoor', 'Outdoor']);
        const tod = randomChoice(['Day', 'Night', 'Dawn', 'Dusk']);
        const vfx = Math.random() > 0.7 ? movie.vfx : 'Low';
        const cost = avgSceneCost * randomFloat(0.5, 2.0);

        sql += `('${sceneId}', '${movie.movieId}', ${s}, '${locType}', '${inOut}', '${tod}', ${randomInt(1, 20)}, ${randomInt(0, 50)}, '${vfx}', ${randomInt(0, 5)}, ${cost.toFixed(2)}, '${randomChoice(complexities)}')`;
    }
});
sql += ';\n';

fs.writeFileSync('02_seed.sql', sql);
console.log('Seed SQL generated at 02_seed.sql. Contains 150 movies and their associated scenes.');
