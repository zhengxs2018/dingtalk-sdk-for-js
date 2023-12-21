import { setShims } from '../_shims/registry';
import { getRuntime } from '../_shims/web-runtime';

setShims(getRuntime());
