document.addEventListener('DOMContentLoaded', () => {
    // Add some wacky animations
    const images = document.querySelectorAll('.images img');
    images.forEach((img, index) => {
        img.style.animation = `wackyAnimation ${2 + index}s infinite alternate`;
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Add some wacky animations
    const images = document.querySelectorAll('.images img');
    images.forEach((img, index) => {
        img.style.animation = `wackyAnimation ${2 + index}s infinite alternate`;
    });

    const vinButton = document.getElementById('vin-button');
    vinButton.style.position = 'absolute';
    vinButton.style.left = '50%';
    vinButton.style.top = '85%';
    vinButton.style.transform = 'translate(-50%, -50%)';
    vinButton.style.transition = 'left 0.5s, top 0.5s'; // Add smooth transition

    const moveButton = () => {
        const maxX = window.innerWidth - vinButton.clientWidth;
        const maxY = window.innerHeight - vinButton.clientHeight;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        vinButton.style.left = `${randomX}px`;
        vinButton.style.top = `${randomY}px`;
    };

    vinButton.addEventListener('mouseover', moveButton);
    vinButton.addEventListener('click', () => {
        window.location.href = 'https://www.youtube.com/watch?v=JzTGyFzNgro';
    });
});