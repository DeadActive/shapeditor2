/**
 * @class AppContext
 * @description Глобальный контекст приложения, предоставляющий доступ к экземпляру App.
 */
export class AppContext {
    static #instance = null;

    /**
     * @method setApp
     * @description Устанавливает экземпляр приложения.
     * @param {App} app - Экземпляр приложения.
     */
    static setApp(app) {
        if (AppContext.#instance) {
            throw new Error('App instance is already set');
        }
        AppContext.#instance = app;
    }

    /**
     * @method getApp
     * @description Возвращает экземпляр приложения.
     * @returns {App} Экземпляр приложения.
     */
    static getApp() {
        if (!AppContext.#instance) {
            throw new Error('App instance is not set');
        }
        return AppContext.#instance;
    }

    /**
     * @method clear
     * @description Очищает экземпляр приложения.
     */
    static clear() {
        AppContext.#instance = null;
    }
}
