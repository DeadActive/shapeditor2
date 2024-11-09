/**
 * @class CommandDescription
 * @description Базовый класс для описания команд.
 */
export class CommandDescription {
    /**
     * @param {Command} command - Команда для описания.
     */
    constructor(command) {
        this.command = command;
    }

    /**
     * @method getDescription
     * @description Возвращает описание команды.
     * @returns {string} Описание команды.
     */
    getDescription() {
        return this.command.constructor.name;
    }
}
