
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe$1(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe$1(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.48.0 */

    function create_fragment$s(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.48.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.48.0 */
    const file$o = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$q(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$o, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 15361) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    function link(node) {
      function onClick(event) {
        const anchor = event.currentTarget;

        if (
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event)
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    /* src\components\topic\TopicListItem.svelte generated by Svelte v3.48.0 */

    const { console: console_1$2 } = globals;
    const file$n = "src\\components\\topic\\TopicListItem.svelte";

    function create_fragment$p(ctx) {
    	let li;
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let p;
    	let t0_value = /*topic*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let div2;
    	let a;
    	let t4;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*publicOrPrivate*/ ctx[2]);
    			t3 = space();
    			div2 = element("div");
    			a = element("a");
    			t4 = text("details");
    			add_location(p, file$n, 13, 24, 574);
    			attr_dev(span, "class", `tag ${/*publicOrPrivateTagColor*/ ctx[3]} is-rounded my-2`);
    			add_location(span, file$n, 14, 24, 619);
    			attr_dev(div0, "class", "is-flex is-flex-direction-column is-justify-content-space-around");
    			add_location(div0, file$n, 12, 16, 471);
    			attr_dev(div1, "class", "level-left");
    			add_location(div1, file$n, 11, 12, 430);
    			attr_dev(a, "class", "button is-link is-small is-rounded");
    			attr_dev(a, "href", a_href_value = `/topics/${/*topic*/ ctx[0].id}`);
    			add_location(a, file$n, 21, 16, 894);
    			attr_dev(div2, "class", "level-right");
    			add_location(div2, file$n, 20, 12, 852);
    			attr_dev(div3, "class", "levels");
    			add_location(div3, file$n, 10, 8, 397);
    			attr_dev(div4, "class", "box " + /*colorClass*/ ctx[1]);
    			add_location(div4, file$n, 9, 4, 355);
    			attr_dev(li, "class", "block p-0");
    			add_location(li, file$n, 8, 0, 328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(span, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, t4);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*topic*/ 1 && t0_value !== (t0_value = /*topic*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*topic*/ 1 && a_href_value !== (a_href_value = `/topics/${/*topic*/ ctx[0].id}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicListItem', slots, []);
    	let { topic } = $$props;

    	let colorClass = topic.public
    	? "has-background-success"
    	: "has-background-light";

    	console.log(colorClass);
    	let publicOrPrivate = topic.public ? "public" : "private";
    	let publicOrPrivateTagColor = topic.public ? "is-light" : "is-dark";
    	const writable_props = ['topic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<TopicListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		topic,
    		colorClass,
    		publicOrPrivate,
    		publicOrPrivateTagColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('colorClass' in $$props) $$invalidate(1, colorClass = $$props.colorClass);
    		if ('publicOrPrivate' in $$props) $$invalidate(2, publicOrPrivate = $$props.publicOrPrivate);
    		if ('publicOrPrivateTagColor' in $$props) $$invalidate(3, publicOrPrivateTagColor = $$props.publicOrPrivateTagColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [topic, colorClass, publicOrPrivate, publicOrPrivateTagColor];
    }

    class TopicListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { topic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicListItem",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console_1$2.warn("<TopicListItem> was created without expected prop 'topic'");
    		}
    	}

    	get topic() {
    		throw new Error("<TopicListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<TopicListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\topic\TopicList.svelte generated by Svelte v3.48.0 */
    const file$m = "src\\components\\topic\\TopicList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (12:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No topics to be displayed";
    			attr_dev(p, "class", "content");
    			add_location(p, file$m, 13, 8, 294);
    			attr_dev(div, "class", "container");
    			add_location(div, file$m, 12, 4, 262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(12:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if topics.length}
    function create_if_block$b(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*topics*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*topic*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "scroll-box");
    			add_location(ul, file$m, 6, 0, 135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*topics*/ 1) {
    				each_value = /*topics*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(6:0) {#if topics.length}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each topics as topic (topic.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let topiclistitem;
    	let current;

    	topiclistitem = new TopicListItem({
    			props: { topic: /*topic*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(topiclistitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(topiclistitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const topiclistitem_changes = {};
    			if (dirty & /*topics*/ 1) topiclistitem_changes.topic = /*topic*/ ctx[1];
    			topiclistitem.$set(topiclistitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topiclistitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topiclistitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(topiclistitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(8:4) {#each topics as topic (topic.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*topics*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicList', slots, []);
    	let { topics = [] } = $$props;
    	const writable_props = ['topics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topics' in $$props) $$invalidate(0, topics = $$props.topics);
    	};

    	$$self.$capture_state = () => ({ TopicListItem, topics });

    	$$self.$inject_state = $$props => {
    		if ('topics' in $$props) $$invalidate(0, topics = $$props.topics);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [topics];
    }

    class TopicList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { topics: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicList",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get topics() {
    		throw new Error("<TopicList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<TopicList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class User {
        constructor() {
            this.id = "";
            this.username = "";
            this.email = "";
            this.topics = new Map();
            this.createdTopics = new Map();
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var secureLs = createCommonjsModule(function (module, exports) {
    (function webpackUniversalModuleDefinition(root, factory) {
    	module.exports = factory();
    })(commonjsGlobal, function() {
    return /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/
    /******/ 		// Check if module is in cache
    /******/ 		if(installedModules[moduleId])
    /******/ 			return installedModules[moduleId].exports;
    /******/
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = installedModules[moduleId] = {
    /******/ 			exports: {},
    /******/ 			id: moduleId,
    /******/ 			loaded: false
    /******/ 		};
    /******/
    /******/ 		// Execute the module function
    /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ 		// Flag the module as loaded
    /******/ 		module.loaded = true;
    /******/
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
    	
    	Object.defineProperty(exports, "__esModule", {
    	  value: true
    	});
    	
    	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    	
    	var _utils = __webpack_require__(1);
    	
    	var _utils2 = _interopRequireDefault(_utils);
    	
    	var _constants = __webpack_require__(2);
    	
    	var _constants2 = _interopRequireDefault(_constants);
    	
    	var _encUtf = __webpack_require__(8);
    	
    	var _encUtf2 = _interopRequireDefault(_encUtf);
    	
    	var _Base = __webpack_require__(9);
    	
    	var _Base2 = _interopRequireDefault(_Base);
    	
    	var _lzString = __webpack_require__(10);
    	
    	var _lzString2 = _interopRequireDefault(_lzString);
    	
    	var _aes = __webpack_require__(11);
    	
    	var _aes2 = _interopRequireDefault(_aes);
    	
    	var _tripledes = __webpack_require__(16);
    	
    	var _tripledes2 = _interopRequireDefault(_tripledes);
    	
    	var _rabbit = __webpack_require__(17);
    	
    	var _rabbit2 = _interopRequireDefault(_rabbit);
    	
    	var _rc = __webpack_require__(18);
    	
    	var _rc2 = _interopRequireDefault(_rc);
    	
    	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    	
    	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    	
    	var SecureLS = function () {
    	  function SecureLS(config) {
    	    _classCallCheck(this, SecureLS);
    	
    	    config = config || {};
    	    this._name = 'secure-ls';
    	    this.utils = _utils2.default;
    	    this.constants = _constants2.default;
    	    this.Base64 = _Base2.default;
    	    this.LZString = _lzString2.default;
    	    this.AES = _aes2.default;
    	    this.DES = _tripledes2.default;
    	    this.RABBIT = _rabbit2.default;
    	    this.RC4 = _rc2.default;
    	    this.enc = _encUtf2.default;
    	
    	    this.config = {
    	      isCompression: true,
    	      encodingType: _constants2.default.EncrytionTypes.BASE64,
    	      encryptionSecret: config.encryptionSecret,
    	      encryptionNamespace: config.encryptionNamespace
    	    };
    	    this.config.isCompression = typeof config.isCompression !== 'undefined' ? config.isCompression : true;
    	    this.config.encodingType = typeof config.encodingType !== 'undefined' || config.encodingType === '' ? config.encodingType.toLowerCase() : _constants2.default.EncrytionTypes.BASE64;
    	
    	    this.ls = localStorage;
    	    this.init();
    	  }
    	
    	  _createClass(SecureLS, [{
    	    key: 'init',
    	    value: function init() {
    	      var metaData = this.getMetaData();
    	
    	      this.WarningEnum = this.constants.WarningEnum;
    	      this.WarningTypes = this.constants.WarningTypes;
    	      this.EncrytionTypes = this.constants.EncrytionTypes;
    	
    	      this._isBase64 = this._isBase64EncryptionType();
    	      this._isAES = this._isAESEncryptionType();
    	      this._isDES = this._isDESEncryptionType();
    	      this._isRabbit = this._isRabbitEncryptionType();
    	      this._isRC4 = this._isRC4EncryptionType();
    	      this._isCompression = this._isDataCompressionEnabled();
    	
    	      // fill the already present keys to the list of keys being used by secure-ls
    	      this.utils.allKeys = metaData.keys || this.resetAllKeys();
    	    }
    	  }, {
    	    key: '_isBase64EncryptionType',
    	    value: function _isBase64EncryptionType() {
    	      return _Base2.default && (typeof this.config.encodingType === 'undefined' || this.config.encodingType === this.constants.EncrytionTypes.BASE64);
    	    }
    	  }, {
    	    key: '_isAESEncryptionType',
    	    value: function _isAESEncryptionType() {
    	      return _aes2.default && this.config.encodingType === this.constants.EncrytionTypes.AES;
    	    }
    	  }, {
    	    key: '_isDESEncryptionType',
    	    value: function _isDESEncryptionType() {
    	      return _tripledes2.default && this.config.encodingType === this.constants.EncrytionTypes.DES;
    	    }
    	  }, {
    	    key: '_isRabbitEncryptionType',
    	    value: function _isRabbitEncryptionType() {
    	      return _rabbit2.default && this.config.encodingType === this.constants.EncrytionTypes.RABBIT;
    	    }
    	  }, {
    	    key: '_isRC4EncryptionType',
    	    value: function _isRC4EncryptionType() {
    	      return _rc2.default && this.config.encodingType === this.constants.EncrytionTypes.RC4;
    	    }
    	  }, {
    	    key: '_isDataCompressionEnabled',
    	    value: function _isDataCompressionEnabled() {
    	      return this.config.isCompression;
    	    }
    	  }, {
    	    key: 'getEncryptionSecret',
    	    value: function getEncryptionSecret(key) {
    	      var metaData = this.getMetaData();
    	      var obj = this.utils.getObjectFromKey(metaData.keys, key);
    	
    	      if (!obj) {
    	        return;
    	      }
    	
    	      if (this._isAES || this._isDES || this._isRabbit || this._isRC4) {
    	        if (typeof this.config.encryptionSecret === 'undefined') {
    	          this.utils.encryptionSecret = obj.s;
    	
    	          if (!this.utils.encryptionSecret) {
    	            this.utils.encryptionSecret = this.utils.generateSecretKey();
    	            this.setMetaData();
    	          }
    	        } else {
    	          this.utils.encryptionSecret = this.config.encryptionSecret || obj.s || '';
    	        }
    	      }
    	    }
    	  }, {
    	    key: 'get',
    	    value: function get(key, isAllKeysData) {
    	      var decodedData = '',
    	          jsonData = '',
    	          deCompressedData = void 0,
    	          bytes = void 0,
    	          data = void 0;
    	
    	      if (!this.utils.is(key)) {
    	        this.utils.warn(this.WarningEnum.KEY_NOT_PROVIDED);
    	        return jsonData;
    	      }
    	
    	      data = this.getDataFromLocalStorage(key);
    	
    	      if (!data) {
    	        return jsonData;
    	      }
    	
    	      deCompressedData = data; // saves else
    	      if (this._isCompression || isAllKeysData) {
    	        // meta data always compressed
    	        deCompressedData = _lzString2.default.decompressFromUTF16(data);
    	      }
    	
    	      decodedData = deCompressedData; // saves else
    	      if (this._isBase64 || isAllKeysData) {
    	        // meta data always Base64
    	        decodedData = _Base2.default.decode(deCompressedData);
    	      } else {
    	        this.getEncryptionSecret(key);
    	        if (this._isAES) {
    	          bytes = _aes2.default.decrypt(deCompressedData.toString(), this.utils.encryptionSecret);
    	        } else if (this._isDES) {
    	          bytes = _tripledes2.default.decrypt(deCompressedData.toString(), this.utils.encryptionSecret);
    	        } else if (this._isRabbit) {
    	          bytes = _rabbit2.default.decrypt(deCompressedData.toString(), this.utils.encryptionSecret);
    	        } else if (this._isRC4) {
    	          bytes = _rc2.default.decrypt(deCompressedData.toString(), this.utils.encryptionSecret);
    	        }
    	
    	        if (bytes) {
    	          decodedData = bytes.toString(_encUtf2.default._Utf8);
    	        }
    	      }
    	
    	      try {
    	        jsonData = JSON.parse(decodedData);
    	      } catch (e) {
    	        throw new Error('Could not parse JSON');
    	      }
    	
    	      return jsonData;
    	    }
    	  }, {
    	    key: 'getDataFromLocalStorage',
    	    value: function getDataFromLocalStorage(key) {
    	      return this.ls.getItem(key, true);
    	    }
    	  }, {
    	    key: 'getAllKeys',
    	    value: function getAllKeys() {
    	      var data = this.getMetaData();
    	
    	      return this.utils.extractKeyNames(data) || [];
    	    }
    	  }, {
    	    key: 'set',
    	    value: function set(key, data) {
    	      var dataToStore = '';
    	
    	      if (!this.utils.is(key)) {
    	        this.utils.warn(this.WarningEnum.KEY_NOT_PROVIDED);
    	        return;
    	      }
    	
    	      this.getEncryptionSecret(key);
    	
    	      // add key(s) to Array if not already added, only for keys other than meta key
    	      if (!(String(key) === String(this.utils.metaKey))) {
    	        if (!this.utils.isKeyPresent(key)) {
    	          this.utils.addToKeysList(key);
    	          this.setMetaData();
    	        }
    	      }
    	
    	      dataToStore = this.processData(data);
    	      // Store the data to localStorage
    	      this.setDataToLocalStorage(key, dataToStore);
    	    }
    	  }, {
    	    key: 'setDataToLocalStorage',
    	    value: function setDataToLocalStorage(key, data) {
    	      this.ls.setItem(key, data);
    	    }
    	  }, {
    	    key: 'remove',
    	    value: function remove(key) {
    	      if (!this.utils.is(key)) {
    	        this.utils.warn(this.WarningEnum.KEY_NOT_PROVIDED);
    	        return;
    	      }
    	
    	      if (key === this.utils.metaKey && this.getAllKeys().length) {
    	        this.utils.warn(this.WarningEnum.META_KEY_REMOVE);
    	        return;
    	      }
    	
    	      if (this.utils.isKeyPresent(key)) {
    	        this.utils.removeFromKeysList(key);
    	        this.setMetaData();
    	      }
    	      this.ls.removeItem(key);
    	    }
    	  }, {
    	    key: 'removeAll',
    	    value: function removeAll() {
    	      var keys = void 0,
    	          i = void 0;
    	
    	      keys = this.getAllKeys();
    	      for (i = 0; i < keys.length; i++) {
    	        this.ls.removeItem(keys[i]);
    	      }
    	      this.ls.removeItem(this.utils.metaKey);
    	
    	      this.resetAllKeys();
    	    }
    	  }, {
    	    key: 'clear',
    	    value: function clear() {
    	      this.ls.clear();
    	      this.resetAllKeys();
    	    }
    	  }, {
    	    key: 'resetAllKeys',
    	    value: function resetAllKeys() {
    	      this.utils.allKeys = [];
    	      return [];
    	    }
    	  }, {
    	    key: 'processData',
    	    value: function processData(data, isAllKeysData) {
    	      if (data === null || data === undefined || data === '') {
    	        return '';
    	      }
    	
    	      var jsonData = void 0,
    	          encodedData = void 0,
    	          compressedData = void 0;
    	
    	      try {
    	        jsonData = JSON.stringify(data);
    	      } catch (e) {
    	        throw new Error('Could not stringify data.');
    	      }
    	
    	      // Encode Based on encoding type
    	      // If not set, default to Base64 for securing data
    	      encodedData = jsonData;
    	      if (this._isBase64 || isAllKeysData) {
    	        encodedData = _Base2.default.encode(jsonData);
    	      } else {
    	        if (this._isAES) {
    	          encodedData = _aes2.default.encrypt(jsonData, this.utils.encryptionSecret);
    	        } else if (this._isDES) {
    	          encodedData = _tripledes2.default.encrypt(jsonData, this.utils.encryptionSecret);
    	        } else if (this._isRabbit) {
    	          encodedData = _rabbit2.default.encrypt(jsonData, this.utils.encryptionSecret);
    	        } else if (this._isRC4) {
    	          encodedData = _rc2.default.encrypt(jsonData, this.utils.encryptionSecret);
    	        }
    	
    	        encodedData = encodedData && encodedData.toString();
    	      }
    	
    	      // Compress data if set to true
    	      compressedData = encodedData;
    	      if (this._isCompression || isAllKeysData) {
    	        compressedData = _lzString2.default.compressToUTF16(encodedData);
    	      }
    	
    	      return compressedData;
    	    }
    	  }, {
    	    key: 'setMetaData',
    	    value: function setMetaData() {
    	      var dataToStore = this.processData({
    	        keys: this.utils.allKeys
    	      }, true);
    	
    	      // Store the data to localStorage
    	      this.setDataToLocalStorage(this.getMetaKey(), dataToStore);
    	    }
    	  }, {
    	    key: 'getMetaData',
    	    value: function getMetaData() {
    	      return this.get(this.getMetaKey(), true) || {};
    	    }
    	  }, {
    	    key: 'getMetaKey',
    	    value: function getMetaKey() {
    	      return this.utils.metaKey + (this.config.encryptionNamespace ? '__' + this.config.encryptionNamespace : '');
    	    }
    	  }]);
    	
    	  return SecureLS;
    	}();
    	
    	exports.default = SecureLS;
    	module.exports = exports['default'];

    /***/ },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
    	
    	var _constants = __webpack_require__(2);
    	
    	var _constants2 = _interopRequireDefault(_constants);
    	
    	var _WordArray = __webpack_require__(3);
    	
    	var _WordArray2 = _interopRequireDefault(_WordArray);
    	
    	var _pbkdf = __webpack_require__(4);
    	
    	var _pbkdf2 = _interopRequireDefault(_pbkdf);
    	
    	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    	
    	var utils = {
    	  metaKey: '_secure__ls__metadata',
    	  encryptionSecret: '',
    	  secretPhrase: 's3cr3t$#@135^&*246',
    	  allKeys: [],
    	  is: function is(key) {
    	    if (key) {
    	      return true;
    	    }
    	    return false;
    	  },
    	  warn: function warn(reason) {
    	    reason = reason ? reason : _constants2.default.WarningEnum.DEFAULT_TEXT;
    	    console.warn(_constants2.default.WarningTypes[reason]);
    	  },
    	  generateSecretKey: function generateSecretKey() {
    	    var salt = _WordArray2.default.random(128 / 8);
    	    var key128Bits = (0, _pbkdf2.default)(this.secretPhrase, salt, { keySize: 128 / 32 });
    	
    	    return key128Bits && key128Bits.toString();
    	  },
    	  getObjectFromKey: function getObjectFromKey(data, key) {
    	    if (!data || !data.length) {
    	      return {};
    	    }
    	
    	    var i = void 0,
    	        obj = {};
    	
    	    for (i = 0; i < data.length; i++) {
    	      if (data[i].k === key) {
    	        obj = data[i];
    	        break;
    	      }
    	    }
    	
    	    return obj;
    	  },
    	  extractKeyNames: function extractKeyNames(data) {
    	    if (!data || !data.keys || !data.keys.length) {
    	      return [];
    	    }
    	
    	    return data.keys.map(function (keyData) {
    	      return keyData.k;
    	    });
    	  },
    	  getAllKeys: function getAllKeys() {
    	    return this.allKeys;
    	  },
    	  isKeyPresent: function isKeyPresent(key) {
    	    var isKeyAlreadyPresent = false;
    	
    	    for (var i = 0; i < this.allKeys.length; i++) {
    	      if (String(this.allKeys[i].k) === String(key)) {
    	        isKeyAlreadyPresent = true; // found
    	        break;
    	      }
    	    }
    	
    	    return isKeyAlreadyPresent;
    	  },
    	  addToKeysList: function addToKeysList(key) {
    	    this.allKeys.push({
    	      k: key,
    	      s: this.encryptionSecret
    	    });
    	  },
    	  removeFromKeysList: function removeFromKeysList(key) {
    	    var i = void 0,
    	        index = -1;
    	
    	    for (i = 0; i < this.allKeys.length; i++) {
    	      if (this.allKeys[i].k === key) {
    	        index = i;
    	        break;
    	      }
    	    }
    	    if (index !== -1) {
    	      this.allKeys.splice(index, 1);
    	    }
    	    return index;
    	  }
    	};
    	
    	module.exports = utils;

    /***/ },
    /* 2 */
    /***/ function(module, exports) {
    	
    	var WarningEnum = {
    	  KEY_NOT_PROVIDED: 'keyNotProvided',
    	  META_KEY_REMOVE: 'metaKeyRemove',
    	  DEFAULT_TEXT: 'defaultText'
    	};
    	
    	var WarningTypes = {};
    	
    	WarningTypes[WarningEnum.KEY_NOT_PROVIDED] = 'Secure LS: Key not provided. Aborting operation!';
    	WarningTypes[WarningEnum.META_KEY_REMOVE] = 'Secure LS: Meta key can not be removed\nunless all keys created by Secure LS are removed!';
    	WarningTypes[WarningEnum.DEFAULT_TEXT] = 'Unexpected output';
    	
    	var constants = {
    	  WarningEnum: WarningEnum,
    	  WarningTypes: WarningTypes,
    	  EncrytionTypes: {
    	    BASE64: 'base64',
    	    AES: 'aes',
    	    DES: 'des',
    	    RABBIT: 'rabbit',
    	    RC4: 'rc4'
    	  }
    	};
    	
    	module.exports = constants;

    /***/ },
    /* 3 */
    /***/ function(module, exports) {
    	
    	/*
    	 ES6 compatible port of CryptoJS - WordArray for PBKDF2 password key generation
    	
    	 Source: https://github.com/brix/crypto-js
    	 LICENSE: MIT
    	 */
    	
    	var CryptoJSWordArray = {};
    	
    	CryptoJSWordArray.random = function (nBytes) {
    	  var words = [];
    	  var r = function r(mw) {
    	    var mz = 0x3ade68b1;
    	    var mask = 0xffffffff;
    	
    	    return function () {
    	      mz = 0x9069 * (mz & 0xFFFF) + (mz >> 0x10) & mask;
    	      mw = 0x4650 * (mw & 0xFFFF) + (mw >> 0x10) & mask;
    	      var result = (mz << 0x10) + mw & mask;
    	
    	      result /= 0x100000000;
    	      result += 0.5;
    	      return result * (Math.random() > 0.5 ? 1 : -1);
    	    };
    	  };
    	
    	  for (var i = 0, rcache; i < nBytes; i += 4) {
    	    var _r = r((rcache || Math.random()) * 0x100000000);
    	
    	    rcache = _r() * 0x3ade67b7;
    	    words.push(_r() * 0x100000000 | 0);
    	  }
    	
    	  return new this.Set(words, nBytes);
    	};
    	
    	CryptoJSWordArray.Set = function (words, sigBytes) {
    	  words = this.words = words || [];
    	
    	  if (sigBytes !== undefined) {
    	    this.sigBytes = sigBytes;
    	  } else {
    	    this.sigBytes = words.length * 8;
    	  }
    	};
    	
    	module.exports = CryptoJSWordArray;

    /***/ },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(6), __webpack_require__(7));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var Base = C_lib.Base;
    		    var WordArray = C_lib.WordArray;
    		    var C_algo = C.algo;
    		    var SHA1 = C_algo.SHA1;
    		    var HMAC = C_algo.HMAC;
    	
    		    /**
    		     * Password-Based Key Derivation Function 2 algorithm.
    		     */
    		    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
    		         * @property {Hasher} hasher The hasher to use. Default: SHA1
    		         * @property {number} iterations The number of iterations to perform. Default: 1
    		         */
    		        cfg: Base.extend({
    		            keySize: 128/32,
    		            hasher: SHA1,
    		            iterations: 1
    		        }),
    	
    		        /**
    		         * Initializes a newly created key derivation function.
    		         *
    		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
    		         *
    		         * @example
    		         *
    		         *     var kdf = CryptoJS.algo.PBKDF2.create();
    		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
    		         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
    		         */
    		        init: function (cfg) {
    		            this.cfg = this.cfg.extend(cfg);
    		        },
    	
    		        /**
    		         * Computes the Password-Based Key Derivation Function 2.
    		         *
    		         * @param {WordArray|string} password The password.
    		         * @param {WordArray|string} salt A salt.
    		         *
    		         * @return {WordArray} The derived key.
    		         *
    		         * @example
    		         *
    		         *     var key = kdf.compute(password, salt);
    		         */
    		        compute: function (password, salt) {
    		            // Shortcut
    		            var cfg = this.cfg;
    	
    		            // Init HMAC
    		            var hmac = HMAC.create(cfg.hasher, password);
    	
    		            // Initial values
    		            var derivedKey = WordArray.create();
    		            var blockIndex = WordArray.create([0x00000001]);
    	
    		            // Shortcuts
    		            var derivedKeyWords = derivedKey.words;
    		            var blockIndexWords = blockIndex.words;
    		            var keySize = cfg.keySize;
    		            var iterations = cfg.iterations;
    	
    		            // Generate key
    		            while (derivedKeyWords.length < keySize) {
    		                var block = hmac.update(salt).finalize(blockIndex);
    		                hmac.reset();
    	
    		                // Shortcuts
    		                var blockWords = block.words;
    		                var blockWordsLength = blockWords.length;
    	
    		                // Iterations
    		                var intermediate = block;
    		                for (var i = 1; i < iterations; i++) {
    		                    intermediate = hmac.finalize(intermediate);
    		                    hmac.reset();
    	
    		                    // Shortcut
    		                    var intermediateWords = intermediate.words;
    	
    		                    // XOR intermediate with block
    		                    for (var j = 0; j < blockWordsLength; j++) {
    		                        blockWords[j] ^= intermediateWords[j];
    		                    }
    		                }
    	
    		                derivedKey.concat(block);
    		                blockIndexWords[0]++;
    		            }
    		            derivedKey.sigBytes = keySize * 4;
    	
    		            return derivedKey;
    		        }
    		    });
    	
    		    /**
    		     * Computes the Password-Based Key Derivation Function 2.
    		     *
    		     * @param {WordArray|string} password The password.
    		     * @param {WordArray|string} salt A salt.
    		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
    		     *
    		     * @return {WordArray} The derived key.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var key = CryptoJS.PBKDF2(password, salt);
    		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
    		     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
    		     */
    		    C.PBKDF2 = function (password, salt, cfg) {
    		        return PBKDF2.create(cfg).compute(password, salt);
    		    };
    		}());
    	
    	
    		return CryptoJS.PBKDF2;
    	
    	}));

    /***/ },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory();
    		}
    	}(this, function () {
    	
    		/**
    		 * CryptoJS core components.
    		 */
    		var CryptoJS = CryptoJS || (function (Math, undefined$1) {
    		    /*
    		     * Local polyfil of Object.create
    		     */
    		    var create = Object.create || (function () {
    		        function F() {}	
    		        return function (obj) {
    		            var subtype;
    	
    		            F.prototype = obj;
    	
    		            subtype = new F();
    	
    		            F.prototype = null;
    	
    		            return subtype;
    		        };
    		    }());
    	
    		    /**
    		     * CryptoJS namespace.
    		     */
    		    var C = {};
    	
    		    /**
    		     * Library namespace.
    		     */
    		    var C_lib = C.lib = {};
    	
    		    /**
    		     * Base object for prototypal inheritance.
    		     */
    		    var Base = C_lib.Base = (function () {
    	
    	
    		        return {
    		            /**
    		             * Creates a new object that inherits from this object.
    		             *
    		             * @param {Object} overrides Properties to copy into the new object.
    		             *
    		             * @return {Object} The new object.
    		             *
    		             * @static
    		             *
    		             * @example
    		             *
    		             *     var MyType = CryptoJS.lib.Base.extend({
    		             *         field: 'value',
    		             *
    		             *         method: function () {
    		             *         }
    		             *     });
    		             */
    		            extend: function (overrides) {
    		                // Spawn
    		                var subtype = create(this);
    	
    		                // Augment
    		                if (overrides) {
    		                    subtype.mixIn(overrides);
    		                }
    	
    		                // Create default initializer
    		                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
    		                    subtype.init = function () {
    		                        subtype.$super.init.apply(this, arguments);
    		                    };
    		                }
    	
    		                // Initializer's prototype is the subtype object
    		                subtype.init.prototype = subtype;
    	
    		                // Reference supertype
    		                subtype.$super = this;
    	
    		                return subtype;
    		            },
    	
    		            /**
    		             * Extends this object and runs the init method.
    		             * Arguments to create() will be passed to init().
    		             *
    		             * @return {Object} The new object.
    		             *
    		             * @static
    		             *
    		             * @example
    		             *
    		             *     var instance = MyType.create();
    		             */
    		            create: function () {
    		                var instance = this.extend();
    		                instance.init.apply(instance, arguments);
    	
    		                return instance;
    		            },
    	
    		            /**
    		             * Initializes a newly created object.
    		             * Override this method to add some logic when your objects are created.
    		             *
    		             * @example
    		             *
    		             *     var MyType = CryptoJS.lib.Base.extend({
    		             *         init: function () {
    		             *             // ...
    		             *         }
    		             *     });
    		             */
    		            init: function () {
    		            },
    	
    		            /**
    		             * Copies properties into this object.
    		             *
    		             * @param {Object} properties The properties to mix in.
    		             *
    		             * @example
    		             *
    		             *     MyType.mixIn({
    		             *         field: 'value'
    		             *     });
    		             */
    		            mixIn: function (properties) {
    		                for (var propertyName in properties) {
    		                    if (properties.hasOwnProperty(propertyName)) {
    		                        this[propertyName] = properties[propertyName];
    		                    }
    		                }
    	
    		                // IE won't copy toString using the loop above
    		                if (properties.hasOwnProperty('toString')) {
    		                    this.toString = properties.toString;
    		                }
    		            },
    	
    		            /**
    		             * Creates a copy of this object.
    		             *
    		             * @return {Object} The clone.
    		             *
    		             * @example
    		             *
    		             *     var clone = instance.clone();
    		             */
    		            clone: function () {
    		                return this.init.prototype.extend(this);
    		            }
    		        };
    		    }());
    	
    		    /**
    		     * An array of 32-bit words.
    		     *
    		     * @property {Array} words The array of 32-bit words.
    		     * @property {number} sigBytes The number of significant bytes in this word array.
    		     */
    		    var WordArray = C_lib.WordArray = Base.extend({
    		        /**
    		         * Initializes a newly created word array.
    		         *
    		         * @param {Array} words (Optional) An array of 32-bit words.
    		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.lib.WordArray.create();
    		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
    		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
    		         */
    		        init: function (words, sigBytes) {
    		            words = this.words = words || [];
    	
    		            if (sigBytes != undefined$1) {
    		                this.sigBytes = sigBytes;
    		            } else {
    		                this.sigBytes = words.length * 4;
    		            }
    		        },
    	
    		        /**
    		         * Converts this word array to a string.
    		         *
    		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
    		         *
    		         * @return {string} The stringified word array.
    		         *
    		         * @example
    		         *
    		         *     var string = wordArray + '';
    		         *     var string = wordArray.toString();
    		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
    		         */
    		        toString: function (encoder) {
    		            return (encoder || Hex).stringify(this);
    		        },
    	
    		        /**
    		         * Concatenates a word array to this word array.
    		         *
    		         * @param {WordArray} wordArray The word array to append.
    		         *
    		         * @return {WordArray} This word array.
    		         *
    		         * @example
    		         *
    		         *     wordArray1.concat(wordArray2);
    		         */
    		        concat: function (wordArray) {
    		            // Shortcuts
    		            var thisWords = this.words;
    		            var thatWords = wordArray.words;
    		            var thisSigBytes = this.sigBytes;
    		            var thatSigBytes = wordArray.sigBytes;
    	
    		            // Clamp excess bits
    		            this.clamp();
    	
    		            // Concat
    		            if (thisSigBytes % 4) {
    		                // Copy one byte at a time
    		                for (var i = 0; i < thatSigBytes; i++) {
    		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
    		                }
    		            } else {
    		                // Copy one word at a time
    		                for (var i = 0; i < thatSigBytes; i += 4) {
    		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
    		                }
    		            }
    		            this.sigBytes += thatSigBytes;
    	
    		            // Chainable
    		            return this;
    		        },
    	
    		        /**
    		         * Removes insignificant bits.
    		         *
    		         * @example
    		         *
    		         *     wordArray.clamp();
    		         */
    		        clamp: function () {
    		            // Shortcuts
    		            var words = this.words;
    		            var sigBytes = this.sigBytes;
    	
    		            // Clamp
    		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
    		            words.length = Math.ceil(sigBytes / 4);
    		        },
    	
    		        /**
    		         * Creates a copy of this word array.
    		         *
    		         * @return {WordArray} The clone.
    		         *
    		         * @example
    		         *
    		         *     var clone = wordArray.clone();
    		         */
    		        clone: function () {
    		            var clone = Base.clone.call(this);
    		            clone.words = this.words.slice(0);
    	
    		            return clone;
    		        },
    	
    		        /**
    		         * Creates a word array filled with random bytes.
    		         *
    		         * @param {number} nBytes The number of random bytes to generate.
    		         *
    		         * @return {WordArray} The random word array.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
    		         */
    		        random: function (nBytes) {
    		            var words = [];
    	
    		            var r = (function (m_w) {
    		                var m_w = m_w;
    		                var m_z = 0x3ade68b1;
    		                var mask = 0xffffffff;
    	
    		                return function () {
    		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
    		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
    		                    var result = ((m_z << 0x10) + m_w) & mask;
    		                    result /= 0x100000000;
    		                    result += 0.5;
    		                    return result * (Math.random() > .5 ? 1 : -1);
    		                }
    		            });
    	
    		            for (var i = 0, rcache; i < nBytes; i += 4) {
    		                var _r = r((rcache || Math.random()) * 0x100000000);
    	
    		                rcache = _r() * 0x3ade67b7;
    		                words.push((_r() * 0x100000000) | 0);
    		            }
    	
    		            return new WordArray.init(words, nBytes);
    		        }
    		    });
    	
    		    /**
    		     * Encoder namespace.
    		     */
    		    var C_enc = C.enc = {};
    	
    		    /**
    		     * Hex encoding strategy.
    		     */
    		    var Hex = C_enc.Hex = {
    		        /**
    		         * Converts a word array to a hex string.
    		         *
    		         * @param {WordArray} wordArray The word array.
    		         *
    		         * @return {string} The hex string.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
    		         */
    		        stringify: function (wordArray) {
    		            // Shortcuts
    		            var words = wordArray.words;
    		            var sigBytes = wordArray.sigBytes;
    	
    		            // Convert
    		            var hexChars = [];
    		            for (var i = 0; i < sigBytes; i++) {
    		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    		                hexChars.push((bite >>> 4).toString(16));
    		                hexChars.push((bite & 0x0f).toString(16));
    		            }
    	
    		            return hexChars.join('');
    		        },
    	
    		        /**
    		         * Converts a hex string to a word array.
    		         *
    		         * @param {string} hexStr The hex string.
    		         *
    		         * @return {WordArray} The word array.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
    		         */
    		        parse: function (hexStr) {
    		            // Shortcut
    		            var hexStrLength = hexStr.length;
    	
    		            // Convert
    		            var words = [];
    		            for (var i = 0; i < hexStrLength; i += 2) {
    		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
    		            }
    	
    		            return new WordArray.init(words, hexStrLength / 2);
    		        }
    		    };
    	
    		    /**
    		     * Latin1 encoding strategy.
    		     */
    		    var Latin1 = C_enc.Latin1 = {
    		        /**
    		         * Converts a word array to a Latin1 string.
    		         *
    		         * @param {WordArray} wordArray The word array.
    		         *
    		         * @return {string} The Latin1 string.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
    		         */
    		        stringify: function (wordArray) {
    		            // Shortcuts
    		            var words = wordArray.words;
    		            var sigBytes = wordArray.sigBytes;
    	
    		            // Convert
    		            var latin1Chars = [];
    		            for (var i = 0; i < sigBytes; i++) {
    		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    		                latin1Chars.push(String.fromCharCode(bite));
    		            }
    	
    		            return latin1Chars.join('');
    		        },
    	
    		        /**
    		         * Converts a Latin1 string to a word array.
    		         *
    		         * @param {string} latin1Str The Latin1 string.
    		         *
    		         * @return {WordArray} The word array.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
    		         */
    		        parse: function (latin1Str) {
    		            // Shortcut
    		            var latin1StrLength = latin1Str.length;
    	
    		            // Convert
    		            var words = [];
    		            for (var i = 0; i < latin1StrLength; i++) {
    		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
    		            }
    	
    		            return new WordArray.init(words, latin1StrLength);
    		        }
    		    };
    	
    		    /**
    		     * UTF-8 encoding strategy.
    		     */
    		    var Utf8 = C_enc.Utf8 = {
    		        /**
    		         * Converts a word array to a UTF-8 string.
    		         *
    		         * @param {WordArray} wordArray The word array.
    		         *
    		         * @return {string} The UTF-8 string.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
    		         */
    		        stringify: function (wordArray) {
    		            try {
    		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
    		            } catch (e) {
    		                throw new Error('Malformed UTF-8 data');
    		            }
    		        },
    	
    		        /**
    		         * Converts a UTF-8 string to a word array.
    		         *
    		         * @param {string} utf8Str The UTF-8 string.
    		         *
    		         * @return {WordArray} The word array.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
    		         */
    		        parse: function (utf8Str) {
    		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
    		        }
    		    };
    	
    		    /**
    		     * Abstract buffered block algorithm template.
    		     *
    		     * The property blockSize must be implemented in a concrete subtype.
    		     *
    		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
    		     */
    		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
    		        /**
    		         * Resets this block algorithm's data buffer to its initial state.
    		         *
    		         * @example
    		         *
    		         *     bufferedBlockAlgorithm.reset();
    		         */
    		        reset: function () {
    		            // Initial values
    		            this._data = new WordArray.init();
    		            this._nDataBytes = 0;
    		        },
    	
    		        /**
    		         * Adds new data to this block algorithm's buffer.
    		         *
    		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
    		         *
    		         * @example
    		         *
    		         *     bufferedBlockAlgorithm._append('data');
    		         *     bufferedBlockAlgorithm._append(wordArray);
    		         */
    		        _append: function (data) {
    		            // Convert string to WordArray, else assume WordArray already
    		            if (typeof data == 'string') {
    		                data = Utf8.parse(data);
    		            }
    	
    		            // Append
    		            this._data.concat(data);
    		            this._nDataBytes += data.sigBytes;
    		        },
    	
    		        /**
    		         * Processes available data blocks.
    		         *
    		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
    		         *
    		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
    		         *
    		         * @return {WordArray} The processed data.
    		         *
    		         * @example
    		         *
    		         *     var processedData = bufferedBlockAlgorithm._process();
    		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
    		         */
    		        _process: function (doFlush) {
    		            // Shortcuts
    		            var data = this._data;
    		            var dataWords = data.words;
    		            var dataSigBytes = data.sigBytes;
    		            var blockSize = this.blockSize;
    		            var blockSizeBytes = blockSize * 4;
    	
    		            // Count blocks ready
    		            var nBlocksReady = dataSigBytes / blockSizeBytes;
    		            if (doFlush) {
    		                // Round up to include partial blocks
    		                nBlocksReady = Math.ceil(nBlocksReady);
    		            } else {
    		                // Round down to include only full blocks,
    		                // less the number of blocks that must remain in the buffer
    		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
    		            }
    	
    		            // Count words ready
    		            var nWordsReady = nBlocksReady * blockSize;
    	
    		            // Count bytes ready
    		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);
    	
    		            // Process blocks
    		            if (nWordsReady) {
    		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
    		                    // Perform concrete-algorithm logic
    		                    this._doProcessBlock(dataWords, offset);
    		                }
    	
    		                // Remove processed words
    		                var processedWords = dataWords.splice(0, nWordsReady);
    		                data.sigBytes -= nBytesReady;
    		            }
    	
    		            // Return processed words
    		            return new WordArray.init(processedWords, nBytesReady);
    		        },
    	
    		        /**
    		         * Creates a copy of this object.
    		         *
    		         * @return {Object} The clone.
    		         *
    		         * @example
    		         *
    		         *     var clone = bufferedBlockAlgorithm.clone();
    		         */
    		        clone: function () {
    		            var clone = Base.clone.call(this);
    		            clone._data = this._data.clone();
    	
    		            return clone;
    		        },
    	
    		        _minBufferSize: 0
    		    });
    	
    		    /**
    		     * Abstract hasher template.
    		     *
    		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
    		     */
    		    C_lib.Hasher = BufferedBlockAlgorithm.extend({
    		        /**
    		         * Configuration options.
    		         */
    		        cfg: Base.extend(),
    	
    		        /**
    		         * Initializes a newly created hasher.
    		         *
    		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
    		         *
    		         * @example
    		         *
    		         *     var hasher = CryptoJS.algo.SHA256.create();
    		         */
    		        init: function (cfg) {
    		            // Apply config defaults
    		            this.cfg = this.cfg.extend(cfg);
    	
    		            // Set initial values
    		            this.reset();
    		        },
    	
    		        /**
    		         * Resets this hasher to its initial state.
    		         *
    		         * @example
    		         *
    		         *     hasher.reset();
    		         */
    		        reset: function () {
    		            // Reset data buffer
    		            BufferedBlockAlgorithm.reset.call(this);
    	
    		            // Perform concrete-hasher logic
    		            this._doReset();
    		        },
    	
    		        /**
    		         * Updates this hasher with a message.
    		         *
    		         * @param {WordArray|string} messageUpdate The message to append.
    		         *
    		         * @return {Hasher} This hasher.
    		         *
    		         * @example
    		         *
    		         *     hasher.update('message');
    		         *     hasher.update(wordArray);
    		         */
    		        update: function (messageUpdate) {
    		            // Append
    		            this._append(messageUpdate);
    	
    		            // Update the hash
    		            this._process();
    	
    		            // Chainable
    		            return this;
    		        },
    	
    		        /**
    		         * Finalizes the hash computation.
    		         * Note that the finalize operation is effectively a destructive, read-once operation.
    		         *
    		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
    		         *
    		         * @return {WordArray} The hash.
    		         *
    		         * @example
    		         *
    		         *     var hash = hasher.finalize();
    		         *     var hash = hasher.finalize('message');
    		         *     var hash = hasher.finalize(wordArray);
    		         */
    		        finalize: function (messageUpdate) {
    		            // Final message update
    		            if (messageUpdate) {
    		                this._append(messageUpdate);
    		            }
    	
    		            // Perform concrete-hasher logic
    		            var hash = this._doFinalize();
    	
    		            return hash;
    		        },
    	
    		        blockSize: 512/32,
    	
    		        /**
    		         * Creates a shortcut function to a hasher's object interface.
    		         *
    		         * @param {Hasher} hasher The hasher to create a helper for.
    		         *
    		         * @return {Function} The shortcut function.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
    		         */
    		        _createHelper: function (hasher) {
    		            return function (message, cfg) {
    		                return new hasher.init(cfg).finalize(message);
    		            };
    		        },
    	
    		        /**
    		         * Creates a shortcut function to the HMAC's object interface.
    		         *
    		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
    		         *
    		         * @return {Function} The shortcut function.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
    		         */
    		        _createHmacHelper: function (hasher) {
    		            return function (message, key) {
    		                return new C_algo.HMAC.init(hasher, key).finalize(message);
    		            };
    		        }
    		    });
    	
    		    /**
    		     * Algorithm namespace.
    		     */
    		    var C_algo = C.algo = {};
    	
    		    return C;
    		}(Math));
    	
    	
    		return CryptoJS;
    	
    	}));

    /***/ },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var WordArray = C_lib.WordArray;
    		    var Hasher = C_lib.Hasher;
    		    var C_algo = C.algo;
    	
    		    // Reusable object
    		    var W = [];
    	
    		    /**
    		     * SHA-1 hash algorithm.
    		     */
    		    var SHA1 = C_algo.SHA1 = Hasher.extend({
    		        _doReset: function () {
    		            this._hash = new WordArray.init([
    		                0x67452301, 0xefcdab89,
    		                0x98badcfe, 0x10325476,
    		                0xc3d2e1f0
    		            ]);
    		        },
    	
    		        _doProcessBlock: function (M, offset) {
    		            // Shortcut
    		            var H = this._hash.words;
    	
    		            // Working variables
    		            var a = H[0];
    		            var b = H[1];
    		            var c = H[2];
    		            var d = H[3];
    		            var e = H[4];
    	
    		            // Computation
    		            for (var i = 0; i < 80; i++) {
    		                if (i < 16) {
    		                    W[i] = M[offset + i] | 0;
    		                } else {
    		                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
    		                    W[i] = (n << 1) | (n >>> 31);
    		                }
    	
    		                var t = ((a << 5) | (a >>> 27)) + e + W[i];
    		                if (i < 20) {
    		                    t += ((b & c) | (~b & d)) + 0x5a827999;
    		                } else if (i < 40) {
    		                    t += (b ^ c ^ d) + 0x6ed9eba1;
    		                } else if (i < 60) {
    		                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
    		                } else /* if (i < 80) */ {
    		                    t += (b ^ c ^ d) - 0x359d3e2a;
    		                }
    	
    		                e = d;
    		                d = c;
    		                c = (b << 30) | (b >>> 2);
    		                b = a;
    		                a = t;
    		            }
    	
    		            // Intermediate hash value
    		            H[0] = (H[0] + a) | 0;
    		            H[1] = (H[1] + b) | 0;
    		            H[2] = (H[2] + c) | 0;
    		            H[3] = (H[3] + d) | 0;
    		            H[4] = (H[4] + e) | 0;
    		        },
    	
    		        _doFinalize: function () {
    		            // Shortcuts
    		            var data = this._data;
    		            var dataWords = data.words;
    	
    		            var nBitsTotal = this._nDataBytes * 8;
    		            var nBitsLeft = data.sigBytes * 8;
    	
    		            // Add padding
    		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
    		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
    		            data.sigBytes = dataWords.length * 4;
    	
    		            // Hash final blocks
    		            this._process();
    	
    		            // Return final computed hash
    		            return this._hash;
    		        },
    	
    		        clone: function () {
    		            var clone = Hasher.clone.call(this);
    		            clone._hash = this._hash.clone();
    	
    		            return clone;
    		        }
    		    });
    	
    		    /**
    		     * Shortcut function to the hasher's object interface.
    		     *
    		     * @param {WordArray|string} message The message to hash.
    		     *
    		     * @return {WordArray} The hash.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var hash = CryptoJS.SHA1('message');
    		     *     var hash = CryptoJS.SHA1(wordArray);
    		     */
    		    C.SHA1 = Hasher._createHelper(SHA1);
    	
    		    /**
    		     * Shortcut function to the HMAC's object interface.
    		     *
    		     * @param {WordArray|string} message The message to hash.
    		     * @param {WordArray|string} key The secret key.
    		     *
    		     * @return {WordArray} The HMAC.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var hmac = CryptoJS.HmacSHA1(message, key);
    		     */
    		    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
    		}());
    	
    	
    		return CryptoJS.SHA1;
    	
    	}));

    /***/ },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var Base = C_lib.Base;
    		    var C_enc = C.enc;
    		    var Utf8 = C_enc.Utf8;
    		    var C_algo = C.algo;
    	
    		    /**
    		     * HMAC algorithm.
    		     */
    		    C_algo.HMAC = Base.extend({
    		        /**
    		         * Initializes a newly created HMAC.
    		         *
    		         * @param {Hasher} hasher The hash algorithm to use.
    		         * @param {WordArray|string} key The secret key.
    		         *
    		         * @example
    		         *
    		         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
    		         */
    		        init: function (hasher, key) {
    		            // Init hasher
    		            hasher = this._hasher = new hasher.init();
    	
    		            // Convert string to WordArray, else assume WordArray already
    		            if (typeof key == 'string') {
    		                key = Utf8.parse(key);
    		            }
    	
    		            // Shortcuts
    		            var hasherBlockSize = hasher.blockSize;
    		            var hasherBlockSizeBytes = hasherBlockSize * 4;
    	
    		            // Allow arbitrary length keys
    		            if (key.sigBytes > hasherBlockSizeBytes) {
    		                key = hasher.finalize(key);
    		            }
    	
    		            // Clamp excess bits
    		            key.clamp();
    	
    		            // Clone key for inner and outer pads
    		            var oKey = this._oKey = key.clone();
    		            var iKey = this._iKey = key.clone();
    	
    		            // Shortcuts
    		            var oKeyWords = oKey.words;
    		            var iKeyWords = iKey.words;
    	
    		            // XOR keys with pad constants
    		            for (var i = 0; i < hasherBlockSize; i++) {
    		                oKeyWords[i] ^= 0x5c5c5c5c;
    		                iKeyWords[i] ^= 0x36363636;
    		            }
    		            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
    	
    		            // Set initial values
    		            this.reset();
    		        },
    	
    		        /**
    		         * Resets this HMAC to its initial state.
    		         *
    		         * @example
    		         *
    		         *     hmacHasher.reset();
    		         */
    		        reset: function () {
    		            // Shortcut
    		            var hasher = this._hasher;
    	
    		            // Reset
    		            hasher.reset();
    		            hasher.update(this._iKey);
    		        },
    	
    		        /**
    		         * Updates this HMAC with a message.
    		         *
    		         * @param {WordArray|string} messageUpdate The message to append.
    		         *
    		         * @return {HMAC} This HMAC instance.
    		         *
    		         * @example
    		         *
    		         *     hmacHasher.update('message');
    		         *     hmacHasher.update(wordArray);
    		         */
    		        update: function (messageUpdate) {
    		            this._hasher.update(messageUpdate);
    	
    		            // Chainable
    		            return this;
    		        },
    	
    		        /**
    		         * Finalizes the HMAC computation.
    		         * Note that the finalize operation is effectively a destructive, read-once operation.
    		         *
    		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
    		         *
    		         * @return {WordArray} The HMAC.
    		         *
    		         * @example
    		         *
    		         *     var hmac = hmacHasher.finalize();
    		         *     var hmac = hmacHasher.finalize('message');
    		         *     var hmac = hmacHasher.finalize(wordArray);
    		         */
    		        finalize: function (messageUpdate) {
    		            // Shortcut
    		            var hasher = this._hasher;
    	
    		            // Compute HMAC
    		            var innerHash = hasher.finalize(messageUpdate);
    		            hasher.reset();
    		            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
    	
    		            return hmac;
    		        }
    		    });
    		}());
    	
    	
    	}));

    /***/ },
    /* 8 */
    /***/ function(module, exports) {
    	
    	/*
    	 ES6 compatible port of CryptoJS - encoding
    	
    	 Source: https://github.com/brix/crypto-js
    	 LICENSE: MIT
    	 */
    	var enc = {};
    	
    	enc.Latin1 = {
    	  stringify: function stringify(wordArray) {
    	    // Shortcuts
    	    var words = wordArray.words;
    	    var sigBytes = wordArray.sigBytes;
    	    var latin1Chars = [],
    	        i = void 0,
    	        bite = void 0;
    	
    	    // Convert
    	    for (i = 0; i < sigBytes; i++) {
    	      bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff;
    	      latin1Chars.push(String.fromCharCode(bite));
    	    }
    	
    	    return latin1Chars.join('');
    	  }
    	};
    	
    	enc._Utf8 = {
    	  stringify: function stringify(wordArray) {
    	    try {
    	      return decodeURIComponent(escape(enc.Latin1.stringify(wordArray)));
    	    } catch (e) {
    	      throw new Error('Malformed UTF-8 data');
    	    }
    	  }
    	};
    	
    	module.exports = enc;

    /***/ },
    /* 9 */
    /***/ function(module, exports) {
    	
    	var Base64 = {
    	  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    	  encode: function encode(e) {
    	    var t = '';
    	    var n = void 0,
    	        r = void 0,
    	        i = void 0,
    	        s = void 0,
    	        o = void 0,
    	        u = void 0,
    	        a = void 0;
    	    var f = 0;
    	
    	    e = Base64._utf8Encode(e);
    	    while (f < e.length) {
    	      n = e.charCodeAt(f++);
    	      r = e.charCodeAt(f++);
    	      i = e.charCodeAt(f++);
    	      s = n >> 2;
    	      o = (n & 3) << 4 | r >> 4;
    	      u = (r & 15) << 2 | i >> 6;
    	      a = i & 63;
    	      if (isNaN(r)) {
    	        u = a = 64;
    	      } else if (isNaN(i)) {
    	        a = 64;
    	      }
    	      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
    	    }
    	    return t;
    	  },
    	  decode: function decode(e) {
    	    var t = '';
    	    var n = void 0,
    	        r = void 0,
    	        i = void 0;
    	    var s = void 0,
    	        o = void 0,
    	        u = void 0,
    	        a = void 0;
    	    var f = 0;
    	
    	    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    	    while (f < e.length) {
    	      s = this._keyStr.indexOf(e.charAt(f++));
    	      o = this._keyStr.indexOf(e.charAt(f++));
    	      u = this._keyStr.indexOf(e.charAt(f++));
    	      a = this._keyStr.indexOf(e.charAt(f++));
    	      n = s << 2 | o >> 4;
    	      r = (o & 15) << 4 | u >> 2;
    	      i = (u & 3) << 6 | a;
    	      t = t + String.fromCharCode(n);
    	      if (u !== 64) {
    	        t = t + String.fromCharCode(r);
    	      }
    	      if (a !== 64) {
    	        t = t + String.fromCharCode(i);
    	      }
    	    }
    	    t = Base64._utf8Decode(t);
    	    return t;
    	  },
    	  _utf8Encode: function _utf8Encode(e) {
    	    e = e.replace(/\r\n/g, '\n');
    	    var t = '';
    	
    	    for (var n = 0; n < e.length; n++) {
    	      var r = e.charCodeAt(n);
    	
    	      if (r < 128) {
    	        t += String.fromCharCode(r);
    	      } else if (r > 127 && r < 2048) {
    	        t += String.fromCharCode(r >> 6 | 192);
    	        t += String.fromCharCode(r & 63 | 128);
    	      } else {
    	        t += String.fromCharCode(r >> 12 | 224);
    	        t += String.fromCharCode(r >> 6 & 63 | 128);
    	        t += String.fromCharCode(r & 63 | 128);
    	      }
    	    }
    	    return t;
    	  },
    	  _utf8Decode: function _utf8Decode(e) {
    	    var t = '';
    	    var n = 0;
    	    var r = void 0,
    	        c2 = void 0,
    	        c3 = void 0;
    	
    	    r = c2 = 0;
    	    while (n < e.length) {
    	      r = e.charCodeAt(n);
    	      if (r < 128) {
    	        t += String.fromCharCode(r);
    	        n++;
    	      } else if (r > 191 && r < 224) {
    	        c2 = e.charCodeAt(n + 1);
    	        t += String.fromCharCode((r & 31) << 6 | c2 & 63);
    	        n += 2;
    	      } else {
    	        c2 = e.charCodeAt(n + 1);
    	        c3 = e.charCodeAt(n + 2);
    	        t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    	        n += 3;
    	      }
    	    }
    	    return t;
    	  }
    	};
    	
    	module.exports = Base64;

    /***/ },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {

    	var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
    	// This work is free. You can redistribute it and/or modify it
    	// under the terms of the WTFPL, Version 2
    	// For more information see LICENSE.txt or http://www.wtfpl.net/
    	//
    	// For more information, the home page:
    	// http://pieroxy.net/blog/pages/lz-string/testing.html
    	//
    	// LZ-based compression algorithm, version 1.4.4
    	var LZString = (function() {
    	
    	// private property
    	var f = String.fromCharCode;
    	var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    	var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    	var baseReverseDic = {};
    	
    	function getBaseValue(alphabet, character) {
    	  if (!baseReverseDic[alphabet]) {
    	    baseReverseDic[alphabet] = {};
    	    for (var i=0 ; i<alphabet.length ; i++) {
    	      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    	    }
    	  }
    	  return baseReverseDic[alphabet][character];
    	}
    	
    	var LZString = {
    	  compressToBase64 : function (input) {
    	    if (input == null) return "";
    	    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    	    switch (res.length % 4) { // To produce valid Base64
    	    default: // When could this happen ?
    	    case 0 : return res;
    	    case 1 : return res+"===";
    	    case 2 : return res+"==";
    	    case 3 : return res+"=";
    	    }
    	  },
    	
    	  decompressFromBase64 : function (input) {
    	    if (input == null) return "";
    	    if (input == "") return null;
    	    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
    	  },
    	
    	  compressToUTF16 : function (input) {
    	    if (input == null) return "";
    	    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
    	  },
    	
    	  decompressFromUTF16: function (compressed) {
    	    if (compressed == null) return "";
    	    if (compressed == "") return null;
    	    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
    	  },
    	
    	  //compress into uint8array (UCS-2 big endian format)
    	  compressToUint8Array: function (uncompressed) {
    	    var compressed = LZString.compress(uncompressed);
    	    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character
    	
    	    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
    	      var current_value = compressed.charCodeAt(i);
    	      buf[i*2] = current_value >>> 8;
    	      buf[i*2+1] = current_value % 256;
    	    }
    	    return buf;
    	  },
    	
    	  //decompress from uint8array (UCS-2 big endian format)
    	  decompressFromUint8Array:function (compressed) {
    	    if (compressed===null || compressed===undefined){
    	        return LZString.decompress(compressed);
    	    } else {
    	        var buf=new Array(compressed.length/2); // 2 bytes per character
    	        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
    	          buf[i]=compressed[i*2]*256+compressed[i*2+1];
    	        }
    	
    	        var result = [];
    	        buf.forEach(function (c) {
    	          result.push(f(c));
    	        });
    	        return LZString.decompress(result.join(''));
    	
    	    }
    	
    	  },
    	
    	
    	  //compress into a string that is already URI encoded
    	  compressToEncodedURIComponent: function (input) {
    	    if (input == null) return "";
    	    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
    	  },
    	
    	  //decompress from an output of compressToEncodedURIComponent
    	  decompressFromEncodedURIComponent:function (input) {
    	    if (input == null) return "";
    	    if (input == "") return null;
    	    input = input.replace(/ /g, "+");
    	    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
    	  },
    	
    	  compress: function (uncompressed) {
    	    return LZString._compress(uncompressed, 16, function(a){return f(a);});
    	  },
    	  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    	    if (uncompressed == null) return "";
    	    var i, value,
    	        context_dictionary= {},
    	        context_dictionaryToCreate= {},
    	        context_c="",
    	        context_wc="",
    	        context_w="",
    	        context_enlargeIn= 2, // Compensate for the first entry which should not count
    	        context_dictSize= 3,
    	        context_numBits= 2,
    	        context_data=[],
    	        context_data_val=0,
    	        context_data_position=0,
    	        ii;
    	
    	    for (ii = 0; ii < uncompressed.length; ii += 1) {
    	      context_c = uncompressed.charAt(ii);
    	      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
    	        context_dictionary[context_c] = context_dictSize++;
    	        context_dictionaryToCreate[context_c] = true;
    	      }
    	
    	      context_wc = context_w + context_c;
    	      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
    	        context_w = context_wc;
    	      } else {
    	        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
    	          if (context_w.charCodeAt(0)<256) {
    	            for (i=0 ; i<context_numBits ; i++) {
    	              context_data_val = (context_data_val << 1);
    	              if (context_data_position == bitsPerChar-1) {
    	                context_data_position = 0;
    	                context_data.push(getCharFromInt(context_data_val));
    	                context_data_val = 0;
    	              } else {
    	                context_data_position++;
    	              }
    	            }
    	            value = context_w.charCodeAt(0);
    	            for (i=0 ; i<8 ; i++) {
    	              context_data_val = (context_data_val << 1) | (value&1);
    	              if (context_data_position == bitsPerChar-1) {
    	                context_data_position = 0;
    	                context_data.push(getCharFromInt(context_data_val));
    	                context_data_val = 0;
    	              } else {
    	                context_data_position++;
    	              }
    	              value = value >> 1;
    	            }
    	          } else {
    	            value = 1;
    	            for (i=0 ; i<context_numBits ; i++) {
    	              context_data_val = (context_data_val << 1) | value;
    	              if (context_data_position ==bitsPerChar-1) {
    	                context_data_position = 0;
    	                context_data.push(getCharFromInt(context_data_val));
    	                context_data_val = 0;
    	              } else {
    	                context_data_position++;
    	              }
    	              value = 0;
    	            }
    	            value = context_w.charCodeAt(0);
    	            for (i=0 ; i<16 ; i++) {
    	              context_data_val = (context_data_val << 1) | (value&1);
    	              if (context_data_position == bitsPerChar-1) {
    	                context_data_position = 0;
    	                context_data.push(getCharFromInt(context_data_val));
    	                context_data_val = 0;
    	              } else {
    	                context_data_position++;
    	              }
    	              value = value >> 1;
    	            }
    	          }
    	          context_enlargeIn--;
    	          if (context_enlargeIn == 0) {
    	            context_enlargeIn = Math.pow(2, context_numBits);
    	            context_numBits++;
    	          }
    	          delete context_dictionaryToCreate[context_w];
    	        } else {
    	          value = context_dictionary[context_w];
    	          for (i=0 ; i<context_numBits ; i++) {
    	            context_data_val = (context_data_val << 1) | (value&1);
    	            if (context_data_position == bitsPerChar-1) {
    	              context_data_position = 0;
    	              context_data.push(getCharFromInt(context_data_val));
    	              context_data_val = 0;
    	            } else {
    	              context_data_position++;
    	            }
    	            value = value >> 1;
    	          }
    	
    	
    	        }
    	        context_enlargeIn--;
    	        if (context_enlargeIn == 0) {
    	          context_enlargeIn = Math.pow(2, context_numBits);
    	          context_numBits++;
    	        }
    	        // Add wc to the dictionary.
    	        context_dictionary[context_wc] = context_dictSize++;
    	        context_w = String(context_c);
    	      }
    	    }
    	
    	    // Output the code for w.
    	    if (context_w !== "") {
    	      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
    	        if (context_w.charCodeAt(0)<256) {
    	          for (i=0 ; i<context_numBits ; i++) {
    	            context_data_val = (context_data_val << 1);
    	            if (context_data_position == bitsPerChar-1) {
    	              context_data_position = 0;
    	              context_data.push(getCharFromInt(context_data_val));
    	              context_data_val = 0;
    	            } else {
    	              context_data_position++;
    	            }
    	          }
    	          value = context_w.charCodeAt(0);
    	          for (i=0 ; i<8 ; i++) {
    	            context_data_val = (context_data_val << 1) | (value&1);
    	            if (context_data_position == bitsPerChar-1) {
    	              context_data_position = 0;
    	              context_data.push(getCharFromInt(context_data_val));
    	              context_data_val = 0;
    	            } else {
    	              context_data_position++;
    	            }
    	            value = value >> 1;
    	          }
    	        } else {
    	          value = 1;
    	          for (i=0 ; i<context_numBits ; i++) {
    	            context_data_val = (context_data_val << 1) | value;
    	            if (context_data_position == bitsPerChar-1) {
    	              context_data_position = 0;
    	              context_data.push(getCharFromInt(context_data_val));
    	              context_data_val = 0;
    	            } else {
    	              context_data_position++;
    	            }
    	            value = 0;
    	          }
    	          value = context_w.charCodeAt(0);
    	          for (i=0 ; i<16 ; i++) {
    	            context_data_val = (context_data_val << 1) | (value&1);
    	            if (context_data_position == bitsPerChar-1) {
    	              context_data_position = 0;
    	              context_data.push(getCharFromInt(context_data_val));
    	              context_data_val = 0;
    	            } else {
    	              context_data_position++;
    	            }
    	            value = value >> 1;
    	          }
    	        }
    	        context_enlargeIn--;
    	        if (context_enlargeIn == 0) {
    	          context_enlargeIn = Math.pow(2, context_numBits);
    	          context_numBits++;
    	        }
    	        delete context_dictionaryToCreate[context_w];
    	      } else {
    	        value = context_dictionary[context_w];
    	        for (i=0 ; i<context_numBits ; i++) {
    	          context_data_val = (context_data_val << 1) | (value&1);
    	          if (context_data_position == bitsPerChar-1) {
    	            context_data_position = 0;
    	            context_data.push(getCharFromInt(context_data_val));
    	            context_data_val = 0;
    	          } else {
    	            context_data_position++;
    	          }
    	          value = value >> 1;
    	        }
    	
    	
    	      }
    	      context_enlargeIn--;
    	      if (context_enlargeIn == 0) {
    	        context_enlargeIn = Math.pow(2, context_numBits);
    	        context_numBits++;
    	      }
    	    }
    	
    	    // Mark the end of the stream
    	    value = 2;
    	    for (i=0 ; i<context_numBits ; i++) {
    	      context_data_val = (context_data_val << 1) | (value&1);
    	      if (context_data_position == bitsPerChar-1) {
    	        context_data_position = 0;
    	        context_data.push(getCharFromInt(context_data_val));
    	        context_data_val = 0;
    	      } else {
    	        context_data_position++;
    	      }
    	      value = value >> 1;
    	    }
    	
    	    // Flush the last char
    	    while (true) {
    	      context_data_val = (context_data_val << 1);
    	      if (context_data_position == bitsPerChar-1) {
    	        context_data.push(getCharFromInt(context_data_val));
    	        break;
    	      }
    	      else context_data_position++;
    	    }
    	    return context_data.join('');
    	  },
    	
    	  decompress: function (compressed) {
    	    if (compressed == null) return "";
    	    if (compressed == "") return null;
    	    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
    	  },
    	
    	  _decompress: function (length, resetValue, getNextValue) {
    	    var dictionary = [],
    	        enlargeIn = 4,
    	        dictSize = 4,
    	        numBits = 3,
    	        entry = "",
    	        result = [],
    	        i,
    	        w,
    	        bits, resb, maxpower, power,
    	        c,
    	        data = {val:getNextValue(0), position:resetValue, index:1};
    	
    	    for (i = 0; i < 3; i += 1) {
    	      dictionary[i] = i;
    	    }
    	
    	    bits = 0;
    	    maxpower = Math.pow(2,2);
    	    power=1;
    	    while (power!=maxpower) {
    	      resb = data.val & data.position;
    	      data.position >>= 1;
    	      if (data.position == 0) {
    	        data.position = resetValue;
    	        data.val = getNextValue(data.index++);
    	      }
    	      bits |= (resb>0 ? 1 : 0) * power;
    	      power <<= 1;
    	    }
    	
    	    switch (bits) {
    	      case 0:
    	          bits = 0;
    	          maxpower = Math.pow(2,8);
    	          power=1;
    	          while (power!=maxpower) {
    	            resb = data.val & data.position;
    	            data.position >>= 1;
    	            if (data.position == 0) {
    	              data.position = resetValue;
    	              data.val = getNextValue(data.index++);
    	            }
    	            bits |= (resb>0 ? 1 : 0) * power;
    	            power <<= 1;
    	          }
    	        c = f(bits);
    	        break;
    	      case 1:
    	          bits = 0;
    	          maxpower = Math.pow(2,16);
    	          power=1;
    	          while (power!=maxpower) {
    	            resb = data.val & data.position;
    	            data.position >>= 1;
    	            if (data.position == 0) {
    	              data.position = resetValue;
    	              data.val = getNextValue(data.index++);
    	            }
    	            bits |= (resb>0 ? 1 : 0) * power;
    	            power <<= 1;
    	          }
    	        c = f(bits);
    	        break;
    	      case 2:
    	        return "";
    	    }
    	    dictionary[3] = c;
    	    w = c;
    	    result.push(c);
    	    while (true) {
    	      if (data.index > length) {
    	        return "";
    	      }
    	
    	      bits = 0;
    	      maxpower = Math.pow(2,numBits);
    	      power=1;
    	      while (power!=maxpower) {
    	        resb = data.val & data.position;
    	        data.position >>= 1;
    	        if (data.position == 0) {
    	          data.position = resetValue;
    	          data.val = getNextValue(data.index++);
    	        }
    	        bits |= (resb>0 ? 1 : 0) * power;
    	        power <<= 1;
    	      }
    	
    	      switch (c = bits) {
    	        case 0:
    	          bits = 0;
    	          maxpower = Math.pow(2,8);
    	          power=1;
    	          while (power!=maxpower) {
    	            resb = data.val & data.position;
    	            data.position >>= 1;
    	            if (data.position == 0) {
    	              data.position = resetValue;
    	              data.val = getNextValue(data.index++);
    	            }
    	            bits |= (resb>0 ? 1 : 0) * power;
    	            power <<= 1;
    	          }
    	
    	          dictionary[dictSize++] = f(bits);
    	          c = dictSize-1;
    	          enlargeIn--;
    	          break;
    	        case 1:
    	          bits = 0;
    	          maxpower = Math.pow(2,16);
    	          power=1;
    	          while (power!=maxpower) {
    	            resb = data.val & data.position;
    	            data.position >>= 1;
    	            if (data.position == 0) {
    	              data.position = resetValue;
    	              data.val = getNextValue(data.index++);
    	            }
    	            bits |= (resb>0 ? 1 : 0) * power;
    	            power <<= 1;
    	          }
    	          dictionary[dictSize++] = f(bits);
    	          c = dictSize-1;
    	          enlargeIn--;
    	          break;
    	        case 2:
    	          return result.join('');
    	      }
    	
    	      if (enlargeIn == 0) {
    	        enlargeIn = Math.pow(2, numBits);
    	        numBits++;
    	      }
    	
    	      if (dictionary[c]) {
    	        entry = dictionary[c];
    	      } else {
    	        if (c === dictSize) {
    	          entry = w + w.charAt(0);
    	        } else {
    	          return null;
    	        }
    	      }
    	      result.push(entry);
    	
    	      // Add w+entry[0] to the dictionary.
    	      dictionary[dictSize++] = w + entry.charAt(0);
    	      enlargeIn--;
    	
    	      w = entry;
    	
    	      if (enlargeIn == 0) {
    	        enlargeIn = Math.pow(2, numBits);
    	        numBits++;
    	      }
    	
    	    }
    	  }
    	};
    	  return LZString;
    	})();
    	
    	{
    	  !(__WEBPACK_AMD_DEFINE_RESULT__ = function () { return LZString; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    	}


    /***/ },
    /* 11 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var BlockCipher = C_lib.BlockCipher;
    		    var C_algo = C.algo;
    	
    		    // Lookup tables
    		    var SBOX = [];
    		    var INV_SBOX = [];
    		    var SUB_MIX_0 = [];
    		    var SUB_MIX_1 = [];
    		    var SUB_MIX_2 = [];
    		    var SUB_MIX_3 = [];
    		    var INV_SUB_MIX_0 = [];
    		    var INV_SUB_MIX_1 = [];
    		    var INV_SUB_MIX_2 = [];
    		    var INV_SUB_MIX_3 = [];
    	
    		    // Compute lookup tables
    		    (function () {
    		        // Compute double table
    		        var d = [];
    		        for (var i = 0; i < 256; i++) {
    		            if (i < 128) {
    		                d[i] = i << 1;
    		            } else {
    		                d[i] = (i << 1) ^ 0x11b;
    		            }
    		        }
    	
    		        // Walk GF(2^8)
    		        var x = 0;
    		        var xi = 0;
    		        for (var i = 0; i < 256; i++) {
    		            // Compute sbox
    		            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
    		            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
    		            SBOX[x] = sx;
    		            INV_SBOX[sx] = x;
    	
    		            // Compute multiplication
    		            var x2 = d[x];
    		            var x4 = d[x2];
    		            var x8 = d[x4];
    	
    		            // Compute sub bytes, mix columns tables
    		            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
    		            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
    		            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
    		            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
    		            SUB_MIX_3[x] = t;
    	
    		            // Compute inv sub bytes, inv mix columns tables
    		            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
    		            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
    		            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
    		            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
    		            INV_SUB_MIX_3[sx] = t;
    	
    		            // Compute next counter
    		            if (!x) {
    		                x = xi = 1;
    		            } else {
    		                x = x2 ^ d[d[d[x8 ^ x2]]];
    		                xi ^= d[d[xi]];
    		            }
    		        }
    		    }());
    	
    		    // Precomputed Rcon lookup
    		    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
    	
    		    /**
    		     * AES block cipher algorithm.
    		     */
    		    var AES = C_algo.AES = BlockCipher.extend({
    		        _doReset: function () {
    		            // Skip reset of nRounds has been set before and key did not change
    		            if (this._nRounds && this._keyPriorReset === this._key) {
    		                return;
    		            }
    	
    		            // Shortcuts
    		            var key = this._keyPriorReset = this._key;
    		            var keyWords = key.words;
    		            var keySize = key.sigBytes / 4;
    	
    		            // Compute number of rounds
    		            var nRounds = this._nRounds = keySize + 6;
    	
    		            // Compute number of key schedule rows
    		            var ksRows = (nRounds + 1) * 4;
    	
    		            // Compute key schedule
    		            var keySchedule = this._keySchedule = [];
    		            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
    		                if (ksRow < keySize) {
    		                    keySchedule[ksRow] = keyWords[ksRow];
    		                } else {
    		                    var t = keySchedule[ksRow - 1];
    	
    		                    if (!(ksRow % keySize)) {
    		                        // Rot word
    		                        t = (t << 8) | (t >>> 24);
    	
    		                        // Sub word
    		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
    	
    		                        // Mix Rcon
    		                        t ^= RCON[(ksRow / keySize) | 0] << 24;
    		                    } else if (keySize > 6 && ksRow % keySize == 4) {
    		                        // Sub word
    		                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
    		                    }
    	
    		                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
    		                }
    		            }
    	
    		            // Compute inv key schedule
    		            var invKeySchedule = this._invKeySchedule = [];
    		            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
    		                var ksRow = ksRows - invKsRow;
    	
    		                if (invKsRow % 4) {
    		                    var t = keySchedule[ksRow];
    		                } else {
    		                    var t = keySchedule[ksRow - 4];
    		                }
    	
    		                if (invKsRow < 4 || ksRow <= 4) {
    		                    invKeySchedule[invKsRow] = t;
    		                } else {
    		                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
    		                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
    		                }
    		            }
    		        },
    	
    		        encryptBlock: function (M, offset) {
    		            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
    		        },
    	
    		        decryptBlock: function (M, offset) {
    		            // Swap 2nd and 4th rows
    		            var t = M[offset + 1];
    		            M[offset + 1] = M[offset + 3];
    		            M[offset + 3] = t;
    	
    		            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
    	
    		            // Inv swap 2nd and 4th rows
    		            var t = M[offset + 1];
    		            M[offset + 1] = M[offset + 3];
    		            M[offset + 3] = t;
    		        },
    	
    		        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
    		            // Shortcut
    		            var nRounds = this._nRounds;
    	
    		            // Get input, add round key
    		            var s0 = M[offset]     ^ keySchedule[0];
    		            var s1 = M[offset + 1] ^ keySchedule[1];
    		            var s2 = M[offset + 2] ^ keySchedule[2];
    		            var s3 = M[offset + 3] ^ keySchedule[3];
    	
    		            // Key schedule row counter
    		            var ksRow = 4;
    	
    		            // Rounds
    		            for (var round = 1; round < nRounds; round++) {
    		                // Shift rows, sub bytes, mix columns, add round key
    		                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
    		                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
    		                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
    		                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];
    	
    		                // Update state
    		                s0 = t0;
    		                s1 = t1;
    		                s2 = t2;
    		                s3 = t3;
    		            }
    	
    		            // Shift rows, sub bytes, add round key
    		            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
    		            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
    		            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
    		            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];
    	
    		            // Set output
    		            M[offset]     = t0;
    		            M[offset + 1] = t1;
    		            M[offset + 2] = t2;
    		            M[offset + 3] = t3;
    		        },
    	
    		        keySize: 256/32
    		    });
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
    		     */
    		    C.AES = BlockCipher._createHelper(AES);
    		}());
    	
    	
    		return CryptoJS.AES;
    	
    	}));

    /***/ },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var WordArray = C_lib.WordArray;
    		    var C_enc = C.enc;
    	
    		    /**
    		     * Base64 encoding strategy.
    		     */
    		    C_enc.Base64 = {
    		        /**
    		         * Converts a word array to a Base64 string.
    		         *
    		         * @param {WordArray} wordArray The word array.
    		         *
    		         * @return {string} The Base64 string.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
    		         */
    		        stringify: function (wordArray) {
    		            // Shortcuts
    		            var words = wordArray.words;
    		            var sigBytes = wordArray.sigBytes;
    		            var map = this._map;
    	
    		            // Clamp excess bits
    		            wordArray.clamp();
    	
    		            // Convert
    		            var base64Chars = [];
    		            for (var i = 0; i < sigBytes; i += 3) {
    		                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
    		                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
    		                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
    	
    		                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
    	
    		                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
    		                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
    		                }
    		            }
    	
    		            // Add padding
    		            var paddingChar = map.charAt(64);
    		            if (paddingChar) {
    		                while (base64Chars.length % 4) {
    		                    base64Chars.push(paddingChar);
    		                }
    		            }
    	
    		            return base64Chars.join('');
    		        },
    	
    		        /**
    		         * Converts a Base64 string to a word array.
    		         *
    		         * @param {string} base64Str The Base64 string.
    		         *
    		         * @return {WordArray} The word array.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
    		         */
    		        parse: function (base64Str) {
    		            // Shortcuts
    		            var base64StrLength = base64Str.length;
    		            var map = this._map;
    		            var reverseMap = this._reverseMap;
    	
    		            if (!reverseMap) {
    		                    reverseMap = this._reverseMap = [];
    		                    for (var j = 0; j < map.length; j++) {
    		                        reverseMap[map.charCodeAt(j)] = j;
    		                    }
    		            }
    	
    		            // Ignore padding
    		            var paddingChar = map.charAt(64);
    		            if (paddingChar) {
    		                var paddingIndex = base64Str.indexOf(paddingChar);
    		                if (paddingIndex !== -1) {
    		                    base64StrLength = paddingIndex;
    		                }
    		            }
    	
    		            // Convert
    		            return parseLoop(base64Str, base64StrLength, reverseMap);
    	
    		        },
    	
    		        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    		    };
    	
    		    function parseLoop(base64Str, base64StrLength, reverseMap) {
    		      var words = [];
    		      var nBytes = 0;
    		      for (var i = 0; i < base64StrLength; i++) {
    		          if (i % 4) {
    		              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
    		              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
    		              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
    		              nBytes++;
    		          }
    		      }
    		      return WordArray.create(words, nBytes);
    		    }
    		}());
    	
    	
    		return CryptoJS.enc.Base64;
    	
    	}));

    /***/ },
    /* 13 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function (Math) {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var WordArray = C_lib.WordArray;
    		    var Hasher = C_lib.Hasher;
    		    var C_algo = C.algo;
    	
    		    // Constants table
    		    var T = [];
    	
    		    // Compute constants
    		    (function () {
    		        for (var i = 0; i < 64; i++) {
    		            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
    		        }
    		    }());
    	
    		    /**
    		     * MD5 hash algorithm.
    		     */
    		    var MD5 = C_algo.MD5 = Hasher.extend({
    		        _doReset: function () {
    		            this._hash = new WordArray.init([
    		                0x67452301, 0xefcdab89,
    		                0x98badcfe, 0x10325476
    		            ]);
    		        },
    	
    		        _doProcessBlock: function (M, offset) {
    		            // Swap endian
    		            for (var i = 0; i < 16; i++) {
    		                // Shortcuts
    		                var offset_i = offset + i;
    		                var M_offset_i = M[offset_i];
    	
    		                M[offset_i] = (
    		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
    		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
    		                );
    		            }
    	
    		            // Shortcuts
    		            var H = this._hash.words;
    	
    		            var M_offset_0  = M[offset + 0];
    		            var M_offset_1  = M[offset + 1];
    		            var M_offset_2  = M[offset + 2];
    		            var M_offset_3  = M[offset + 3];
    		            var M_offset_4  = M[offset + 4];
    		            var M_offset_5  = M[offset + 5];
    		            var M_offset_6  = M[offset + 6];
    		            var M_offset_7  = M[offset + 7];
    		            var M_offset_8  = M[offset + 8];
    		            var M_offset_9  = M[offset + 9];
    		            var M_offset_10 = M[offset + 10];
    		            var M_offset_11 = M[offset + 11];
    		            var M_offset_12 = M[offset + 12];
    		            var M_offset_13 = M[offset + 13];
    		            var M_offset_14 = M[offset + 14];
    		            var M_offset_15 = M[offset + 15];
    	
    		            // Working varialbes
    		            var a = H[0];
    		            var b = H[1];
    		            var c = H[2];
    		            var d = H[3];
    	
    		            // Computation
    		            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
    		            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
    		            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
    		            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
    		            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
    		            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
    		            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
    		            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
    		            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
    		            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
    		            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
    		            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
    		            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
    		            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
    		            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
    		            b = FF(b, c, d, a, M_offset_15, 22, T[15]);
    	
    		            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
    		            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
    		            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
    		            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
    		            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
    		            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
    		            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
    		            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
    		            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
    		            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
    		            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
    		            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
    		            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
    		            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
    		            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
    		            b = GG(b, c, d, a, M_offset_12, 20, T[31]);
    	
    		            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
    		            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
    		            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
    		            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
    		            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
    		            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
    		            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
    		            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
    		            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
    		            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
    		            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
    		            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
    		            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
    		            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
    		            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
    		            b = HH(b, c, d, a, M_offset_2,  23, T[47]);
    	
    		            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
    		            d = II(d, a, b, c, M_offset_7,  10, T[49]);
    		            c = II(c, d, a, b, M_offset_14, 15, T[50]);
    		            b = II(b, c, d, a, M_offset_5,  21, T[51]);
    		            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
    		            d = II(d, a, b, c, M_offset_3,  10, T[53]);
    		            c = II(c, d, a, b, M_offset_10, 15, T[54]);
    		            b = II(b, c, d, a, M_offset_1,  21, T[55]);
    		            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
    		            d = II(d, a, b, c, M_offset_15, 10, T[57]);
    		            c = II(c, d, a, b, M_offset_6,  15, T[58]);
    		            b = II(b, c, d, a, M_offset_13, 21, T[59]);
    		            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
    		            d = II(d, a, b, c, M_offset_11, 10, T[61]);
    		            c = II(c, d, a, b, M_offset_2,  15, T[62]);
    		            b = II(b, c, d, a, M_offset_9,  21, T[63]);
    	
    		            // Intermediate hash value
    		            H[0] = (H[0] + a) | 0;
    		            H[1] = (H[1] + b) | 0;
    		            H[2] = (H[2] + c) | 0;
    		            H[3] = (H[3] + d) | 0;
    		        },
    	
    		        _doFinalize: function () {
    		            // Shortcuts
    		            var data = this._data;
    		            var dataWords = data.words;
    	
    		            var nBitsTotal = this._nDataBytes * 8;
    		            var nBitsLeft = data.sigBytes * 8;
    	
    		            // Add padding
    		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
    	
    		            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
    		            var nBitsTotalL = nBitsTotal;
    		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
    		                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
    		                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
    		            );
    		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
    		                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
    		                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
    		            );
    	
    		            data.sigBytes = (dataWords.length + 1) * 4;
    	
    		            // Hash final blocks
    		            this._process();
    	
    		            // Shortcuts
    		            var hash = this._hash;
    		            var H = hash.words;
    	
    		            // Swap endian
    		            for (var i = 0; i < 4; i++) {
    		                // Shortcut
    		                var H_i = H[i];
    	
    		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
    		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
    		            }
    	
    		            // Return final computed hash
    		            return hash;
    		        },
    	
    		        clone: function () {
    		            var clone = Hasher.clone.call(this);
    		            clone._hash = this._hash.clone();
    	
    		            return clone;
    		        }
    		    });
    	
    		    function FF(a, b, c, d, x, s, t) {
    		        var n = a + ((b & c) | (~b & d)) + x + t;
    		        return ((n << s) | (n >>> (32 - s))) + b;
    		    }
    	
    		    function GG(a, b, c, d, x, s, t) {
    		        var n = a + ((b & d) | (c & ~d)) + x + t;
    		        return ((n << s) | (n >>> (32 - s))) + b;
    		    }
    	
    		    function HH(a, b, c, d, x, s, t) {
    		        var n = a + (b ^ c ^ d) + x + t;
    		        return ((n << s) | (n >>> (32 - s))) + b;
    		    }
    	
    		    function II(a, b, c, d, x, s, t) {
    		        var n = a + (c ^ (b | ~d)) + x + t;
    		        return ((n << s) | (n >>> (32 - s))) + b;
    		    }
    	
    		    /**
    		     * Shortcut function to the hasher's object interface.
    		     *
    		     * @param {WordArray|string} message The message to hash.
    		     *
    		     * @return {WordArray} The hash.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var hash = CryptoJS.MD5('message');
    		     *     var hash = CryptoJS.MD5(wordArray);
    		     */
    		    C.MD5 = Hasher._createHelper(MD5);
    	
    		    /**
    		     * Shortcut function to the HMAC's object interface.
    		     *
    		     * @param {WordArray|string} message The message to hash.
    		     * @param {WordArray|string} key The secret key.
    		     *
    		     * @return {WordArray} The HMAC.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var hmac = CryptoJS.HmacMD5(message, key);
    		     */
    		    C.HmacMD5 = Hasher._createHmacHelper(MD5);
    		}(Math));
    	
    	
    		return CryptoJS.MD5;
    	
    	}));

    /***/ },
    /* 14 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(6), __webpack_require__(7));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var Base = C_lib.Base;
    		    var WordArray = C_lib.WordArray;
    		    var C_algo = C.algo;
    		    var MD5 = C_algo.MD5;
    	
    		    /**
    		     * This key derivation function is meant to conform with EVP_BytesToKey.
    		     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
    		     */
    		    var EvpKDF = C_algo.EvpKDF = Base.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
    		         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
    		         * @property {number} iterations The number of iterations to perform. Default: 1
    		         */
    		        cfg: Base.extend({
    		            keySize: 128/32,
    		            hasher: MD5,
    		            iterations: 1
    		        }),
    	
    		        /**
    		         * Initializes a newly created key derivation function.
    		         *
    		         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
    		         *
    		         * @example
    		         *
    		         *     var kdf = CryptoJS.algo.EvpKDF.create();
    		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
    		         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
    		         */
    		        init: function (cfg) {
    		            this.cfg = this.cfg.extend(cfg);
    		        },
    	
    		        /**
    		         * Derives a key from a password.
    		         *
    		         * @param {WordArray|string} password The password.
    		         * @param {WordArray|string} salt A salt.
    		         *
    		         * @return {WordArray} The derived key.
    		         *
    		         * @example
    		         *
    		         *     var key = kdf.compute(password, salt);
    		         */
    		        compute: function (password, salt) {
    		            // Shortcut
    		            var cfg = this.cfg;
    	
    		            // Init hasher
    		            var hasher = cfg.hasher.create();
    	
    		            // Initial values
    		            var derivedKey = WordArray.create();
    	
    		            // Shortcuts
    		            var derivedKeyWords = derivedKey.words;
    		            var keySize = cfg.keySize;
    		            var iterations = cfg.iterations;
    	
    		            // Generate key
    		            while (derivedKeyWords.length < keySize) {
    		                if (block) {
    		                    hasher.update(block);
    		                }
    		                var block = hasher.update(password).finalize(salt);
    		                hasher.reset();
    	
    		                // Iterations
    		                for (var i = 1; i < iterations; i++) {
    		                    block = hasher.finalize(block);
    		                    hasher.reset();
    		                }
    	
    		                derivedKey.concat(block);
    		            }
    		            derivedKey.sigBytes = keySize * 4;
    	
    		            return derivedKey;
    		        }
    		    });
    	
    		    /**
    		     * Derives a key from a password.
    		     *
    		     * @param {WordArray|string} password The password.
    		     * @param {WordArray|string} salt A salt.
    		     * @param {Object} cfg (Optional) The configuration options to use for this computation.
    		     *
    		     * @return {WordArray} The derived key.
    		     *
    		     * @static
    		     *
    		     * @example
    		     *
    		     *     var key = CryptoJS.EvpKDF(password, salt);
    		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
    		     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
    		     */
    		    C.EvpKDF = function (password, salt, cfg) {
    		        return EvpKDF.create(cfg).compute(password, salt);
    		    };
    		}());
    	
    	
    		return CryptoJS.EvpKDF;
    	
    	}));

    /***/ },
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5));
    		}
    	}(this, function (CryptoJS) {
    	
    		/**
    		 * Cipher core components.
    		 */
    		CryptoJS.lib.Cipher || (function (undefined$1) {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var Base = C_lib.Base;
    		    var WordArray = C_lib.WordArray;
    		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    		    var C_enc = C.enc;
    		    C_enc.Utf8;
    		    var Base64 = C_enc.Base64;
    		    var C_algo = C.algo;
    		    var EvpKDF = C_algo.EvpKDF;
    	
    		    /**
    		     * Abstract base cipher template.
    		     *
    		     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
    		     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
    		     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
    		     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
    		     */
    		    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {WordArray} iv The IV to use for this operation.
    		         */
    		        cfg: Base.extend(),
    	
    		        /**
    		         * Creates this cipher in encryption mode.
    		         *
    		         * @param {WordArray} key The key.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {Cipher} A cipher instance.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
    		         */
    		        createEncryptor: function (key, cfg) {
    		            return this.create(this._ENC_XFORM_MODE, key, cfg);
    		        },
    	
    		        /**
    		         * Creates this cipher in decryption mode.
    		         *
    		         * @param {WordArray} key The key.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {Cipher} A cipher instance.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
    		         */
    		        createDecryptor: function (key, cfg) {
    		            return this.create(this._DEC_XFORM_MODE, key, cfg);
    		        },
    	
    		        /**
    		         * Initializes a newly created cipher.
    		         *
    		         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
    		         * @param {WordArray} key The key.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @example
    		         *
    		         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
    		         */
    		        init: function (xformMode, key, cfg) {
    		            // Apply config defaults
    		            this.cfg = this.cfg.extend(cfg);
    	
    		            // Store transform mode and key
    		            this._xformMode = xformMode;
    		            this._key = key;
    	
    		            // Set initial values
    		            this.reset();
    		        },
    	
    		        /**
    		         * Resets this cipher to its initial state.
    		         *
    		         * @example
    		         *
    		         *     cipher.reset();
    		         */
    		        reset: function () {
    		            // Reset data buffer
    		            BufferedBlockAlgorithm.reset.call(this);
    	
    		            // Perform concrete-cipher logic
    		            this._doReset();
    		        },
    	
    		        /**
    		         * Adds data to be encrypted or decrypted.
    		         *
    		         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
    		         *
    		         * @return {WordArray} The data after processing.
    		         *
    		         * @example
    		         *
    		         *     var encrypted = cipher.process('data');
    		         *     var encrypted = cipher.process(wordArray);
    		         */
    		        process: function (dataUpdate) {
    		            // Append
    		            this._append(dataUpdate);
    	
    		            // Process available blocks
    		            return this._process();
    		        },
    	
    		        /**
    		         * Finalizes the encryption or decryption process.
    		         * Note that the finalize operation is effectively a destructive, read-once operation.
    		         *
    		         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
    		         *
    		         * @return {WordArray} The data after final processing.
    		         *
    		         * @example
    		         *
    		         *     var encrypted = cipher.finalize();
    		         *     var encrypted = cipher.finalize('data');
    		         *     var encrypted = cipher.finalize(wordArray);
    		         */
    		        finalize: function (dataUpdate) {
    		            // Final data update
    		            if (dataUpdate) {
    		                this._append(dataUpdate);
    		            }
    	
    		            // Perform concrete-cipher logic
    		            var finalProcessedData = this._doFinalize();
    	
    		            return finalProcessedData;
    		        },
    	
    		        keySize: 128/32,
    	
    		        ivSize: 128/32,
    	
    		        _ENC_XFORM_MODE: 1,
    	
    		        _DEC_XFORM_MODE: 2,
    	
    		        /**
    		         * Creates shortcut functions to a cipher's object interface.
    		         *
    		         * @param {Cipher} cipher The cipher to create a helper for.
    		         *
    		         * @return {Object} An object with encrypt and decrypt shortcut functions.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
    		         */
    		        _createHelper: (function () {
    		            function selectCipherStrategy(key) {
    		                if (typeof key == 'string') {
    		                    return PasswordBasedCipher;
    		                } else {
    		                    return SerializableCipher;
    		                }
    		            }
    	
    		            return function (cipher) {
    		                return {
    		                    encrypt: function (message, key, cfg) {
    		                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
    		                    },
    	
    		                    decrypt: function (ciphertext, key, cfg) {
    		                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
    		                    }
    		                };
    		            };
    		        }())
    		    });
    	
    		    /**
    		     * Abstract base stream cipher template.
    		     *
    		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
    		     */
    		    C_lib.StreamCipher = Cipher.extend({
    		        _doFinalize: function () {
    		            // Process partial blocks
    		            var finalProcessedBlocks = this._process(!!'flush');
    	
    		            return finalProcessedBlocks;
    		        },
    	
    		        blockSize: 1
    		    });
    	
    		    /**
    		     * Mode namespace.
    		     */
    		    var C_mode = C.mode = {};
    	
    		    /**
    		     * Abstract base block cipher mode template.
    		     */
    		    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
    		        /**
    		         * Creates this mode for encryption.
    		         *
    		         * @param {Cipher} cipher A block cipher instance.
    		         * @param {Array} iv The IV words.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
    		         */
    		        createEncryptor: function (cipher, iv) {
    		            return this.Encryptor.create(cipher, iv);
    		        },
    	
    		        /**
    		         * Creates this mode for decryption.
    		         *
    		         * @param {Cipher} cipher A block cipher instance.
    		         * @param {Array} iv The IV words.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
    		         */
    		        createDecryptor: function (cipher, iv) {
    		            return this.Decryptor.create(cipher, iv);
    		        },
    	
    		        /**
    		         * Initializes a newly created mode.
    		         *
    		         * @param {Cipher} cipher A block cipher instance.
    		         * @param {Array} iv The IV words.
    		         *
    		         * @example
    		         *
    		         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
    		         */
    		        init: function (cipher, iv) {
    		            this._cipher = cipher;
    		            this._iv = iv;
    		        }
    		    });
    	
    		    /**
    		     * Cipher Block Chaining mode.
    		     */
    		    var CBC = C_mode.CBC = (function () {
    		        /**
    		         * Abstract base CBC mode.
    		         */
    		        var CBC = BlockCipherMode.extend();
    	
    		        /**
    		         * CBC encryptor.
    		         */
    		        CBC.Encryptor = CBC.extend({
    		            /**
    		             * Processes the data block at offset.
    		             *
    		             * @param {Array} words The data words to operate on.
    		             * @param {number} offset The offset where the block starts.
    		             *
    		             * @example
    		             *
    		             *     mode.processBlock(data.words, offset);
    		             */
    		            processBlock: function (words, offset) {
    		                // Shortcuts
    		                var cipher = this._cipher;
    		                var blockSize = cipher.blockSize;
    	
    		                // XOR and encrypt
    		                xorBlock.call(this, words, offset, blockSize);
    		                cipher.encryptBlock(words, offset);
    	
    		                // Remember this block to use with next block
    		                this._prevBlock = words.slice(offset, offset + blockSize);
    		            }
    		        });
    	
    		        /**
    		         * CBC decryptor.
    		         */
    		        CBC.Decryptor = CBC.extend({
    		            /**
    		             * Processes the data block at offset.
    		             *
    		             * @param {Array} words The data words to operate on.
    		             * @param {number} offset The offset where the block starts.
    		             *
    		             * @example
    		             *
    		             *     mode.processBlock(data.words, offset);
    		             */
    		            processBlock: function (words, offset) {
    		                // Shortcuts
    		                var cipher = this._cipher;
    		                var blockSize = cipher.blockSize;
    	
    		                // Remember this block to use with next block
    		                var thisBlock = words.slice(offset, offset + blockSize);
    	
    		                // Decrypt and XOR
    		                cipher.decryptBlock(words, offset);
    		                xorBlock.call(this, words, offset, blockSize);
    	
    		                // This block becomes the previous block
    		                this._prevBlock = thisBlock;
    		            }
    		        });
    	
    		        function xorBlock(words, offset, blockSize) {
    		            // Shortcut
    		            var iv = this._iv;
    	
    		            // Choose mixing block
    		            if (iv) {
    		                var block = iv;
    	
    		                // Remove IV for subsequent blocks
    		                this._iv = undefined$1;
    		            } else {
    		                var block = this._prevBlock;
    		            }
    	
    		            // XOR blocks
    		            for (var i = 0; i < blockSize; i++) {
    		                words[offset + i] ^= block[i];
    		            }
    		        }
    	
    		        return CBC;
    		    }());
    	
    		    /**
    		     * Padding namespace.
    		     */
    		    var C_pad = C.pad = {};
    	
    		    /**
    		     * PKCS #5/7 padding strategy.
    		     */
    		    var Pkcs7 = C_pad.Pkcs7 = {
    		        /**
    		         * Pads data using the algorithm defined in PKCS #5/7.
    		         *
    		         * @param {WordArray} data The data to pad.
    		         * @param {number} blockSize The multiple that the data should be padded to.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
    		         */
    		        pad: function (data, blockSize) {
    		            // Shortcut
    		            var blockSizeBytes = blockSize * 4;
    	
    		            // Count padding bytes
    		            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
    	
    		            // Create padding word
    		            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;
    	
    		            // Create padding
    		            var paddingWords = [];
    		            for (var i = 0; i < nPaddingBytes; i += 4) {
    		                paddingWords.push(paddingWord);
    		            }
    		            var padding = WordArray.create(paddingWords, nPaddingBytes);
    	
    		            // Add padding
    		            data.concat(padding);
    		        },
    	
    		        /**
    		         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
    		         *
    		         * @param {WordArray} data The data to unpad.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
    		         */
    		        unpad: function (data) {
    		            // Get number of padding bytes from last byte
    		            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;
    	
    		            // Remove padding
    		            data.sigBytes -= nPaddingBytes;
    		        }
    		    };
    	
    		    /**
    		     * Abstract base block cipher template.
    		     *
    		     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
    		     */
    		    C_lib.BlockCipher = Cipher.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {Mode} mode The block mode to use. Default: CBC
    		         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
    		         */
    		        cfg: Cipher.cfg.extend({
    		            mode: CBC,
    		            padding: Pkcs7
    		        }),
    	
    		        reset: function () {
    		            // Reset cipher
    		            Cipher.reset.call(this);
    	
    		            // Shortcuts
    		            var cfg = this.cfg;
    		            var iv = cfg.iv;
    		            var mode = cfg.mode;
    	
    		            // Reset block mode
    		            if (this._xformMode == this._ENC_XFORM_MODE) {
    		                var modeCreator = mode.createEncryptor;
    		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
    		                var modeCreator = mode.createDecryptor;
    	
    		                // Keep at least one block in the buffer for unpadding
    		                this._minBufferSize = 1;
    		            }
    		            this._mode = modeCreator.call(mode, this, iv && iv.words);
    		        },
    	
    		        _doProcessBlock: function (words, offset) {
    		            this._mode.processBlock(words, offset);
    		        },
    	
    		        _doFinalize: function () {
    		            // Shortcut
    		            var padding = this.cfg.padding;
    	
    		            // Finalize
    		            if (this._xformMode == this._ENC_XFORM_MODE) {
    		                // Pad data
    		                padding.pad(this._data, this.blockSize);
    	
    		                // Process final blocks
    		                var finalProcessedBlocks = this._process(!!'flush');
    		            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
    		                // Process final blocks
    		                var finalProcessedBlocks = this._process(!!'flush');
    	
    		                // Unpad data
    		                padding.unpad(finalProcessedBlocks);
    		            }
    	
    		            return finalProcessedBlocks;
    		        },
    	
    		        blockSize: 128/32
    		    });
    	
    		    /**
    		     * A collection of cipher parameters.
    		     *
    		     * @property {WordArray} ciphertext The raw ciphertext.
    		     * @property {WordArray} key The key to this ciphertext.
    		     * @property {WordArray} iv The IV used in the ciphering operation.
    		     * @property {WordArray} salt The salt used with a key derivation function.
    		     * @property {Cipher} algorithm The cipher algorithm.
    		     * @property {Mode} mode The block mode used in the ciphering operation.
    		     * @property {Padding} padding The padding scheme used in the ciphering operation.
    		     * @property {number} blockSize The block size of the cipher.
    		     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
    		     */
    		    var CipherParams = C_lib.CipherParams = Base.extend({
    		        /**
    		         * Initializes a newly created cipher params object.
    		         *
    		         * @param {Object} cipherParams An object with any of the possible cipher parameters.
    		         *
    		         * @example
    		         *
    		         *     var cipherParams = CryptoJS.lib.CipherParams.create({
    		         *         ciphertext: ciphertextWordArray,
    		         *         key: keyWordArray,
    		         *         iv: ivWordArray,
    		         *         salt: saltWordArray,
    		         *         algorithm: CryptoJS.algo.AES,
    		         *         mode: CryptoJS.mode.CBC,
    		         *         padding: CryptoJS.pad.PKCS7,
    		         *         blockSize: 4,
    		         *         formatter: CryptoJS.format.OpenSSL
    		         *     });
    		         */
    		        init: function (cipherParams) {
    		            this.mixIn(cipherParams);
    		        },
    	
    		        /**
    		         * Converts this cipher params object to a string.
    		         *
    		         * @param {Format} formatter (Optional) The formatting strategy to use.
    		         *
    		         * @return {string} The stringified cipher params.
    		         *
    		         * @throws Error If neither the formatter nor the default formatter is set.
    		         *
    		         * @example
    		         *
    		         *     var string = cipherParams + '';
    		         *     var string = cipherParams.toString();
    		         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
    		         */
    		        toString: function (formatter) {
    		            return (formatter || this.formatter).stringify(this);
    		        }
    		    });
    	
    		    /**
    		     * Format namespace.
    		     */
    		    var C_format = C.format = {};
    	
    		    /**
    		     * OpenSSL formatting strategy.
    		     */
    		    var OpenSSLFormatter = C_format.OpenSSL = {
    		        /**
    		         * Converts a cipher params object to an OpenSSL-compatible string.
    		         *
    		         * @param {CipherParams} cipherParams The cipher params object.
    		         *
    		         * @return {string} The OpenSSL-compatible string.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
    		         */
    		        stringify: function (cipherParams) {
    		            // Shortcuts
    		            var ciphertext = cipherParams.ciphertext;
    		            var salt = cipherParams.salt;
    	
    		            // Format
    		            if (salt) {
    		                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
    		            } else {
    		                var wordArray = ciphertext;
    		            }
    	
    		            return wordArray.toString(Base64);
    		        },
    	
    		        /**
    		         * Converts an OpenSSL-compatible string to a cipher params object.
    		         *
    		         * @param {string} openSSLStr The OpenSSL-compatible string.
    		         *
    		         * @return {CipherParams} The cipher params object.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
    		         */
    		        parse: function (openSSLStr) {
    		            // Parse base64
    		            var ciphertext = Base64.parse(openSSLStr);
    	
    		            // Shortcut
    		            var ciphertextWords = ciphertext.words;
    	
    		            // Test for salt
    		            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
    		                // Extract salt
    		                var salt = WordArray.create(ciphertextWords.slice(2, 4));
    	
    		                // Remove salt from ciphertext
    		                ciphertextWords.splice(0, 4);
    		                ciphertext.sigBytes -= 16;
    		            }
    	
    		            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
    		        }
    		    };
    	
    		    /**
    		     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
    		     */
    		    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
    		         */
    		        cfg: Base.extend({
    		            format: OpenSSLFormatter
    		        }),
    	
    		        /**
    		         * Encrypts a message.
    		         *
    		         * @param {Cipher} cipher The cipher algorithm to use.
    		         * @param {WordArray|string} message The message to encrypt.
    		         * @param {WordArray} key The key.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {CipherParams} A cipher params object.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
    		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
    		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    		         */
    		        encrypt: function (cipher, message, key, cfg) {
    		            // Apply config defaults
    		            cfg = this.cfg.extend(cfg);
    	
    		            // Encrypt
    		            var encryptor = cipher.createEncryptor(key, cfg);
    		            var ciphertext = encryptor.finalize(message);
    	
    		            // Shortcut
    		            var cipherCfg = encryptor.cfg;
    	
    		            // Create and return serializable cipher params
    		            return CipherParams.create({
    		                ciphertext: ciphertext,
    		                key: key,
    		                iv: cipherCfg.iv,
    		                algorithm: cipher,
    		                mode: cipherCfg.mode,
    		                padding: cipherCfg.padding,
    		                blockSize: cipher.blockSize,
    		                formatter: cfg.format
    		            });
    		        },
    	
    		        /**
    		         * Decrypts serialized ciphertext.
    		         *
    		         * @param {Cipher} cipher The cipher algorithm to use.
    		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
    		         * @param {WordArray} key The key.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {WordArray} The plaintext.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    		         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
    		         */
    		        decrypt: function (cipher, ciphertext, key, cfg) {
    		            // Apply config defaults
    		            cfg = this.cfg.extend(cfg);
    	
    		            // Convert string to CipherParams
    		            ciphertext = this._parse(ciphertext, cfg.format);
    	
    		            // Decrypt
    		            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
    	
    		            return plaintext;
    		        },
    	
    		        /**
    		         * Converts serialized ciphertext to CipherParams,
    		         * else assumed CipherParams already and returns ciphertext unchanged.
    		         *
    		         * @param {CipherParams|string} ciphertext The ciphertext.
    		         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
    		         *
    		         * @return {CipherParams} The unserialized ciphertext.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
    		         */
    		        _parse: function (ciphertext, format) {
    		            if (typeof ciphertext == 'string') {
    		                return format.parse(ciphertext, this);
    		            } else {
    		                return ciphertext;
    		            }
    		        }
    		    });
    	
    		    /**
    		     * Key derivation function namespace.
    		     */
    		    var C_kdf = C.kdf = {};
    	
    		    /**
    		     * OpenSSL key derivation function.
    		     */
    		    var OpenSSLKdf = C_kdf.OpenSSL = {
    		        /**
    		         * Derives a key and IV from a password.
    		         *
    		         * @param {string} password The password to derive from.
    		         * @param {number} keySize The size in words of the key to generate.
    		         * @param {number} ivSize The size in words of the IV to generate.
    		         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
    		         *
    		         * @return {CipherParams} A cipher params object with the key, IV, and salt.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
    		         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
    		         */
    		        execute: function (password, keySize, ivSize, salt) {
    		            // Generate random salt
    		            if (!salt) {
    		                salt = WordArray.random(64/8);
    		            }
    	
    		            // Derive key and IV
    		            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
    	
    		            // Separate key and IV
    		            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
    		            key.sigBytes = keySize * 4;
    	
    		            // Return params
    		            return CipherParams.create({ key: key, iv: iv, salt: salt });
    		        }
    		    };
    	
    		    /**
    		     * A serializable cipher wrapper that derives the key from a password,
    		     * and returns ciphertext as a serializable cipher params object.
    		     */
    		    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
    		         */
    		        cfg: SerializableCipher.cfg.extend({
    		            kdf: OpenSSLKdf
    		        }),
    	
    		        /**
    		         * Encrypts a message using a password.
    		         *
    		         * @param {Cipher} cipher The cipher algorithm to use.
    		         * @param {WordArray|string} message The message to encrypt.
    		         * @param {string} password The password.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {CipherParams} A cipher params object.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
    		         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
    		         */
    		        encrypt: function (cipher, message, password, cfg) {
    		            // Apply config defaults
    		            cfg = this.cfg.extend(cfg);
    	
    		            // Derive key and other params
    		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);
    	
    		            // Add IV to config
    		            cfg.iv = derivedParams.iv;
    	
    		            // Encrypt
    		            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
    	
    		            // Mix in derived params
    		            ciphertext.mixIn(derivedParams);
    	
    		            return ciphertext;
    		        },
    	
    		        /**
    		         * Decrypts serialized ciphertext using a password.
    		         *
    		         * @param {Cipher} cipher The cipher algorithm to use.
    		         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
    		         * @param {string} password The password.
    		         * @param {Object} cfg (Optional) The configuration options to use for this operation.
    		         *
    		         * @return {WordArray} The plaintext.
    		         *
    		         * @static
    		         *
    		         * @example
    		         *
    		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
    		         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
    		         */
    		        decrypt: function (cipher, ciphertext, password, cfg) {
    		            // Apply config defaults
    		            cfg = this.cfg.extend(cfg);
    	
    		            // Convert string to CipherParams
    		            ciphertext = this._parse(ciphertext, cfg.format);
    	
    		            // Derive key and other params
    		            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);
    	
    		            // Add IV to config
    		            cfg.iv = derivedParams.iv;
    	
    		            // Decrypt
    		            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
    	
    		            return plaintext;
    		        }
    		    });
    		}());
    	
    	
    	}));

    /***/ },
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var WordArray = C_lib.WordArray;
    		    var BlockCipher = C_lib.BlockCipher;
    		    var C_algo = C.algo;
    	
    		    // Permuted Choice 1 constants
    		    var PC1 = [
    		        57, 49, 41, 33, 25, 17, 9,  1,
    		        58, 50, 42, 34, 26, 18, 10, 2,
    		        59, 51, 43, 35, 27, 19, 11, 3,
    		        60, 52, 44, 36, 63, 55, 47, 39,
    		        31, 23, 15, 7,  62, 54, 46, 38,
    		        30, 22, 14, 6,  61, 53, 45, 37,
    		        29, 21, 13, 5,  28, 20, 12, 4
    		    ];
    	
    		    // Permuted Choice 2 constants
    		    var PC2 = [
    		        14, 17, 11, 24, 1,  5,
    		        3,  28, 15, 6,  21, 10,
    		        23, 19, 12, 4,  26, 8,
    		        16, 7,  27, 20, 13, 2,
    		        41, 52, 31, 37, 47, 55,
    		        30, 40, 51, 45, 33, 48,
    		        44, 49, 39, 56, 34, 53,
    		        46, 42, 50, 36, 29, 32
    		    ];
    	
    		    // Cumulative bit shift constants
    		    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
    	
    		    // SBOXes and round permutation constants
    		    var SBOX_P = [
    		        {
    		            0x0: 0x808200,
    		            0x10000000: 0x8000,
    		            0x20000000: 0x808002,
    		            0x30000000: 0x2,
    		            0x40000000: 0x200,
    		            0x50000000: 0x808202,
    		            0x60000000: 0x800202,
    		            0x70000000: 0x800000,
    		            0x80000000: 0x202,
    		            0x90000000: 0x800200,
    		            0xa0000000: 0x8200,
    		            0xb0000000: 0x808000,
    		            0xc0000000: 0x8002,
    		            0xd0000000: 0x800002,
    		            0xe0000000: 0x0,
    		            0xf0000000: 0x8202,
    		            0x8000000: 0x0,
    		            0x18000000: 0x808202,
    		            0x28000000: 0x8202,
    		            0x38000000: 0x8000,
    		            0x48000000: 0x808200,
    		            0x58000000: 0x200,
    		            0x68000000: 0x808002,
    		            0x78000000: 0x2,
    		            0x88000000: 0x800200,
    		            0x98000000: 0x8200,
    		            0xa8000000: 0x808000,
    		            0xb8000000: 0x800202,
    		            0xc8000000: 0x800002,
    		            0xd8000000: 0x8002,
    		            0xe8000000: 0x202,
    		            0xf8000000: 0x800000,
    		            0x1: 0x8000,
    		            0x10000001: 0x2,
    		            0x20000001: 0x808200,
    		            0x30000001: 0x800000,
    		            0x40000001: 0x808002,
    		            0x50000001: 0x8200,
    		            0x60000001: 0x200,
    		            0x70000001: 0x800202,
    		            0x80000001: 0x808202,
    		            0x90000001: 0x808000,
    		            0xa0000001: 0x800002,
    		            0xb0000001: 0x8202,
    		            0xc0000001: 0x202,
    		            0xd0000001: 0x800200,
    		            0xe0000001: 0x8002,
    		            0xf0000001: 0x0,
    		            0x8000001: 0x808202,
    		            0x18000001: 0x808000,
    		            0x28000001: 0x800000,
    		            0x38000001: 0x200,
    		            0x48000001: 0x8000,
    		            0x58000001: 0x800002,
    		            0x68000001: 0x2,
    		            0x78000001: 0x8202,
    		            0x88000001: 0x8002,
    		            0x98000001: 0x800202,
    		            0xa8000001: 0x202,
    		            0xb8000001: 0x808200,
    		            0xc8000001: 0x800200,
    		            0xd8000001: 0x0,
    		            0xe8000001: 0x8200,
    		            0xf8000001: 0x808002
    		        },
    		        {
    		            0x0: 0x40084010,
    		            0x1000000: 0x4000,
    		            0x2000000: 0x80000,
    		            0x3000000: 0x40080010,
    		            0x4000000: 0x40000010,
    		            0x5000000: 0x40084000,
    		            0x6000000: 0x40004000,
    		            0x7000000: 0x10,
    		            0x8000000: 0x84000,
    		            0x9000000: 0x40004010,
    		            0xa000000: 0x40000000,
    		            0xb000000: 0x84010,
    		            0xc000000: 0x80010,
    		            0xd000000: 0x0,
    		            0xe000000: 0x4010,
    		            0xf000000: 0x40080000,
    		            0x800000: 0x40004000,
    		            0x1800000: 0x84010,
    		            0x2800000: 0x10,
    		            0x3800000: 0x40004010,
    		            0x4800000: 0x40084010,
    		            0x5800000: 0x40000000,
    		            0x6800000: 0x80000,
    		            0x7800000: 0x40080010,
    		            0x8800000: 0x80010,
    		            0x9800000: 0x0,
    		            0xa800000: 0x4000,
    		            0xb800000: 0x40080000,
    		            0xc800000: 0x40000010,
    		            0xd800000: 0x84000,
    		            0xe800000: 0x40084000,
    		            0xf800000: 0x4010,
    		            0x10000000: 0x0,
    		            0x11000000: 0x40080010,
    		            0x12000000: 0x40004010,
    		            0x13000000: 0x40084000,
    		            0x14000000: 0x40080000,
    		            0x15000000: 0x10,
    		            0x16000000: 0x84010,
    		            0x17000000: 0x4000,
    		            0x18000000: 0x4010,
    		            0x19000000: 0x80000,
    		            0x1a000000: 0x80010,
    		            0x1b000000: 0x40000010,
    		            0x1c000000: 0x84000,
    		            0x1d000000: 0x40004000,
    		            0x1e000000: 0x40000000,
    		            0x1f000000: 0x40084010,
    		            0x10800000: 0x84010,
    		            0x11800000: 0x80000,
    		            0x12800000: 0x40080000,
    		            0x13800000: 0x4000,
    		            0x14800000: 0x40004000,
    		            0x15800000: 0x40084010,
    		            0x16800000: 0x10,
    		            0x17800000: 0x40000000,
    		            0x18800000: 0x40084000,
    		            0x19800000: 0x40000010,
    		            0x1a800000: 0x40004010,
    		            0x1b800000: 0x80010,
    		            0x1c800000: 0x0,
    		            0x1d800000: 0x4010,
    		            0x1e800000: 0x40080010,
    		            0x1f800000: 0x84000
    		        },
    		        {
    		            0x0: 0x104,
    		            0x100000: 0x0,
    		            0x200000: 0x4000100,
    		            0x300000: 0x10104,
    		            0x400000: 0x10004,
    		            0x500000: 0x4000004,
    		            0x600000: 0x4010104,
    		            0x700000: 0x4010000,
    		            0x800000: 0x4000000,
    		            0x900000: 0x4010100,
    		            0xa00000: 0x10100,
    		            0xb00000: 0x4010004,
    		            0xc00000: 0x4000104,
    		            0xd00000: 0x10000,
    		            0xe00000: 0x4,
    		            0xf00000: 0x100,
    		            0x80000: 0x4010100,
    		            0x180000: 0x4010004,
    		            0x280000: 0x0,
    		            0x380000: 0x4000100,
    		            0x480000: 0x4000004,
    		            0x580000: 0x10000,
    		            0x680000: 0x10004,
    		            0x780000: 0x104,
    		            0x880000: 0x4,
    		            0x980000: 0x100,
    		            0xa80000: 0x4010000,
    		            0xb80000: 0x10104,
    		            0xc80000: 0x10100,
    		            0xd80000: 0x4000104,
    		            0xe80000: 0x4010104,
    		            0xf80000: 0x4000000,
    		            0x1000000: 0x4010100,
    		            0x1100000: 0x10004,
    		            0x1200000: 0x10000,
    		            0x1300000: 0x4000100,
    		            0x1400000: 0x100,
    		            0x1500000: 0x4010104,
    		            0x1600000: 0x4000004,
    		            0x1700000: 0x0,
    		            0x1800000: 0x4000104,
    		            0x1900000: 0x4000000,
    		            0x1a00000: 0x4,
    		            0x1b00000: 0x10100,
    		            0x1c00000: 0x4010000,
    		            0x1d00000: 0x104,
    		            0x1e00000: 0x10104,
    		            0x1f00000: 0x4010004,
    		            0x1080000: 0x4000000,
    		            0x1180000: 0x104,
    		            0x1280000: 0x4010100,
    		            0x1380000: 0x0,
    		            0x1480000: 0x10004,
    		            0x1580000: 0x4000100,
    		            0x1680000: 0x100,
    		            0x1780000: 0x4010004,
    		            0x1880000: 0x10000,
    		            0x1980000: 0x4010104,
    		            0x1a80000: 0x10104,
    		            0x1b80000: 0x4000004,
    		            0x1c80000: 0x4000104,
    		            0x1d80000: 0x4010000,
    		            0x1e80000: 0x4,
    		            0x1f80000: 0x10100
    		        },
    		        {
    		            0x0: 0x80401000,
    		            0x10000: 0x80001040,
    		            0x20000: 0x401040,
    		            0x30000: 0x80400000,
    		            0x40000: 0x0,
    		            0x50000: 0x401000,
    		            0x60000: 0x80000040,
    		            0x70000: 0x400040,
    		            0x80000: 0x80000000,
    		            0x90000: 0x400000,
    		            0xa0000: 0x40,
    		            0xb0000: 0x80001000,
    		            0xc0000: 0x80400040,
    		            0xd0000: 0x1040,
    		            0xe0000: 0x1000,
    		            0xf0000: 0x80401040,
    		            0x8000: 0x80001040,
    		            0x18000: 0x40,
    		            0x28000: 0x80400040,
    		            0x38000: 0x80001000,
    		            0x48000: 0x401000,
    		            0x58000: 0x80401040,
    		            0x68000: 0x0,
    		            0x78000: 0x80400000,
    		            0x88000: 0x1000,
    		            0x98000: 0x80401000,
    		            0xa8000: 0x400000,
    		            0xb8000: 0x1040,
    		            0xc8000: 0x80000000,
    		            0xd8000: 0x400040,
    		            0xe8000: 0x401040,
    		            0xf8000: 0x80000040,
    		            0x100000: 0x400040,
    		            0x110000: 0x401000,
    		            0x120000: 0x80000040,
    		            0x130000: 0x0,
    		            0x140000: 0x1040,
    		            0x150000: 0x80400040,
    		            0x160000: 0x80401000,
    		            0x170000: 0x80001040,
    		            0x180000: 0x80401040,
    		            0x190000: 0x80000000,
    		            0x1a0000: 0x80400000,
    		            0x1b0000: 0x401040,
    		            0x1c0000: 0x80001000,
    		            0x1d0000: 0x400000,
    		            0x1e0000: 0x40,
    		            0x1f0000: 0x1000,
    		            0x108000: 0x80400000,
    		            0x118000: 0x80401040,
    		            0x128000: 0x0,
    		            0x138000: 0x401000,
    		            0x148000: 0x400040,
    		            0x158000: 0x80000000,
    		            0x168000: 0x80001040,
    		            0x178000: 0x40,
    		            0x188000: 0x80000040,
    		            0x198000: 0x1000,
    		            0x1a8000: 0x80001000,
    		            0x1b8000: 0x80400040,
    		            0x1c8000: 0x1040,
    		            0x1d8000: 0x80401000,
    		            0x1e8000: 0x400000,
    		            0x1f8000: 0x401040
    		        },
    		        {
    		            0x0: 0x80,
    		            0x1000: 0x1040000,
    		            0x2000: 0x40000,
    		            0x3000: 0x20000000,
    		            0x4000: 0x20040080,
    		            0x5000: 0x1000080,
    		            0x6000: 0x21000080,
    		            0x7000: 0x40080,
    		            0x8000: 0x1000000,
    		            0x9000: 0x20040000,
    		            0xa000: 0x20000080,
    		            0xb000: 0x21040080,
    		            0xc000: 0x21040000,
    		            0xd000: 0x0,
    		            0xe000: 0x1040080,
    		            0xf000: 0x21000000,
    		            0x800: 0x1040080,
    		            0x1800: 0x21000080,
    		            0x2800: 0x80,
    		            0x3800: 0x1040000,
    		            0x4800: 0x40000,
    		            0x5800: 0x20040080,
    		            0x6800: 0x21040000,
    		            0x7800: 0x20000000,
    		            0x8800: 0x20040000,
    		            0x9800: 0x0,
    		            0xa800: 0x21040080,
    		            0xb800: 0x1000080,
    		            0xc800: 0x20000080,
    		            0xd800: 0x21000000,
    		            0xe800: 0x1000000,
    		            0xf800: 0x40080,
    		            0x10000: 0x40000,
    		            0x11000: 0x80,
    		            0x12000: 0x20000000,
    		            0x13000: 0x21000080,
    		            0x14000: 0x1000080,
    		            0x15000: 0x21040000,
    		            0x16000: 0x20040080,
    		            0x17000: 0x1000000,
    		            0x18000: 0x21040080,
    		            0x19000: 0x21000000,
    		            0x1a000: 0x1040000,
    		            0x1b000: 0x20040000,
    		            0x1c000: 0x40080,
    		            0x1d000: 0x20000080,
    		            0x1e000: 0x0,
    		            0x1f000: 0x1040080,
    		            0x10800: 0x21000080,
    		            0x11800: 0x1000000,
    		            0x12800: 0x1040000,
    		            0x13800: 0x20040080,
    		            0x14800: 0x20000000,
    		            0x15800: 0x1040080,
    		            0x16800: 0x80,
    		            0x17800: 0x21040000,
    		            0x18800: 0x40080,
    		            0x19800: 0x21040080,
    		            0x1a800: 0x0,
    		            0x1b800: 0x21000000,
    		            0x1c800: 0x1000080,
    		            0x1d800: 0x40000,
    		            0x1e800: 0x20040000,
    		            0x1f800: 0x20000080
    		        },
    		        {
    		            0x0: 0x10000008,
    		            0x100: 0x2000,
    		            0x200: 0x10200000,
    		            0x300: 0x10202008,
    		            0x400: 0x10002000,
    		            0x500: 0x200000,
    		            0x600: 0x200008,
    		            0x700: 0x10000000,
    		            0x800: 0x0,
    		            0x900: 0x10002008,
    		            0xa00: 0x202000,
    		            0xb00: 0x8,
    		            0xc00: 0x10200008,
    		            0xd00: 0x202008,
    		            0xe00: 0x2008,
    		            0xf00: 0x10202000,
    		            0x80: 0x10200000,
    		            0x180: 0x10202008,
    		            0x280: 0x8,
    		            0x380: 0x200000,
    		            0x480: 0x202008,
    		            0x580: 0x10000008,
    		            0x680: 0x10002000,
    		            0x780: 0x2008,
    		            0x880: 0x200008,
    		            0x980: 0x2000,
    		            0xa80: 0x10002008,
    		            0xb80: 0x10200008,
    		            0xc80: 0x0,
    		            0xd80: 0x10202000,
    		            0xe80: 0x202000,
    		            0xf80: 0x10000000,
    		            0x1000: 0x10002000,
    		            0x1100: 0x10200008,
    		            0x1200: 0x10202008,
    		            0x1300: 0x2008,
    		            0x1400: 0x200000,
    		            0x1500: 0x10000000,
    		            0x1600: 0x10000008,
    		            0x1700: 0x202000,
    		            0x1800: 0x202008,
    		            0x1900: 0x0,
    		            0x1a00: 0x8,
    		            0x1b00: 0x10200000,
    		            0x1c00: 0x2000,
    		            0x1d00: 0x10002008,
    		            0x1e00: 0x10202000,
    		            0x1f00: 0x200008,
    		            0x1080: 0x8,
    		            0x1180: 0x202000,
    		            0x1280: 0x200000,
    		            0x1380: 0x10000008,
    		            0x1480: 0x10002000,
    		            0x1580: 0x2008,
    		            0x1680: 0x10202008,
    		            0x1780: 0x10200000,
    		            0x1880: 0x10202000,
    		            0x1980: 0x10200008,
    		            0x1a80: 0x2000,
    		            0x1b80: 0x202008,
    		            0x1c80: 0x200008,
    		            0x1d80: 0x0,
    		            0x1e80: 0x10000000,
    		            0x1f80: 0x10002008
    		        },
    		        {
    		            0x0: 0x100000,
    		            0x10: 0x2000401,
    		            0x20: 0x400,
    		            0x30: 0x100401,
    		            0x40: 0x2100401,
    		            0x50: 0x0,
    		            0x60: 0x1,
    		            0x70: 0x2100001,
    		            0x80: 0x2000400,
    		            0x90: 0x100001,
    		            0xa0: 0x2000001,
    		            0xb0: 0x2100400,
    		            0xc0: 0x2100000,
    		            0xd0: 0x401,
    		            0xe0: 0x100400,
    		            0xf0: 0x2000000,
    		            0x8: 0x2100001,
    		            0x18: 0x0,
    		            0x28: 0x2000401,
    		            0x38: 0x2100400,
    		            0x48: 0x100000,
    		            0x58: 0x2000001,
    		            0x68: 0x2000000,
    		            0x78: 0x401,
    		            0x88: 0x100401,
    		            0x98: 0x2000400,
    		            0xa8: 0x2100000,
    		            0xb8: 0x100001,
    		            0xc8: 0x400,
    		            0xd8: 0x2100401,
    		            0xe8: 0x1,
    		            0xf8: 0x100400,
    		            0x100: 0x2000000,
    		            0x110: 0x100000,
    		            0x120: 0x2000401,
    		            0x130: 0x2100001,
    		            0x140: 0x100001,
    		            0x150: 0x2000400,
    		            0x160: 0x2100400,
    		            0x170: 0x100401,
    		            0x180: 0x401,
    		            0x190: 0x2100401,
    		            0x1a0: 0x100400,
    		            0x1b0: 0x1,
    		            0x1c0: 0x0,
    		            0x1d0: 0x2100000,
    		            0x1e0: 0x2000001,
    		            0x1f0: 0x400,
    		            0x108: 0x100400,
    		            0x118: 0x2000401,
    		            0x128: 0x2100001,
    		            0x138: 0x1,
    		            0x148: 0x2000000,
    		            0x158: 0x100000,
    		            0x168: 0x401,
    		            0x178: 0x2100400,
    		            0x188: 0x2000001,
    		            0x198: 0x2100000,
    		            0x1a8: 0x0,
    		            0x1b8: 0x2100401,
    		            0x1c8: 0x100401,
    		            0x1d8: 0x400,
    		            0x1e8: 0x2000400,
    		            0x1f8: 0x100001
    		        },
    		        {
    		            0x0: 0x8000820,
    		            0x1: 0x20000,
    		            0x2: 0x8000000,
    		            0x3: 0x20,
    		            0x4: 0x20020,
    		            0x5: 0x8020820,
    		            0x6: 0x8020800,
    		            0x7: 0x800,
    		            0x8: 0x8020000,
    		            0x9: 0x8000800,
    		            0xa: 0x20800,
    		            0xb: 0x8020020,
    		            0xc: 0x820,
    		            0xd: 0x0,
    		            0xe: 0x8000020,
    		            0xf: 0x20820,
    		            0x80000000: 0x800,
    		            0x80000001: 0x8020820,
    		            0x80000002: 0x8000820,
    		            0x80000003: 0x8000000,
    		            0x80000004: 0x8020000,
    		            0x80000005: 0x20800,
    		            0x80000006: 0x20820,
    		            0x80000007: 0x20,
    		            0x80000008: 0x8000020,
    		            0x80000009: 0x820,
    		            0x8000000a: 0x20020,
    		            0x8000000b: 0x8020800,
    		            0x8000000c: 0x0,
    		            0x8000000d: 0x8020020,
    		            0x8000000e: 0x8000800,
    		            0x8000000f: 0x20000,
    		            0x10: 0x20820,
    		            0x11: 0x8020800,
    		            0x12: 0x20,
    		            0x13: 0x800,
    		            0x14: 0x8000800,
    		            0x15: 0x8000020,
    		            0x16: 0x8020020,
    		            0x17: 0x20000,
    		            0x18: 0x0,
    		            0x19: 0x20020,
    		            0x1a: 0x8020000,
    		            0x1b: 0x8000820,
    		            0x1c: 0x8020820,
    		            0x1d: 0x20800,
    		            0x1e: 0x820,
    		            0x1f: 0x8000000,
    		            0x80000010: 0x20000,
    		            0x80000011: 0x800,
    		            0x80000012: 0x8020020,
    		            0x80000013: 0x20820,
    		            0x80000014: 0x20,
    		            0x80000015: 0x8020000,
    		            0x80000016: 0x8000000,
    		            0x80000017: 0x8000820,
    		            0x80000018: 0x8020820,
    		            0x80000019: 0x8000020,
    		            0x8000001a: 0x8000800,
    		            0x8000001b: 0x0,
    		            0x8000001c: 0x20800,
    		            0x8000001d: 0x820,
    		            0x8000001e: 0x20020,
    		            0x8000001f: 0x8020800
    		        }
    		    ];
    	
    		    // Masks that select the SBOX input
    		    var SBOX_MASK = [
    		        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
    		        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
    		    ];
    	
    		    /**
    		     * DES block cipher algorithm.
    		     */
    		    var DES = C_algo.DES = BlockCipher.extend({
    		        _doReset: function () {
    		            // Shortcuts
    		            var key = this._key;
    		            var keyWords = key.words;
    	
    		            // Select 56 bits according to PC1
    		            var keyBits = [];
    		            for (var i = 0; i < 56; i++) {
    		                var keyBitPos = PC1[i] - 1;
    		                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
    		            }
    	
    		            // Assemble 16 subkeys
    		            var subKeys = this._subKeys = [];
    		            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
    		                // Create subkey
    		                var subKey = subKeys[nSubKey] = [];
    	
    		                // Shortcut
    		                var bitShift = BIT_SHIFTS[nSubKey];
    	
    		                // Select 48 bits according to PC2
    		                for (var i = 0; i < 24; i++) {
    		                    // Select from the left 28 key bits
    		                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);
    	
    		                    // Select from the right 28 key bits
    		                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
    		                }
    	
    		                // Since each subkey is applied to an expanded 32-bit input,
    		                // the subkey can be broken into 8 values scaled to 32-bits,
    		                // which allows the key to be used without expansion
    		                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
    		                for (var i = 1; i < 7; i++) {
    		                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
    		                }
    		                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
    		            }
    	
    		            // Compute inverse subkeys
    		            var invSubKeys = this._invSubKeys = [];
    		            for (var i = 0; i < 16; i++) {
    		                invSubKeys[i] = subKeys[15 - i];
    		            }
    		        },
    	
    		        encryptBlock: function (M, offset) {
    		            this._doCryptBlock(M, offset, this._subKeys);
    		        },
    	
    		        decryptBlock: function (M, offset) {
    		            this._doCryptBlock(M, offset, this._invSubKeys);
    		        },
    	
    		        _doCryptBlock: function (M, offset, subKeys) {
    		            // Get input
    		            this._lBlock = M[offset];
    		            this._rBlock = M[offset + 1];
    	
    		            // Initial permutation
    		            exchangeLR.call(this, 4,  0x0f0f0f0f);
    		            exchangeLR.call(this, 16, 0x0000ffff);
    		            exchangeRL.call(this, 2,  0x33333333);
    		            exchangeRL.call(this, 8,  0x00ff00ff);
    		            exchangeLR.call(this, 1,  0x55555555);
    	
    		            // Rounds
    		            for (var round = 0; round < 16; round++) {
    		                // Shortcuts
    		                var subKey = subKeys[round];
    		                var lBlock = this._lBlock;
    		                var rBlock = this._rBlock;
    	
    		                // Feistel function
    		                var f = 0;
    		                for (var i = 0; i < 8; i++) {
    		                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
    		                }
    		                this._lBlock = rBlock;
    		                this._rBlock = lBlock ^ f;
    		            }
    	
    		            // Undo swap from last round
    		            var t = this._lBlock;
    		            this._lBlock = this._rBlock;
    		            this._rBlock = t;
    	
    		            // Final permutation
    		            exchangeLR.call(this, 1,  0x55555555);
    		            exchangeRL.call(this, 8,  0x00ff00ff);
    		            exchangeRL.call(this, 2,  0x33333333);
    		            exchangeLR.call(this, 16, 0x0000ffff);
    		            exchangeLR.call(this, 4,  0x0f0f0f0f);
    	
    		            // Set output
    		            M[offset] = this._lBlock;
    		            M[offset + 1] = this._rBlock;
    		        },
    	
    		        keySize: 64/32,
    	
    		        ivSize: 64/32,
    	
    		        blockSize: 64/32
    		    });
    	
    		    // Swap bits across the left and right words
    		    function exchangeLR(offset, mask) {
    		        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
    		        this._rBlock ^= t;
    		        this._lBlock ^= t << offset;
    		    }
    	
    		    function exchangeRL(offset, mask) {
    		        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
    		        this._lBlock ^= t;
    		        this._rBlock ^= t << offset;
    		    }
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
    		     */
    		    C.DES = BlockCipher._createHelper(DES);
    	
    		    /**
    		     * Triple-DES block cipher algorithm.
    		     */
    		    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
    		        _doReset: function () {
    		            // Shortcuts
    		            var key = this._key;
    		            var keyWords = key.words;
    	
    		            // Create DES instances
    		            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
    		            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
    		            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
    		        },
    	
    		        encryptBlock: function (M, offset) {
    		            this._des1.encryptBlock(M, offset);
    		            this._des2.decryptBlock(M, offset);
    		            this._des3.encryptBlock(M, offset);
    		        },
    	
    		        decryptBlock: function (M, offset) {
    		            this._des3.decryptBlock(M, offset);
    		            this._des2.encryptBlock(M, offset);
    		            this._des1.decryptBlock(M, offset);
    		        },
    	
    		        keySize: 192/32,
    	
    		        ivSize: 64/32,
    	
    		        blockSize: 64/32
    		    });
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
    		     */
    		    C.TripleDES = BlockCipher._createHelper(TripleDES);
    		}());
    	
    	
    		return CryptoJS.TripleDES;
    	
    	}));

    /***/ },
    /* 17 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var StreamCipher = C_lib.StreamCipher;
    		    var C_algo = C.algo;
    	
    		    // Reusable objects
    		    var S  = [];
    		    var C_ = [];
    		    var G  = [];
    	
    		    /**
    		     * Rabbit stream cipher algorithm
    		     */
    		    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
    		        _doReset: function () {
    		            // Shortcuts
    		            var K = this._key.words;
    		            var iv = this.cfg.iv;
    	
    		            // Swap endian
    		            for (var i = 0; i < 4; i++) {
    		                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
    		                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
    		            }
    	
    		            // Generate initial state values
    		            var X = this._X = [
    		                K[0], (K[3] << 16) | (K[2] >>> 16),
    		                K[1], (K[0] << 16) | (K[3] >>> 16),
    		                K[2], (K[1] << 16) | (K[0] >>> 16),
    		                K[3], (K[2] << 16) | (K[1] >>> 16)
    		            ];
    	
    		            // Generate initial counter values
    		            var C = this._C = [
    		                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
    		                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
    		                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
    		                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
    		            ];
    	
    		            // Carry bit
    		            this._b = 0;
    	
    		            // Iterate the system four times
    		            for (var i = 0; i < 4; i++) {
    		                nextState.call(this);
    		            }
    	
    		            // Modify the counters
    		            for (var i = 0; i < 8; i++) {
    		                C[i] ^= X[(i + 4) & 7];
    		            }
    	
    		            // IV setup
    		            if (iv) {
    		                // Shortcuts
    		                var IV = iv.words;
    		                var IV_0 = IV[0];
    		                var IV_1 = IV[1];
    	
    		                // Generate four subvectors
    		                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
    		                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
    		                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
    		                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);
    	
    		                // Modify counter values
    		                C[0] ^= i0;
    		                C[1] ^= i1;
    		                C[2] ^= i2;
    		                C[3] ^= i3;
    		                C[4] ^= i0;
    		                C[5] ^= i1;
    		                C[6] ^= i2;
    		                C[7] ^= i3;
    	
    		                // Iterate the system four times
    		                for (var i = 0; i < 4; i++) {
    		                    nextState.call(this);
    		                }
    		            }
    		        },
    	
    		        _doProcessBlock: function (M, offset) {
    		            // Shortcut
    		            var X = this._X;
    	
    		            // Iterate the system
    		            nextState.call(this);
    	
    		            // Generate four keystream words
    		            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
    		            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
    		            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
    		            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);
    	
    		            for (var i = 0; i < 4; i++) {
    		                // Swap endian
    		                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
    		                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);
    	
    		                // Encrypt
    		                M[offset + i] ^= S[i];
    		            }
    		        },
    	
    		        blockSize: 128/32,
    	
    		        ivSize: 64/32
    		    });
    	
    		    function nextState() {
    		        // Shortcuts
    		        var X = this._X;
    		        var C = this._C;
    	
    		        // Save old counter values
    		        for (var i = 0; i < 8; i++) {
    		            C_[i] = C[i];
    		        }
    	
    		        // Calculate new counter values
    		        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
    		        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
    		        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
    		        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
    		        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
    		        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
    		        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
    		        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
    		        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;
    	
    		        // Calculate the g-values
    		        for (var i = 0; i < 8; i++) {
    		            var gx = X[i] + C[i];
    	
    		            // Construct high and low argument for squaring
    		            var ga = gx & 0xffff;
    		            var gb = gx >>> 16;
    	
    		            // Calculate high and low result of squaring
    		            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
    		            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);
    	
    		            // High XOR low
    		            G[i] = gh ^ gl;
    		        }
    	
    		        // Calculate new state values
    		        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
    		        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
    		        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
    		        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
    		        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
    		        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
    		        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
    		        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
    		    }
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
    		     */
    		    C.Rabbit = StreamCipher._createHelper(Rabbit);
    		}());
    	
    	
    		return CryptoJS.Rabbit;
    	
    	}));

    /***/ },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
    (function (root, factory, undef) {
    		{
    			// CommonJS
    			module.exports = factory(__webpack_require__(5), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15));
    		}
    	}(this, function (CryptoJS) {
    	
    		(function () {
    		    // Shortcuts
    		    var C = CryptoJS;
    		    var C_lib = C.lib;
    		    var StreamCipher = C_lib.StreamCipher;
    		    var C_algo = C.algo;
    	
    		    /**
    		     * RC4 stream cipher algorithm.
    		     */
    		    var RC4 = C_algo.RC4 = StreamCipher.extend({
    		        _doReset: function () {
    		            // Shortcuts
    		            var key = this._key;
    		            var keyWords = key.words;
    		            var keySigBytes = key.sigBytes;
    	
    		            // Init sbox
    		            var S = this._S = [];
    		            for (var i = 0; i < 256; i++) {
    		                S[i] = i;
    		            }
    	
    		            // Key setup
    		            for (var i = 0, j = 0; i < 256; i++) {
    		                var keyByteIndex = i % keySigBytes;
    		                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;
    	
    		                j = (j + S[i] + keyByte) % 256;
    	
    		                // Swap
    		                var t = S[i];
    		                S[i] = S[j];
    		                S[j] = t;
    		            }
    	
    		            // Counters
    		            this._i = this._j = 0;
    		        },
    	
    		        _doProcessBlock: function (M, offset) {
    		            M[offset] ^= generateKeystreamWord.call(this);
    		        },
    	
    		        keySize: 256/32,
    	
    		        ivSize: 0
    		    });
    	
    		    function generateKeystreamWord() {
    		        // Shortcuts
    		        var S = this._S;
    		        var i = this._i;
    		        var j = this._j;
    	
    		        // Generate keystream word
    		        var keystreamWord = 0;
    		        for (var n = 0; n < 4; n++) {
    		            i = (i + 1) % 256;
    		            j = (j + S[i]) % 256;
    	
    		            // Swap
    		            var t = S[i];
    		            S[i] = S[j];
    		            S[j] = t;
    	
    		            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
    		        }
    	
    		        // Update counters
    		        this._i = i;
    		        this._j = j;
    	
    		        return keystreamWord;
    		    }
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
    		     */
    		    C.RC4 = StreamCipher._createHelper(RC4);
    	
    		    /**
    		     * Modified RC4 stream cipher algorithm.
    		     */
    		    var RC4Drop = C_algo.RC4Drop = RC4.extend({
    		        /**
    		         * Configuration options.
    		         *
    		         * @property {number} drop The number of keystream words to drop. Default 192
    		         */
    		        cfg: RC4.cfg.extend({
    		            drop: 192
    		        }),
    	
    		        _doReset: function () {
    		            RC4._doReset.call(this);
    	
    		            // Drop
    		            for (var i = this.cfg.drop; i > 0; i--) {
    		                generateKeystreamWord.call(this);
    		            }
    		        }
    		    });
    	
    		    /**
    		     * Shortcut functions to the cipher's object interface.
    		     *
    		     * @example
    		     *
    		     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
    		     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
    		     */
    		    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
    		}());
    	
    	
    		return CryptoJS.RC4;
    	
    	}));

    /***/ }
    /******/ ])
    });

    });

    var SecureLS = /*@__PURE__*/getDefaultExportFromCjs(secureLs);

    const secureStorage = new SecureLS({ encodingType: 'aes' });

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.CanceledError = CanceledError_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;
    axios$1.toFormData = toFormData_1;

    // Expose AxiosError class
    axios$1.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios$1.Cancel = axios$1.CanceledError;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    function tokenAuthHeader(token) {
        return {
            'Authorization': 'Bearer ' + token
        };
    }

    const writeServer = 'http://localhost:8082';
    const auth = writeServer + '/api/auth';
    const users = writeServer + '/api/users';
    const topics = writeServer + '/api/topics';
    const subscribe = topics + '/subscribe';
    const unsubscribe = topics + '/unsubscribe';
    const readServer = 'http://localhost:8081';
    const messages$1 = readServer + '/api/messages';
    const messageStream = messages$1 + '/stream';
    const messageSend = writeServer + '/api/messages';

    var AuthApi;
    (function (AuthApi) {
        async function login(username, password) {
            return axios.post(auth, {
                username, password
            }).then((res) => {
                return res.data;
            });
        }
        AuthApi.login = login;
        async function logout(refreshToken) {
            return axios.put(auth + '/logout', {}, {
                headers: Object.assign({}, tokenAuthHeader(refreshToken))
            })
                .then((_) => true)
                .catch((_) => false);
        }
        AuthApi.logout = logout;
        async function refresh(refreshToken) {
            return axios.post(auth + '/refresh', {}, {
                headers: Object.assign({}, tokenAuthHeader(refreshToken))
            }).then((res) => res.data)
                .catch((err) => {
                console.log(err);
                return "";
            });
        }
        AuthApi.refresh = refresh;
    })(AuthApi || (AuthApi = {}));

    class Message {
        constructor(id = "", content = "", to = "", from = "", timestamp = new Date(0)) {
            this._sentAt = undefined;
            this._sentAt = undefined;
        }
    }

    function formatDate(date) {
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /** @license
     * eventsource.js
     * Available under MIT License (MIT)
     * https://github.com/Yaffle/EventSource/
     */

    var eventsource = createCommonjsModule(function (module, exports) {
    /*jslint indent: 2, vars: true, plusplus: true */
    /*global setTimeout, clearTimeout */

    (function (global) {

      var setTimeout = global.setTimeout;
      var clearTimeout = global.clearTimeout;
      var XMLHttpRequest = global.XMLHttpRequest;
      var XDomainRequest = global.XDomainRequest;
      var ActiveXObject = global.ActiveXObject;
      var NativeEventSource = global.EventSource;

      var document = global.document;
      var Promise = global.Promise;
      var fetch = global.fetch;
      var Response = global.Response;
      var TextDecoder = global.TextDecoder;
      var TextEncoder = global.TextEncoder;
      var AbortController = global.AbortController;

      if (typeof window !== "undefined" && typeof document !== "undefined" && !("readyState" in document) && document.body == null) { // Firefox 2
        document.readyState = "loading";
        window.addEventListener("load", function (event) {
          document.readyState = "complete";
        }, false);
      }

      if (XMLHttpRequest == null && ActiveXObject != null) { // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest_in_IE6
        XMLHttpRequest = function () {
          return new ActiveXObject("Microsoft.XMLHTTP");
        };
      }

      if (Object.create == undefined) {
        Object.create = function (C) {
          function F(){}
          F.prototype = C;
          return new F();
        };
      }

      if (!Date.now) {
        Date.now = function now() {
          return new Date().getTime();
        };
      }

      // see #118 (Promise#finally with polyfilled Promise)
      // see #123 (data URLs crash Edge)
      // see #125 (CSP violations)
      // see pull/#138
      // => No way to polyfill Promise#finally

      if (AbortController == undefined) {
        var originalFetch2 = fetch;
        fetch = function (url, options) {
          var signal = options.signal;
          return originalFetch2(url, {headers: options.headers, credentials: options.credentials, cache: options.cache}).then(function (response) {
            var reader = response.body.getReader();
            signal._reader = reader;
            if (signal._aborted) {
              signal._reader.cancel();
            }
            return {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              body: {
                getReader: function () {
                  return reader;
                }
              }
            };
          });
        };
        AbortController = function () {
          this.signal = {
            _reader: null,
            _aborted: false
          };
          this.abort = function () {
            if (this.signal._reader != null) {
              this.signal._reader.cancel();
            }
            this.signal._aborted = true;
          };
        };
      }

      function TextDecoderPolyfill() {
        this.bitsNeeded = 0;
        this.codePoint = 0;
      }

      TextDecoderPolyfill.prototype.decode = function (octets) {
        function valid(codePoint, shift, octetsCount) {
          if (octetsCount === 1) {
            return codePoint >= 0x0080 >> shift && codePoint << shift <= 0x07FF;
          }
          if (octetsCount === 2) {
            return codePoint >= 0x0800 >> shift && codePoint << shift <= 0xD7FF || codePoint >= 0xE000 >> shift && codePoint << shift <= 0xFFFF;
          }
          if (octetsCount === 3) {
            return codePoint >= 0x010000 >> shift && codePoint << shift <= 0x10FFFF;
          }
          throw new Error();
        }
        function octetsCount(bitsNeeded, codePoint) {
          if (bitsNeeded === 6 * 1) {
            return codePoint >> 6 > 15 ? 3 : codePoint > 31 ? 2 : 1;
          }
          if (bitsNeeded === 6 * 2) {
            return codePoint > 15 ? 3 : 2;
          }
          if (bitsNeeded === 6 * 3) {
            return 3;
          }
          throw new Error();
        }
        var REPLACER = 0xFFFD;
        var string = "";
        var bitsNeeded = this.bitsNeeded;
        var codePoint = this.codePoint;
        for (var i = 0; i < octets.length; i += 1) {
          var octet = octets[i];
          if (bitsNeeded !== 0) {
            if (octet < 128 || octet > 191 || !valid(codePoint << 6 | octet & 63, bitsNeeded - 6, octetsCount(bitsNeeded, codePoint))) {
              bitsNeeded = 0;
              codePoint = REPLACER;
              string += String.fromCharCode(codePoint);
            }
          }
          if (bitsNeeded === 0) {
            if (octet >= 0 && octet <= 127) {
              bitsNeeded = 0;
              codePoint = octet;
            } else if (octet >= 192 && octet <= 223) {
              bitsNeeded = 6 * 1;
              codePoint = octet & 31;
            } else if (octet >= 224 && octet <= 239) {
              bitsNeeded = 6 * 2;
              codePoint = octet & 15;
            } else if (octet >= 240 && octet <= 247) {
              bitsNeeded = 6 * 3;
              codePoint = octet & 7;
            } else {
              bitsNeeded = 0;
              codePoint = REPLACER;
            }
            if (bitsNeeded !== 0 && !valid(codePoint, bitsNeeded, octetsCount(bitsNeeded, codePoint))) {
              bitsNeeded = 0;
              codePoint = REPLACER;
            }
          } else {
            bitsNeeded -= 6;
            codePoint = codePoint << 6 | octet & 63;
          }
          if (bitsNeeded === 0) {
            if (codePoint <= 0xFFFF) {
              string += String.fromCharCode(codePoint);
            } else {
              string += String.fromCharCode(0xD800 + (codePoint - 0xFFFF - 1 >> 10));
              string += String.fromCharCode(0xDC00 + (codePoint - 0xFFFF - 1 & 0x3FF));
            }
          }
        }
        this.bitsNeeded = bitsNeeded;
        this.codePoint = codePoint;
        return string;
      };

      // Firefox < 38 throws an error with stream option
      var supportsStreamOption = function () {
        try {
          return new TextDecoder().decode(new TextEncoder().encode("test"), {stream: true}) === "test";
        } catch (error) {
          console.debug("TextDecoder does not support streaming option. Using polyfill instead: " + error);
        }
        return false;
      };

      // IE, Edge
      if (TextDecoder == undefined || TextEncoder == undefined || !supportsStreamOption()) {
        TextDecoder = TextDecoderPolyfill;
      }

      var k = function () {
      };

      function XHRWrapper(xhr) {
        this.withCredentials = false;
        this.readyState = 0;
        this.status = 0;
        this.statusText = "";
        this.responseText = "";
        this.onprogress = k;
        this.onload = k;
        this.onerror = k;
        this.onreadystatechange = k;
        this._contentType = "";
        this._xhr = xhr;
        this._sendTimeout = 0;
        this._abort = k;
      }

      XHRWrapper.prototype.open = function (method, url) {
        this._abort(true);

        var that = this;
        var xhr = this._xhr;
        var state = 1;
        var timeout = 0;

        this._abort = function (silent) {
          if (that._sendTimeout !== 0) {
            clearTimeout(that._sendTimeout);
            that._sendTimeout = 0;
          }
          if (state === 1 || state === 2 || state === 3) {
            state = 4;
            xhr.onload = k;
            xhr.onerror = k;
            xhr.onabort = k;
            xhr.onprogress = k;
            xhr.onreadystatechange = k;
            // IE 8 - 9: XDomainRequest#abort() does not fire any event
            // Opera < 10: XMLHttpRequest#abort() does not fire any event
            xhr.abort();
            if (timeout !== 0) {
              clearTimeout(timeout);
              timeout = 0;
            }
            if (!silent) {
              that.readyState = 4;
              that.onabort(null);
              that.onreadystatechange();
            }
          }
          state = 0;
        };

        var onStart = function () {
          if (state === 1) {
            //state = 2;
            var status = 0;
            var statusText = "";
            var contentType = undefined;
            if (!("contentType" in xhr)) {
              try {
                status = xhr.status;
                statusText = xhr.statusText;
                contentType = xhr.getResponseHeader("Content-Type");
              } catch (error) {
                // IE < 10 throws exception for `xhr.status` when xhr.readyState === 2 || xhr.readyState === 3
                // Opera < 11 throws exception for `xhr.status` when xhr.readyState === 2
                // https://bugs.webkit.org/show_bug.cgi?id=29121
                status = 0;
                statusText = "";
                contentType = undefined;
                // Firefox < 14, Chrome ?, Safari ?
                // https://bugs.webkit.org/show_bug.cgi?id=29658
                // https://bugs.webkit.org/show_bug.cgi?id=77854
              }
            } else {
              status = 200;
              statusText = "OK";
              contentType = xhr.contentType;
            }
            if (status !== 0) {
              state = 2;
              that.readyState = 2;
              that.status = status;
              that.statusText = statusText;
              that._contentType = contentType;
              that.onreadystatechange();
            }
          }
        };
        var onProgress = function () {
          onStart();
          if (state === 2 || state === 3) {
            state = 3;
            var responseText = "";
            try {
              responseText = xhr.responseText;
            } catch (error) {
              // IE 8 - 9 with XMLHttpRequest
            }
            that.readyState = 3;
            that.responseText = responseText;
            that.onprogress();
          }
        };
        var onFinish = function (type, event) {
          if (event == null || event.preventDefault == null) {
            event = {
              preventDefault: k
            };
          }
          // Firefox 52 fires "readystatechange" (xhr.readyState === 4) without final "readystatechange" (xhr.readyState === 3)
          // IE 8 fires "onload" without "onprogress"
          onProgress();
          if (state === 1 || state === 2 || state === 3) {
            state = 4;
            if (timeout !== 0) {
              clearTimeout(timeout);
              timeout = 0;
            }
            that.readyState = 4;
            if (type === "load") {
              that.onload(event);
            } else if (type === "error") {
              that.onerror(event);
            } else if (type === "abort") {
              that.onabort(event);
            } else {
              throw new TypeError();
            }
            that.onreadystatechange();
          }
        };
        var onReadyStateChange = function (event) {
          if (xhr != undefined) { // Opera 12
            if (xhr.readyState === 4) {
              if (!("onload" in xhr) || !("onerror" in xhr) || !("onabort" in xhr)) {
                onFinish(xhr.responseText === "" ? "error" : "load", event);
              }
            } else if (xhr.readyState === 3) {
              if (!("onprogress" in xhr)) { // testing XMLHttpRequest#responseText too many times is too slow in IE 11
                // and in Firefox 3.6
                onProgress();
              }
            } else if (xhr.readyState === 2) {
              onStart();
            }
          }
        };
        var onTimeout = function () {
          timeout = setTimeout(function () {
            onTimeout();
          }, 500);
          if (xhr.readyState === 3) {
            onProgress();
          }
        };

        // XDomainRequest#abort removes onprogress, onerror, onload
        if ("onload" in xhr) {
          xhr.onload = function (event) {
            onFinish("load", event);
          };
        }
        if ("onerror" in xhr) {
          xhr.onerror = function (event) {
            onFinish("error", event);
          };
        }
        // improper fix to match Firefox behaviour, but it is better than just ignore abort
        // see https://bugzilla.mozilla.org/show_bug.cgi?id=768596
        // https://bugzilla.mozilla.org/show_bug.cgi?id=880200
        // https://code.google.com/p/chromium/issues/detail?id=153570
        // IE 8 fires "onload" without "onprogress
        if ("onabort" in xhr) {
          xhr.onabort = function (event) {
            onFinish("abort", event);
          };
        }

        if ("onprogress" in xhr) {
          xhr.onprogress = onProgress;
        }

        // IE 8 - 9 (XMLHTTPRequest)
        // Opera < 12
        // Firefox < 3.5
        // Firefox 3.5 - 3.6 - ? < 9.0
        // onprogress is not fired sometimes or delayed
        // see also #64 (significant lag in IE 11)
        if ("onreadystatechange" in xhr) {
          xhr.onreadystatechange = function (event) {
            onReadyStateChange(event);
          };
        }

        if ("contentType" in xhr || !("ontimeout" in XMLHttpRequest.prototype)) {
          url += (url.indexOf("?") === -1 ? "?" : "&") + "padding=true";
        }
        xhr.open(method, url, true);

        if ("readyState" in xhr) {
          // workaround for Opera 12 issue with "progress" events
          // #91 (XMLHttpRequest onprogress not fired for streaming response in Edge 14-15-?)
          timeout = setTimeout(function () {
            onTimeout();
          }, 0);
        }
      };
      XHRWrapper.prototype.abort = function () {
        this._abort(false);
      };
      XHRWrapper.prototype.getResponseHeader = function (name) {
        return this._contentType;
      };
      XHRWrapper.prototype.setRequestHeader = function (name, value) {
        var xhr = this._xhr;
        if ("setRequestHeader" in xhr) {
          xhr.setRequestHeader(name, value);
        }
      };
      XHRWrapper.prototype.getAllResponseHeaders = function () {
        // XMLHttpRequest#getAllResponseHeaders returns null for CORS requests in Firefox 3.6.28
        return this._xhr.getAllResponseHeaders != undefined ? this._xhr.getAllResponseHeaders() || "" : "";
      };
      XHRWrapper.prototype.send = function () {
        // loading indicator in Safari < ? (6), Chrome < 14, Firefox
        // https://bugzilla.mozilla.org/show_bug.cgi?id=736723
        if ((!("ontimeout" in XMLHttpRequest.prototype) || (!("sendAsBinary" in XMLHttpRequest.prototype) && !("mozAnon" in XMLHttpRequest.prototype))) &&
            document != undefined &&
            document.readyState != undefined &&
            document.readyState !== "complete") {
          var that = this;
          that._sendTimeout = setTimeout(function () {
            that._sendTimeout = 0;
            that.send();
          }, 4);
          return;
        }

        var xhr = this._xhr;
        // withCredentials should be set after "open" for Safari and Chrome (< 19 ?)
        if ("withCredentials" in xhr) {
          xhr.withCredentials = this.withCredentials;
        }
        try {
          // xhr.send(); throws "Not enough arguments" in Firefox 3.0
          xhr.send(undefined);
        } catch (error1) {
          // Safari 5.1.7, Opera 12
          throw error1;
        }
      };

      function toLowerCase(name) {
        return name.replace(/[A-Z]/g, function (c) {
          return String.fromCharCode(c.charCodeAt(0) + 0x20);
        });
      }

      function HeadersPolyfill(all) {
        // Get headers: implemented according to mozilla's example code: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders#Example
        var map = Object.create(null);
        var array = all.split("\r\n");
        for (var i = 0; i < array.length; i += 1) {
          var line = array[i];
          var parts = line.split(": ");
          var name = parts.shift();
          var value = parts.join(": ");
          map[toLowerCase(name)] = value;
        }
        this._map = map;
      }
      HeadersPolyfill.prototype.get = function (name) {
        return this._map[toLowerCase(name)];
      };

      if (XMLHttpRequest != null && XMLHttpRequest.HEADERS_RECEIVED == null) { // IE < 9, Firefox 3.6
        XMLHttpRequest.HEADERS_RECEIVED = 2;
      }

      function XHRTransport() {
      }

      XHRTransport.prototype.open = function (xhr, onStartCallback, onProgressCallback, onFinishCallback, url, withCredentials, headers) {
        xhr.open("GET", url);
        var offset = 0;
        xhr.onprogress = function () {
          var responseText = xhr.responseText;
          var chunk = responseText.slice(offset);
          offset += chunk.length;
          onProgressCallback(chunk);
        };
        xhr.onerror = function (event) {
          event.preventDefault();
          onFinishCallback(new Error("NetworkError"));
        };
        xhr.onload = function () {
          onFinishCallback(null);
        };
        xhr.onabort = function () {
          onFinishCallback(null);
        };
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            var status = xhr.status;
            var statusText = xhr.statusText;
            var contentType = xhr.getResponseHeader("Content-Type");
            var headers = xhr.getAllResponseHeaders();
            onStartCallback(status, statusText, contentType, new HeadersPolyfill(headers));
          }
        };
        xhr.withCredentials = withCredentials;
        for (var name in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, name)) {
            xhr.setRequestHeader(name, headers[name]);
          }
        }
        xhr.send();
        return xhr;
      };

      function HeadersWrapper(headers) {
        this._headers = headers;
      }
      HeadersWrapper.prototype.get = function (name) {
        return this._headers.get(name);
      };

      function FetchTransport() {
      }

      FetchTransport.prototype.open = function (xhr, onStartCallback, onProgressCallback, onFinishCallback, url, withCredentials, headers) {
        var reader = null;
        var controller = new AbortController();
        var signal = controller.signal;
        var textDecoder = new TextDecoder();
        fetch(url, {
          headers: headers,
          credentials: withCredentials ? "include" : "same-origin",
          signal: signal,
          cache: "no-store"
        }).then(function (response) {
          reader = response.body.getReader();
          onStartCallback(response.status, response.statusText, response.headers.get("Content-Type"), new HeadersWrapper(response.headers));
          // see https://github.com/promises-aplus/promises-spec/issues/179
          return new Promise(function (resolve, reject) {
            var readNextChunk = function () {
              reader.read().then(function (result) {
                if (result.done) {
                  //Note: bytes in textDecoder are ignored
                  resolve(undefined);
                } else {
                  var chunk = textDecoder.decode(result.value, {stream: true});
                  onProgressCallback(chunk);
                  readNextChunk();
                }
              })["catch"](function (error) {
                reject(error);
              });
            };
            readNextChunk();
          });
        })["catch"](function (error) {
          if (error.name === "AbortError") {
            return undefined;
          } else {
            return error;
          }
        }).then(function (error) {
          onFinishCallback(error);
        });
        return {
          abort: function () {
            if (reader != null) {
              reader.cancel(); // https://bugzilla.mozilla.org/show_bug.cgi?id=1583815
            }
            controller.abort();
          }
        };
      };

      function EventTarget() {
        this._listeners = Object.create(null);
      }

      function throwError(e) {
        setTimeout(function () {
          throw e;
        }, 0);
      }

      EventTarget.prototype.dispatchEvent = function (event) {
        event.target = this;
        var typeListeners = this._listeners[event.type];
        if (typeListeners != undefined) {
          var length = typeListeners.length;
          for (var i = 0; i < length; i += 1) {
            var listener = typeListeners[i];
            try {
              if (typeof listener.handleEvent === "function") {
                listener.handleEvent(event);
              } else {
                listener.call(this, event);
              }
            } catch (e) {
              throwError(e);
            }
          }
        }
      };
      EventTarget.prototype.addEventListener = function (type, listener) {
        type = String(type);
        var listeners = this._listeners;
        var typeListeners = listeners[type];
        if (typeListeners == undefined) {
          typeListeners = [];
          listeners[type] = typeListeners;
        }
        var found = false;
        for (var i = 0; i < typeListeners.length; i += 1) {
          if (typeListeners[i] === listener) {
            found = true;
          }
        }
        if (!found) {
          typeListeners.push(listener);
        }
      };
      EventTarget.prototype.removeEventListener = function (type, listener) {
        type = String(type);
        var listeners = this._listeners;
        var typeListeners = listeners[type];
        if (typeListeners != undefined) {
          var filtered = [];
          for (var i = 0; i < typeListeners.length; i += 1) {
            if (typeListeners[i] !== listener) {
              filtered.push(typeListeners[i]);
            }
          }
          if (filtered.length === 0) {
            delete listeners[type];
          } else {
            listeners[type] = filtered;
          }
        }
      };

      function Event(type) {
        this.type = type;
        this.target = undefined;
      }

      function MessageEvent(type, options) {
        Event.call(this, type);
        this.data = options.data;
        this.lastEventId = options.lastEventId;
      }

      MessageEvent.prototype = Object.create(Event.prototype);

      function ConnectionEvent(type, options) {
        Event.call(this, type);
        this.status = options.status;
        this.statusText = options.statusText;
        this.headers = options.headers;
      }

      ConnectionEvent.prototype = Object.create(Event.prototype);

      function ErrorEvent(type, options) {
        Event.call(this, type);
        this.error = options.error;
      }

      ErrorEvent.prototype = Object.create(Event.prototype);

      var WAITING = -1;
      var CONNECTING = 0;
      var OPEN = 1;
      var CLOSED = 2;

      var AFTER_CR = -1;
      var FIELD_START = 0;
      var FIELD = 1;
      var VALUE_START = 2;
      var VALUE = 3;

      var contentTypeRegExp = /^text\/event\-stream(;.*)?$/i;

      var MINIMUM_DURATION = 1000;
      var MAXIMUM_DURATION = 18000000;

      var parseDuration = function (value, def) {
        var n = value == null ? def : parseInt(value, 10);
        if (n !== n) {
          n = def;
        }
        return clampDuration(n);
      };
      var clampDuration = function (n) {
        return Math.min(Math.max(n, MINIMUM_DURATION), MAXIMUM_DURATION);
      };

      var fire = function (that, f, event) {
        try {
          if (typeof f === "function") {
            f.call(that, event);
          }
        } catch (e) {
          throwError(e);
        }
      };

      function EventSourcePolyfill(url, options) {
        EventTarget.call(this);
        options = options || {};

        this.onopen = undefined;
        this.onmessage = undefined;
        this.onerror = undefined;

        this.url = undefined;
        this.readyState = undefined;
        this.withCredentials = undefined;
        this.headers = undefined;

        this._close = undefined;

        start(this, url, options);
      }

      function getBestXHRTransport() {
        return (XMLHttpRequest != undefined && ("withCredentials" in XMLHttpRequest.prototype)) || XDomainRequest == undefined
            ? new XMLHttpRequest()
            : new XDomainRequest();
      }

      var isFetchSupported = fetch != undefined && Response != undefined && "body" in Response.prototype;

      function start(es, url, options) {
        url = String(url);
        var withCredentials = Boolean(options.withCredentials);
        var lastEventIdQueryParameterName = options.lastEventIdQueryParameterName || "lastEventId";

        var initialRetry = clampDuration(1000);
        var heartbeatTimeout = parseDuration(options.heartbeatTimeout, 45000);

        var lastEventId = "";
        var retry = initialRetry;
        var wasActivity = false;
        var textLength = 0;
        var headers = options.headers || {};
        var TransportOption = options.Transport;
        var xhr = isFetchSupported && TransportOption == undefined ? undefined : new XHRWrapper(TransportOption != undefined ? new TransportOption() : getBestXHRTransport());
        var transport = TransportOption != null && typeof TransportOption !== "string" ? new TransportOption() : (xhr == undefined ? new FetchTransport() : new XHRTransport());
        var abortController = undefined;
        var timeout = 0;
        var currentState = WAITING;
        var dataBuffer = "";
        var lastEventIdBuffer = "";
        var eventTypeBuffer = "";

        var textBuffer = "";
        var state = FIELD_START;
        var fieldStart = 0;
        var valueStart = 0;

        var onStart = function (status, statusText, contentType, headers) {
          if (currentState === CONNECTING) {
            if (status === 200 && contentType != undefined && contentTypeRegExp.test(contentType)) {
              currentState = OPEN;
              wasActivity = Date.now();
              retry = initialRetry;
              es.readyState = OPEN;
              var event = new ConnectionEvent("open", {
                status: status,
                statusText: statusText,
                headers: headers
              });
              es.dispatchEvent(event);
              fire(es, es.onopen, event);
            } else {
              var message = "";
              if (status !== 200) {
                if (statusText) {
                  statusText = statusText.replace(/\s+/g, " ");
                }
                message = "EventSource's response has a status " + status + " " + statusText + " that is not 200. Aborting the connection.";
              } else {
                message = "EventSource's response has a Content-Type specifying an unsupported type: " + (contentType == undefined ? "-" : contentType.replace(/\s+/g, " ")) + ". Aborting the connection.";
              }
              close();
              var event = new ConnectionEvent("error", {
                status: status,
                statusText: statusText,
                headers: headers
              });
              es.dispatchEvent(event);
              fire(es, es.onerror, event);
              console.error(message);
            }
          }
        };

        var onProgress = function (textChunk) {
          if (currentState === OPEN) {
            var n = -1;
            for (var i = 0; i < textChunk.length; i += 1) {
              var c = textChunk.charCodeAt(i);
              if (c === "\n".charCodeAt(0) || c === "\r".charCodeAt(0)) {
                n = i;
              }
            }
            var chunk = (n !== -1 ? textBuffer : "") + textChunk.slice(0, n + 1);
            textBuffer = (n === -1 ? textBuffer : "") + textChunk.slice(n + 1);
            if (textChunk !== "") {
              wasActivity = Date.now();
              textLength += textChunk.length;
            }
            for (var position = 0; position < chunk.length; position += 1) {
              var c = chunk.charCodeAt(position);
              if (state === AFTER_CR && c === "\n".charCodeAt(0)) {
                state = FIELD_START;
              } else {
                if (state === AFTER_CR) {
                  state = FIELD_START;
                }
                if (c === "\r".charCodeAt(0) || c === "\n".charCodeAt(0)) {
                  if (state !== FIELD_START) {
                    if (state === FIELD) {
                      valueStart = position + 1;
                    }
                    var field = chunk.slice(fieldStart, valueStart - 1);
                    var value = chunk.slice(valueStart + (valueStart < position && chunk.charCodeAt(valueStart) === " ".charCodeAt(0) ? 1 : 0), position);
                    if (field === "data") {
                      dataBuffer += "\n";
                      dataBuffer += value;
                    } else if (field === "id") {
                      lastEventIdBuffer = value;
                    } else if (field === "event") {
                      eventTypeBuffer = value;
                    } else if (field === "retry") {
                      initialRetry = parseDuration(value, initialRetry);
                      retry = initialRetry;
                    } else if (field === "heartbeatTimeout") {
                      heartbeatTimeout = parseDuration(value, heartbeatTimeout);
                      if (timeout !== 0) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                          onTimeout();
                        }, heartbeatTimeout);
                      }
                    }
                  }
                  if (state === FIELD_START) {
                    if (dataBuffer !== "") {
                      lastEventId = lastEventIdBuffer;
                      if (eventTypeBuffer === "") {
                        eventTypeBuffer = "message";
                      }
                      var event = new MessageEvent(eventTypeBuffer, {
                        data: dataBuffer.slice(1),
                        lastEventId: lastEventIdBuffer
                      });
                      es.dispatchEvent(event);
                      if (eventTypeBuffer === "open") {
                        fire(es, es.onopen, event);
                      } else if (eventTypeBuffer === "message") {
                        fire(es, es.onmessage, event);
                      } else if (eventTypeBuffer === "error") {
                        fire(es, es.onerror, event);
                      }
                      if (currentState === CLOSED) {
                        return;
                      }
                    }
                    dataBuffer = "";
                    eventTypeBuffer = "";
                  }
                  state = c === "\r".charCodeAt(0) ? AFTER_CR : FIELD_START;
                } else {
                  if (state === FIELD_START) {
                    fieldStart = position;
                    state = FIELD;
                  }
                  if (state === FIELD) {
                    if (c === ":".charCodeAt(0)) {
                      valueStart = position + 1;
                      state = VALUE_START;
                    }
                  } else if (state === VALUE_START) {
                    state = VALUE;
                  }
                }
              }
            }
          }
        };

        var onFinish = function (error) {
          if (currentState === OPEN || currentState === CONNECTING) {
            currentState = WAITING;
            if (timeout !== 0) {
              clearTimeout(timeout);
              timeout = 0;
            }
            timeout = setTimeout(function () {
              onTimeout();
            }, retry);
            retry = clampDuration(Math.min(initialRetry * 16, retry * 2));

            es.readyState = CONNECTING;
            var event = new ErrorEvent("error", {error: error});
            es.dispatchEvent(event);
            fire(es, es.onerror, event);
            if (error != undefined) {
              console.error(error);
            }
          }
        };

        var close = function () {
          currentState = CLOSED;
          if (abortController != undefined) {
            abortController.abort();
            abortController = undefined;
          }
          if (timeout !== 0) {
            clearTimeout(timeout);
            timeout = 0;
          }
          es.readyState = CLOSED;
        };

        var onTimeout = function () {
          timeout = 0;

          if (currentState !== WAITING) {
            if (!wasActivity && abortController != undefined) {
              onFinish(new Error("No activity within " + heartbeatTimeout + " milliseconds." + " " + (currentState === CONNECTING ? "No response received." : textLength + " chars received.") + " " + "Reconnecting."));
              if (abortController != undefined) {
                abortController.abort();
                abortController = undefined;
              }
            } else {
              var nextHeartbeat = Math.max((wasActivity || Date.now()) + heartbeatTimeout - Date.now(), 1);
              wasActivity = false;
              timeout = setTimeout(function () {
                onTimeout();
              }, nextHeartbeat);
            }
            return;
          }

          wasActivity = false;
          textLength = 0;
          timeout = setTimeout(function () {
            onTimeout();
          }, heartbeatTimeout);

          currentState = CONNECTING;
          dataBuffer = "";
          eventTypeBuffer = "";
          lastEventIdBuffer = lastEventId;
          textBuffer = "";
          fieldStart = 0;
          valueStart = 0;
          state = FIELD_START;

          // https://bugzilla.mozilla.org/show_bug.cgi?id=428916
          // Request header field Last-Event-ID is not allowed by Access-Control-Allow-Headers.
          var requestURL = url;
          if (url.slice(0, 5) !== "data:" && url.slice(0, 5) !== "blob:") {
            if (lastEventId !== "") {
              // Remove the lastEventId parameter if it's already part of the request URL.
              var i = url.indexOf("?");
              requestURL = i === -1 ? url : url.slice(0, i + 1) + url.slice(i + 1).replace(/(?:^|&)([^=&]*)(?:=[^&]*)?/g, function (p, paramName) {
                return paramName === lastEventIdQueryParameterName ? '' : p;
              });
              // Append the current lastEventId to the request URL.
              requestURL += (url.indexOf("?") === -1 ? "?" : "&") + lastEventIdQueryParameterName +"=" + encodeURIComponent(lastEventId);
            }
          }
          var withCredentials = es.withCredentials;
          var requestHeaders = {};
          requestHeaders["Accept"] = "text/event-stream";
          var headers = es.headers;
          if (headers != undefined) {
            for (var name in headers) {
              if (Object.prototype.hasOwnProperty.call(headers, name)) {
                requestHeaders[name] = headers[name];
              }
            }
          }
          try {
            abortController = transport.open(xhr, onStart, onProgress, onFinish, requestURL, withCredentials, requestHeaders);
          } catch (error) {
            close();
            throw error;
          }
        };

        es.url = url;
        es.readyState = CONNECTING;
        es.withCredentials = withCredentials;
        es.headers = headers;
        es._close = close;

        onTimeout();
      }

      EventSourcePolyfill.prototype = Object.create(EventTarget.prototype);
      EventSourcePolyfill.prototype.CONNECTING = CONNECTING;
      EventSourcePolyfill.prototype.OPEN = OPEN;
      EventSourcePolyfill.prototype.CLOSED = CLOSED;
      EventSourcePolyfill.prototype.close = function () {
        this._close();
      };

      EventSourcePolyfill.CONNECTING = CONNECTING;
      EventSourcePolyfill.OPEN = OPEN;
      EventSourcePolyfill.CLOSED = CLOSED;
      EventSourcePolyfill.prototype.withCredentials = undefined;

      var R = NativeEventSource;
      if (XMLHttpRequest != undefined && (NativeEventSource == undefined || !("withCredentials" in NativeEventSource.prototype))) {
        // Why replace a native EventSource ?
        // https://bugzilla.mozilla.org/show_bug.cgi?id=444328
        // https://bugzilla.mozilla.org/show_bug.cgi?id=831392
        // https://code.google.com/p/chromium/issues/detail?id=260144
        // https://code.google.com/p/chromium/issues/detail?id=225654
        // ...
        R = EventSourcePolyfill;
      }

      (function (factory) {
        {
          var v = factory(exports);
          if (v !== undefined) module.exports = v;
        }
      })(function (exports) {
        exports.EventSourcePolyfill = EventSourcePolyfill;
        exports.NativeEventSource = NativeEventSource;
        exports.EventSource = R;
      });
    }(typeof globalThis === 'undefined' ? (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : commonjsGlobal) : globalThis));
    });

    var MessagesAPI;
    (function (MessagesAPI) {
        async function fetchMessages(topicTitle, after, token) {
            return axios.get(messages$1 + `/${topicTitle}`, {
                headers: Object.assign({}, tokenAuthHeader(token)),
                params: {
                    after: formatDate(after)
                }
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return [];
            });
        }
        MessagesAPI.fetchMessages = fetchMessages;
        async function messagesSource(token) {
            return new eventsource.EventSourcePolyfill(messageStream, {
                headers: Object.assign({}, tokenAuthHeader(token))
            });
        }
        MessagesAPI.messagesSource = messagesSource;
        async function listenForMessagesWS(token) {
            return new WebSocket("ws://localhost:8081/api/messages/ws?auth=" + token);
        }
        MessagesAPI.listenForMessagesWS = listenForMessagesWS;
        async function sendMessage(messageData, token) {
            return axios.post(messageSend, messageData, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return new Message();
            });
        }
        MessagesAPI.sendMessage = sendMessage;
    })(MessagesAPI || (MessagesAPI = {}));

    class Topic {
        constructor() {
            this.id = "";
            this.title = "";
            this.admin = "";
            this.public = false;
        }
    }

    var TopicsApi;
    (function (TopicsApi) {
        async function getTopics(url, token) {
            return axios.get(url, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return [];
            });
        }
        async function createTopic(topicData, token) {
            return axios.post(topics, topicData, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return new Topic();
            });
        }
        TopicsApi.createTopic = createTopic;
        async function subscribeToTopic(subscribeData, token) {
            return axios.put(subscribe, subscribeData, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });
        }
        TopicsApi.subscribeToTopic = subscribeToTopic;
        async function unsubscribeToTopic(topicTitle, token) {
            return axios.put(unsubscribe, { title: topicTitle }, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return true;
            }).catch((err) => {
                console.log(err);
                return false;
            });
        }
        TopicsApi.unsubscribeToTopic = unsubscribeToTopic;
        async function searchTopics(searchKey, token) {
            return axios.get(topics + `/search/${searchKey}`, {
                headers: Object.assign({}, tokenAuthHeader(token)),
                params: {
                    search: searchKey
                }
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return [];
            });
        }
        TopicsApi.searchTopics = searchTopics;
        async function getSubscribedTopics(token) {
            return getTopics(topics + "/subscribed", token);
        }
        TopicsApi.getSubscribedTopics = getSubscribedTopics;
        async function getCreatedTopics(token) {
            return getTopics(topics, token);
        }
        TopicsApi.getCreatedTopics = getCreatedTopics;
        async function getTopicsCreatedBy(username, token) {
            return getTopics(topics + `/of/${username}`, token);
        }
        TopicsApi.getTopicsCreatedBy = getTopicsCreatedBy;
        async function getTopicDetails(topicId, token) {
            return axios.get(topics + `/${topicId}`, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return new Topic();
            });
        }
        TopicsApi.getTopicDetails = getTopicDetails;
    })(TopicsApi || (TopicsApi = {}));

    const _subscribedTopics = writable([]);
    const _createdTopics = writable([]);
    const _viewedTopic = writable(undefined);
    const viewedTopic = derived(_viewedTopic, $topic => $topic);
    const subscribedTopics = derived(_subscribedTopics, $_subsribedTopics => $_subsribedTopics);
    const createdTopics = derived(_createdTopics, $_createdTopics => $_createdTopics);
    const createTopic = async (topicData) => {
        TopicsApi.createTopic(topicData, await getToken())
            .then((topic) => {
            navigate(`/topics/${topic.id}`);
        });
    };
    const searchForTopics = async (searchKey) => {
        return TopicsApi.searchTopics(searchKey, await getToken());
    };
    const fetchSubscribedTopics = async () => {
        TopicsApi.getSubscribedTopics(await getToken())
            .then((topics) => {
            _subscribedTopics.set(topics);
            console.log(topics);
        });
    };
    const fetchTopicsOf = async (username) => {
        return TopicsApi.getTopicsCreatedBy(username, await getToken());
    };
    const fetchCreatedTopics = async () => {
        TopicsApi.getCreatedTopics(await getToken())
            .then((topics) => {
            _createdTopics.set(topics);
            console.log(topics);
        });
    };
    const fetchTopicDetails = async (topicId) => {
        TopicsApi.getTopicDetails(topicId, await getToken()).then((topic) => {
            _viewedTopic.set(topic);
        });
    };
    const subscribeToTopic = async (subscribeData) => {
        TopicsApi.subscribeToTopic(subscribeData, await getToken()).then((subscribed) => {
            if (subscribed) {
                fetchUserDetails();
                //refreshEventSource()
            }
        });
    };
    const unsubscribeToTopic = async (topicTitle) => {
        TopicsApi.unsubscribeToTopic(topicTitle, await getToken()).then((unsubscribed) => {
            if (unsubscribed) {
                fetchUserDetails();
                //refreshEventSource()
            }
        });
    };

    const _messages = writable([]);
    const messages = derived(_messages, $messages => $messages);
    let messageEventSource;
    let topic;
    let messageWS;
    const fetchMessages = async (topicTitle, after = new Date(0)) => {
        MessagesAPI.fetchMessages(topicTitle, after, await getToken()).then((fetchedMessages) => {
            _messages.set(fetchedMessages);
        });
    };
    const listenForMessages = async () => {
        messageEventSource = await MessagesAPI.messagesSource(await getToken());
        messageEventSource.onmessage = processEvent;
        console.log("started listening for messages");
    };
    const listenForMessagesWS = async () => {
        messageWS = await MessagesAPI.listenForMessagesWS(await getToken());
        messageWS.onopen = async () => {
            console.log("connected to ws");
        };
        messageWS.onmessage = async (event) => {
            const content = event.data;
            console.log(content);
            if (JSON.parse(content) === "token exp") {
                console.log("token expired");
                console.log(get_store_value(tokenExpired));
                messageWS.send(await getToken());
                console.log("new token sent");
            }
            else {
                processEvent(event);
            }
        };
        messageWS.onclose = () => {
            console.log("ws connection closed");
        };
    };
    const stopListeningForMessagesWS = async () => {
        if (messageWS)
            messageWS.close();
    };
    const stopListeningForMessages = async () => {
        messageEventSource.close();
    };
    const processEvent = (event) => {
        topic = get_store_value(viewedTopic);
        console.log(event);
        if (!topic)
            return;
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.to == topic.title) {
            _messages.update((messages) => {
                for (let m of messages) {
                    if (m.id == message.id) {
                        return messages;
                    }
                }
                return [...messages, message];
            });
        }
    };
    const sendMessage = async (messageData) => {
        return MessagesAPI.sendMessage(messageData, await getToken());
    };

    function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

    const _token = writable("", (set) => {
        set(secureStorage.get("token"));
    });
    const _username = writable("", (set) => {
        set(secureStorage.get("username"));
    });
    const _refreshToken = writable("", (set) => {
        set(secureStorage.get("refresh"));
    });
    let logoutTimer = undefined;
    derived(_token, $_token => $_token);
    derived(_username, $_username => $_username);
    const isAuthenticated = derived(_refreshToken, $_token => $_token !== "");
    const tokenExpired = derived(_token, $_token => {
        const claims = o($_token);
        return claims["exp"] <= Date.now() / 1000;
    });
    const login = async (username, password) => {
        return AuthApi.login(username, password)
            .then((tokens) => {
            _token.set(tokens.auth);
            _username.set(username);
            _refreshToken.set(tokens.refresh);
            secureStorage.set("token", tokens.auth);
            secureStorage.set("refresh", tokens.refresh);
            secureStorage.set("username", username);
            listenForMessages();
            listenForMessagesWS();
            navigate("/", { replace: true });
            const refreshTokenClaims = o(tokens.refresh);
            // logout one minute before the the refresh token expires so it is removed from the server and is no longer valid
            logoutTimer = setTimeout(logout, refreshTokenClaims["exp"] * 1000 - Date.now() - 60 * 1000);
            return true;
        })
            .catch((err) => {
            console.log(err);
            return false;
        });
    };
    const logout = async () => {
        stopListeningForMessages();
        stopListeningForMessagesWS();
        AuthApi.logout(get_store_value(_refreshToken));
        secureStorage.remove("token");
        secureStorage.remove("user");
        secureStorage.remove("refresh");
        _token.set("");
        _username.set("");
        _refreshToken.set("");
        if (logoutTimer)
            clearTimeout(logoutTimer);
        navigate("/login", { replace: true });
    };
    let newTokenPromise = undefined;
    let refreshing = false;
    const getToken = async () => {
        if (get_store_value(tokenExpired)) {
            if (!refreshing) {
                refreshing = true;
                newTokenPromise = AuthApi.refresh(get_store_value(_refreshToken)).then((token) => {
                    refreshing = false;
                    return token;
                });
            }
            const newToken = await newTokenPromise;
            secureStorage.set("token", newToken);
            _token.set(newToken);
        }
        return get_store_value(_token);
    };

    var UserApi;
    (function (UserApi) {
        async function getUserDetails(token) {
            return axios.get(users, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return new User();
            });
        }
        UserApi.getUserDetails = getUserDetails;
        async function searchUsersByUsername(searchKey, token) {
            console.log(users);
            return axios.get(users + `/search/${searchKey}`, {
                headers: Object.assign({}, tokenAuthHeader(token))
            }).then((res) => {
                return res.data;
            }).catch((err) => {
                console.log(err);
                return [];
            });
        }
        UserApi.searchUsersByUsername = searchUsersByUsername;
    })(UserApi || (UserApi = {}));

    const _user = writable(new User(), (set) => {
        const userData = secureStorage.get("user-data");
        if (userData !== '') {
            set((JSON.parse(userData)));
        }
    });
    const user = derived(_user, $_user => $_user);
    const fetchUserDetails = async () => {
        UserApi.getUserDetails(await getToken()).then((user) => {
            _user.set(user);
            secureStorage.set("user-data", JSON.stringify(user));
            console.log(user);
        });
    };
    const searchUsersByUsername = async (usernameSearchKey) => {
        return UserApi.searchUsersByUsername(usernameSearchKey, await getToken());
    };

    /* src\components\utils\LoadingBar.svelte generated by Svelte v3.48.0 */

    const file$l = "src\\components\\utils\\LoadingBar.svelte";

    function create_fragment$n(ctx) {
    	let progress;

    	const block = {
    		c: function create() {
    			progress = element("progress");
    			attr_dev(progress, "class", "progress");
    			attr_dev(progress, "max", "100");
    			add_location(progress, file$l, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingBar",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\utils\ThrottledSearchField.svelte generated by Svelte v3.48.0 */
    const file$k = "src\\components\\utils\\ThrottledSearchField.svelte";

    function create_fragment$m(ctx) {
    	let p;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "input");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
    			add_location(input, file$k, 18, 4, 523);
    			attr_dev(p, "class", "control block");
    			add_location(p, file$k, 17, 0, 493);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, input);
    			set_input_value(input, /*searchKey*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placeholder*/ 1) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[0]);
    			}

    			if (dirty & /*searchKey*/ 2 && input.value !== /*searchKey*/ ctx[1]) {
    				set_input_value(input, /*searchKey*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ThrottledSearchField', slots, []);
    	let searchKey = "";
    	let { throttleTime = 500 } = $$props;
    	let { placeholder = "" } = $$props;
    	let emitSearchTimer = undefined;
    	const emit = createEventDispatcher();
    	const writable_props = ['throttleTime', 'placeholder'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ThrottledSearchField> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchKey = this.value;
    		$$invalidate(1, searchKey);
    	}

    	$$self.$$set = $$props => {
    		if ('throttleTime' in $$props) $$invalidate(2, throttleTime = $$props.throttleTime);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		searchKey,
    		throttleTime,
    		placeholder,
    		emitSearchTimer,
    		emit
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchKey' in $$props) $$invalidate(1, searchKey = $$props.searchKey);
    		if ('throttleTime' in $$props) $$invalidate(2, throttleTime = $$props.throttleTime);
    		if ('placeholder' in $$props) $$invalidate(0, placeholder = $$props.placeholder);
    		if ('emitSearchTimer' in $$props) $$invalidate(3, emitSearchTimer = $$props.emitSearchTimer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*searchKey, emitSearchTimer, throttleTime*/ 14) {
    			{
    				if (searchKey.trimStart().trimEnd().length != 0) {
    					if (emitSearchTimer) clearTimeout(emitSearchTimer);

    					$$invalidate(3, emitSearchTimer = setTimeout(
    						() => {
    							emit("search", searchKey);
    						},
    						throttleTime
    					));
    				}
    			}
    		}
    	};

    	return [placeholder, searchKey, throttleTime, emitSearchTimer, input_input_handler];
    }

    class ThrottledSearchField extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { throttleTime: 2, placeholder: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThrottledSearchField",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get throttleTime() {
    		throw new Error("<ThrottledSearchField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set throttleTime(value) {
    		throw new Error("<ThrottledSearchField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<ThrottledSearchField>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<ThrottledSearchField>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\user\UserListItem.svelte generated by Svelte v3.48.0 */
    const file$j = "src\\components\\user\\UserListItem.svelte";

    function create_fragment$l(ctx) {
    	let li;
    	let div3;
    	let div2;
    	let div0;
    	let p;
    	let t0_value = /*user*/ ctx[0].username + "";
    	let t0;
    	let t1;
    	let div1;
    	let a;
    	let t2;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			a = element("a");
    			t2 = text("topics");
    			attr_dev(p, "class", "content");
    			add_location(p, file$j, 8, 16, 235);
    			attr_dev(div0, "class", "level-left");
    			add_location(div0, file$j, 7, 12, 194);
    			attr_dev(a, "class", "button is-small is-rounded is-link");
    			attr_dev(a, "href", a_href_value = `/user/${/*user*/ ctx[0].username}`);
    			add_location(a, file$j, 12, 16, 352);
    			attr_dev(div1, "class", "level-right");
    			add_location(div1, file$j, 11, 12, 310);
    			attr_dev(div2, "class", "levels");
    			add_location(div2, file$j, 6, 8, 161);
    			attr_dev(div3, "class", "box has-background-light");
    			add_location(div3, file$j, 5, 4, 114);
    			attr_dev(li, "class", "block p-0");
    			add_location(li, file$j, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    			append_dev(a, t2);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && t0_value !== (t0_value = /*user*/ ctx[0].username + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*user*/ 1 && a_href_value !== (a_href_value = `/user/${/*user*/ ctx[0].username}`)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserListItem', slots, []);
    	let { user } = $$props;
    	const writable_props = ['user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({ link, user });

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user];
    }

    class UserListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { user: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserListItem",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*user*/ ctx[0] === undefined && !('user' in props)) {
    			console.warn("<UserListItem> was created without expected prop 'user'");
    		}
    	}

    	get user() {
    		throw new Error("<UserListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<UserListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\user\UserList.svelte generated by Svelte v3.48.0 */
    const file$i = "src\\components\\user\\UserList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (11:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No users to display";
    			attr_dev(p, "class", "content");
    			add_location(p, file$i, 12, 8, 297);
    			attr_dev(div, "class", "container");
    			add_location(div, file$i, 11, 4, 265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if users.length}
    function create_if_block$a(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*users*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*user*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "scroll-box");
    			add_location(ul, file$i, 5, 4, 127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*users*/ 1) {
    				each_value = /*users*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(5:0) {#if users.length}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#each users as user (user.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let userlistitem;
    	let current;

    	userlistitem = new UserListItem({
    			props: { user: /*user*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(userlistitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(userlistitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const userlistitem_changes = {};
    			if (dirty & /*users*/ 1) userlistitem_changes.user = /*user*/ ctx[1];
    			userlistitem.$set(userlistitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userlistitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userlistitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(userlistitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(7:8) {#each users as user (user.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*users*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserList', slots, []);
    	let { users = [] } = $$props;
    	const writable_props = ['users'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('users' in $$props) $$invalidate(0, users = $$props.users);
    	};

    	$$self.$capture_state = () => ({ UserListItem, users });

    	$$self.$inject_state = $$props => {
    		if ('users' in $$props) $$invalidate(0, users = $$props.users);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [users];
    }

    class UserList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { users: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserList",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get users() {
    		throw new Error("<UserList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set users(value) {
    		throw new Error("<UserList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\user\UserSearch.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\user\\UserSearch.svelte";

    // (17:0) {#if searchingUsers}
    function create_if_block$9(ctx) {
    	let div;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*searchingUsers*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "block");
    			add_location(div, file$h, 17, 4, 557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*searchingUsers*/ 1 && promise !== (promise = /*searchingUsers*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(17:0) {#if searchingUsers}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import { searchUsersByUsername }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { searchUsersByUsername }",
    		ctx
    	});

    	return block;
    }

    // (21:8) {:then users}
    function create_then_block$4(ctx) {
    	let userlist;
    	let current;

    	userlist = new UserList({
    			props: { users: /*users*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(userlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const userlist_changes = {};
    			if (dirty & /*searchingUsers*/ 1) userlist_changes.users = /*users*/ ctx[2];
    			userlist.$set(userlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(21:8) {:then users}",
    		ctx
    	});

    	return block;
    }

    // (19:31)              <LoadingBar />         {:then users}
    function create_pending_block$4(ctx) {
    	let loadingbar;
    	let current;
    	loadingbar = new LoadingBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(19:31)              <LoadingBar />         {:then users}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let throttledsearchfield;
    	let t;
    	let if_block_anchor;
    	let current;

    	throttledsearchfield = new ThrottledSearchField({
    			props: { placeholder: "Search users by username" },
    			$$inline: true
    		});

    	throttledsearchfield.$on("search", /*searchUserHandler*/ ctx[1]);
    	let if_block = /*searchingUsers*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			create_component(throttledsearchfield.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(throttledsearchfield, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*searchingUsers*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*searchingUsers*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(throttledsearchfield.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(throttledsearchfield.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(throttledsearchfield, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserSearch', slots, []);
    	let searchingUsers = undefined;

    	const searchUserHandler = event => {
    		const searchKey = event.detail;
    		$$invalidate(0, searchingUsers = searchUsersByUsername(searchKey));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserSearch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		searchUsersByUsername,
    		LoadingBar,
    		ThrottledSearchField,
    		UserList,
    		searchingUsers,
    		searchUserHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchingUsers' in $$props) $$invalidate(0, searchingUsers = $$props.searchingUsers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchingUsers, searchUserHandler];
    }

    class UserSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserSearch",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\components\topic\TopicSearch.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\components\\topic\\TopicSearch.svelte";

    // (17:0) {#if searchingTopics}
    function create_if_block$8(ctx) {
    	let div;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*searchingTopics*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "block");
    			add_location(div, file$g, 17, 4, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*searchingTopics*/ 1 && promise !== (promise = /*searchingTopics*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(17:0) {#if searchingTopics}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import { searchForTopics }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { searchForTopics }",
    		ctx
    	});

    	return block;
    }

    // (21:8) {:then topics}
    function create_then_block$3(ctx) {
    	let topiclist;
    	let current;

    	topiclist = new TopicList({
    			props: { topics: /*topics*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topiclist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topiclist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topiclist_changes = {};
    			if (dirty & /*searchingTopics*/ 1) topiclist_changes.topics = /*topics*/ ctx[2];
    			topiclist.$set(topiclist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topiclist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topiclist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topiclist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(21:8) {:then topics}",
    		ctx
    	});

    	return block;
    }

    // (19:32)              <LoadingBar />         {:then topics}
    function create_pending_block$3(ctx) {
    	let loadingbar;
    	let current;
    	loadingbar = new LoadingBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(19:32)              <LoadingBar />         {:then topics}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let throttledsearchfield;
    	let t;
    	let if_block_anchor;
    	let current;

    	throttledsearchfield = new ThrottledSearchField({
    			props: { placeholder: "Search by topic title" },
    			$$inline: true
    		});

    	throttledsearchfield.$on("search", /*searchTopicsHandler*/ ctx[1]);
    	let if_block = /*searchingTopics*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			create_component(throttledsearchfield.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(throttledsearchfield, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*searchingTopics*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*searchingTopics*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(throttledsearchfield.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(throttledsearchfield.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(throttledsearchfield, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicSearch', slots, []);
    	let searchingTopics = undefined;

    	const searchTopicsHandler = event => {
    		const topicSearchKey = event.detail;
    		$$invalidate(0, searchingTopics = searchForTopics(topicSearchKey));
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicSearch> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		searchForTopics,
    		LoadingBar,
    		TopicList,
    		ThrottledSearchField,
    		searchingTopics,
    		searchTopicsHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchingTopics' in $$props) $$invalidate(0, searchingTopics = $$props.searchingTopics);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [searchingTopics, searchTopicsHandler];
    }

    class TopicSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicSearch",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\topic\TopicsPanel.svelte generated by Svelte v3.48.0 */
    const file$f = "src\\components\\topic\\TopicsPanel.svelte";

    // (40:8) {:else}
    function create_else_block$3(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*tab*/ ctx[3] == /*Tabs*/ ctx[2].searchTopics && create_if_block_2$1(ctx);
    	let if_block1 = /*tab*/ ctx[3] == /*Tabs*/ ctx[2].searchUsers && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*tab*/ ctx[3] == /*Tabs*/ ctx[2].searchTopics) {
    				if (if_block0) {
    					if (dirty & /*tab, Tabs*/ 12) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*tab*/ ctx[3] == /*Tabs*/ ctx[2].searchUsers) {
    				if (if_block1) {
    					if (dirty & /*tab, Tabs*/ 12) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(40:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#if tab != Tabs.searchTopics && tab != Tabs.searchUsers}
    function create_if_block$7(ctx) {
    	let topiclist;
    	let current;

    	topiclist = new TopicList({
    			props: {
    				topics: /*tab*/ ctx[3] == /*Tabs*/ ctx[2].subscribed
    				? /*subscribedTopics*/ ctx[1]
    				: /*createdTopics*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topiclist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topiclist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topiclist_changes = {};

    			if (dirty & /*tab, Tabs, subscribedTopics, createdTopics*/ 15) topiclist_changes.topics = /*tab*/ ctx[3] == /*Tabs*/ ctx[2].subscribed
    			? /*subscribedTopics*/ ctx[1]
    			: /*createdTopics*/ ctx[0];

    			topiclist.$set(topiclist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topiclist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topiclist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topiclist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(34:8) {#if tab != Tabs.searchTopics && tab != Tabs.searchUsers}",
    		ctx
    	});

    	return block;
    }

    // (41:20) {#if tab == Tabs.searchTopics}
    function create_if_block_2$1(ctx) {
    	let topicsearch;
    	let current;
    	topicsearch = new TopicSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(topicsearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicsearch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicsearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(41:20) {#if tab == Tabs.searchTopics}",
    		ctx
    	});

    	return block;
    }

    // (44:20) {#if tab == Tabs.searchUsers}
    function create_if_block_1$2(ctx) {
    	let usersearch;
    	let current;
    	usersearch = new UserSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(usersearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(usersearch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(usersearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(usersearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(usersearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(44:20) {#if tab == Tabs.searchUsers}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let div2;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$7, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tab*/ ctx[3] != /*Tabs*/ ctx[2].searchTopics && /*tab*/ ctx[3] != /*Tabs*/ ctx[2].searchUsers) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Subscribed";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Created";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Search Topics";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Search Users";
    			t7 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if_block.c();
    			add_location(a0, file$f, 18, 12, 613);
    			toggle_class(li0, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].subscribed);
    			add_location(li0, file$f, 17, 8, 554);
    			add_location(a1, file$f, 21, 12, 750);
    			toggle_class(li1, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].created);
    			add_location(li1, file$f, 20, 8, 694);
    			add_location(a2, file$f, 24, 12, 886);
    			toggle_class(li2, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].searchTopics);
    			add_location(li2, file$f, 23, 8, 825);
    			add_location(a3, file$f, 27, 12, 1032);
    			toggle_class(li3, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].searchUsers);
    			add_location(li3, file$f, 26, 8, 972);
    			add_location(ul, file$f, 16, 4, 541);
    			attr_dev(div0, "class", "tabs");
    			add_location(div0, file$f, 15, 0, 518);
    			attr_dev(div1, "class", "column is-12");
    			add_location(div1, file$f, 32, 4, 1151);
    			attr_dev(div2, "class", "columns");
    			add_location(div2, file$f, 31, 0, 1125);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(a1, "click", /*click_handler_1*/ ctx[5], false, false, false),
    					listen_dev(a2, "click", /*click_handler_2*/ ctx[6], false, false, false),
    					listen_dev(a3, "click", /*click_handler_3*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tab, Tabs*/ 12) {
    				toggle_class(li0, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].subscribed);
    			}

    			if (dirty & /*tab, Tabs*/ 12) {
    				toggle_class(li1, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].created);
    			}

    			if (dirty & /*tab, Tabs*/ 12) {
    				toggle_class(li2, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].searchTopics);
    			}

    			if (dirty & /*tab, Tabs*/ 12) {
    				toggle_class(li3, "is-active", /*tab*/ ctx[3] === /*Tabs*/ ctx[2].searchUsers);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicsPanel', slots, []);
    	var Tabs;

    	(function (Tabs) {
    		Tabs[Tabs["subscribed"] = 0] = "subscribed";
    		Tabs[Tabs["created"] = 1] = "created";
    		Tabs[Tabs["searchTopics"] = 2] = "searchTopics";
    		Tabs[Tabs["searchUsers"] = 3] = "searchUsers";
    	})(Tabs || (Tabs = {}));

    	let { createdTopics } = $$props;
    	let { subscribedTopics } = $$props;
    	let tab = Tabs.subscribed;
    	const writable_props = ['createdTopics', 'subscribedTopics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicsPanel> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(3, tab = Tabs.subscribed);
    	const click_handler_1 = () => $$invalidate(3, tab = Tabs.created);
    	const click_handler_2 = () => $$invalidate(3, tab = Tabs.searchTopics);
    	const click_handler_3 = () => $$invalidate(3, tab = Tabs.searchUsers);

    	$$self.$$set = $$props => {
    		if ('createdTopics' in $$props) $$invalidate(0, createdTopics = $$props.createdTopics);
    		if ('subscribedTopics' in $$props) $$invalidate(1, subscribedTopics = $$props.subscribedTopics);
    	};

    	$$self.$capture_state = () => ({
    		UserSearch,
    		TopicList,
    		TopicSearch,
    		Tabs,
    		createdTopics,
    		subscribedTopics,
    		tab
    	});

    	$$self.$inject_state = $$props => {
    		if ('Tabs' in $$props) $$invalidate(2, Tabs = $$props.Tabs);
    		if ('createdTopics' in $$props) $$invalidate(0, createdTopics = $$props.createdTopics);
    		if ('subscribedTopics' in $$props) $$invalidate(1, subscribedTopics = $$props.subscribedTopics);
    		if ('tab' in $$props) $$invalidate(3, tab = $$props.tab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		createdTopics,
    		subscribedTopics,
    		Tabs,
    		tab,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class TopicsPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { createdTopics: 0, subscribedTopics: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicsPanel",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*createdTopics*/ ctx[0] === undefined && !('createdTopics' in props)) {
    			console.warn("<TopicsPanel> was created without expected prop 'createdTopics'");
    		}

    		if (/*subscribedTopics*/ ctx[1] === undefined && !('subscribedTopics' in props)) {
    			console.warn("<TopicsPanel> was created without expected prop 'subscribedTopics'");
    		}
    	}

    	get createdTopics() {
    		throw new Error("<TopicsPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createdTopics(value) {
    		throw new Error("<TopicsPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subscribedTopics() {
    		throw new Error("<TopicsPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subscribedTopics(value) {
    		throw new Error("<TopicsPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\user\UserDetails.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\components\\user\\UserDetails.svelte";

    function create_fragment$g(ctx) {
    	let div6;
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let p0;
    	let t0;
    	let t1_value = /*user*/ ctx[0].username + "";
    	let t1;
    	let t2;
    	let div1;
    	let p1;
    	let t3;
    	let t4_value = /*user*/ ctx[0].email + "";
    	let t4;
    	let t5;
    	let div5;
    	let topicspanel;
    	let current;

    	topicspanel = new TopicsPanel({
    			props: {
    				createdTopics: /*createdTopics*/ ctx[2],
    				subscribedTopics: /*subscribedTopics*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text("Username: ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t3 = text("Email: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div5 = element("div");
    			create_component(topicspanel.$$.fragment);
    			add_location(p0, file$e, 12, 20, 381);
    			attr_dev(div0, "class", "block");
    			add_location(div0, file$e, 11, 16, 341);
    			add_location(p1, file$e, 18, 20, 540);
    			attr_dev(div1, "class", "block");
    			add_location(div1, file$e, 17, 16, 500);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file$e, 10, 12, 303);
    			attr_dev(div3, "class", "box is-rounded px-3");
    			add_location(div3, file$e, 9, 8, 257);
    			attr_dev(div4, "class", "column is-2");
    			add_location(div4, file$e, 8, 4, 223);
    			attr_dev(div5, "class", "column is-8 is-offset-1");
    			add_location(div5, file$e, 25, 4, 685);
    			attr_dev(div6, "class", "columns");
    			add_location(div6, file$e, 7, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			mount_component(topicspanel, div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*user*/ 1) && t1_value !== (t1_value = /*user*/ ctx[0].username + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*user*/ 1) && t4_value !== (t4_value = /*user*/ ctx[0].email + "")) set_data_dev(t4, t4_value);
    			const topicspanel_changes = {};
    			if (dirty & /*createdTopics*/ 4) topicspanel_changes.createdTopics = /*createdTopics*/ ctx[2];
    			if (dirty & /*subscribedTopics*/ 2) topicspanel_changes.subscribedTopics = /*subscribedTopics*/ ctx[1];
    			topicspanel.$set(topicspanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicspanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicspanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(topicspanel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserDetails', slots, []);
    	let { user } = $$props;
    	let { subscribedTopics } = $$props;
    	let { createdTopics } = $$props;
    	const writable_props = ['user', 'subscribedTopics', 'createdTopics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('subscribedTopics' in $$props) $$invalidate(1, subscribedTopics = $$props.subscribedTopics);
    		if ('createdTopics' in $$props) $$invalidate(2, createdTopics = $$props.createdTopics);
    	};

    	$$self.$capture_state = () => ({
    		TopicsPanel,
    		user,
    		subscribedTopics,
    		createdTopics
    	});

    	$$self.$inject_state = $$props => {
    		if ('user' in $$props) $$invalidate(0, user = $$props.user);
    		if ('subscribedTopics' in $$props) $$invalidate(1, subscribedTopics = $$props.subscribedTopics);
    		if ('createdTopics' in $$props) $$invalidate(2, createdTopics = $$props.createdTopics);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [user, subscribedTopics, createdTopics];
    }

    class UserDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			user: 0,
    			subscribedTopics: 1,
    			createdTopics: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserDetails",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*user*/ ctx[0] === undefined && !('user' in props)) {
    			console.warn("<UserDetails> was created without expected prop 'user'");
    		}

    		if (/*subscribedTopics*/ ctx[1] === undefined && !('subscribedTopics' in props)) {
    			console.warn("<UserDetails> was created without expected prop 'subscribedTopics'");
    		}

    		if (/*createdTopics*/ ctx[2] === undefined && !('createdTopics' in props)) {
    			console.warn("<UserDetails> was created without expected prop 'createdTopics'");
    		}
    	}

    	get user() {
    		throw new Error("<UserDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<UserDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subscribedTopics() {
    		throw new Error("<UserDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subscribedTopics(value) {
    		throw new Error("<UserDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createdTopics() {
    		throw new Error("<UserDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createdTopics(value) {
    		throw new Error("<UserDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\HomePage.svelte generated by Svelte v3.48.0 */
    const file$d = "src\\routes\\HomePage.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let button;
    	let t3;
    	let userdetails;
    	let current;
    	let mounted;
    	let dispose;

    	userdetails = new UserDetails({
    			props: {
    				user: /*currentUser*/ ctx[2],
    				subscribedTopics: /*subTopics*/ ctx[1],
    				createdTopics: /*userTopics*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = `${/*homepage*/ ctx[3]}`;
    			t1 = space();
    			button = element("button");
    			button.textContent = "Create a topic";
    			t3 = space();
    			create_component(userdetails.$$.fragment);
    			add_location(h1, file$d, 22, 4, 769);
    			attr_dev(button, "class", "button is-primary");
    			add_location(button, file$d, 26, 4, 812);
    			attr_dev(div, "class", "content");
    			add_location(div, file$d, 21, 0, 743);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, button);
    			insert_dev(target, t3, anchor);
    			mount_component(userdetails, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*goToNewTopicPage*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const userdetails_changes = {};
    			if (dirty & /*currentUser*/ 4) userdetails_changes.user = /*currentUser*/ ctx[2];
    			if (dirty & /*subTopics*/ 2) userdetails_changes.subscribedTopics = /*subTopics*/ ctx[1];
    			if (dirty & /*userTopics*/ 1) userdetails_changes.createdTopics = /*userTopics*/ ctx[0];
    			userdetails.$set(userdetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			destroy_component(userdetails, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let currentUser;
    	let subTopics;
    	let userTopics;
    	let $createdTopics;
    	let $subscribedTopics;
    	let $user;
    	let $isAuthenticated;
    	validate_store(createdTopics, 'createdTopics');
    	component_subscribe($$self, createdTopics, $$value => $$invalidate(5, $createdTopics = $$value));
    	validate_store(subscribedTopics, 'subscribedTopics');
    	component_subscribe($$self, subscribedTopics, $$value => $$invalidate(6, $subscribedTopics = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(7, $user = $$value));
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(8, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomePage', slots, []);
    	let homepage = 'This is the homepage';

    	onMount(() => {
    		if ($isAuthenticated) {
    			fetchUserDetails();
    			fetchSubscribedTopics();
    			fetchCreatedTopics();
    		}
    	});

    	function goToNewTopicPage() {
    		navigate("/topics/create");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomePage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		UserDetails,
    		homepage,
    		user,
    		fetchUserDetails,
    		isAuthenticated,
    		subscribedTopics,
    		createdTopics,
    		fetchCreatedTopics,
    		fetchSubscribedTopics,
    		onMount,
    		navigate,
    		goToNewTopicPage,
    		userTopics,
    		subTopics,
    		currentUser,
    		$createdTopics,
    		$subscribedTopics,
    		$user,
    		$isAuthenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ('homepage' in $$props) $$invalidate(3, homepage = $$props.homepage);
    		if ('userTopics' in $$props) $$invalidate(0, userTopics = $$props.userTopics);
    		if ('subTopics' in $$props) $$invalidate(1, subTopics = $$props.subTopics);
    		if ('currentUser' in $$props) $$invalidate(2, currentUser = $$props.currentUser);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$user*/ 128) {
    			$$invalidate(2, currentUser = $user);
    		}

    		if ($$self.$$.dirty & /*$subscribedTopics*/ 64) {
    			$$invalidate(1, subTopics = $subscribedTopics);
    		}

    		if ($$self.$$.dirty & /*$createdTopics*/ 32) {
    			$$invalidate(0, userTopics = $createdTopics);
    		}
    	};

    	return [
    		userTopics,
    		subTopics,
    		currentUser,
    		homepage,
    		goToNewTopicPage,
    		$createdTopics,
    		$subscribedTopics,
    		$user
    	];
    }

    class HomePage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomePage",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\message\MessageForm.svelte generated by Svelte v3.48.0 */
    const file$c = "src\\components\\message\\MessageForm.svelte";

    function create_fragment$e(ctx) {
    	let form;
    	let div3;
    	let textarea;
    	let t0;
    	let div2;
    	let div1;
    	let div0;
    	let button;
    	let t1;
    	let button_class_value;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			form = element("form");
    			div3 = element("div");
    			textarea = element("textarea");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button = element("button");
    			t1 = text("Send");
    			attr_dev(textarea, "class", "textarea");
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "id", "message");
    			attr_dev(textarea, "cols", "100");
    			attr_dev(textarea, "rows", "5");
    			attr_dev(textarea, "placeholder", "Message text content");
    			add_location(textarea, file$c, 17, 8, 528);
    			attr_dev(button, "class", button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[3]}`);
    			attr_dev(button, "type", "submit");
    			button.disabled = button_disabled_value = !/*messageIsValid*/ ctx[2] || /*handlingEvent*/ ctx[0];
    			add_location(button, file$c, 29, 20, 899);
    			attr_dev(div0, "class", "level-item");
    			add_location(div0, file$c, 28, 16, 854);
    			attr_dev(div1, "class", "level-right");
    			add_location(div1, file$c, 27, 12, 812);
    			attr_dev(div2, "class", "levels my-2");
    			add_location(div2, file$c, 26, 8, 774);
    			attr_dev(div3, "class", "field");
    			add_location(div3, file$c, 16, 4, 500);
    			add_location(form, file$c, 15, 0, 450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div3);
    			append_dev(div3, textarea);
    			set_input_value(textarea, /*messageData*/ ctx[1].content);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*sendMessage*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*messageData*/ 2) {
    				set_input_value(textarea, /*messageData*/ ctx[1].content);
    			}

    			if (dirty & /*isLoadingClass*/ 8 && button_class_value !== (button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[3]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*messageIsValid, handlingEvent*/ 5 && button_disabled_value !== (button_disabled_value = !/*messageIsValid*/ ctx[2] || /*handlingEvent*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageForm', slots, []);
    	let messageData = { topic: "", content: "" };
    	let messageIsValid = false;
    	const dispatch = createEventDispatcher();
    	let { handlingEvent = true } = $$props;
    	let isLoadingClass = "";

    	function sendMessage() {
    		dispatch("send-message", messageData);
    	}

    	const writable_props = ['handlingEvent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageForm> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		messageData.content = this.value;
    		$$invalidate(1, messageData);
    	}

    	$$self.$$set = $$props => {
    		if ('handlingEvent' in $$props) $$invalidate(0, handlingEvent = $$props.handlingEvent);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		messageData,
    		messageIsValid,
    		dispatch,
    		handlingEvent,
    		isLoadingClass,
    		sendMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ('messageData' in $$props) $$invalidate(1, messageData = $$props.messageData);
    		if ('messageIsValid' in $$props) $$invalidate(2, messageIsValid = $$props.messageIsValid);
    		if ('handlingEvent' in $$props) $$invalidate(0, handlingEvent = $$props.handlingEvent);
    		if ('isLoadingClass' in $$props) $$invalidate(3, isLoadingClass = $$props.isLoadingClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*messageData*/ 2) {
    			$$invalidate(2, messageIsValid = messageData.content.length > 10);
    		}

    		if ($$self.$$.dirty & /*handlingEvent*/ 1) {
    			{
    				$$invalidate(3, isLoadingClass = handlingEvent ? "is-loading" : "");
    			}
    		}
    	};

    	return [
    		handlingEvent,
    		messageData,
    		messageIsValid,
    		isLoadingClass,
    		sendMessage,
    		textarea_input_handler
    	];
    }

    class MessageForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { handlingEvent: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageForm",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get handlingEvent() {
    		throw new Error("<MessageForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handlingEvent(value) {
    		throw new Error("<MessageForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\message\MessageListItem.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\components\\message\\MessageListItem.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let div1;
    	let span;
    	let t0;
    	let t1;
    	let div0;
    	let p;
    	let t2_value = /*message*/ ctx[0].content + "";
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div1 = element("div");
    			span = element("span");
    			t0 = text(/*sentAtString*/ ctx[1]);
    			t1 = space();
    			div0 = element("div");
    			p = element("p");
    			t2 = text(t2_value);
    			attr_dev(span, "class", "tag is-info");
    			add_location(span, file$b, 11, 8, 357);
    			add_location(p, file$b, 15, 12, 469);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file$b, 14, 8, 435);
    			attr_dev(div1, "class", "notification my-1");
    			add_location(div1, file$b, 10, 4, 317);
    			add_location(li, file$b, 9, 0, 308);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div1);
    			append_dev(div1, span);
    			append_dev(span, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sentAtString*/ 2) set_data_dev(t0, /*sentAtString*/ ctx[1]);
    			if (dirty & /*message*/ 1 && t2_value !== (t2_value = /*message*/ ctx[0].content + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageListItem', slots, []);
    	let { message = new Message() } = $$props;
    	let sentAtString = formatDate(new Date(message.timestamp * 1000));
    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({
    		Message,
    		formatDate,
    		message,
    		sentAtString
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('sentAtString' in $$props) $$invalidate(1, sentAtString = $$props.sentAtString);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*message*/ 1) {
    			{
    				$$invalidate(1, sentAtString = formatDate(new Date(message.timestamp * 1000)));
    			}
    		}
    	};

    	return [message, sentAtString];
    }

    class MessageListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageListItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get message() {
    		throw new Error("<MessageListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<MessageListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\message\MessageList.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\components\\message\\MessageList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (11:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No messages to display";
    			attr_dev(p, "class", "content");
    			add_location(p, file$a, 12, 8, 324);
    			attr_dev(div, "class", "container");
    			add_location(div, file$a, 11, 4, 292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if messages.length}
    function create_if_block$6(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*message*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "scroll-box");
    			add_location(ul, file$a, 5, 4, 139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(5:0) {#if messages.length}",
    		ctx
    	});

    	return block;
    }

    // (7:8) {#each messages as message (message.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let messagelistitem;
    	let current;

    	messagelistitem = new MessageListItem({
    			props: { message: /*message*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(messagelistitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(messagelistitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const messagelistitem_changes = {};
    			if (dirty & /*messages*/ 1) messagelistitem_changes.message = /*message*/ ctx[1];
    			messagelistitem.$set(messagelistitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagelistitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagelistitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(messagelistitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(7:8) {#each messages as message (message.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*messages*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageList', slots, []);
    	let { messages = [] } = $$props;
    	const writable_props = ['messages'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MessageList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('messages' in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	$$self.$capture_state = () => ({ MessageListItem, messages });

    	$$self.$inject_state = $$props => {
    		if ('messages' in $$props) $$invalidate(0, messages = $$props.messages);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [messages];
    }

    class MessageList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { messages: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageList",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get messages() {
    		throw new Error("<MessageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messages(value) {
    		throw new Error("<MessageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\topic\TopicInfo.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\components\\topic\\TopicInfo.svelte";

    // (17:8) {:else}
    function create_else_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "This topic is private";
    			add_location(p, file$9, 17, 12, 465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(17:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:8) {#if topic.public}
    function create_if_block$5(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "This topic is public";
    			add_location(p, file$9, 15, 12, 409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(15:8) {#if topic.public}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div1;
    	let h1;
    	let t0_value = /*topic*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let h2;
    	let t2;
    	let a;
    	let t3_value = /*topic*/ ctx[0].admin + "";
    	let t3;
    	let a_href_value;
    	let t4;
    	let div0;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*topic*/ ctx[0].public) return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("by ");
    			a = element("a");
    			t3 = text(t3_value);
    			t4 = space();
    			div0 = element("div");
    			if_block.c();
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$9, 5, 4, 114);
    			attr_dev(a, "class", "button is-link is-small is-rounded");
    			attr_dev(a, "href", a_href_value = `/user/${/*topic*/ ctx[0].admin}`);
    			add_location(a, file$9, 7, 11, 188);
    			attr_dev(h2, "class", "subtitle");
    			add_location(h2, file$9, 6, 4, 155);
    			attr_dev(div0, "class", "block");
    			add_location(div0, file$9, 13, 4, 350);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$9, 4, 0, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, h2);
    			append_dev(h2, t2);
    			append_dev(h2, a);
    			append_dev(a, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			if_block.m(div0, null);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*topic*/ 1 && t0_value !== (t0_value = /*topic*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*topic*/ 1 && t3_value !== (t3_value = /*topic*/ ctx[0].admin + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*topic*/ 1 && a_href_value !== (a_href_value = `/user/${/*topic*/ ctx[0].admin}`)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicInfo', slots, []);
    	let { topic } = $$props;
    	const writable_props = ['topic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicInfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	$$self.$capture_state = () => ({ link, topic });

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [topic];
    }

    class TopicInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { topic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicInfo",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console.warn("<TopicInfo> was created without expected prop 'topic'");
    		}
    	}

    	get topic() {
    		throw new Error("<TopicInfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<TopicInfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\topic\SubscriptionToggler.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\components\\topic\\SubscriptionToggler.svelte";

    // (29:4) {#if !topic.public}
    function create_if_block_1$1(ctx) {
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			label.textContent = "Topic password";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "for", "password");
    			add_location(label, file$8, 29, 8, 798);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "name", "password");
    			attr_dev(input, "id", "password");
    			attr_dev(input, "placeholder", "Insert topic password...");
    			add_location(input, file$8, 30, 8, 851);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*subscribeData*/ ctx[3].password);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subscribeData*/ 8 && input.value !== /*subscribeData*/ ctx[3].password) {
    				set_input_value(input, /*subscribeData*/ ctx[3].password);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(29:4) {#if !topic.public}",
    		ctx
    	});

    	return block;
    }

    // (46:4) {:else}
    function create_else_block(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Subscribe");
    			attr_dev(button, "class", button_class_value = `button is-primary ${/*loadingButtonClass*/ ctx[4]}`);
    			button.disabled = /*changingSubscriptionStatus*/ ctx[1];
    			add_location(button, file$8, 46, 8, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*subscribe*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loadingButtonClass*/ 16 && button_class_value !== (button_class_value = `button is-primary ${/*loadingButtonClass*/ ctx[4]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*changingSubscriptionStatus*/ 2) {
    				prop_dev(button, "disabled", /*changingSubscriptionStatus*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(46:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if subscribed}
    function create_if_block$4(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Unsubscribe");
    			attr_dev(button, "class", button_class_value = `button is-primary is-outlined ${/*loadingButtonClass*/ ctx[4]}`);
    			button.disabled = /*changingSubscriptionStatus*/ ctx[1];
    			add_location(button, file$8, 40, 8, 1090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*unsubscribe*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loadingButtonClass*/ 16 && button_class_value !== (button_class_value = `button is-primary is-outlined ${/*loadingButtonClass*/ ctx[4]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*changingSubscriptionStatus*/ 2) {
    				prop_dev(button, "disabled", /*changingSubscriptionStatus*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:4) {#if subscribed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t;
    	let if_block0 = !/*topic*/ ctx[0].public && create_if_block_1$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*subscribed*/ ctx[2]) return create_if_block$4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			add_location(div, file$8, 27, 0, 760);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*topic*/ ctx[0].public) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SubscriptionToggler', slots, []);
    	let { topic } = $$props;
    	let { user } = $$props;
    	let subscribed;
    	let changingSubscriptionStatus = false;
    	let subscribeData = { id: topic.id, password: "" };
    	let loadingButtonClass;

    	function subscribe() {
    		$$invalidate(1, changingSubscriptionStatus = true);

    		subscribeToTopic(subscribeData).then(_ => {
    			$$invalidate(1, changingSubscriptionStatus = false);
    		});
    	}

    	function unsubscribe() {
    		$$invalidate(1, changingSubscriptionStatus = true);

    		unsubscribeToTopic(topic.title).then(_ => {
    			$$invalidate(1, changingSubscriptionStatus = false);
    		});
    	}

    	const writable_props = ['topic', 'user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SubscriptionToggler> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		subscribeData.password = this.value;
    		$$invalidate(3, subscribeData);
    	}

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('user' in $$props) $$invalidate(7, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({
    		subscribeToTopic,
    		unsubscribeToTopic,
    		topic,
    		user,
    		subscribed,
    		changingSubscriptionStatus,
    		subscribeData,
    		loadingButtonClass,
    		subscribe,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('user' in $$props) $$invalidate(7, user = $$props.user);
    		if ('subscribed' in $$props) $$invalidate(2, subscribed = $$props.subscribed);
    		if ('changingSubscriptionStatus' in $$props) $$invalidate(1, changingSubscriptionStatus = $$props.changingSubscriptionStatus);
    		if ('subscribeData' in $$props) $$invalidate(3, subscribeData = $$props.subscribeData);
    		if ('loadingButtonClass' in $$props) $$invalidate(4, loadingButtonClass = $$props.loadingButtonClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*changingSubscriptionStatus*/ 2) {
    			{
    				$$invalidate(4, loadingButtonClass = changingSubscriptionStatus ? "is-loading" : "");
    			}
    		}

    		if ($$self.$$.dirty & /*user, topic*/ 129) {
    			{
    				$$invalidate(2, subscribed = user.topics[topic.title]);
    			}
    		}
    	};

    	return [
    		topic,
    		changingSubscriptionStatus,
    		subscribed,
    		subscribeData,
    		loadingButtonClass,
    		subscribe,
    		unsubscribe,
    		user,
    		input_input_handler
    	];
    }

    class SubscriptionToggler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { topic: 0, user: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SubscriptionToggler",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console.warn("<SubscriptionToggler> was created without expected prop 'topic'");
    		}

    		if (/*user*/ ctx[7] === undefined && !('user' in props)) {
    			console.warn("<SubscriptionToggler> was created without expected prop 'user'");
    		}
    	}

    	get topic() {
    		throw new Error("<SubscriptionToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<SubscriptionToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user() {
    		throw new Error("<SubscriptionToggler>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<SubscriptionToggler>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\utils\LoadingSpinner.svelte generated by Svelte v3.48.0 */

    const file$7 = "src\\components\\utils\\LoadingSpinner.svelte";

    function create_fragment$9(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "button is-static is-loading is-large");
    			add_location(button, file$7, 2, 0, 29);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingSpinner', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingSpinner> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingSpinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingSpinner",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\message\MessageTimeFilter.svelte generated by Svelte v3.48.0 */

    const { console: console_1$1 } = globals;
    const file$6 = "src\\components\\message\\MessageTimeFilter.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let label;
    	let t0;
    	let select;
    	let option0;
    	let t1;
    	let option0_value_value;
    	let option1;
    	let t2;
    	let option1_value_value;
    	let option2;
    	let t3;
    	let option2_value_value;
    	let option3;
    	let t4;
    	let option3_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			t0 = space();
    			select = element("select");
    			option0 = element("option");
    			t1 = text("Today");
    			option1 = element("option");
    			t2 = text("This Month");
    			option2 = element("option");
    			t3 = text("This Year");
    			option3 = element("option");
    			t4 = text("All");
    			attr_dev(label, "for", "after");
    			attr_dev(label, "class", "label");
    			add_location(label, file$6, 30, 4, 866);
    			option0.__value = option0_value_value = /*Options*/ ctx[0].today;
    			option0.value = option0.__value;
    			add_location(option0, file$6, 32, 8, 990);
    			option1.__value = option1_value_value = /*Options*/ ctx[0].thisMonth;
    			option1.value = option1.__value;
    			add_location(option1, file$6, 33, 8, 1043);
    			option2.__value = option2_value_value = /*Options*/ ctx[0].thisYear;
    			option2.value = option2.__value;
    			add_location(option2, file$6, 34, 8, 1105);
    			option3.__value = option3_value_value = /*Options*/ ctx[0].all;
    			option3.value = option3.__value;
    			add_location(option3, file$6, 35, 8, 1165);
    			attr_dev(select, "name", "after");
    			attr_dev(select, "id", "after");
    			attr_dev(select, "class", "select");
    			if (/*selectedOption*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[2].call(select));
    			add_location(select, file$6, 31, 4, 906);
    			attr_dev(div, "class", "field");
    			add_location(div, file$6, 29, 0, 842);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t0);
    			append_dev(div, select);
    			append_dev(select, option0);
    			append_dev(option0, t1);
    			append_dev(select, option1);
    			append_dev(option1, t2);
    			append_dev(select, option2);
    			append_dev(option2, t3);
    			append_dev(select, option3);
    			append_dev(option3, t4);
    			select_option(select, /*selectedOption*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Options*/ 1 && option0_value_value !== (option0_value_value = /*Options*/ ctx[0].today)) {
    				prop_dev(option0, "__value", option0_value_value);
    				option0.value = option0.__value;
    			}

    			if (dirty & /*Options*/ 1 && option1_value_value !== (option1_value_value = /*Options*/ ctx[0].thisMonth)) {
    				prop_dev(option1, "__value", option1_value_value);
    				option1.value = option1.__value;
    			}

    			if (dirty & /*Options*/ 1 && option2_value_value !== (option2_value_value = /*Options*/ ctx[0].thisYear)) {
    				prop_dev(option2, "__value", option2_value_value);
    				option2.value = option2.__value;
    			}

    			if (dirty & /*Options*/ 1 && option3_value_value !== (option3_value_value = /*Options*/ ctx[0].all)) {
    				prop_dev(option3, "__value", option3_value_value);
    				option3.value = option3.__value;
    			}

    			if (dirty & /*selectedOption, Options*/ 3) {
    				select_option(select, /*selectedOption*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const event = "filter-change";

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MessageTimeFilter', slots, []);
    	var Options;

    	(function (Options) {
    		Options[Options["today"] = 0] = "today";
    		Options[Options["thisMonth"] = 1] = "thisMonth";
    		Options[Options["thisYear"] = 2] = "thisYear";
    		Options[Options["all"] = 3] = "all";
    	})(Options || (Options = {}));

    	let selectedOption = Options.today;
    	const dispatch = createEventDispatcher();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MessageTimeFilter> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selectedOption = select_value(this);
    		$$invalidate(1, selectedOption);
    		$$invalidate(0, Options);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Options,
    		event,
    		selectedOption,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('Options' in $$props) $$invalidate(0, Options = $$props.Options);
    		if ('selectedOption' in $$props) $$invalidate(1, selectedOption = $$props.selectedOption);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedOption, Options*/ 3) {
    			{
    				let date = new Date();

    				if (selectedOption == Options.thisMonth) {
    					date.setDate(1);
    				}

    				if (selectedOption == Options.thisYear) {
    					date.setDate(1);
    					date.setMonth(0);
    				}

    				if (selectedOption == Options.all) {
    					date = new Date(0);
    				}

    				console.log(selectedOption);
    				console.log(date);
    				dispatch(event, date);
    			}
    		}
    	};

    	return [Options, selectedOption, select_change_handler];
    }

    class MessageTimeFilter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MessageTimeFilter",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\topic\TopicDetails.svelte generated by Svelte v3.48.0 */
    const file$5 = "src\\components\\topic\\TopicDetails.svelte";

    // (46:12) {#if !isAdmin}
    function create_if_block_2(ctx) {
    	let messagetimefilter;
    	let t;
    	let subscriptiontoggler;
    	let current;
    	messagetimefilter = new MessageTimeFilter({ $$inline: true });
    	messagetimefilter.$on("filter-change", /*changeAfter*/ ctx[8]);

    	subscriptiontoggler = new SubscriptionToggler({
    			props: {
    				user: /*user*/ ctx[1],
    				topic: /*topic*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagetimefilter.$$.fragment);
    			t = space();
    			create_component(subscriptiontoggler.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagetimefilter, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(subscriptiontoggler, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const subscriptiontoggler_changes = {};
    			if (dirty & /*user*/ 2) subscriptiontoggler_changes.user = /*user*/ ctx[1];
    			if (dirty & /*topic*/ 1) subscriptiontoggler_changes.topic = /*topic*/ ctx[0];
    			subscriptiontoggler.$set(subscriptiontoggler_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagetimefilter.$$.fragment, local);
    			transition_in(subscriptiontoggler.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagetimefilter.$$.fragment, local);
    			transition_out(subscriptiontoggler.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagetimefilter, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(subscriptiontoggler, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(46:12) {#if !isAdmin}",
    		ctx
    	});

    	return block;
    }

    // (55:12) {#if isAdmin || subscribed}
    function create_if_block_1(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 11,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*fetchingMessages*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*fetchingMessages*/ 16 && promise !== (promise = /*fetchingMessages*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(55:12) {#if isAdmin || subscribed}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import { viewedTopic }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { viewedTopic }",
    		ctx
    	});

    	return block;
    }

    // (58:16) {:then _}
    function create_then_block$2(ctx) {
    	let messagelist;
    	let current;

    	messagelist = new MessageList({
    			props: { messages: /*$messages*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(messagelist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messagelist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messagelist_changes = {};
    			if (dirty & /*$messages*/ 64) messagelist_changes.messages = /*$messages*/ ctx[6];
    			messagelist.$set(messagelist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messagelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messagelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messagelist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(58:16) {:then _}",
    		ctx
    	});

    	return block;
    }

    // (56:41)                      <LoadingSpinner />                 {:then _}
    function create_pending_block$2(ctx) {
    	let loadingspinner;
    	let current;
    	loadingspinner = new LoadingSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingspinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingspinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingspinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingspinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingspinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(56:41)                      <LoadingSpinner />                 {:then _}",
    		ctx
    	});

    	return block;
    }

    // (63:12) {#if isAdmin}
    function create_if_block$3(ctx) {
    	let messageform;
    	let current;

    	messageform = new MessageForm({
    			props: { handlingEvent: /*sendingMessage*/ ctx[5] },
    			$$inline: true
    		});

    	messageform.$on("send-message", /*send*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(messageform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(messageform, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const messageform_changes = {};
    			if (dirty & /*sendingMessage*/ 32) messageform_changes.handlingEvent = /*sendingMessage*/ ctx[5];
    			messageform.$set(messageform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(messageform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(messageform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(messageform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(63:12) {#if isAdmin}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let topicinfo;
    	let t0;
    	let t1;
    	let div3;
    	let div2;
    	let t2;
    	let current;

    	topicinfo = new TopicInfo({
    			props: { topic: /*topic*/ ctx[0] },
    			$$inline: true
    		});

    	let if_block0 = !/*isAdmin*/ ctx[3] && create_if_block_2(ctx);
    	let if_block1 = (/*isAdmin*/ ctx[3] || /*subscribed*/ ctx[2]) && create_if_block_1(ctx);
    	let if_block2 = /*isAdmin*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(topicinfo.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "box");
    			add_location(div0, file$5, 42, 8, 1285);
    			attr_dev(div1, "class", "column is-3");
    			add_location(div1, file$5, 41, 4, 1251);
    			attr_dev(div2, "class", "box is-flex");
    			add_location(div2, file$5, 53, 8, 1591);
    			attr_dev(div3, "class", "column is-offset-1 is-narrow");
    			add_location(div3, file$5, 52, 4, 1540);
    			attr_dev(div4, "class", "columns my-5");
    			add_location(div4, file$5, 40, 0, 1220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			mount_component(topicinfo, div0, null);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t2);
    			if (if_block2) if_block2.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const topicinfo_changes = {};
    			if (dirty & /*topic*/ 1) topicinfo_changes.topic = /*topic*/ ctx[0];
    			topicinfo.$set(topicinfo_changes);

    			if (!/*isAdmin*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isAdmin*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isAdmin*/ ctx[3] || /*subscribed*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*isAdmin, subscribed*/ 12) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*isAdmin*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*isAdmin*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicinfo.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicinfo.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(topicinfo);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $viewedTopic;
    	let $messages;
    	validate_store(viewedTopic, 'viewedTopic');
    	component_subscribe($$self, viewedTopic, $$value => $$invalidate(10, $viewedTopic = $$value));
    	validate_store(messages, 'messages');
    	component_subscribe($$self, messages, $$value => $$invalidate(6, $messages = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicDetails', slots, []);
    	let { topic } = $$props;
    	let { user } = $$props;
    	let subscribed;
    	let isAdmin;
    	let fetchingMessages;
    	let after = new Date();
    	let sendingMessage = false;

    	function send(event) {
    		const messageData = event.detail;
    		messageData.topic = $viewedTopic.id;
    		$$invalidate(5, sendingMessage = true);

    		sendMessage(messageData).then(_ => {
    			$$invalidate(5, sendingMessage = false);
    		});
    	}

    	function changeAfter(event) {
    		$$invalidate(9, after = event.detail);
    	}

    	const writable_props = ['topic', 'user'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicDetails> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    	};

    	$$self.$capture_state = () => ({
    		viewedTopic,
    		messages,
    		fetchMessages,
    		MessageForm,
    		MessageList,
    		TopicInfo,
    		sendMessage,
    		SubscriptionToggler,
    		LoadingSpinner,
    		MessageTimeFilter,
    		topic,
    		user,
    		subscribed,
    		isAdmin,
    		fetchingMessages,
    		after,
    		sendingMessage,
    		send,
    		changeAfter,
    		$viewedTopic,
    		$messages
    	});

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    		if ('user' in $$props) $$invalidate(1, user = $$props.user);
    		if ('subscribed' in $$props) $$invalidate(2, subscribed = $$props.subscribed);
    		if ('isAdmin' in $$props) $$invalidate(3, isAdmin = $$props.isAdmin);
    		if ('fetchingMessages' in $$props) $$invalidate(4, fetchingMessages = $$props.fetchingMessages);
    		if ('after' in $$props) $$invalidate(9, after = $$props.after);
    		if ('sendingMessage' in $$props) $$invalidate(5, sendingMessage = $$props.sendingMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*user, topic*/ 3) {
    			{
    				$$invalidate(2, subscribed = user.topics && user.topics[topic.title]);
    			}
    		}

    		if ($$self.$$.dirty & /*user, topic*/ 3) {
    			{
    				$$invalidate(3, isAdmin = user.username === topic.admin);
    			}
    		}

    		if ($$self.$$.dirty & /*subscribed, isAdmin, topic, after*/ 525) {
    			{
    				if (subscribed || isAdmin) {
    					$$invalidate(4, fetchingMessages = fetchMessages(topic.title, after));
    				}
    			}
    		}
    	};

    	return [
    		topic,
    		user,
    		subscribed,
    		isAdmin,
    		fetchingMessages,
    		sendingMessage,
    		$messages,
    		send,
    		changeAfter,
    		after
    	];
    }

    class TopicDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { topic: 0, user: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicDetails",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topic*/ ctx[0] === undefined && !('topic' in props)) {
    			console.warn("<TopicDetails> was created without expected prop 'topic'");
    		}

    		if (/*user*/ ctx[1] === undefined && !('user' in props)) {
    			console.warn("<TopicDetails> was created without expected prop 'user'");
    		}
    	}

    	get topic() {
    		throw new Error("<TopicDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<TopicDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get user() {
    		throw new Error("<TopicDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set user(value) {
    		throw new Error("<TopicDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\TopicDetailsPage.svelte generated by Svelte v3.48.0 */

    // (1:0) <script lang="ts">import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (18:0) {:then _}
    function create_then_block$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$viewedTopic*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$viewedTopic*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$viewedTopic*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(18:0) {:then _}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if $viewedTopic}
    function create_if_block$2(ctx) {
    	let topicdetails;
    	let current;

    	topicdetails = new TopicDetails({
    			props: {
    				topic: /*$viewedTopic*/ ctx[1],
    				user: /*$user*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topicdetails.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicdetails, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topicdetails_changes = {};
    			if (dirty & /*$viewedTopic*/ 2) topicdetails_changes.topic = /*$viewedTopic*/ ctx[1];
    			if (dirty & /*$user*/ 4) topicdetails_changes.user = /*$user*/ ctx[2];
    			topicdetails.$set(topicdetails_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicdetails.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicdetails.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicdetails, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(19:4) {#if $viewedTopic}",
    		ctx
    	});

    	return block;
    }

    // (16:20)      <LoadingSpinner /> {:then _}
    function create_pending_block$1(ctx) {
    	let loadingspinner;
    	let current;
    	loadingspinner = new LoadingSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingspinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingspinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingspinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingspinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingspinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(16:20)      <LoadingSpinner /> {:then _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*dataFetched*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*dataFetched*/ 1 && promise !== (promise = /*dataFetched*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $viewedTopic;
    	let $user;
    	validate_store(viewedTopic, 'viewedTopic');
    	component_subscribe($$self, viewedTopic, $$value => $$invalidate(1, $viewedTopic = $$value));
    	validate_store(user, 'user');
    	component_subscribe($$self, user, $$value => $$invalidate(2, $user = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicDetailsPage', slots, []);
    	let { topicId } = $$props;
    	let dataFetched;

    	onMount(() => {
    		$$invalidate(0, dataFetched = Promise.all([fetchTopicDetails(topicId), fetchUserDetails()]));
    	});

    	const writable_props = ['topicId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicDetailsPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topicId' in $$props) $$invalidate(3, topicId = $$props.topicId);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		TopicDetails,
    		user,
    		fetchUserDetails,
    		viewedTopic,
    		fetchTopicDetails,
    		LoadingSpinner,
    		topicId,
    		dataFetched,
    		$viewedTopic,
    		$user
    	});

    	$$self.$inject_state = $$props => {
    		if ('topicId' in $$props) $$invalidate(3, topicId = $$props.topicId);
    		if ('dataFetched' in $$props) $$invalidate(0, dataFetched = $$props.dataFetched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataFetched, $viewedTopic, $user, topicId];
    }

    class TopicDetailsPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { topicId: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicDetailsPage",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*topicId*/ ctx[3] === undefined && !('topicId' in props)) {
    			console.warn("<TopicDetailsPage> was created without expected prop 'topicId'");
    		}
    	}

    	get topicId() {
    		throw new Error("<TopicDetailsPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topicId(value) {
    		throw new Error("<TopicDetailsPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\topic\TopicForm.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\topic\\TopicForm.svelte";

    // (43:16) {#if !topicData.public}
    function create_if_block$1(ctx) {
    	let div;
    	let label;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Password";
    			t1 = space();
    			input = element("input");
    			attr_dev(label, "class", "label");
    			attr_dev(label, "for", "password");
    			add_location(label, file$4, 44, 24, 1538);
    			attr_dev(input, "type", "password");
    			attr_dev(input, "name", "password");
    			attr_dev(input, "id", "password");
    			attr_dev(input, "class", "input");
    			attr_dev(input, "placeholder", "Password for other users to access the topic");
    			add_location(input, file$4, 45, 24, 1615);
    			attr_dev(div, "class", "field");
    			add_location(div, file$4, 43, 20, 1494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			append_dev(div, input);
    			set_input_value(input, /*topicData*/ ctx[1].password);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[7]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*topicData*/ 2 && input.value !== /*topicData*/ ctx[1].password) {
    				set_input_value(input, /*topicData*/ ctx[1].password);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(43:16) {#if !topicData.public}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let t6;
    	let button;
    	let t7;
    	let button_class_value;
    	let button_disabled_value;
    	let mounted;
    	let dispose;
    	let if_block = !/*topicData*/ ctx[1].public && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Title";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Public";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			button = element("button");
    			t7 = text("Create Topic");
    			attr_dev(label0, "class", "label");
    			attr_dev(label0, "for", "title");
    			add_location(label0, file$4, 19, 20, 659);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "title");
    			attr_dev(input0, "id", "title");
    			attr_dev(input0, "class", "input");
    			attr_dev(input0, "placeholder", "Title of the topic");
    			add_location(input0, file$4, 20, 20, 726);
    			attr_dev(div0, "class", "field");
    			add_location(div0, file$4, 18, 16, 619);
    			attr_dev(label1, "class", "label");
    			attr_dev(label1, "for", "public");
    			add_location(label1, file$4, 31, 20, 1099);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "name", "public");
    			attr_dev(input1, "id", "public");
    			attr_dev(input1, "class", "checkbox");
    			add_location(input1, file$4, 32, 20, 1168);
    			attr_dev(div1, "class", "field levels");
    			add_location(div1, file$4, 30, 16, 1052);
    			attr_dev(button, "class", button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[2]}`);
    			attr_dev(button, "type", "submit");
    			button.disabled = button_disabled_value = !/*validTopic*/ ctx[3] || /*handlingEvent*/ ctx[0];
    			add_location(button, file$4, 56, 16, 2053);
    			add_location(form, file$4, 17, 12, 557);
    			attr_dev(div2, "class", "box my-5");
    			add_location(div2, file$4, 16, 8, 522);
    			attr_dev(div3, "class", "column is-6 is-offset-3");
    			add_location(div3, file$4, 15, 4, 476);
    			attr_dev(div4, "class", "columns");
    			add_location(div4, file$4, 14, 0, 450);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*topicData*/ ctx[1].title);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			input1.checked = /*topicData*/ ctx[1].public;
    			append_dev(form, t5);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t6);
    			append_dev(form, button);
    			append_dev(button, t7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*createTopic*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*topicData*/ 2 && input0.value !== /*topicData*/ ctx[1].title) {
    				set_input_value(input0, /*topicData*/ ctx[1].title);
    			}

    			if (dirty & /*topicData*/ 2) {
    				input1.checked = /*topicData*/ ctx[1].public;
    			}

    			if (!/*topicData*/ ctx[1].public) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(form, t6);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*isLoadingClass*/ 4 && button_class_value !== (button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[2]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*validTopic, handlingEvent*/ 9 && button_disabled_value !== (button_disabled_value = !/*validTopic*/ ctx[3] || /*handlingEvent*/ ctx[0])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let validTopic;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicForm', slots, []);
    	let topicData = { title: "", public: false, password: "" };
    	const dispatch = createEventDispatcher();
    	let { handlingEvent = false } = $$props;
    	let isLoadingClass = "";

    	function createTopic() {
    		dispatch("create-topic", topicData);
    	}

    	const writable_props = ['handlingEvent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		topicData.title = this.value;
    		$$invalidate(1, topicData);
    	}

    	function input1_change_handler() {
    		topicData.public = this.checked;
    		$$invalidate(1, topicData);
    	}

    	function input_input_handler() {
    		topicData.password = this.value;
    		$$invalidate(1, topicData);
    	}

    	$$self.$$set = $$props => {
    		if ('handlingEvent' in $$props) $$invalidate(0, handlingEvent = $$props.handlingEvent);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		topicData,
    		dispatch,
    		handlingEvent,
    		isLoadingClass,
    		createTopic,
    		validTopic
    	});

    	$$self.$inject_state = $$props => {
    		if ('topicData' in $$props) $$invalidate(1, topicData = $$props.topicData);
    		if ('handlingEvent' in $$props) $$invalidate(0, handlingEvent = $$props.handlingEvent);
    		if ('isLoadingClass' in $$props) $$invalidate(2, isLoadingClass = $$props.isLoadingClass);
    		if ('validTopic' in $$props) $$invalidate(3, validTopic = $$props.validTopic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*topicData*/ 2) {
    			$$invalidate(3, validTopic = topicData.public || topicData.password.length >= 12);
    		}

    		if ($$self.$$.dirty & /*handlingEvent*/ 1) {
    			{
    				$$invalidate(2, isLoadingClass = handlingEvent ? "is-loading" : "");
    			}
    		}
    	};

    	return [
    		handlingEvent,
    		topicData,
    		isLoadingClass,
    		validTopic,
    		createTopic,
    		input0_input_handler,
    		input1_change_handler,
    		input_input_handler
    	];
    }

    class TopicForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { handlingEvent: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicForm",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get handlingEvent() {
    		throw new Error("<TopicForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handlingEvent(value) {
    		throw new Error("<TopicForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\NewTopic.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;

    function create_fragment$4(ctx) {
    	let topicform;
    	let current;
    	topicform = new TopicForm({ $$inline: true });
    	topicform.$on("create-topic", /*createNewTopic*/ ctx[0]);

    	const block = {
    		c: function create() {
    			create_component(topicform.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewTopic', slots, []);

    	function createNewTopic(event) {
    		const topicData = event.detail;
    		console.log('make network call to create topic');
    		console.log(topicData);
    		createTopic(topicData);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<NewTopic> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ TopicForm, createTopic, createNewTopic });
    	return [createNewTopic];
    }

    class NewTopic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewTopic",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\Login.svelte generated by Svelte v3.48.0 */
    const file$3 = "src\\routes\\Login.svelte";

    function create_fragment$3(ctx) {
    	let div7;
    	let div6;
    	let div5;
    	let div4;
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let div0;
    	let input0;
    	let t2;
    	let div3;
    	let label1;
    	let t4;
    	let div2;
    	let input1;
    	let t5;
    	let button;
    	let t6;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Username";
    			t1 = space();
    			div0 = element("div");
    			input0 = element("input");
    			t2 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Password";
    			t4 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t5 = space();
    			button = element("button");
    			t6 = text("Log in");
    			attr_dev(label0, "class", "label");
    			attr_dev(label0, "for", "username");
    			add_location(label0, file$3, 32, 24, 952);
    			attr_dev(input0, "class", "input");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "username");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "placeholder", "Type username...");
    			add_location(input0, file$3, 34, 28, 1079);
    			attr_dev(div0, "class", "control");
    			add_location(div0, file$3, 33, 24, 1029);
    			attr_dev(div1, "class", "block field");
    			add_location(div1, file$3, 31, 20, 902);
    			attr_dev(label1, "class", "label");
    			attr_dev(label1, "for", "password");
    			add_location(label1, file$3, 46, 24, 1547);
    			attr_dev(input1, "class", "input");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "Type password...");
    			add_location(input1, file$3, 48, 28, 1674);
    			attr_dev(div2, "class", "control");
    			add_location(div2, file$3, 47, 24, 1624);
    			attr_dev(div3, "class", "block field");
    			add_location(div3, file$3, 45, 20, 1497);
    			attr_dev(button, "class", button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[2]}`);
    			attr_dev(button, "type", "submit");
    			button.disabled = /*authenticating*/ ctx[3];
    			add_location(button, file$3, 59, 20, 2096);
    			add_location(form, file$3, 30, 16, 835);
    			attr_dev(div4, "class", "box is-rounded");
    			add_location(div4, file$3, 29, 12, 790);
    			attr_dev(div5, "class", "column is-narrow is-vcentered");
    			add_location(div5, file$3, 28, 8, 734);
    			attr_dev(div6, "class", "columns is-centered");
    			add_location(div6, file$3, 27, 4, 692);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file$3, 26, 0, 664);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, form);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(form, t2);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form, t5);
    			append_dev(form, button);
    			append_dev(button, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*authenticate*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			if (dirty & /*isLoadingClass*/ 4 && button_class_value !== (button_class_value = `button is-primary ${/*isLoadingClass*/ ctx[2]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $isAuthenticated;
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(7, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let username = "";
    	let password = "";
    	let authenticating = false;
    	let isLoadingClass = "";

    	const goToHomePage = () => {
    		navigate("/", { replace: true });
    	};

    	const authenticate = () => {
    		login(username, password).then(authenticated => {
    			if (authenticated) goToHomePage();
    		});
    	};

    	onMount(() => {
    		if ($isAuthenticated) goToHomePage();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		navigate,
    		isAuthenticated,
    		username,
    		password,
    		authenticating,
    		isLoadingClass,
    		login,
    		goToHomePage,
    		authenticate,
    		$isAuthenticated
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('authenticating' in $$props) $$invalidate(3, authenticating = $$props.authenticating);
    		if ('isLoadingClass' in $$props) $$invalidate(2, isLoadingClass = $$props.isLoadingClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	{
    		$$invalidate(2, isLoadingClass = authenticating ? "is-loading" : "");
    	}

    	return [
    		username,
    		password,
    		isLoadingClass,
    		authenticating,
    		authenticate,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\Secure.svelte generated by Svelte v3.48.0 */
    const file$2 = "src\\routes\\Secure.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$2, 7, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $isAuthenticated;
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(0, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Secure', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Secure> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		isAuthenticated,
    		navigate,
    		$isAuthenticated
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$isAuthenticated*/ 1) {
    			if (!$isAuthenticated) {
    				navigate("/login", { replace: true });
    			}
    		}
    	};

    	return [$isAuthenticated, $$scope, slots];
    }

    class Secure extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Secure",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\TopicsOfUserPage.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\routes\\TopicsOfUserPage.svelte";

    // (1:0) <script lang="ts">import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (17:8) {:then topics}
    function create_then_block(ctx) {
    	let topiclist;
    	let current;

    	topiclist = new TopicList({
    			props: { topics: /*topics*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topiclist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topiclist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topiclist_changes = {};
    			if (dirty & /*fetchingTopicsCreatedByUser*/ 2) topiclist_changes.topics = /*topics*/ ctx[2];
    			topiclist.$set(topiclist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topiclist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topiclist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topiclist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(17:8) {:then topics}",
    		ctx
    	});

    	return block;
    }

    // (15:44)              <LoadingSpinner />         {:then topics}
    function create_pending_block(ctx) {
    	let loadingspinner;
    	let current;
    	loadingspinner = new LoadingSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingspinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingspinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingspinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingspinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingspinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(15:44)              <LoadingSpinner />         {:then topics}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*fetchingTopicsCreatedByUser*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Topics created by ");
    			t1 = text(/*username*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			info.block.c();
    			attr_dev(div0, "class", "block");
    			add_location(div0, file$1, 12, 4, 410);
    			attr_dev(div1, "class", "block");
    			add_location(div1, file$1, 13, 4, 468);
    			attr_dev(div2, "class", "box");
    			add_location(div2, file$1, 11, 0, 388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			info.block.m(div1, info.anchor = null);
    			info.mount = () => div1;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*username*/ 1) set_data_dev(t1, /*username*/ ctx[0]);
    			info.ctx = ctx;

    			if (dirty & /*fetchingTopicsCreatedByUser*/ 2 && promise !== (promise = /*fetchingTopicsCreatedByUser*/ ctx[1]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TopicsOfUserPage', slots, []);
    	let { username } = $$props;
    	let fetchingTopicsCreatedByUser;

    	onMount(() => {
    		$$invalidate(1, fetchingTopicsCreatedByUser = fetchTopicsOf(username));
    	});

    	const writable_props = ['username'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TopicsOfUserPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		TopicList,
    		LoadingSpinner,
    		fetchTopicsOf,
    		username,
    		fetchingTopicsCreatedByUser
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('fetchingTopicsCreatedByUser' in $$props) $$invalidate(1, fetchingTopicsCreatedByUser = $$props.fetchingTopicsCreatedByUser);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [username, fetchingTopicsCreatedByUser];
    }

    class TopicsOfUserPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { username: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TopicsOfUserPage",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*username*/ ctx[0] === undefined && !('username' in props)) {
    			console.warn("<TopicsOfUserPage> was created without expected prop 'username'");
    		}
    	}

    	get username() {
    		throw new Error("<TopicsOfUserPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set username(value) {
    		throw new Error("<TopicsOfUserPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (14:2) {#if $isAuthenticated}
    function create_if_block(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let nav;
    	let ul;
    	let li0;
    	let link0;
    	let t0;
    	let li1;
    	let link1;
    	let t1;
    	let div1;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link({
    			props: {
    				to: "login",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Logout";
    			add_location(li0, file, 20, 9, 756);
    			add_location(li1, file, 21, 9, 804);
    			add_location(ul, file, 19, 8, 742);
    			attr_dev(nav, "class", "breadcrumb");
    			attr_dev(nav, "aria-label", "breadcrumbs");
    			add_location(nav, file, 18, 7, 684);
    			attr_dev(div0, "class", "level-left");
    			add_location(div0, file, 17, 6, 652);
    			attr_dev(button, "class", "button is-light is-outlined");
    			add_location(button, file, 26, 7, 918);
    			attr_dev(div1, "class", "level-right");
    			add_location(div1, file, 25, 6, 885);
    			attr_dev(div2, "class", "level");
    			add_location(div2, file, 16, 5, 626);
    			attr_dev(div3, "class", "hero-body");
    			add_location(div3, file, 15, 4, 597);
    			attr_dev(div4, "class", "hero box is-link is-small mx-0 py-0 is-rounded");
    			add_location(div4, file, 14, 3, 531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", logout, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(link0);
    			destroy_component(link1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(14:2) {#if $isAuthenticated}",
    		ctx
    	});

    	return block;
    }

    // (21:13) <Link to="login">
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Login");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(21:13) <Link to=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:13) <Link to="/">
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(22:13) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Secure>
    function create_default_slot_8(ctx) {
    	let newtopic;
    	let current;
    	newtopic = new NewTopic({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(newtopic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newtopic, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newtopic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newtopic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newtopic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(40:4) <Secure>",
    		ctx
    	});

    	return block;
    }

    // (39:3) <Route path="topics/create">
    function create_default_slot_7(ctx) {
    	let secure;
    	let current;

    	secure = new Secure({
    			props: {
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(secure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(secure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const secure_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				secure_changes.$$scope = { dirty, ctx };
    			}

    			secure.$set(secure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(secure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(secure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(secure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(39:3) <Route path=\\\"topics/create\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:4) <Secure>
    function create_default_slot_6(ctx) {
    	let topicdetailspage;
    	let current;

    	topicdetailspage = new TopicDetailsPage({
    			props: { topicId: /*params*/ ctx[1].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topicdetailspage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicdetailspage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topicdetailspage_changes = {};
    			if (dirty & /*params*/ 2) topicdetailspage_changes.topicId = /*params*/ ctx[1].id;
    			topicdetailspage.$set(topicdetailspage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicdetailspage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicdetailspage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicdetailspage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(45:4) <Secure>",
    		ctx
    	});

    	return block;
    }

    // (44:3) <Route path="topics/:id" let:params>
    function create_default_slot_5(ctx) {
    	let secure;
    	let current;

    	secure = new Secure({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(secure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(secure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const secure_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				secure_changes.$$scope = { dirty, ctx };
    			}

    			secure.$set(secure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(secure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(secure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(secure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(44:3) <Route path=\\\"topics/:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (50:4) <Secure>
    function create_default_slot_4(ctx) {
    	let topicsofuserpage;
    	let current;

    	topicsofuserpage = new TopicsOfUserPage({
    			props: { username: /*params*/ ctx[1].username },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topicsofuserpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topicsofuserpage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topicsofuserpage_changes = {};
    			if (dirty & /*params*/ 2) topicsofuserpage_changes.username = /*params*/ ctx[1].username;
    			topicsofuserpage.$set(topicsofuserpage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topicsofuserpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topicsofuserpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topicsofuserpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(50:4) <Secure>",
    		ctx
    	});

    	return block;
    }

    // (49:3) <Route path="user/:username" let:params>
    function create_default_slot_3(ctx) {
    	let secure;
    	let current;

    	secure = new Secure({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(secure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(secure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const secure_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				secure_changes.$$scope = { dirty, ctx };
    			}

    			secure.$set(secure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(secure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(secure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(secure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(49:3) <Route path=\\\"user/:username\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (55:4) <Secure>
    function create_default_slot_2(ctx) {
    	let homepage;
    	let current;
    	homepage = new HomePage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homepage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(homepage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homepage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homepage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homepage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(55:4) <Secure>",
    		ctx
    	});

    	return block;
    }

    // (54:3) <Route path="/">
    function create_default_slot_1(ctx) {
    	let secure;
    	let current;

    	secure = new Secure({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(secure.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(secure, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const secure_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				secure_changes.$$scope = { dirty, ctx };
    			}

    			secure.$set(secure_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(secure.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(secure.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(secure, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(54:3) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:1) <Router {url}>
    function create_default_slot(ctx) {
    	let t0;
    	let div;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let route2;
    	let t3;
    	let route3;
    	let t4;
    	let route4;
    	let current;
    	let if_block = /*$isAuthenticated*/ ctx[0] && create_if_block(ctx);

    	route0 = new Route({
    			props: { path: "login", component: Login },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "topics/create",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "topics/:id",
    				$$slots: {
    					default: [
    						create_default_slot_5,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "user/:username",
    				$$slots: {
    					default: [
    						create_default_slot_3,
    						({ params }) => ({ 1: params }),
    						({ params }) => params ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(route2.$$.fragment);
    			t3 = space();
    			create_component(route3.$$.fragment);
    			t4 = space();
    			create_component(route4.$$.fragment);
    			add_location(div, file, 36, 2, 1077);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t1);
    			mount_component(route1, div, null);
    			append_dev(div, t2);
    			mount_component(route2, div, null);
    			append_dev(div, t3);
    			mount_component(route3, div, null);
    			append_dev(div, t4);
    			mount_component(route4, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$isAuthenticated*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$isAuthenticated*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope, params*/ 6) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:1) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 11, 0, 480);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $isAuthenticated*/ 5) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const url = "";

    function instance($$self, $$props, $$invalidate) {
    	let $isAuthenticated;
    	validate_store(isAuthenticated, 'isAuthenticated');
    	component_subscribe($$self, isAuthenticated, $$value => $$invalidate(0, $isAuthenticated = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		HomePage,
    		TopicDetailsPage,
    		NewTopic,
    		Login,
    		Secure,
    		url,
    		isAuthenticated,
    		logout,
    		TopicsOfUserPage,
    		$isAuthenticated
    	});

    	return [$isAuthenticated];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
