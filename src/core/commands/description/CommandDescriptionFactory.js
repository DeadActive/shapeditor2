import * as CanvasDescriptions from './CanvasCommandDescriptions.js';
import * as ZIndexDescriptions from './ZIndexCommandDescriptions.js';
import * as NodeDescriptions from './NodeCommandDescriptions.js';
import { CommandDescription } from './CommandDescription.js';

/**
 * @class CommandDescriptionFactory
 * @description Фабрика для создания описаний команд.
 */
export class CommandDescriptionFactory {
    static #descriptionsMap = new Map([
        // Canvas Commands
        ['CanvasTransformCommand', CanvasDescriptions.CanvasTransformDescription],
        ['CanvasResizeCommand', CanvasDescriptions.CanvasResizeDescription],
        ['SetCanvasSizeCommand', CanvasDescriptions.SetCanvasSizeDescription],
        ['SetViewBoxCommand', CanvasDescriptions.SetViewBoxDescription],
        ['PanCanvasCommand', CanvasDescriptions.PanCanvasDescription],
        ['ZoomCanvasCommand', CanvasDescriptions.ZoomCanvasDescription],
        ['AccumulatedZoomCommand', CanvasDescriptions.AccumulatedZoomDescription],

        // Z-Index Commands
        ['MoveNodeUpCommand', ZIndexDescriptions.MoveNodeUpDescription],
        ['MoveNodeDownCommand', ZIndexDescriptions.MoveNodeDownDescription],
        ['MoveNodeToTopCommand', ZIndexDescriptions.MoveNodeToTopDescription],
        ['MoveNodeToBottomCommand', ZIndexDescriptions.MoveNodeToBottomDescription],

        // Node Commands
        ['UpdatePropertyCommand', NodeDescriptions.UpdatePropertyDescription],
        ['AddChildCommand', NodeDescriptions.AddChildDescription],
        ['RemoveChildCommand', NodeDescriptions.RemoveChildDescription],
        ['BatchAddChildCommand', NodeDescriptions.BatchAddChildDescription],
        ['BatchRemoveChildCommand', NodeDescriptions.BatchRemoveChildDescription],
        ['MoveNodeCommand', NodeDescriptions.MoveNodeDescription],
        ['SetNodePositionCommand', NodeDescriptions.SetNodePositionDescription],
        ['BatchMoveNodesCommand', NodeDescriptions.BatchMoveNodesDescription],
    ]);

    /**
     * @method createDescription
     * @description Создает описание для команды.
     * @param {Command} command - Команда.
     * @returns {CommandDescription} Описание команды.
     */
    static createDescription(command) {
        const commandName = command.constructor.name;
        const DescriptionClass = this.#descriptionsMap.get(commandName) || CommandDescription;
        return new DescriptionClass(command);
    }

    /**
     * @method getDescription
     * @description Получает строку описания команды.
     * @param {Command} command - Команда.
     * @returns {string} Описание команды.
     */
    static getDescription(command) {
        return this.createDescription(command).getDescription();
    }
}
