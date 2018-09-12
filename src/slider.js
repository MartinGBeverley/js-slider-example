'use strict';
var slider = (function () {
  var fields = {};

  function initialiseSlider() {
    fields.target.style.width = fields.size.width + 'px';
    fields.target.style.height = fields.size.height + 'px';

    fields.slides.forEach(buildSlideElement);
  }

  function buildSlideElement(slide) {
    var listItem = buildListItem(slide);
    var container = buildContainer();
    var hyperlink = buildHyperlink(slide);
    var image = buildImage(slide);
    var title = buildTitle(slide);

    hyperlink.appendChild(image);
    hyperlink.appendChild(title);

    container.appendChild(hyperlink);

    listItem.appendChild(container);

    fields.target.appendChild(listItem);
  }

  function buildListItem(slide) {
    var listItem = document.createElement('li');
    listItem.setAttribute('id', slide.id);
    listItem.setAttribute('class', 'slide');
    listItem.style.width = fields.size.width + 'px';
    listItem.style.height = fields.size.height + 'px';

    listItem.addEventListener('animationend', function(event) {
      if (event.animationName != null && event.animationName.indexOf('slidein') > -1) {
        fields.slideshowTimeoutId = setTimeout(continueAnimation, fields.interval);
      }
    });

    return listItem;
  }

  function buildContainer() {
    var container = document.createElement('div');
    container.setAttribute('class', 'slide-content');
    return container;
  }

  function buildHyperlink(slide) {
    var hyperlink = document.createElement('a');
    hyperlink.setAttribute('href', slide.clickurl);
    return hyperlink;
  }

  function buildImage(slide) {
    var image = document.createElement('img');
    image.setAttribute('src', slide.imgurl);
    image.setAttribute('class', 'slide-image');
    return image;
  }

  function buildTitle(slide) {
    var title = document.createElement('span');
    title.setAttribute('class', 'slide-title');
    title.innerHTML = slide.title;
    return title;
  }

  function startSlideshow(){
    fields.activeSlideIndex = 0;
    fields.activeSlide = document.getElementById(fields.slides[fields.activeSlideIndex].id);

    if (fields.activeSlide == null) {
      throw "Cannot find first slide";
    }

    fields.activeSlide.setAttribute('class', 'slide active-slide');

    fields.slideshowTimeoutId = setTimeout(continueAnimation, fields.interval);
  }

  function stopSlideshow(){
    clearTimeout(fields.slideshowTimeoutId);
  }

  function getSlideInAnimationClass(){
    // Switch statement allows for an extension to further slide directions and allows a default for invalid values.
    switch (fields.direction) {
      case 'left':
        return 'active-slide-in--left';
      case 'right':
        return 'active-slide-in--right';
      default:
        return 'active-slide-in--right';
    }
  }

  function getSlideOutAnimationClass(){
    switch (fields.direction) {
      case 'left':
        return 'previous-slide-out--left';
      case 'right':
        return 'previous-slide-out--right';
      default:
        return 'previous-slide-out--right';
    }
  }

  function continueAnimation(){
    var slideInClass = getSlideInAnimationClass();
    var slideOutClass = getSlideOutAnimationClass();

    fields.slides.forEach(function(slide) {
      var element = document.getElementById(slide.id);
      element.setAttribute('class', 'slide');
    });

    var previousSlide = fields.activeSlide;

    fields.activeSlideIndex += 1;
    var currentSlide = fields.slides[fields.activeSlideIndex];
    if (currentSlide == null) {
      fields.activeSlideIndex = 0;
    }

    fields.activeSlide = document.getElementById(fields.slides[fields.activeSlideIndex].id);

    previousSlide.setAttribute('class', 'slide previous-slide ' + slideOutClass);
    fields.activeSlide.setAttribute('class', 'slide active-slide ' + slideInClass);
  }

  var slider = function Slider(target, config) {
    // The following exceptions would be replaced with something more meaningful in a full scale project.
    if (target == null || !target instanceof HTMLElement || target.tagName !== 'UL') {
      throw 'Invalid target';
    }
    if (config == null || typeof config !== 'object') {
      throw 'Config invalid';
    }

    // All default values are arbitrary but different to the values in the provided config for this test.
    fields.target = target;
    fields.size = config.size || {
      width: 500,
      height: 500
    };
    fields.interval = config.interval || 5000;
    fields.direction = config.direction || 'right';
    fields.slides = config.slides || [];

    this.startSlideshow = startSlideshow;
    this.stopSlideshow = stopSlideshow;
    initialiseSlider();
  }

  return slider;
})();
