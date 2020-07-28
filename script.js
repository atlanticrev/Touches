class Gestures {

    constructor (touchSurface) {
        this.touchSurface = touchSurface;

        this.touchList = new Map();

        this.startTouchList = new Map();
        this.currTouchList = new Map();

        this.doubleTap = {
            prevTouch: null,
            currTouch: null
        };

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);

        this.touchSurface.addEventListener('touchstart', this.onTouchStart);
        this.touchSurface.addEventListener('touchmove', this.onTouchMove);
        this.touchSurface.addEventListener('touchend', this.onTouchEnd);
        this.touchSurface.addEventListener('touchcancel', this.onTouchCancel);
    }

    onTouchStart (e) {
        this.checkDoubleTap(e);
        for (let touch of e.touches) {
            // const touchObj = this.startTouchList.get(touch.identifier);
            const touchObj = this.touchList.get(touch.identifier);
            if (touchObj && touchObj.startTouch) {
                touchObj.startTouch.x = touch.pageX;
                touchObj.startTouch.y = touch.pageX;
            } else {             
                this.touchList.set(touch.identifier, {
                    startTouch: {
                        x: touch.pageX,
                        y: touch.pageY
                    }
                });
            }
            console.log(`Start [${touch.identifier}]:`, this.touchList.get(touch.identifier).startTouch);
        }
    }

    onTouchMove (e) {
        for (let touch of e.changedTouches) {
            const touchObj = this.touchList.get(touch.identifier);
            if (touchObj && touchObj.currTouch) {
                touchObj.currTouch.x = touch.pageX;
                touchObj.currTouch.y = touch.pageY;
            } else {              
                touchObj.currTouch = {
                    x: touch.pageX,
                    y: touch.pageY
                };
            }
            console.log(`Move [${touch.identifier}]:`, this.touchList.get(touch.identifier).currTouch);
        }
    }

    onTouchEnd (e) {
        // for (let touch of e.changedTouches) {
        //     const touchForDelete = this.currTouchList.get(touch.identifier);
        //     if (touchForDelete) {
        //         console.log(`Deleting... [${touch.identifier}]:`, this.currTouchList.get(touch.identifier));
        //         this.currTouchList.delete(touch.identifier);
        //         if (this.currTouchList.size === 1) {
        //             // @todo
        //         } else if (this.currTouchList.size === 0) {
        //             // @todo
        //         }
        //     }
        // }
    }

    onTouchCancel (e) {
        // console.log('cancel:', e);
    }

    checkDoubleTap (e) {
        if (Object.values(e.touches).length > 1) {
            return;
        }
        if (!this.doubleTap.prevTouch) {
            this.doubleTap.prevTouch = Object.assign(e.touches[0], {timestamp: Date.now()});
        } else {
            this.doubleTap.currTouch = Object.assign(e.touches[0], {timestamp: Date.now()});
            console.log(this.doubleTap.currTouch.timestamp - this.doubleTap.prevTouch.timestamp);
            if ((this.doubleTap.currTouch.timestamp - this.doubleTap.prevTouch.timestamp) <= 150) {
                console.log('double tap');
            }
            this.doubleTap.prevTouch = null;
        }
    }

}

const gestures = new Gestures(document.querySelector('.box'));