const {app, BrowserWindow, Tray, Menu} = require('electron');
const {Radio, RadioManager, RadioPlayerOnSrc, RadioPlayerOnPage} = require("./lib/radio.js")
const path = require('path');
const url = require('url');
const main_icon_path = path.join(__dirname, 'img/radio_icon.png')

// Main variables
var main_window = null
var app_tray = null
var contextMenu = null
var rm = null

/*
 * This function is called during init process.
 * Construct the main window and the app icon on tray.
 * Set radios instances
 */
function player_init(){
  app_tray = new Tray (main_icon_path)
  main_window = new BrowserWindow({ width: 350, height: 620 })
  main_window.minimize()
  rm = RadioManager.getInstance(main_window,app_tray, main_icon_path)
  // Add radio instances
  rm.add(new RadioPlayerOnPage('https://futurock.mdstrm.com/', 'futurock', 'img/futurock_icon.png'))
  rm.add(new RadioPlayerOnPage('http://streaminglocucionar.com/portal/?p=12688', 'lu20', 'img/lu20_icon.png'))
  rm.add(new RadioPlayerOnPage('https://youtu.be/uejNrkUnTpY', 'Radop 3 Trelew', 'img/Radio3Tw_icon.png'))
  rm.add(new RadioPlayerOnSrc('html/citrica.html', 'citrica', 'img/citrica_icon.png'))
  rm.add(new RadioPlayerOnPage('http://es.streema.com/radios/play/Radio_Del_Plata', 'Del Plata', 'img/delplata_icon.png'))
  rm.add(new RadioPlayerOnPage('http://es.streema.com/radios/play/Radio', 'Radio 10', 'img/R10_icon.png'))
  rm.add(new RadioPlayerOnPage('http://es.streema.com/radios/play/LR11_Radio_Universidad_FM', 'Radio Univerdidad LP', 'img/radio_universidad_lp_icon.png'))
  rm.add(new RadioPlayerOnPage('http://es.streema.com/radios/play/La_Patriada_FM', 'La patriada FM', 'img/lapatriada_icon.png'))
  rm.add(new RadioPlayerOnPage('http://es.streema.com/radios/play/FM_Zonica_105.9', 'Radio Zonica', 'img/zonica_icon.png'))
}

/*
 * This init function run when app is ready to go.
 * Construct init player and menus.
 */
function init() {
  player_init()
  contextMenu = Menu.buildFromTemplate(rm.getTemplate())
  app_tray.setContextMenu(contextMenu)
}

app.whenReady().then(init)
