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
            message += `- Шаблон: ${formData.design.template.replace('.png', '')}\n`;
        }

        if (formData.design?.texts && formData.design.texts.length > 0) {
            message += `\n📝 *Тексты*:\n`;
            formData.design.texts.forEach((text, index) => {
                message += `${index + 1}. "${text.text}" (Шрифт: ${text.fontFamily})\n`;
            });
        }

        if (formData.design?.cliparts && formData.design.cliparts.length > 0) {
            message += `\n🎨 *Элементы дизайна*:\n`;
            formData.design.cliparts.forEach((clipart, index) => {
                message += `${index + 1}. ${clipart.displayName || clipart.name.replace('.png', '')}\n`;
            });
        }

        message += `\n⏰ *Дата*: ${formData.date}`;

        return message;
    }

    function sendDesignImageToTelegram() {
        return new Promise((resolve, reject) => {
            const dataURL = designCanvas.toDataURL({
                format: 'png',
                quality: 0.8
            });

            const blob = dataURLtoBlob(dataURL);
            const formData = new FormData();
            formData.append('chat_id', CHAT_ID);
            formData.append('photo', blob, 'design.png');
            formData.append('caption', 'Дизайн бокала');

            fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    resolve();
                } else {
                    reject(new Error('Ошибка отправки изображения'));
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    function dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], {type: mime});
    }

    function sendToTelegram(message) {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.ok) {
                    throw new Error(data.description || 'Ошибка отправки сообщения');
                }
                return data;
            });
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 5000);
    }

    const form = document.getElementById('order-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Отправка...';
        submitBtn.querySelector('.spinner').style.display = 'inline-block';

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
            showNotification('Заполните обязательные поля: имя, телефон и соцсеть', 'error');
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Подтвердить заказ';
            submitBtn.querySelector('.spinner').style.display = 'none';
            return;
        }

        const message = createTelegramMessage(formData);

        Promise.all([
            sendToTelegram(message),
            sendDesignImageToTelegram()
        ])
        .then(() => {
            showNotification('✅ Заказ отправлен! Мы свяжемся с вами.');
            form.reset();
            localStorage.removeItem('glassDesign');
        })
        .catch(error => {
            console.error('Ошибка отправки:', error);
            showNotification('❌ Ошибка отправки заказа. Пожалуйста, попробуйте еще раз.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Подтвердить заказ';
            submitBtn.querySelector('.spinner').style.display = 'none';
        });
    });

    window.addEventListener('load', function() {
        setupCanvasSizes();
        loadSavedDesign();
    });

    window.addEventListener('resize', setupCanvasSizes);
});