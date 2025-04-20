document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        // Calculate the center position
        const offset = (window.innerHeight - targetElement.offsetHeight) / 2;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - offset;

        // Scroll to the calculated position
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});
function scrollNext(){
    document.getElementById('skills-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};

document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})
   
