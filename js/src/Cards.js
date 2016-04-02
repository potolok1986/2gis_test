var cardsAPI = {
        // Функция которая показывает все карточки
        cardsDisplay: function (historyState) {
            // компилируем шаблон
            var template = Handlebars.compile($(this.scriptId).html());
            // добовляем скомпилированный шаблон в DOM
            // превварительно очистив от предыдущих
            $(this.$container).find("*:not(script)").remove().end()
                .append(template(historyState || this.cardsList));
        },
        // обработчкики всесобытий
        controlEvents: function () {
            var newCardsList = this.cardsList;
            return {
                _deleteCard: function () {
                    newCardsList.cards.pop();
                },
                _addCardNarrow: function () {
                    newCardsList.cards.push({type:"narrow"})
                },
                _addCardWide: function () {
                    newCardsList.cards.push({type:"wide"})
                }
            }
        },
        addControlEvents: function () {
            // регистрируем хелпер который добовляет еденицу к индексу
            // что-бы корректно отображались номера всех карточек
            Handlebars.registerHelper("inc", function (value) {
                return parseInt(value) + 1;
            });

            var $this = this,
                event = $this.controlEvents();
            // обработчик нажатия клика мыши
            $(this.$container).on("click", function (e) {
                e.preventDefault();
                if (e.shiftKey && e.altKey) {
                    event._addCardWide();
                }else if (e.shiftKey) {
                    event._addCardNarrow();
                } else {
                    event._deleteCard();
                }
                // после каждого изменения заносим измененный объект в историю
                history.pushState($this.cardsList,"");
                // показываем результат после изменения
                $this.cardsDisplay();
                // добавляем класс hover при покидании курсором контейнера
            }).mouseleave(function(){
                $(this).parent().addClass("hover");
            }).mouseenter(function () {
                $(this).parent().removeClass("hover");
            });
            $(window).on("popstate", function() {
                // при изменении истории выводим заранее
                // запомненное состояние объекта содержащего количество карточек
                if(history.state){
                    $this.cardsDisplay(history.state)
                }
            });
        }
    },
// конструктор класса
    Cards = function (scriptId, container, cards) {
        this.scriptId = scriptId;
        this.$container = container;
        this.cardsList = {"cards": cards};
        // запоменаем  текущее состояние истории
        history.replaceState(this.cardsList,"");
        // запускаем все события для окна
        this.addControlEvents();
    };
Cards.prototype = cardsAPI;
