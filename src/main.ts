import './style.css'

type Image = { img: HTMLDivElement, speedX: number, speedY: number, canMove: boolean }
const container = document.querySelector<HTMLDivElement>('#app')
const logo = document.querySelector<HTMLDivElement>('.logo')

const numberOfImages: number = 50
const images: Image[] = []

for (let i = 0; i < numberOfImages; i++) {
  const imgWrapper: HTMLDivElement = document.createElement('div')
  imgWrapper.classList.add('img-wrapper')
  const size: number = 50 + i * 3.14
  imgWrapper.style.width = `${size}px`
  imgWrapper.style.height = `${size}px`

  const img: HTMLImageElement = document.createElement('img')
  img.src = 'https://picsum.photos/500'
  img.style.width = `${size}px`
  img.style.height = `${size}px`

  imgWrapper.appendChild(img)
  imgWrapper.style.zIndex = '' + i

  container?.appendChild(imgWrapper)
  const isLastImage: boolean = i === numberOfImages - 1
  images.push({
    img: imgWrapper,
    speedX: Math.random() * 2 - 1,
    speedY: Math.random() * 2 - 1,
    canMove: !isLastImage
  })

  if (isLastImage) {
    // Center last image
    imgWrapper.style.left = `${window.innerWidth / 2 - size / 2}px`
    imgWrapper.style.top = `${window.innerHeight / 2 - size / 2}px`
    // Allows the last frame to start moving after 5 seconds
    setTimeout(() => {
      images[images.length - 1].canMove = true
    }, 5000) 
  } else {
    // Random position for all other images
    const maxX: number = window.innerWidth - size
    const maxY: number = window.innerHeight - size
    const startX: number = Math.floor(Math.random() * maxX)
    const startY: number = Math.floor(Math.random() * maxY)
    imgWrapper.style.left = `${startX}px`
    imgWrapper.style.top = `${startY}px`
  }

}

if (logo) {
  logo.style.zIndex = '' + Math.floor(numberOfImages / 2)
}
function updatePosition(): void {
  images.forEach(obj => {
    if (!obj.canMove) {
      return // Does not move image if canMove is false
    }

    let rect: DOMRect = obj.img.getBoundingClientRect()
    if (rect.top + rect.height > window.innerHeight || rect.top < 0) {
      obj.speedY *= -1
    }
    if (rect.left + rect.width > window.innerWidth || rect.left < 0) {
      obj.speedX *= -1
    }
    obj.img.style.top = rect.top + obj.speedY + 'px'
    obj.img.style.left = rect.left + obj.speedX + 'px'
  })

  requestAnimationFrame(updatePosition)
}

updatePosition()
