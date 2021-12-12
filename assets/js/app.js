const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Hotel California',
            artist: 'Eagles',
            img: './assets/img/Hotel California - Eagles.png',
            src: './assets/music/Hotel California - Eagles.mp3',
        },
        {
            name: 'Something Just Like This',
            artist: 'The Chainsmokers & Coldplay',
            img: './assets/img/Something Just Like This - The Chainsmokers & Coldplay.png',
            src: './assets/music/Something Just Like This - The Chainsmokers & Coldplay.mp3',
        },
        {
            name: 'That Girl',
            artist: 'Olly Murs',
            img: './assets/img/That Girl - Olly Murs.png',
            src: './assets/music/That Girl - Olly Murs.mp3',
        },
        {
            name: 'The River',
            artist: 'Axel Johansson',
            img: './assets/img/The River - Axel Johansson.png',
            src: './assets/music/The River - Axel Johansson.mp3',
        },
    ],
    render() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb">
                        <img src="${song.img}" alt="">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.artist}</p>
                    </div>
                    <div class="option">
                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </div>
                </div>
            `;

        });

        $('.play-list').innerHTML = htmls.join('');
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;

        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
    },
    loadCurrentSong() {
        const musicName = $('.music-player .music-name');
        const musicArtist = $('.music-player .music-artist');
        const cdThumb = $('.music-player .cd-thumb');
        const audio = $('.music-player #audio');

        musicName.textContent = this.currentSong.name;
        musicArtist.textContent = this.currentSong.artist;
        cdThumb.style.backgroundImage = this.currentSong.img;
        audio.src = this.currentSong.src;
    },
    start() {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();