document.addEventListener('DOMContentLoaded', function() {
    // Множители масштаба
    const TEXT_SCALE_FACTOR = 1.6;
    const ELEMENT_SCALE_FACTOR = 1.6;
    const TEMPLATE_SCALE_FACTOR = 1.0;

    // Инициализация canvas
    const glassCanvas = new fabric.Canvas('glass-preview', {
        backgroundColor: 'transparent',
        preserveObjectStacking: true,
        selection: false,
        interactive: false
    });

    const designCanvas = new fabric.Canvas('design-preview', {
        backgroundColor: 'transparent',
        preserveObjectStacking: true,
        selection: false,
        interactive: false
    });

    const state = {
        glassType: null,
        design: null,
        designLoaded: false,
        glassImage: null,
        designBackground: null
    };

    // Настройки Telegram
    const BOT_TOKEN = '7865197370:AAEzaD6VKlIcXAnYOd4fpsM3WuSH-II1VDw';
    const CHAT_ID = '7865197370';

    const glassTypeNames = {
        wine: '🍷 Винный бокал',
        beer: '🍺 Пивной бокал 0.5л',
        whisky: '🥃 Бокал для виски',
        champagne: '🥂 Бокал для шампанского',
        cognac: '🪵 Бокал для коньяка',
        vodka: '❄️ Рюмка для водки (6шт)'
    };

    // Функция загрузки изображения бокала
    function loadGlass(glassType) {
        state.glassType = glassType;
        fabric.Image.fromURL(`images/${glassType}-glass.png`, function(img) {
            const scale = Math.min(
                glassCanvas.width * 0.9 / img.width,
                glassCanvas.height * 0.9 / img.height
            );

            img.set({
                scaleX: scale,
                scaleY: scale,
                left: glassCanvas.width / 2,
                top: glassCanvas.height / 2,
                originX: 'center',
                originY: 'center',
                selectable: false,
                evented: false
            });

            glassCanvas.setBackgroundImage(img, glassCanvas.renderAll.bind(glassCanvas), {
                originX: 'center',
                originY: 'center',
                left: glassCanvas.width / 2,
                top: glassCanvas.height / 2
            });

            const glassTypeInfo = document.getElementById('glass-type-info');
            if (glassTypeNames[glassType]) {
                glassTypeInfo.textContent = glassTypeNames[glassType];
            }
        }, { crossOrigin: 'anonymous' });
    }

    // Функция загрузки дизайна
    function loadDesignContent(design) {
        state.design = design;
        state.designLoaded = true;
        designCanvas.clear();

        const designCenterX = design.canvasWidth / 2;
        const designCenterY = design.canvasHeight / 2;
        const previewCenterX = designCanvas.width / 2;
        const previewCenterY = designCanvas.height / 2;

        const scale = Math.min(
            designCanvas.width * 0.9 / design.canvasWidth,
            designCanvas.height * 0.9 / design.canvasHeight
        );

        if (design.template) {
            fabric.Image.fromURL(`images/templates/${design.template}`, function(img) {
                const templateScale = Math.min(
                    designCanvas.width * 0.9 / img.width,
                    designCanvas.height * 0.9 / img.height
                ) * TEMPLATE_SCALE_FACTOR;

                img.set({
                    scaleX: templateScale,
                    scaleY: templateScale,
                    left: previewCenterX,
                    top: previewCenterY,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    evented: false
                });
                designCanvas.add(img);
                loadTextsAndElements(design, scale, designCenterX, designCenterY, previewCenterX, previewCenterY);
            }, { crossOrigin: 'anonymous' });
        } else {
            loadTextsAndElements(design, scale, designCenterX, designCenterY, previewCenterX, previewCenterY);
        }
    }

    // Функция загрузки текстов и элементов
    function loadTextsAndElements(design, scale, designCenterX, designCenterY, previewCenterX, previewCenterY) {
        if (design.texts && design.texts.length > 0) {
            design.texts.forEach(textObj => {
                const offsetX = (textObj.left - designCenterX) * scale * TEXT_SCALE_FACTOR;
                const offsetY = (textObj.top - designCenterY) * scale * TEXT_SCALE_FACTOR;

                const text = new fabric.Textbox(textObj.text, {
                    left: previewCenterX + offsetX,
                    top: previewCenterY + offsetY,
                    width: textObj.width * scale * TEXT_SCALE_FACTOR,
                    originX: textObj.originX || 'center',
                    originY: textObj.originY || 'center',
                    fontFamily: textObj.fontFamily,
                    fontSize: textObj.fontSize * scale * TEXT_SCALE_FACTOR,
                    fill: textObj.fill,
                    textAlign: textObj.textAlign,
                    angle: textObj.angle || 0,
                    flipX: textObj.flipX || false,
                    flipY: textObj.flipY || false,
                    selectable: false,
                    evented: false
                });
                designCanvas.add(text);
            });
        }

        if (design.cliparts && design.cliparts.length > 0) {
            design.cliparts.forEach(clipartObj => {
                fabric.Image.fromURL(`images/cliparts/${clipartObj.name}`, function(img) {
                    const offsetX = (clipartObj.left - designCenterX) * scale * ELEMENT_SCALE_FACTOR;
                    const offsetY = (clipartObj.top - designCenterY) * scale * ELEMENT_SCALE_FACTOR;

                    img.set({
                        scaleX: clipartObj.scaleX * scale * ELEMENT_SCALE_FACTOR,
                        scaleY: clipartObj.scaleY * scale * ELEMENT_SCALE_FACTOR,
                        left: previewCenterX + offsetX,
                        top: previewCenterY + offsetY,
                        originX: clipartObj.originX || 'center',
                        originY: clipartObj.originY || 'center',
                        angle: clipartObj.angle || 0,
                        flipX: clipartObj.flipX || false,
                        flipY: clipartObj.flipY || false,
                        selectable: false,
                        evented: false
                    });
                    designCanvas.add(img);
                }, { crossOrigin: 'anonymous' });
            });
        }
    }

    // Настройка размеров canvas
    function setupCanvasSizes() {
        const glassContainer = document.querySelector('#glass-preview').parentElement;
        const designContainer = document.querySelector('#design-preview').parentElement;

        glassCanvas.setWidth(glassContainer.clientWidth);
        glassCanvas.setHeight(glassContainer.clientHeight);

        designCanvas.setWidth(designContainer.clientWidth);
        designCanvas.setHeight(designContainer.clientHeight);

        if (state.glassType) {
            loadGlass(state.glassType);
        }
        if (state.designLoaded) {
            loadDesignContent(state.design);
        }
    }

    // Загрузка сохраненного дизайна
    function loadSavedDesign() {
        const savedDesign = localStorage.getItem('glassDesign');
        if (savedDesign) {
            const design = JSON.parse(savedDesign);
            state.glassType = design.glassType;
            loadGlass(design.glassType);
            loadDesignContent(design);
        }
    }

    // Формирование сообщения для Telegram
    function createTelegramMessage(formData) {
        return `📦 *Новый заказ* \n\n` +
               `👤 *Имя*: ${formData.name}\n` +
               `📞 *Телефон*: ${formData.phone}\n` +
               `💬 *Соцсеть*: ${formData.social}\n` +
               `🏠 *Адрес*: ${formData.address || 'Не указан'}\n` +
               `💭 *Комментарий*: ${formData.comments || 'Нет комментариев'}\n\n` +
               `🛒 *Детали заказа*:\n` +
               `- Бокал: ${glassTypeNames[formData.design?.glassType] || 'Не указан'}\n` +
               `- Тексты: ${formData.design?.texts?.length || 0}\n` +
               `- Элементы: ${formData.design?.cliparts?.length || 0}\n` +
               `- Шаблон: ${formData.design?.template ? 'Да' : 'Нет'}\n\n` +
               `⏰ *Дата*: ${formData.date}`;
    }

    // Отправка сообщения в Telegram
    function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

        // Создаем скрытый iframe для обхода CORS
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        setTimeout(() => {
            iframe.remove();
        }, 3000);
    }

    // Обработчик отправки формы
    const form = document.getElementById('order-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Показываем индикатор загрузки
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        const formData = {
            name: form.elements.name.value.trim(),
            phone: form.elements.phone.value.trim(),
            social: form.elements.social.value.trim(),
            address: form.elements.address.value.trim(),
            comments: form.elements.comments.value.trim(),
            design: state.design,
            date: new Date().toLocaleString()
        };

        // Валидация формы
        if (!formData.name || !formData.phone || !formData.social) {
            alert('Пожалуйста, заполните все обязательные поля: имя, телефон и соцсеть/мессенджер');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            return;
        }

        // Формируем и отправляем сообщение
        const message = createTelegramMessage(formData);
        sendToTelegram(message);

        // Показываем уведомление и сбрасываем форму
        setTimeout(() => {
            alert('✅ Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            localStorage.removeItem('glassDesign');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 1500);
    });

    // Инициализация при загрузке страницы
    window.addEventListener('load', function() {
        setupCanvasSizes();
        loadSavedDesign();
    });

    window.addEventListener('resize', function() {
        setupCanvasSizes();
    });
});
