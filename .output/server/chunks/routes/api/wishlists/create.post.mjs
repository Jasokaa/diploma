import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const create_post = defineEventHandler(async () => {
  return {
    success: false,
    message: "Wishlist creation is not implemented yet."
  };
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
