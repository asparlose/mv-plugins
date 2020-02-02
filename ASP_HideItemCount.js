/*:ja
 * @plugindesc 指定した個数以上のアイテムのみ個数表記をする v1.0.0
 * @author asparlose
 *
 * @param Item Count Threshold
 * @desc この個数以上のアイテムのみ個数表記をする
 * @default 2
 * @min 1
 * @type number
 */

(function() {
    'use strict';
    
    const params = PluginManager.parameters('ASP_HideItemCount');
    const threshold = Number(params['Item Count Threshold'] || 1);

    const drawItemNumber = Window_ItemList.prototype.drawItemNumber;
    Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
        if ($gameParty.numItems(item) >= threshold) {
            drawItemNumber.call(this, item, x, y, width);
        }
    };
})();