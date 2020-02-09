/*:ja
 * @plugindesc マップイベントを呼び出します。 v1.0.0
 * @author asparlose
 * 
 * @param Command
 * @desc プラグインコマンドの名前を変更します。
 * @default InvokeMapEvent
 * 
 * @help
 * プラグインコマンド:
 *   InvokeMapEvent {event}        # イベント番号 {event} の現在のページを呼び出す
 *   InvokeMapEvent {event} {page} # イベント番号 {event} のページ番号 {page} を呼び出す
 * */

(function() {
    'use strict';

    const params = PluginManager.parameters('ASP_InvokeMapEvent');
    const invokeCommand = String(params.Command || 'InvokeMapEvent');

    const pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        pluginCommand.call(this, command, args);
        if (command === invokeCommand) {
            this.invokeMapEvent(args[0], args[1])
        }
    };

    /**
     * @param {Number} eventId イベント ID。
     * @param {Number} [pageId] 1から始まるページ番号。
     */
    Game_Interpreter.prototype.invokeMapEvent = function(eventId, pageId) {
        const event = $gameMap.event(Number(eventId));
        if (!event) {
            console.error('failed to invoke map event id: %o', eventId);
            return false;
        }

        pageId = Number(pageId || 0);
        const page = pageId > 0 ? event.event().pages[pageId - 1] : event.page();
        if (!page) {
            console.error('failed to invoke map event page: %o', pageId);
            return false;
        }

        const unlock = 'this.setLock(' + eventId + ', ' + event._locked + ')';
        event._locked = true;
        const eventList = page.list.slice();
        eventList.splice(-1, 0, {
            'code': 355, // script
            'indent': 0,
            'parameters': [
                unlock,
            ],
        });

        this.setupChild(eventList, eventId);
        return true;
    };

    Game_Interpreter.prototype.setLock = function(eventId, locked) {
        const event = $gameMap.event(Number(eventId));
        if (!event) {
            console.error('failed to detect map event id: %o', eventId);
            return false;
        }

        event._locked = locked;
        return true;
    };
})();