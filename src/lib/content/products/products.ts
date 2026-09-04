import { aicademy } from './aicademy';
import { cli } from './cli';
import { spch } from './spch';
import type { Product } from './product.types';

// The full list of products, display order. Not a barrel — this file's one
// job is "give me every product in order", not re-exporting for convenience.
export const products: Product[] = [aicademy, cli, spch];
