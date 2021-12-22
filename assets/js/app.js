const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MY_PLAYER';
const musicName = $('.music-player .music-name');
const musicArtist = $('.music-player .music-artist');
const cd = $('.cd');
const cdThumb = $('.music-player .cd-thumb');
const audio = $('.music-player #audio');
const playButton = $('.music-player .play');
const progressBar = $('.music-player .progress-bar');
const nextButton = $('.music-player .play-skip-forward');
const prevButton = $('.music-player .play-skip-back');
const shuffleButton = $('.music-player .btn-shuffle');
const repeatButton = $('.music-player .btn-repeat');
const playList = $('.music-player .play-list');

const app = {
    currentIndex: 0,
    isShuffle: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_KEY)) || {},
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
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_KEY, JSON.stringify(this.config));
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}">
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

        playList.innerHTML = htmls.join('');
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents() {
        const cdWidth = cd.offsetWidth;

        // handle cdThumb rotate
        const cdThumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' },
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimation.pause();

        // handle zoom in/out CD when scroll
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // handle play/pause music
        playButton.onclick = () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        // effect when play music
        audio.onplay = () => {
            cdThumbAnimation.play();
            playButton.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';          
        }

         // effect when pause music
        audio.onpause = () => {
            cdThumbAnimation.pause();
            playButton.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
        }

        // handle progress bar
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressBar.value = percent;
            }
        }

        // handle oninput progress bar
        progressBar.oninput = (e) => {
            const percent = e.target.value;
            audio.currentTime = (audio.duration / 100) * percent;
        }

        // handle next song
        nextButton.onclick = () => {
            if (this.isShuffle) {
                this.shuffleSong();
            } else {
                this.nextSong();
            }

            audio.play();
        }

        // handle prev song
        prevButton.onclick = () => {
            if (this.isShuffle) {
                this.shuffleSong();
            } else {
                this.prevSong();
            }

            audio.play();
        }

        // handle click shuffle
        shuffleButton.onclick = () => {
            this.isShuffle = !this.isShuffle;
            this.setConfig('isShuffle', this.isShuffle);
            shuffleButton.classList.toggle('active', this.isShuffle);
        }

        // handle click repeat
        repeatButton.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat);
            repeatButton.classList.toggle('active', this.isRepeat);
        }

        // handle when audio ended
        audio.onended = () => {
            if (this.isShuffle) {
                this.shuffleSong();
                audio.play();
            } else if (this.isRepeat) {
                audio.play();
            } else {
                nextButton.click();
            }
        }

        // handle click play list
        playList.onclick = (e) => {
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (e.target.closest('.option')) {

                } else {
                    this.currentIndex = e.target.closest('.song').dataset.index;
                    this.loadCurrentSong();
                    this.render();
                    audio.play();
                }
            }
        }
    },
    loadCurrentSong() {
        musicName.textContent = this.currentSong.name;
        musicArtist.textContent = this.currentSong.artist;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.src;
    },
    loadConfig() {
        this.isShuffle = this.config.isShuffle;
        this.isRepeat = this.config.isRepeat;

        shuffleButton.classList.toggle('active', this.isShuffle);
        repeatButton.classList.toggle('active', this.isRepeat);
    },
    nextSong() {
        this.currentIndex++;

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    shuffleSong() {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === randomIndex);

        this.currentIndex = randomIndex;
        this.loadCurrentSong();
    },
    start() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();