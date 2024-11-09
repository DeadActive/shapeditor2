import { Path } from '../core/Path.js';
import { QuadraticCurve } from '../core/QuadraticCurve.js';
import { CubicCurve } from '../core/CubicCurve.js';
import { Point } from '../core/Point.js';
import { BatchAddChildCommand } from '../core/commands/NodeCommands.js';

/**
 * @function createZIndexExample
 * @description Создает пример с тремя перекрывающимися путями для демонстрации z-index.
 * @param {Tree} tree - Дерево для добавления примера.
 * @returns {{
 *   paths: {
 *     bottomPath: Path,
 *     middlePath: Path,
 *     topPath: Path
 *   }
 * }} Объект с созданными путями для манипуляций.
 */
export function createZIndexExample(tree) {
    // Создаем три пути для демонстрации z-index
    const bottomPath = new Path('path1', 'Bottom Path');
    const middlePath = new Path('path2', 'Middle Path');
    const topPath = new Path('path3', 'Top Path');

    // Настраиваем стили путей для визуального различия
    bottomPath.setStyle({
        strokeColor: '#ff0000',
        strokeWidth: 2,
        fillColor: 'rgba(255, 0, 0, 0.2)',
    });

    middlePath.setStyle({
        strokeColor: '#00ff00',
        strokeWidth: 2,
        fillColor: 'rgba(0, 255, 0, 0.2)',
    });

    topPath.setStyle({
        strokeColor: '#0000ff',
        strokeWidth: 2,
        fillColor: 'rgba(0, 0, 255, 0.2)',
    });

    // Создаем кривые для нижнего пути (красный)
    const bottomCurve1 = new QuadraticCurve(
        'bq1',
        'Bottom Quad 1',
        new Point('bq1s', 'Start', 50, 50),
        new Point('bq1c', 'Control', 100, 0),
        new Point('bq1e', 'End', 150, 50)
    );

    const bottomCurve2 = new CubicCurve(
        'bc1',
        'Bottom Cubic',
        new Point('bc1s', 'Start', 150, 50),
        new Point('bc1c1', 'Control 1', 200, 0),
        new Point('bc1c2', 'Control 2', 250, 100),
        new Point('bc1e', 'End', 300, 50)
    );

    // Создаем кривые для среднего пути (зеленый)
    const middleCurve1 = new QuadraticCurve(
        'mq1',
        'Middle Quad 1',
        new Point('mq1s', 'Start', 100, 100),
        new Point('mq1c', 'Control', 150, 50),
        new Point('mq1e', 'End', 200, 100)
    );

    const middleCurve2 = new CubicCurve(
        'mc1',
        'Middle Cubic',
        new Point('mc1s', 'Start', 200, 100),
        new Point('mc1c1', 'Control 1', 250, 50),
        new Point('mc1c2', 'Control 2', 300, 150),
        new Point('mc1e', 'End', 350, 100)
    );

    // Создаем кривые для верхнего пути (синий)
    const topCurve1 = new QuadraticCurve(
        'tq1',
        'Top Quad 1',
        new Point('tq1s', 'Start', 150, 150),
        new Point('tq1c', 'Control', 200, 100),
        new Point('tq1e', 'End', 250, 150)
    );

    const topCurve2 = new CubicCurve(
        'tc1',
        'Top Cubic',
        new Point('tc1s', 'Start', 250, 150),
        new Point('tc1c1', 'Control 1', 300, 100),
        new Point('tc1c2', 'Control 2', 350, 200),
        new Point('tc1e', 'End', 400, 150)
    );

    // Добавляем кривые к соответствующим путям
    tree.executeCommand(new BatchAddChildCommand(bottomPath, [bottomCurve1, bottomCurve2]));
    tree.executeCommand(new BatchAddChildCommand(middlePath, [middleCurve1, middleCurve2]));
    tree.executeCommand(new BatchAddChildCommand(topPath, [topCurve1, topCurve2]));

    // Добавляем все пути к холсту
    tree.executeCommand(new BatchAddChildCommand(tree.root, [bottomPath, middlePath, topPath]));

    // Замыкаем пути для создания заполненных фигур
    bottomPath.close();
    middlePath.close();
    topPath.close();

    return {
        paths: {
            bottomPath,
            middlePath,
            topPath,
        },
    };
}
