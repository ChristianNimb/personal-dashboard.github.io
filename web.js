 // Quotes
        const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
            { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
            { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
            { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" },
            { text: "Java is to JavaScript what car is to Carpet.", author: "Chris Heilmann" },
            { text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
            { text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.", author: "Antoine de Saint-Exupery" },
            { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
            { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
            { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" },
            { text: "It's not a bug – it's an undocumented feature.", author: "Anonymous" },
            { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
            { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
            { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" }
        ];

        // Themes
        const themes = {
            gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            gradient6: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            updateClock();
            setInterval(updateClock, 1000);
            updateGreeting();
            loadWeather();
            loadQuote();
            loadTodos();
            loadLinks();
            loadTheme();
            
            document.getElementById('todo-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') addTodo();
            });

            document.getElementById('search-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        });

        // Search
        function performSearch() {
            const query = document.getElementById('search-input').value.trim();
            if (query) {
                if (query.includes('.') && !query.includes(' ')) {
                    window.location.href = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                }
            }
        }

        // Clock & Greeting
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
            
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
        }

        function updateGreeting() {
            const hour = new Date().getHours();
            const name = localStorage.getItem('userName') || 'there';
            let greeting = 'Good Evening';
            
            if (hour < 12) greeting = 'Good Morning';
            else if (hour < 18) greeting = 'Good Afternoon';
            
            document.getElementById('greeting').textContent = `${greeting}, ${name}`;
        }

        function updateName() {
            const name = document.getElementById('name-input').value.trim();
            if (name) {
                localStorage.setItem('userName', name);
                updateGreeting();
                document.getElementById('name-input').value = '';
            }
        }

        // Weather
        async function loadWeather() {
            const city = localStorage.getItem('weatherCity') || 'London';
            try {
                const response = await fetch(`https://wttr.in/${city}?format=j1`);
                const data = await response.json();
                
                const temp = data.current_condition[0].temp_C;
                const condition = data.current_condition[0].weatherDesc[0].value;
                const weatherCode = data.current_condition[0].weatherCode;
                
                document.getElementById('weather-temp').textContent = `${temp}°C`;
                document.getElementById('weather-location').textContent = city;
                document.getElementById('weather-condition').textContent = condition;
                document.getElementById('weather-icon').textContent = getWeatherIcon(weatherCode);
            } catch (error) {
                console.error('Weather fetch failed:', error);
                document.getElementById('weather-temp').textContent = '--°';
                document.getElementById('weather-location').textContent = 'Weather unavailable';
            }
        }

        function getWeatherIcon(code) {
            const icons = {
                113: '☀️', 116: '⛅', 119: '☁️', 122: '☁️', 143: '🌫️',
                176: '🌦️', 179: '🌨️', 182: '🌨️', 185: '🌨️', 200: '⛈️',
                227: '🌨️', 230: '❄️', 248: '🌫️', 260: '🌫️', 263: '🌦️',
                266: '🌦️', 281: '🌨️', 284: '🌨️', 293: '🌧️', 296: '🌧️',
                299: '🌧️', 302: '🌧️', 305: '🌧️', 308: '🌧️', 311: '🌨️',
                314: '🌨️', 317: '🌨️', 320: '🌨️', 323: '🌨️', 326: '🌨️',
                329: '❄️', 332: '❄️', 335: '❄️', 338: '❄️', 350: '🌨️',
                353: '🌦️', 356: '🌧️', 359: '🌧️', 362: '🌨️', 365: '🌨️',
                368: '🌨️', 371: '❄️', 374: '🌨️', 377: '🌨️', 386: '⛈️',
                389: '⛈️', 392: '⛈️', 395: '❄️'
            };
            return icons[code] || '🌤️';
        }

        function updateWeatherLocation() {
            const location = document.getElementById('weather-location-input').value.trim();
            if (location) {
                localStorage.setItem('weatherCity', location);
                loadWeather();
                document.getElementById('weather-location-input').value = '';
            }
        }

        // Quotes
        function loadQuote() {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('quote-text').textContent = `"${quote.text}"`;
            document.getElementById('quote-author').textContent = `— ${quote.author}`;
        }

        // Todos
        function loadTodos() {
            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            
            todos.forEach((todo, index) => {
                const todoItem = document.createElement('div');
                todoItem.className = 'todo-item';
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <button class="delete-todo" onclick="deleteTodo(${index})">Delete</button>
                `;
                todoList.appendChild(todoItem);
            });
        }

        function addTodo() {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            
            if (text) {
                const todos = JSON.parse(localStorage.getItem('todos') || '[]');
                todos.push({ text, completed: false });
                localStorage.setItem('todos', JSON.stringify(todos));
                input.value = '';
                loadTodos();
            }
        }

        function toggleTodo(index) {
            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            todos[index].completed = !todos[index].completed;
            localStorage.setItem('todos', JSON.stringify(todos));
            loadTodos();
        }

        function deleteTodo(index) {
            const todos = JSON.parse(localStorage.getItem('todos') || '[]');
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            loadTodos();
        }

        // Quick Links
        function loadLinks() {
            const defaultLinks = [
                { name: 'GitHub', url: 'https://github.com', icon: '💻' },
                { name: 'Gmail', url: 'https://gmail.com', icon: '📧' },
                { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
                { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
                { name: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
                { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' }
            ];
            
            const links = JSON.parse(localStorage.getItem('links') || JSON.stringify(defaultLinks));
            const linksGrid = document.getElementById('links-grid');
            linksGrid.innerHTML = '<div class="link-item add-link-btn" onclick="openAddLinkModal()">+</div>';
            
            links.forEach((link, index) => {
                const linkItem = document.createElement('a');
                linkItem.className = 'link-item';
                linkItem.href = link.url;
                linkItem.target = '_blank';
                linkItem.innerHTML = `
                    <div class="link-icon">${link.icon}</div>
                    <div class="link-name">${link.name}</div>
                `;
                linksGrid.insertBefore(linkItem, linksGrid.lastChild);
            });
        }

        function openAddLinkModal() {
            document.getElementById('add-link-modal').classList.add('show');
        }

        function closeAddLinkModal() {
            document.getElementById('add-link-modal').classList.remove('show');
            document.getElementById('link-name').value = '';
            document.getElementById('link-url').value = '';
            document.getElementById('link-icon').value = '';
        }

        function saveLink() {
            const name = document.getElementById('link-name').value.trim();
            const url = document.getElementById('link-url').value.trim();
            const icon = document.getElementById('link-icon').value.trim() || '🔗';
            
            if (name && url) {
                const links = JSON.parse(localStorage.getItem('links') || '[]');
                links.push({ name, url, icon });
                localStorage.setItem('links', JSON.stringify(links));
                closeAddLinkModal();
                loadLinks();
            }
        }

        // Settings
        function toggleSettings() {
            document.getElementById('settings-panel').classList.toggle('open');
        }

        function uploadBackgroundImage() {
            const fileInput = document.getElementById('bg-file-upload');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select an image first!');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file!');
                return;
            }

            // Check file size (limit to 5MB for performance)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image is too large! Please choose an image under 5MB.');
                return;
            }

            const reader = new FileReader();
            
            reader.onload = function(e) {
                const base64Image = e.target.result;
                document.body.style.background = `url('${base64Image}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                localStorage.setItem('customBg', base64Image);
                localStorage.removeItem('theme');
                updateThemeSelection();
                
                // Show success feedback
                const uploadBtn = event.target;
                const originalText = uploadBtn.textContent;
                uploadBtn.textContent = '✓ Uploaded!';
                uploadBtn.style.background = '#10b981';
                setTimeout(() => {
                    uploadBtn.textContent = originalText;
                    uploadBtn.style.background = '';
                }, 2000);
                
                // Clear the file input
                fileInput.value = '';
            };
            
            reader.onerror = function() {
                alert('Error reading file. Please try again.');
            };
            
            reader.readAsDataURL(file);
        }

        function setTheme(themeName) {
            document.body.style.background = themes[themeName];
            localStorage.setItem('theme', themeName);
            localStorage.removeItem('customBg');
            updateThemeSelection();
        }

        function setCustomBackground() {
            const url = document.getElementById('custom-bg-url').value.trim();
            if (url) {
                document.body.style.background = `url('${url}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                localStorage.setItem('customBg', url);
                localStorage.removeItem('theme');
                updateThemeSelection();
                document.getElementById('custom-bg-url').value = '';
            }
        }

        function setUnsplashBackground() {
            const url = `https://source.unsplash.com/random/1920x1080?nature,landscape&${Date.now()}`;
            document.body.style.background = `url('${url}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            localStorage.setItem('customBg', url);
            localStorage.removeItem('theme');
            updateThemeSelection();
        }

        function loadTheme() {
            const customBg = localStorage.getItem('customBg');
            const theme = localStorage.getItem('theme');
            
            if (customBg) {
                document.body.style.background = `url('${customBg}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            } else if (theme) {
                document.body.style.background = themes[theme];
            }
            
            updateThemeSelection();
            updateGreeting();
        }

        function updateThemeSelection() {
            document.querySelectorAll('.theme-option').forEach(el => {
                el.classList.remove('active');
            });
            
            const theme = localStorage.getItem('theme');
            if (theme) {
                const index = Object.keys(themes).indexOf(theme);
                if (index >= 0) {
                    document.querySelectorAll('.theme-option')[index].classList.add('active');
                }
            }
        }
