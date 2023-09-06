// Inizializzazione dell'oggetto "videos"
let videos = [
    { id: 1, price: 1, link: 'https://www.youtube.com/watch?v=5UWWvGrmP9U&ab_channel=Gfire_sil' },
    { id: 2, price: 2, link: 'https://www.youtube.com/watch?v=K9qH8Izs6HE&ab_channel=Meramera' },
    { id: 3, price: 5, link: 'https://www.youtube.com/watch?v=fCW-mRp4qtU&t=1s&ab_channel=Ronin93' },
    { id: 4, price: 10, link: 'https://www.youtube.com/watch?v=m-De25XbrAI&ab_channel=BarbascuraeXtra' },
    { id: 5, price: 0.5, link: 'https://www.youtube.com/watch?v=77JEwFTaU2I&ab_channel=BarbascuraeXtra' },
    { id: 6, price: 25, link: 'https://www.youtube.com/watch?v=77JEwFTaU2I&ab_channel=BarbascuraeXtra' }
];


// Funzione per estrarre l'ID del video da un link di YouTube
function getYouTubeVideoId(link) {
    let url = new URL(link);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get('v');
}


// Dopo aver creato il grid dei video
let videoGrid = document.getElementById('video-grid');
for (let video of videos) {
    let col = document.createElement('div');
    col.classList.add('col-10', 'col-md-auto', 'video-card', 'my-4');
    let playerDiv = document.createElement('div');
    playerDiv.id = `player-${video.id}`;
    col.appendChild(playerDiv);
    videoGrid.appendChild(col);
}

//API di YouTube
function loadYouTubeAPI() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Inizializzazione dei video quando l'API di YouTube è pronta
window.onYouTubeIframeAPIReady = function () {
    initYouTubePlayers();
};

// Funzione per i player dei video YouTube
function initYouTubePlayers() {
    for (let video of videos) {
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
    }
}

// Caricamento dell'API di YouTube
loadYouTubeAPI();

// Funzione per filtrare i video in base al prezzo
function filterVideos(price) {
    let videoGrid = document.getElementById('video-grid');
    videoGrid.innerHTML = '';
    for (let video of videos) {
        if (price === 'all' || video.price === parseFloat(price)) {
            let col = document.createElement('div');
            col.classList.add('col-10', 'col-md-auto', 'video-card', 'my-4');
            let playerDiv = document.createElement('div');
            playerDiv.id = `player-${video.id}`;
            col.appendChild(playerDiv);
            videoGrid.appendChild(col);
        }
    }
    initYouTubePlayers();
}

// Filtraggio dei video al click dei bottoni di prezzo
let priceFilterButtons = document.querySelectorAll('#price-filter button');
priceFilterButtons.forEach(button => {
    button.addEventListener('click', function () {
        let price = this.getAttribute('data-price');
        filterVideos(price);
    });
});

// costruzione del nuovo video caricato + push nell'oggetto "videos"
let addVideoButton = document.getElementById('add-video');
addVideoButton.addEventListener('click', function () {
    let videoLinkInput = document.getElementById('video-link');
    let videoPriceSelect = document.getElementById('video-price');
    let videoLink = videoLinkInput.value;
    let videoPrice = parseFloat(videoPriceSelect.value);
    let newVideoId = videos.length + 1;
    let newVideo = { id: newVideoId, price: videoPrice, link: videoLink };
    videos.push(newVideo);

    //al push reset dei campi e dei filtri
    filterVideos('all');
    videoLinkInput.value = '';
    videoPriceSelect.selectedIndex = 0;
});

// Filtraggio di tutti i video all'apertura dell'html sul browser
filterVideos('all');