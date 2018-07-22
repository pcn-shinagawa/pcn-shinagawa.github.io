(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/**
 * Recruit Holdings common script.
 * @param  {[Object]} exports Window object.
 * @param  {[Object]} $       jQuery.
 */
(function(exports, $) {

  "use strict";

  var Header = require('./modules/header')
    , EqualHeights = require('./modules/equal_heights')
    , ConvertDropdown = require('./modules/convert_dropdown')
    , ConvertAnchorToDropdown = require('./modules/convert_anchor_to_dropdown')
    , Map = require('./modules/map')
    , Development = require('./modules/development')
    , FixAnchor = require('./modules/fix_anchor')
    , IndexYears = require('./modules/index_years')
    , AnotherPageAnchor = require('./modules/another_page_anchor')
    , Execute = require('./modules/execute')
    , TopMedia = require('./modules/top_media')
    , TopSlideShow = require('./modules/top_slide_show')
    , ReplaceBackground = require('./modules/replace_background')
    , ReplaceImageSrc = require('./modules/replace_image_src')
    , DiversityAccordion = require('./modules/diversity_accordion')
    , Tel = require('./modules/tel')
    , NewsLink = require('./modules/news_link')
    , LocalNewsFilter = require('./modules/local_news_filter')
    , SocialButton = require('./modules/social_button');

  /**
   * @module Common.
   */
  var Common = {

    /**
     * DOMContent loaded.
     */
    render: function() {
    	var self = this;

      self.execute = new Execute();
      self.header = new Header();
      self.convertDropdown = new ConvertDropdown();
      self.map = new Map();
      self.fixAnchor = new FixAnchor();
      self.anotherPageAnchor = new AnotherPageAnchor();
      self.topMedia = new TopMedia();
      self.topSlideShow = new TopSlideShow();
      self.replaceBackground = new ReplaceBackground();
      self.replaceImageSrc = new ReplaceImageSrc();
      self.diversityAccordion = new DiversityAccordion();
      self.tel = new Tel();
      self.newsLink = new NewsLink();
      self.localNewsFilter = new LocalNewsFilter();
      self.socialButton = new SocialButton();
    },

    /**
     * Window on loaded.
     */
    load: function() {
    	var self = this;

      self.equalHeights = new EqualHeights();
      self.indexYears = new IndexYears();
      self.convertAnchorToDropdown = new ConvertAnchorToDropdown();
      self.development = new Development();
    }
  };


  $(document).on('ready', Common.render.apply(Common));
  $(window).on('load', Common.load.apply(Common));

}(
  window,
  window.jQuery
));

},{"./modules/another_page_anchor":2,"./modules/convert_anchor_to_dropdown":3,"./modules/convert_dropdown":4,"./modules/development":5,"./modules/diversity_accordion":6,"./modules/equal_heights":7,"./modules/execute":8,"./modules/fix_anchor":9,"./modules/header":10,"./modules/index_years":11,"./modules/local_news_filter":12,"./modules/map":13,"./modules/news_link":15,"./modules/replace_background":16,"./modules/replace_image_src":17,"./modules/social_button":18,"./modules/tel":19,"./modules/top_media":20,"./modules/top_slide_show":21}],2:[function(require,module,exports){
/**
 * Another page anchor function.
 */
var AnotherPageAnchor = function() {
  this.init();
};

AnotherPageAnchor.prototype = {

  MAX_WIDTH: '(max-width: 800px)',

  init: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.param = self.getParam();
    if(!self.param) return;

    self.transition();
  },

  getParam: function() {
    var self = this
      , url = location.href
      , parameters = url.split('?')
      , params = (parameters.length > 1) ? parameters[1].split('&') : false;

    if(!params) return false;

    for (var i = 0; i < params.length; i++) {
      var paramItem = params[i];

      if(paramItem.match(/id=/i)) {
        return paramItem.replace('id=', '');
      }
    };

  },

  transition: function() {
    var self = this
      , $header = $('#header')
      , $fixAnchor = $('#fixAnchor')
      , $target = $('#' + self.param)
      , targetPos
      , adjustH;

    if(self.isMobile) {
      adjustH = $header.height();
    } else {
      adjustH = ($fixAnchor.length > 0) ? $fixAnchor.height() : 0
    }

    targetPos = $target.offset().top - adjustH;

    $('html, body').scrollTop(targetPos);
  }

};

module.exports = AnotherPageAnchor;

},{}],3:[function(require,module,exports){
/**
 * Convert anchor to dropdown function.
 */
var ConvertAnchorToDropdown = function() {
  this.init();
};

ConvertAnchorToDropdown.prototype = {

  MOVE_SPEED: 300,
  FADE_SPEED: 500,
  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.$el = $('#convertAnchorToDropdown');
    if(self.$el.length === 0) return;

    self.setParam();
    self.bindEvent();
    self.updateHandle();
    self.setDropboxHeight();
    self.contentsUpdate();
  },

  setParam: function() {
    var self = this;

    self.$handle = self.$el.find('.js-handle');
    self.$handleItem = self.$handle.find('a');
    self.$ddWrap = self.$el.find('.js-dropdownWrap');
    self.$inner = self.$el.find('.js-inner');
    self.$ddTrigger = self.$el.find('.js-dropdownTrigger')
    self.$contentsWrap = self.$el.find('.js-contentWrap');
    self.$contents = self.$el.find('.js-content');
    self.$links = self.$handle.find('a');
    self.$header = $('#header');
    self.$body = $('body');
    self.$win = $(window);

    self.isOperating = false;
    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.isDevelopment = (self.$el.data('cat') === 'development') ? true : false;
    self.prevMedia = self.isMobile;
    self.headerH = self.$header.height();
    self.elH = self.$ddWrap.height();
    self.bodyH = self.$body.height();
    self.linksLength = self.$links.length;

    self.targetId = self.$handle.find('li').filter('.is-current').find('a').data('target');
    self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');

    self.option = {
      speed : 1000,
      easing : 'easeInOutQuad'
    };
  },

  bindEvent: function() {
    var self = this;

    self.$win
      .on('scroll', function() {
        self.bodyH = self.$body.height();
        self.updateState();
        self.updatePos();
      });

    self.$links
      .on('click', function(event) {
        event.preventDefault();

        self.targetId = $(this).data('target');
        self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');

        if(self.isMobile) {
          self.contentsUpdate();
          self.onTrigger();
        } else {
          self.onAnchorMove(this);
        }
      });

    self.$ddTrigger
      .on('click', 'a', function(event) {
        event.preventDefault();
        self.onTrigger();
      });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });
  },

  /**
   *  スクロール位置でナビの状態を変更する
   */
  updateState: function() {
    var self = this
      , fixPos = self.$ddWrap.offset().top;

    self.scrollTop = self.$win.scrollTop();

    if(fixPos < self.scrollTop && !self.isMobile) {
      self.isfixed = true;
      self.$ddWrap
        .addClass('is-fixed')
        .height(self.elH);
    } else {
      if(!self.isfixed) return;
      self.isfixed = false;
      self.$ddWrap
        .removeClass('is-fixed')
        .removeAttr('style');
    }

    self.updateCurrent();
  },

  /**
   * 横スクロール発生時にナビの位置を調整する
   */
  updatePos: function() {
    var self = this
      , scrollLeft = self.isfixed ? self.$win.scrollLeft() : 0;

    if (self.isMobile) return;

    self.$inner.css('left', -scrollLeft);
  },

  /**
   * [SP] コンテンツ選択したコンテンツに更新
   */
  contentsUpdate: function() {
    var self = this;

    if(!self.isMobile) return;
    self.$targetContent = $('#' + self.targetId);

    self.setContentHeight();

    self.$contents
      .filter(function() {
        return $(this).attr('id') !== self.targetId;
      })
      .velocity({
        opacity: 0
      }, self.FADE_SPEED, function() {
        $(this).css('display', 'none');
      });

    self.$targetContent
      .css({
        display: 'block',
        opacity: 0
      })
      .velocity({
        opacity: 1
      }, self.FADE_SPEED);

    self.updateHandle();
    self.updateTrigger();
  },

  /**
   * [SP] ラッパーの高さを調整
   */
  setContentHeight: function() {
    var self = this;

    if(self.isDevelopment) return;

    self.$contentsWrap
      .stop(true, false)
      .velocity({
        height: self.$targetContent.outerHeight()
      }, 500, 'easeInOutSine');
  },

  /**
   * [PC] アンカー位置までスムーススクロールする
   * @param  {object} el クリックした対象
   */
  onAnchorMove: function(el) {
    var self = this
      , hash = el.hash
      , $target = $(hash)
      , offsetTop = $(hash).offset().top
      , adjustTop;

    if(!hash || $target.length === 0) return;

    adjustTop = self.isMobile ? self.headerH : self.elH;

    $('html, body')
      .animate({
        scrollTop: offsetTop - adjustTop
      }, self.option.speed, self.option.easing);
  },

  /**
   * スクロール位置に応じてカレント表示を更新
   */
  updateCurrent: function() {
    var self = this;

    for (var i = 0; i < self.linksLength; i++) {
      var $self = self.$links.eq(i)
        , $li = $self.parents('li')
        , $target = $($self.get(0).hash)
        , nextIndex = i + 1
        , targetPos = Math.floor($target.offset().top)
        , navBotPos = self.scrollTop + self.elH
        , $next
        , nextHash
        , nextOffsetTop;

      if(nextIndex < self.linksLength) {
        $next = self.$links.eq(nextIndex);
        nextHash = $next.get(0).hash;
        nextOffsetTop = Math.floor($(nextHash).offset().top);
      } else {
        nextOffsetTop = self.bodyH + self.elH;
      }

      if(targetPos <= navBotPos && navBotPos < nextOffsetTop) {
        $li.addClass('is-current');
      } else {
        $li.removeClass('is-current');
      }
    };
  },

  /**
   * [SP] ドロップダウンを開く
   */
  onTrigger: function() {
    var self = this
      , isOpen = self.$handle.hasClass('is-open')
      , heightVal = isOpen ? 0 : self.getHandleHeight();

    self.$ddTrigger.toggleClass('is-open');

    self.$handle
      .toggleClass('is-open')
      .stop(true, false)
      .velocity({
        height: heightVal
      }, self.MOVE_SPEED, 'easeInOutSine');
  },

  /**
   * [SP] ドロップダウンの高さを取得
   */
  getHandleHeight: function() {
    var self = this
      , height;

    self.$handle.css({
      display: 'none',
      height: 'auto'
    });

    height = self.$handle.height();

    self.$handle.css({
      display: 'block',
      height: 0
    });

    return height;
  },

  /**
   * .is-current を付与するナビを更新する
   */
  updateHandle: function() {
    var self = this;

    self.$handleItem
      .parent('li')
      .removeClass('is-current');

    self.$targetHandle
      .parent('li')
      .addClass('is-current');
  },

  /**
   * [SP] ドロップダウンのトリガーの中身をカレントに入れ替える
   */
  updateTrigger: function() {
    var self = this;

    self.$ddTrigger
      .find('a')
        .stop(true, false)
        .velocity({
          opacity: 0
        }, 200, function() {

          self.$ddTrigger
            .find('a')
              .remove()
            .end()
              .append(self.$targetHandle.clone());

          self.$targetHandle
            .clone()
            .velocity({
              opacity: 1
            }, 200);
        });
  },

  /**
   * [SP] ドロップダウンのトリガーの高さを設定する
   */
  setDropboxHeight: function() {
    var self = this;

    if(self.isMobile) {
      self.$ddWrap.height(self.$ddTrigger.height());
    } else {
      self.$ddWrap.removeAttr('style');
    }
  },

  /**
   * SP<->PC の際にスタイルをリセットする
   */
  resetStatus: function() {
    var self = this;

    self.$handle
      .removeClass('is-open')
      .removeAttr('style');

    self.$handleItem
      .parent('li')
      .removeClass('is-current');

    self.$contentsWrap.removeAttr('style');
    self.$contents.removeAttr('style');
  },

  /**
   * リサイズイベント
   */
  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.setDropboxHeight();

    if(self.prevMedia !== self.isMobile) {
      self.resetStatus();
      self.elH = self.$ddWrap.height();
      self.contentsUpdate();
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = ConvertAnchorToDropdown;

},{}],4:[function(require,module,exports){
/**
 * Convert dropdown function.
 */
var ConvertDropdown = function() {
  this.init();
};

ConvertDropdown.prototype = {

  MOVE_SPEED: 300,
  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
    self.setDropboxHeight();
  },

  setParam: function() {
    var self = this;

    self.$el = $('#convertDropdown');
    self.$handle = self.$el.find('.js-handle');
    self.$ddWrap = self.$el.find('.js-dropdownWrap');
    self.$ddTrigger = self.$el.find('.js-dropdownTrigger');
    self.$win = $(window);

    self.isOperating = false;
    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;
  },

  bindEvent: function() {
    var self = this;

    self.$ddTrigger
      .find('a')
      .on('click', function(event) {
        event.preventDefault();
        self.onTrigger();
      });

    self.$handle
      .find('a')
      .on('click', function() {
        if(!self.isMobile) return;
        self.onTrigger();
      });

    self.$win.on('resize', function() {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function() {
        self.onResize();
      }, 200);
    });
  },

  onTrigger: function() {
    var self = this
      , isOpen = self.$handle.hasClass('is-open')
      , heightVal = isOpen ? 0 : self.getHandleHeight();

    self.$ddTrigger.toggleClass('is-open');

    self.$handle
      .toggleClass('is-open')
      .stop(true, false)
      .velocity({
        height: heightVal
      }, self.MOVE_SPEED, 'easeInOutSine');
  },

  getHandleHeight: function() {
    var self = this
      , height;

    self.$handle.css({
      display: 'none',
      height: 'auto'
    });

    height = self.$handle.height();

    self.$handle.css({
      display: 'block',
      height: 0
    });

    return height;
  },

  setDropboxHeight: function() {
    var self = this;

    if(self.isMobile) {
      self.$ddWrap.height(self.$ddTrigger.height());
    } else {
      self.$ddWrap.removeAttr('style');
    }
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.setDropboxHeight();

    if(self.prevMedia !== self.isMobile) {
      self.$handle
        .removeClass('is-open')
        .removeAttr('style');
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = ConvertDropdown;

},{}],5:[function(require,module,exports){
/**
 * DevelopmentUnit function.
 */
var Development = function() {
  this.init();
};

Development.prototype = {

  init: function() {
    var self = this;

    $('.js-devTimeline').each(function() {
      new DevelopmentUnit($(this));
    });
  }
};

/**
 * DevelopmentUnit unit function.
 */
var DevelopmentUnit = function($el) {
  this.$el = $el;
  this.init();
}

DevelopmentUnit.prototype = {

  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
    self.setContainerHeight();
    self.setBalloonHeight();

    self.$item
      .find('.js-front')
      .addClass('is-show');

    self.setLineHeight();
    self.setWrapHeight();
  },

  setParam: function() {
    var self = this;

    self.$container = self.$el.find('.js-container');
    self.$row = self.$el.find('.js-row');
    self.$item = self.$el.find('.js-item');
    self.$trigger = self.$el.find('.js-trigger');
    self.$line = self.$el.find('.js-line');
    self.$anchor = self.$el.find('.js-anchor');
    self.$win = $(window);

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;

    self.winW = window.innerWidth ? window.innerWidth : self.$win.width();
    self.pastWinW = self.winW;

    self.isMoving = false;
  },

  bindEvent: function() {
    var self = this;

    self.$trigger
      .on('click', function() {
        self.onClick($(this));
      });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 250);
      });

  },

  setBalloonHeight: function() {
    var self = this

    self.$item
      .each(function() {
        var $self = $(this)
          , $front = $self.find('.js-front')
          , $back = $self.find('.js-back')
          , frontH
          , backH;

        if($back.length < 1) return;

        $back.removeClass('is-sameHeight');

        frontH = $front[0].clientHeight;
        backH = $back[0].clientHeight;

        if(backH <= frontH) {
          $back
            .outerHeight(frontH)
            .addClass('is-sameHeight');
        }

      });

    self.setArrowPos();
  },

  onClick: function($el) {
    var self = this;

    if(self.isMoving) return;
    self.isMoving = true;

    self.$target = $el.parents('.js-item');
    self.$targetRow = self.$target.parent('.js-row');
    self.$targetWrap = self.$target.find('.js-wrap');
    self.$inner = self.$target.find('.js-inner');
    self.$front = self.$target.find('.js-front');
    self.$back = self.$target.find('.js-back');
    self.$targetLine = self.$target.find('.js-line');

    if(self.$target.hasClass('is-open')) {
      self.$target.removeClass('is-open');
      self.$targetRow.css('z-index', 1);
      self.slideClose();
    } else {
      self.slideOpen();
      self.$target.addClass('is-open');
      self.$targetRow.css('z-index', 0);
    }
  },

  slideOpen: function() {
    var self = this
      , $openedItem = self.$targetRow.find('.is-open')
      , wrapH = self.$targetWrap.outerHeight()
      , backH = self.$back.outerHeight()
      , openedItemH = $openedItem.find('.js-wrap').outerHeight()
      , hasOpenItem = ($openedItem.length > 0 && !self.isMobile) ? true : false;

    self.$front.removeClass('is-show');
    self.$back.addClass('is-show');

    if(backH === wrapH) {
      self.$front
        .velocity({
          opacity: 0
        }, 500);

      self.$back
        .velocity({
          opacity: 1
        }, 500);

      self.isMoving = false;

      return;
    }

    self.$nextAllRow = self.$targetRow.nextAll();
    self.diffH = hasOpenItem ? ((openedItemH > backH) ? 0 : backH - openedItemH) : (backH - wrapH);

    self.$targetWrap
      .velocity({
        height: backH
      }, 500);

    self.$front
      .velocity({
        opacity: 0
      }, 500);

    self.$back
      .velocity({
        opacity: 1
      }, 500);


    self.updateContainerHeight();
    self.elasticLine();

    self.isMoving = false;
  },

  slideClose: function() {
    var self = this
      , $openedItem = self.$targetRow.find('.is-open')
      , wrapH = self.$targetWrap.outerHeight()
      , frontH = self.$front.outerHeight()
      , openedItemH = $openedItem.find('.js-wrap').outerHeight()
      , hasOpenItem = ($openedItem.length > 0 && !self.isMobile) ? true : false;

    self.$nextAllRow = self.$targetRow.nextAll();
    self.diffH = hasOpenItem ? ((openedItemH > wrapH) ? 0 : (openedItemH - wrapH)) : (frontH - wrapH);

    self.$front.addClass('is-show');
    self.$back.removeClass('is-show');

    self.$targetWrap
      .velocity({
        height: frontH
      }, 500);

    self.$front
      .addClass('is-show')
      .velocity({
        opacity: 1
      }, 500);

    self.$back
      .removeClass('is-show')
      .velocity({
        opacity: 0
      }, 500);

    self.updateContainerHeight();
    self.elasticLine();

    self.isMoving = false;
  },

  setLineHeight: function() {
    var self = this;

    self.$line
      .each(function() {
        var $self = $(this)
          , id = $self.data('id')
          , linePosTop = Math.floor($self.offset().top)
          , anchorPosTop
          , lineH;

        self.$anchor
          .each(function() {
            if($(this).data('id') === id) {
              anchorPosTop = Math.floor($(this).offset().top);
              return;
            }
          });

        $self.height(anchorPosTop - linePosTop);

      });

  },

  elasticLine: function() {
    var self = this;

    self.$targetLine
      .each(function() {
        var lineOffsetH = $(this).outerHeight();

        $(this)
          .velocity({
            height: lineOffsetH + self.diffH
          }, 500);
      });

  },

  updateContainerHeight: function() {
    var self = this
      , containerH = self.$container.height()
      , afterH = containerH + self.diffH;

    self.$container
      .velocity({
        height: Math.ceil(afterH)
      }, 500);

  },

  setWrapHeight: function() {
    var self = this;

    self.$item
      .find('.js-wrap')
      .each(function() {
        var $self = $(this)
          , $target = $self.find('.is-show')
          , targetH = $target.outerHeight();

        $self.height(targetH);
      });

  },

  setContainerHeight: function() {
    var self = this
      , $lastRow = self.$row.last()
      , $lastItem = $lastRow.find('.js-item')
      , lastPos = $lastRow.position().top
      , lastH = 0;

    if($lastItem.length === 1) {
      lastH = $lastItem.outerHeight();
    } else if(self.isMobile) {
      lastH = $lastItem.last().outerHeight();
      lastPos = lastPos + $lastItem.last().position().top;
    } else {
      $lastItem
        .each(function() {
          var $self = $(this)
            , height = $self.outerHeight();

          if(lastH < height) {
            lastH = height;
          }
        });
    }

    self.$container
      .velocity({
        height: Math.ceil(lastPos + lastH)
      }, 400, function() {
        $('#devContainer').addClass('is-loaded');
      });
  },

  setArrowPos: function() {
    var self = this

    self.$item
      .each(function() {
        var $self = $(this)
          , $arrow = $self.find('.js-arrow')
          , $circle = $self.find('.js-circle')
          , topPos = Math.floor($self.find('.js-itemInner').height() / 2);

        $arrow.css('top', topPos);
        $circle.css('top', topPos);
      });
  },

  resetStatus: function() {
    var self = this;

    self.$item
      .filter('.is-open')
      .find('.js-trigger')
      .trigger('click');

  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.winW = window.innerWidth ? window.innerWidth : self.$win.width();

    if(self.prevMedia !== self.isMobile) {
      self.resetStatus();
    }

    if(self.pastWinW !== self.winW) {

      if(self.isMobile) {
        self.resetStatus();
      }

      self.setBalloonHeight();
      self.setWrapHeight();
      self.setArrowPos();
      self.setLineHeight();
      self.setContainerHeight();
    }

    self.prevMedia = self.isMobile;
    self.pastWinW = self.winW;
  }

};

module.exports = Development;

},{}],6:[function(require,module,exports){
/**
 * Diversity accordion function.
 */
var DiversityAccordion = function() {
  this.init();
};

DiversityAccordion.prototype = {

  init: function() {
    var self = this;

    $('.js-diversityAccordion').each(function() {
      new DiversityAccordionUnit($(this));
    });
  }
};

/**
 * Diversity accordion unit function.
 */
var DiversityAccordionUnit = function($el) {
  this.$el = $el;
  this.init();
};

DiversityAccordionUnit.prototype = {

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
  },

  setParam: function() {
    var self = this;

    self.$inner = self.$el.find('.js-inner');
    self.$front = self.$el.find('.js-front');
    self.$back = self.$el.find('.js-back');
    self.$win = $(window);
    self.isOpen = false;
    self.isMoving = false;
  },

  bindEvent: function() {
    var self = this;

    self.$el
      .on('click', function() {
        self.onClick($(this));
      });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 250);
      });

  },

  onClick: function($el) {
    var self = this
      , targetH;

    if(self.isMoving) return;
    self.isMoving = true;

    $el.toggleClass('is-open');
    self.isOpen = $el.hasClass('is-open');
    targetH = self.isOpen ? self.$back.outerHeight() : self.$front.outerHeight();

    self.$inner
      .velocity({
        height: targetH
      }, 500, 'easeOutCubic', function() {
        self.isMoving = false;
      });

  },

  onResize: function() {
    var self = this
      , targetH = self.isOpen ? self.$back.outerHeight() : self.$front.outerHeight();

    self.$inner.css('height', targetH);
  }

};

module.exports = DiversityAccordion;

},{}],7:[function(require,module,exports){
/**
 * EqualHeights function.
 */
var EqualHeights = function() {
  this.init();
};

EqualHeights.prototype = {

  init: function () {
    var self = this;

    self.$el = $('.js-equalHeights');
    self.$win = $(window);
    self.winW = window.innerWidth ? window.innerWidth : self.$win.width();
    self.pastWinW = self.winW;

    self.addItemGroup();
    self.setItemHeight();
    self.exportEvents();
    self.bindEvent();
  },

  bindEvent: function() {
    var self = this;

    self.$win.on('resize', function() {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function() {
        self.onResize();
      }, 200);
    });
  },

  addItemGroup: function() {
  	var self = this
  		, groupName;

  	self.itemGroup = {};

    self.$el.each(function() {
      var $self = $(this);

      if($self.is(':hidden')) return;

      if ($self.data('equalHeightsGroup')) {
        groupName = 'group-' + $self.data('equalHeightsGroup');
      } else {
        groupName = 'offset-' + Math.floor($self.offset().top);
      }

      if (!(groupName in self.itemGroup)) {
        self.itemGroup[groupName] = $([]);
      }

      self.itemGroup[groupName] = self.itemGroup[groupName].add(this);
    });
  },

  setItemHeight: function() {
  	var self = this;

  	$.each(self.itemGroup, function() {
      self.equalize(this);
    });

    self.checkItemHeight();
  },

  equalize: function($targets) {
  	var self = this
  		, highest = 0;

    $targets
      .height('auto')
      .each(function() {
        var $self = $(this);
        if ($self.height() > highest) {
          highest = $self.height();
        }
      });

    if(highest > 0) {
      $targets.height(highest);
    }
  },

  checkItemHeight: function() {
  	var self = this;

    self.addItemGroup();

    for(var i in self.itemGroup) {
      var heightObj = self.getMaxAndMin(i);

      if(heightObj.max !== heightObj.min) {
        self.setItemHeight();
        return;
      }
    }
  },

  getMaxAndMin: function(index) {
    var self = this
      , itemObj = self.itemGroup[index]
      , length = itemObj.length
      , heightArr = []
      , result = {};

    for (var i = 0; i < length; i++) {
      heightArr.push(itemObj[i].clientHeight);
    };

    result.max = Math.max.apply(null, heightArr);
    result.min = Math.min.apply(null, heightArr);

    return result;
  },

  exportEvents: function() {
    var self = this;

    $(document).on('bindEvents', function() {
      self.$el = $('.js-equalHeights');
      self.addItemGroup();
      self.setItemHeight();
    });

    self.$el.on('refresh', function() {
      self.addItemGroup()
      self.setItemHeight();
    });

  },

  onResize: function() {
  	var self = this;

  	self.winW = window.innerWidth ? window.innerWidth : self.$win.width();

    if(self.pastWinW !== self.winW) {
      self.pastWinW = self.winW;
      self.setItemHeight();
    }
  }
};

module.exports = EqualHeights;

},{}],8:[function(require,module,exports){
var NewsFilter = require('./news_filter')
  , TopicsPanel = require('./topics_panel');

/**
 * Execute api function.
 */
var Execute = function() {
  this.init();
};

Execute.prototype = {

  init: function() {
    var self = this;

    self.$el = $('.js-execute');
    self.length = self.$el.length;
    self.count = 0;

    self.$el.each(function() {
      var execute = new ExecuteUnit($(this));

      execute.done(function() {
        self.loaded();
      });
    });
  },

  loaded: function() {
    var self = this;
    self.count++;
    if(self.length === self.count) {
      new NewsFilter();
      new TopicsPanel();
      $(document).trigger('bindEvents');
    }
  }
};


/**
 * Execute api unit function.
 */
var ExecuteUnit = function($el) {
  this.$el = $el;
  this.init();
  this.deferred = $.Deferred();
  return this.deferred.promise();
};

ExecuteUnit.prototype = {

  init: function () {
    var self = this;

    self.setParam();
    self.setJsonPath();
    self.fetch();
  },

  setParam: function() {
    var self = this;

    self.$result = self.$el.find('.js-render');
    self.$template = self.$el.find('.js-template')
    self.$executeWrap = self.$el.parents('.js-executeWrap');
    self.syncTarget =  self.$el.data('syncTarget');
  },

  setJsonPath: function() {
    var self = this;

    switch (self.syncTarget) {
      case 'topics':
        self.path = '/common/data/top/topics.json';
        break;
      case 'news':
        self.path = '/common/data/top/news.json';
        break;
      case 'important':
        self.path = '/common/data/top/important.json';
        break;
      case 'group':
        self.path = '/common/data/top/group_news.json';
        break;
      case 'news_release_all':
        self.path = '/common/data/news_release/all.json';
        break;
      case 'news_release_service':
        self.path = '/common/data/news_release/service.json';
        break;
      case 'news_release_research':
        self.path = '/common/data/news_release/research.json';
        break;
      case 'news_release_corporate':
        self.path = '/common/data/news_release/corporate.json';
        break;
      case 'news_release_other':
        self.path = '/common/data/news_release/other.json';
        break;
    }
  },

  fetch: function() {
    var self = this;

    $.ajax({
      url: self.path,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(data) {
      if(Object.keys(data).length < 1 || data[self.syncTarget].length < 1) {
        self.$executeWrap.remove();
        self.deferred.resolve();
        return;
      }
      self.$executeWrap.css('display', 'block');
      self.render(data);
    })
    .fail(function() {
      self.$executeWrap.remove();
    });

  },

  render: function(data) {
    var self = this
      , tmpl = $.templates(self.$template[0])
      , output = tmpl.render(data[self.syncTarget]);

    self.$result.html(output);
    self.fetchImage();
  },

  fetchImage: function() {
    var self = this
      , $image = self.$result.find('img')
      , deferreds = [];

    $image.each(function() {
      deferreds.push(self.setDeferred($(this)));
    });

    $.when
      .apply(null, deferreds)
      .done(function() {
        self.deferred.resolve();
      });
  },

  setDeferred: function($el) {
    var self = this
      , src = $el.attr('src')
      , image = new Image()
      , deferred = $.Deferred();

    image.onload = function() {
      deferred.resolve();
    };

    image.onerror = function() {
      deferred.reject();
    };

    image.src = src;
    return deferred.promise();
  }
};

module.exports = Execute;

},{"./news_filter":14,"./topics_panel":22}],9:[function(require,module,exports){
/**
 * Fix anchor function.
 */
var FixAnchor = function() {
  this.init();
};

FixAnchor.prototype = {

  MAX_WIDTH: '(max-width: 800px)',

  init: function () {
    var self = this;

    self.$el = $('#fixAnchor');
    if(self.$el.length ===0) return;

    self.setParam();
    self.bindEvent();
    self.updateCurrent();
  },

  setParam: function() {
    var self = this;

    self.$inner = self.$el.find('.js-inner');
    self.$links = self.$el.find('a');
    self.$header = $('#header');
    self.$win = $(window);
    self.$body = $('body');

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.headerH = self.$header.height();
    self.elH = self.$el.height();
    self.bodyH = self.$body.height();
    self.linksLength = self.$links.length;

    self.option = {
      speed : 1000,
      easing : 'easeInOutQuad'
    };

  },

  bindEvent: function() {
    var self = this;

    self.$win
      .on('scroll', function() {
        self.bodyH = self.$body.height();
        self.updateState();
        self.updatePos();
      });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });

    self.$el
      .find('a')
      .on('click', function(event) {
        event.preventDefault();
        self.onClick(this);
      });
  },

  updateState: function() {
    var self = this
      , fixPos = self.$el.offset().top;

    self.scrollTop = self.$win.scrollTop();

    if(fixPos < self.scrollTop && !self.isMobile) {
      self.isfixed = true;
      self.$el
        .addClass('is-fixed')
        .height(self.elH);
    } else {
      self.isfixed = false;
      self.$el
        .removeClass('is-fixed')
        .removeAttr('style');
    }

    self.updateCurrent();
  },

  updatePos: function() {
    var self = this
      , scrollLeft = self.isfixed ? self.$win.scrollLeft() : 0;

    self.$inner.css('left', -scrollLeft);
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.headerH = self.$header.height();
    self.elH = self.$el.height();

    self.updateState();
  },

  onClick: function(el) {
    var self = this
      , hash = el.hash
      , $target = $(hash)
      , offsetTop = $(hash).offset().top
      , adjustTop;

    if(!hash || $target.length === 0) return;

    adjustTop = self.isMobile ? self.headerH : self.elH;

    $('html, body')
      .animate({
        scrollTop: offsetTop - adjustTop
      }, self.option.speed, self.option.easing);
  },

  updateCurrent: function() {
    var self = this;

    for (var i = 0; i < self.linksLength; i++) {
      var $self = self.$links.eq(i)
        , $li = $self.parents('li')
        , $target = $($self.get(0).hash)
        , nextIndex = i + 1
        , targetPos = Math.floor($target.offset().top)
        , navBotPos = self.scrollTop + self.elH
        , $next
        , nextHash
        , nextOffsetTop;

      if(nextIndex < self.linksLength) {
        $next = self.$links.eq(nextIndex);
        nextHash = $next.get(0).hash;
        nextOffsetTop = Math.floor($(nextHash).offset().top);
      } else {
        nextOffsetTop = self.bodyH + self.elH;
      }

      if(targetPos <= navBotPos && navBotPos < nextOffsetTop) {
        $li.addClass('is-current');
      } else {
        $li.removeClass('is-current');
      }
    };
  }
};

module.exports = FixAnchor;

},{}],10:[function(require,module,exports){
/**
 * Header function.
 */
var Header = function() {
  this.init();
};

Header.prototype = {

  PC_DETAIL_WIDTH: 455,
  HIDE_TIMER_NUM: 300,
  MAX_WIDTH: '(max-width: 800px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
    self.checkCurCat();
  },

  setParam: function() {
    var self = this;

    self.$el = $('#header');
    self.$navItem = self.$el.find('.js-navItem');
    self.$detailWrap = $('#header-detail');
    self.$detailItem = self.$el.find('.js-detailItem');
    self.$close = self.$el.find('.js-close');
    self.$overlay = $('#overlay');
    self.$container = $('#container');
    self.$win = $(window);

    self.$currentDetail = self.$detailItem;
    self.headerH = self.$el.height();
    self.isFaded = false;
    self.isOpen = false;
    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.canEntered = self.isMobile ? true : false;
    self.prevMedia = self.isMobile;
  },

  bindEvent: function() {
    var self = this;

    self.$win
      .on('pageshow', function(event) {
        if (event.originalEvent.persisted) {
          self.$detailItem.css('height', 0);
          self.closeDetail();
        }
      });

    self.$container
      .on('mouseover', function() {
        self.$container.off('mouseover');
        self.canEntered = true;
      });

    self.$el
      .on('mouseover', function() {
        self.$el.off('mouseover');
        self.canEntered = true;
      });

    self.$navItem
      .on('mouseleave', function() {
        if(self.isMobile) return;
        self.canEntered = true;
        self.hasDetailArea = true;

        self.bufferHide();
        clearTimeout(self.openTimer);
      })
      .on('mouseenter', function(event) {
        var $self = $(this);

        if(self.isMobile) return;

        self.isGnavEntered = true;
        self.hasDetailArea = true;
        self.pastName = self.currentName;
        self.currentName = $self.data('target');
        self.$pastDetail = self.$currentDetail;

        if(!self.canEntered) return;

        if(!self.currentName) {
          self.hasDetailArea = false;
          self.updateNavCurrent($self);

          if(self.isOpen) {
            self.bufferHide();
          }

          return;
        }

        self.$currentDetail = $('#' + self.currentName);

        if(self.isOpen) {
          self.updateNavCurrent($self);
          self.changeDetail();
          return;
        }

        self.openTimer = setTimeout(function() {
          self.updateNavCurrent($self);
          self.showDetailArea();
        }, 300);

      })
      .on('click', function(event) {
        var $self = $(this);

        if(!self.isMobile) {
          clearTimeout(self.openTimer);
          return;
        }

        self.pastName = self.currentName;
        self.currentName = $self.data('target');

        self.updateNavCurrent($self);

        if(self.currentName === 'recruit') {
          self.closeDetail();
          return;
        } else {
          event.preventDefault();
        }

        self.$pastDetail = self.$currentDetail;
        self.$currentDetail = $('#' + self.currentName);

        if(self.currentName === self.pastName) {
          self.closeDetail();
          return;
        }

        if(self.isOpen) {
          self.changeDetail();
          return;
        }

        self.showDetailArea();
      });

    self.$detailWrap
      .on('mouseleave', function(event) {
        if(self.isMobile && event.type === 'mouseleave') return;
        self.bufferHide();
      })
      .on('mouseenter', function() {
        self.isGnavEntered = true;
      });

    self.$close
      .on('click', function(event) {
        event.preventDefault();
        self.closeDetail();
      });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });
  },

  closeDetail: function() {
    var self = this;

    self.currentName = null;
    self.isGnavEntered = false;
    self.hideDetailArea();
  },

  checkCurCat: function() {
    var self = this
      , pathname = location.pathname
      , cat = (pathname === '/') ? 'home' : pathname.match(/^\/.*?\//g)[0];

    self.$navItem.each(function() {
      var $self = $(this)
        , href = $self.attr('href');

      if(cat === href) {
        self.updateNavCurrent($self);
      } else if(cat === 'home') {
        self.updateNavCurrent();
      }
    });
  },

  updateNavCurrent: function($el) {
    var self = this;

    self.$navItem.removeClass('is-current');

    if($el) {
      $el.addClass('is-current');
    }
  },

  showDetailArea: function() {
    var self = this
      , currentH;

    self.isOpen = true;

    if(self.isMobile) {

      currentH = self.getDetailHeight();

      self.$currentDetail
        .velocity('stop')
        .css({
          display: 'block',
          height: 0,
          opacity: 1
        })
        .velocity({
          height: currentH
        }, 500, 'easeOutCubic');

      self.showOverlay();

    } else {

      self.$detailWrap
        .stop(true, false)
        .velocity({
          width: self.PC_DETAIL_WIDTH
        }, 500, 'easeOutCubic', function() {
          self.animateItems();
          self.showOverlay();
        });
      }
  },

  hideDetailArea: function() {
    var self = this;

    if(self.isGnavEntered) return;

    self.isOpen = false;

    if(self.isMobile) {

      self.$currentDetail
        .stop(true, false)
        .velocity({
          height: 0
        }, 500, 'easeOutCubic', function() {
          $(this)
            .scrollTop(0)
            .removeAttr('style');
        });

      self.checkCurCat();

    } else {

      self.$detailItem
        .stop(true, false)
        .animate({
          opacity: 0
        }, 400, function() {
          $(this).css('display', 'none');
        });

      self.$detailWrap
        .stop(true, false)
        .velocity('stop')
        .velocity({
          width: 0
        }, 400, 'easeOutCubic', function() {
          $(this).removeAttr('style');
        });

      if(self.hasDetailArea) {
        self.checkCurCat();
      }
    }

    self.hideOverlay();
  },

  getDetailHeight: function() {
    var self = this
      , isVisible = self.$currentDetail.is(':visible')
      , currentH
      , result;

    if(!isVisible) {
      self.$currentDetail
        .css({
          display: 'block',
          visvility: 'hidden'
        });
    }

    self.winH = window.innerHeight ? window.innerHeight : $(window).height();
    currentH = self.$currentDetail.find('.js-detailItemInner').outerHeight();
    result = (currentH > self.winH - self.headerH) ? self.winH - self.headerH : currentH;

    if(!isVisible) {
      self.$currentDetail
        .css({
          display: 'none',
          visvility: 'visible'
        });
    }

    return result;
  },

  showOverlay: function() {
    var self = this;

    self.$overlay
      .css('display', 'block')
      .stop(true, false)
      .velocity('stop')
      .velocity({
        opacity: 0.9
      }, 500, 'easeOutCubic');

  },

  hideOverlay: function() {
    var self = this;

    self.$overlay
      .stop(true, false)
      .velocity('stop')
      .velocity({
        opacity: 0
      }, 500, 'easeOutCubic', function() {
        $(this).css('display', 'none');
      });

  },

  bufferHide: function() {
    var self = this;

    self.isGnavEntered = false;

    clearTimeout(self.hideTimer);
    self.hideTimer = setTimeout(function() {
      self.hideDetailArea();
    }, self.HIDE_TIMER_NUM);

  },

  animateItems: function() {
    var self = this
      , $title = self.$currentDetail.find('.js-detailTitle')
      , $items = self.$currentDetail.find('li')
      , length = $items.length - 1;


    if(self.isFaded) return;
    self.isFaded = true;

    self.$currentDetail
      .stop(true, false)
      .css({
        display: 'block',
        opacity: 1
      });

    $title
      .css({
        opacity: 0,
        left: -10
      })
      .velocity({
        opacity: 1,
        left: 0
      }, 500, 'easeOutCubic');

    $items
      .css({
        opacity: 0,
        left: -10
      })
      .each(function(index) {
        $(this)
          .delay(index * 50)
          .velocity({
            opacity: 1,
            left: 0
          }, 500, 'easeOutCubic', function() {
            if(index === length) {
              self.isFaded = false;
            }
          });
      });
  },

  changeDetail: function() {
    var self = this;

    if(self.isMobile) {

      self.$pastDetail
        .css('z-index', 1)
        .animate({
          opacity: 0
        }, 500, 'easeOutCubic', function() {
          $(this)
            .scrollTop(0)
            .removeAttr('style');
        });

      self.$currentDetail
        .stop(true, false)
        .css({
          display: 'block',
          opacity: 1,
          zIndex: 0,
          height: self.getDetailHeight()
        });

    } else {

      self.$pastDetail
        .stop(true, false)
        .animate({
          opacity: 0
        }, 500, 'easeOutCubic', function() {
          $(this).css('display', 'none');
        });

      self.$currentDetail
        .css('display', 'block')
        .stop(true, false)
        .animate({
          opacity: 1
        }, 500, 'easeOutCubic');
    }
  },

  resetNavState: function() {
    var self = this;

    self.$detailItem.removeAttr('style');
    self.$overlay.removeAttr('style');
    self.currentName = null;
    self.isOpen = false;
    self.headerH = self.$el.height();
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;

    if(self.prevMedia !== self.isMobile) {
      self.resetNavState();
    }

    if(self.isMobile && self.isOpen) {
      self.$currentDetail.height(self.getDetailHeight());
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = Header;

},{}],11:[function(require,module,exports){
/**
 * Index years function.
 */
var IndexYears = function() {
  this.init();
};

IndexYears.prototype = {

  MAX_WIDTH: '(max-width: 800px)',

  init: function() {
    var self = this;

    self.$el = $('#indexYears');
    if(self.$el.length === 0) return;

    self.setParam();
    self.updateController();
    self.bindEvent();
  },

  setParam: function() {
    var self = this;

    self.$inner = self.$el.find('.js-inner');
    self.$inside = self.$el.find('.js-inside');
    self.$ul = self.$el.find('ul');
    self.$li = self.$el.find('li');
    self.$win = $(window);
    self.$headingPage = $('#headingPage');

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;

    self.setElementSize();

    self.currentNum = 0;
    self.leftPos = 0;
    self.slideLength = self.getDivisionCount();
    self.elH = self.$el.height();

    self.$next = $('<a href="#" class="indexYears-next">');
    self.$prev = $('<a href="#" class="indexYears-prev">');
    self.$trigger = $('<a href="#" class="heading-trigger"><span></span><span></span></a>');

    self.$ul.after(self.$next);
    self.$ul.after(self.$prev);
    self.$headingPage.append(self.$trigger);

  },

  /**
   * スライダーの横幅を設定
   */
  setElementSize: function() {
    var self = this;

    if(self.isMobile) {
      self.$ul.width('auto');
      return;
    }

    self.liLength = self.$li.length;
    self.liW = self.$li.width();
    self.ulW = self.liW * self.liLength;
    self.$ul.width(self.ulW);
    self.innerW = self.$inside.width();
  },

  bindEvent: function() {
    var self = this;

    self.$next
      .on('click', function(event) {
        event.preventDefault();
        self.dirRight = true;
        self.beforeMoveSlide();
      });

    self.$prev
      .on('click', function(event) {
        event.preventDefault();
        self.dirRight = false;
        self.beforeMoveSlide();
      });

    self.$trigger
      .on('click', function(event) {
        event.preventDefault();
        self.onTriggerClick();
      });

    self.$win
      .on('resize', function() {
        self.onResize();
      });

    self.$win
      .on('scroll', function() {
        self.updateState();
        self.updatePos();
      });
  },

  /**
   * スライドをアニメーションさせる前処理
   */
  beforeMoveSlide: function() {
    var self = this
      , currentPos = self.leftPos
      , adjustVal = 0
      , distPos;

    self.slideLength = self.getDivisionCount();
    self.setCurrentNum();

    if(self.dirRight) {
      distPos = self.ulW - (currentPos + self.innerW);

      if(self.innerW < distPos) {
        distPos = self.innerW;
      }

    } else {
      distPos = 0 - currentPos;

      if(distPos < -self.innerW) {
        distPos = -self.innerW;
      }
    }

    if((self.currentNum !== 0) && (self.currentNum !== self.slideLength - 1)) {
      adjustVal = (distPos % self.liW) * 2;
    }

    distPos = distPos - adjustVal;
    self.leftPos = currentPos + distPos;

    self.moveSlide();
  },

  /**
   * スライド移動
   */
  moveSlide: function() {
    var self = this
      , movePos = -self.leftPos;

    if(self.isMoving) return;
    self.isMoving = true;

    self.$ul
      .velocity({
        left: movePos
      }, 500, 'easeOutQuart', function() {
        self.isMoving = false;
        self.updateController();
      });
  },

  /**
   * 現在のスライド番号を設定
   */
  setCurrentNum: function() {
    var self = this;

    if(self.dirRight) {
      self.currentNum += 1;

      if(self.slideLength - 1 < self.currentNum) {
        self.currentNum = self.slideLength - 1;
      }

    } else {
      self.currentNum -= 1;

      if(self.currentNum < 0) {
        self.currentNum = 0;
      }
    }
  },

  /**
   * スライドの分割数を取得
   * @return {[Number]} 分割数
   */
  getDivisionCount: function() {
    var self = this
      , result;

    self.innerW = self.$inside.width();
    result = Math.ceil(self.ulW / self.innerW);

    return result;
  },

  /**
   * 矢印の表示制御
   */
  updateController: function() {
    var self = this
      , nextPos = (self.currentNum === self.slideLength - 1) ? -30 : 0
      , prevPos = (self.currentNum === 0) ? -30 : 0;

    if(self.slideLength === 1) {
      nextPos = -30;
      prevPos = -30;
    }

    self.$next
      .velocity('stop')
      .velocity({
        right: nextPos
      }, 500);

    self.$prev
      .velocity('stop')
      .velocity({
        left: prevPos
      }, 500);

  },

  onTriggerClick: function() {
    var self = this
      , isOpen
      , elH;

    if(self.isOpenMoving) return;
    self.isOpenMoving = true;

    self.$trigger.toggleClass('is-open');
    isOpen = self.$trigger.hasClass('is-open');
    elH = isOpen ? self.$inside.height() : 0;

    self.$el
      .velocity({
        height: elH
      }, 500, function() {
        self.isOpenMoving = false;
      });

  },

  /**
   * PC表示でリサイズ時の位置調整
   */
  updateHorizontalPos: function() {
    var self = this;

    self.pastInnerW = self.innerW;
    self.innerW = self.$inside.width();

    distW = self.innerW - self.pastInnerW;

    self.slideLength = self.getDivisionCount();
    self.updateController();

    if((1 < self.slideLength) && (self.currentNum === self.slideLength - 1)) {
      self.leftPos = self.leftPos - distW;
    } else {
      self.leftPos = 0;
    }

    self.$ul.css('left', -self.leftPos);
  },

  updateState: function() {
    var self = this
      , fixPos = self.$el.offset().top;

    self.scrollTop = self.$win.scrollTop();

    if(fixPos < self.scrollTop && !self.isMobile) {
      self.isfixed = true;
      self.$el
        .addClass('is-fixed')
        .height(self.elH);
    } else {
      self.isfixed = false;
      self.$el.removeClass('is-fixed');

      if(!self.isMobile) {
        self.$el.removeAttr('style');
      }
    }
  },

  updatePos: function() {
    var self = this
      , scrollLeft = self.isfixed ? self.$win.scrollLeft() : 0;

    self.$inner.css('left', -scrollLeft);
  },

  /**
   * リサイズイベント
   */
  onResize: function() {
    var self = this
      , distW;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;

    if(!self.isMobile) {
      self.updateHorizontalPos();
      self.elH = self.$el.height();
    } else {
      self.$ul.css('left', 0);
    }

    if(self.prevMedia !== self.isMobile) {
      self.$trigger.removeClass('is-open');
      self.$el.removeAttr('style');
      self.setElementSize();
      self.updateState();
      self.updatePos();
    }

    self.prevMedia = self.isMobile;

  }

};

module.exports = IndexYears;

},{}],12:[function(require,module,exports){
/**
 * Local news filter function.
 */
var LocalNewsFilter = function() {
  this.init();
}

LocalNewsFilter.prototype = {

  MOVE_VAL: 30,
  MOVE_SPEED: 250,
  MOVE_DELAY: 0,
  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.$el = $('#LocalNewsFilter');
    if(self.$el.length === 0) return;

    self.setParam();
    self.bindEvent();

    self.targetId = self.getInitCat();
    self.isMoving = true;
    self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');

    self.updateHandle();
    self.updateTrigger();
    self.prepareNextList();
    self.setDropboxHeight();
    self.show();
  },

  getInitCat: function() {
    var self = this
      , pathname = window.location.pathname
      , cat = (pathname.match(/\d{4}\/(|index.(html|php))$/g)) ? 'all' : pathname.match(/\w+?\/(|index.(html|php))$/g)[0].replace('/', '');

    return cat;
  },

  setParam: function() {
    var self = this;

    self.$handle = self.$el.find('.js-handle');
    self.$handleItem = self.$handle.find('a');
    self.$ddWrap = self.$el.find('.js-dropdownWrap');
    self.$ddTrigger = self.$el.find('.js-dropdownTrigger');
    self.$content = self.$el.find('.js-content');
    self.$list = self.$el.find('.js-list');
    self.$listItem = self.$list.find('li');
    self.$win = $(window);

    self.$list.css('display', 'none');
    self.isMoving = false;
    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;
  },

  bindEvent: function() {
    var self = this;

    self.$handleItem.on('click', function(event) {
      event.preventDefault();
      self.onClick($(this));
    });

    self.$ddTrigger.on('click', 'a', function(event) {
      event.preventDefault();
      self.onTrigger();
    });

    self.$win.on('resize', function() {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function() {
        self.onResize();
      }, 200);
    });
  },

  onClick: function($el) {
    var self = this
      , isCurrent = $el.parent('li').hasClass('is-current');

    if(self.isMoving || isCurrent) return;
    self.isMoving = true;

    self.targetId = $el.data('target');
    self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');
    self.updateHandle();
    self.updateTrigger();
    self.prepareNextList();
    self.hide();

    if(self.isMobile) {
      self.onTrigger();
    }
  },

  onTrigger: function() {
    var self = this
      , isOpen = self.$handle.hasClass('is-open')
      , heightVal = isOpen ? 0 : self.getHandleHeight();

    self.$ddTrigger.toggleClass('is-open');

    self.$handle
      .toggleClass('is-open')
      .stop(true, false)
      .velocity({
        height: heightVal
      }, 300, 'easeInOutSine');
  },

  getHandleHeight: function() {
    var self = this
      , height;

    self.$handle.css({
      display: 'none',
      height: 'auto'
    });

    height = self.$handle.height();

    self.$handle.css({
      display: 'block',
      height: 0
    });

    return height;
  },

  prepareNextList: function() {
    var self = this
      , $ul = $('<ul class="newsList">')
      , $li = (self.targetId === 'all') ? self.$listItem : self.$listItem.filter('[data-cat=' + self.targetId + ']')
      , liLength = $li.length;

    if(liLength === 0) {
      $li = $('<li class="newsList-empty">このカテゴリの記事はありません。</li>')
    }

    $li.css('opacity', 0);
    self.$prevList = self.$nextList;
    self.$nextList = $ul.append($li.clone());
    self.$content.append(self.$nextList);
  },

  setContentHeight: function() {
    var self = this;

    self.$content
      .stop(true, false)
      .velocity({
        height: self.$nextList.height()
      }, 500, 'easeInOutSine');
  },

  show: function() {
    var self = this
      , $li = self.$nextList.find('li')
      , length = $li.length;

    self.setContentHeight();

    if(length === 0) {
      self.isMoving = false;
      return;
    }

    $li.each(function(index) {
      $(this)
        .css('top', self.MOVE_VAL)
        .delay(index * self.MOVE_DELAY)
        .velocity({
          top: 0,
          opacity: 1
        }, self.MOVE_SPEED, 'easeOutSine', function() {
          if(index === length - 1) {
            self.isMoving = false;
          }
        });
      });
  },

  hide: function() {
    var self = this
      , $li = self.$prevList.find('li')
      , length = $li.length;

    if(length === 0) {
      self.show();
      self.$prevList.remove();
      return;
    }

    $li.each(function(index) {
      $(this)
        .delay(index * self.MOVE_DELAY)
        .velocity({
          top: -self.MOVE_VAL,
          opacity: 0
        }, self.MOVE_SPEED, 'easeInSine', function() {
          if(index === length - 1) {
            self.show();
            self.$prevList.remove();
          }
        });
      });
  },

  updateHandle: function() {
    var self = this;

    self.$handleItem
      .parent('li')
      .removeClass('is-current');

    self.$targetHandle
      .parent('li')
      .addClass('is-current');
  },

  updateTrigger: function() {
    var self = this;

    self.$ddTrigger
      .find('a')
        .stop(true, false)
        .velocity({
          opacity: 0
        }, 200, function() {

          self.$ddTrigger
            .find('a')
              .remove()
            .end()
              .append(self.$targetHandle.clone());

          self.$targetHandle
            .clone()
            .velocity({
              opacity: 1
            }, 200);
        });
  },

  setDropboxHeight: function() {
    var self = this;

    if(self.isMobile) {
      self.$ddWrap.height(self.$ddTrigger.height());
    } else {
      self.$ddWrap.removeAttr('style');
    }
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;

    self.setContentHeight();
    self.setDropboxHeight();

    if(self.prevMedia !== self.isMobile) {
      self.$handle
        .removeClass('is-open')
        .removeAttr('style');
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = LocalNewsFilter;

},{}],13:[function(require,module,exports){
/**
 * Map function.
 */
var Map = function() {
  this.init();
};

Map.prototype = {

  init: function() {
    var self = this;

    self.$el = $('#map');
    if(self.$el.length === 0) return;

    self.setParam();
    self.bindEvent();
    self.render();
  },

  setParam: function() {
    var self = this;

    self.$win = $(window);
    self.param = self.$el.data('param');

    self.param = {
      zoom: self.$el.data('zoom'),
      lat: self.$el.data('lat'),
      lng: self.$el.data('lng')
    };

    self.center = new google.maps.LatLng(self.param.lat, self.param.lng);
    self.zoom = parseInt(self.param.zoom);

    // It was customized with https://snazzymaps.com/
    self.customStyle = [
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#444444"
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
          {
            "color": "#f2f2f2"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          {
            "saturation": -100
          },
          {
            "lightness": 45
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
          {
            "color": "#cce4e6"
          },
          {
            "visibility": "on"
          }
        ]
      }
    ];

    self.option = {
      zoom: self.zoom,
      center: self.center,
      scrollwheel: false,
      panControl: false,
      scaleControl: false,
      rotateControl: false,
      overviewMapControl: false,
      styles: self.customStyle
    };

  },

  bindEvent: function() {
    var self = this;

    self.$win.on('resize', function() {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function() {
        self.onResize();
      }, 1000);
    });

  },

  render: function() {
    var self = this
      , marker;

    self.map = new google.maps.Map(self.$el.get(0), self.option);

    marker = new google.maps.Marker({
      position: self.center,
      map: self.map
    });
  },

  onResize: function() {
    var self = this;

    self.map.panTo(self.center);
  }

};

module.exports = Map;

},{}],14:[function(require,module,exports){
/**
 * News filter function.
 */
var NewsFilter = function() {
  this.init();
}

NewsFilter.prototype = {

  MOVE_VAL: 30,
  MOVE_SPEED: 250,
  MOVE_DELAY: 0,
  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();

    self.targetId = 'all';
    self.currentHandleIndex = 0;
    self.isMoving = true;
    self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');

    self.updateHandle();
    self.updateTrigger();
    self.setDropdownHeight();
    self.changeList();
  },

  setParam: function() {
    var self = this;

    self.$el = $('#newsFilter');
    self.$handle = self.$el.find('.js-handle');
    self.$handleItem = self.$handle.find('a');
    self.$ddWrap = self.$el.find('.js-dropdownWrap');
    self.$ddTrigger = self.$el.find('.js-dropdownTrigger');
    self.$content = self.$el.find('.js-content');
    self.$list = self.$el.find('.js-list');
    self.$win = $(window);

    self.$list.css('display', 'none');

    self.isMoving = false;
    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;
  },

  bindEvent: function() {
    var self = this;

    self.$handleItem.on('click', function(event) {
      event.preventDefault();
      self.onClick($(this));
    });

    self.$ddTrigger.on('click', 'a', function(event) {
      event.preventDefault();
      self.onTrigger();
    });

    self.$win.on('resize', function() {
      clearTimeout(self.resizeTimer);
      self.resizeTimer = setTimeout(function() {
        self.onResize();
      }, 200);
    });
  },

  onClick: function($el) {
    var self = this
      , $parentLi = $el.parent('li')
      , isCurrent = $parentLi.hasClass('is-current');

    if(self.isMoving || isCurrent) return;
    self.isMoving = true;
    self.movingDirection = 'top';

    self.targetId = $el.data('target');
    self.updateHandle();
    self.updateTrigger();
    self.changeList();

    if(self.isMobile) {
      self.onTrigger();
    }
  },

  onTrigger: function() {
    var self = this
      , isOpen = self.$handle.hasClass('is-open')
      , heightVal = isOpen ? 0 : self.getHandleHeight();

    self.$ddTrigger.toggleClass('is-open');

    self.$handle
      .toggleClass('is-open')
      .stop(true, false)
      .velocity({
        height: heightVal
      }, 300, 'easeInOutSine');
  },

  getHandleHeight: function() {
    var self = this
      , height;

    self.$handle.css({
      display: 'none',
      height: 'auto'
    });

    height = self.$handle.height();

    self.$handle.css({
      display: 'block',
      height: 0
    });

    return height;
  },

  setContentHeight: function() {
    var self = this;

    self.$content
      .stop(true, false)
      .velocity({
        height: self.$nextList.height()
      }, 500, 'easeInOutSine');
  },

  changeList: function() {
    var self = this;

    self.$prevList = self.$nextList;
    self.$nextList = self.$list.filter('[data-id=' + self.targetId + ']');

    self.hide();

    setTimeout(function() {
      self.show();
    }, 200);
  },

  show: function() {
    var self = this
      , $li = self.$nextList.find('li')
      , length = $li.length
      , cssParam
      , animParam;

    cssParam = {
      left: 'auto',
      right: 'auto',
      zIndex: 1,
      opacity: 0
    };

    animParam = {
      opacity: 1
    };

    cssParam[self.movingDirection] = self.MOVE_VAL;
    animParam[self.movingDirection] = 0;

    self.$nextList.css('display', 'block');
    self.setContentHeight();

    if(length === 0) {
      self.isMoving = false;
      return;
    }

    $li.each(function(index) {
      $(this)
        .css(cssParam)
        .delay(index * self.MOVE_DELAY)
        .velocity(animParam, self.MOVE_SPEED, 'easeOutSine', function() {
          if(index === length - 1) {
            self.isMoving = false;
          }
        });
      });
  },

  hide: function() {
    var self = this
      , $li
      , length
      , cssParam
      , animParam;

    if(!self.$prevList) return;

    if(length === 0) {
      self.show();
      self.$prevList.css('display', 'none');
      return;
    }

    $li = self.$prevList.find('li');
    length = $li.length;

    cssParam = {
      left: 'auto',
      right: 'auto'
    };

    animParam = {
      zIndex: 0,
      opacity: 0
    };

    animParam[self.movingDirection] = -self.MOVE_VAL;

    $li.each(function(index) {
      $(this)
        .css(cssParam)
        .delay(index * self.MOVE_DELAY)
        .velocity(animParam, self.MOVE_SPEED, 'easeInSine', function() {
          if(index === length - 1) {
            self.$prevList.css('display', 'none');
          }
        });
      });
  },

  updateHandle: function() {
    var self = this;

    self.$targetHandle = self.$handleItem.filter('[data-target=' + self.targetId + ']');

    self.$handleItem
      .parent('li')
      .removeClass('is-current');

    self.$targetHandle
      .parent('li')
      .addClass('is-current');
  },

  updateTrigger: function() {
    var self = this;

    self.$ddTrigger
      .find('a')
        .stop(true, false)
        .velocity({
          opacity: 0
        }, 200, function() {

          self.$ddTrigger
            .find('a')
              .remove()
            .end()
              .append(self.$targetHandle.clone());

          self.$targetHandle
            .clone()
            .velocity({
              opacity: 1
            }, 200);
        });
  },

  setDropdownHeight: function() {
    var self = this;

    if(self.isMobile) {
      self.$ddWrap.height(self.$ddTrigger.height());
    } else {
      self.$ddWrap.removeAttr('style');
    }
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;

    self.setContentHeight();
    self.setDropdownHeight();

    if(self.prevMedia !== self.isMobile) {
      self.$handle
        .removeClass('is-open')
        .removeAttr('style');
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = NewsFilter;

},{}],15:[function(require,module,exports){
/**
 * Search news content function.
 */
var NewsLink = function() {
  this.init();
};

NewsLink.prototype = {

  init: function() {
    var self = this;

    $('.js-newsLink').each(function() {
      new NewsLinkUnit($(this));
    });
  }
};

/**
 * Replace image source unit function.
 */
var NewsLinkUnit = function($el) {
  this.$el = $el;
  this.init();
};

NewsLinkUnit.prototype = {

  init: function () {
    var self = this;

    self.setParam();
    self.fetch();
  },

  setParam: function() {
    var self = this
      , dateObj = new Date();

    self.LIMIT_YEAR = 1977;
    self.year = dateObj.getFullYear();
    self.url = self.$el.attr('href') + self.year + '/';
  },

  fetch: function() {
    var self = this;

    $.ajax({
      url: self.url,
      type: 'GET'
    })
    .done(function() {
      self.$el.attr('href', self.url);
    })
    .fail(function() {
      self.replaceUrl();
    });
  },

  replaceUrl: function() {
    var self = this
      , targetYear = self.url.match(/\d{4}/)[0]
      , prevYearUrl = self.url.replace(targetYear, targetYear - 1);

    if(targetYear <= self.LIMIT_YEAR) return;

    self.url = prevYearUrl;
    self.$el.attr('href', prevYearUrl);
    self.fetch();
  }

};

module.exports = NewsLink;

},{}],16:[function(require,module,exports){
/**
 * Replace background image function.
 */
var ReplaceBackground = function() {
  this.init();
};

ReplaceBackground.prototype = {

  init: function() {
    var self = this;

    $('.js-replaceBg').each(function() {
      new ReplaceBackgroundUnit($(this));
    });
  }
};

/**
 * Replace background image unit function.
 */
var ReplaceBackgroundUnit = function($el) {
  this.$el = $el;
  this.init();
};

ReplaceBackgroundUnit.prototype = {

  MOBILE_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
    self.imagePreload();
    self.changeSrc();
  },

  imagePreload: function() {
    var self = this;

    $('<img>').attr('src', self.srcL);
    $('<img>').attr('src', self.srcS);
  },

  setParam: function() {
    var self = this;

    self.srcL = self.$el.data('largeSrc');
    self.srcS = self.$el.data('smallSrc');
  },

  bindEvent: function() {
    var self = this;

    window.matchMedia(self.MOBILE_WIDTH)
      .addListener(function(){
        self.changeSrc();
      }, false);
  },

  changeSrc: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;

    if(self.isMobile) {
      self.$el.css('background-image', 'url('+ self.srcS +')');
    } else {
      self.$el.css('background-image', 'url('+ self.srcL +')');
    }
  }

};

module.exports = ReplaceBackground;

},{}],17:[function(require,module,exports){
/**
 * Replace image source function.
 */
var ReplaceImageSrc = function() {
  this.init();
};

ReplaceImageSrc.prototype = {

  init: function() {
    var self = this;

    $('.js-replaceSrc').each(function() {
      new ReplaceImageSrcUnit($(this));
    });
  }
};

/**
 * Replace image source unit function.
 */
var ReplaceImageSrcUnit = function($el) {
  this.$el = $el;
  this.init();
};

ReplaceImageSrcUnit.prototype = {

  MOBILE_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.setParam();
    self.bindEvent();
    self.imagePreload();
    self.changeSrc();
  },

  setParam: function() {
    var self = this;

    self.srcS = self.$el.data('src');
    self.srcL = self.$el.attr('src');
  },

  bindEvent: function() {
    var self = this;

    window.matchMedia(self.MOBILE_WIDTH)
      .addListener(function(){
        self.changeSrc();
      }, false);
  },

  imagePreload: function() {
    var self = this;

    $('<img>').attr('src', self.srcS);
  },

  changeSrc: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;

    if(self.isMobile) {
      self.$el.attr('src', self.srcS);
    } else {
      self.$el.attr('src', self.srcL);
    }
  }

};

module.exports = ReplaceImageSrc;

},{}],18:[function(require,module,exports){
/**
 * Social button function.
 */
var SocialButton = function() {
  this.init();
};

SocialButton.prototype = {

  init: function () {
    var self = this;

    self.setParam();
    self.eventHandler();
  },

  setParam: function() {
    var self = this;

    self.$el = $('.js-sns');
    self.$snsLink = self.$el.find('a');
  },

  eventHandler: function() {
    var self = this;

    self.$snsLink
      .off('click')
      .on('click', function() {
        var url = $(this).attr('href');
        window.open(url,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        return false;
      });
  }
};

module.exports = SocialButton;

},{}],19:[function(require,module,exports){
/**
 * To enable the only tel link when the smartphone function.
 */
var Tel = function(){
  this.init();
};

Tel.prototype = {
  init: function(){
    var self = this
      , ua = navigator.userAgent.toLowerCase()
      , isMobile = /iphone/.test(ua)||/android(.+)?mobile/.test(ua)
      , $tel = $('a[href^="tel:"]');

    if(!isMobile){
      $tel.each(function() {
        var $self = $(this)
          , $replace = $('<span>')
          , targetClass = $self.attr('class');

        $replace
          .html($self.html())
          .attr('class', targetClass);

        $self.replaceWith($replace);
      });

    }
  }
};

module.exports = Tel;

},{}],20:[function(require,module,exports){
/**
 * Top media function.
 */
var TopMedia = function() {
  this.init();
};

TopMedia.prototype = {

  MOBILE_WIDTH: '(max-width: 800px)',

  init: function () {
    var self = this;

    self.$el = $('#topMedia');
    if(self.$el.length ===0) return;

    self.setParam();
    self.bindEvent();
    self.setHeight();
  },

  setParam: function() {
    var self = this;

    self.$win = $(window);
    self.$header = $('#header');

    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;
    self.winW = window.innerWidth ? window.innerWidth : self.$win.width();

    self.pastWinW = self.winW;
    self.prevMedia = self.isMobile;
  },

  bindEvent: function() {
    var self = this;

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });
  },

  setHeight: function() {
    var self = this
      , afterH;

    if(!self.isMobile) {
      self.$el.removeAttr('style');
      return;
    }

    self.headerH = self.$header.height();
    self.winH = self.$win.height();

    afterH = self.winH - self.headerH;

    if(afterH < 350) {
      afterH = 350;
    }

    self.$el.height(afterH);
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;
    self.winW = window.innerWidth ? window.innerWidth : self.$win.width();

    if(self.pastWinW !== self.winW) {
      self.setHeight();
    }

    self.pastWinW = self.winW;
    self.prevMedia = self.isMobile;
  }
};

module.exports = TopMedia;

},{}],21:[function(require,module,exports){
/**
 * Top slide show function.
 */
var TopSlideShow = function() {
  this.init();
};

TopSlideShow.prototype = {

  AUTO_INTERVAL: 5000,
  SPEED: 1000,
  MOBILE_WIDTH: '(max-width: 800px)',

  init: function () {
    var self = this;

    self.$el = $('#topSlide');
    if(self.$el.length ===0) return;

    self.setParam();
    self.bindEvent();
    self.setUpSlide();
    self.updateCurrent();
  },

  setParam: function() {
    var self = this;

    self.$li = self.$el.find('li');
    self.$imgs = self.$el.find('img');
    self.$win = $(window);

    self.slideLength = self.$li.length;
    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;
    self.prevMedia = self.isMobile;
    self.currentNum = 0;
  },

  bindEvent: function() {
    var self = this;

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });

  },

  setUpSlide: function() {
    var self = this;

    self.$li
      .css('z-index', 0)
      .eq(self.currentNum)
      .css({
        zIndex: 2,
        opacity: 1
      });

    if(self.isMobile) {
      self.loop();
    }
  },

  loop: function() {
    var self = this;

    clearTimeout(self.autoTimer);
    self.autoTimer = setTimeout(function() {
      self.changeSlide();
      self.loop();
    }, self.AUTO_INTERVAL);
  },

  updateCurrent: function() {
    var self = this;

    self.$li.removeClass('is-current');
    self.$li.eq(self.currentNum).addClass('is-current');
  },

  changeSlide: function() {
    var self = this;

    self.currentNum += 1;

    if(self.slideLength - 1 < self.currentNum) {
      self.currentNum = 0;
    }

    self.updateCurrent();

    self.$li
      .eq(self.currentNum)
      .css({
        zIndex: 2,
        opacity: 0
      })
      .velocity({
        opacity: 1
      }, self.SPEED, function() {
        $(this).css('z-index', 1);
        self.$li.not('.is-current').css('z-index', 0);
      });
  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MOBILE_WIDTH).matches;

    if(self.prevMedia !== self.isMobile) {
      if(self.isMobile) {
        self.changeSlide();
        self.loop();
      } else {
        clearTimeout(self.autoTimer);
      }
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = TopSlideShow;

},{}],22:[function(require,module,exports){
/**
 * Topics panel function.
 */
var TopicsPanel = function() {
  this.init();
};

TopicsPanel.prototype = {

  MAX_WIDTH: '(max-width: 640px)',

  init: function () {
    var self = this;

    self.$el = $('#topicsPanel');
    if(self.$el.length ===0) return;

    self.setParam();
    self.bindEvent();
    self.afterLoaded();
  },

  setParam: function() {
    var self = this;

    self.$wrap = self.$el.find('.js-wrap');
    self.$render = self.$el.find('.js-render');
    self.$moreBtn = self.$el.find('.js-more');
    self.$win = $(window);

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;
    self.prevMedia = self.isMobile;
    self.isOpen = false;
  },

  bindEvent: function() {
    var self = this;

    self.$el.on('setUp', function() {
      self.afterLoaded();
    });

    self.$moreBtn.on('click', function(event) {
      event.preventDefault();
      self.onClick();
    });

    self.$win
      .on('resize', function() {
        clearTimeout(self.resizeTimer);
        self.resizeTimer = setTimeout(function() {
          self.onResize();
        }, 200);
      });

  },

  afterLoaded: function() {
    var self = this;

    self.$items = self.$el.find('.js-item');
    self.itemLength = self.$items.length;

    self.fillSpace();
    self.initSlide();
  },

  fillSpace: function() {
    var self = this
      , targetNum = Math.ceil(self.itemLength / 3) * 3
      , shortageNum = targetNum - self.itemLength;

    for (var i = 0; i < shortageNum; i++) {
      var $tmpl = $('<div class="topicsPanel-item js-item"><span></span></div>');
      self.$render.append($tmpl);
    };

    self.$totalItems = self.$el.find('.js-item');
    self.totalLength = targetNum;

    $(document).trigger('bindEvents');
  },

  onClick: function() {
    var self = this;

    if(self.$el.hasClass('is-open')) {
      self.$el.removeClass('is-open');
      self.isOpen = false;
      self.slideClose();
    } else {
      self.$el.addClass('is-open');
      self.isOpen = true;
      self.slideOpen();
    }
  },

  initSlide: function() {
    var self = this;

    if(self.totalLength < 7) {
      self.$el.addClass('is-btnHidden');
      self.$moreBtn.css('display', 'none');
    }

    self.setClosingHeight();
    self.updateHiddenItem();
  },

  setClosingHeight: function() {
    var self = this
      , spDisplayNum = (6 < self.itemLength) ? 6 : self.itemLength
      , pcItemH = self.$items.height()
      , spMinH = 0
      , spMaxH = 0;

    for(var i = 0; i < self.itemLength; i++) {
      var itemH = self.$items.eq(i).height();

      spMaxH += itemH;

      if(i < spDisplayNum) {
        spMinH += itemH;
      }
    }

    self.minH = self.isMobile ? spMinH : pcItemH * 2;
    self.maxH = self.isMobile ? spMaxH : pcItemH * Math.ceil(self.totalLength / 3);

    if(self.isOpen) {
      self.$wrap.height(self.maxH);
    } else {
      self.$wrap.height(self.minH);
    }
  },

  updateHiddenItem: function() {
    var self = this;

    self.$totalItems.css('visibility', 'visible');
    self.$hiddenItems = self.$render.find('.js-item:gt(5)');

    if(!self.isOpen) {
      self.$hiddenItems.css('visibility', 'hidden');
    }
  },

  slideOpen: function() {
    var self = this;

    if(self.isMoving) return;
    self.isMoving = true;

    self.$wrap
      .velocity({
        height: self.maxH
      }, 800, 'easeInOutCubic', function() {
        self.isMoving = false;
      });

    self.$hiddenItems
      .css({
        visibility: 'visible',
        opacity: 0
      })
      .velocity({
        opacity: 1
      }, 200);

  },

  slideClose: function() {
    var self = this;

    if(self.isMoving) return;
    self.isMoving = true;

    self.$wrap
      .velocity({
        height: self.minH
      }, 800, 'easeInOutCubic', function() {
        self.isMoving = false;
      });

    self.$hiddenItems
      .velocity({
        opacity: 0
      }, 800, function() {
        self.$hiddenItems.css('visibility', 'hidden');
      });

  },

  onResize: function() {
    var self = this;

    self.isMobile = window.matchMedia(self.MAX_WIDTH).matches;

    self.setClosingHeight();

    if(self.prevMedia !== self.isMobile) {
      self.updateHiddenItem();
    }

    self.prevMedia = self.isMobile;
  }

};

module.exports = TopicsPanel;

},{}]},{},[1]);
