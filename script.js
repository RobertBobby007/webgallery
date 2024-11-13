// Proměnné pro galerii, modal a další prvky
const gallery = document.querySelector('.gallery');
const modal = document.querySelector('.modal');
const modalImage = document.createElement('img');
modal.appendChild(modalImage);

let currentImageIndex = 0;
let images = [];

// Načítání obrázků pomocí Unsplash API s filtrem na noční fotografie
async function loadImages(page = 1) {
    try {
        // Přidání vyhledávacího parametru pro noční fotografie
        const response = await fetch(`https://api.unsplash.com/photos?page=${page}&query=night&client_id=zP8npFwpauZlNwMbEUs2S_0zY0SJyq6zlKOvLBrcSp4`);

        // Kontrola, jestli byl požadavek úspěšný
        if (!response.ok) {
            throw new Error(`Chyba HTTP: ${response.status}`);
        }

        const data = await response.json();

        console.log('Načtená data:', data);  // Výpis dat do konzole pro kontrolu

        // Přidání obrázků do galerie
        data.forEach(imageData => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.innerHTML = `
              <img src="${imageData.urls.small}" alt="${imageData.alt_description}">
              <div class="gallery-item-info">
                <p>Autor: ${imageData.user.name}</p>
              </div>
            `;
            gallery.appendChild(galleryItem);

            // Uložení URL obrázku v plné velikosti do pole
            images.push(imageData.urls.full);

            // Kliknutí na obrázek otevře modal
            galleryItem.addEventListener('click', () => {
                openModal(imageData.urls.full);
                currentImageIndex = images.indexOf(imageData.urls.full);
            });
        });
    } catch (error) {
        console.error("Chyba při načítání obrázků:", error);
    }
}

// Otevření modalu s obrázkem v plné velikosti
function openModal(imageUrl) {
    modalImage.src = imageUrl;
    modal.classList.add('active');
}

// Zavření modalu při kliknutí kamkoliv na modal
modal.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Přepínání obrázků pomocí šipek na klávesnici
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        }
        modalImage.src = images[currentImageIndex];
    }
});
let loading = false; // Inicializace proměnné pro sledování stavu načítání

// Načítání obrázků při scrollování (infinite scroll)
window.addEventListener('scroll', () => {
    // Pokud je stránka dostatečně posunutá dolů, načteme další obrázky
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        const nextPage = Math.floor(images.length / 10) + 1;

        // Ujistíme se, že načítání nebude probíhat, pokud je již v procesu
        if (!loading) {
            loading = true;
            loadImages(nextPage)
                .then(() => {
                    loading = false;  // Po dokončení načítání nastavíme loading na false
                });
        }
    }
});

// Spuštění aplikace
loadImages();
