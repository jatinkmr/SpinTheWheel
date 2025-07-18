const express = require('express');
const app = express();
const port = 3001;

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files and parse JSON
app.use(express.static('public'));
app.use(express.json());

// Route for home page
app.get('/', (req, res) => {
    res.render('index');
});

// without weightages all has same possibilities i.e., 1/6
// // Route for spin result
// app.post('/spin', (req, res) => {
//     if (!req.body || typeof req.body.angle !== 'number') {
//         return res.status(400).json({ error: 'Invalid or missing angle in request body' });
//     }

//     const prizes = ['Free Spin', '10 Points', '50 Points', '100 Points', 'Try Again', '500 Points'];
//     const finalAngle = req.body.angle; // Angle in radians
//     const arc = 360 / prizes.length; // Each segment is 60 degrees
//     // Convert angle to degrees and normalize to 0-360
//     let normalizedAngle = ((finalAngle * 180 / Math.PI) % 360 + 360) % 360;
//     // Calculate original angle relative to pointer at 270 degrees
//     let original_angle = (270 - normalizedAngle + 360) % 360;
//     let index = Math.floor(original_angle / arc);
//     console.log(`Angle: ${finalAngle.toFixed(2)} radians, Normalized: ${normalizedAngle.toFixed(2)}°, Original Angle: ${original_angle.toFixed(2)}°, Index: ${index}, Prize: ${prizes[index]}`);
//     res.json({ prize: prizes[index] });
// });

// Prizes and their weightages
const prizes = ['Free Spin', '10 Points', '50 Points', '100 Points', 'Try Again', '500 Points'];
const weightages = [20, 15, 60, 80, 10, 100]; // Higher weightage means lower probability

// Compute inverse weights
const inv_w = weightages.map(w => 1 / w);
const sum_inv_w = inv_w.reduce((a, b) => a + b, 0);
const probabilities = inv_w.map(iw => iw / sum_inv_w);

// Route for spin result
app.post('/spin', (req, res) => {
    // Select prize based on weightages
    const cumulative = [0];
    for (let i = 0; i < probabilities.length; i++) {
        cumulative.push(cumulative[i] + probabilities[i]);
    }
    const r = Math.random();
    let selectedIndex = -1;
    for (let i = 1; i < cumulative.length; i++) {
        if (r < cumulative[i]) {
            selectedIndex = i - 1;
            break;
        }
    }
    const prize = prizes[selectedIndex];
    console.log(`Selected prize: ${prize}, index: ${selectedIndex}, probability: ${(probabilities[selectedIndex] * 100).toFixed(2)}%`);
    res.json({ prize: prize, index: selectedIndex });
});

app.listen(port, () => {
    console.log(`Spin the wheel app listening at http://localhost:${port}`);
});
