 // Code Editor Functionality
 const editor = document.getElementById('codeEditor');
 const preview = document.getElementById('livePreview');
 const runButton = document.getElementById('runCode');
 const resetButton = document.getElementById('resetCode');
 
 // Initial render
 preview.innerHTML = editor.value;
 
 // Update preview on input or button click
 function updatePreview() {
     try {
         preview.innerHTML = editor.value;
     } catch (e) {
         preview.innerHTML = `<div style="color: #ff5f56;">Ошибка: ${e.message}</div>`;
     }
 }
 
 editor.addEventListener('input', updatePreview);
 runButton.addEventListener('click', updatePreview);
 resetButton.addEventListener('click', () => {
     editor.value = '';
     preview.innerHTML = '';
 });
 
 // Tab support in editor
 editor.addEventListener('keydown', function(e) {
     if (e.key === 'Tab') {
         e.preventDefault();
         const start = this.selectionStart;
         const end = this.selectionEnd;
         
         this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
         this.selectionStart = this.selectionEnd = start + 2;
     }
 });
 
 // Smooth scrolling for anchor links
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function(e) {
         e.preventDefault();
         
         const targetId = this.getAttribute('href');
         if (targetId === '#') return;
         
         const targetElement = document.querySelector(targetId);
         if (targetElement) {
             targetElement.scrollIntoView({
                 behavior: 'smooth'
             });
         }
     });
 });
 
 // Animation on scroll
 const animateOnScroll = () => {
     const elements = document.querySelectorAll('.fade-in');
     
     elements.forEach(element => {
         const elementPosition = element.getBoundingClientRect().top;
         const windowHeight = window.innerHeight;
         
         if (elementPosition < windowHeight - 100) {
             element.style.opacity = '1';
             element.style.transform = 'translateY(0)';
         }
     });
 };
 
 // Initial check
 animateOnScroll();
 
 // Check on scroll
 window.addEventListener('scroll', animateOnScroll);