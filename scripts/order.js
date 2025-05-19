document.addEventListener('DOMContentLoaded', function() {
    // Множители масштаба
    const TEXT_SCALE_FACTOR = 1.6;
    const ELEMENT_SCALE_FACTOR = 1.6;
    const TEMPLATE_SCALE_FACTOR = 1.0;
    const PADDING_FACTOR = 0.85;

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
        designLoaded: false
    };

    // Настройки Telegram
    const BOT_TOKEN = '7865197370:AAEzaD6VKlIcXAnYOd4fpsM3WuSH-II1VDw';
    const CHAT_ID = '-1002576018287';

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

        // Рассчитываем масштаб для элементов
        const scale = Math.min(
            designCanvas.width * PADDING_FACTOR / design.canvasWidth,
            designCanvas.height * PADDING_FACTOR / design.canvasHeight
        );

        const centerX = design.canvasWidth / 2;
        const centerY = design.canvasHeight / 2;
        const previewCenterX = designCanvas.width / 2;
        const previewCenterY = designCanvas.height / 2;

        // Загрузка шаблона (если есть)
        if (design.template) {
            fabric.Image.fromURL(`images/templates/${design.template}`, function(img) {
                const templateScale = Math.min(
                    designCanvas.width * 0.8 / img.width,
                    designCanvas.height * 0.8 / img.height
                );

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
                loadDesignElements(design, scale, centerX, centerY, previewCenterX, previewCenterY);
            }, { crossOrigin: 'anonymous' });
        } else {
            loadDesignElements(design, scale, centerX, centerY, previewCenterX, previewCenterY);
        }
    }

    // Функция загрузки элементов дизайна
    function loadDesignElements(design, scale, designCenterX, designCenterY, previewCenterX, previewCenterY) {
        // Загрузка текстов
        if (design.texts && design.texts.length > 0) {
            design.texts.forEach(textObj => {
                const offsetX = (textObj.left - designCenterX) * scale;
                const offsetY = (textObj.top - designCenterY) * scale;

                const text = new fabric.Textbox(textObj.text, {
                    left: previewCenterX + offsetX,
                    top: previewCenterY + offsetY,
                    width: textObj.width * scale,
                    originX: textObj.originX || 'center',
                    originY: textObj.originY || 'center',
                    fontFamily: textObj.fontFamily,
                    fontSize: textObj.fontSize * scale,
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

        // Загрузка клипартов
        if (design.cliparts && design.cliparts.length > 0) {
            design.cliparts.forEach(clipartObj => {
                fabric.Image.fromURL(`images/cliparts/${clipartObj.name}`, function(img) {
                    const offsetX = (clipartObj.left - designCenterX) * scale;
                    const offsetY = (clipartObj.top - designCenterY) * scale;

                    img.set({
                        scaleX: clipartObj.scaleX * scale,
                        scaleY: clipartObj.scaleY * scale,
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

        // Увеличиваем размеры окон
        glassContainer.style.height = '550px';
        designContainer.style.height = '550px';

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

    function loadSavedDesign() {
        const savedDesign = localStorage.getItem('glassDesign');
        if (savedDesign) {
            const design = JSON.parse(savedDesign);
            state.glassType = design.glassType;
            loadGlass(design.glassType);
            loadDesignContent(design);
        }
    }

    function createTelegramMessage(formData) {
        let message = `📦 *Новый заказ* \n\n` +
               `👤 *Имя*: ${formData.name}\n` +
               `📞 *Телефон*: ${formData.phone}\n` +
               `💬 *Соцсеть*: ${formData.social}\n` +
               `🏠 *Адрес*: ${formData.address || 'Не указан'}\n` +
               `💭 *Комментарий*: ${formData.comments || 'Нет комментариев'}\n\n` +
               `🛒 *Детали заказа*:\n` +
               `- Бокал: ${glassTypeNames[formData.design?.glassType] || 'Не указан'}\n`;

        // Добавляем информацию о текстах
        if (formData.design?.texts?.length > 0) {
            formData.design.texts.forEach((text, index) => {
                message += `- Текст ${index + 1}: "${text.text}" (Шрифт: ${text.fontFamily})\n`;
            });
        } else {
            message += `- Тексты: Нет\n`;
        }

        // Добавляем информацию о элементах
        message += `- Элементы: ${formData.design?.cliparts?.length || 0}\n`;

        // Добавляем информацию о шаблоне
        if (formData.design?.template) {
            const templateNumber = formData.design.template.replace('template', '').replace('.png', '');
            message += `- Шаблон: №${templateNumber}\n`;
        } else {
            message += `- Шаблон: Нет\n`;
        }

        message += `\n⏰ *Дата*: ${formData.date}`;

        return message;
    }

    async function sendToTelegram(message, imageUrl = null) {
        let url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

        // Если есть изображение, отправляем его вместе с сообщением
        if (imageUrl) {
            url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${CHAT_ID}&photo=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(message)}&parse_mode=Markdown`;
        }

        try {
            await fetch(url);
        } catch (error) {
            console.error('Ошибка при отправке в Telegram:', error);
        }
    }

    function getDesignPreviewImage() {
        return new Promise((resolve) => {
            // Создаем временный canvas, который объединит бокал и дизайн
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = designCanvas.width;
            tempCanvas.height = designCanvas.height;
            const ctx = tempCanvas.getContext('2d');

            // Заливаем прозрачный фон белым
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Рисуем дизайн
            designCanvas.renderAll();
            ctx.drawImage(designCanvas.getElement(), 0, 0);

            // Получаем данные изображения
            const imageData = tempCanvas.toDataURL('image/png');
            resolve(imageData);
        });
    }

    const form = document.getElementById('order-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
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

        if (!formData.name || !formData.phone || !formData.social) {
            alert('Заполните обязательные поля: имя, телефон и соцсеть');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            return;
        }

        const message = createTelegramMessage(formData);

        try {
            // Получаем изображение дизайна
            const designImage = await getDesignPreviewImage();

            // Отправляем сообщение с изображением
            await sendToTelegram(message, designImage);

            alert('✅ Заказ отправлен! Мы свяжемся с вами.');
            form.reset();
            localStorage.removeItem('glassDesign');
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('⚠️ Произошла ошибка при отправке заказа. Пожалуйста, попробуйте еще раз.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });

    // Инициализация
    window.addEventListener('load', function() {
        setupCanvasSizes();
        loadSavedDesign();
    });

    window.addEventListener('resize', setupCanvasSizes);
});
