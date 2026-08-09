export function localStoreRuntimeSource() {
  return String.raw`
(function installEdusLocalStoreRuntime(global) {
  if (global.createStore) return;

  const clone = (value) => {
    try { return structuredClone(value); } catch (_) {
      try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
    }
  };

  function createStore(options = {}) {
    const models = Array.isArray(options.models) ? options.models : [];
    const localStoreKey = options.localStoreKey || 'EDUS_CDE_LOCAL_STORE';
    const sessionStoreKey = options.sessionStoreKey || 'EDUS_CDE_SESSION_STORE';
    const subscribers = new Set();
    const modelMap = new Map(models.map((model) => [model.name, model]));

    const defaults = {};
    for (const model of models) {
      if (!model?.name) continue;
      const value = Object.prototype.hasOwnProperty.call(model, 'defaultData') ? model.defaultData : model._data;
      defaults[model.name] = clone(value ?? (model.type === 'list' ? [] : null));
    }

    const readStorage = (storage, key) => {
      try {
        const raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : {};
      } catch (_) { return {}; }
    };

    let state = {
      ...defaults,
      ...readStorage(global.localStorage, localStoreKey),
      ...readStorage(global.sessionStorage, sessionStoreKey),
    };

    const notify = () => {
      for (const listener of subscribers) {
        try { listener(state); } catch (error) { console.error(error); }
      }
    };

    const persistBucket = (bucket) => {
      const target = {};
      for (const model of models) {
        if (model?.store === bucket && model.name in state) target[model.name] = state[model.name];
      }
      try {
        const storage = bucket === 'session' ? global.sessionStorage : global.localStorage;
        const key = bucket === 'session' ? sessionStoreKey : localStoreKey;
        storage.setItem(key, JSON.stringify(target));
      } catch (_) {}
    };

    const api = {
      get(name) {
        if (typeof name === 'string') return state[name];
        return state;
      },
      set(patchOrName, value) {
        const patch = typeof patchOrName === 'string' ? { [patchOrName]: value } : (patchOrName || {});
        state = { ...state, ...patch };
        persistBucket('local');
        persistBucket('session');
        notify();
        return state;
      },
      update(name, updater) {
        return api.set(name, typeof updater === 'function' ? updater(state[name]) : updater);
      },
      subscribe(listener) {
        subscribers.add(listener);
        return () => subscribers.delete(listener);
      },
      getModel(name) { return modelMap.get(name) || null; },
      persist(name, _operation, value) {
        if (typeof name === 'string') state = { ...state, [name]: value };
        persistBucket('local');
        persistBucket('session');
        notify();
        return true;
      },
      reset(name) {
        if (name) state = { ...state, [name]: clone(defaults[name]) };
        else state = clone(defaults);
        persistBucket('local');
        persistBucket('session');
        notify();
      },
      resetAll() { api.reset(); },
    };

    return api;
  }

  global.createStore = createStore;
  global.CDEModules = global.CDEModules || {};
  global.CDEModules['@edus/data-store'] = { createStore };
  global.CDEModules['data-store'] = { createStore };
})(window);
`;
}
