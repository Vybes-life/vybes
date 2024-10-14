const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            item.querySelector('.question').addEventListener('click', () => {
                // Toggle open class for the current item
                item.classList.toggle('open');

                // Close other items
                faqItems.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('open');
                    }
                });

                // Smooth scroll into view to make sure questions stay visible
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            });
        });