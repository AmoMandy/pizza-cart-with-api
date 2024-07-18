document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCartAPI', function () {
        return {
            pizzas: [],
            username: '',
            loggedIn: false,
            cart: [],
            cartCode: '',
            totals: {
                small: 0,
                medium: 0,
                large: 0,
                total: 0,
            },

            paymentMessage: '',
            init() {
                // create (){}
                if (this.loggedIn) {
                    const url = `https://pizza-api.projectcodex.net/api/pizzas`;
                    axios.get(url).then((result) => {
                        const pizzas = result.data.pizzas;
                        pizzas[0].price = 129;
                        pizzas[1].price = 79;
                        pizzas[2].price = 49;

                        this.pizzas = pizzas;
                    }).catch((error) => {
                        // console.error('Error fetching pizzas:', error);
                    });
                } else {
                    console.log('Not logged in!');
                }

            },
            createPizzaCart() {
                axios.get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`).then(res => {
                    this.cartCode = res.data.cart_code;
                })
            },
            showPizzaMenu(){
                const url = `https://pizza-api.projectcodex.net/api/pizzas`;
                    axios.get(url).then((result) => {
                        const pizzas = result.data.pizzas;
                        this.pizzas = pizzas;
                    }).catch((error) => {
                        // console.error('Error fetching pizzas:', error);
                    });
            },
            addToCart(pizza) {
                const existingPizza = this.cart.find(item => item.id === pizza.id);
                if (existingPizza) {
                    existingPizza.quantity++;
                } else {
                    this.cart.push({ ...pizza, quantity: 1 });
                }
                this.updateTotals();
            },
            removeFromCart(index) {
                this.cart[index].quantity--;
                if (this.cart[index].quantity === 0) {
                    this.cart.splice(index, 1);
                }
                this.updateTotals();
            },

            updateTotals() {
                this.totals = this.cart.reduce((acc, pizza) => {
                    acc[pizza.size]++;
                    acc.total += pizza.price * pizza.quantity;
                    return acc;
                }, { small: 0, medium: 0, large: 0, total: 0 });
            },
            processPayment() {
                const paymentInput = document.querySelector('input[type="number"]');
                const paymentAmount = parseFloat(paymentInput.value);

                if (paymentAmount >= this.totals.total) {
                    const change = paymentAmount - this.totals.total;
                    this.paymentMessage = "Enjoy your pizzas! Change: R" + change.toFixed(2);
                    this.cart = [];
                    this.totals = {
                        small: 0,
                        medium: 0,
                        large: 0,
                        total: 0
                    };
                    paymentInput.value = '';
                } else {
                    this.paymentMessage = "Sorry - that is not enough money!";
                }

                setTimeout(() => {
                    this.paymentMessage = "";
                }, 3000);
            },
            showOrders() {
                // Implement the function to show historical orders
            },

            login() {
                // if(this.username.length > 2) {
                //     localStorage['username'] = this.username;
                //     this.createcart();
                // }else {
                //     alert("Username is too short");
                // }
                if (this.username) {
                    this.createPizzaCart();
                    this.showPizzaMenu();
                    this.loggedIn = true;
                }
            },

            logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cart = '';
                    localStorage['cart'] = '';
                    localStorage['username'] = '';
                }
                // this.loggedIn = false;
                // this.username = '';
            }
            // addToCart(index) {
            //     this.cart[index].quantity--;
            //     if (this.cart[index].quantity === 0) {
            //         this.cart.splice(index, 1);
            //     }
            //     this.updateTotals();
            // }
        }

    });
});


