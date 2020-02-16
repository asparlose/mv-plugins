/*:ja
 * @plugindesc セーブ画面に表示するタイトルを変更する v0.1.1
 * @author asparlose
 * 
 * @param Default
 * @desc デフォルトのタイトル
 * @default \p[1]
 * @type string
 * 
 * @param SetSaveTitleCommand
 * @desc セーブデータ タイトルを設定するコマンド名。
 * @default SetSaveTitle
 * @type string
 */

var $saveTitle;

(function() {
    'use strict';

    const params = PluginManager.parameters('ASP_SaveTitle');
    const defaultTitle = String(params.Default || '\\p[0]');
    const setSaveTitleCommand = String(params.SetSaveTitleCommand || 'SetSaveTitle');

    /**
     * @param {String} text 
     */
    const processEscape = function(text) {
        if (text === null) {
            return '';
        }

        const pattern = /(\\+)([a-z])\[([0-9]+)\]/i;
        let split = text.split(pattern);
        
        let result = '';
        while(split.length > 1) {
            const [t, s, a, i] = split.slice(0, 4);
            split = split.slice(4);

            const i2 = processEscape(i);

            if (s.length % 2 == 0) {
                result += t + s + a + '[' + i2 + ']';
                continue;
            }

            result += t + s.slice(1);

            switch (a.toLowerCase()) {
                case 'p':
                    result += $gameActors.actor($gameParty._actors[Number(i2) - 1]).name();
                    break;
                case 'n':
                    result += $gameActors.actor(Number(i2)).name();
                    break;
                case 'v':
                    result += $gameVariables.value(Number(i2));
                    break;
                default:
                    result += a + '[' + i2 + ']';
                    break;
            }           
        }
        result += split.join('');
        return result;
    };

    // init
    const createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        createGameObjects.call(this);
        $saveTitle = defaultTitle;
    }

    // serialize
    const makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = makeSaveContents.call(this);
        contents.saveTitleTemplate = $saveTitle;
        return contents;
    }

    const makeSavefileInfo = DataManager.makeSavefileInfo;
    DataManager.makeSavefileInfo = function() {
        const info = makeSavefileInfo.call(this);
        info.title = processEscape($saveTitle || defaultTitle) || info.title;
        return info;
    }

    // deserialize
    const extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        extractSaveContents.call(this, contents);
        $saveTitle = contents.saveTitleTemplate || defaultTitle;
    };

    /**
     * セーブデータ タイトルを設定する。
     * @param {String} saveTitle 新しいセーブデータ タイトル
     */
    Game_Interpreter.prototype.setSaveTitle = function(saveTitle) {
        $saveTitle = saveTitle;
    }
    
    const pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        pluginCommand.call(this, command, args);
        if (command === setSaveTitleCommand) {
            this.setSaveTitle(String(JSON.parse(args[0])));
        }
    };
})();
