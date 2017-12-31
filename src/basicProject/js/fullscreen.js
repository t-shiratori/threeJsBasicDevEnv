class FullScreen {
    constructor() {
        this.onViewFullScreenFunc;
        this.onExitFullScreenFunc;
        document.addEventListener('webkitfullscreenchange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('mozfullscreenchange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('MSFullscreenChange', this.onFullScreenChange.bind(this), false);
        document.addEventListener('fullscreenchange', this.onFullScreenChange.bind(this), false);
    }

    toggleFullScreen() {
        if (this.getFullscreenElement()) {
            this.exitFullScreen();
        } else {
            this.viewFullScreen();
        }
    }

    setViewFunc(func) {
      this.onViewFullScreenFunc = func;
    }

    setExitFunc(func) {
      this.onExitFullScreenFunc = func;
    }

    viewFullScreen() {
        if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen()
        } else if (document.webkitFullscreenEnabled) {
            document.documentElement.webkitRequestFullscreen()
        } else if (document.mozFullScreenEnabled) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.msFullscreenEnabled) {
            document.documentElement.msRequestFullscreen();
        }
    }

    exitFullScreen() {
        if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    onFullScreenChange() {
        if (this.getFullscreenElement()) {
            if (typeof this.onViewFullScreenFunc === 'function') {
                this.onViewFullScreenFunc();
            }
        } else {
            if (typeof this.onExitFullScreenFunc === 'function') {
                this.onExitFullScreenFunc();
            }
        }
    }

    getFullscreenElement() {
        if (document.webkitFullscreenElement) {
            return document.webkitFullscreenElement;
        } else if (document.mozFullScreenElement) {
            return document.mozFullScreenElement;
        } else if (document.msFullscreenElement) {
            return document.msFullscreenElement;
        } else if (document.fullscreenElement) {
            return document.fullscreenElement;
        }
    }
}

export default FullScreen;
