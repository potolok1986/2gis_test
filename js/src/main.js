$(function () {
    // проверяем наличие объекта и что он не пустой
    if (cards && cards.length) {
        // создаем экземпляр класса
        var myCards = new Cards("#cardsList", ".card_container", cards);
        // показываем все карточки
        myCards.cardsDisplay();
    }
});


