declare global {
  interface Array<T> {
    remove: (this: T[], value: T) => boolean;
  }

  interface String {
    replaceAll(target: string, str: string, newStr: string): string;
  }

  interface String {
    capitalize(): string;
  }
}

(String.prototype as any).capitalize = function capitalize() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

(String.prototype as any).replaceAll = function (
  this: string,
  str: string,
  newStr: string
) {
  if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]") {
    return this.replace(str, newStr);
  }

  return this.replace(new RegExp(str, "g"), newStr);
};

(Array.prototype as any).remove = function (value: any) {
  const index = this.indexOf(value);
  if (index !== -1) {
    this.splice(index, 1);
    return true;
  } else {
    return false;
  }
};

export {};
