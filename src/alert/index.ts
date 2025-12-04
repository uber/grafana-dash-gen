import _Alert = require('./alert');
import _Condition = require('./condition');

namespace alert {
    export type Alert = _Alert;
    export const Alert = _Alert;
    export type Condition = _Condition;
    export const Condition = _Condition;
}

export = alert;
