const {app, BrowserWindow, Tray, Menu} = require('electron');
/*
 * RadioManager admins listening radios
 * Construct template menu.
 * Can play and stop any of the managed radio instances.
 */
class RadioManager {
   // Singleton instance
   static _singleton_instance= null
  /*
   * This construct and inicialize the Manager Instance.
   */
  constructor(main_window, app_tray, main_icon_path) {
    this.main_window = main_window
    this.main_icon_path = main_icon_path
    this.app_tray = app_tray
    this.radios = new Array()
    this.playing = null
    this.player = null
    RadioManager._singleton_instance = this
    this.setIcons(this.main_icon_path)
  }
  /*
   * Static method to obtain singleton instances, or create it whe is needed.
   */
  static getInstance(main_window, app_tray, main_icon_path){
    if (RadioManager._singleton_instance)
      return RadioManager._singleton_instance
    return new RadioManager(main_window, app_tray, main_icon_path)
  }
  /*
   * Add a Radio to radio managed instances
   */
  add (radio) {
    const rm = RadioManager.getInstance()
    rm.radios.push(radio)
  }
  /*
   * Set an icon on player window and sys tray
   * This icon may show your now playing radio
   */
  setIcons(imagen) {
    const rm = RadioManager.getInstance()
    rm.app_tray.setImage(imagen)
    rm.main_window.setIcon(imagen)
  }
  /*
   * Register now playing radio
   */
  setPlaying(radio) {
      const rm = RadioManager.getInstance()
      rm.playing = radio
      rm.setIcons(radio.icon)
      rm.player.minimize()
  }
  /*
   * Play a particular Radio, by its name.
   */
  play (key) {
    const rm = RadioManager.getInstance()
    if (rm.player!=null) {
      rm.stop() // stop any other radio
      if (rm.playing.nombre == key) {
        rm.playing = null // Radio is same that actual, return (stop listening)
        return
      }
    }
    rm.player = new BrowserWindow({ width: 350, height: 620 })
    for (let radio of rm.radios) {
          if (radio.nombre == key) {
            radio.play(rm.player)
            rm.setPlaying(radio)
          }
    }
  }
  /*
   * Stop player (Destroy it!)
   */
  stop () {
      const rm = RadioManager.getInstance()
      rm.player.destroy()
      rm.player = null
      rm.setIcons("img/radio_icon.png")
  }
  /*
   * Construct the context menu template for sys tray
   */
  getTemplate() {
    let menu_items = new Array()
    const rm = RadioManager.getInstance()
    for (let radio of this.radios) {
      menu_items.push({
        label: radio.nombre,
        click: function() {
          console.log(radio.nombre)
          rm.play(radio.nombre)
        }
      })
    }
    return menu_items
  }
}
/*
 * Any Radio must provide its name, url and icon/logo
 */
class Radio {
  constructor(url, nombre, icon) {
    this.url = url
    this.nombre = nombre
    this.icon = icon
  }
}
/*
 * This kind of Radio has its own player window on internet
 */
class RadioPlayerOnPage extends Radio {
  constructor(url, nombre, icon) {
    super(url, nombre, icon)
  }
  play (player) {
      player.loadURL(this.url)
  }
}
/*
 * This kind of Radio has its own src streaming that can be played
 * in a local and lightweight player
 */
class RadioPlayerOnSrc extends Radio {
  constructor(url, nombre, icon) {
    super(url, nombre, icon)
  }
  play (player) {
      player.loadFile(this.url)
  }
}

module.exports = {Radio, RadioManager, RadioPlayerOnSrc, RadioPlayerOnPage}
