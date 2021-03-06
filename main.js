const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'CONGSON'

const tabs = $$(".tab-item");
const panes = $$(".tab-pane");

const player = $('.player')
const songName = $('header h2')
const singerName = $('header p')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress =  $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist .playlist__list')
const playingTime = $('.playing-time')
const durationTime = $('.duration-time')
const volumeProgress = $('#volume-progress')
const valueVolumeProgress = $('.volume-value')
const muteBtn = $('.btn-volume-mute')
const upVolumeBtn = $('.btn-volume-up')
const downVolumeBtn = $('.btn-volume-down')
const tabActive = $(".tab-item.active");
const line = $(".tabs .line");
const timeOut = $(".myBreak");
const btnTimeOut = $('#btnBreak');
const toggleSwitch = $('.theme-switch input[type="checkbox"]')

// troc vao css
line.style.left = tabActive.offsetLeft + "px";   
line.style.right = tabActive.offsetRight + "px";

tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tab-item.active").classList.remove("active");
        $(".tab-pane.active").classList.remove("active");

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
    };
});

// Random lại 1 bài khi đã random hết playlist
let arrayRandom = []
let lenArrRandom = 0

const app = {
    currentIndex: 0,
    currentTime: 0,
    currentVolume: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
    isMobile: false,
    volumeBeforeMuted: 0,
    isOnMouseAndTouchOnProgress: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Phố đã lên đèn",
            singer: "Công Sơn",
            path: "./assets/music/pho_da_len_den_huyen_tam_mon_cukak_remix_audio_lyrics_-2498468810678559091.mp3",
            image: "./assets/image/phodalenden.jpg"
        },
        {
            name: "Skyler",
            singer: "Son tung MTP",
            path: "./assets/music/skyler.mp3",
            image: "./assets/image/skyler.jpg"
        },
        {
            name: "Build a Bitch",
            singer: "Bella Poarch",
            path: "./assets/music/Build a Bitch.mp3",
            image: "./assets/image/build_a_bitch.png"
        },
        {
            name: "Don't Let Me Down",
            singer: "The Chainsmokers",
            path: "./assets/music/Dont Let Me Down.mp3",
            image: "./assets/image/dont_let_me_down.png"
        },
        {
            name: "Old Town Road",
            singer: "Lil Nas X",
            path: "./assets/music/Old Town Road.mp3",
            image: "./assets/image/old_town_road.png"
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./assets/music/Sugar.mp3",
            image: "./assets/image/sugar.png"
        },
        {
            name: "Waiting For Love",
            singer: "Avicii",
            path: "./assets/music/Waiting For Love.mp3",
            image: "./assets/image/waiting_for_love.png"
        },
        {
            name: "We Don't Talk Anymore",
            singer: "Charlie Puth",
            path: "./assets/music/We Dont Talk Anymore.mp3",
            image: "./assets/image/we_dont_talk_anymore.png"
        },
        {
            name: "Without You",
            singer: "Avicii",
            path: "./assets/music/Without You.mp3",
            image: "./assets/image/without_you.png"
        },
        {
            name: "Anh đếch cần gì nhiều ngoài em",
            singer: "Đen",
            path: "./assets/music/Anh đếch cần gì nhiều ngoài em.mp3",
            image: "./assets/image/anh_dech_can_gi_nhieu_ngoai_em.png"
        },
        {
            name: "Bài này chill phết",
            singer: "Đen",
            path: "./assets/music/Bài này chill phết.mp3",
            image: "./assets/image/bai_nay_chill_phet.png"
        },
        {
            name: "Đi theo bóng mặt trời",
            singer: "Đen",
            path: "./assets/music/Đi theo bóng mặt trời.mp3",
            image: "./assets/image/di_theo_bong_mat_troi.png"
        },
        {
            name: "Đưa nhau đi trốn",
            singer: "Đen",
            path: "./assets/music/Đưa nhau đi trốn.mp3",
            image: "./assets/image/dua_nhau_di_tron.png"
        },
        {
            name: "Đừng gọi anh là idol",
            singer: "Đen",
            path: "./assets/music/Đừng gọi anh là idol.mp3",
            image: "./assets/image/dung_goi_anh_la_idol.png"
        },
        {
            name: "Lối nhỏ",
            singer: "Đen",
            path: "./assets/music/Lối nhỏ.mp3",
            image: "./assets/image/loi_nho.png"
        },
        {
            name: "Mười năm",
            singer: "Đen",
            path: "./assets/music/Mười năm.mp3",
            image: "./assets/image/muoi_nam.png"
        }
    ],

    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render() {
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>

                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="music-waves ${index === this.currentIndex ? 'active' : ''}">  
                        <span></span>  
                        <span></span>  
                        <span></span>  
                        <span></span>  
                        <span></span>  
                    </div>
                </div>
            `
        })
        playlist.innerHTML += html.join('')
    },

    defineProperties() {
        // Getter
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý thay đổi kích thước màn hình
        window.onresize = function() {
            if (window.innerWidth < 740) {
                _this.isMobile = true
            } else {
                _this.isMobile = false
            }
            _this.setConfig("isMobile", _this.isMobile)
        }

        // Xử lý phóng to / thu nhỏ CD khi ở mobile
        document.onscroll = function() {
            if (_this.isMobile) {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            } else {
                cd.style.width = '200px'
                cd.style.opacity = '1'
            }
        }

        // Phát / dừng nhạc khi nhấn `space`
		document.onkeydown = function(e) {
			if(e.code === "ControlLeft+Space") {
                e.preventDefault()
				if (_this.isPlaying) {
                    audio.pause()
                    playBtn.title = "Play"
                } else {  
                    audio.play()
                    playBtn.title = "Pause"
                }
			}
		}

        // Xử lý khi nhấn Play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
                playBtn.title = "Play"
            } else {  
                audio.play()
                playBtn.title = "Pause"
            }
        }

        // Khi audio phát nhạc
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
            $$(".music-waves.active span").forEach(span => {
                span.classList.add('active')
            })
        }

        // Khi auto được tải lên
        audio.onloadedmetadata = function () {
            const minSec = _this.formatTime(audio.duration)
            durationTime.textContent = `${minSec[0]}:${minSec[1]}`
		}

        // Khi audio dừng phát nhạc
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
            $$(".music-waves.active span.active").forEach(span => {
                span.classList.remove('active')
            })
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration && !_this.isOnMouseAndTouchOnProgress) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                _this.setConfig("currentTime", audio.currentTime)

                let tmp = _this.formatTime(audio.currentTime)
                playingTime.textContent = `${tmp[0]}:${tmp[1]}`
            }
        }

        // Chạm chuột
        progress.onmousedown = function() {
            _this.isOnMouseAndTouchOnProgress = true
        }

        // Chạm
        progress.ontouchstart = function() {
            _this.isOnMouseAndTouchOnProgress = true
        }

        // Xử lý khi tua nhạc
        progress.oninput = function(e) {
            if (audio.duration) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
                _this.isOnMouseAndTouchOnProgress = false
            }
        }

        // Xử lý khi thay đổi âm lượng
        volumeProgress.oninput = function(e) {
            audio.muted = false
            audio.volume = e.target.value / 100
            _this.currentVolume = audio.volume
            valueVolumeProgress.textContent = Math.round(e.target.value)
            _this.changeStyleVolume()
            _this.setConfig('currentVolume', _this.currentVolume)
        }

        // Xử lý tắt / mở tiếng
        upVolumeBtn.onclick = function() {
            _this.muteOrUnmuteVolume()
        }

        downVolumeBtn.onclick = function() {
            _this.muteOrUnmuteVolume()
        }

        muteBtn.onclick = function() {
            _this.muteOrUnmuteVolume()
        }

        // Khi nhấn next
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.scrollToActiveSong()
        }

        // Khi nhấn prev
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.changeTitle()
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý bật / tắt repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.changeTitle()
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio kết thúc
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý khi nhấn vào song trong playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                audio.play()
            }
        }
    },

    // Xử lý màn hình kéo đến vị trí nhạc đang phát trong playlist
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 100)
    },

    loadCurrentSong() {
        songName.textContent = this.currentSong.name
        singerName.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        if (this.currentIndex == this.config.currentIndex) {
            audio.currentTime = this.currentTime
        } else {
            audio.currentTime = 0
        }

        this.setConfig("currentIndex", this.currentIndex)

        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
            $('.music-waves.active').classList.remove('active')
        }

        const songList = $$('.song')
        const wavesSongList = $$('.music-waves')
        songList.forEach((song, index) => {
            if (Number(song.dataset.index) === this.currentIndex) {
                song.classList.add('active');
                wavesSongList[index].classList.add('active');
            }
        });
    },

    loadConfig() {
        this.isRandom = this.config.isRandom || this.isRandom
        this.isRepeat = this.config.isRepeat || this.isRepeat
        this.isMuted = this.config.isMuted || this.isMuted
        this.isMobile= this.config.isMobile || this.isMobile
        this.currentIndex = this.config.currentIndex || this.currentIndex
        this.currentTime = this.config.currentTime || this.currentTime
        this.currentVolume = this.config.currentVolume >= 0 ? this.config.currentVolume : this.currentVolume
        this.volumeBeforeMuted = this.config.volumeBeforeMuted >= 0 ? this.config.volumeBeforeMuted : this.volumeBeforeMuted
    },

    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong() {
        let newIndex 
        newIndex = Math.floor(Math.random() * this.songs.length)

        if (lenArrRandom > 0) {
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
                var isExistArrRandom = arrayRandom.includes(newIndex)
            } while (isExistArrRandom)
        }

        arrayRandom[lenArrRandom] = newIndex

        this.currentIndex = newIndex
        this.loadCurrentSong()

        if (lenArrRandom === this.songs.length - 1) {
            arrayRandom = []
            lenArrRandom = -1
        }

        lenArrRandom++
    },

    formatTime(time) {
        const mins = Math.floor((time % 3600) / 60)
		const secs = Math.floor(time % 60)
        const minutes = mins < 10 ? `0${mins}` : mins
        const seconds = secs < 10 ? `0${secs}` : secs
		return [minutes, seconds]
    },

    changeTheme() {
        const _this = this
        const currentTheme = this.config.theme

        if (currentTheme) {
            document.documentElement.setAttribute("data-theme", currentTheme)

            if (currentTheme === "dark") {
                toggleSwitch.checked = true
            }
        }

        function switchTheme(e) {
            if (e.target.checked) {
                document.documentElement.setAttribute("data-theme", "dark")
                _this.setConfig('theme', "dark")
            } else {
                document.documentElement.setAttribute("data-theme", "light")
                _this.setConfig('theme', "light")
            }
        }

        toggleSwitch.addEventListener("change", switchTheme, false);
    },

    changeStyleVolume() {
        if (this.currentVolume === 0) {
            muteBtn.style.display = 'flex'
            downVolumeBtn.style.display = 'none'
            upVolumeBtn.style.display = 'none'
        }
        else if (this.currentVolume > 0 && this.currentVolume < 0.5) {
            muteBtn.style.display = 'none'
            downVolumeBtn.style.display = 'flex'
            upVolumeBtn.style.display = 'none'
        }
        else {
            muteBtn.style.display = 'none'
            downVolumeBtn.style.display = 'none'
            upVolumeBtn.style.display = 'flex'
        }
    },

    muteOrUnmuteVolume() {
        this.isMuted = !this.isMuted
        if (this.isMuted) {
            this.volumeBeforeMuted = this.currentVolume
            audio.muted = true
            volumeProgress.value = 0
            audio.volume = 0
            this.currentVolume = 0
        }
        else {
            audio.muted = false
            this.currentVolume = this.volumeBeforeMuted
            volumeProgress.value = this.currentVolume * 100
            audio.volume = this.currentVolume
        }
        valueVolumeProgress.textContent = Math.round(this.currentVolume * 100)
        this.setConfig('volumeBeforeMuted', this.volumeBeforeMuted)
        this.setConfig('isMuted', this.isMuted)
        this.setConfig('currentVolume', this.currentVolume)
        this.changeStyleVolume()
    },

    changeTitle() {
        this.isRepeat ? repeatBtn.title = 'Disable repeat' : repeatBtn.title = 'Enable repeat'
        this.isRandom ? randomBtn.title = 'Disable shuffle' : randomBtn.title = 'Enable shuffle'
    },

    start() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe/ xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Change theme
        this.changeTheme()

        // Hiển thị trạng thái ban đầu của nút repeat, random, 
        // Thanh volume
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        volumeProgress.value = (this.currentVolume * 100)
        audio.volume = this.currentVolume
        valueVolumeProgress.textContent =  Math.round(volumeProgress.value)

        this.changeStyleVolume()
        this.changeTitle()
    },
}

app.start()

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}

// time
const timeH = $(".countDown");
let timeSecond;
var source2 = "./assets/music/Peder_B_Helland_Sunny_Mornings.mp3"
var audio2 = new Audio();
audio2.src = source2;
audio2.autoplay = false;
audio2.loop = true;

var source = "./assets/music/Tôi_đã_làm_việc_được_tận_5_phút___Shorts.mp3"
var audio1 = new Audio();
audio1.src = source;
audio1.autoplay = false;
function endCount() {
    audio1.play();
    audio1.volume = 0.09
    audio2.pause();
    document.documentElement.setAttribute("data-theme", "light")
    toggleSwitch.checked = false
}

btnTimeOut.onclick = function() {
    timeSecond = timeOut.value;
    window.scrollTo(500, 500)
    audio2.play();
    document.documentElement.setAttribute("data-theme", "dark")
    toggleSwitch.checked = true
    audio2.volume = 0.08
    displayTime(timeSecond);
	const countDown = setInterval(() => {
	  timeSecond--;
	  displayTime(timeSecond);
	  if (timeSecond == 0 || timeSecond < 1) {
	    endCount();
	    clearInterval(countDown);
	  }
	}, 1000);

}

function displayTime(second) {
  if (second) {
    const min = Math.floor(second / 60);
    const sec = Math.floor(second % 60);
    timeH.innerHTML = `
    ${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}
    `;
  } else {
    timeH.innerHTML = "Set time out"
  }
  
}

