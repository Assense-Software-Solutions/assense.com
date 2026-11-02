const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const source = readFileSync(new URL('../public/assets/theme.js', `file://${__filename}`), 'utf8');
function browser(saved = null, blocked = false) {
  const events = {};
  const changes = {};
  const dataset = {};
  const select = { value: '', addEventListener: (name, handler) => { changes[name] = handler; } };
  const picker = { hidden: true, querySelector: () => select };
  const document = {
    documentElement: { dataset, removeAttribute: () => { delete dataset.theme; } },
    querySelectorAll: selector => selector.endsWith('select') ? [select] : [picker],
    addEventListener: (name, handler) => { events[name] = handler; },
  };
  const storage = new Map(saved === null ? [] : [['assense-theme', saved]]);
  const access = fn => {
    if (blocked) throw new Error('Storage blocked');
    return fn();
  };
  runInNewContext(source, {
    document,
    window: { addEventListener: (name, handler) => { events[name] = handler; } },
    localStorage: {
      getItem: key => access(() => storage.get(key)),
      setItem: (key, value) => access(() => storage.set(key, value)),
      removeItem: key => access(() => storage.delete(key)),
    },
  });
  return {
    dataset, select, picker, storage,
    ready: () => events.DOMContentLoaded(),
    choose(value) { select.value = value; changes.change(); },
    changed: key => events.storage({ key }),
  };
}

test('system is default and the selector is revealed only after initialization', () => {
  const page = browser();
  assert.equal(page.dataset.theme, undefined);
  assert.equal(page.picker.hidden, true);
  page.ready();
  assert.equal(page.picker.hidden, false);
  assert.equal(page.select.value, 'system');
});

for (const theme of ['light', 'dark']) {
  test(`saved ${theme} applies before DOMContentLoaded`, () => {
    const page = browser(theme);
    assert.equal(page.dataset.theme, theme);
    page.ready();
    assert.equal(page.select.value, theme);
  });
}

test('explicit choices persist; System removes the override and stored choice', () => {
  const page = browser();
  page.ready();
  for (const theme of ['dark', 'light']) {
    page.choose(theme);
    assert.equal(page.dataset.theme, theme);
    assert.equal(page.storage.get('assense-theme'), theme);
  }
  page.choose('system');
  assert.equal(page.dataset.theme, undefined);
  assert.equal(page.storage.has('assense-theme'), false);
});

test('invalid stored values fall back to System', () => {
  const page = browser('unexpected');
  page.ready();
  assert.equal(page.dataset.theme, undefined);
  assert.equal(page.select.value, 'system');
});

test('blocked storage still permits changing the current page', () => {
  const page = browser(null, true);
  page.ready();
  page.choose('dark');
  assert.equal(page.dataset.theme, 'dark');
  page.choose('system');
  assert.equal(page.dataset.theme, undefined);
});

test('other tabs and clearing storage synchronize the selector and document', () => {
  const page = browser('dark');
  page.ready();
  page.storage.set('assense-theme', 'light');
  page.changed('unrelated');
  assert.equal(page.dataset.theme, 'dark');
  page.changed('assense-theme');
  assert.equal(page.dataset.theme, 'light');
  assert.equal(page.select.value, 'light');
  page.storage.clear();
  page.changed(null);
  assert.equal(page.dataset.theme, undefined);
  assert.equal(page.select.value, 'system');
});
