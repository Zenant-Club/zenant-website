document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.glass-card');
    const form = document.getElementById('notifyForm');
    const emailInput = document.getElementById('emailInput');
    
    // Add a subtle 3D tilt effect on the card when mouse moves
    document.addEventListener('mousemove', (e) => {
        // Only apply effect on non-touch devices and larger screens
        if (window.innerWidth > 768) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 70;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 70;
            
            // Apply subtle rotation
            card.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });

    // Reset transform when mouse leaves window
    document.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        card.style.transition = 'transform 0.5s ease';
    });
    
    // Reset transition
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        
        if (emailInput.value) {
            btn.textContent = 'Subscribed!';
            btn.style.background = '#10b981'; // Green color for success
            emailInput.value = '';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; // Reset to default CSS
            }, 3000);
        }
    });
});
