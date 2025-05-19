document.addEventListener('DOMContentLoaded', function() {
    const TEXT_SCALE_FACTOR = 1.6;
    const ELEMENT_SCALE_FACTOR = 1.6;
    const TEMPLATE_SCALE_FACTOR = 1.0;
    const PADDING_FACTOR = 0.85;

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

    const templateNames = {
        'template1.png': 'Шаблон 1',
        'template2.png': 'Шаблон 2',
        'template3.png': 'Шаблон 3',
        'template4.png': 'Шаблон 4',
        'template5.png': 'Шаблон 5',
        'template6.png': 'Шаблон 6',
        'template7.png': 'Шаблон 7',
        'template8.png': 'Шаблон 8',
        'template9.png': 'Шаблон 9',
        'template10.png': 'Шаблон 10',
        'template11.png': 'Шаблон 11',
        'template12.png': 'Шаблон 12',
        'template13.png': 'Шаблон 13',
        'template14.png': 'Шаблон 14',
        'template15.png': 'Шаблон 15',
        'template16.png': 'Шаблон 16',
        'template17.png': 'Шаблон 17',
        'template18.png': 'Шаблон 18',
        'template19.png': 'Шаблон 19',
        'template20.png': 'Шаблон 20',
        'template21.png': 'Шаблон 21',
        'template22.png': 'Шаблон 22',
        'template23.png': 'Шаблон 23',
        'template24.png': 'Шаблон 24',
        'template25.png': 'Шаблон 25',
        'template26.png': 'Шаблон 26',
        'template27.png': 'Шаблон 27',
        'template28.png': 'Шаблон 28',
        'template29.png': 'Шаблон 29',
        'template30.png': 'Шаблон 30',
        'template31.png': 'Шаблон 31',
        'template32.png': 'Шаблон 32',
        'template33.png': 'Шаблон 33',
        'template34.png': 'Шаблон 34',
        'template35.png': 'Шаблон 35',
        'template36.png': 'Шаблон 36',
        'template37.png': 'Шаблон 37',
        'template38.png': 'Шаблон 38',
        'template39.png': 'Шаблон 39',
        'template40.png': 'Шаблон 40'
    };

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

    function loadDesignContent(design) {
        state.design = design;
        state.designLoaded = true;
        designCanvas.clear();

        const scale = Math.min(
            designCanvas.width * PADDING_FACTOR / design.canvasWidth,
            designCanvas.height * PADDING_FACTOR / design.canvasHeight
        );

        const centerX = design.canvasWidth / 2;
        const centerY = design.canvasHeight / 2;
        const previewCenterX = designCanvas.width / 2;
        const previewCenterY = designCanvas.height / 2;

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

    function loadDesignElements(design, scale, designCenterX, designCenterY, previewCenterX, previewCenterY) {
        if (design.texts && design.texts.length > 0) {
            design.texts.forEach(textObj => {
                const offsetX = (textObj.left - designCenterX) * scale;
                const offsetY = (textObj.top - designCenterY) * scale;

                const text = new fabric.Textbox(textObj.text, {
                    left: previewCenterX + offsetX,
                    top: previewCenterY + offsetY,
                    width: textObj.width * scale,
                    originX: 'center',
                    originY: 'center',
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
                        originX: 'center',
                        originY: 'center',
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

    function setupCanvasSizes() {
        const glassContainer = document.querySelector('#glass-preview').parentElement;
        const designContainer = document.querySelector('#design-preview').parentElement;

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

        if (formData.design?.template) {
            message += `- Шаблон: ${templateNames[formData.design.template] || formData.design.template}\n`;
        }

        if (formData.design?.texts && formData.design.texts.length > 0) {
            message += `- Тексты (${formData.design.texts.length}):\n`;
            formData.design.texts.forEach((text, index) => {
                message += `  ${index + 1}. "${text.text}" (шрифт: ${text.fontFamily}, размер: ${text.fontSize}px)\n`;
            });
        }

        if (formData.design?.cliparts && formData.design.cliparts.length > 0) {
            message += `- Элементы (${formData.design.cliparts.length}):\n`;
            formData.design.cliparts.forEach((clipart, index) => {
                message += `  ${index + 1}. ${clipart.displayName || clipart.name.replace('.png', '')}\n`;
            });
        }

        message += `\n⏰ *Дата*: ${formData.date}`;
        return message;
    }

    function sendDesignImageToTelegram(imageData) {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', imageData);
        formData.append('caption', 'Дизайн бокала');

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
    }

    function sendToTelegram(message) {
        // Сначала отправляем текст
        const textUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

        // Затем отправляем изображение
        designCanvas.getElement().toBlob(function(blob) {
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', blob, 'design.png');
            formData.append('caption', 'Предпросмотр дизайна');

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }, 'image/png');

        // Отправка текста через iframe (для совместимости)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = textUrl;
        document.body.appendChild(iframe);
        setTimeout(() => iframe.remove(), 3000);
    }

    const form = document.getElementById('order-form');
    form.addEventListener('submit', function(e) {
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
        sendToTelegram(message);

        setTimeout(() => {
            alert('✅ Заказ отправлен! Мы свяжемся с вами.');
            form.reset();
            localStorage.removeItem('glassDesign');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 1500);
    });

    window.addEventListener('load', function() {
        setupCanvasSizes();
        loadSavedDesign();
    });

    window.addEventListener('resize', setupCanvasSizes);
});
