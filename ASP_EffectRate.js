/*:ja
 * @plugindesc 運がステート付与率に与える影響を調整する v1.0.0
 * @author asparlose
 * 
 * @param Luck Modifier
 * @desc 運の値が与える影響
 * @default 1
 * @min 0
 * @type number
 */

 (function() {
    'use strict';

    const params = PluginManager.parameters('ASP_EffectRate');
    const luckModifier = Number(params['Luck Modifier'] || 1);

    Game_Action.prototype.lukEffectRate = function(target) {
        // 加害者: this.subject().luk
        // 被害者: target.luk
        return (this.subject().luk / target.luk) ** luckModifier;
    };
 })();