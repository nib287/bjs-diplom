"use strict"

const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout(response => { 
    if (response.success === true) {
        location.reload();
    }
});

ApiConnector.current(response => {
    if(response) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
const getExchangeRate = () => {
    ApiConnector.getStocks(response => {
        if (response) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getExchangeRate();

setInterval(getExchangeRate, 10000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, response => {
        if (response.success  === false) {
            const error = new Error();
            moneyManager.setMessage(error, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(null, "Баланс пополнен");
        }
    });
}

moneyManager.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, response => {
        if (response.success  === false) {
            const error = new Error();
            moneyManager.setMessage(error, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(null, "Конвертация валют прошла успешно");
        }
    });
}

moneyManager.sendMoneyCallback = (data) => {
    ApiConnector.transferMoney(data, response => {
        if (response.success  === false) {
            const error = new Error();
            moneyManager.setMessage(error, response.data);
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(null, "Перевод прошел успешно");
        }
    });
}

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success  === false) {
            const error = new Error();
            favoritesWidget.setMessage(error, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(null, "Пользователь добавлен");
        }
    });  
}

favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success  === false) {
            const error = new Error();
            favoritesWidget.setMessage(error, response.data);
        } else {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(null, "Пользователь удален");
        }
    });
}