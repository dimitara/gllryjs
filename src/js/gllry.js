(function(){
    var DEFAULT_TEXT = 'Close';
    var ANIMATION_CLASS = 'fade';
//    ANIMATION_CLASS = 'slide';

    ANIMATION_BACK = 'gllry-back';
    ANIMATION_FWD = 'gllry-fwd';

    function Gllry(id, options){
        var self = this;

        this.touchstart = 'ontouchstart' in window ? 'touchstart' : 'click';
        this.touchend = 'ontouchend' in window ? 'touchend' : 'click';
        this.current = 0;
        this.next = 1;
        this.max = void 0;
        this.options = options;
        this.gllry = document.getElementById(id);
        this.gllry.classList.add('gllry');
        this.breadcrumbs = void 0;

        this.items = this.gllry.querySelectorAll('li');
        this.images = this.gllry.querySelectorAll('img');
        this.gllry.querySelector('ul').classList.add('size');

        this.max = this.items.length;

        if(options.fullscreen){
            this.gllry.classList.add('fullscreen');
        }

        if(options.breadcrumbs){
            this.setBreadcrumbs();
        }

        if(options.headings){
            this.setHeading();
        }

        this.setCurrent();

        if(options.autoPlay){
            this.autoPlay();
        }

        if(options.action){
            this.setAction();
        }

        if(this.options.nav_buttons){
            this.setNavButtons();
        }

        var touchstartPos = null;
        this.gllry.addEventListener(this.touchstart, function(e){
            touchstartPos = e.touches ? e.touches[0].clientX: e.clientX;
        });
        /*
        this.gllry.addEventListener(this.touchend, function(e){
            touchEndPos = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            if(touchEndPos <= touchstartPos){
                self.goNext();
            }
            else{
                self.goPrev();
            }
        });
*/
    }

    Gllry.prototype.go = function(current){
        var dir = -1;
        current = parseInt(current);

        if(current > this.current){
            dir = +1;
        }

        this.current = current;
        if(this.current === this.max){
            this.current = 0;
        }

        if(this.current < 0){
            this.current = this.max-1;
        }

        this.next = this.current + 1;
        if(this.next === this.max){
            this.next = 0;
        }

        this.setCurrent();
    }

    Gllry.prototype.goNext = function(){
        this.current++;
        if(this.current === this.max){
            this.current = 0;
        }

        this.next = this.current;
        if(this.next === this.max){
            this.next = 0;
        }

        if(this.gllry.querySelector('.gllry-next')){ this.gllry.querySelector('.gllry-next').classList.remove('gllry-next');}
        if(this.items[this.next]){
            this.items[this.next].classList.add('gllry-next');
        }
        
        if(this.options.animate){
            this.animate(false);
        }
        else{
            this.setCurrent();
        }
    };

    Gllry.prototype.goPrev = function(){
        this.current--;
        if(this.current < 0){
            this.current = this.max-1;
        }

        this.next = this.current;
        if(this.next < 0){
            this.next = this.max-1;
        }

        if(this.gllry.querySelector('.gllry-next')){ this.gllry.querySelector('.gllry-next').classList.remove('gllry-next');}
        if(this.items[this.next]){
            this.items[this.next].classList.add('gllry-next');
        }

        if(this.options.animate){
            this.animate(true);
        }
        else{
            this.setCurrent();
        }
    };

    Gllry.prototype.setBreadcrumbs = function(){
        var self = this;

        this.breadcrumbs = document.createElement('ul');
        this.breadcrumbs.classList.add('breadcrumbs');
        this.breadcrumbs.classList.add(this.options.breadcrumbs.position);
        for(var i=0; i<this.images.length; i++){
            var li = document.createElement('li');
            li.setAttribute('data-index', i);
            this.breadcrumbs.appendChild(li);
        }

        this.gllry.appendChild(this.breadcrumbs);

        this.breadcrumbs.addEventListener('click', function(e){
            var index = e.target.getAttribute('data-index');

            if(index !== void 0 && index !== null){
                //self.go(index);
            }
        });
    };

    Gllry.prototype.setNavButtons = function(){
        var _this = this;

        this.nav_buttons = document.createElement('ul');
        this.nav_buttons.classList.add('nav_buttons');

        this.nav_buttons.addEventListener(this.touchend, function(e){
            if(e.target.classList.contains('gllry-fwd')){
                _this.goNext();
            }
            else{
                _this.goPrev();   
            }
        });

        var liBack = document.createElement('li');
        liBack.classList.add('gllry-back');
        this.nav_buttons.appendChild(liBack);

        var liFwd = document.createElement('li');
        liFwd.classList.add('gllry-fwd');
        this.nav_buttons.appendChild(liFwd);

        this.gllry.appendChild(this.nav_buttons);
    };

    Gllry.prototype.setHeading = function(){
        this.heading = document.createElement('span');
        this.heading.classList.add('heading');

        this.gllry.appendChild(this.heading);
    };

    Gllry.prototype.animate = function(fwd){
        var self = this;
        
        var currentItem = this.gllry.querySelector('.current');
        if(currentItem){
            currentItem.addEventListener('webkittransitionend', function fn(){
                self.setCurrent();
                currentItem.classList.remove(ANIMATION_CLASS);
                currentItem.classList.remove(ANIMATION_BACK);
                currentItem.classList.remove(ANIMATION_FWD);
                currentItem.removeEventListener('webkittransitionend', fn);
            });

            currentItem.addEventListener('transitionend', function fn(){
                self.setCurrent();
                currentItem.classList.remove(ANIMATION_CLASS);
                currentItem.classList.remove(ANIMATION_BACK);
                currentItem.classList.remove(ANIMATION_FWD);

                currentItem.removeEventListener('transitionend', fn);
            });
            currentItem.classList.add(ANIMATION_CLASS);
            
            if(fwd){
                currentItem.classList.add(ANIMATION_FWD);
            }
            else{
                currentItem.classList.add(ANIMATION_BACK);
            }
        }
    };

    Gllry.prototype.setCurrent = function(){
        var self = this;

        if(this.gllry.querySelector('.current')){ this.gllry.querySelector('.current').classList.remove('current');}
        if(this.gllry.querySelector('.gllry-next')){ this.gllry.querySelector('.gllry-next').classList.remove('gllry-next');}
        if(this.breadcrumbs.querySelector('.current')) this.breadcrumbs.querySelector('.current').classList.remove('current');
        if(this.actionButton) this.actionButton.classList.remove('show');

        if(this.items[this.current]){
            this.items[this.current].classList.add('current');
        }

        if(this.items[this.next]){
            this.items[this.next].classList.add('gllry-next');
        }

        this.breadcrumbs.children[this.current].classList.add('current');

        if(this.heading){
            this.heading.innerHTML = this.items[this.current].querySelector('img').getAttribute('alt');
        }

        if(this.options.action){
            setTimeout(function(){
                self.actionButton.classList.add('show');
            }, this.options.action.timeout || 0);
        }

        if(this.options.autoPlay){
            this.autoPlay();
        }
    };

    Gllry.prototype.setAction = function(){
        this.actionButton = document.createElement('button');

        this.actionButton.innerHTML = this.options.action.text || DEFAULT_TEXT;
        this.actionButton.addEventListener('click', this.options.action.callback);
        this.actionButton.classList.add('action');

        if(this.options.action.position){
            this.actionButton.classList.add(this.options.action.position);
        }

        this.gllry.appendChild(this.actionButton);
    };

    Gllry.prototype.autoPlay = function(){
        var self = this;
        clearTimeout(this.interval);
        this.interval = null;

        this.interval = setTimeout(function(){
            self.goNext();
        }, this.options.autoPlay);
    };

    Gllry.prototype.fullscreen = function(){
        this.gllry.classList.toggle('fullscreen');
    };

    Gllry.prototype.hide = function(){
        this.gllry.classList.add('hidden');
    };

    Gllry.prototype.show = function(){
        this.gllry.classList.remove('hidden');
    };

    window.Gllry = Gllry;
}());