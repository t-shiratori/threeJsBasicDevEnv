const getTransitionEndName = function() {
    let el = document.createElement('dummy');
    let result;
    let transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd otransitionend',
        'transition': 'transitionend'
    }
    for (let name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            result = transEndEventNames[name];
        }
    }
    return result;
}

const getRequestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

const triggerEvent = function (el, type) {
    // modern browsers, IE9+
    let e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
}

const getStats = function(outputDom){
    let stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    outputDom.appendChild(stats.domElement);
    return stats;
}

export {
    getTransitionEndName,
    getRequestAnimationFrame,
    triggerEvent,
    getStats
};
