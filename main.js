        let isSpinning = false;
        let pvpGameTimer = 5;
        let pvpGameRunning = false;
        let pvpTimerInterval;
        let currentPlayerCount = 0;
        let currentBetIndex = 0;
        
        const prizes = ['Big Year', 'B-Day Candle', 'Crystal Ball', 'Bow Tie', 'Berry Box', 'Gem Signet', 'Candy Cane', 'Diamond Ring'];
        const betAmounts = [299, 599, 999, 9999];

        // Создание звездочек на фоне
        function createStars() {
            const starsContainer = document.getElementById('stars');
            for (let i = 0; i < 20; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.innerHTML = '✦';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                starsContainer.appendChild(star);
            }
        }

        // Обновление отображения ставки
        function updateBetDisplay() {
            const currentBet = betAmounts[currentBetIndex];
            document.getElementById('betAmount').textContent = `⭐ ${currentBet}`;
        }

        // Увеличение ставки
        function increaseBet() {
            if (currentBetIndex < betAmounts.length - 1) {
                currentBetIndex++;
                updateBetDisplay();
            }
        }

        // Уменьшение ставки
        function decreaseBet() {
            if (currentBetIndex > 0) {
                currentBetIndex--;
                updateBetDisplay();
            }
        }

        // Навигация между разделами
        function switchSection(sectionName) {
            // Скрыть все разделы
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Убрать активность у всех навигационных элементов
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Показать нужный раздел
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Активировать соответствующий навигационный элемент
            const navItem = document.querySelector(`[data-section="${sectionName}"]`);
            if (navItem) {
                navItem.classList.add('active');
            }

            // Управление PvP таймером
            if (sectionName === 'pvp') {
                if (currentPlayerCount >= 2) {
                    startPvpTimer();
                }
            } else {
                stopPvpTimer();
            }
        }

        // Обновление PvP интерфейса
        function updatePvpInterface() {
            const playerCountElement = document.getElementById('playerCount');
            const waitingArea = document.getElementById('pvpWaitingArea');
            const gameArea = document.getElementById('pvpGameArea');
            
            playerCountElement.textContent = `${currentPlayerCount} ИГРОКОВ`;
            
            if (currentPlayerCount >= 2) {
                waitingArea.style.display = 'none';
                gameArea.style.display = 'block';
                
                // Запустить таймер если находимся в PvP секции
                if (document.getElementById('pvp-section').classList.contains('active')) {
                    startPvpTimer();
                }
            } else {
                waitingArea.style.display = 'block';
                gameArea.style.display = 'none';
                stopPvpTimer();
            }
        }

        // Добавление игрока в PvP
        function addPlayerToPvp() {
            currentPlayerCount++;
            const currentBet = parseFloat(document.getElementById('totalBet').textContent);
            const newBet = currentBet + Math.random() * 50 + 10;
            document.getElementById('totalBet').textContent = newBet.toFixed(2) + ' TON';
            updatePvpInterface();
        }

        // Функции для Rolls секции
        function openPrizePool() {
            document.getElementById('prizePoolModal').classList.add('show');
        }

        function closePrizePool() {
            document.getElementById('prizePoolModal').classList.remove('show');
        }

        function spinWheel() {
            if (isSpinning) return;
            
            isSpinning = true;
            const wheel = document.getElementById('wheel');
            const wheelCenter = wheel.querySelector('.wheel-center');
            
            // Случайное количество оборотов + случайная позиция
            const spins = Math.floor(Math.random() * 5) + 5; // 5-10 оборотов
            const finalDegree = Math.floor(Math.random() * 360);
            const totalRotation = spins * 360 + finalDegree;
            
            wheelCenter.textContent = 'Крутится...';
            wheel.style.transform = `rotate(${totalRotation}deg)`;
            
            setTimeout(() => {
                // Определяем выигранный приз (8 сегментов)
                const segmentAngle = 360 / 8;
                const normalizedDegree = (360 - (finalDegree % 360)) % 360;
                const prizeIndex = Math.floor(normalizedDegree / segmentAngle);
                const wonPrize = prizes[prizeIndex];
                
                wheelCenter.textContent = 'Готово!';
                showResult(wonPrize);
                isSpinning = false;
            }, 3000);
        }

        function showResult(prize) {
            document.getElementById('popupTitle').innerHTML = '🎉 Поздравляем!';
            document.getElementById('prize').textContent = prize;
            document.getElementById('backdrop').classList.add('show');
            document.getElementById('resultPopup').classList.add('show');
        }

        function closePopup() {
            document.getElementById('backdrop').classList.remove('show');
            document.getElementById('resultPopup').classList.remove('show');
            document.querySelector('.wheel-center').textContent = 'Ожидание';
        }

        // Функции для PvP секции
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        function startPvpTimer() {
            if (pvpTimerInterval) clearInterval(pvpTimerInterval);
            pvpGameTimer = 5;
            pvpTimerInterval = setInterval(updatePvpTimer, 1000);
        }

        function stopPvpTimer() {
            if (pvpTimerInterval) {
                clearInterval(pvpTimerInterval);
                pvpTimerInterval = null;
            }
        }

        function updatePvpTimer() {
            const timerElement = document.getElementById('pvpTimer');
            if (timerElement) {
                timerElement.textContent = formatTime(pvpGameTimer);
                
                if (pvpGameTimer <= 0) {
                    startPvpGame();
                } else {
                    pvpGameTimer--;
                }
            }
        }

        function startPvpGame() {
            if (pvpGameRunning) return;
            
            clearInterval(pvpTimerInterval);
            pvpGameRunning = true;
            
            const roulette = document.getElementById('pvpRoulette');
            const timer = document.getElementById('pvpTimer');
            
            if (timer) timer.textContent = 'КРУТИМ...';
            
            // Случайный угол поворота
            const randomRotation = 1800 + Math.random() * 720;
            roulette.style.transform = `rotate(${randomRotation}deg)`;
            roulette.classList.add('spinning');
            
            // Показать результат через 3 секунды
            setTimeout(() => {
                showPvpResult();
                resetPvpGame();
            }, 3000);
        }

        function showPvpResult() {
            const winners = ['Игрок 1', 'Игрок 2', 'Игрок 3', 'CryptoKing', 'Максим'];
            const winner = winners[Math.floor(Math.random() * winners.length)];
            const currentBet = document.getElementById('totalBet').textContent;
            
            document.getElementById('winnerName').textContent = winner;
            document.getElementById('winAmount').textContent = `+${currentBet}`;
            document.getElementById('backdrop').classList.add('show');
            document.getElementById('pvpResultPopup').classList.add('show');
        }

        function closePvpResult() {
            document.getElementById('backdrop').classList.remove('show');
            document.getElementById('pvpResultPopup').classList.remove('show');
        }

        function resetPvpGame() {
            pvpGameRunning = false;
            pvpGameTimer = Math.floor(Math.random() * 10) + 5; // 5-15 секунд
            
            const roulette = document.getElementById('pvpRoulette');
            const timer = document.getElementById('pvpTimer');
            
            setTimeout(() => {
                roulette.classList.remove('spinning');
                roulette.style.transform = 'rotate(0deg)';
                if (timer) timer.textContent = formatTime(pvpGameTimer);
                
                // Сброс счетчика игроков и ставок после игры
                currentPlayerCount = 0;
                document.getElementById('totalBet').textContent = '0.00 TON';
                updatePvpInterface();
            }, 1000);
        }

        // Event listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Навигация
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    const section = item.getAttribute('data-section');
                    if (section) {
                        switchSection(section);
                    }
                });
            });

            // Кнопки управления ставкой
            const increaseBetBtn = document.getElementById('increaseBet');
            const decreaseBetBtn = document.getElementById('decreaseBet');
            
            if (increaseBetBtn) {
                increaseBetBtn.addEventListener('click', increaseBet);
            }
            
            if (decreaseBetBtn) {
                decreaseBetBtn.addEventListener('click', decreaseBet);
            }

            // PvP кнопки
            const addBetBtn = document.getElementById('addBet');
            if (addBetBtn) {
                addBetBtn.addEventListener('click', addPlayerToPvp);
            }

            const joinGameBtn = document.getElementById('joinGame');
            if (joinGameBtn) {
                joinGameBtn.addEventListener('click', () => {
                    if (currentPlayerCount < 6) {
                        addPlayerToPvp();
                        alert('Вы присоединились к игре!');
                    } else {
                        alert('Игра заполнена. Максимум 6 игроков.');
                    }
                });
            }

            // Инициализация
            createStars();
            updateBetDisplay();
            updatePvpInterface();
        });