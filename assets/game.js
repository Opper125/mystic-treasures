document.addEventListener('DOMContentLoaded', () => {
    let balance = 0;
    const gameId = localStorage.getItem('gameId') || generateGameId();
    localStorage.setItem('gameId', gameId);
    document.getElementById('gameId').textContent = gameId;
    updateBalance();

    const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3')];
    const symbols = ['💰', '💎', '⭐', '⚜️', '🗝️'];
    const spinBtn = document.getElementById('spinBtn');

    spinBtn.addEventListener('click', spinReels);

    function generateGameId() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function updateBalance() {
        fetch('/.netlify/functions/data', {
            method: 'POST',
            body: JSON.stringify({ action: 'getBalance', gameId })
        })
        .then(res => res.json())
        .then(data => {
            balance = data.balance || 0;
            document.getElementById('balance').textContent = `${balance} MMK`;
        });
    }

    function spinReels() {
        if (balance < 10000) {
            alert('Balance မလုံလောက်ပါ။ ငွေသွင်းပါ။');
            return;
        }
        spinBtn.disabled = true;
        reels.forEach(reel => reel.classList.add('spinning'));

        setTimeout(() => {
            reels.forEach(reel => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                reel.classList.remove('spinning');
            });
            checkWin();
            spinBtn.disabled = false;
        }, 2000);
    }

    function checkWin() {
        const result = [reels[0].textContent, reels[1].textContent, reels[2].textContent];
        balance -= 10000; // Bet Amount
        if (result[0] === result[1] && result[1] === result[2]) {
            balance += 1000000;
            alert('အနိုင်ရရှိပါသည်! +1000000 MMK');
        } else {
            alert('အရှုံးပါ။ -10000 MMK');
        }
        updateServerBalance();
    }

    function updateServerBalance() {
        fetch('/.netlify/functions/data', {
            method: 'POST',
            body: JSON.stringify({ action: 'updateBalance', gameId, balance })
        }).then(() => updateBalance());
    }
});
