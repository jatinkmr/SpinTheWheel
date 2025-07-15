// const canvas = document.getElementById('wheel');
// const ctx = canvas.getContext('2d');
// const spinBtn = document.getElementById('spinBtn');
// const resultDiv = document.getElementById('result');

// const prizes = ['Free Spin', '10 Points', '50 Points', '100 Points', 'Try Again', '500 Points'];
// const colors = ['#FFEEAD', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#D4A5A5'];
// let startAngle = 0;
// let isSpinning = false;

// function drawWheel() {
//     const arc = Math.PI / (prizes.length / 2);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     for (let i = 0; i < prizes.length; i++) {
//         const angle = startAngle + i * arc;
//         ctx.fillStyle = colors[i];
//         ctx.beginPath();
//         ctx.arc(200, 200, 180, angle, angle + arc);
//         ctx.lineTo(200, 200);
//         ctx.fill();

//         ctx.save();
//         ctx.fillStyle = '#fff';
//         ctx.font = '16px Arial';
//         ctx.translate(
//             200 + Math.cos(angle + arc / 2) * 140,
//             200 + Math.sin(angle + arc / 2) * 140
//         );
//         ctx.rotate(angle + arc / 2 + Math.PI / 2);
//         ctx.fillText(prizes[i], -ctx.measureText(prizes[i]).width / 2, 0);
//         ctx.restore();
//     }

//     // Draw arrow
//     ctx.fillStyle = '#333';
//     ctx.beginPath();
//     ctx.moveTo(200, 20);
//     ctx.lineTo(180, 60);
//     ctx.lineTo(220, 60);
//     ctx.closePath();
//     ctx.fill();

//     // Debug: Calculate visual prize under pointer
//     const normalizedAngle = (startAngle * 180 / Math.PI) % 360;
//     const original_angle = (270 - normalizedAngle + 360) % 360;
//     const index = Math.floor(original_angle / 60);
//     console.log(`Visual: normalizedAngle=${normalizedAngle.toFixed(2)}, original_angle=${original_angle.toFixed(2)}, index=${index}, prize=${prizes[index]}`);
// }

// function spinWheel() {
//     if (isSpinning) return;
//     isSpinning = true;
//     spinBtn.disabled = true;

//     const spinTime = Math.random() * 3000 + 2000; // 2-5 seconds
//     const spinAngle = Math.random() * 360 + 720; // At least two full rotations
//     let currentTime = 0;

//     function animate() {
//         currentTime += 16; // Approx 60fps
//         const progress = currentTime / spinTime;
//         const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
//         startAngle = (spinAngle * easeOut) * Math.PI / 180;

//         drawWheel();

//         if (currentTime < spinTime) {
//             requestAnimationFrame(animate);
//         } else {
//             isSpinning = false;
//             spinBtn.disabled = false;
//             fetchPrize(startAngle);
//         }
//     }

//     requestAnimationFrame(animate);
// }

// function fetchPrize(finalAngle) {
//     fetch('/spin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ angle: finalAngle })
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.error) {
//                 resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
//             } else {
//                 resultDiv.innerHTML = `<p>You won: ${data.prize}</p>`;
//             }
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//             resultDiv.innerHTML = '<p>Error getting prize</p>';
//         });
// }

// drawWheel();
// spinBtn.addEventListener('click', spinWheel);


const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

const prizes = ['Free Spin', '10 Points', '50 Points', '100 Points', 'Try Again', '500 Points'];
const colors = ['#FFEEAD', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#D4A5A5'];
let startAngle = 0;
let isSpinning = false;

function drawWheel() {
    const arc = Math.PI / 3; // 60 degrees in radians
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < prizes.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(200, 200, 180, angle, angle + arc);
        ctx.lineTo(200, 200);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.translate(
            200 + Math.cos(angle + arc / 2) * 140,
            200 + Math.sin(angle + arc / 2) * 140
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(prizes[i], -ctx.measureText(prizes[i]).width / 2, 0);
        ctx.restore();
    }

    // Draw arrow
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(200, 20);
    ctx.lineTo(180, 60);
    ctx.lineTo(220, 60);
    ctx.closePath();
    ctx.fill();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    fetch('/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const { prize, index } = data;
            const arc_deg = 360 / prizes.length; // 60 degrees
            const target_pointer_angle = (index + 0.5) * arc_deg;
            const normalizedAngle = (270 - target_pointer_angle + 360) % 360;
            const N = Math.floor(Math.random() * 3) + 2; // 2 to 4 rotations
            const spinAngle = normalizedAngle + N * 360;
            const spinTime = Math.random() * 3000 + 2000; // 2-5 seconds
            let currentTime = 0;

            function animate() {
                currentTime += 16;
                const progress = currentTime / spinTime;
                if (progress < 1) {
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    startAngle = (spinAngle * easeOut) * Math.PI / 180;
                    drawWheel();
                    requestAnimationFrame(animate);
                } else {
                    startAngle = (spinAngle * Math.PI / 180);
                    drawWheel();
                    isSpinning = false;
                    spinBtn.disabled = false;
                    resultDiv.innerHTML = `<p>You won: ${prize}</p>`;
                }
            }

            requestAnimationFrame(animate);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            isSpinning = false;
            spinBtn.disabled = false;
            resultDiv.innerHTML = '<p>Error getting prize</p>';
        });
}

drawWheel();
spinBtn.addEventListener('click', spinWheel);

