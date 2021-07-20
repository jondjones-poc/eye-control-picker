window.saveDataAcrossSessions = true;

const LOOK_DELAY = 1000;
const LEFT_CUTOFF = window.innerWidth / 4;
const RIGHT_CUTOFF = window.innerWidth - window.innerWidth / 4;
const LEFT = 'LEFT'
const RIGHT = 'RIGHT';
const RESET = 'RESET';

const getNewImage = (next = false) => {
    const imageEl = document.createElement("img");
    imageEl.src = `https://picsum.photos/1000?${Math.random()}`;

    if (next) {
        imageEl.classList.add("next");
    }

    document.body.append(imageEl);
    return imageEl;
}

let imageElementOne = getNewImage();
let imageElementTwo = getNewImage(true);
let lookDirection = null;
let startLookTime = Number.POSITIVE_INFINITY;

webgazer.setGazeListener(function(data, elapsedTime) {

    if (!data || lookDirection === 'STOP') {
        return
    };

    if (data.x < LEFT_CUTOFF 
        && lookDirection !== LEFT
        && lookDirection !== RESET) {
        startLookTime = elapsedTime;
        lookDirection = LEFT;
    } else if (data.x > RIGHT_CUTOFF 
        && lookDirection !== RIGHT
        && lookDirection !== RESET) {
        startLookTime = elapsedTime;
        lookDirection = RIGHT;
    } else if (data.x >= LEFT_CUTOFF && data.x <= RIGHT_CUTOFF) {
        startLookTime = Number.POSITIVE_INFINITY;
        lookDirection = null;
    }

    if (startLookTime + LOOK_DELAY < elapsedTime) {
        console.log(imageElementOne)
        if (lookDirection === LEFT) {
            imageElementOne.classList.add("left")
        } else {
            imageElementOne.classList.add("right")
        }

        startLookTime = Number.POSITIVE_INFINITY;
        lookDirection = "STOP";

        setTimeout(() => {
            imageElementOne.remove();
            imageElementTwo.classList.remove('next');
            imageElementOne = imageElementTwo;
            imageElementTwo = getNewImage(true);
            lookDirection = RESET;
        }, 200)
    }
}).begin();

// webgazer.showVideoPreview(false).shoPredictionPoints(false);