import { setShims } from '../_shims/registry';
import { getRuntime } from '../_shims/node-runtime';

setShims(getRuntime());
