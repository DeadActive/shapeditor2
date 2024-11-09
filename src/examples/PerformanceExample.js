import { Example } from './Example.js';
import { Path } from '../core/Path.js';
import { QuadraticCurve } from '../core/QuadraticCurve.js';
import { CubicCurve } from '../core/CubicCurve.js';
import { Point } from '../core/Point.js';
import { BatchAddChildCommand } from '../core/commands/NodeCommands.js';

/**
 * @class PerformanceExample
 * @extends Example
 * @description Пример с большим количеством кривых для тестирования производительности.
 */
export class PerformanceExample extends Example {
    constructor() {
        super(
            'performance',
            'Performance Test',
            'Тест производительности с 4000 кривых (по 1000 квадратичных, кубических и спиральных).'
        );
    }

    create(tree) {
        const quadPath = new Path('quad_path', 'Path with 1000 Quadratic Curves');
        const cubicPath = new Path('cubic_path', 'Path with 1000 Cubic Curves');
        const spiralQuadPath = new Path('spiral_quad_path', 'Path with 1000 Spiral Quadratic Curves');
        const spiralCubicPath = new Path('spiral_cubic_path', 'Path with 1000 Spiral Cubic Curves');

        // Настраиваем стили путей
        quadPath.setStyle({
            strokeColor: '#ff6b6b',
            strokeWidth: 1,
            fillColor: 'none',
        });

        cubicPath.setStyle({
            strokeColor: '#4ecdc4',
            strokeWidth: 1,
            fillColor: 'none',
        });

        spiralQuadPath.setStyle({
            strokeColor: '#ffd93d',
            strokeWidth: 1,
            fillColor: 'none',
        });

        spiralCubicPath.setStyle({
            strokeColor: '#6c5ce7',
            strokeWidth: 1,
            fillColor: 'none',
        });

        // Создаем 1000 квадратичных кривых
        const quadCurves = [];
        for (let i = 0; i < 1000; i++) {
            const startX = i;
            const startY = Math.sin(i * 0.1) * 50 + 200;
            const controlX = i + 1;
            const controlY = Math.sin((i + 1) * 0.1) * 100 + 200;
            const endX = i + 2;
            const endY = Math.sin((i + 2) * 0.1) * 50 + 200;

            quadCurves.push(
                new QuadraticCurve(
                    `q${i}`,
                    `Quad ${i}`,
                    new Point(`qs${i}`, `Start ${i}`, startX, startY),
                    new Point(`qc${i}`, `Control ${i}`, controlX, controlY),
                    new Point(`qe${i}`, `End ${i}`, endX, endY)
                )
            );
        }

        // Создаем 1000 кубических кривых
        const cubicCurves = [];
        for (let i = 0; i < 1000; i++) {
            const startX = i;
            const startY = Math.cos(i * 0.1) * 50 + 400;
            const control1X = i + 0.7;
            const control1Y = Math.cos((i + 1) * 0.1) * 100 + 400;
            const control2X = i + 1.3;
            const control2Y = Math.cos((i + 2) * 0.1) * 100 + 400;
            const endX = i + 2;
            const endY = Math.cos((i + 3) * 0.1) * 50 + 400;

            cubicCurves.push(
                new CubicCurve(
                    `c${i}`,
                    `Cubic ${i}`,
                    new Point(`cs${i}`, `Start ${i}`, startX, startY),
                    new Point(`cc1${i}`, `Control 1 ${i}`, control1X, control1Y),
                    new Point(`cc2${i}`, `Control 2 ${i}`, control2X, control2Y),
                    new Point(`ce${i}`, `End ${i}`, endX, endY)
                )
            );
        }

        // Создаем 1000 спиральных квадратичных кривых
        const spiralQuadCurves = [];
        for (let i = 0; i < 1000; i++) {
            const angle = i * 0.1;
            const radius = 30 + i * 0.05;
            const startX = i;
            const startY = Math.sin(angle) * radius + 600;
            const controlX = i + 1;
            const controlY = Math.sin(angle + 0.5) * (radius + 10) + 600;
            const endX = i + 2;
            const endY = Math.sin(angle + 1) * radius + 600;

            spiralQuadCurves.push(
                new QuadraticCurve(
                    `sq${i}`,
                    `Spiral Quad ${i}`,
                    new Point(`sqs${i}`, `Start ${i}`, startX, startY),
                    new Point(`sqc${i}`, `Control ${i}`, controlX, controlY),
                    new Point(`sqe${i}`, `End ${i}`, endX, endY)
                )
            );
        }

        // Создаем 1000 спиральных кубических кривых
        const spiralCubicCurves = [];
        for (let i = 0; i < 1000; i++) {
            const angle = i * 0.1;
            const radius = 30 + i * 0.05;
            const startX = i;
            const startY = Math.sin(angle) * radius + 800;
            const control1X = i + 0.7;
            const control1Y = Math.sin(angle + 0.3) * (radius + 15) + 800;
            const control2X = i + 1.3;
            const control2Y = Math.sin(angle + 0.6) * (radius + 15) + 800;
            const endX = i + 2;
            const endY = Math.sin(angle + 1) * radius + 800;

            spiralCubicCurves.push(
                new CubicCurve(
                    `sc${i}`,
                    `Spiral Cubic ${i}`,
                    new Point(`scs${i}`, `Start ${i}`, startX, startY),
                    new Point(`scc1${i}`, `Control 1 ${i}`, control1X, control1Y),
                    new Point(`scc2${i}`, `Control 2 ${i}`, control2X, control2Y),
                    new Point(`sce${i}`, `End ${i}`, endX, endY)
                )
            );
        }

        // Добавляем кривые к соответствующим путям
        tree.executeCommand(new BatchAddChildCommand(quadPath, quadCurves));
        tree.executeCommand(new BatchAddChildCommand(cubicPath, cubicCurves));
        tree.executeCommand(new BatchAddChildCommand(spiralQuadPath, spiralQuadCurves));
        tree.executeCommand(new BatchAddChildCommand(spiralCubicPath, spiralCubicCurves));

        // Добавляем пути к холсту
        tree.executeCommand(
            new BatchAddChildCommand(tree.root, [quadPath, cubicPath, spiralQuadPath, spiralCubicPath])
        );

        return {
            paths: {
                quadPath,
                cubicPath,
                spiralQuadPath,
                spiralCubicPath,
            },
        };
    }
}
