import './style.css'

type Ball = { img: HTMLDivElement, speedX: number, speedY: number, x: number, y: number, canMove: boolean }
const container = document.querySelector<HTMLDivElement>('#app')

const ballUrls: string[] = [
  'https://picsum.photos/id/100/200/300',
  'https://picsum.photos/id/200/200/300',
  'https://picsum.photos/id/300/200/300',
  'https://picsum.photos/id/400/200/300',
  'https://picsum.photos/id/500/200/300',
  'https://picsum.photos/id/600/200/300',
  'https://picsum.photos/id/700/200/300',
  'https://picsum.photos/id/800/200/300',
  'https://picsum.photos/id/900/200/300'
];

const maxBalls: number = 10
let balls: Ball[] = []

const baseSize: number = 400;

const generateBalls = () => {
  const numberOfImages: number = ballUrls.length
  const decrementPerImage: number = baseSize / numberOfImages;

  const logo: HTMLDivElement = document.createElement('div')
  logo.classList.add('img-wrapper', 'logo')
  
  const logoImg: HTMLImageElement = document.createElement('img')
  logoImg.src = "logo.png"
  logoImg.alt="Roland Garros Logo"
  logo.appendChild(logoImg)

  if (container) {
    container.appendChild(logo)
  }

  for (let i = 0; i <= numberOfImages; i++) {
    const imgWrapper: HTMLDivElement = document.createElement('div')
    imgWrapper.classList.add('img-wrapper')
    const size: number = baseSize - (i * decrementPerImage)
    imgWrapper.style.width = `${size}px`
    imgWrapper.style.height = `${size}px`

    const img: HTMLImageElement = document.createElement('img')
    img.src = ballUrls[i]
    img.style.width = `${size}px`
    img.style.height = `${size}px`

    imgWrapper.appendChild(img)
    imgWrapper.style.zIndex = '' + (numberOfImages-i)

    container?.appendChild(imgWrapper)
    const isFirstBall: boolean = i === 0
    const ball: Ball = {
      img: imgWrapper,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
      x: 0,
      y: 0,
      canMove: !isFirstBall
    }
    balls.push(ball)

    if (isFirstBall) {
      // Center last image
      ball.x  = window.innerWidth / 2 - size / 2;
      ball.y = window.innerHeight / 2 - size / 2;
      
      imgWrapper.style.transform = `translate(${ball.x}px, ${ball.y}px)`;
      // Allows the last frame to start moving after 5 seconds
      setTimeout(() => {
        balls[0].canMove = true
      }, 8000) 
    } else {
      // Random position for all other images
      const maxX: number = window.innerWidth - size
      const maxY: number = window.innerHeight - size
      ball.x = Math.floor(Math.random() * maxX)
      ball.y = Math.floor(Math.random() * maxY)
      imgWrapper.style.transform = `translate(${ball.x}px, ${ball.y}px)`;

    }
  }
  if (logo) {
    logo.style.zIndex = '' + (numberOfImages + 1 - Math.floor(numberOfImages / 2)) 
  }
}

generateBalls()


let animation: number | null = null
function updatePosition(): void {
  balls.forEach(ball => {
    if (!ball.canMove) {
      return // Does not move image if canMove is false
    }
    ball.x = (ball.x || 0) + ball.speedX;
    ball.y = (ball.y || 0) + ball.speedY;

    ball.img.style.transform = `translate(${ball.x}px, ${ball.y}px)`;

    let rect: DOMRect = ball.img.getBoundingClientRect()
    if (rect.top + rect.height > window.innerHeight || rect.top < 0) {
      ball.speedY *= -1
    }
    if (rect.left + rect.width > window.innerWidth || rect.left < 0) {
      ball.speedX *= -1
    }
  })
  
  animation = requestAnimationFrame(updatePosition)
}

updatePosition()
const ballsQueue: string[] = []

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    ballsQueue.push('https://picsum.photos/id/100/200/300')

    event.preventDefault();
  }
});

const refresh = () => {
  if (animation) {
    window.cancelAnimationFrame(animation);
  }
  balls = []
  if (container) {
    container.innerHTML = ''
  }
  generateBalls()
  updatePosition()
}

setInterval(() => {
  
  if (ballsQueue.length > 0) {
    ballUrls.unshift(ballsQueue[0])
    showNewBallScreen(ballsQueue[0])
    if (ballUrls.length > maxBalls) {
      ballUrls.pop()
    }
    ballUrls.pop()
    ballsQueue.shift()
    refresh()
  }
}, 10000)


const showNewBallScreen = (imageUrl: string) => {
  const fullScreenDiv = document.createElement('div');
  fullScreenDiv.className = 'new-ball-image-wrapper';
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.width = `${baseSize}px`
  img.style.height = `${baseSize}px`
  fullScreenDiv.appendChild(img);

  document.body.appendChild(fullScreenDiv);

  createStars(fullScreenDiv, 1000)
  setTimeout(() => {
    document.body.removeChild(fullScreenDiv);
  }, 4000);
}

const createStars = (fullScreenDiv: HTMLDivElement, number: number = 400) => {
  const starColors = ["#ffcda5", "#ffd250", "#ff8220", "#fff220", "#ff5000"]

  if (fullScreenDiv) {
    for (let i = 0; i < number; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const t = (1 + 0.01 * Math.floor(Math.random() * 100)) * 1000;
        particle.style.animationDuration = t + 'ms';
        particle.style.animationDelay = '-' + (0.01 * Math.floor(Math.random() * 100) * t) + 'ms';
        particle.style.transform = `translate(${Math.random() * 100}vw, ${Math.random() * 100}vh)`;
        particle.style.backgroundColor = starColors[Math.floor(Math.random()*starColors.length)];

        fullScreenDiv.appendChild(particle);
    }    
  }
}

