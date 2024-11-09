import { CommandDescription } from './CommandDescription.js';

/**
 * @class CompositeCommandDescription
 * @extends CommandDescription
 * @description Описание для композитной команды.
 */
export class CompositeCommandDescription extends CommandDescription {
    /**
     * @method getDescription
     * @description Возвращает описание композитной команды.
     * @returns {string} Описание команды.
     */
    getDescription() {
        return this.command.name;
    }
}
