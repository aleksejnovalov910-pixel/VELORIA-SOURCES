var shop = new Vue({
    el: ".shop",
    data: {
        active: true,
		currentTab: 0,
		header: "SHARP MARKET",
		street: "ВАЙНВУД ХИЛЛЗ",
		items: [
			// [
			  // {type: 4, title: 'Монтировка', price: 150},
			  // {type: 5, title: 'Молоток', price: 150},
			  // {type: 6, title: 'Гаечный ключ', price: 150},
			  // {type: 7, title: 'Канистра бензина', price: 150},
			  // {type: 8, title: 'Связка ключей', price: 150}
			// ],
			// [
			  // {type: 4, title: 'Монтировка', price: 150},
			  // {type: 5, title: 'Молоток', price: 150},
			// ],
			// [
			  // {type: 6, title: 'Гаечный ключ', price: 150},
			  // {type: 7, title: 'Канистра бензина', price: 150},
			  // {type: 8, title: 'Связка ключей', price: 150}
			// ],
			// [
			  // {type: 6, title: 'Гаечный ключ', price: 150},
			  // {type: 8, title: 'Связка ключей', price: 150}
			// ]
		],
		basket: [ ],
    },
    methods: {
        current: function(id){
            this.currentTab = id;
        },
		buy: function(index) {
			mp.events.call('menu', 'shop', index);
		},
		exit: function() {
			mp.events.call('Close_new_shop');
		}
    }
})