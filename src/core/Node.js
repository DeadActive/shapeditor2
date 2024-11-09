/**
 * @class Node
 * @description Представляет узел в иерархической структуре с отслеживанием изменений.
 */
export class Node {
    /**
     * @param {string} id - Уникальный идентификатор узла.
     * @param {string} name - Имя узла.
     * @param {string} type - Тип узла (например, 'circle', 'rectangle').
     */
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.children = [];
        this.dirty = false;
        this.parent = null;
        this.x = 0;
        this.y = 0;
    }

    /**
     * @method move
     * @description Перемещает узел относительно его текущей позиции.
     * @param {number} dx - Смещение по X.
     * @param {number} dy - Смещение по Y.
     */
    move(dx, dy) {
        this.updateProperty('x', this.x + dx);
        this.updateProperty('y', this.y + dy);
    }

    /**
     * @method setPosition
     * @description Устанавливает абсолютную позицию узла относительно родителя.
     * @param {number} x - Новая координата X.
     * @param {number} y - Новая координата Y.
     */
    setPosition(x, y) {
        this.updateProperty('x', x);
        this.updateProperty('y', y);
    }

    /**
     * @method getAbsolutePosition
     * @description Возвращает абсолютные координаты узла с учетом позиции всех родителей.
     * @returns {{x: number, y: number}} Абсолютные координаты.
     */
    getAbsolutePosition() {
        let absoluteX = this.x;
        let absoluteY = this.y;
        let currentNode = this.parent;

        while (currentNode) {
            absoluteX += currentNode.x;
            absoluteY += currentNode.y;
            currentNode = currentNode.parent;
        }

        return { x: absoluteX, y: absoluteY };
    }

    /**
     * @method addChild
     * @description Добавляет дочерний узел.
     * @param {Node} child - Дочерний узел для добавления.
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
        this.markDirty();
    }

    /**
     * @method removeChild
     * @description Удаляет дочерний узел.
     * @param {string} childId - Идентификатор дочерего узла для удаления.
     */
    removeChild(childId) {
        this.children = this.children.filter(child => child.id !== childId);
        this.markDirty();
    }

    /**
     * @method updateProperty
     * @description Обновляет свойство узла и помечает его как изменённый.
     * @param {string} key - Имя свойства.
     * @param {*} value - Новое значение свойства.
     */
    updateProperty(key, value) {
        if (this[key] !== value) {
            this[key] = value;
            this.markDirty();
        }
    }

    /**
     * @method markDirty
     * @description Помечает узел как изменённый и распространяет изменение на родителя.
     */
    markDirty() {
        this.dirty = true;
        if (this.parent) {
            this.parent.markDirty();
        }
    }

    /**
     * @method clearDirty
     * @description Очищает флаг изменения.
     */
    clearDirty() {
        this.dirty = false;
    }

    /**
     * @method moveUp
     * @description Перемещает узел вверх в иерархии (увеличивает z-index).
     * @returns {boolean} Успешность операции.
     */
    moveUp() {
        if (!this.parent) return false;

        const index = this.parent.children.indexOf(this);
        if (index < this.parent.children.length - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index + 1, 0, this);
            this.parent.markDirty();
            return true;
        }
        return false;
    }

    /**
     * @method moveDown
     * @description Перемещает узел вниз в иерархии (уменьшает z-index).
     * @returns {boolean} Успешность операции.
     */
    moveDown() {
        if (!this.parent) return false;

        const index = this.parent.children.indexOf(this);
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.splice(index - 1, 0, this);
            this.parent.markDirty();
            return true;
        }
        return false;
    }

    /**
     * @method moveToTop
     * @description Перемещает узел в самый верх иерархии.
     * @returns {boolean} Успешность операции.
     */
    moveToTop() {
        if (!this.parent) return false;

        const index = this.parent.children.indexOf(this);
        if (index < this.parent.children.length - 1) {
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent.markDirty();
            return true;
        }
        return false;
    }

    /**
     * @method moveToBottom
     * @description Перемещает узел в самый низ иерархии.
     * @returns {boolean} Успешность операции.
     */
    moveToBottom() {
        if (!this.parent) return false;

        const index = this.parent.children.indexOf(this);
        if (index > 0) {
            this.parent.children.splice(index, 1);
            this.parent.children.unshift(this);
            this.parent.markDirty();
            return true;
        }
        return false;
    }

    /**
     * @method getZIndex
     * @description Возвращает текущий z-index узла.
     * @returns {number} Z-index узла или -1, если узел не имеет родителя.
     */
    getZIndex() {
        if (!this.parent) return -1;
        return this.parent.children.indexOf(this);
    }

    /**
     * @method clone
     * @description Создает глубокую копию узла.
     * @param {string} [newId] - Новый идентификатор для клона (опционально).
     * @returns {Node} Клонированный узел.
     */
    clone(newId = null) {
        // Создаем новый узел того же типа
        const clone = new this.constructor(newId || `${this.id}_clone`, `${this.name} (clone)`);

        // Копируем все свойства
        Object.keys(this).forEach(key => {
            if (key !== 'id' && key !== 'name' && key !== 'children' && key !== 'parent') {
                clone[key] = this[key];
            }
        });

        // Рекурсивно клонируем дочерние узлы
        this.children.forEach(child => {
            const childClone = child.clone();
            clone.addChild(childClone);
        });

        return clone;
    }
}
