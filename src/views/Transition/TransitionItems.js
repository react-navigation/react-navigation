// @flow
import React from 'react';

export type Metrics = {
  x: number,
  y: number,
  width: number,
  height: number,
}

export class TransitionItem {
  id: string;
  routeName: string;
  reactElement: React.Element<*>;
  nativeHandle: any;
  metrics: ?Metrics;
  shouldMeasure: boolean;
  constructor(id: string, routeName: string, reactElement: React.Element<*>, nativeHandle: any, metrics:?Metrics, shouldMeasure: boolean = false) {
    this.id = id;
    this.routeName = routeName;
    this.reactElement = reactElement;
    this.nativeHandle = nativeHandle;
    this.metrics = metrics;
    this.shouldMeasure = shouldMeasure;
  }
  clone() {
    return new TransitionItem(this.id, this.routeName, this.reactElement, this.nativeHandle, this.metrics, this.shouldMeasure);
  }
  toString() {
    return `${this.id} ${this.routeName} handle=${this.nativeHandle} ${JSON.stringify(this.metrics)} shouldMeasure=${this.shouldMeasure}`;
  }
  isMeasured() {
    const isNumber = n => typeof n === 'number';
    const metricsValid = (m: Metrics) => m && [m.x, m.y, m.width, m.height].every(isNumber);
    return metricsValid(this.metrics);
  }
}

type ItemPair = {
  fromItem: TransitionItem,
  toItem: TransitionItem,
};

export type UpdateRequest = {
  id: string,
  routeName: string,
  metrics: ?Metrics,
}

class TransitionItems {
  _items: Array<TransitionItem>;
  constructor(items: Array<TransitionItem> = []) {
    this._items = [...items];
  }
  _findIndex(id: string, routeName: string): number {
    return this._items.findIndex(i => {
      return i.id === id && i.routeName === routeName;
    });
  }
  count() {
    return this._items.length;
  }
  items() {
    return this._items;
  }
  add(item: TransitionItem): TransitionItems {
    if (this._findIndex(item.id, item.routeName) >= 0)
      return this;
    else {
      return new TransitionItems([...this._items, item]);
    }
  }
  remove(id: string, routeName: string): TransitionItems {
    const index = this._findIndex(id, routeName);
    if (index >= 0) {
      // if (id==='$scene-PhotoGrid') console.log('===> removing ', this._items[index].toString());
      const newItems = [...this._items.slice(0, index), ...this._items.slice(index + 1)];
      return new TransitionItems(newItems);
    } else {
      return this;
    }
  }
  updateMetrics(requests: Array<UpdateRequest>): TransitionItems {
    const indexedRequests = requests.map(r => ({
      ...r,
      index: this._findIndex(r.id, r.routeName),
    }));

    if (indexedRequests.every(r => r.index < 0)) return this;
    else {
      let newItems = Array.from(this._items);
      indexedRequests.forEach(r => {
        if (r.index >= 0) {
          const newItem = newItems[r.index].clone();
          newItem.metrics = r.metrics;
          newItems[r.index] = newItem;
        }
      });
      return new TransitionItems(newItems);
    }
  }

  removeAllMetrics(): TransitionItems {
    if (this._items.some(i => !!i.metrics)) {
      const newItems = this._items.map(item => {
        const newItem = item.clone();
        newItem.metrics = null;
        return newItem;
      });
      return new TransitionItems(newItems);
    } else return this;
  }

  areAllMeasured() {
    return this._items.filter(i => i.shouldMeasure).every(i => i.isMeasured());
  }

  setShouldMeasure(itemsToMeasure: Array<TransitionItem>) {
    if (itemsToMeasure && itemsToMeasure.length > 0) {
      const newItems = this._items.map(item => {
        const newItem = item.clone();
        newItem.shouldMeasure = !!itemsToMeasure.find(i => i.id === item.id && i.routeName === item.routeName);
        return newItem;
      });
      return new TransitionItems(newItems);
    } else {
      return this;
    }
  }
}

export default TransitionItems;