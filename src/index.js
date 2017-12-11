var images = [];
var dir = 'data/shirt/'
var imageSize = '_200x200'
var pageIndex = 0
var casper = require('casper').create({
    pageSettings: {
        loadImages: true
    }
});

function getImages() {
    var images = document.querySelectorAll('#mainsrp-itemlist img');
    return Array.prototype.map.call(images, function (e) {
        return e.getAttribute('data-src');
    });
}

casper.start('https://www.taobao.com/', function () {
    this.waitForSelector('form[action="//s.taobao.com/search"]');
});

casper.then(function () {
    this.fill('form[action="//s.taobao.com/search"]', { q: '衬衫' }, true);
});

casper.then(function () {
    this.scrollToBottom()
    images = images.concat(this.evaluate(getImages));
});

casper.run(function () {
    for (var i = 0; i < images.length; i++) {
        if (images[i]) {
            this.download('http:' + images[i] + imageSize + '.jpg', dir + i + '.jpg');
        }
    }
    this.exit()
});