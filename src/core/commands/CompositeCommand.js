import { Command } from './Command.js';

/**
 * @class CompositeCommand
 * @extends Command
 * @description Команда, объединяющая несколько команд в одну для истории.
 */
export class CompositeCommand extends Command {
    /**
     * @param {string} name - Имя композитной команды.
     * @param {Command[]} commands - Массив команд для выполнения.
     */
    constructor(name, commands = []) {
        super();
        this.name = name;
        this.commands = commands;
    }

    /**
     * @method addCommand
     * @description Добавляет команду в композит.
     * @param {Command} command - Команда для добавления.
     */
    addCommand(command) {
        this.commands.push(command);
    }

    execute() {
        this.commands.forEach(command => command.execute());
    }

    undo() {
        // Отменяем команды в обратном порядке
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }

    /**
     * @method isEmpty
     * @description Проверяет, есть ли команды в композите.
     * @returns {boolean} true если команд нет.
     */
    isEmpty() {
        return this.commands.length === 0;
    }
}
