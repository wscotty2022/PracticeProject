// // 避免数据冗余 VS 效率变低(method) （衡量和妥协)
// // 永远先不要考虑效率
// function UIGoods(goods) {
//     this.data = goods;
//     this.choose = 3;
// }

// // Get total price
// UIGoods.prototype.getTotalPrice = function () {
//     return this.data.price * this.choose;
// };

// // Is item selected?
// UIGoods.prototype.isChosen = function () {
//     return this.choose > 0;
// }

// Data of single item
class UIGoods {
    constructor(g) {
        this.data = g;
        this.choose = 0;
    }

    // Get total price
    getTotalPrice() {
        return this.data.price * this.choose;
    }

    // Is item selected?
    isChosen() {
        return this.choose > 0;
    }

    increase() {
        this.choose++;
    }

    decrease() {
        if(this.choose === 0) {
            return;
        }
        this.choose--;
    }
}

// General data on the screen
class UIData {
    constructor() {
        var uiGoods = [];
        for(var i = 0; i<goods.length; i++) {
            var uig = new UIGoods(goods[i]);
            uiGoods.push(uig)
        }

        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    getTotalPrice() {
        var sum = 0;
        for(var i = 0; i < this.uiGoods.length; i++) {
            var g = this.uiGoods[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }

    increase(index)  {
        this.uiGoods[index].increase();
    }

    decrease(index)  {
        this.uiGoods[index].decrease();
    }

    getTotalChooseNumber() {
        var sum = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            sum += this.uiGoods[i].choose;
        }
        return sum;
    }

    hasGoodsInCar() {
        return this.getTotalChooseNumber() > 0;
    }

    isDeliveryThresholdPassed() {
        return this.getTotalChooseNumber() >= this.deliveryThreshold;
    }
}

class UI {
    constuctor(){
        this.uiData = new UIData();
        this.dom = {
            goodsContainer: document.querySelector('.goods-list'),
            goodsContainer: document.querySelector('.goods-list')
        }
    }
}

var ui = new UI();