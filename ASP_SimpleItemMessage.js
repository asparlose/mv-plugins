/*:ja
 * @plugindesc アイテム入手時にメッセージが割り込む
 * @author asparlose
 * 
 * @param Enabled Switch
 * @desc 有効にするためのスイッチ番号
 * @default 0
 * @type switch
 * 
 * @param SE
 * @desc アイテムを入手したときのSE
 * @defaut
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param Multiply Message
 * @desc アイテムを複数個入手したときのメッセージ
 * @default %1 %2個
 * 
 */

(function() {
    'use strict';
    
    const params = PluginManager.parameters('ASP_SimpleItemMessage');
    const paramSwitch = Number(params['Enabled Switch'] || 0);
    const paramSE = params['SE'];
    const paramMultiply = String(params['Multiply Message'] || 'x%2 %1');

    const message = function(msg, item) {
        if (!paramSwitch || $gameSwitches.value(paramSwitch)) {
            if (item && item.meta.obtain === 'false') {
                return;
            }
            if (paramSE) {
                AudioManager.playSe({
                    name: paramSE,
                    volume: 80,
                    pitch: 100,
                    pan: 0,
                });
            }
            $gameMessage._positionType = 2;
            $gameMessage.newPage();
            $gameMessage.add(msg);
        }
    };

    const gainItem = function(item, value, armed) {
        $gameParty.gainItem(item, value, armed);
        if (value > 0 && !item.meta['no_gain_message']) {
            if (value > 1) {
                message(TextManager.obtainItem.format(paramMultiply.format(item.name, value)), item);
            } else {
                message(TextManager.obtainItem.format(item.name), item);
            }
        }
    }

    // 金の取得
    Game_Interpreter.prototype.command125 = function() {
        const value = this.operateValue(this._params[0], this._params[1], this._params[2]);
        $gameParty.gainGold(value);
        if (value > 0) {
            message(TextManager.obtainGold.format(value));
        }
        return true;    
    };

    // アイテムの取得
    Game_Interpreter.prototype.command126 = function() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        gainItem($dataItems[this._params[0]], value);
        return true;    
    };

    // 武器の取得
    Game_Interpreter.prototype.command127 = function() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        gainItem($dataWeapons[this._params[0]], value, this._params[4]);
        return true;    
    };

    // 防具の取得
    Game_Interpreter.prototype.command128 = function() {
        const value = this.operateValue(this._params[1], this._params[2], this._params[3]);
        gainItem($dataArmors[this._params[0]], value, this._params[4]);
        return true;    
    };
})();
