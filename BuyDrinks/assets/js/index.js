class Item {
    constructor(g) {
        this.information = g;
        this.quantity = 0;
    }

    getTotalPrice() {
        return this.information.price * this.quantity;
    }

    isChosen() {
        return this.quantity > 0;
    }

    increase() {
        this.quantity++;
    }

    decrease() {
        if (this.quantity === 0) {
            return;
        }

        this.quantity--;
    }
}

class Data {
    constructor() {
        var items = [];
        for (var i = 0; i < goods.length; i++) {
            var item = new Item(goods[i]);
            items.push(item);
        }

        this.items = items;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    getTotalPrice() {
        var sum = 0;
        for (var i = 0; i < this.items.length; i++) {
            var g = this.items[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }

    increase(index) {
        this.items[index].increase();
    }

    decrease(index) {
        this.items[index].decrease();
    }

    getTotalQuantity() {
        var sum = 0;
        for (var i = 0; i < this.items.length; i++) {
            sum += this.items[i].quantity;
        }
        return sum;
    }

    isDeliveryThresholdAchieved() {
        return this.getTotalPrice() > this.deliveryThreshold;
    }

    isDeliveryThresholdAchieved() {
        return this.getTotalPrice() > this.deliveryThreshold;
    }

    isAnyItemChosen() {
        return this.getTotalQuantity() > 0;
    }
}

class UserInterface {
    constructor() {
        this.data = new Data();
        this.doms = {
            itemContainer: document.querySelector('.goods-list'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            deliveryThreshold: document.querySelector('.footer-pay span'),
            totalPrice: document.querySelector('.footer-car-total'),
            cart: document.querySelector('.footer-car'),
            cartBadge: document.querySelector('.footer-car-badge')
        }

        var cartRect =  this.doms.cart.getBoundingClientRect();
        var jumpTarget = {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 5
        }
        this.jumpTarget = jumpTarget;

        this.createHTML();
        this.updateFooter();
        this.listEvents();
    }

    listEvents() {
        // Animation end event of cart 
        this.doms.cart.addEventListener('animationend', function() {
            this.classList.remove('animate');
        })

        // Click event of '+' and '-' buttons
        var that = this;
        this.doms.itemContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('i-jiajianzujianjiahao')) {
                that.increase(e.target.getAttribute('index'));
            }
            else if (e.target.classList.contains('i-jianhao')){
                that.decrease(e.target.getAttribute('index'));
            }
        })
    }

    createHTML() {
        var html = '';
        for (var i = 0; i < this.data.items.length; i++) {
            var g = this.data.items[i];
            html += `<div class="goods-item">
                <img src="${g.information.pic}" alt="" class="goods-pic" />
                <div class="goods-info">
                <h2 class="goods-title">${g.information.title}</h2>
                <p class="goods-desc">${g.information.desc}</p>
                <p class="goods-sell">
                    <span>月售 ${g.information.sellNumber}</span>
                    <span>好评率${g.information.favorRate}%</span>
                </p>
                <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">￥</span>
                        <span>${g.information.price}</span>
                    </p>
                    <div class="goods-btns">
                        <i index=${i} class="iconfont i-jianhao"></i>
                        <span>${g.quantity}</span>
                        <i index=${i} class="iconfont i-jiajianzujianjiahao"></i>
                    </div>
                </div>
                </div>
            </div>`;
        }

        this.doms.itemContainer.innerHTML = html;
    }

    increase(index) {
        this.data.increase(index);
        this.updateItemUI(index);
        this.updateFooter();
        this.jump(index);
    }

    decrease(index) {
        this.data.decrease(index);
        this.updateItemUI(index);
        this.updateFooter();
    }

    updateItemUI(index) {
        var itemDom = this.doms.itemContainer.children[index];
        if (this.data.items[index].isChosen()) {
            itemDom.classList.add('active');
        }
        else {
            itemDom.classList.remove('active');
        }
        
        var quantitySpan = itemDom.querySelector('.goods-btns span');
        quantitySpan.textContent = this.data.items[index].quantity;
    }

    updateFooter() {
        var total = this.data.getTotalPrice();
        this.doms.deliveryPrice.textContent = `配送费￥${this.data.deliveryPrice}`;
        if (this.data.isDeliveryThresholdAchieved()) {
            this.doms.footerPay.classList.add('active');
        }
        else {
            this.doms.footerPay.classList.remove('active');
            var difference = Math.round(this.data.deliveryThreshold - total);
            this.doms.deliveryThreshold.textContent = `还差￥${difference}元起送`;
        }
        this.doms.totalPrice.textContent = total.toFixed(2);

        if (this.data.isAnyItemChosen()) {
            this.doms.cart.classList.add('active');
        }
        else {
            this.doms.cart.classList.remove('active');
        }

        this.doms.cartBadge.textContent = `${this.data.getTotalQuantity()}`;
    }

    addCartAnimation() {
        this.doms.cart.classList.add('animate');
    }

    jump(index) {
        var btnAdd = this.doms.itemContainer.children[index].querySelector('.i-jiajianzujianjiahao');
        var rect = btnAdd.getBoundingClientRect();
        var start = {
            x: rect.left,
            y: rect.top
        };
         
        // Start to jump
        var div = document.createElement('div');
        div.className = 'add-to-car';
        var i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';

        // Set initial position
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;
        div.append(i);
        document.body.appendChild(div);

        // Force to render (read any layout attribute will lead to reflow)
        div.clientWidth;

        // Set end position
        div.style.transform = `translateX(${this.jumpTarget.x}px)`; 
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;

        var that = this;
        div.addEventListener('transitionend', function() {
            div.remove();
            that.addCartAnimation();
        }, {
            once: true // event only happens once
        })
    }
}

var ui = new UserInterface();

// .getBoundingClientRect() - get the position of element
// .toFixed(2) - set the decimal places
// .clientWidth - ready layout attribute which will cause a reflow
// .addEventListener('animationend') - add event listener after animation ends
// .addEventListener('transitionend') - add event listener after transition ends
// local "this"
// e.target.getAttribute('xxx') - get the attribute
// e.code - (for keydown / keypress event) - which key is pressed