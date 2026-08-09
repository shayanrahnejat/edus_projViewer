export function localStoreRuntimeSource() {
  return String.raw`
(function installEdusLocalStoreRuntime(global) {
  function getStorageHost() {
    try {
      if (global.parent && global.parent !== global) {
        void global.parent.location.href;
        return global.parent;
      }
    } catch (_) {}
    return global;
  }

  function createMemoryStorage(kind) {
    const host = getStorageHost();
    let root;

    try {
      root = host.__EDUS_CDE_MEMORY_STORAGE__;
      if (!root) {
        root = {
          local: Object.create(null),
          session: Object.create(null),
        };
        host.__EDUS_CDE_MEMORY_STORAGE__ = root;
      }
    } catch (_) {
      root = {
        local: Object.create(null),
        session: Object.create(null),
      };
    }

    const bucket = root[kind] || (root[kind] = Object.create(null));

    return {
      get length() {
        return Object.keys(bucket).length;
      },
      key(index) {
        return Object.keys(bucket)[index] ?? null;
      },
      getItem(key) {
        const normalized = String(key);
        return Object.prototype.hasOwnProperty.call(bucket, normalized)
          ? bucket[normalized]
          : null;
      },
      setItem(key, value) {
        bucket[String(key)] = String(value);
      },
      removeItem(key) {
        delete bucket[String(key)];
      },
      clear() {
        for (const key of Object.keys(bucket)) delete bucket[key];
      },
    };
  }

  function isWritableStorage(storage) {
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function') {
      return false;
    }

    const probe = '__edus_cde_storage_probe__' + Date.now() + Math.random();

    try {
      storage.setItem(probe, '1');
      storage.removeItem(probe);
      return true;
    } catch (_) {
      return false;
    }
  }

  function resolveBackingStorage(name) {
    const candidates = [];

    try {
      if (global.parent && global.parent !== global) {
        candidates.push(global.parent[name]);
      }
    } catch (_) {}

    try {
      candidates.push(global[name]);
    } catch (_) {}

    try {
      if (global.top && global.top !== global && global.top !== global.parent) {
        candidates.push(global.top[name]);
      }
    } catch (_) {}

    for (const storage of candidates) {
      if (isWritableStorage(storage)) return storage;
    }

    return null;
  }

  function createSafeStorage(kind, nativeName) {
    const memory = createMemoryStorage(kind);
    const backing = resolveBackingStorage(nativeName);
    const projectKey = String(
      global.__EDUS_CDE_PROJECT_KEY__
      || 'default-project',
    ).replace(/[^A-Za-z0-9_.-]/g, '_');
    const prefix = 'EDUS_CDE:' + projectKey + ':' + kind + ':';

    function backingKey(key) {
      return prefix + String(key);
    }

    function readBacking(key) {
      if (!backing) return null;

      try {
        const value = backing.getItem(backingKey(key));
        if (value !== null) {
          memory.setItem(key, value);
          return value;
        }

        const legacyValue = backing.getItem(String(key));
        if (legacyValue !== null) {
          memory.setItem(key, legacyValue);
          try {
            backing.setItem(backingKey(key), legacyValue);
          } catch (_) {}
          return legacyValue;
        }
      } catch (_) {}

      return null;
    }

    function projectKeys() {
      const keys = new Set();

      if (backing) {
        try {
          for (let index = 0; index < backing.length; index += 1) {
            const key = backing.key(index);
            if (typeof key === 'string' && key.startsWith(prefix)) {
              keys.add(key.slice(prefix.length));
            }
          }
        } catch (_) {}
      }

      try {
        for (let index = 0; index < memory.length; index += 1) {
          const key = memory.key(index);
          if (key !== null) keys.add(key);
        }
      } catch (_) {}

      return [...keys];
    }

    return {
      get length() {
        return projectKeys().length;
      },
      key(index) {
        return projectKeys()[index] ?? null;
      },
      getItem(key) {
        const fromBacking = readBacking(key);
        if (fromBacking !== null) return fromBacking;
        return memory.getItem(key);
      },
      setItem(key, value) {
        const normalizedKey = String(key);
        const normalizedValue = String(value);

        memory.setItem(normalizedKey, normalizedValue);

        if (backing) {
          try {
            backing.setItem(
              backingKey(normalizedKey),
              normalizedValue,
            );
          } catch (_) {}
        }
      },
      removeItem(key) {
        const normalizedKey = String(key);
        memory.removeItem(normalizedKey);

        if (backing) {
          try {
            backing.removeItem(backingKey(normalizedKey));
          } catch (_) {}
        }
      },
      clear() {
        const keys = projectKeys();
        memory.clear();

        if (backing) {
          for (const key of keys) {
            try {
              backing.removeItem(backingKey(key));
            } catch (_) {}
          }
        }
      },
    };
  }

  const safeLocalStorage = createSafeStorage('local', 'localStorage');
  const safeSessionStorage = createSafeStorage('session', 'sessionStorage');

  global.__EDUS_CDE_LOCAL_STORAGE__ = safeLocalStorage;
  global.__EDUS_CDE_SESSION_STORAGE__ = safeSessionStorage;

  function installWindowStorageFacade(name, storage) {
    try {
      Object.defineProperty(global, name, {
        configurable: true,
        enumerable: true,
        get() {
          return storage;
        },
      });
      return;
    } catch (_) {}

    try {
      global[name] = storage;
    } catch (_) {}
  }

  installWindowStorageFacade('localStorage', safeLocalStorage);
  installWindowStorageFacade('sessionStorage', safeSessionStorage);

  if (global.createStore) {
    global.CDEModules = global.CDEModules || {};
    global.CDEModules['@edus/data-store'] = global.CDEModules['@edus/data-store'] || { createStore: global.createStore };
    global.CDEModules['data-store'] = global.CDEModules['data-store'] || { createStore: global.createStore };
    return;
  }

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
      if (!storage) return {};
      try {
        const raw = storage.getItem(key);
        return raw ? JSON.parse(raw) : {};
      } catch (_) { return {}; }
    };

    const localStorageRef = safeLocalStorage;
    const sessionStorageRef = safeSessionStorage;

    let state = {
      ...defaults,
      ...readStorage(localStorageRef, localStoreKey),
      ...readStorage(sessionStorageRef, sessionStoreKey),
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
        const storage = bucket === 'session' ? sessionStorageRef : localStorageRef;
        if (!storage || typeof storage.setItem !== 'function') return;
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
