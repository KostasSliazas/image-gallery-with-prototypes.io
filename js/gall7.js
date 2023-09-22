;(function (global, document) {
  // Image gallery (simple plain JavaScript) using only almost ID's (if you don't like it write for yourself with classe's)

  /**
 * Function appendChild helper
 * @param {...*} e
 */
  const append = function (e) {
    const arrg = arguments
    for (let i = 1; i < arrg.length; i++) e.appendChild(arrg[i])
  }

  /**
 * Function setAttribute helper
 * @param {...*} e
 */
  const atribute = function (e) {
    const arrg = arguments
    for (let i = 1; i < arrg.length; i += 2) e.setAttribute(arrg[i], arrg[i + 1])
  }

  /**
 * Function createElement helper
 * @param {string} e
 */
  const element = function (e) { return document.createElement(e) }

  let _instance = false
  /** @param {string|undefined} [getConfig=null] */
  const ImageGallery = function (getConfig) {
    getConfig = getConfig || ''
    if (_instance) return
    _instance = true
    return new ImageGallery.Init(getConfig)
  }
  // methods
  ImageGallery.prototype = {
    // autoplay method loop
    autoPlayLoop () {
      this.isAutoPlayOn = true
      if (this.showButtons) this.play.className = 'acts7'
      this.timeOut = setTimeout(function () {
        this.right().show()
        if (!this.showButtonsOnPlay) {
          this.left.className = this.rigt.className = this.clos.className = 'hide7'
          if (this.showButtons) this.foot.className = this.onow.className = 'hide7'
        }
        this.indexOfImage === this.imagesArray.length - 1 && this.clear()
      }.bind(this), this.timer)
    },
    // autoplay and image loaded helper to remove class 'loader'
    loadComplete () {
      // remove class spin7 (loader)
      this.insi.className = ''
      // if autoplay is set loop from images
      this.isAutoPlayOn && this.autoPlayLoop()
    },
    // clear method to reset all values
    clear () {
      clearTimeout(this.timeOut)
      this.timeOut = 0
      this.isAutoPlayOn = false
      if (this.showButtons) this.play.className = this.foot.className = this.onow.className = ''
      if (!this.showButtonsOnPlay) this.clos.className = ''
      this.leftRigthBtnsShow()
      return this
    },

    // downloads method
    downloads () {
      const a = element('a') // create link
      // const fileName = this.imgs.src.split('/').pop()// add class active for button animation
      // this.onow.dataset.selected = fileName
      atribute(a, 'rel', 'noreferrer', 'download', this.imgs.src.split('/').pop(), 'href', this.imgs.src, 'target', '_blank')
      a.click()
      a.remove()
    },

    // to left button method loop from images index
    lefts () {
      if (this.indexOfImage > 0) this.indexOfImage--
      else this.indexOfImage = this.imagesArray.length - 1
      return this
    },

    // to right button method loop from images index
    right () {
      if (this.indexOfImage < this.imagesArray.length - 1) this.indexOfImage++
      else this.indexOfImage = 0
      return this
    },

    // function on close
    close () {
      this.clear()
      this.isActive = false
      this.imag.className = 'hide7'
      document.documentElement.style.overflow = 'initial'// back to initial state of overflow
    },

    // Left right buttons show/check method
    leftRigthBtnsShow () {
      this.left.className = this.indexOfImage === 0 ? 'hide7' : ''
      this.rigt.className = this.indexOfImage === this.imagesArray.length - 1 ? 'hide7' : ''
    },

    // show image method to show image when loaded
    show () {
      const index = this.imagesArray[this.indexOfImage]
      const fullName = index.src
      const fileName = fullName.split('/').pop()
      const fullNamePrefixed = fileName.slice(0, -3) === 'svg' ? fullName : fullName.replace(fileName, this.folder + fileName)

      // don't rewrite values if active and set active gallery
      if (!this.isActive) {
        this.isActive = true
        document.documentElement.style.overflow = 'hidden'// hide scrollbar
        this.imag.className = ''
      }

      // if same src return
      if (this.imgs && (this.imgs.src === fullName || this.imgs.src === fullNamePrefixed)) return

      // add spin7 class on show
      this.insi.className = 'spin7'

      // if image exist remove and later recreate it
      this.imgs && this.insi.removeChild(this.imgs)

      // show left right buttons and bottom information (file name and index)
      this.leftRigthBtnsShow()

      // show index and filename
      if (this.showButtons) {
        this.alts.innerText = decodeURI(fileName)
        this.fine.innerText = Number(this.indexOfImage) + 1
      }

      // create new image element
      this.imgs = element('img')

      // set image alt attribute
      atribute(this.imgs, 'alt', index.alt)

      // append image to div
      append(this.insi, this.imgs)

      // image onerror methods
      this.imgs.onerror = function (e) {
        e.target.onerror = null // escape from infinite loop
        e.target.src = fullName // set same img source
      }

      // image onload methods
      this.imgs.onload = this.loadComplete.bind(this)

      // set image src if svg return full name else try to load big image
      this.imgs.src = fullNamePrefixed
    },

    // listen for clicked on image element and load show method
    listenForIG (e) {
      const target = e.target
      if (target.tagName === 'IMG') {
        this.indexOfImage = this.imagesArray.indexOf(target) > -1 ? this.imagesArray.indexOf(target) : 0// set image index on click
        this.show()
        e.stopImmediatePropagation()
      }
    }

  }
  /**
    * Makes an ImageGallery.
    * @constructor
    */
  ImageGallery.Init = function (getConfig) {
    const self = this
    const resource = document.createElement('link')
    resource.setAttribute('rel', 'stylesheet')
    resource.setAttribute('href', 'css/gall7.min.css')
    document.getElementsByTagName('head')[0].appendChild(resource)
    self.folder = getConfig['folder'] || 'big/' // eslint-disable-line
    self.imageContainer = getConfig['imageContainer'] || 'images-container' // eslint-disable-line
    self.timer = typeof getConfig['delaySeconds'] === 'number' && isFinite(getConfig['delaySeconds']) ? getConfig['delaySeconds'] * 1000 : 2000 // eslint-disable-line
    self.showButtonsOnPlay = typeof getConfig['showButtonsOnPlay'] === 'undefined' ? true : !!getConfig['showButtonsOnPlay'] // eslint-disable-line
    self.showButtons = typeof getConfig['showButtons'] === 'undefined' ? true : !!getConfig['showButtons'] // eslint-disable-line
    self.imagesArray = []// all elements array
    self.isAutoPlayOn = false
    self.isActive = false
    self.indexOfImage = 0
    self.timeOut = 0
    self.clos = element('button')
    self.ilef = element('button')
    self.irig = element('button')
    self.imag = element('div')
    self.cent = element('div')
    self.left = element('div')
    self.rigt = element('div')
    self.insi = element('div')
    append(self.cent, self.insi, self.rigt, self.left, self.clos)
    append(self.rigt, self.irig)
    append(self.left, self.ilef)
    append(self.imag, self.cent)
    // a(self.frag, self.imag)
    self.cent.id = 'cent7'
    self.ilef.id = 'ilef7'
    self.irig.id = 'irig7'
    self.clos.id = 'clos7'
    self.rigt.id = 'rigt7'
    self.insi.id = 'insi7'
    self.left.id = 'left7'
    self.imag.id = 'imag7'
    self.imag.className = 'hide7'
    atribute(self.irig, 'aria-label', 'Next')
    atribute(self.ilef, 'aria-label', 'Previous')
    atribute(self.clos, 'aria-label', 'Close', 'title', 'Press Esc to close')
    // append document fragment to <body> if not exists
    append(document.body, self.imag)

    // assign container elements with custom or (default = images-container) class or BODY (default = BODY)
    const container = document.getElementsByClassName(self.imageContainer).length > 0
      ? document.getElementsByClassName(self.imageContainer)
      : document.getElementsByTagName('body')

    const containersArray = []
    for (let l = container.length - 1; l >= 0; l--) containersArray.push(container[l])

    // Loop from elements and add to array
    for (let i = containersArray.length - 1; i >= 0; i--) {
      const img = containersArray[i].getElementsByTagName('img')
      for (let j = 0; j < img.length; j++) self.imagesArray.push(img[j])
    }
    // show download and autoplay buttons if (true = default)
    if (self.showButtons) {
      self.wdow = element('button')
      self.play = element('button')
      self.foot = element('div')
      self.onow = element('div')
      self.alts = element('span')
      self.fine = element('span')
      self.down = element('span')
      append(self.onow, self.alts, self.wdow)
      append(self.imag, self.onow, self.foot)
      append(self.foot, self.play, document.createTextNode(self.imagesArray.length + '['), self.fine, document.createTextNode(']'))
      append(self.wdow, self.down)
      self.alts.id = 'alts7'
      self.play.id = 'play7'
      self.foot.id = 'foot7'
      self.onow.id = 'onow7'
      self.down.id = 'down7'
      self.wdow.id = 'wdow7'
      self.fine.id = 'stat7'
      atribute(self.wdow, 'aria-label', 'Download')
      atribute(self.play, 'aria-label', 'Play')
    }
    if (containersArray[0] && containersArray[0].tagName === 'BODY') document.body.addEventListener('click', function (e) { self.listenForIG(e) })
    else for (let k = containersArray.length - 1; k >= 0; k--) containersArray[k].addEventListener('click', function (e) { self.listenForIG(e) })

    // switching methods
    /** @suppress {missingProperties} */
    const k = {
    'left7': function () { self.clear().lefts().show() }, // eslint-disable-line
    'rigt7': function () { self.clear().right().show() }, // eslint-disable-line
    'clos7': function () { self.close() }, // eslint-disable-line
    'wdow7': function () { self.clear().downloads() }, // eslint-disable-line
    'play7': function () { self.isAutoPlayOn ? self.clear() : self.autoPlayLoop() } // eslint-disable-line
    }
    /** @suppress {missingProperties} */
    /** @suppress {missingProperties} */
  k['ArrowLeft'] = k['left7'] // eslint-disable-line
  k['ArrowRight'] = k['rigt7'] // eslint-disable-line
  k[' '] = k['play7'] // eslint-disable-line
  k['Escape'] = k['clos7'] // eslint-disable-line

    // add click addEventListener to image div (gallery window)
    this.imag.addEventListener('click', e => {
      const id = e.target.id
      if (!k[id]) return self.isAutoPlayOn && self.clear()
      k[id]()
      e.preventDefault()
      e.stopImmediatePropagation()
    })
    // add keyup addEventListener to image div (gallery window)
    global.addEventListener('keyup', e => {
      if (!k[e.key] || !self.isActive || e.isComposing || e.key === 229) return
      k[e.key]()
      e.preventDefault()
      e.stopImmediatePropagation()
    })
    // everything to handle swipe left/right
    // https://code-maven.com/swipe-left-right-vanilla-javascript
    const minHorizontalMove = 30
    const maxVerticalMove = 30
    const withinMs = 1000
    let startXPos
    let startYPos
    let startTime

    function touchStart (event) {
      startXPos = event.touches[0].pageX
      startYPos = event.touches[0].pageY
      startTime = new Date()
    }

    function touchEnd (event) {
      const endXPos = event.changedTouches[0].pageX
      const endYPos = event.changedTouches[0].pageY
      const endTime = new Date()
      const moveX = endXPos - startXPos
      const moveY = endYPos - startYPos
      const elapsedTime = endTime - startTime
      if (Math.abs(moveX) > minHorizontalMove && Math.abs(moveY) < maxVerticalMove && elapsedTime < withinMs) {
        if (moveX < 0) self.clear().right().show()
        else self.clear().lefts().show()
      }
    }
    self.imag.addEventListener('touchstart', touchStart, { passive: true })
    self.imag.addEventListener('touchend', touchEnd)
    // check is loaded to global ImageGallery
  }
  // no need fo new keyword (jQuery trick)
  ImageGallery.Init.prototype = ImageGallery.prototype
  global['ImageGallery'] = {r: ImageGallery} // eslint-disable-line
  // load with defaults
  global.onload = function () {
    if (!_instance) ImageGallery() // eslint-disable-line
  }
}(window, document))
