
export function monkeyPatching(target, funName:string, cb:Function, createIfNotExist?:Boolean) {
    let func:Function = target[funName];
    if (typeof func === 'function') {
        target[funName] = function() {
            func.call(this, arguments)
            cb && cb.call(this);
        }
    } else if (createIfNotExist) {
        target[funName] = cb;
    } else {
        console.error('monkeyPatching fail:', funName);
    }
}

export function merge(src, dst) {
    for (const key in dst) {
        let value = dst[key];
        let type = typeof value;
        if (type === 'object') {
            let o = src[key] || {};
            merge(o, value);
        } else {
            src[key] = value;
        }
    }
}

