import { Example } from './Example.js';
import { Path } from '../core/Path.js';
import { QuadraticCurve } from '../core/QuadraticCurve.js';
import { CubicCurve } from '../core/CubicCurve.js';
import { Point } from '../core/Point.js';
import { BatchAddChildCommand, SetNodePositionCommand } from '../core/commands/NodeCommands.js';
import { CloneNodeCommand } from '../core/commands/CloneCommands.js';

/**
 * @class CloneExample
 * @extends Example
 * @description Пример для демонстрации клонирования узлов.
 */
export class CloneExample extends Example {
    constructor() {
        super(
            'clone',
            'Clone Example',
            'Демонстрация клонирования узлов с сохранением всех свойств и дочерних элементов.'
        );
    }

    create(tree) {
        // Создаем исходный путь со сложной структурой
        const originalPath = new Path('original', 'Original Path');
        originalPath.setStyle({
            strokeColor: '#646cff',
            strokeWidth: 2,
            fillColor: 'rgba(100, 108, 255, 0.2)',
        });

        // Создаем звезду из кубических кривых
        const points = this.createStarPoints(200, 200, 100, 50, 5);
        const curves = [];

        for (let i = 0; i < points.length; i += 2) {
            const startPoint = points[i];
            const peakPoint = points[i + 1];
            const endPoint = points[(i + 2) % points.length];

            // Создаем контрольные точки для плавной кривой
            const control1 = {
                x: startPoint.x + (peakPoint.x - startPoint.x) * 0.5,
                y: startPoint.y + (peakPoint.y - startPoint.y) * 0.5,
            };
            const control2 = {
                x: peakPoint.x + (endPoint.x - peakPoint.x) * 0.5,
                y: peakPoint.y + (endPoint.y - peakPoint.y) * 0.5,
            };

            curves.push(
                new CubicCurve(
                    `curve${i}`,
                    `Curve ${i}`,
                    new Point(`p${i}`, `Point ${i}`, startPoint.x, startPoint.y),
                    new Point(`c1_${i}`, `Control 1 ${i}`, control1.x, control1.y),
                    new Point(`c2_${i}`, `Control 2 ${i}`, control2.x, control2.y),
                    new Point(`p${i + 1}`, `Point ${i + 1}`, endPoint.x, endPoint.y)
                )
            );
        }

        tree.startRecording('Initial Setup');

        // Добавляем кривые к оригинальному пути
        tree.executeCommand(new BatchAddChildCommand(originalPath, curves));
        tree.executeCommand(new BatchAddChildCommand(tree.root, [originalPath]));

        // Замыкаем путь
        originalPath.close();

        tree.stopRecording();

        // Создаем клон со смещением
        const cloneCommand = new CloneNodeCommand(originalPath, tree.root);
        tree.executeCommand(cloneCommand);

        // Перемещаем клон
        const clonedPath = cloneCommand.clone;
        const setPositionCommand = new SetNodePositionCommand(clonedPath, 100, 0);
        tree.executeCommand(setPositionCommand);
        clonedPath.setStyle({
            strokeColor: '#4ade80',
            fillColor: 'rgba(74, 222, 128, 0.2)',
        });

        return {
            paths: {
                originalPath,
                clonedPath,
            },
        };
    }

    /**
     * @method createStarPoints
     * @private
     * @description Создает точки для звезды.
     * @param {number} cx - Центр X.
     * @param {number} cy - Центр Y.
     * @param {number} outerRadius - Внешний радиус.
     * @param {number} innerRadius - Внутренний радиус.
     * @param {number} points - Количество вершин.
     * @returns {Array<{x: number, y: number}>} Массив точек.
     */
    createStarPoints(cx, cy, outerRadius, innerRadius, points) {
        const result = [];
        const totalPoints = points * 2;
        const angleStep = (Math.PI * 2) / totalPoints;

        for (let i = 0; i < totalPoints; i++) {
            const angle = i * angleStep - Math.PI / 2; // Начинаем с верхней точки
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            result.push({
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius,
            });
        }

        return result;
    }
}
