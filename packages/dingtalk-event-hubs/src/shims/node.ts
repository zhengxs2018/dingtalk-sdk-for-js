import { getRuntime } from '../_shims/node-runtime';
import { setShims } from '../_shims/registry';

setShims(getRuntime());
