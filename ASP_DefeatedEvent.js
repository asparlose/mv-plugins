/*:ja
 * @plugindesc 全滅処理にコモンイベントが割り込む v0.1.0
 * @author asparlose
 * 
 * @param CommonEvent
 * @desc 割り込むコモンイベント
 * @default 0
 * @type number
 * @type common_event
 */

(function () {
    const params = PluginManager.parameters('ASP_DefeatedEvent');

    const raiseDefeated = function() {
        var event = $dataCommonEvents[Number(params.CommonEvent || 0)];
        if (event) {
            $gameMap._interpreter.setup(event.list);
        }
    };
    
    Scene_Base.prototype.checkGameover = function() {
        if ($gameParty.isAllDead()) {
            raiseDefeated();
        }
    };

    BattleManager.updateBattleEnd = function () {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                raiseDefeated();
                SceneManager.pop();
            }
        } else {
            SceneManager.pop();
        }
        this._phase = null;
    };
})();