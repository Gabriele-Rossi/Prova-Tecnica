// Inizializzazione dell'array "videos" (manca un linik al prezzo di 3€ appositamente per test)
let videos = [
    { id: 1, price: 5, link: 'https://www.youtube.com/watch?v=ALiS_FSBwdY&ab_channel=Geopop' },
    { id: 2, price: 1, link: 'https://www.youtube.com/watch?v=8UWQEZEL1IQ&ab_channel=Geopop' },
    { id: 3, price: 2, link: 'https://www.youtube.com/watch?v=0jliJLIrIl0&ab_channel=Geopop' },
    { id: 4, price: 10, link: 'https://www.youtube.com/watch?v=a9Hi26yjlkM&ab_channel=Geopop' },
    { id: 5, price: 0.5, link: 'https://www.youtube.com/watch?v=eJwBf76MMBs&ab_channel=Geopop' },
    { id: 6, price: 25, link: 'https://www.youtube.com/watch?v=vW8FrJywMhA&ab_channel=Geopop' }
];

// Funzione per estrarre l'ID del video da un link di YouTube
function getYouTubeVideoId(link) {
    let url = new URL(link);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get('v');
}

// Funzione per verificare se un link è valido di YouTube
function isValidYouTubeLink(link) {
    // Pattern per corrispondere a un link di YouTube
    let youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/watch\?v=([A-Za-z0-9_-]+)/;
    return youtubePattern.test(link);
}

// Inizializzazione dei video --> crea un player di youtube per ogni link sfruttando l'API
function initYouTubePlayers() {
    videos.forEach(video => {
        let videoId = getYouTubeVideoId(video.link);
        if (videoId) {
            new YT.Player(`player-${video.id}`, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 1
                },
            });
        }
    });
}

// Caricamento dell'API di YouTube
function loadYouTubeAPI() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Funzione per aggiornare il filtro dei video
function updateVideoFilter(price) {
    let videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';

    videos.forEach(video => {
        if (price === 'all' || video.price === parseFloat(price)) {
            let col = document.createElement('div');
            col.classList.add('col-10', 'col-md-auto', 'video-card', 'my-4');
            let playerDiv = document.createElement('div');
            playerDiv.id = `player-${video.id}`;
            col.appendChild(playerDiv);
            videoGrid.appendChild(col);
        }
    });

    initYouTubePlayers();
}

document.addEventListener('DOMContentLoaded', () => {
    // Caricamento dell'API di YouTube
    loadYouTubeAPI();

    // Inizializzazione dei player
    window.onYouTubeIframeAPIReady = initYouTubePlayers;

    // Filtro dei video per prezzo
    let priceFilterButtons = document.querySelectorAll('#price-filter button');
    priceFilterButtons.forEach(button => {
        button.addEventListener('click', function () {
            let price = this.getAttribute('data-price');
            updateVideoFilter(price);
        });
    });

    // Gestione dell'aggiunta di nuovi video (link trasformato in oggetto e pushato nell'array (se valido)
    let addVideoButton = document.getElementById('add-video');
    let invalidLinkAlert = document.getElementById('invalid-link-alert');
    let emptyPriceAlert = document.getElementById('empty-price-alert');
    
    addVideoButton.addEventListener('click', () => {
        let videoLinkInput = document.getElementById('video-link');
        let videoPriceSelect = document.getElementById('video-price');
        let videoLink = videoLinkInput.value;
        let videoPrice = parseFloat(videoPriceSelect.value);

        //condizioni per la validazione del link caricato e/o del prezzo scelto. (se tutte le condizioni non sono soddisfatte esce l'alert del link non valido)
        if (isValidYouTubeLink(videoLink) && videoPrice !== 0) {
            invalidLinkAlert.style.display = 'none';
            let newVideoId = videos.length + 1;
            let newVideo = { id: newVideoId, price: videoPrice, link: videoLink };
            videos.push(newVideo);
            updateVideoFilter('all');
            videoLinkInput.value = '';
            videoPriceSelect.selectedIndex = 0;
        } else if (!isValidYouTubeLink(videoLink)) {
            invalidLinkAlert.style.display = 'block';
            setTimeout(() => {
                invalidLinkAlert.style.display = 'none';
            }, 5000);
        } else if (videoPrice === 0) {
            emptyPriceAlert.style.display = 'block';
            setTimeout(() => {
                emptyPriceAlert.style.display = 'none';
            }, 5000);
        }
    });

    // Filtraggio di tutti i video all'apertura della pagina
    updateVideoFilter('all');
});

