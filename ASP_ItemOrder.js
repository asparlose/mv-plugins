/*:ja
 * @plugindesc アイテムを入手した順に表示する v0.1.0
 * @author asparlose
 * 
 * @param Order
 * @type select
 * @option 新しい順
 * @value desc
 * @option 古い順
 * @value asc
 * @default asc
 */

var $gameItemOrder;

(function() {
    'use strict';
    const parameters = PluginManager.parameters('ASP_ItemOrder');
    const order = parameters.Order;

    class GameItemOrder {
        constructor() {
            this._items = {};
            this._weapons = {};
            this._armors = {};
            this._next = 0;
        }

        serialize() {
            return {
                'items': this._items,
                'weapons': this._weapons,
                'armors': this._armors,
                'next': this._next,
            };
        }

        static deserialize(data) {
            const obj = new GameItemOrder();
            obj._items = data.items || {};
            obj._weapons = data.weapons || {};
            obj._armors = data.armors || {};
            obj._next = data.next || 0;
            return obj;
        }

        collection(item) {
            if (!item) {
                return null;
            } else if (DataManager.isItem(item)) {
                return this._items;
            } else if (DataManager.isWeapon(item)) {
                return this._weapons;
            } else if (DataManager.isArmor(item)) {
                return this._armors;
            } else {
                return null;
            }
        }

        add(item) {
            const collection = this.collection(item);
            if (collection && !collection[item.id]) {
                collection[item.id] = this._next++;
            }
        }

        remove(item) {
            const collection = this.collection(item);
            if (collection) {
                delete collection[item.id];
            }
        }

        get(item) {
            const collection = this.collection(item);
            if (collection && collection[item.id]) {
                return collection[item.id];
            }
            return -1;
        }

        compare(itemA, itemB) {
            return this.get(itemA) - this.get(itemB);
        }
    }

    // init
    const createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        createGameObjects.call(this);
        $gameItemOrder = new GameItemOrder();
    }
    
    // serialize
    const makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = makeSaveContents.call(this);
        contents.itemOrder = $gameItemOrder.serialize();
        return contents;
    }
    
    // deserialize
    const extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        extractSaveContents.call(this, contents);
        $gameItemOrder = GameItemOrder.deserialize(contents.itemOrder);
    }

    const gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        gainItem.call(this, item, amount, includeEquip);
        const container = this.itemContainer(item);
        if (container) {
            if (container[item.id] > 0) {
                $gameItemOrder.add(item);
            } else {
                $gameItemOrder.remove(item);
            }
        }
    }

    const makeItemList = Window_ItemList.prototype.makeItemList;
    Window_ItemList.prototype.makeItemList = function() {
        makeItemList.call(this);
        this._data.sort(function(a, b) {
            if (order === 'asc') {
                return $gameItemOrder.compare(a, b);
            } else if (order === 'desc') {
                return -$gameItemOrder.compare(a, b);
            }
        });
    };
})();