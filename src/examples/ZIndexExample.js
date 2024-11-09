import { Example } from './Example.js';
import { Path } from '../core/Path.js';
import { QuadraticCurve } from '../core/QuadraticCurve.js';
import { CubicCurve } from '../core/CubicCurve.js';
import { Point } from '../core/Point.js';
import { BatchAddChildCommand } from '../core/commands/NodeCommands.js';

/**
 * @class ZIndexExample
 * @extends Example
 * @description Пример с тремя перекрывающимися прямоугольными путями для демонстрации z-index.
 */
export class ZIndexExample extends Example {
    constructor() {
        super(
            'zindex',
            'Z-Index Example',
            'Демонстрация управления порядком отрисовки (z-index) с тремя перекрывающимися прямоугольниками.'
        );
    }

    create(tree) {
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

        // Создаем кривые для нижнего прямоугольника (красный)
        const bottomCurve1 = new CubicCurve(
            'bc1',
            'Bottom Side 1',
            new Point('bc1s', 'Start', 50, 50),
            new Point('bc1c1', 'Control 1', 50, 50),
            new Point('bc1c2', 'Control 2', 250, 50),
            new Point('bc1e', 'End', 250, 50)
        );

        const bottomCurve2 = new CubicCurve(
            'bc2',
            'Bottom Side 2',
            new Point('bc2s', 'Start', 250, 50),
            new Point('bc2c1', 'Control 1', 250, 250),
            new Point('bc2c2', 'Control 2', 250, 250),
            new Point('bc2e', 'End', 250, 250)
        );

        // Создаем кривые для среднего прямоугольника (зеленый)
        const middleCurve1 = new CubicCurve(
            'mc1',
            'Middle Side 1',
            new Point('mc1s', 'Start', 100, 100),
            new Point('mc1c1', 'Control 1', 100, 100),
            new Point('mc1c2', 'Control 2', 300, 100),
            new Point('mc1e', 'End', 300, 100)
        );

        const middleCurve2 = new CubicCurve(
            'mc2',
            'Middle Side 2',
            new Point('mc2s', 'Start', 300, 100),
            new Point('mc2c1', 'Control 1', 300, 300),
            new Point('mc2c2', 'Control 2', 300, 300),
            new Point('mc2e', 'End', 300, 300)
        );

        // Создаем кривые для верхнего прямоугольника (синий)
        const topCurve1 = new CubicCurve(
            'tc1',
            'Top Side 1',
            new Point('tc1s', 'Start', 150, 150),
            new Point('tc1c1', 'Control 1', 150, 150),
            new Point('tc1c2', 'Control 2', 350, 150),
            new Point('tc1e', 'End', 350, 150)
        );

        const topCurve2 = new CubicCurve(
            'tc2',
            'Top Side 2',
            new Point('tc2s', 'Start', 350, 150),
            new Point('tc2c1', 'Control 1', 350, 350),
            new Point('tc2c2', 'Control 2', 350, 350),
            new Point('tc2e', 'End', 350, 350)
        );

        tree.startRecording('Initial Setup');
        // Добавляем кривые к соответствующим путям
        tree.executeCommand(new BatchAddChildCommand(bottomPath, [bottomCurve1, bottomCurve2]));
        tree.executeCommand(new BatchAddChildCommand(middlePath, [middleCurve1, middleCurve2]));
        tree.executeCommand(new BatchAddChildCommand(topPath, [topCurve1, topCurve2]));

        // Добавляем все пути к холсту
        tree.executeCommand(new BatchAddChildCommand(tree.root, [bottomPath, middlePath, topPath]));

        // Замыкаем пути для создания заполненных прямоугольников
        bottomPath.close();
        middlePath.close();
        topPath.close();

        tree.stopRecording();

        return {
            paths: {
                bottomPath,
                middlePath,
                topPath,
            },
        };
    }
}
