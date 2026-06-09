(function installBrowserCompatibility() {
  if (typeof Promise.withResolvers !== "function") {
    Promise.withResolvers = function withResolvers() {
      let resolve;
      let reject;
      const promise = new Promise((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
      });
      return { promise, resolve, reject };
    };
  }

  if (typeof Promise.try !== "function") {
    Promise.try = function promiseTry(callback, ...args) {
      return new Promise((resolve) => resolve(callback(...args)));
    };
  }

  if (typeof URL.parse !== "function") {
    URL.parse = function parseUrl(url, base) {
      try {
        return new URL(url, base);
      } catch {
        return null;
      }
    };
  }

  if (typeof Map.prototype.getOrInsertComputed !== "function") {
    Object.defineProperty(Map.prototype, "getOrInsertComputed", {
      configurable: true,
      writable: true,
      value(key, callback) {
        if (!this.has(key)) this.set(key, callback(key));
        return this.get(key);
      },
    });
  }

  if (typeof Array.prototype.findLast !== "function") {
    Object.defineProperty(Array.prototype, "findLast", {
      configurable: true,
      writable: true,
      value(callback, thisArg) {
        for (let index = this.length - 1; index >= 0; index -= 1) {
          if (callback.call(thisArg, this[index], index, this)) return this[index];
        }
        return undefined;
      },
    });
  }

  if (typeof Uint8Array.fromBase64 !== "function") {
    Uint8Array.fromBase64 = function fromBase64(value) {
      const binary = atob(value);
      return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    };
  }

  if (typeof Uint8Array.prototype.toBase64 !== "function") {
    Object.defineProperty(Uint8Array.prototype, "toBase64", {
      configurable: true,
      writable: true,
      value() {
        let binary = "";
        const chunkSize = 0x8000;
        for (let index = 0; index < this.length; index += chunkSize) {
          binary += String.fromCharCode(...this.subarray(index, index + chunkSize));
        }
        return btoa(binary);
      },
    });
  }
})();
