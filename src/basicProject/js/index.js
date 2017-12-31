// リソース
import './assets';

// js モジュール
import Main from './main';
import { getStats } from './utility';
import FullScreen from './fullscreen';

let main,
    stats,
    fullscreen;

function init() {
    stats = getStats(document.getElementById('statsOutput'));
    fullscreen = new FullScreen();
    main = new Main(document.getElementById('WebGL-output'), stats, fullscreen);
    console.log('init')
    main.init();
}

window.onload = init();
