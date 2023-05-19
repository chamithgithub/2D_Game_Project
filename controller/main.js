/*Start btn*/

$("#btn-start").click(function () {
    startGame();
});

/*Try btn */
$("#btn-try-again").click(function () {
    window.location.reload();
});

function startGame() {
    /*hide start menu*/
    $("#play-game-menu").css("display", "none");
    $("#score").css("display", "block");

    createEnemy();
    $(window).on("keydown", function (e) {
        var left = parseInt($("#solo-back").css("left"));

        /*solo left*/
        if (e.key == "ArrowLeft" && left > -2100) {
            $("#solo-back").css("left", left - 50 + "px")
        }
        /*solo right*/
        else if (e.key == "ArrowRight" && left < 1500) {
            $("#solo-back").css("left", left + 50 + "px")
        }

        /*shoot laser*/
        if (e.keyCode == 32) {
            let bullet = createBullet();
            shootGun(bullet, left);
        }
    });
}

const space = $("#space").get(0);

function createEnemy() {
    var dir = '/assets/img/'
    var img = ['asteroid.png', 'enemy.png', 'spaceship.png'];
    var createEnemy = setInterval(() => {

        /*get random number between 0-3 for selecting img for apply enemy*/
        var randomImg = Math.floor(Math.random() * 3);

        /*create div element dynamically and add ".enemy-back" css while interval*/
        var enemy = $('<div>', {class: "enemy-back"}).get(0);
        // enemy.setAttribute("style", "background-image: url(" + dir + img[randomImg])
        enemy.style.left = Math.floor(Math.random() * (85 - 15) + 15) + "%";
        space.append(enemy)
    }, 2500);

    moveEnemy(createEnemy);
}

function moveEnemy(createEnemy) {
    var moveEnemies = setInterval(() => {

        var enemies = $(".enemy-back").get();

        if (enemies !== undefined) {
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                var enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top"));

                enemy.style.top = enemyTop + 5 + "px";
                isGameOver(enemy, moveEnemies, createEnemy);
            }
        }
    }, 50);
}

function createBullet() {
    /*create div dynamically for shooing laser*/
    const bullet = $('<div>', {class: "bullet"}).get(0);
    space.append(bullet);
    bullet.style.display = "none";
    return bullet;
}

function shootGun(bullet, left) {
    var moveBullet = setInterval(() => {

        checkExplosion(bullet);

        var bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
        bullet.style.left = left + 320 + "px";
        bullet.style.bottom = bulletBottom + 10 + "px";
        bullet.style.display = "block";

        if (parseInt(bullet.style.bottom) >= 900) {
            bullet.remove();
        }
    }, 50);
}

function checkExplosion(bullet) {
    var enemies = $(".enemy-back").get();

    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];

        var laserPosition = bullet.getBoundingClientRect();
        var enemyPosition = enemy.getBoundingClientRect();

        if (laserPosition.left >= enemyPosition.left && laserPosition.right <= enemyPosition.right &&
            laserPosition.top - 50 <= enemyPosition.top && laserPosition.bottom <= enemyPosition.bottom) {

            makeExplosion(enemy);
            generateScore();
            enemy.remove();
            bullet.remove();
        }
    }
}

function makeExplosion(enemy) {

    const explosion = $('<div>', {class: "explosion"}).get(0);
    explosion.style.left = enemy.style.left;
    explosion.style.right = enemy.style.right- 300 + "px";
    explosion.style.top = enemy.style.top;
    explosion.style.bottom = enemy.style.bottom - 10 + "px";
    space.append(explosion);

    /*after 1s,remove that div*/
    setTimeout(function () {
        explosion.remove();
    }, 1000);
}


function isGameOver(enemy, moveEnemies, createEnemy) {
    var rocketPosition = $("#solo-back").get(0).getBoundingClientRect();
    var enemyPosition = enemy.getBoundingClientRect();


    if (rocketPosition.top <= enemyPosition.top && rocketPosition.bottom <= enemyPosition.bottom) {
        clearInterval(moveEnemies);
        clearInterval(createEnemy);
        gameOver();
    }
}
function gameOver() {
    /* show score*/
    $("#game-over-menu").css("display", "block");
    $("#final-score").text($("#score-point").text());
}

function generateScore() {
    /*add 5 score*/
    var score = $("#score-point").text();
    var newScore = (+score) + (+5);
    $("#score-point").text(newScore);
}