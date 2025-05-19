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

        if (formData.design?.texts?.length > 0) {
            formData.design.texts.forEach((text, index) => {
                message += `- Текст ${index + 1}: "${text.text}" (Шрифт: ${text.fontFamily})\n`;
            });
        } else {
            message += `- Тексты: Нет\n`;
        }

        message += `- Элементы: ${formData.design?.cliparts?.length || 0}\n`;

        if (formData.design?.template) {
            const templateNumber = formData.design.template.replace('template', '').replace('.png', '');
            message += `- Шаблон: №${templateNumber}\n`;
        } else {
            message += `- Шаблон: Нет\n`;
        }

        message += `\n⏰ *Дата*: ${formData.date}`;

        return message;
    }

    function getDesignPreviewImage() {
        return new Promise((resolve) => {
            const tempCanvas = document.createElement('canvas');
            const padding = 40;
            
            const allObjects = designCanvas.getObjects();
            if (allObjects.length === 0) {
                resolve(null);
                return;
            }

            const group = new fabric.Group(allObjects, {
                originX: 'center',
                originY: 'center'
            });

            const groupBoundingRect = group.getBoundingRect();
            const scale = Math.min(
                (designCanvas.width - padding * 2) / groupBoundingRect.width,
                (designCanvas.height - padding * 2) / groupBoundingRect.height
            );

            tempCanvas.width = designCanvas.width;
            tempCanvas.height = designCanvas.height;
            const ctx = tempCanvas.getContext('2d');

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            group.set({
                scaleX: scale,
                scaleY: scale,
                left: tempCanvas.width / 2,
                top: tempCanvas.height / 2,
                originX: 'center',
                originY: 'center'
            });

            const tempFabricCanvas = new fabric.StaticCanvas(tempCanvas);
            tempFabricCanvas.add(group);
            tempFabricCanvas.renderAll();

            resolve(tempCanvas.toDataURL('image/png'));
        });
    }

    async function sendToTelegram(message, imageUrl = null) {
        try {
            if (imageUrl) {
                const blob = await fetch(imageUrl).then(r => r.blob());
                const formData = new FormData();
                formData.append('photo', blob, 'design.png');
                formData.append('chat_id', CHAT_ID);
                formData.append('caption', message);
                formData.append('parse_mode', 'Markdown');

                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
            } else {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
                document.body.appendChild(iframe);
                setTimeout(() => iframe.remove(), 3000);
            }
        } catch (error) {
            console.error('Ошибка при отправке в Telegram:', error);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent("Новый заказ (изображение не загружено)\n\n" + message)}&parse_mode=Markdown`;
            document.body.appendChild(iframe);
            setTimeout(() => iframe.remove(), 3000);
        }
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

        try {
            const message = createTelegramMessage(formData);
            const designImage = await getDesignPreviewImage();
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

    window.addEventListener('load', function() {
        setupCanvasSizes();
        loadSavedDesign();
    });

    window.addEventListener('resize', setupCanvasSizes);
});
