const fs = require('fs');

exports.handler = async (event) => {
    const { action, gameId, amount, balance } = JSON.parse(event.body);
    let data = {};
    try {
        data = JSON.parse(fs.readFileSync('./data-store.json', 'utf8')) || {};
    } catch (e) {
        data = {};
    }

    if (!data[gameId]) {
        data[gameId] = { balance: 0, history: [] };
    }

    switch (action) {
        case 'getBalance':
            return {
                statusCode: 200,
                body: JSON.stringify(data[gameId])
            };
        case 'updateBalance':
            data[gameId].balance = balance;
            data[gameId].history.push(`[${new Date().toLocaleString('my-MM')}] Balance Updated: ${balance} MMK`);
            break;
        case 'deposit':
            data[gameId].balance += amount;
            data[gameId].history.push(`[${new Date().toLocaleString('my-MM')}] Deposited: ${amount} MMK`);
            break;
        case 'withdraw':
            if (data[gameId].balance >= amount) {
                data[gameId].balance -= amount;
                data[gameId].history.push(`[${new Date().toLocaleString('my-MM')}] Withdrawn: ${amount} MMK`);
                return { statusCode: 200, body: JSON.stringify({ success: true }) };
            }
            return { statusCode: 200, body: JSON.stringify({ success: false }) };
    }

    fs.writeFileSync('./data-store.json', JSON.stringify(data));
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
