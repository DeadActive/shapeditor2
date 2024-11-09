import { CompositeCommand } from './CompositeCommand.js';

/**
 * @class CommandRecorder
 * @description Записывает последовательность команд в композитную команду.
 */
export class CommandRecorder {
    /**
     * @param {string} name - Имя для композитной команды.
     */
    constructor(name = 'Composite Command') {
        this.name = name;
        this.commands = [];
        this.isRecording = false;
    }

    /**
     * @method startRecording
     * @description Начинает запись команд.
     */
    startRecording() {
        this.isRecording = true;
        this.commands = [];
    }

    /**
     * @method stopRecording
     * @description Останавливает запись и возвращает композитную команду.
     * @returns {CompositeCommand} Композитная команда с записанными командами.
     */
    stopRecording() {
        this.isRecording = false;
        return new CompositeCommand(this.name, [...this.commands]);
    }

    /**
     * @method recordCommand
     * @description Записывает команду если идет запись.
     * @param {Command} command - Команда для записи.
     */
    recordCommand(command) {
        if (this.isRecording) {
            this.commands.push(command);
        }
    }

    /**
     * @method clear
     * @description Очищает записанные команды.
     */
    clear() {
        this.commands = [];
    }
}
