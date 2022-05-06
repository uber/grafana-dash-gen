// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

const DEFAULT_VARIABLE_ALL = '$__all';

function Custom(opts) {
    opts = opts || {};
    this.state = {
        allFormat: 'glob',
        current: null,
        datasource: null,
        includeAll: false,
        allValue: '',
        name: 'template',
        options: [],
        query: null,
        refresh: 1,
        'refresh_on_load': false,
        type: 'custom'
    };
    this.defaultValue = '';

    // Overwrite defaults with custom values
    Object.keys(opts).forEach(key => {
      switch (key) {
        case 'defaultValue':
          this.defaultValue = opts[key];
          break;
        default:
          this.state[key] = opts[key];
      }
    });
    this._processOptions();
}

/*
 * Ensures options are objects, and updates the state's query and current
 * values.
 */
Custom.prototype._processOptions = function _processOptions() {
    if (!this.state.options.length) {
      if (this.defaultValue !== '') {
        throw new SyntaxError("cannot define default value without any options")
      }
      return;
    }

    let newOptions = [];
    let newQuery = [];

    let hasAll = false;
    for (let i = 0; i < this.state.options.length; i++) {
      const option = this.state.options[i];
      const isObject = typeof option === 'object' && option.constructor === Object;
      const opt = isObject ? option : {
        text: option,
        value: option
      };
      if (opt.value === DEFAULT_VARIABLE_ALL) {
        if (hasAll) {
          continue;
        }
        hasAll = true;
      }

      newOptions.push(opt);
      newQuery.push(opt.value);
    }

    if (this.defaultValue !== '') {
      const defaultOption = newOptions.find(option => option.value === this.defaultValue);
      if (!defaultOption) {
        throw new SyntaxError("default value not found in options list")
      }
      this.state.current = defaultOption
    } else if (!this.state.current && !this.state.includeAll) {
      this.state.current = newOptions[0];
    }

    this.state.options = newOptions;
    this.state.query = newQuery.join(',');
};

Custom.prototype.generate = function generate() {
    return this.state;
};

module.exports = Custom;
