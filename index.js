// ====================== IMPORT TRANSLATE JS FILE ====================== //
import dataLangRuEn from './translate.js'
// ====================== COMMENT FOR CHECK REVIEW ====================== //
console.log(`
  Оценка за задание: 75 баллов.
  1. Смена изображений в секции portfolio +25
  2. Перевод страницы на два языка +25
  3. Переключение светлой и тёмной темы +25
  4. Дополнительный функционал: выбранный пользователем язык отображения страницы и светлая или тёмная тема сохраняются при перезагрузке страницы +5
  5. Дополнительный функционал: сложные эффекты для кнопок при наведении и/или клике +5
`)
// ====================== WHEN DOM CONTENT LOADED START SCRIPT ====================== //
window.addEventListener('DOMContentLoaded', () => {
  
  // ====================== BURGER ====================== //
  const body = document.querySelector('body');
  const burger = document.querySelector('#hamburger');
  const nav = document.querySelector('.navigation');
  // Toggle menu
  burger.addEventListener('click', (e) => {
    burger.classList.toggle('is-active')
    nav.classList.toggle('is-active')
    body.classList.toggle('lock')
  })
  // Remove menu if click menu items
  function closeMenu(event) {
    if (event.target.classList.contains('nav__link')) {
      nav.classList.remove('is-active')
      burger.classList.remove('is-active')
      body.classList.remove('lock')
    }
  }
  nav.addEventListener('click', closeMenu);

  // ====================== ANIMATE BUTTONS ====================== //
  const allButtonsTags = document.querySelectorAll('button');

  // Animate buttons when hover it
  function animWhenHoverkBtn (e) {
    const btn = e.target
    const x = e.pageX - btn.offsetLeft
    const y = e.pageY - btn.offsetTop

    btn.style.setProperty('--x', x + 'px')
    btn.style.setProperty('--y', y + 'px')
  }

  // Iterate all button and add listener mousemove for hover
  allButtonsTags.forEach(btn => {
    btn.addEventListener('mousemove', (event) => {
      animWhenHoverkBtn(event)
    })    
  })
  
  // ====================== FILTERS FOR PORTFOLIO SECTION ====================== //
  const seasons = ['winter', 'spring', 'summer', 'autumn'];
  const parentOffilterBtns = document.querySelector('.portfolio__filters'),
        portfolioImages = document.querySelectorAll('.portfolio__img'),
        filterBtns = document.querySelectorAll('.button-type-outline');

  // When click filter button get all images of the season
  function changeImage(selected) {
    if (selected) {
      const season = selected
      portfolioImages.forEach((img, index) => {
        img.src = `./assets/img/${season}/${index + 1}.jpg`
      });
      addStyleActiveBtn(selected)
    }
  }

  // When click filter button, assign active class style the button
  function addStyleActiveBtn(selected) {
    if (selected) {
      filterBtns.forEach(btn => {
        if (btn.dataset.season !== selected) {
          btn.classList.remove('button-type-outline--active')
        } else {
          btn.classList.add('button-type-outline--active')
        }
      })
    }
  }
  // Get all images in cache
  function preloadImages(season) {
    for(let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `./assets/img/${season}/${i}.jpg`;
    }
  }

  // Get selected season for images
  const selectedSeason = localStorage.getItem('filter-season')

  // Set the season if user choised it
  if (selectedSeason) {
    changeImage(selectedSeason)
  }

  // Add listener only for parent of fillter btns, and call changeImage function for the current btn
  parentOffilterBtns.addEventListener('click', (e) => {
    const currBtnSeason = e.target.dataset.season
    changeImage(currBtnSeason);
    localStorage.setItem('filter-season', currBtnSeason)
  })
  // Iterate seasons array and put every season on argument for preloadImages func
  seasons.forEach(season => preloadImages(season))
  
  // ====================== TOGGLE LANGUAGES ====================== //
  const langBtns = document.querySelector('.lang'),
        allContentText = document.querySelectorAll('[data-lang]'),
        navLinkLang = document.querySelectorAll('.nav__link-lang');

  // Check if data-attributes equal the data language keys, than assign the data language values to data-attributes      
  function getTranslate(language) {
    allContentText.forEach(currEelem => {
      let currEelemDataAttr = currEelem.dataset.lang
      
      if (dataLangRuEn[language][currEelemDataAttr]) {
        currEelem.textContent = dataLangRuEn[language][currEelemDataAttr]
      }

      if (currEelem.placeholder) {
        currEelem.placeholder = dataLangRuEn[language][currEelemDataAttr]
        currEelem.textContent = ''
      }

    })
  }

  // Get selected language and active btn from localStorage
  const selectedLanguage = localStorage.getItem('language');
  const selectedLanguageBtn = localStorage.getItem('active-language-btn')

  // Set in the page the values if in localStorage has the language values
  if (selectedLanguage) {
    getTranslate(selectedLanguage)
  }
  if (selectedLanguageBtn === 'ru') {
    navLinkLang[1].classList.add('nav__link-lang--active')
    navLinkLang[0].classList.remove('nav__link-lang--active')
  } else {
    navLinkLang[0].classList.add('nav__link-lang--active')
    navLinkLang[1].classList.remove('nav__link-lang--active')
  }

  // Toggle language and active butn. Set in localStorage the user choice
  langBtns.addEventListener('click', (e) => {
    let currLanguage = e.target.dataset.lang
    let currBtn = e.target

    if (currLanguage) {  
      navLinkLang.forEach(link => {
        link.classList.remove('nav__link-lang--active')
        currBtn.classList.add('nav__link-lang--active')
      })
  
      getTranslate(currLanguage)
      localStorage.setItem('language', currLanguage);
      localStorage.setItem('active-language-btn', currBtn.getAttribute(['data-lang']))
    }

  })

  // ====================== CHANGE THEME ====================== //
  const themeButton = document.querySelector('.theme-btn'),
        svgUse = document.querySelector('.theme-btn use'),
        darkPath = './assets/svg/sprite.svg#dark',
        lightPath = './assets/svg/sprite.svg#light',
        svgHref = 'xlink:href',
        darkTheme = 'light-theme';

  // svgUse.setAttribute('xlink:href', darkPath)
  const getAttr = (elem, attr) => { return elem.getAttribute(attr) }
  const setAttr = (elem, attr, path) => { return elem.setAttribute(attr, path) }

  // Previously selected topic (if user selected)
  const selectedTheme = localStorage.getItem('selected-theme'); // light
  const selectedIcon = localStorage.getItem('selected-icon'); // light

  // We obtain the current theme that the interface has by validating the dark-theme class
  const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'light' : 'dark';
  const getCurrentIcon = () => getAttr(svgUse, svgHref) === darkPath ? darkPath : lightPath; 
  
  // We validate if the user previously chose a topic
  if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](darkTheme);
    setAttr(svgUse, svgHref,`${selectedIcon}`)
  }
  // Activate / deactivate the theme manually with the button
  themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme

    document.body.classList.toggle(darkTheme);
    if (getAttr(svgUse, svgHref) === darkPath) {
      setAttr(svgUse, svgHref,`${lightPath}`)
    } else {
      setAttr(svgUse, svgHref,`${darkPath}`)
    }
    
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
  });
  
  // ====================== VIDEO PLAYER ====================== //
  const openVideoPopup = document.querySelector('.video__btn'),
        player = document.querySelector('.player'),
        video = document.querySelector('video'), 
        progressWrapper = document.querySelector('.player__progress'),
        progressBar = document.querySelector('.player__progress-bar'),
        playBtn = document.querySelector('.player__play-btn'),
        playVideoBtnCenter = document.querySelector('.player__play-video-btn'),
        volumeIcon = document.querySelector('.player__volume-btn'),
        volumeLine = document.querySelector('.player__volume-line'),
        volumeBar = document.querySelector('.player__volume-bar'),
        speed = document.querySelector('.player__speed-select'),
        currentVideoTime = document.querySelector('.player__time-elapsed'),
        durationVideoTime = document.querySelector('.player__time-duration'),
        fullscreenBtn = document.querySelector('.player__fullscreen'),
        closeVideoPopupIcon = document.querySelector('.player__close'),
        overlay = document.querySelector('.video__overlay')

  // ====================== Functions ====================== //
  // Close popup function
  const hideVideoPopup = () => {
    overlay.classList.remove('video__overlay--active')
    player.classList.remove('player--active')
    body.classList.remove('lock')
  }
  
  // Start video
  const startVideo = () => {
    if (video.paused) {
      video.play()
      playBtn.classList.add('player__play-btn--pause')
      playBtn.setAttribute('title', 'Pause')
      playVideoBtnCenter.classList.add('player__play-video-btn--hidden')
    }
  }
  
  // Pause video
  const pauseVideo = () => {
    if (!video.paused) {
      video.pause()
      playBtn.classList.remove('player__play-btn--pause')
      playBtn.setAttribute('title', 'Play')
      playVideoBtnCenter.classList.remove('player__play-video-btn--hidden')
    }
  }

  // Get time for min and sec
  const showTime = (time) => {
    let min = Math.floor(time / 60) 
    let sec = Math.floor(time % 60)
    sec = sec > 9 ? sec : `0${sec}`
    return `${min}:${sec}`
  }

  // Change time value and progress for video
  const progressWrapperUpdate = () => {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`
    currentVideoTime.textContent = `${showTime(video.currentTime)} /`
    durationVideoTime.textContent = ` ${showTime(video.duration)}`;
  }

  // Progress bar time
  const progressTimeLine = (e) => {
    const newTime = e.offsetX / progressWrapper.offsetWidth
    progressBar.style.width = `${newTime * 100}%`
    video.currentTime = newTime * video.duration
  }

  // Chage volume icon if it zero
  const changeVolumeIcon = () => {
    if (video.volume <= 0.1 && parseInt(volumeBar.style.width) === 0) {
      volumeIcon.classList.add('player__volume-btn--mute')
    } else {
      volumeIcon.classList.remove('player__volume-btn--mute')
    }
  }

  // Sound volume 
  const changeVolume = (e) => {
    let volume = e.offsetX /  volumeLine.offsetWidth

    if (volume < 0.1) {
      volume = 0
    }
    if (volume > 0.9) {
      volume = 1
    }
    volumeBar.style.width = `${volume * 100}%`
    video.volume = volume 
    changeVolumeIcon()
  }

  // If volume > 0 set mute, or set the prev value 
  volumeBar.style.width = `${video.volume * 100}%`
  let volumeMute = video.volume
  const setVolumeMute = () => {
    if (video.volume) {
      volumeMute = video.volume
      volumeBar.style.width = 0
      video.volume = 0
      changeVolumeIcon()
    } else {
      volumeBar.style.width = `${volumeMute * 100}%`
      changeVolumeIcon()
      video.volume = volumeMute
    }
  }
  // Chage video speed
  const changeSpeed = () => {
    video.playbackRate = speed.value 
  }

  // ====================== Event listneres ====================== //
  // Open video popup
  openVideoPopup.addEventListener('click', () => {
    overlay.classList.add('video__overlay--active')
    player.classList.add('player--active')
    body.classList.add('lock')
  })

  // Close video popup
  overlay.addEventListener('click', () => {
    hideVideoPopup()
    pauseVideo()
  })
  closeVideoPopupIcon.addEventListener('click', () => {
    hideVideoPopup()
    pauseVideo()
  })

  // Start video or pause when click on play button
  playBtn.addEventListener('click', (e) => {
    let currBtn = e.target
    if (!currBtn.classList.contains('player__play-btn--pause')) {
      startVideo()
    } else {
      pauseVideo()
    }
  })

  // Start or pause video when click on video popup
  video.addEventListener('click', (e) => {
    let currBtn = e.target
    let getBtnElement = currBtn.closest('.player > .player__video-inner').nextElementSibling.firstElementChild.firstElementChild

    if (!getBtnElement.classList.contains('player__play-btn--pause')) {
      startVideo()
    } else {
      pauseVideo()
    }
  })

  // Start or pause video with space keyboard
  document.addEventListener('keydown', (e) => {
    if (player.classList.contains('player--active')) {
      if (e.keyCode === 32) {
        if (video.paused) {
          startVideo()
        } else {
          pauseVideo()
        }
      } 
    }
  })

  // Change icon from pause to play when video ended
  video.addEventListener('ended', () => {
    playBtn.classList.remove('player__play-btn--pause')
  })

  // Update time for video
  video.addEventListener('timeupdate', progressWrapperUpdate)
  video.addEventListener('canplay', progressWrapperUpdate)

  // Change time and progress when click on porgress bar
  progressWrapper.addEventListener('click', progressTimeLine)
  
  // Change volume when click on line
  volumeLine.addEventListener('click', changeVolume)

  // Set volume mute when click on volume icon
  volumeIcon.addEventListener('click', setVolumeMute)

  // Change video speed
  speed.addEventListener('change', changeSpeed)

  // Make fullscreen
  fullscreenBtn.addEventListener('click', () => {
    video.requestFullscreen();
  })

})
