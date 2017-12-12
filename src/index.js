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

Array.prototype.unique = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
     if(!json[this[i]]){
      res.push(this[i]);
      json[this[i]] = 1;
     }
    }
    return res;
   }

casper.start('https://www.taobao.com/', function () {
    this.waitForSelector('form[action="//s.taobao.com/search"]');
});

casper.then(function () {
    this.fill('form[action="//s.taobao.com/search"]', { q: '衬衫' }, true);
});

casper.then(function () {
    this.waitForSelector('#mainsrp-sortbar')
});

casper.then(function () {
    this.click('a[data-value="sale-desc"]')
    this.wait(2000)
})

for (var j = 0; j < 100; j++) {
    casper.then(function () {
        if (j > 0) this.clickLabel('下一页', 'span')
        this.wait(1000, function () {
            this.scrollToBottom()
            images = images.concat(this.evaluate(getImages));
        })
    });
}


casper.run(function () {
    images = images.unique()
    for (var i = 0; i < images.length; i++) {
        if (images[i]) {
            this.download('http:' + images[i] + imageSize + '.jpg', dir + i + '.jpg');
        }
    }
    this.exit()
});